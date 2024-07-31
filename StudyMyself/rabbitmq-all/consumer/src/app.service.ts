import { Injectable } from '@nestjs/common';
import { OrderDto } from './order.dto';

@Injectable()
export class AppService {
  orders: OrderDto[] = [];

  handleOrderPlaced(order: OrderDto) {
    console.log(`received a new order - customer: ${order.email}`);
    this.orders.push(order);
    //Send email 주문을 확인하는 요청 보내기 가능 producer와 consumer는 독립적
  }

  getOrders() {
    return this.orders;
  }
}
