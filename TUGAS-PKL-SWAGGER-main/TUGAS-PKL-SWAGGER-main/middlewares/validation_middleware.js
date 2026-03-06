const { body, validationResult } = require("express-validator");

exports.validateCategory = [
  body("nama_kategori") 
    .notEmpty().withMessage("Nama category wajib diisi")
    .isLength({ min: 3 }).withMessage("Minimal 3 karakter"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
exports.validatePost = [
  body("judul").notEmpty().withMessage("Judul wajib diisi"),
  body("isi").notEmpty().withMessage("Isi wajib diisi"),
  body("category_id")
    .notEmpty().withMessage("Category wajib dipilih")
    .isInt().withMessage("Category harus berupa angka"),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } 
];