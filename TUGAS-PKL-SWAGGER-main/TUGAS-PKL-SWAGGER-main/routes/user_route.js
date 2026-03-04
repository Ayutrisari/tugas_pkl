const express = require("express");
const router = express.Router();
const users = [];
let idCounter = 1;

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tambah user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 */
router.post("/", (req, res) => {
  const user = { id: idCounter++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Ambil semua user
 *     responses:
 *       200:
 *         description: Daftar user
 */
router.get("/", (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Ambil user berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User ditemukan
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user berdasarkan ID
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
 *             type: object
 *     responses:
 *       200:
 *         description: User berhasil diupdate
 *       404:
 *         description: User tidak ditemukan
 */
router.put("/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
  Object.assign(user, req.body);
  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Hapus user berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *       404:
 *         description: User tidak ditemukan
 */
router.delete("/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User tidak ditemukan" });
  const deleted = users.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;