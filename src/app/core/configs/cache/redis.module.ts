import { Module, Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { redisConfig } from './redis.config';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        try {
          const client = new Redis(redisConfig.connection);

          client.ping();
          Logger.log('Redis client has been connected');

          return client;
        } catch (error) {
          throw new Error('Redis client has not connected');
        }
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
