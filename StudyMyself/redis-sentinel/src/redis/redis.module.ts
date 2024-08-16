import { RedisController } from './redis.controller';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service'; // RedisService import
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      sentinel: {
        sentinels: [
          { host: 'sentinel-1', port: 26379 },
          { host: 'sentinel-2', port: 26380 },
          { host: 'sentinel-3', port: 26381 },
        ],
        name: 'mymaster',
      },
      password: 'redispassword', // Redis 인증 비밀번호
      db: 0, // Redis DB 번호
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService], // RedisService 등록
  exports: [RedisService],
})
export class RedisModule {}
