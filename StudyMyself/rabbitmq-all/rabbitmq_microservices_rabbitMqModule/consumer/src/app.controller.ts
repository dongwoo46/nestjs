import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrderDto } from './order.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order-placed') // producer가 보낼때 쓰는 pattern과 동일하게
  handleOrderPlaced(@Payload() order: OrderDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);
    return this.appService.handleOrderPlaced(order);
  }

  @MessagePattern({ cmd: 'fetch-orders' }) // producer가 보낼때 쓰는 cmd pattern과 동일하게
  getOrders() {
    return this.appService.getOrders();
  }

  @EventPattern('orders-exchange')
  async handleGetAllConsumer(@Payload() data: Buffer) {
    return this.appService.getAllConsumer(data);
  }
}
