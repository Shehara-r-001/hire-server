import {
  PaginationRequest,
  SortType,
} from 'src/app/shared/utils/pagination-request';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { getZonedTime } from './../../shared/utils/datetime';
import { COMPANY_REPOSITORY } from '../../core/constants/repositories.constants';
import { Company } from './entities/company.entity';
import { CreateCompanyDTO } from './DTO/create-company.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from '../../shared/services/mail.service';
import { PaginatedResponse } from '../../shared/utils/paginated-response';
import { UpdateCompanyDTO } from './DTO/update-company.dto';
import { canUserHandleCompany } from '../../shared/utils/authorize';
import { CacheService } from '../../shared/services/cache.service';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: Repository<Company>,
    private readonly mailService: MailService,
    private readonly cacheService: CacheService
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _user: User | null
  ): SelectQueryBuilder<Company> {
    const qb = this.companyRepository.createQueryBuilder('company');

    if (queryLevel > 0)
      qb.leftJoinAndSelect('company.Manager', 'Manager').leftJoinAndSelect(
        'company.Employees',
        'Employees'
      );

    return qb;
  }

  async findCompany(companyId: string, user: User | null, queryLevel = 1) {
    try {
      const cachedCompany = await this.cacheService.get('company', companyId);

      // ! will query level effect this?
      if (cachedCompany) return cachedCompany;

      const qb = this.getQueryBuilder(queryLevel, user).where(
        'company.id = :companyId',
        { companyId }
      );

      const company = await qb.getOne();

      if (!company) throw new NotFoundException('company did not found');

      await this.cacheService.set('company', companyId, company, 300);

      return company;
    } catch (error) {
      throw error;
    }
  }

  async findCompanies(
    request: PaginationRequest,
    user: User | null,
    queryLevel = 1
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

  async updateCompany(user: User, updateCompanyDTO: UpdateCompanyDTO) {
    try {
      const company = await this.findCompany(updateCompanyDTO.id, user);

      if (!company) throw new NotFoundException('company not found');

      if (!user.isAdmin || !user.isManager) throw new UnauthorizedException();
      if (user.isManager) canUserHandleCompany(user, company);

      const { id, ...rest } = updateCompanyDTO;

      return await this.companyRepository.manager.transaction(
        async (manager) => {
          const updateResult = await manager.update(Company, { id }, rest);

          return Number(updateResult.affected) > 0 ? true : false;
        }
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteCompany(user: User, id: string) {
    try {
      const company = await this.findCompany(id, user);

      if (!company) throw new NotFoundException('company not found');

      canUserHandleCompany(user, company);

      // ! do we need to completely delete?
      // ! or we can archive
      return await this.companyRepository.manager.transaction(
        async (manager) => {
          manager.remove(Company, company);

          return true;
        }
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // add employee/s
  // remove employee/s
  // post vacacies
}
