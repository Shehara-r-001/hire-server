import { Module } from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { companyProviders } from './company.providers';
import { DatabaseModule } from 'src/app/core/configs/db/database.module';
import { MailService } from 'src/app/shared/services/mail.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, ...companyProviders, MailService],
})
export class CompaniesModule {}
