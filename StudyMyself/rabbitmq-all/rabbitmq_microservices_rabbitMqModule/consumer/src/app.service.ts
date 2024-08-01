import { Injectable } from '@nestjs/common';
import { OrderDto } from './order.dto';
import * as amqp from 'amqplib';

@Injectable()
export class AppService {
  private url = 'amqp://user:password@localhost:5672';
  orders: OrderDto[] = [];

  handleOrderPlaced(order: OrderDto) {
    console.log(`received a new order - customer: ${order.email}`);
    this.orders.push(order);
    //Send email 주문을 확인하는 요청 보내기 가능 producer와 consumer는 독립적
  }

  getOrders() {
    return this.orders;
  }

  async getAllConsumer(data: Buffer) {
    const connection = await amqp.connect(this.url);
    const channel = await connection.createChannel();

    await channel.assertExchange('orders-exchange', 'fanout', {
      durable: false,
    });

    const q = await channel.assertQueue('', { exclusive: true });
    console.log(`Waiting for messages in queue: ${q.queue}`);

    // queue와 exchange 바인딩
    await channel.bindQueue(q.queue, 'orders-exchange', '');

    channel.consume('orders-queue', (msg) => {
      if (msg.content) console.log('THe message is: ', msg.content.toString());
    });
    const message = data.toString();
    console.log('Received order:', message);
  }
}
