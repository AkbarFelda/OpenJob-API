const CompaniesService = require('../../services/postgres/CompaniesService');
const CompaniesValidator = require('../../validator/companies');

class CompaniesHandler {
  constructor() {
    this.service = new CompaniesService();
  }

  async postCompanyHandler(req, res, next) {
    try {
      CompaniesValidator.validateCompanyPayload(req.body);
      const companyId = await this.service.addCompany(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          id: companyId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompaniesHandler(req, res, next) {
    try {
      const companies = await this.service.getCompanies();

      res.status(200).json({
        status: 'success',
        data: {
          companies,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const company = await this.service.getCompanyById(id);

      res.status(200).json({
        status: 'success',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async putCompanyHandler(req, res, next) {
    try {
      CompaniesValidator.validateCompanyPayload(req.body);
      const { id } = req.params;

      await this.service.updateCompany(id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Company berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompanyHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.deleteCompany(id);

      res.status(200).json({
        status: 'success',
        message: 'Company berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompaniesHandler;
