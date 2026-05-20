const express = require('express');
const multer = require('multer');
const path = require('path');
const DocumentsHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');
const fs = require('fs');

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

const upload = multer({ storage });

const router = express.Router();
const handler = new DocumentsHandler();

// Public endpoints
router.get('/', (req, res, next) => handler.getDocumentsHandler(req, res, next));
router.get('/:id', (req, res, next) => handler.getDocumentByIdHandler(req, res, next));

// Protected endpoints
router.post('/', verifyToken, upload.single('document'), (req, res, next) => handler.postDocumentHandler(req, res, next));
router.delete('/:id', verifyToken, (req, res, next) => handler.deleteDocumentHandler(req, res, next));

module.exports = router;
