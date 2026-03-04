const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const upload = require('../middlewares/upload'); // Sesuai nama folder 'middlewares' kamu

/**
 * @swagger
 * /api/posts:
 * get:
 * summary: Ambil semua post
 * tags: [Posts]
 * responses:
 * 200:
 * description: Berhasil mengambil semua data postingan
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id: 
 * type: integer
 * judul: 
 * type: string
 * isi: 
 * type: string
 * url_gambar: 
 * type: string
 * post:
 * summary: Tambah post baru (Wajib Login)
 * tags: [Posts]
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * judul:
 * type: string
 * example: Bunga Matahari
 * isi:
 * type: string
 * example: Deskripsi lengkap bunga matahari yang cerah.
 * url_gambar:
 * type: string
 * format: binary
 * responses:
 * 201:
 * description: Postingan berhasil dibuat
 * 400:
 * description: File gambar tidak ditemukan
 */
router.get('/', postController.getPosts);
router.post('/', upload.single('url_gambar'), postController.savePost);

/**
 * @swagger
 * /api/posts/{id}:
 * get:
 * summary: Ambil post berdasarkan ID
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID dari postingan yang ingin dicari
 * responses:
 * 200:
 * description: Data postingan ditemukan
 * 404:
 * description: Postingan tidak ditemukan
 * put:
 * summary: Update post berdasarkan ID (Wajib Login)
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * judul:
 * type: string
 * isi:
 * type: string
 * url_gambar:
 * type: string
 * format: binary
 * responses:
 * 200:
 * description: Update berhasil
 * delete:
 * summary: Hapus post berdasarkan ID (Wajib Login)
 * tags: [Posts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Berhasil dihapus dari database
 */
router.get('/:id', postController.getPostById);
router.put('/:id', upload.single('url_gambar'), postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;