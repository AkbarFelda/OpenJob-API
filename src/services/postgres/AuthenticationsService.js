const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  async addRefreshToken(token) {
    await query('INSERT INTO authentications VALUES($1)', [token]);
  }

  async verifyRefreshToken(token) {
    const result = await query('SELECT token FROM authentications WHERE token = $1', [token]);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    await query('DELETE FROM authentications WHERE token = $1', [token]);
  }
}

module.exports = AuthenticationsService;
