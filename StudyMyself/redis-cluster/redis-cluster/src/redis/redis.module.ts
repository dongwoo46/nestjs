import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { RedisService } from './redis.service'; // RedisService import

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        clusterConfig: {
          nodes: [
            { host: 'redis-master1', port: 7000 },
            { host: 'redis-master2', port: 7001 },
            { host: 'redis-master3', port: 7002 },
            { host: 'redis-slave1', port: 7100 },
            { host: 'redis-slave2', port: 7101 },
            { host: 'redis-slave3', port: 7102 },
          ],
        },
        redisOptions: {
          connectTimeout: 10000,
          retryStrategy: (times) => Math.min(times * 50, 2000),
        },
        ttl: 900,
      }),
    }),
  ],
  controllers: [],
  providers: [RedisService], // RedisService 등록
  exports: [RedisService],
})
export class RedisModule {}
