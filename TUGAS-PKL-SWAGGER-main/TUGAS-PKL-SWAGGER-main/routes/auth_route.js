const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

/**
 * @swagger
 * /api/auth/register:
 *   post:                     # <- ini bikin Swagger tampil “POST” di atas
 *     summary: Register user
 *     description: Membuat user baru dengan email dan password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:                     # <- POST di atas, bukan default
 *     summary: Login user
 *     description: Login dengan email dan password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login berhasil
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:                     # <- POST di atas
 *     summary: Refresh JWT token
 *     description: Membuat token baru dari token lama
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: oldToken123
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Token berhasil di-refresh
 */
router.post("/refresh-token", authController.refreshToken);

module.exports = router;    