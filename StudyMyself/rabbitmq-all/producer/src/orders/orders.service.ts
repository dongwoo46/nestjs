import { Inject, Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDERS_SERVICE') private rabbitClient: ClientProxy) {}

  placeOrder(order: OrderDto) {
    this.rabbitClient.emit('order-placed', order); // rabbitmq에 메시지 보내기
    return { message: 'order placed!' };
  }

  getOrders() {
    return this.rabbitClient
      .send({ cmd: 'fetch-orders' }, {})
      .pipe(timeout(5000));
  }
}
