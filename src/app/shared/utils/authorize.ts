import { UnauthorizedException } from '@nestjs/common';

import { Company } from '../../features/companies/entities/company.entity';
import { User } from '../../features/users/entities/user.entity';
import { UserRoles } from '../enums/UserRoles.enum';

export const checkIsAdmin = (user: User) => {
  if (user.role === UserRoles.ADMIN) return true;
  else throw new UnauthorizedException();
};

export const canUserHandleCompany = (user: User, company: Company): boolean => {
  if (user.companyId === company.id && user.role === UserRoles.MANAGER)
    return true;
  else throw new UnauthorizedException();
};

export const checkIsInCompany = (user: User, company: Company) => {
  if (user.companyId === company.id) return true;
  else throw new UnauthorizedException();
};
