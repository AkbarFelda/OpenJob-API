const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  async addUser({ name, email, password, role }) {
    await this.verifyNewEmail(email);

    const id = `user-${uuidv4()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      [id, name, email, hashedPassword, role]
    );

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyNewEmail(email) {
    const result = await query('SELECT email FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Email sudah digunakan.');
    }
  }

  async getUserById(id) {
    const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyUserCredential(email, password) {
    const result = await query('SELECT id, password FROM users WHERE email = $1', [email]);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;
