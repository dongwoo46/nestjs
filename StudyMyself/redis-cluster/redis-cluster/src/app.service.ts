import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async testRedisCache() {
    console.log('dafsdf');

    await this.redisService.set('testKey', 'testValue', 100);
    const value = await this.redisService.get('testKey');
    console.log('Cached value:', value);
    return value;
  }
}
