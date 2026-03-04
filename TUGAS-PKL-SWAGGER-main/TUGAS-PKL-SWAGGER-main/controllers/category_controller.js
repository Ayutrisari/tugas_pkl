const pool = require("../config/db");

exports.getAll = async (req, res) => {
  const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
  res.json(result.rows);
};

exports.create = async (req, res) => {
  const { nama } = req.body;

  const result = await pool.query(
    "INSERT INTO categories (nama) VALUES ($1) RETURNING *",
    [nama]
  );

  res.status(201).json(result.rows[0]);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nama } = req.body;

  await pool.query(
    "UPDATE categories SET nama=$1 WHERE id=$2",
    [nama, id]
  );

  res.json({ message: "Category berhasil diupdate" });
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM categories WHERE id=$1",
    [id]
  );

  res.json({ message: "Category berhasil dihapus" });
};