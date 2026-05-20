const { v4: uuidv4 } = require('uuid');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CompaniesService {
  async addCompany({ name, location, description }) {
    const id = `company-${uuidv4()}`;

    const result = await query(
      'INSERT INTO companies VALUES($1, $2, $3, $4) RETURNING id',
      [id, name, location, description]
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Company gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getCompanies() {
    const result = await query('SELECT * FROM companies');
    return result.rows;
  }

  async getCompanyById(id) {
    const result = await query('SELECT * FROM companies WHERE id = $1', [id]);
    if (!result.rows.length) {
      throw new NotFoundError('Company tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateCompany(id, { name, location, description }) {
    const result = await query(
      'UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING id',
      [name, location, description, id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui company. Id tidak ditemukan');
    }
  }

  async deleteCompany(id) {
    const result = await query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Company gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = CompaniesService;
