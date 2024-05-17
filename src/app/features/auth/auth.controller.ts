import { Body, Controller, Post } from '@nestjs/common';

import { SignUpDTO } from '../users/DTO/signup.dto';
import { AuthService } from './auth.service';
import { SigninDTO } from '../users/DTO/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDTO: SignUpDTO) {
    return this.authService.signUp(signupDTO);
  }

  @Post('signin')
  signin(@Body() signinDTO: SigninDTO) {
    return this.authService.login(signinDTO);
  }
}
