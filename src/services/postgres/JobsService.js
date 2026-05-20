const { v4: uuidv4 } = require('uuid');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class JobsService {
  async addJob(payload) {
    const id = `job-${uuidv4()}`;
    const {
      company_id, category_id, title, description, job_type,
      experience_level, location_type, location_city, salary_min,
      salary_max, is_salary_visible, status,
    } = payload;

    const result = await query(
      `INSERT INTO jobs (id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [id, company_id, category_id, title, description, job_type, experience_level, location_type, location_city, salary_min, salary_max, is_salary_visible, status]
    );

    if (!result.rows[0].id) {
      throw new InvariantError('Job gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getJobs(title = '', companyName = '') {
    let sql = `
      SELECT jobs.*, companies.name as company_name 
      FROM jobs 
      LEFT JOIN companies ON companies.id = jobs.company_id
      WHERE 1=1
    `;
    const values = [];
    let queryIndex = 1;

    if (title) {
      sql += ` AND jobs.title ILIKE $${queryIndex}`;
      values.push(`%${title}%`);
      queryIndex++;
    }

    if (companyName) {
      sql += ` AND companies.name ILIKE $${queryIndex}`;
      values.push(`%${companyName}%`);
      queryIndex++;
    }

    const result = await query(sql, values);
    return result.rows;
  }

  async getJobById(id) {
    const result = await query(`
      SELECT jobs.*, companies.name as company_name 
      FROM jobs 
      LEFT JOIN companies ON companies.id = jobs.company_id 
      WHERE jobs.id = $1
    `, [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    return result.rows[0];
  }

  async getJobsByCompanyId(companyId) {
    const result = await query(`
      SELECT jobs.*, companies.name as company_name 
      FROM jobs 
      LEFT JOIN companies ON companies.id = jobs.company_id 
      WHERE jobs.company_id = $1
    `, [companyId]);
    return result.rows;
  }

  async getJobsByCategoryId(categoryId) {
    const result = await query(`
      SELECT jobs.*, companies.name as company_name 
      FROM jobs 
      LEFT JOIN companies ON companies.id = jobs.company_id 
      WHERE jobs.category_id = $1
    `, [categoryId]);
    return result.rows;
  }

  async updateJob(id, payload) {
    const {
      company_id, category_id, title, description, job_type,
      experience_level, location_type, location_city, salary_min,
      salary_max, is_salary_visible, status,
    } = payload;

    // Use coalesce to update only provided fields or we can build dynamic query.
    // The requirement often expects just the fields provided to be updated.
    let sql = 'UPDATE jobs SET ';
    const values = [];
    let queryIndex = 1;
    const updates = [];

    const addUpdate = (column, value) => {
      if (value !== undefined) {
        updates.push(`${column} = $${queryIndex}`);
        values.push(value);
        queryIndex++;
      }
    };

    addUpdate('company_id', company_id);
    addUpdate('category_id', category_id);
    addUpdate('title', title);
    addUpdate('description', description);
    addUpdate('job_type', job_type);
    addUpdate('experience_level', experience_level);
    addUpdate('location_type', location_type);
    addUpdate('location_city', location_city);
    addUpdate('salary_min', salary_min);
    addUpdate('salary_max', salary_max);
    addUpdate('is_salary_visible', is_salary_visible);
    addUpdate('status', status);

    if (updates.length === 0) {
      return; // Nothing to update
    }

    sql += updates.join(', ') + ` WHERE id = $${queryIndex} RETURNING id`;
    values.push(id);

    const result = await query(sql, values);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui job. Id tidak ditemukan');
    }
  }

  async deleteJob(id) {
    const result = await query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Job gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = JobsService;
