import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { VACANCY_REPOSITORY } from '../../core/constants/repositories.constants';
import { Vacancy, VacancyStatus } from './entities/vacancy.entity';
import { CreateVacancyDTO } from './DTO/create-vacancy.dto';
import { User } from '../users/entities/user.entity';
import {
  canUserHandleCompany,
  checkIsAdmin,
  isAdmin,
  isManager,
} from '../../shared/utils/authorize';
import { getZonedTime } from '../../shared/utils/datetime';
import { ThrowNotFound } from '../../shared/utils/exceptions';
import {
  PaginationRequest,
  SortType,
} from '../../shared/utils/pagination-request';
import { PaginatedResponse } from '../../shared/utils/paginated-response';
import { applySearchQueries } from '../../shared/utils/filters';
import { UpdateVacancyDTO } from './DTO/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @Inject(VACANCY_REPOSITORY)
    private readonly vacancyRepository: Repository<Vacancy>
  ) {}

  async createVacancy(user: User, createVacancyDTO: CreateVacancyDTO) {
    try {
      const companyId = isAdmin(user)
        ? createVacancyDTO.companyId
        : user.companyId;

      if (!isAdmin)
        canUserHandleCompany(user, createVacancyDTO.companyId, true);

      return this.vacancyRepository.manager.transaction(async (manager) => {
        await manager.insert(Vacancy, {
          ...createVacancyDTO,
          companyId,
          createdAt: getZonedTime(new Date().toISOString()),
          createdByID: user.id,
        });

        return true;
      });
    } catch (error) {
      console.log(error);
      //   return false;
      throw error;
    }
  }

  private getQueryBuilder(user: User | null, queryLevel = 0) {
    const qb = this.vacancyRepository.createQueryBuilder('vacancy');

    if (queryLevel > 0) {
      qb.leftJoinAndSelect('vacancy.Company', 'Company');

      if (user && isAdmin(user))
        qb.leftJoinAndSelect('vacancy.CreatedBy', 'CreatedBy'); // todo: sub query add this for own company manager
    }

    return qb;
  }

  // todo: add chache ?
  private async findOne(user: User | null, id: string, queryLevel = 0) {
    try {
      const qb = this.getQueryBuilder(user, queryLevel).where(
        'vacancy.id = :id',
        { id }
      );

      const vacancy = await qb.getOne();

      ThrowNotFound(vacancy, 'data not found');

      return vacancy;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findVacancy(user: User | null, id: string, queryLevel = 1) {
    return await this.findOne(user, id, queryLevel);
  }

  async findVacancies(
    user: User | null,
    request: PaginationRequest,
    queryLevel = 1
  ) {
    try {
      const qb = this.getQueryBuilder(user, queryLevel)
        .skip(request.pageSize * (request.page - 1))
        .take(request.pageSize);

      if (!checkIsAdmin(user)) {
        qb.andWhere('vacancy.status = :status', {
          status: VacancyStatus.OPEN,
        });
      }

      if (request.sortBy)
        qb.orderBy(`vacancy.${request.sortBy}`, request.sortType);
      else qb.orderBy('vacancy.createdAt', SortType.ASC);

      // todo: filter by date range

      if (request.query)
        applySearchQueries(qb, 'vacancy', ['title', 'field'], request.query);

      const [companies, count] = await qb.getManyAndCount();

      return new PaginatedResponse(companies, count, request);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateVacancy(
    user: User,
    id: string,
    updateVacancyDTO: UpdateVacancyDTO
  ) {
    try {
      const vacancy = await this.findOne(user, id);

      if (!vacancy) throw new NotFoundException();

      if (!(isAdmin(user) || isManager(user)))
        throw new UnauthorizedException();
      if (isManager(user)) canUserHandleCompany(user, vacancy.companyId);

      return await this.vacancyRepository.manager.transaction(
        async (manager) => {
          const updateResult = await manager.update(
            Vacancy,
            { id },
            {
              ...updateVacancyDTO,
              updatedAt: getZonedTime(new Date().toISOString()),
            }
          );

          return Number(updateResult.affected) > 0;
        }
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteVacancy(user: User, id: string) {
    try {
      const vacancy = await this.findOne(user, id);

      if (!vacancy) throw new NotFoundException();

      canUserHandleCompany(user, vacancy.companyId);

      return await this.vacancyRepository.manager.transaction(
        async (manager) => {
          manager.remove(Vacancy, vacancy);

          return true;
        }
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
