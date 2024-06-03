import { PartialType } from '@nestjs/swagger';

import { CreateCompanyDTO } from './create-company.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyDTO extends PartialType(CreateCompanyDTO) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
