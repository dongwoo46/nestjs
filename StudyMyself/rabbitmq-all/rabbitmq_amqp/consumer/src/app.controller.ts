// app.controller.ts
import { Controller, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://user:password@localhost:5672');
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange('fanout_exchange', 'fanout', {
      durable: false,
    });

    // 첫 번째 큐에서 메시지 수신
    const q1 = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q1.queue, 'fanout_exchange', '');
    this.channel.consume(q1.queue, (msg) => {
      if (msg !== null) {
        console.log('Received in queue 1:', msg.content.toString());
        this.channel.ack(msg);
      }
    });

    // 두 번째 큐에서 메시지 수신
    const q2 = await this.channel.assertQueue('', { exclusive: true });
    await this.channel.bindQueue(q2.queue, 'fanout_exchange', '');
    this.channel.consume(q2.queue, (msg) => {
      if (msg !== null) {
        console.log('Received in queue 2:', msg.content.toString());
        this.channel.ack(msg);
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
