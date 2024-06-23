import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { DATA_SOURCE } from '../../constants/db.constants';

import { User } from '../../../features/users/entities/user.entity';
import { IEnvConfig } from '../../../shared/models/EnvConfig.model';
import { Company } from '../../../features/companies/entities/company.entity';
import { Vacancy } from '../../../features/vacancies/entities/vacancy.entity';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const configServise = new ConfigService<IEnvConfig, true>();
      const dataSource = new DataSource({
        type: 'postgres',
        // driver: 'pg',
        host: configServise.get('DB_HOST'),
        port: configServise.get('DB_PORT'),
        username: configServise.get('DB_USER'),
        password: configServise.get('DB_PASSWORD'),
        database: configServise.get('DB_NAME'),
        entities: [User, Company, Vacancy],
        synchronize: false,
        logging: true,
        entityPrefix: 'hire_',
        ssl: {
          rejectUnauthorized: true,
          ca: configServise.get('CA'),
        },
      });

      return dataSource.initialize();
    },
  },
];
