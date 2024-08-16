import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache(key: string, value: any, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async getCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async deleteCache(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
