const pool = require('../config/db');
const { minioClient } = require('../config/minio_config');
const fs = require('fs');

/* ================= 1. GET ALL POSTS (WITH PAGINATION & SEARCH) ================= */
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6; // Limit data per halaman
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        // Query dengan Join Kategori agar muncul nama kategorinya
        const query = `
            SELECT posts.*, COALESCE(categories.nama_kategori, 'Tanpa Kategori') as nama_kategori 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id 
            WHERE posts.judul ILIKE $1 
               OR posts.isi ILIKE $1 
               OR categories.nama_kategori ILIKE $1
            ORDER BY posts.id DESC
            LIMIT $2 OFFSET $3
        `;

        const values = [`%${search}%`, limit, offset];
        const result = await pool.query(query, values);

        // Menghitung total data untuk navigasi halaman (Pagination)
        const countQuery = `
            SELECT COUNT(*) FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id
            WHERE posts.judul ILIKE $1 
               OR posts.isi ILIKE $1
               OR categories.nama_kategori ILIKE $1
        `;
        const totalResult = await pool.query(countQuery, [`%${search}%`]);
        const totalData = parseInt(totalResult.rows[0].count);

        res.status(200).json({
            status: "success",
            data: result.rows,
            pagination: {
                totalData: totalData,
                totalPages: Math.ceil(totalData / limit),
                currentPage: page,
                limit: limit
            }
        });
    } catch (e) { 
        console.error("Error getPosts:", e);
        res.status(500).send(e.message); 
    }
};

/* ================= 2. GET SINGLE POST BY ID (INI YANG BIKIN LOADING) ================= */
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT posts.*, categories.nama_kategori 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id 
            WHERE posts.id = $1
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Data tidak ditemukan" });
        }

        // PENTING: Dibungkus dalam properti 'data' agar Frontend DetailPage bisa baca
        res.status(200).json({
            status: "success",
            data: result.rows[0]
        });
    } catch (e) { 
        res.status(500).send(e.message); 
    }
};

/* ================= 3. SAVE POST (DATABASE + MINIO) ================= */
exports.savePost = async (req, res) => {
    const { judul, isi, category_id } = req.body;
    const file = req.file;
    const bucketName = 'pkl-images';

    if (!file) return res.status(400).send("File gambar wajib diupload!");

    try {
        // Cek apakah bucket MinIO sudah ada
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            const policy = {
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`]
                }]
            };
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        }

        // Upload ke MinIO
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        await minioClient.fPutObject(bucketName, fileName, file.path);

        // Buat URL Gambar (Sesuaikan IP Server kamu)
        const url_gambar = `http://192.168.18.66:9000/${bucketName}/${fileName}`;

        const query = `
            INSERT INTO posts (judul, isi, url_gambar, category_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const result = await pool.query(query, [judul, isi, url_gambar, category_id || null]);

        // Hapus file sementara di folder uploads
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

        res.status(201).json({
            status: "success",
            data: result.rows[0]
        });
    } catch (e) {
        console.error("Gagal Simpan:", e);
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.status(500).send(e.message);
    }
};

/* ================= 4. UPDATE POST ================= */
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { judul, isi, category_id } = req.body;
    const file = req.file;
    const bucketName = 'pkl-images';

    try {
        let url_gambar = req.body.url_gambar; 

        if (file) {
            const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            await minioClient.fPutObject(bucketName, fileName, file.path);
            url_gambar = `http://192.168.18.66:9000/${bucketName}/${fileName}`;
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }

        const query = `
            UPDATE posts 
            SET judul=$1, isi=$2, category_id=$3, url_gambar=$4
            WHERE id=$5 
            RETURNING *
        `;
        const result = await pool.query(query, [judul, isi, category_id || null, url_gambar, id]);
        
        if (result.rows.length === 0) return res.status(404).send("Data tidak ditemukan");
        
        res.status(200).json({
            status: "success",
            data: result.rows[0]
        });
    } catch (e) { 
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        console.error("Error updatePost:", e);
        res.status(500).send(e.message); 
    }
};

/* ================= 5. DELETE POST ================= */
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id=$1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).send("Data tidak ditemukan");
        
        res.status(200).json({
            status: "success",
            message: "Berhasil dihapus dari Database!"
        });
    } catch (e) { 
        res.status(500).send(e.message); 
    }
};