import { Injectable, Inject } from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClient) {}

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return JSON.parse(value as string);
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }
}
