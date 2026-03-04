const pool = require('../config/db');
const minioClient = require('../config/minio_config');
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
    if (!file) return res.status(400).send("File gambar wajib diupload!");
    try {
        const fileName = `${Date.now()}-${file.originalname}`;
        await minioClient.fPutObject('bunga-bucket', fileName, file.path);
        const url_gambar = `http://localhost:9000/bunga-bucket/${fileName}`;
        const result = await pool.query('INSERT INTO posts (judul, isi, url_gambar) VALUES ($1, $2, $3) RETURNING *', [judul, isi, url_gambar]);
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.status(201).json(result.rows[0]);
    } catch (e) { res.status(500).send(e.message); }
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