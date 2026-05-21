const BookmarksService = require('../../services/postgres/BookmarksService');
const CacheService = require('../../services/redis/CacheService');

class BookmarksHandler {
  constructor() {
    this.service = new BookmarksService();
    this.cacheService = new CacheService();
  }

  async getBookmarksHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const cacheKey = `bookmarks:user:${userId}`;

      const cachedBookmarks = await this.cacheService.get(cacheKey);

      if (cachedBookmarks) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: {
            bookmarks: JSON.parse(cachedBookmarks),
          },
        });
      }

      const bookmarks = await this.service.getBookmarks(userId);
      await this.cacheService.set(cacheKey, JSON.stringify(bookmarks), 3600);

      res.setHeader('X-Data-Source', 'database');
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