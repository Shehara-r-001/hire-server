import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { envValidationSchema } from './env-validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/src/app/shared/env/${
        process.env.NODE_ENV
      }.env`,
      validationSchema: envValidationSchema,
    }),
  ],
})
export class ConfigModule {}
