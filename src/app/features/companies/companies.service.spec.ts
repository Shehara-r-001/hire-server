import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CompaniesService } from './companies.service';
import { COMPANY_REPOSITORY } from '../../core/constants/repositories.constants';
import { MailService } from '../../shared/services/mail.service';
import { CacheService } from '../../shared/services/cache.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDTO } from './DTO/create-company.dto';
import { User } from '../users/entities/user.entity';
import { UpdateCompanyDTO } from './DTO/update-company.dto';
// import { getZonedTime } from './../../shared/utils/datetime';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyRepository: Repository<Company>;
  let mailService: MailService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: COMPANY_REPOSITORY,
          useClass: Repository,
        },
        {
          provide: MailService,
          useValue: { sendCreateCompanyEmail: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyRepository = module.get<Repository<Company>>(COMPANY_REPOSITORY);
    mailService = module.get<MailService>(MailService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('createCompany', () => {
    it('should create a company and send an email', async () => {
      const createCompanyDTO: CreateCompanyDTO = {
        name: 'Test Company',
        managerId: 'manager-id',
        email: 'test@email.com',
        description01: 'test description 01',
        description02: 'test description 02',
        field: 'IT',
        phone: '0789999440',
      };
      const user: User = { id: 'user-id' } as User;

      const manager = {
        save: jest.fn().mockResolvedValue({ id: 'company-id' }),
      };
      jest
        .spyOn(companyRepository.manager, 'transaction')
        .mockImplementation(async (callback: any) => {
          await callback(manager);
        });

      await service.createCompany(createCompanyDTO, user);

      expect(manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createCompanyDTO,
          managerId: 'manager-id',
          createdAt: expect.any(String),
        })
      );
      expect(mailService.sendCreateCompanyEmail).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'company-id' }),
        user
      );
    });
  });

  describe('findCompany', () => {
    it('should find a company by ID and return cached value if present', async () => {
      const companyId = 'company-id';
      const cachedCompany = { id: 'company-id' };
      jest.spyOn(cacheService, 'get').mockResolvedValue(cachedCompany);

      const result = await service.findCompany(companyId, null);

      expect(cacheService.get).toHaveBeenCalledWith('company', companyId);
      expect(result).toBe(cachedCompany);
    });

    it('should query the database if no cached value is present', async () => {
      const companyId = 'company-id';
      const company = { id: 'company-id' } as Company;
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      const qb = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(company),
      };
      jest.spyOn(service as any, 'getQueryBuilder').mockReturnValue(qb);

      const result = await service.findCompany(companyId, null);

      expect(qb.where).toHaveBeenCalledWith('company.id = :companyId', {
        companyId,
      });
      expect(result).toBe(company);
      expect(cacheService.set).toHaveBeenCalledWith(
        'company',
        companyId,
        company,
        300
      );
    });
  });

  describe('updateCompany', () => {
    it('should update a company and return true if successful', async () => {
      const user: User = {
        id: 'user-id',
        isAdmin: true,
        isManager: true,
      } as User;
      const updateCompanyDTO: UpdateCompanyDTO = {
        id: 'company-id',
        name: 'Updated Company',
      };

      jest
        .spyOn(service, 'findCompany')
        .mockResolvedValue({ id: 'company-id' } as Company);
      const manager = { update: jest.fn().mockResolvedValue({ affected: 1 }) };
      jest
        .spyOn(companyRepository.manager, 'transaction')
        .mockImplementation(async (callback: any) => {
          await callback(manager);
        });

      const result = await service.updateCompany(user, updateCompanyDTO);

      expect(result).toBe(true);
      expect(manager.update).toHaveBeenCalledWith(
        Company,
        { id: 'company-id' },
        { name: 'Updated Company' }
      );
    });

    it('should throw an UnauthorizedException if user is not authorized', async () => {
      const user: User = {
        id: 'user-id',
        isAdmin: false,
        isManager: false,
      } as User;
      const updateCompanyDTO: UpdateCompanyDTO = {
        id: 'company-id',
        name: 'Updated Company',
      };

      jest
        .spyOn(service, 'findCompany')
        .mockResolvedValue({ id: 'company-id' } as Company);

      await expect(
        service.updateCompany(user, updateCompanyDTO)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company and return true if successful', async () => {
      const user: User = {
        id: 'user-id',
        isAdmin: true,
        isManager: true,
      } as User;
      const companyId = 'company-id';

      jest
        .spyOn(service, 'findCompany')
        .mockResolvedValue({ id: 'company-id' } as Company);
      const manager = { remove: jest.fn().mockResolvedValue(true) };
      jest
        .spyOn(companyRepository.manager, 'transaction')
        .mockImplementation(async (callback: any) => {
          await callback(manager);
        });

      const result = await service.deleteCompany(user, companyId);

      expect(result).toBe(true);
      expect(manager.remove).toHaveBeenCalledWith(Company, {
        id: 'company-id',
      });
    });

    it('should throw an error if company not found', async () => {
      const user: User = {
        id: 'user-id',
        isAdmin: true,
        isManager: true,
      } as User;
      const companyId = 'company-id';

      jest.spyOn(service, 'findCompany').mockResolvedValue(null);

      await expect(service.deleteCompany(user, companyId)).rejects.toThrow(
        'company did not found'
      );
    });
  });
});
