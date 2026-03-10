const express = require("express");
const router = express.Router();

const category = require("../controllers/category_controller");
const verifyToken = require("../middlewares/auth_middleware");

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Ambil semua category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data category
 */
 // verifyToken dilepas supaya frontend bisa ambil data untuk dropdown tanpa login
router.get("/", category.getCategories);


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tambah category baru
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category berhasil ditambahkan
 */
router.post("/", verifyToken, category.create);


/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID category
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category berhasil diupdate
 */
router.put("/:id", verifyToken, category.update);


/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Hapus category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID category
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category berhasil dihapus
 */
router.delete("/:id", verifyToken, category.delete);

module.exports = router;