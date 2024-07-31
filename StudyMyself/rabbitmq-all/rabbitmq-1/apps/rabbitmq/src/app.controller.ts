import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  @Get()
  async getUser(@Query('userId') userId: string) {
    return this.authService.send({ cmd: 'get-user' }, { userId });
  }
}
