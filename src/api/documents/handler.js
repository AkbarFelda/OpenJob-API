const DocumentsService = require('../../services/postgres/DocumentsService');
const InvariantError = require('../../exceptions/InvariantError');

class DocumentsHandler {
  constructor() {
    this.service = new DocumentsService();
  }

  async postDocumentHandler(req, res, next) {
    try {
      if (!req.file) {
        throw new InvariantError('File document harus disertakan');
      }

      const { id: userId } = req.user;
      const { filename, path } = req.file;

      const documentId = await this.service.addDocument({
        user_id: userId,
        filename,
        path,
      });

      res.status(201).json({
        status: 'success',
        data: {
          id: documentId,
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
      const document = await this.service.getDocumentById(id);

      res.status(200).json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocumentHandler(req, res, next) {
    try {
      const { id } = req.params;
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
