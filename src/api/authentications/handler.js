const AuthenticationsService = require('../../services/postgres/AuthenticationsService');
const UsersService = require('../../services/postgres/UsersService');
const TokenManager = require('../../tokenize/TokenManager');
const AuthenticationsValidator = require('../../validator/authentications');

class AuthenticationsHandler {
  constructor() {
    this.authenticationsService = new AuthenticationsService();
    this.usersService = new UsersService();
  }

  async postAuthenticationHandler(req, res, next) {
    try {
      AuthenticationsValidator.validatePostAuthenticationPayload(req.body);

      const { email, password } = req.body;
      const id = await this.usersService.verifyUserCredential(email, password);

      const accessToken = TokenManager.generateAccessToken({ id });
      const refreshToken = TokenManager.generateRefreshToken({ id });

      await this.authenticationsService.addRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      AuthenticationsValidator.validatePutAuthenticationPayload(req.body);

      const { refreshToken } = req.body;
      await this.authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = TokenManager.verifyRefreshToken(refreshToken);

      const accessToken = TokenManager.generateAccessToken({ id });

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      AuthenticationsValidator.validateDeleteAuthenticationPayload(req.body);

      const { refreshToken } = req.body;
      await this.authenticationsService.verifyRefreshToken(refreshToken);
      await this.authenticationsService.deleteRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsHandler;
