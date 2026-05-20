const Joi = require('joi');
const InvariantError = require('../../exceptions/InvariantError');

const PostApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().optional(),
});

const PutApplicationPayloadSchema = Joi.object({
  status: Joi.string().required(),
});

const ApplicationsValidator = {
  validatePostApplicationPayload: (payload) => {
    const validationResult = PostApplicationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutApplicationPayload: (payload) => {
    const validationResult = PutApplicationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ApplicationsValidator;
