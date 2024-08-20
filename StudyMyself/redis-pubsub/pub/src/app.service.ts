import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  // app.module에서 MATH_SERVICE로 채널 등록
  constructor(@Inject('MATH_SERVICE') private redisClient: ClientProxy) {}

  // sum 채널로 data를 보낸다. 
  getSummation(): Observable<number> {
    const data: number[] = [1, 2, 3, 4, 5, 6];
    return this.redisClient.send('sum', data);
  }

}
