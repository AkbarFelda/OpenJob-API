const UsersService = require('../../services/postgres/UsersService');
const ApplicationsService = require('../../services/postgres/ApplicationsService');
const BookmarksService = require('../../services/postgres/BookmarksService');

class ProfileHandler {
  constructor() {
    this.usersService = new UsersService();
    this.applicationsService = new ApplicationsService();
    this.bookmarksService = new BookmarksService();
  }

  async getProfileHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const user = await this.usersService.getUserById(userId);

      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileApplicationsHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const applications = await this.applicationsService.getApplicationsByUserId(userId);

      res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileBookmarksHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const bookmarks = await this.bookmarksService.getBookmarks(userId);

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

module.exports = ProfileHandler;
