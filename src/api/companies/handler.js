const CompaniesService = require('../../services/postgres/CompaniesService');
const CacheService = require('../../services/redis/CacheService');
const CompaniesValidator = require('../../validator/companies');

class CompaniesHandler {
  constructor() {
    this.service = new CompaniesService();
    this.cacheService = new CacheService();
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
      const cacheKey = `companies:${id}`;

      // Coba ambil dari cache (Redis)
      const cachedCompany = await this.cacheService.get(cacheKey);

      if (cachedCompany) {
        // Cache Hit: Tambahkan custom header X-Data-Source
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: JSON.parse(cachedCompany),
        });
      }

      // Cache Miss: Ambil dari database PostgreSQL
      const company = await this.service.getCompanyById(id);
      
      // Simpan ke Redis selama 1 jam
      await this.cacheService.set(cacheKey, JSON.stringify(company), 3600);

      res.setHeader('X-Data-Source', 'database');
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

      // Cache Invalidation: Hapus cache karena data berubah
      await this.cacheService.delete(`companies:${id}`);

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

      // Cache Invalidation: Hapus cache karena data dihapus
      await this.cacheService.delete(`companies:${id}`);

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
