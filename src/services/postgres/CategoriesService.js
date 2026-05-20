const { v4: uuidv4 } = require('uuid');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CategoriesService {
  async addCategory({ name }) {
    const id = `category-${uuidv4()}`;

    const result = await query(
      'INSERT INTO categories VALUES($1, $2) RETURNING id',
      [id, name]
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Category gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCategories() {
    const result = await query('SELECT * FROM categories');
    return result.rows;
  }

  async getCategoryById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (!result.rows.length) {
      throw new NotFoundError('Category tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateCategory(id, { name }) {
    const result = await query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id',
      [name, id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui category. Id tidak ditemukan');
    }
  }

  async deleteCategory(id) {
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Category gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = CategoriesService;
