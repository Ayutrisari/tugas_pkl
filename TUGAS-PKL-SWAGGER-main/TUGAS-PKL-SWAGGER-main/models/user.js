const pool = require('../config/db');

const userModel = {
    // Fungsi untuk register
    register: (username, email, password, role) => {
        return pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [username, email, password, role]
        );
    },
    // Fungsi untuk cari email saat login
    getByEmail: (email) => {
        return pool.query("SELECT * FROM users WHERE email = $1", [email]);
    }
};

module.exports = userModel;