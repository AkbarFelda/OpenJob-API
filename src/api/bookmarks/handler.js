const BookmarksService = require('../../services/postgres/BookmarksService');

class BookmarksHandler {
  constructor() {
    this.service = new BookmarksService();
  }

  async getBookmarksHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const bookmarks = await this.service.getBookmarks(userId);

      res.status(200).json({
        status: 'success',
        data: {
          bookmarks,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookmarksHandler;
