import {
  PaginationRequest,
  SortType,
} from 'src/app/shared/utils/pagination-request';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { getZonedTime } from './../../shared/utils/datetime';
import { COMPANY_REPOSITORY } from 'src/app/core/constants/repositories.constants';
import { Company } from './entities/company.entity';
import { CreateCompanyDTO } from './DTO/create-company.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from 'src/app/shared/services/mail.service';
import { PaginatedResponse } from 'src/app/shared/utils/paginated-response';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: Repository<Company>,
    private readonly mailService: MailService
  ) {}

  async createCompany(createCompanyDTO: CreateCompanyDTO, user: User) {
    try {
      await this.companyRepository.manager.transaction(async (manager) => {
        const company = await manager.save(Company, {
          ...createCompanyDTO,
          managerId: createCompanyDTO.managerId
            ? createCompanyDTO.managerId
            : user.id,
          createdAt: getZonedTime(new Date().toISOString()),
        });

        await this.mailService.sendCreateCompanyEmail(company, user);
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  // todo add cache

  /**
   * provides a query builder for company repo
   * @param user
   * @param queryLevel
   * @returns {SelectQueryBuilder<Company>}
   */
  private getQueryBuilder(
    queryLevel = 0,
    _user?: User
  ): SelectQueryBuilder<Company> {
    const qb = this.companyRepository.createQueryBuilder('company');

    if (queryLevel > 0)
      qb.leftJoinAndSelect('company.Manager', 'Manager').leftJoinAndSelect(
        'company.Employees',
        'Employees'
      );

    return qb;
  }

  async findCompany(companyId: string, user?: User, queryLevel?: number) {
    try {
      const qb = this.getQueryBuilder(queryLevel, user).where(
        'company.id = :companyId',
        { companyId }
      );

      const company = await qb.getOne();

      if (!company) throw new NotFoundException('company did not found');

      return company;
    } catch (error) {
      throw error;
    }
  }

  async findCompanies(
    request: PaginationRequest,
    queryLevel: number,
    user?: User
  ) {
    try {
      const qb = this.getQueryBuilder(queryLevel, user)
        .skip(request.pageSize * request.page - 1)
        .take(request.pageSize);

      if (request.sortBy)
        qb.orderBy(`company.${request.sortBy}`, request.sortType);
      else qb.orderBy('company.createdAt', SortType.ASC);

      if (request.query)
        qb.andWhere('company.name like :query or company.field like :query', {
          query: request.query,
        });

      const [companies, count] = await qb.getManyAndCount();

      return new PaginatedResponse(companies, count, request);
    } catch (error) {
      throw error;
    }
  }

  // todo update company
  // todo delete company
}
