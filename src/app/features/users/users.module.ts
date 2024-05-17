import { DatabaseModule } from './../../core/configs/db/database.module';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
})
export class UsersModule {}
