// controller/reviewController.js
const pool = require("../config/db"); // sesuaikan dengan file koneksi db kamu

const getReviewsByPost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE post_id = $1 ORDER BY created_at DESC", 
      [id]
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReview = async (req, res) => {
  const { post_id, nama_user, komentar, rating } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO reviews (post_id, nama_user, komentar, rating) VALUES ($1, $2, $3, $4) RETURNING *",
      [post_id, nama_user, komentar, rating]
    );
    res.status(201).json({ message: "Review berhasil dikirim!", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getReviewsByPost, addReview };