import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'orders-queue', // 사용할 queue이름
        noAck: false, //소비자는 메시지를 수신한 후 ack를 호출하여 RabbitMQ에게 메시지가 성공적으로 처리되었음을 알림
        // queueOptions: {
        //   durable: false, //RabbitMQ 서버가 재시작되면 이 큐와 큐에 저장된 메시지가 사라집니다
        // },
      },
    },
  );
  app.listen();
}
bootstrap();
