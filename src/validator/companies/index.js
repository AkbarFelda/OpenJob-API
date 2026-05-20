const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const CompanyPayloadSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().allow('').optional(),
});

const CompaniesValidator = {
  validateCompanyPayload: (payload) => {
    const validationResult = CompanyPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CompaniesValidator;
