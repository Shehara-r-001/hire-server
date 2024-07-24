import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateCompanyDTO } from '../../companies/DTO/create-company.dto';

export class UpdateVacancyDTO extends PartialType(
  OmitType(CreateCompanyDTO, ['status'])
) {}
