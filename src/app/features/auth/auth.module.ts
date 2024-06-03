import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IEnvConfig } from 'src/app/shared/models/EnvConfig.model';
import { UsersService } from '../users/users.service';
import { JwtAuthStrategy } from './startergies/jwt.stratergy';
import { userProviders } from '../users/user.providers';
import { DatabaseModule } from 'src/app/core/configs/db/database.module';

const jwtModule = JwtModule.registerAsync({
  useFactory: async (configService: ConfigService<IEnvConfig, true>) => {
    return {
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRATION'),
      },
    };
  },
  inject: [ConfigService],
});

@Module({
  imports: [jwtModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtAuthStrategy, ...userProviders],
  exports: [jwtModule],
})
export class AuthModule {}
