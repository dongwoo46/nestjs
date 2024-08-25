import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Receiver } from './receiver';
import { Address } from './address';
import { Money } from './money';
import { Getter } from 'src/decorators/getter.decorator';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column((type) => Receiver)
  private receiver: Receiver;

  @Column((type) => Address)
  private address: Address;

  @Column()
  private product: string;

  @Column()
  private orderName: string;

  @Column()
  private quantity: number;

  @Column((type) => Money)
  private price: Money;

  @Column((type) => Money)
  private amounts: Money;

  protected constructor() {}

  static createOrder(
    receiver: Receiver,
    address: Address,
    product: string,
    orderName: string,
    quantity: number,
    price: Money,
  ): Order {
    const order = new Order();
    order.receiver = receiver;
    order.address = address;
    order.product = product;
    order.price = price;
    order.orderName = orderName;
    order.quantity = quantity;

    // 객체가 초기화된 후에 인스턴스 메서드 호출
    order.amounts = order.multiply();

    return order;
  }

  // 여기에 정확하게 메서드가 정의되어 있어야 함
  private calculateAmounts(): Money {
    const amounts = this.price.multiply(this.quantity);
    console.log(amounts);
    return amounts;
  }

  private multiply() {
    const amounts = this.price.getValue * this.quantity;
    const amount = Money.createMoney(amounts);
    return amount;
  }
}
