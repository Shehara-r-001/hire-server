import { ConfigService } from '@nestjs/config';
import { IEnvConfig } from '../../shared/models/EnvConfig.model';

const configService = new ConfigService<IEnvConfig, true>();

export const PORT = configService.get('PORT');

export const NODE_ENV = configService.get('NODE_ENV');

export const REDIS_CONNECTION_STRING = configService.get(
  'REDIS_CONNECTION_URL'
);

export const BASE_URL = configService.get('BASE_URL');

export const DB_HOST = configService.get('DB_HOST');

export const DB_USER = configService.get('DB_USER');

export const DB_PASSWORD = configService.get('DB_PASSWORD');

export const DB_NAME = configService.get('DB_NAME');

export const DB_PORT = configService.get('DB_PORT');

export const CA = configService.get('CA');
