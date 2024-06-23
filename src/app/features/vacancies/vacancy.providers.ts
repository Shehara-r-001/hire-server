import { DataSource } from 'typeorm';

import { Vacancy } from './entities/vacancy.entity';
import { DATA_SOURCE } from '../../core/constants/db.constants';
import { VACANCY_REPOSITORY } from '../../core/constants/repositories.constants';

export const vacancyProviders = [
  {
    provide: VACANCY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vacancy),
    inject: [DATA_SOURCE],
  },
];
