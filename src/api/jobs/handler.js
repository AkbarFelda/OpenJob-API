const JobsService = require('../../services/postgres/JobsService');
const BookmarksService = require('../../services/postgres/BookmarksService');
const JobsValidator = require('../../validator/jobs');

class JobsHandler {
  constructor() {
    this.jobsService = new JobsService();
    this.bookmarksService = new BookmarksService();
  }

  async postJobHandler(req, res, next) {
    try {
      JobsValidator.validatePostJobPayload(req.body);
      const jobId = await this.jobsService.addJob(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          id: jobId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsHandler(req, res, next) {
    try {
      const title = req.query.title || '';
      const companyName = req.query['company-name'] || '';

      const jobs = await this.jobsService.getJobs(title, companyName);

      res.status(200).json({
        status: 'success',
        data: {
          jobs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const job = await this.jobsService.getJobById(id);

      res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCompanyIdHandler(req, res, next) {
    try {
      const { companyId } = req.params;
      const jobs = await this.jobsService.getJobsByCompanyId(companyId);

      res.status(200).json({
        status: 'success',
        data: {
          jobs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCategoryIdHandler(req, res, next) {
    try {
      const { categoryId } = req.params;
      const jobs = await this.jobsService.getJobsByCategoryId(categoryId);

      res.status(200).json({
        status: 'success',
        data: {
          jobs,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putJobHandler(req, res, next) {
    try {
      JobsValidator.validatePutJobPayload(req.body);
      const { id } = req.params;

      await this.jobsService.updateJob(id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Job berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteJobHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this.jobsService.deleteJob(id);

      res.status(200).json({
        status: 'success',
        message: 'Job berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  // Bookmark handlers
  async postBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const { id: userId } = req.user;

      const bookmarkId = await this.bookmarksService.addBookmark(userId, jobId);

      res.status(201).json({
        status: 'success',
        data: {
          id: bookmarkId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarkByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const bookmark = await this.bookmarksService.getBookmarkById(id);

      res.status(200).json({
        status: 'success',
        data: bookmark,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const { id: userId } = req.user;

      await this.bookmarksService.deleteBookmarkByJobAndUser(jobId, userId);

      res.status(200).json({
        status: 'success',
        message: 'Bookmark berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JobsHandler;
