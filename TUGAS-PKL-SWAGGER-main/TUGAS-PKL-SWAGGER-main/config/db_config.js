const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pertama',  // Sesuai gambar pgAdmin kamu
  password: 'admin123', // Password kamu
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error('❌ KONEKSI DB GAGAL:', err.message);
  } else {
    console.log('✅ KONEKSI DATABASE [pertama] SUKSES!');
  }
});

module.exports = pool;