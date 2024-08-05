import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('order_created') // api-gateway에서 emit때 쓴 topic patter가져오기
  handleOrderCreated(data: any) {
    this.appService.handleOrderCreated(data);
  }

  onModuleInit() {
    // 응답을 구독하는 주체, 인증 서비스에 메시지를 보내고
    this.authClient.subscribeToResponseOf('get_user');
  }
}
