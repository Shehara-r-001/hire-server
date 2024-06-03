import { Module } from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { companyProviders } from './company.providers';
import { DatabaseModule } from '../../core/configs/db/database.module';
import { MailService } from '../../shared/services/mail.service';
import { CacheService } from '../../shared/services/cache.service';
import { RedisModule } from '../../core/configs/cache/redis.module';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, ...companyProviders, MailService, CacheService],
})
export class CompaniesModule {}
