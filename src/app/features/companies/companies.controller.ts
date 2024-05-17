import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { CreateCompanyDTO } from './DTO/create-company.dto';
import { JWTGuard } from 'src/app/core/guards/jwt.guard';
import { RolesGuard } from 'src/app/core/guards/roles.guard';
import { Roles } from 'src/app/core/decorators/Roles.decorator';
import { UserRoles } from 'src/app/shared/enums/UserRoles.enum';
import { getUser } from 'src/app/core/decorators/getUser.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.MANAGER)
  @Post()
  createCompany(
    @Body() createCompanyDTO: CreateCompanyDTO,
    @getUser() user: User
  ) {
    return this.companiesService.createCompany(createCompanyDTO, user);
  }
}
