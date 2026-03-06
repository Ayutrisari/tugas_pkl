const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // Bersihkan email sebelum simpan ke DB
    const cleanEmail = email.trim().toLowerCase(); 
    const hash = await bcrypt.hash(password, 10);
    
    await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)", 
      [cleanEmail, hash, role || 'user']
    );
    
    res.json({ message: "Register berhasil 🌸" });
  } catch (error) {
    res.status(500).json({ message: "Gagal register", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // PENTING: Bersihkan input dari spasi tak terlihat kimbek!
    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [cleanEmail]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan kimbek! 🔍" });
    }

    const user = result.rows[0];
    
    // Bandingkan password input dengan hash di database
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Password salah!" });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: "15m" }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: "7d" }
    );

    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [refreshToken, user.id]);

    res.json({ 
      accessToken, 
      refreshToken, 
      role: user.role, 
      email: user.email 
    });
  } catch (error) {
    res.status(500).json({ message: "Database Error", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);
    const result = await pool.query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken]);
    if (result.rows.length === 0) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      
      const accessToken = jwt.sign(
        { id: decoded.id, role: result.rows[0].role }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};