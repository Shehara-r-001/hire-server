import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
// import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '../../core/constants/repositories.constants';
import { UserRoles } from '../../shared/enums/UserRoles.enum';
import { SignUpDTO } from './DTO/signup.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let entityManager: EntityManager;

  // * if it is not a custom token, we can use getRepositoyToken(User) instead
  const userRepositoryToken = USER_REPOSITORY;

  beforeEach(async () => {
    const userRepositoryMock = {
      manager: {
        transaction: jest.fn().mockImplementation(async (transactionFunc) => {
          await transactionFunc({
            getRepository: jest.fn().mockReturnValue({
              save: jest.fn(),
            }),
          });
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository,
          useValue: userRepositoryMock,
        },
        {
          provide: EntityManager,
          useValue: createMock<EntityManager>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    entityManager = module.get(EntityManager);
  });

  describe('isUserExist', () => {
    it('should return false if user does not exist', async () => {
      const newUserEmail = 'newemail@gmail.com';

      jest.spyOn(userRepository, 'countBy').mockResolvedValueOnce(0);

      const result = await service.isUserExist(newUserEmail);
      expect(userRepository.countBy).toBeCalledWith({
        email: newUserEmail,
      });
      expect(result).toBe(false);
    });

    it('should return true if user exist', async () => {
      const newUserEmail = 'newemail@gmail.com';
      // const existingUser = { id: 1, email: newUserEmail }

      jest.spyOn(userRepository, 'countBy').mockResolvedValueOnce(1);

      const result = await service.isUserExist(newUserEmail);
      expect(userRepository.countBy).toBeCalledWith({
        email: newUserEmail,
      });
      expect(result).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return matching user', async () => {
      const mockUser = {
        id: '2',
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password456',
        isActive: true,
        role: UserRoles.GUEST,
        createdAt: new Date('2022-01-03T09:45:00Z'),
        updatedAt: new Date('2022-01-04T11:20:00Z'),
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(mockUser);

      const userEmail = 'jane.smith@example.com';
      const user = await service.findOne(userEmail);

      expect(user).toEqual(mockUser);
    });

    it('shpuld throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

      const userEmail = 'jane.smith@example.com';

      await expect(service.findOne(userEmail)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  // describe('createUser', () => {
  //   it('it should create user and return true', async () => {
  //     const user: SignUpDTO = {
  //       email: 'user01@gmail.com',
  //       password: 'password123',
  //       firstname: 'test',
  //       lastname: 'user 01',
  //       isActive: true,
  //       role: UserRoles.GUEST,
  //     };
  //   });
  // });
});
