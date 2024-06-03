import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateUserDTO } from './DTO/update-user.dto';
import { UuidValidationPipe } from 'src/app/shared/pipes/validateUUID.pipe';

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
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @Get()
  findUsers(@Query() request: PaginationRequest, @getUser() user: User) {
    return this.userService.findUsers(user, request);
  }

  @UseGuards(JWTGuard)
  @Get('verify')
  verify(@getUser() user: User) {
    const { password, ...restOfUser } = user;
    return restOfUser;
  }

  @Get(':id')
  findUserByID(
    @Param('id', UuidValidationPipe) id: string,
    @getUser() user: User | null
  ) {
    return this.userService.findUserByID(user, id);
  }

  @UseGuards(JWTGuard)
  @Patch()
  updateUser(@Body() updateUserDTO: UpdateUserDTO, @getUser() user: User) {
    return this.userService.updateUser(user, updateUserDTO);
  }
}
