import { DataSource } from 'typeorm';

import { User } from './entities/user.entity';
import { DATA_SOURCE } from 'src/app/core/constants/db.constants';
import { USER_REPOSITORY } from 'src/app/core/constants/repositories.constants';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
