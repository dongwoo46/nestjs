import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import * as amqp from 'amqplib';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('place-order')
  placeOrder(@Body() order: OrderDto) {
    return this.ordersService.placeOrder(order);
  }

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Post('get-all-consumer')
  getAllConsumer(@Body() data: any) {
    try {
      this.ordersService.getAllConsumer('제발 끝나라~!~!~');
      return {
        message: '메시지가 RabbitMQ를 통해 모든 소비자에게 전송되었습니다.',
      };
    } catch (error) {
      console.error('메시지 전송 실패', error);
      throw error;
    }
  }
}
