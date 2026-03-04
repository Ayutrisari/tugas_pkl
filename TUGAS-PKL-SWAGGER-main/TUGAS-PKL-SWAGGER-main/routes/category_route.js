const express = require("express");
const router = express.Router();
const category = require("../controllers/category_controller");
const verifyToken = require("../middlewares/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API untuk mengelola category
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Ambil semua category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data
 */
router.get("/", verifyToken, category.getAll);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tambah category baru
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category berhasil dibuat
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
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category berhasil dihapus
 */
router.delete("/:id", verifyToken, category.delete);

module.exports = router;