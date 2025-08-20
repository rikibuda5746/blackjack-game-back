import Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().port().default(4200),
  SALT: Joi.number().integer().positive().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES: Joi.number().integer().positive().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES: Joi.number().integer().positive().required(),
  DATABASE_HOST: Joi.string().hostname().required(),
  DATABASE_PORT: Joi.number().port().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').required(),
  DATABASE_SCHEMA: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
});
