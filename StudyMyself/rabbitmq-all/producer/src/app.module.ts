import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE', // inject할때마다 사용되는 토큰 이름
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'orders-queue',
          // queueOptions: {
          //   durable: false,
          // },
        },
      },
    ]),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
