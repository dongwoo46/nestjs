// src/order/order.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 모든 주문 조회
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  // 특정 주문 조회
  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  // 새 주문 생성
  @Post()
  async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.createOrder(orderData);
  }

  // 주문 업데이트
  @Put(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body() orderData: Partial<Order>,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, orderData);
  }

  // 주문 삭제
  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}
