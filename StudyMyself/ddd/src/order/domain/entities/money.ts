import { Getter } from 'src/decorators/getter.decorator';

@Getter()
export class Money {
  private value: number;

  protected constructor() {}

  public static createMoney(value: number): Money {
    const money = new Money();
    money.value = value;
    return money;
  }

  add(money: Money): Money {
    return Money.createMoney(this.value + money.value);
  }

  multiply(multiplier: number): Money {
    console.log('asdf');
    return Money.createMoney(this.value * multiplier);
  }

  test(multiplier: number): Money {
    return Money.createMoney(1111);
  }

  get getValue(): number {
    return this.value;
  }
}
