const { v4: uuidv4 } = require('uuid');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class DocumentsService {
  async addDocument({ user_id, filename, path }) {
    const id = `document-${uuidv4()}`;

    const result = await query(
      'INSERT INTO documents (id, user_id, filename, path) VALUES ($1, $2, $3, $4) RETURNING id',
      [id, user_id, filename, path]
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Document gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getDocuments() {
    const result = await query('SELECT * FROM documents');
    return result.rows;
  }

  async getDocumentById(id) {
    const result = await query('SELECT * FROM documents WHERE id = $1', [id]);
    if (!result.rows.length) {
      throw new NotFoundError('Document tidak ditemukan');
    }
    return result.rows[0];
  }

  async deleteDocument(id) {
    const result = await query('DELETE FROM documents WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Document gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = DocumentsService;
