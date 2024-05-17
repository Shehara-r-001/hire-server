import {
  Injectable,
  // CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { Request } from '../../shared/models/Request.model';
import { UserRoles } from '../../shared/enums/UserRoles.enum';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) throw new UnauthorizedException();
    else {
      return roles.includes(request.user.role as UserRoles);
    }
  }
}
