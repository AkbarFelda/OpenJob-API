const ApplicationsService = require('../../services/postgres/ApplicationsService');
const CacheService = require('../../services/redis/CacheService');
const ApplicationsValidator = require('../../validator/applications');
const ProducerService = require('../../services/rabbitmq/ProducerService');
const InvariantError = require('../../exceptions/InvariantError');

class ApplicationsHandler {
  constructor() {
    this.service = new ApplicationsService();
    this.cacheService = new CacheService();
  }

  async postApplicationHandler(req, res, next) {
    try {
      // 1. Validasi payload data yang masuk
      ApplicationsValidator.validatePostApplicationPayload(req.body);
      const { user_id: userId, job_id: jobId } = req.body;
      
      let applicationId;
      try {
        // 2. Masukkan data ke database PostgreSQL
        applicationId = await this.service.addApplication(req.body);
      } catch (error) {
        // CEK ERROR DATABASE: Jika error code '23505' (Unique Violation / Duplikat)
        if (error.code === '23505') {
          const InvariantError = require('../../exceptions/InvariantError');
          throw new InvariantError('Gagal melamar. Anda sudah mengirimkan lamaran untuk lowongan ini.');
        }
        
        // Jika error code '23503' (Foreign Key Violation / Data lowongan atau user tidak ada)
        if (error.code === '23503') {
          const InvariantError = require('../../exceptions/InvariantError');
          throw new InvariantError('Gagal melamar. Data user atau lowongan tidak ditemukan.');
        }
        
        throw error;
      }

      // 3. Kirim message ke RabbitMQ Broker secara Asynchronous
      try {
        await ProducerService.sendMessage(
          'submissions', 
          JSON.stringify({ applicationId })
        );
      } catch (mqError) {
        console.error('RabbitMQ Error:', mqError.message);
      }

      // 4. Invalidation Cache Redis (Kriteria 2)
      await this.cacheService.delete(`applications:user:${userId}`);
      await this.cacheService.delete(`applications:job:${jobId}`);

      // 5. Response Sukses (Hanya keluar jika data beneran baru dan sukses disimpan)
      res.status(201).json({
        status: 'success',
        data: {
          id: applicationId,
          user_id: userId,
          job_id: jobId,
          status: req.body.status || 'pending'
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
      const cacheKey = `applications:${id}`;

      const cachedApp = await this.cacheService.get(cacheKey);

      if (cachedApp) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: JSON.parse(cachedApp),
        });
      }

      const application = await this.service.getApplicationById(id);
      await this.cacheService.set(cacheKey, JSON.stringify(application), 3600);

      res.setHeader('X-Data-Source', 'database');
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
      const cacheKey = `applications:user:${userId}`;

      const cachedUserApps = await this.cacheService.get(cacheKey);

      if (cachedUserApps) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: {
            applications: JSON.parse(cachedUserApps),
          },
        });
      }

      const applications = await this.service.getApplicationsByUserId(userId);
      await this.cacheService.set(cacheKey, JSON.stringify(applications), 3600);

      res.setHeader('X-Data-Source', 'database');
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
      const cacheKey = `applications:job:${jobId}`;

      const cachedJobApps = await this.cacheService.get(cacheKey);

      if (cachedJobApps) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: {
            applications: JSON.parse(cachedJobApps),
          },
        });
      }

      const applications = await this.service.getApplicationsByJobId(jobId);
      await this.cacheService.set(cacheKey, JSON.stringify(applications), 3600);

      res.setHeader('X-Data-Source', 'database');
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

      // Ambil info lama untuk invalidasi cache list user & job terkait
      const currentApp = await this.service.getApplicationById(id);

      await this.service.updateApplicationStatus(id, status);

      // Invalidation detail, user list, dan job list cache
      await this.cacheService.delete(`applications:${id}`);
      await this.cacheService.delete(`applications:user:${currentApp.user_id}`);
      await this.cacheService.delete(`applications:job:${currentApp.job_id}`);

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
      const currentApp = await this.service.getApplicationById(id);

      await this.service.deleteApplication(id);

      // Invalidation massal setelah hapus data
      await this.cacheService.delete(`applications:${id}`);
      await this.cacheService.delete(`applications:user:${currentApp.user_id}`);
      await this.cacheService.delete(`applications:job:${currentApp.job_id}`);

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