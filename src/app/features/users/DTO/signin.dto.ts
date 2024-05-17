import { PickType } from '@nestjs/swagger';

import { SignUpDTO } from './signup.dto';

export class SigninDTO extends PickType(SignUpDTO, ['email', 'password']) {}
