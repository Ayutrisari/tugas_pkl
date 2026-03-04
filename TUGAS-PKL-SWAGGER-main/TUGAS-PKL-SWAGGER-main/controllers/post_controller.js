const pool = require('../config/db');
// const minioClient = require('../config/minio_config');
// Menjadi ini:
const { minioClient } = require('../config/minio_config');
const fs = require('fs');

exports.getPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (e) { res.status(500).send(e.message); }
};

// TAMBAHKAN FUNGSI INI (PENTING!)
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).send("Data tidak ditemukan");
        res.status(200).json(result.rows[0]);
    } catch (e) { res.status(500).send(e.message); }
};

exports.savePost = async (req, res) => {
    const { judul, isi } = req.body;
    const file = req.file;
    const bucketName = 'pkl-images';

    if (!file) return res.status(400).send("File gambar wajib diupload!");

    try {
        // 1. Pastikan Bucket Ada & Set Public Policy (Jika belum ada)
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            
            // Set Policy agar file bisa diakses publik via URL
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

        // 2. Siapkan nama file unik
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

        // 3. Upload ke Minio
        // Gunakan fPutObject untuk upload file dari path temporary multer
        await minioClient.fPutObject(bucketName, fileName, file.path);

        // 4. Buat URL Gambar (Gunakan IP Laptop kamu agar bisa diakses device lain)
        const url_gambar = `http://192.168.18.66:9000/${bucketName}/${fileName}`;

        // 5. Simpan ke Database
        const result = await pool.query(
            'INSERT INTO posts (judul, isi, url_gambar) VALUES ($1, $2, $3) RETURNING *', 
            [judul, isi, url_gambar]
        );

        // 6. Hapus file sementara di folder 'uploads/' agar tidak memenuhi storage lokal
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        res.status(201).json(result.rows[0]);

    } catch (e) {
        console.error("Minio Error:", e);
        // Hapus file temp jika terjadi error saat upload ke Minio
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.status(500).send(e.message);
    }
};

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    try {
        const result = await pool.query('UPDATE posts SET judul=$1, isi=$2 WHERE id=$3 RETURNING *', [judul, isi, id]);
        res.status(200).json(result.rows[0]);
    } catch (e) { res.status(500).send(e.message); }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM posts WHERE id=$1', [id]);
        res.status(200).send("Berhasil dihapus!");
    } catch (e) { res.status(500).send(e.message); }
};