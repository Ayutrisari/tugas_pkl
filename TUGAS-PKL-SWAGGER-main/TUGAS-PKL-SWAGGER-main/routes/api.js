const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/posts', postController.getAll);
router.post('/posts', upload.single('gambar'), postController.create);
router.put('/posts/:id', upload.single('gambar'), postController.update); // Route untuk Update
router.delete('/posts/:id', postController.delete);

module.exports = router;