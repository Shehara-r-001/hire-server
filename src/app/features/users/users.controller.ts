import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { SignUpDTO } from './DTO/signup.dto';
import { JWTGuard } from '../../core/guards/jwt.guard';
import { UserRoles } from '../../shared/enums/UserRoles.enum';
import { Roles } from '../../core/decorators/Roles.decorator';
import { PaginationRequest } from 'src/app/shared/utils/pagination-request';
import { getUser } from '../../core/decorators/getUser.decorator';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/app/core/guards/roles.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'creates a user' })
  @UseGuards(JWTGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  createUser(signUpDTO: SignUpDTO) {
    return this.userService.createUser(signUpDTO);
  }

  //   @UseGuards(JWTGuard)
  //   @Get(':email')
  //   findUser(email: string) {
  //     return this.userService.findOne(email);
  //   }

  @UseGuards(JWTGuard)
  // @Roles(UserRoles.ADMIN)
  @Get()
  findUsers(@Query() request: PaginationRequest) {
    return this.userService.findUsers(request);
  }

  @UseGuards(JWTGuard)
  @Get('verify')
  verify(@getUser() user: User) {
    const { password, ...restOfUser } = user;
    return restOfUser;
  }
}
