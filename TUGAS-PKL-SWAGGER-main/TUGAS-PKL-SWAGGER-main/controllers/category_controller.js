const pool = require('../config/db');

// Menggunakan getCategories sebagai fungsi utama untuk mengambil semua data
exports.getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nama_kategori FROM categories ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (e) {
        console.error("Error getCategories:", e);
        res.status(500).send(e.message);
    }
};

exports.create = async (req, res) => {
    const { nama_kategori } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO categories (nama_kategori) VALUES ($1) RETURNING *",
            [nama_kategori]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Gagal tambah kategori!" });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { nama_kategori } = req.body;
    try {
        await pool.query(
            "UPDATE categories SET nama_kategori=$1 WHERE id=$2",
            [nama_kategori, id]
        );
        res.json({ message: "Category berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ error: "Gagal update!" });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM categories WHERE id=$1", [id]);
        res.json({ message: "Category berhasil dihapus" });
    } catch (err) {
        res.status(400).json({ error: "Kategori masih digunakan!" });
    }
};