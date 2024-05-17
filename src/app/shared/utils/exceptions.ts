import { NotFoundException } from '@nestjs/common';

export const ThrowNotFound = <T>(data: T | null, message: string) => {
  if (!data) throw new NotFoundException(message);
};
