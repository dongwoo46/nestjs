import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './create-order-request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './order-created.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  //이벤트 내보내기
  createOrder({ userId, price }: CreateOrderRequest) {
    // 새 주문 생성시 billingClient에 kafka topic을 사용해 메시지를 보낸다.
    this.billingClient.emit(
      'order_created', // consumer가 받을때 사용할 pattern
      new OrderCreatedEvent('123', userId, price),
    );
  }
}
