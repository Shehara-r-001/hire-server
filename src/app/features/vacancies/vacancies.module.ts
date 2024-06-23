import { Module } from '@nestjs/common';

import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { DatabaseModule } from '../../core/configs/db/database.module';
import { vacancyProviders } from './vacancy.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [VacanciesController],
  providers: [VacanciesService, ...vacancyProviders],
})
export class VacanciesModule {}
