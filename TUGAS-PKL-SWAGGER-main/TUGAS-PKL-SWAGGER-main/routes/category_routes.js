const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const { authenticateToken } = require('../middlewares/auth_middleware');

// 1. GET: Ambil semua daftar kategori (Akses: Public)
router.get('/', categoryController.getAll);

// 2. POST: Tambah kategori baru (Akses: Private)
router.post('/', authenticateToken, categoryController.create);

// 3. PUT: Update kategori berdasarkan ID (Akses: Private)
router.put('/:id', authenticateToken, categoryController.update);

// 4. DELETE: Hapus kategori berdasarkan ID (Akses: Private)
router.delete('/:id', authenticateToken, categoryController.remove);

module.exports = router;