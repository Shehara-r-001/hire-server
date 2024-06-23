import {
  createParamDecorator,
  ExecutionContext,
  // UnauthorizedException,
} from '@nestjs/common';

import { jwtDecorder } from '../../shared/utils/jwt-decoder';

export const getUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    let user;

    if (!authHeader) {
      user = null;
      // throw new UnauthorizedException();
    } else {
      const token = authHeader.split(' ')[1];
      user = jwtDecorder(token);

      return user;
    }
  }
);
