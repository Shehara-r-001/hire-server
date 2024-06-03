import { Injectable, Inject } from '@nestjs/common';
import { Redis as RedisClient } from 'ioredis';

type CacheKeyType = 'user' | 'company';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClient) {}

  private getCacheKey(type: CacheKeyType, id: string) {
    return `${type}-${id}`;
  }

  /**
   * get cached data
   * @param type type of data to cache
   * @param id unique identifier
   * @returns parsed cached value or null
   */
  async get(type: CacheKeyType, id: string): Promise<any> {
    const key = this.getCacheKey(type, id);
    const value = await this.client.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(`Failed to parse cached value for key ${key}:`, error);
        return null;
      }
    }
    return null;
  }

  /**
   * cache data
   * @param type type of data to cache
   * @param id unique identifier
   * @param value data to cache
   * @param ttl time to live in seconds
   */
  async set<T>(type: CacheKeyType, id: string, value: T, ttl: number) {
    const key = this.getCacheKey(type, id);
    return await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  /**
   * remove cached key/value pair/s
   * @param type type of data to cache
   * @param id unique identifier
   * @param keys
   */
  async remove(type: CacheKeyType, ids: string[]) {
    const keys = ids.map((id) => this.getCacheKey(type, id));
    await this.client.del(keys);
  }

  /**
   * check if a key exists
   * @param type type of data to cache
   * @param id unique identifier
   * @returns True if key exists, otherwise false
   */
  async isExist(type: CacheKeyType, id: string) {
    const key = this.getCacheKey(type, id);
    return (await this.client.exists(key)) > 0 ? true : false;
  }

  /**
   * returns list of keys for a matching pattern
   * @param pattern
   * @returns list of keys matches the pattern
   */
  async findKeys(pattern: string) {
    return await this.client.keys(pattern);
  }
}
