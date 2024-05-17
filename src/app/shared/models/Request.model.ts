import { Request as ExpressRequest } from 'express';

import { User } from '../../features/users/entities/user.entity';

export type Request = ExpressRequest & {
  start: number;
  user: Partial<User>;
};
