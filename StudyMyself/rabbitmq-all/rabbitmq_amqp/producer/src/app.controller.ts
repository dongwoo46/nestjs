// app.controller.ts
import {
  Controller,
  OnModuleInit,
  OnModuleDestroy,
  Post,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async sendMessageToRabbit(@Body() msg: string) {
    this.appService.sendMessage(msg);
    return { message: 'rabbit mq로 메시지 보내기 성공' };
  }
}
