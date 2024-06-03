import { UpdateUserDTO } from './DTO/update-user.dto';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { User } from './entities/user.entity';
import { SignUpDTO } from './DTO/signup.dto';
import { USER_REPOSITORY } from '../../core/constants/repositories.constants';
import { getZonedTime } from '../../shared/utils/datetime';
import {
  PaginationRequest,
  SortType,
} from '../../shared/utils/pagination-request';
import { PaginatedResponse } from '../../shared/utils/paginated-response';
import { ThrowNotFound } from '../../shared/utils/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * used to creates a user. upgrade accordingle if auth changed to social
   * @param signUpDTO
   * @returns {Promise<boolean>}
   */
  async createUser(signUpDTO: SignUpDTO): Promise<boolean> {
    return await this.userRepository.manager.transaction(async (manager) => {
      try {
        await manager.save(User, {
          ...signUpDTO,
          createdAt: getZonedTime(new Date().toISOString()),
        });

        return true;
      } catch (error) {
        throw error;
      }
    });
  }

  /**
   * checks if the user is already exists
   * @param email
   * @returns {Promise<boolean>}
   */
  async isUserExist(email: string): Promise<boolean> {
    try {
      const count = await this.userRepository.countBy({ email });

      return count > 0 ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async findOne(email: string) {
    try {
      const user = await this.userRepository.findOneBy({
        email,
      });

      ThrowNotFound(user, 'user not found');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByID(_user: User | null, id: string) {
    try {
      // todo: need to check roles??

      const foundUser = this.userRepository.findOneBy({ id });

      ThrowNotFound(foundUser, 'user not found');

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * use to create a common query builder. upgrade as you go
   * @returns {SelectQueryBuilder<User>}
   */
  private getQueryBuilder(
    _user: User | null,
    queryLevel = 0
  ): SelectQueryBuilder<User> {
    const qb = this.userRepository.createQueryBuilder('user');

    // allow users to see only there own extra info
    if (queryLevel > 0) {
    }

    return qb;
  }

  /**
   * paginated user feed
   * @param request
   * @returns {Promise<PaginatedResponse<User>>}
   */
  async findUsers(
    user: User,
    request: PaginationRequest,
    queryLevel = 1
  ): Promise<PaginatedResponse<User>> {
    try {
      const qb = this.getQueryBuilder(user, queryLevel);

      // if (user.isManager)
      //   qb.andWhere('user.companyId = :companyId', {
      //     companyId: user.companyId,
      //   });

      qb.skip(request.pageSize * (request.page - 1)).take(request.pageSize);

      if (request.sortBy)
        qb.orderBy(`user.${request.sortBy}`, request.sortType);
      else qb.orderBy('user.createdAt', SortType.ASC);

      if (request.query)
        qb.andWhere(
          'user.firstname like :query or user.lastname like :query or user.email like :query',
          {
            query: `%${request.query}%`,
          }
        );

      const [users, count] = await qb.getManyAndCount();

      return new PaginatedResponse(users, count, request);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: User, updateUserDTO: UpdateUserDTO) {
    try {
      const { id, ...rest } = updateUserDTO;

      const foundUser = await this.findUserByID(user, id);

      ThrowNotFound(foundUser, 'user not found');

      if (user.id !== foundUser?.id) throw new UnauthorizedException();

      return await this.userRepository.manager.transaction(async (manager) => {
        const result = await manager.update(User, { id }, { ...rest });

        return Number(result.affected) > 0 ? true : false;
      });
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // todo ----------------
  // update user
  // delete user
  // add/drop user from company
}
