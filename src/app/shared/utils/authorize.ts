import { UnauthorizedException } from '@nestjs/common';

import { Company } from '../../features/companies/entities/company.entity';
import { User } from '../../features/users/entities/user.entity';
import { UserRoles } from '../enums/UserRoles.enum';

export const isAdmin = (user: User) => {
  return user.role === UserRoles.ADMIN;
};

export const isManager = (user: User) => {
  return user.role === UserRoles.MANAGER;
};

export const checkIsAdmin = (user: User | null, isThrow = false) => {
  if (user && user.role === UserRoles.ADMIN) return true;
  else return returnHandler(isThrow);
};

export const canUserHandleCompany = (
  user: User,
  company: Company | string,
  isThrow = false
): boolean => {
  const companyId = typeof company === 'string' ? company : company.id;
  if (user.companyId === companyId && user.role === UserRoles.MANAGER)
    return true;
  else return returnHandler(isThrow);
};

export const checkIsInCompany = (
  user: User,
  company: Company | string,
  isThrow = false
) => {
  const companyId = typeof company === 'string' ? company : company.id;
  if (user.companyId === companyId) return true;
  else return returnHandler(isThrow);
};

const returnHandler = (isThrow: boolean) => {
  if (isThrow) throw new UnauthorizedException();
  else return false;
};
