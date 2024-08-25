import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './domain/entities/order.entity';
import { Receiver } from './domain/entities/receiver';
import { Address } from './domain/entities/address';
import { Money } from './domain/entities/money';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { receiver, address, product, orderName, quantity, price } =
      createOrderDto;

    const receiverVO = Receiver.createReceiver(
      receiver.name,
      receiver.phoneNumber,
    );
    const addressVO = Address.createAddress(
      address.street,
      address.city,
      address.postalCode,
    );
    const priceVO = Money.createMoney(price.value);

    const order = Order.createOrder(
      receiverVO,
      addressVO,
      product,
      orderName,
      quantity,
      priceVO,
    );

    return this.orderRepository.save(order);
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
