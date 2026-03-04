const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');
const upload = require('../middlewares/upload'); // Sesuai nama folder 'middlewares' kamu


router.get('/', postController.getPosts);
router.post('/', upload.single('url_gambar'), postController.savePost);


router.get('/:id', postController.getPostById);
router.put('/:id', upload.single('url_gambar'), postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;