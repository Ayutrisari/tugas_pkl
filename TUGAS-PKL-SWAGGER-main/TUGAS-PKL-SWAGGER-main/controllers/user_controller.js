const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Tambahkan ini

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userModel.register(username, email, hashedPassword);
        res.status(201).json({
            status: "success",
            message: "User berhasil didaftarkan!",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await userModel.getByEmail(email);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        // Membuat Token agar Frontend bisa mengakses API lain
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_key_123', 
            { expiresIn: '1d' }
        );

        res.json({
            status: "success",
            message: "Login berhasil!",
            token: token, // Token ini wajib dikirim
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};