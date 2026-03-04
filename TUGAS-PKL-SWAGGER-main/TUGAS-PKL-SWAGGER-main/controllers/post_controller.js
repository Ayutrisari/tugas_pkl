const pool = require('../config/db');
const { minioClient } = require('../config/minio_config');
const fs = require('fs');

/* ================= GET ALL POSTS (WITH CATEGORY NAME) ================= */
exports.getPosts = async (req, res) => {
    try {
        // Menggunakan LEFT JOIN agar postingan tetap muncul meskipun belum ada kategori
        const query = `
            SELECT posts.*, categories.nama_kategori 
            FROM posts 
            LEFT JOIN categories ON posts.category_id = categories.id 
            ORDER BY posts.id DESC
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (e) { 
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