import { Controller, Get, Session } from '@nestjs/common';
import { AppService } from './app.service';
import session from 'express-session';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Session() session): string {
    return this.appService.getHello();
  }
}
