import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import * as redis from 'redis';
import { promisify } from 'util';

// const redisClient = redis.createClient();
// const getAsync = promisify(redisClient.get).bind(redisClient);

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session.sessionId) {
      throw new UnauthorizedException('Session ID is missing');
    }

    // const userInfo = await getAsync(session.sessionId);
    // if (!userInfo) {
    //   throw new UnauthorizedException('Invalid session ID');
    // }

    // 세션이 유효한 경우 요청에 사용자 정보를 추가
    // request.user = JSON.parse(userInfo);
    return true;
  }
}
