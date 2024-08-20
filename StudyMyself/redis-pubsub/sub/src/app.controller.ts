import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // message를 받음
  @MessagePattern('sum')
  async summation(
    @Payload() data: number[],
    @Ctx() context: RedisContext,
  ): Promise<number> {
    console.log(`Received message on channel: ${context.getChannel()}`);

    console.log(`Adding : ${data.toString()}`);
    return this.appService.sum(data);
  }
}
