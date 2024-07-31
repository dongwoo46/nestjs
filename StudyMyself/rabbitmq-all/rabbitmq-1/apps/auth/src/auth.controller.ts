import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/test')
  getHello(): string {
    return this.authService.getHello();
  }

  // 메시지 확인자
  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const content = message.content.toString();
    const data = JSON.parse(content);

    // 여기에 원하는 로직을 추가하세요.
    // 예: 데이터 처리, 다른 API 호출 등
    console.log('Received data:', data);

    // 예: 다른 API로 데이터를 보내기
    // await axios.post('http://example.com/api', data);

    // 메시지를 수신했음을 RabbitMQ에 알림
    channel.ack(message);

    return { status: 'success' };
  }
}
