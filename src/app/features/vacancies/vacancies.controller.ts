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

import { VacanciesService } from './vacancies.service';
import { JWTGuard } from '../../core/guards/jwt.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UserRoles } from '../../shared/enums/UserRoles.enum';
import { Roles } from '../../core/decorators/Roles.decorator';
import { getUser } from '../../core/decorators/getUser.decorator';
import { User } from '../users/entities/user.entity';
import { CreateVacancyDTO } from './DTO/create-vacancy.dto';
import { UuidValidationPipe } from '../../shared/pipes/validateUUID.pipe';
import { PaginationRequest } from '../../shared/utils/pagination-request';
import { UpdateVacancyDTO } from './DTO/update-vacancy.dto';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.MANAGER, UserRoles.ADMIN)
  @Post()
  createVacancy(
    @Body() createVacancyDTO: CreateVacancyDTO,
    @getUser() user: User
  ) {
    return this.vacanciesService.createVacancy(user, createVacancyDTO);
  }

  @Get(':id')
  findVacancy(
    @Param('id', UuidValidationPipe) id: string,
    @getUser() user: User | null
  ) {
    return this.vacanciesService.findVacancy(user, id);
  }

  @Get()
  findVacancies(
    @Query() request: PaginationRequest,
    @getUser() user: User | null
  ) {
    return this.vacanciesService.findVacancies(user, request);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @Patch(':id')
  updateVacancy(
    @Body() updateVacancyDTO: UpdateVacancyDTO,
    @Param('id', UuidValidationPipe) id: string,
    @getUser() user: User
  ) {
    return this.vacanciesService.updateVacancy(user, id, updateVacancyDTO);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @Delete(':id')
  deleteVacancy(
    @Param('id', UuidValidationPipe) id: string,
    @getUser() user: User
  ) {
    return this.vacanciesService.deleteVacancy(user, id);
  }
}
