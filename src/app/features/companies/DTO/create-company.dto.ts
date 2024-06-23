import { PickType } from '@nestjs/swagger';

import { Company } from '../entities/company.entity';

export class CreateCompanyDTO extends PickType(Company, [
  'name',
  'email',
  'field',
  'phone',
  'managerId',
  'description01',
  'description02',
  'image',
  'coverImage',
]) {}
