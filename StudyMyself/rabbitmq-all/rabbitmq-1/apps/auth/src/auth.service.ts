import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    return 'test endpoint is wokring!';
  }
}
