import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SignUpDTO } from './signup.dto';

export class UpdateUserDTO extends PartialType(SignUpDTO) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
