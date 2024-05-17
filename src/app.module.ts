import { Module } from '@nestjs/common';

import { FeaturesModule } from './app/features/features.module';
import { ConfigModule } from './app/core/configs/config.module';
import { RedisModule } from './app/core/configs/cache/redis.module';
import { EmailModule } from './app/core/configs/email/sendgrid.module';

@Module({
  imports: [ConfigModule, FeaturesModule, RedisModule, EmailModule],
  controllers: [],
  providers: [], // todo emailService might have to be added here
})
export class AppModule {}
