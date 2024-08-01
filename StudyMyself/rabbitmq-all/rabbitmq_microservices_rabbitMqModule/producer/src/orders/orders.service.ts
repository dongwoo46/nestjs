import { Inject, Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import * as amqp from 'amqplib';

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

  async getAllConsumer(message: string) {
    const connection = await amqp.connect(
      'amqp://user:password@localhost:5672',
    );

    const channel = await connection.createChannel();

    // 사용하기위한 exchange소개
    await channel.assertExchange('orders-exchange', 'fanout', {
      durable: false,
    });

    //  주어진 키와 함께 publish
    await channel.publish('orders-exchange', '', Buffer.from(message));

    console.log('send: ', message);
    // rabbitmq 서버와 연결 종료

    return { message: 'send message rabbitmq' };
  }
}
