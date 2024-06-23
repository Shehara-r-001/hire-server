import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { VacanciesModule } from './vacancies/vacancies.module';

@Module({
  imports: [UsersModule, AuthModule, CompaniesModule, VacanciesModule],
  providers: [],
  controllers: [],
})
export class FeaturesModule {}
