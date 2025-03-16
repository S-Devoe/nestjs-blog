import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('staging', 'development', 'test', 'production')
    .default('development'),
  // database
  DATABASE_PORT: Joi.number().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  // google
  GOOGLE_PROFILE_API_KEY: Joi.string().required(),
});
