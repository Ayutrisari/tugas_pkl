const pool = require('../config/db');
const { minioClient } = require('../config/minio_config');
const fs = require('fs');

/* ================= GET ALL POSTS (WITH CATEGORY NAME) ================= */
/* ================= GET ALL POSTS (WITH PAGINATION & SEARCH) ================= */
exports.getPosts = async (req, res) => {
    try {
        // 1. Ambil data dari query params (default: page 1, limit 6)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || '';
        
        // 2. Hitung offset (titik mulai data yang diambil)
        const offset = (page - 1) * limit;

        // 3. Query dengan Search dan Pagination
        // %${search}% digunakan agar pencarian fleksibel (bisa di depan, tengah, atau belakang)
        const query = `
            SELECT posts.*, categories.nama_kategori 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id 
            WHERE posts.judul ILIKE $1 OR categories.nama_kategori ILIKE $1
            ORDER BY posts.id DESC
            LIMIT $2 OFFSET $3
        `;

        const values = [`%${search}%`, limit, offset];
        const result = await pool.query(query, values);

        // 4. (Opsional) Hitung total data untuk info di frontend
        const countQuery = `
            SELECT COUNT(*) FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id
            WHERE posts.judul ILIKE $1 OR categories.nama_kategori ILIKE $1
        `;
        const totalResult = await pool.query(countQuery, [`%${search}%`]);
        const totalData = parseInt(totalResult.rows[0].count);

        // 5. Kirim response yang lengkap
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
        console.error(e);
        res.status(500).send(e.message); 
    }
};

/* ================= GET SINGLE POST BY ID ================= */
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).send("Data tidak ditemukan");
        res.status(200).json(result.rows[0]);
    } catch (e) { 
        res.status(500).send(e.message); 
    }
};

/* ================= SAVE POST (DATABASE + MINIO) ================= */
exports.savePost = async (req, res) => {
    // 1. Ambil category_id dari body (Frontend harus mengirim ini)
    const { judul, isi, category_id } = req.body;
    const file = req.file;
    const bucketName = 'pkl-images';

    if (!file) return res.status(400).send("File gambar wajib diupload!");

    try {
        // 2. Pastikan Bucket MinIO Siap
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

        // 3. Upload File ke MinIO
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        await minioClient.fPutObject(bucketName, fileName, file.path);

        // 4. Buat URL Gambar Publik
        const url_gambar = `http://192.168.18.66:9000/${bucketName}/${fileName}`;

        // 5. Simpan ke Database (Termasuk category_id)
        const query = `
            INSERT INTO posts (judul, isi, url_gambar, category_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const result = await pool.query(query, [judul, isi, url_gambar, category_id || null]);

        // 6. Bersihkan file temporary di server local
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        res.status(201).json(result.rows[0]);

    } catch (e) {
        console.error("Gagal Simpan:", e);
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.status(500).send(e.message);
    }
};

/* ================= UPDATE POST ================= */
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { judul, isi, category_id } = req.body;
    try {
        const query = `
            UPDATE posts 
            SET judul=$1, isi=$2, category_id=$3 
            WHERE id=$4 
            RETURNING *
        `;
        const result = await pool.query(query, [judul, isi, category_id, id]);
        res.status(200).json(result.rows[0]);
    } catch (e) { 
        res.status(500).send(e.message); 
    }
};

/* ================= DELETE POST ================= */
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        // Opsional: Kamu bisa tambahkan logika hapus file di MinIO di sini sebelum hapus DB
        await pool.query('DELETE FROM posts WHERE id=$1', [id]);
        res.status(200).send("Berhasil dihapus dari Database!");
    } catch (e) { 
        res.status(500).send(e.message); 
    }
};