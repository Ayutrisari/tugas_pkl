const pool = require("../config/db");

exports.getAll = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    // Sesuaikan req.body dengan nama_kategori
    const { nama_kategori } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO categories (nama_kategori) VALUES ($1) RETURNING *",
            [nama_kategori]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Gagal tambah kategori kimbek!" });
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
        // Biasanya eror karena kategori masih dipakai di tabel post_bunga
        res.status(400).json({ error: "Kategori masih digunakan!" });
    }
};