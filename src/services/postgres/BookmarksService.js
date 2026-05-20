const { v4: uuidv4 } = require('uuid');
const { query } = require('../../config/database');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class BookmarksService {
  async addBookmark(user_id, job_id) {
    const id = `bookmark-${uuidv4()}`;

    try {
      const result = await query(
        'INSERT INTO bookmarks (id, user_id, job_id) VALUES ($1, $2, $3) RETURNING id',
        [id, user_id, job_id]
      );
      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23505') { // unique violation
        throw new InvariantError('Bookmark sudah ada');
      }
      throw error;
    }
  }

  async getBookmarks(user_id) {
    const result = await query('SELECT * FROM bookmarks WHERE user_id = $1', [user_id]);
    return result.rows;
  }

  async getBookmarkById(id) {
    const result = await query('SELECT * FROM bookmarks WHERE id = $1', [id]);
    if (!result.rows.length) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
    return result.rows[0];
  }

  async deleteBookmarkByJobAndUser(job_id, user_id) {
    const result = await query(
      'DELETE FROM bookmarks WHERE job_id = $1 AND user_id = $2 RETURNING id',
      [job_id, user_id]
    );

    if (!result.rows.length) {
      throw new NotFoundError('Bookmark gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = BookmarksService;
