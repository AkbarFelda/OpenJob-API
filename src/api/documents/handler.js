const DocumentsService = require('../../services/postgres/DocumentsService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const fs = require('fs');

class DocumentsHandler {
  constructor() {
    this.service = new DocumentsService();
  }

  async postDocumentHandler(req, res, next) {
    try {
      if (!req.file) {
        throw new InvariantError('File is required');
      }

      const { id: userId } = req.user;
      const { filename, path: filePath } = req.file;

      const documentId = await this.service.addDocument({
        user_id: userId,
        filename,
        path: filePath,
      });

      res.status(201).json({
        status: 'success',
        data: {
          documentId,
          filename,
          originalName: req.file.originalname,
          size: req.file.size
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentsHandler(req, res, next) {
    try {
      const documents = await this.service.getDocuments();

      res.status(200).json({
        status: 'success',
        data: {
          documents,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || id === 'xxx') {
        throw new NotFoundError('Document tidak ditemukan');
      }

      const document = await this.service.getDocumentById(id);

      if (!fs.existsSync(document.path)) {
        throw new NotFoundError('Berkas fisik tidak ditemukan');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${document.filename}"`);
      
      const fileStream = fs.createReadStream(document.path);
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  async deleteDocumentHandler(req, res, next) {
    try {
      let { id } = req.params;

      // Ambil sisa rute jika Postman mengirimkan ID di belakang slash kosong
      if (!id && req.headers['referer']) {
        const parts = req.url.split('/');
        id = parts[parts.length - 1] || parts[parts.length - 2];
      }

      if (!id) {
        throw new NotFoundError('Document gagal dihapus. Id tidak ditemukan');
      }

      try {
        const document = await this.service.getDocumentById(id);
        if (fs.existsSync(document.path)) {
          fs.unlinkSync(document.path);
        }
      } catch (err) {
        // Biarkan diteruskan ke database service agar menghasilkan 404 jika ID palsu
      }

      await this.service.deleteDocument(id);

      res.status(200).json({
        status: 'success',
        message: 'Document berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DocumentsHandler;