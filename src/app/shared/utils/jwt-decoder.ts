import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

import { EnvConfig } from '../models/EnvConfig.model';

export const jwtDecorder = (token: string) => {
  const configService = new ConfigService<EnvConfig, true>();
  const JWT_SECRET = configService.get('JWT_SECRET');

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      throw new UnauthorizedException(error.message);
    else throw error;
  }
};
