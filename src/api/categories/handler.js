const CategoriesService = require('../../services/postgres/CategoriesService');
const CategoriesValidator = require('../../validator/categories');

class CategoriesHandler {
  constructor() {
    this.service = new CategoriesService();
  }

  async postCategoryHandler(req, res, next) {
    try {
      CategoriesValidator.validateCategoryPayload(req.body);
      const categoryId = await this.service.addCategory(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          id: categoryId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoriesHandler(req, res, next) {
    try {
      const categories = await this.service.getCategories();

      res.status(200).json({
        status: 'success',
        data: {
          categories,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this.service.getCategoryById(id);

      res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async putCategoryHandler(req, res, next) {
    try {
      CategoriesValidator.validateCategoryPayload(req.body);
      const { id } = req.params;

      await this.service.updateCategory(id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Category berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategoryHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.deleteCategory(id);

      res.status(200).json({
        status: 'success',
        message: 'Category berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriesHandler;
