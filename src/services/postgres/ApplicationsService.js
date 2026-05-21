const { v4: uuidv4 } = require('uuid');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ApplicationsService {
  async addApplication({ user_id, job_id, status = 'pending' }) {
    const id = `application-${uuidv4()}`;

    const result = await query(
      'INSERT INTO applications (id, user_id, job_id, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [id, user_id, job_id, status]
    );

    if (!result.rows[0].id) {
      const InvariantError = require('../../exceptions/InvariantError');
      throw new InvariantError('Application gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getApplications() {
    const result = await query('SELECT * FROM applications');
    return result.rows;
  }

  async getApplicationById(id) {
    const result = await query('SELECT * FROM applications WHERE id = $1', [id]);
    if (!result.rows.length) {
      throw new NotFoundError('Application tidak ditemukan');
    }
    return result.rows[0];
  }

  async getApplicationsByUserId(userId) {
    const result = await query('SELECT * FROM applications WHERE user_id = $1', [userId]);
    return result.rows;
  }

  async getApplicationsByJobId(jobId) {
    const result = await query('SELECT * FROM applications WHERE job_id = $1', [jobId]);
    return result.rows;
  }

  async updateApplicationStatus(id, status) {
    const result = await query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING id',
      [status, id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui application. Id tidak ditemukan');
    }
  }

  async deleteApplication(id) {
    const result = await query('DELETE FROM applications WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Application gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = ApplicationsService;
