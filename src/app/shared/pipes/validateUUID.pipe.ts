import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import uuid from 'uuid';

/**
 * check if the string provided ia a valid UUID
 */
@Injectable()
export class UuidValidationPipe implements PipeTransform<string> {
  transform(value: string, _metadata: ArgumentMetadata): string {
    if (!uuid.validate(value)) {
      throw new BadRequestException(`${value} is not a valid UUID`);
    }
    return value;
  }
}
