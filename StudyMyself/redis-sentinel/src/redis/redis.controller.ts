import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  async setCache(
    @Body('key') key: string,
    @Body('value') value: any,
    @Body('ttl') ttl: number,
  ): Promise<string> {
    await this.redisService.setCache(key, value, ttl);
    return `Key "${key}" has been set with value "${value}" and TTL of ${ttl} seconds.`;
  }

  @Get('get/:key')
  async getCache(@Param('key') key: string): Promise<any> {
    const value = await this.redisService.getCache(key);
    if (value) {
      return `Value for key "${key}" is "${value}".`;
    } else {
      return `Key "${key}" not found or has expired.`;
    }
  }

  @Delete('delete/:key')
  async deleteCache(@Param('key') key: string): Promise<string> {
    await this.redisService.deleteCache(key);
    return `Key "${key}" has been deleted.`;
  }
}
