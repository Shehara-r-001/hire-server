import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { SignUpDTO } from '../users/DTO/signup.dto';
import { jwtGenerator } from '../../shared/utils/jwt-genarator';
import { SigninDTO } from '../users/DTO/signin.dto';
import { bcryptString } from '../../shared/utils/encrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async signUp(signUpDTO: SignUpDTO) {
    try {
      const isUserExist = await this.userService.isUserExist(signUpDTO.email);

      if (isUserExist)
        throw new BadRequestException('user with email already exist');
      else {
        await this.userService.createUser({
          ...signUpDTO,
          password: await bcryptString(signUpDTO.password),
        });

        const newUser = await this.userService.findOne(signUpDTO.email);

        if (newUser) {
          const { password, ...rest } = newUser;

          return jwtGenerator(rest);
        } else throw new BadRequestException();
      }
    } catch (error) {
      throw error;
    }
  }

  async login(signInDTO: SigninDTO) {
    try {
      const user = await this.userService.findOne(signInDTO.email);

      if (!user) throw new NotFoundException('user does not exist');

      const isMatch = await bcrypt.compare(
        signInDTO.password,
        user.password as string
      );

      if (!isMatch)
        throw new UnauthorizedException('email and password does not match');

      const { password, ...rest } = user;

      return await jwtGenerator(rest);
    } catch (error) {
      throw error;
    }
  }
}
