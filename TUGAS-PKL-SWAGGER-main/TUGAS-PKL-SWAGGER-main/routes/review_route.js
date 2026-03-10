const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Pastikan path koneksi DB lo bener

// Ambil semua review buat 1 bunga tertentu
router.get('/:post_id', async (req, res) => {
    try {
        const { post_id } = req.params;
        const result = await pool.query(
            'SELECT * FROM reviews WHERE post_id = $1 ORDER BY created_at DESC', 
            [post_id]
        );
        res.json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Simpan review baru
router.post('/', async (req, res) => {
    try {
        const { post_id, nama_user, komentar, rating } = req.body;
        const result = await pool.query(
            'INSERT INTO reviews (post_id, nama_user, komentar, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [post_id, nama_user, komentar, rating]
        );
        res.status(201).json({ message: 'Review terkirim!', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;