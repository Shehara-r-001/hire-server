import * as bcrypt from 'bcryptjs';

export const bcryptString = async (value: string) => {
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(value, saltOrRounds);

  return hashedPassword;
};
