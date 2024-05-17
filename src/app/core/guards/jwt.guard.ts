import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

import { Request } from '../../shared/models/Request.model';
import { jwtDecorder } from '../../shared/utils/jwt-decoder';

@Injectable()
export class JWTGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    try {
      if (!request.headers.authorization) {
        throw new UnauthorizedException('no jwt token provided');
      } else {
        const token = request.headers.authorization.split(' ')[1];

        request.user = jwtDecorder(token);

        return token ? true : false;
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError)
        throw new UnauthorizedException(error.message);
      throw error;
    }
  }
}
