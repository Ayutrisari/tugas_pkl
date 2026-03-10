const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.register(username, email.trim().toLowerCase(), hashedPassword, role || 'user');
        res.status(201).json({ status: "success", message: "User berhasil didaftarkan! 🌸" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await userModel.getByEmail(email.trim().toLowerCase());
        if (result.rowCount === 0) return res.status(404).json({ message: "User tidak ditemukan" });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Password salah!" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123', 
            { expiresIn: '1d' }
        );

        res.json({
            status: "success",
            message: "Login berhasil! 🚀",
            token: token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// TAMBAHKAN INI AGAR TIDAK ERROR "UNDEFINED" LAGI
exports.refreshToken = async (req, res) => {
    res.json({ message: "Fitur refresh token belum diaktifkan, tapi server sudah aman sekarang!" });
};