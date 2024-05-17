import * as Joi from 'joi';
import { NodeEnvironment } from 'src/app/shared/enums/NodeEnvironment.enum';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnvironment))
    .default(NodeEnvironment.DEV),
  PORT: Joi.number().default(3000),
  BASE_URL: Joi.string().default('http://127.0.0.1'),
  REDIS_CONNECTION_STRING: Joi.string().required(), // make this optional or remove it if caching is not used
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  CA: Joi.string().required(),
  SENDGRID_API_KEY: Joi.string().required(),
  HIRE_CLIENT: Joi.string().optional().default('http://localhost:5000'),
});
