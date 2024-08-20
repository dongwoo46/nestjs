import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Redis에 데이터를 저장합니다.
   * @param key 저장할 키
   * @param value 저장할 값
   * @param ttl (선택 사항) 데이터의 TTL(Time To Live) 값, 초 단위
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Redis에서 데이터를 가져옵니다.
   * @param key 가져올 키
   * @returns 가져온 값
   */
  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }
}
