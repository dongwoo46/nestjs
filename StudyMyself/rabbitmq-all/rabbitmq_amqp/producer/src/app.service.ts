// app.service.ts
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

  async sendMessage(msg: any) {
    // 메시지를 문자열로 변환한 후 버퍼로 변환합니다.
    const messageBuffer = Buffer.from(JSON.stringify(msg));
    this.channel.publish('fanout_exchange', '', messageBuffer);
    console.log('Message sent:', msg);
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
