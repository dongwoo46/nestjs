import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  sum(data: number[]): number {
    return (data || []).reduce((a, b) => Number(a) + Number(b));
  }
}
