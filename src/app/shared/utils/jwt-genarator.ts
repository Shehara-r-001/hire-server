import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { EnvConfig } from '../models/EnvConfig.model';
import { User } from 'src/app/features/users/entities/user.entity';

export async function jwtGenerator(data: Partial<User>): Promise<string> {
  const configService = new ConfigService<EnvConfig, true>();

  const JWT_SECRET = configService.get('JWT_SECRET');
  const JWT_EXPIRATION = configService.get('JWT_EXPIRATION');

  return jwt.sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}
