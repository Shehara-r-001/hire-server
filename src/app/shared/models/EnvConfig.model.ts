import { NodeEnvironment } from '../enums/NodeEnvironment.enum';

export interface IEnvConfig {
  PORT: string | number;
  NODE_ENV: NodeEnvironment;
  BASE_URL: string;
  REDIS_CONNECTION_URL: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: number;
  CA: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  SENDGRID_API_KEY: string;
  SENDGRID_SENDER: string;
  HIRE_CLIENT: string;
}
