import { Inject, Injectable } from '@nestjs/common';
import { OrderCreatedEvent } from './order-created.event';
import { ClientKafka } from '@nestjs/microservices';
import { GetUserRequestDto } from './get-user-request.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // handleOrderCreated(orderCreatedEvent: OrderCreatedEvent) {
  //   console.log(orderCreatedEvent);
  // }

  handleOrderCreated(orderCreatedEvent: OrderCreatedEvent) {
    this.authClient
      .send('get_user', new GetUserRequestDto(orderCreatedEvent.userId))
      .subscribe((user) => {
        console.log(
          `billing user with stripe ID ${user.stripeUserId} a price of $${orderCreatedEvent.price}`,
        );
      });
  }
}
