import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class AppService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://user:password@localhost:5672');
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange('fanout_exchange', 'fanout', {
      durable: false,
    });
  }

  async getRabbitMqMessage() {
    const q = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q.queue, 'fanout_exchange', '');
    await this.channel.consume(q.queue, (msg) => {
      if (msg.content) {
        console.log(' [x] %s', msg.content.toString());
      }
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
