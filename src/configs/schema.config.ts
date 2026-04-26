import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('password'),
  DATABASE_NAME: Joi.string().default('pgtl_test'),
  SWAGGER_USERNAME: Joi.string().default('admin'),
  SWAGGER_PASSWORD: Joi.string().default('secret'),
});
