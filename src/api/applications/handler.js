const ApplicationsService = require('../../services/postgres/ApplicationsService');
const ApplicationsValidator = require('../../validator/applications');

class ApplicationsHandler {
  constructor() {
    this.service = new ApplicationsService();
  }

  async postApplicationHandler(req, res, next) {
    try {
      ApplicationsValidator.validatePostApplicationPayload(req.body);
      // Depending on the test requirements, we might need to enforce that req.body.user_id matches logged-in user or just take it from body
      const applicationId = await this.service.addApplication(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          id: applicationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsHandler(req, res, next) {
    try {
      const applications = await this.service.getApplications();

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

  async getApplicationByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const application = await this.service.getApplicationById(id);

      res.status(200).json({
        status: 'success',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByUserIdHandler(req, res, next) {
    try {
      const { userId } = req.params;
      const applications = await this.service.getApplicationsByUserId(userId);

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

  async getApplicationsByJobIdHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const applications = await this.service.getApplicationsByJobId(jobId);

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

  async putApplicationHandler(req, res, next) {
    try {
      ApplicationsValidator.validatePutApplicationPayload(req.body);
      const { id } = req.params;
      const { status } = req.body;

      await this.service.updateApplicationStatus(id, status);

      res.status(200).json({
        status: 'success',
        message: 'Application berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteApplicationHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.deleteApplication(id);

      res.status(200).json({
        status: 'success',
        message: 'Application berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApplicationsHandler;
