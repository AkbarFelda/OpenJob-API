const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const CategoryPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const CategoriesValidator = {
  validateCategoryPayload: (payload) => {
    const validationResult = CategoryPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CategoriesValidator;
