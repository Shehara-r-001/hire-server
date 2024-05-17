import { DataSource } from 'typeorm';

import { DATA_SOURCE } from 'src/app/core/constants/db.constants';
import { COMPANY_REPOSITORY } from 'src/app/core/constants/repositories.constants';
import { Company } from './entities/company.entity';

export const companyProviders = [
  {
    provide: COMPANY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
    inject: [DATA_SOURCE],
  },
];
