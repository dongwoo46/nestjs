// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // 모든 주문 조회
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  // 특정 주문 ID로 조회
  async findOne(id: number): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } });
  }

  // 새로운 주문 생성
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    console.log(orderData);
    const order = this.orderRepository.create(orderData);
    console.log(order);
    return await this.orderRepository.save(order);
  }

  // 주문 업데이트
  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, orderData);
    return this.findOne(id); // 업데이트된 주문 반환
  }

  // 주문 삭제
  async deleteOrder(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
