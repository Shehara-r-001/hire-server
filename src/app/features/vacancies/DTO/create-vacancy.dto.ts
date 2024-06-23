import { PickType } from '@nestjs/swagger';

import { Vacancy } from '../entities/vacancy.entity';

export class CreateVacancyDTO extends PickType(Vacancy, [
  'companyId',
  'description',
  'field',
  'level',
  'openFrom',
  'openTo',
  'other',
  'requrements',
  'status',
  'subTitle',
  'title',
  'type',
]) {}
