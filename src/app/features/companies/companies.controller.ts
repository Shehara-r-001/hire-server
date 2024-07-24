import { UpdateCompanyDTO } from './DTO/update-company.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { CreateCompanyDTO } from './DTO/create-company.dto';
import { JWTGuard } from 'src/app/core/guards/jwt.guard';
import { RolesGuard } from 'src/app/core/guards/roles.guard';
import { Roles } from 'src/app/core/decorators/Roles.decorator';
import { UserRoles } from 'src/app/shared/enums/UserRoles.enum';
import { getUser } from 'src/app/core/decorators/getUser.decorator';
import { User } from '../users/entities/user.entity';
import { UuidValidationPipe } from 'src/app/shared/pipes/validateUUID.pipe';
import { PaginationRequest } from 'src/app/shared/utils/pagination-request';

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
    console.log(createCompanyDTO);
    console.log(user);
    return this.companiesService.createCompany(createCompanyDTO, user);
  }

  @Get(':id')
  findCompany(@Param('id', UuidValidationPipe) id: string) {
    return this.companiesService.findCompany(id, null);
  }

  @Get()
  findCompanies(
    @Query() request: PaginationRequest,
    @getUser() user: User | null
  ) {
    return this.companiesService.findCompanies(request, user);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @Patch()
  updateCompany(
    @Body() updateCompanyDTO: UpdateCompanyDTO,
    @getUser() user: User
  ) {
    return this.companiesService.updateCompany(user, updateCompanyDTO);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @Delete(':id')
  deleteCompany(
    @Param('id', UuidValidationPipe) id: string,
    @getUser() user: User
  ) {
    return this.companiesService.deleteCompany(user, id);
  }
}
