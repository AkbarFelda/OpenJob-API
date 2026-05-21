const express = require('express');
const multer = require('multer');
const path = require('path');
const DocumentsHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');
const fs = require('fs');
const InvariantError = require('../../exceptions/InvariantError');

const uploadDir = path.join(__dirname, '../../../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    // Cari ekstensi file secara manual untuk mengantisipasi MIME type kosong dari Postman
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Validasi ganda: Berdasarkan MIME type ATAU ekstensi file wajib .pdf
    if (file.mimetype !== 'application/pdf' && ext !== '.pdf') {
      return cb(new InvariantError('File is required'));
    }
    cb(null, true);
  }
});

const router = express.Router();
const handler = new DocumentsHandler();

// Public endpoints
router.get('/', (req, res, next) => handler.getDocumentsHandler(req, res, next));
router.get('/:id', (req, res, next) => handler.getDocumentByIdHandler(req, res, next));

// Protected endpoints
router.post('/', verifyToken, (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new InvariantError('File size is too large. Max 5 MB'));
      }
      return next(new InvariantError(err.message));
    } else if (err) {
      return next(err);
    }
    handler.postDocumentHandler(req, res, next);
  });
});

// Solusi Express 5 untuk menangani rute dengan ID dan tanpa ID (trailing slash)
router.delete('/:id', verifyToken, (req, res, next) => handler.deleteDocumentHandler(req, res, next));
router.delete('/', verifyToken, (req, res, next) => handler.deleteDocumentHandler(req, res, next));

module.exports = router;