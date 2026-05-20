const UsersService = require('../../services/postgres/UsersService');
const UsersValidator = require('../../validator/users');

class UsersHandler {
  constructor() {
    this.service = new UsersService();
  }

  async postUserHandler(req, res, next) {
    try {
      UsersValidator.validateUserPayload(req.body);
      const userId = await this.service.addUser(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          id: userId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.service.getUserById(id);

      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersHandler;
