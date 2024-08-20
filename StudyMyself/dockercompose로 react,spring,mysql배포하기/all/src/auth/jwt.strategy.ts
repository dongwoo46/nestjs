import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { jwtConstants } from './constants';

export interface Payload {
  userId: number;
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더 Authentication 에서 Bearer 토큰으로부터 jwt를 추출함
      ignoreExpiration: true, // jwt 만료를 무시할 것인지 (기본값: false -> 무시안함)
      secretOrKey: jwtConstants.secret,
    });
  }
  private readonly logger = new Logger();

  async validate(payload: Payload & { exp: number }) {
    const { userId, email, exp } = payload;
    const expire = exp * 1000; //만료기간

    if (userId && email) {
      if (Date.now() < expire) {
        // 토큰 유효
        return { userId, email };
      }
      // payload에 정보는 잘 있으나 token 만료
      throw new HttpException('토큰 만료', HttpStatus.UNAUTHORIZED);
    }
    // Payload에 정보가 없음
    throw new HttpException('접근 오류', HttpStatus.FORBIDDEN);
  }
}
