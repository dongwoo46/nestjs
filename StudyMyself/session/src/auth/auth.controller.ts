// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  BadRequestException,
  Get,
  Session,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { SseService } from 'src/sse/sse.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sseService: SseService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Session() session: Record<string, any>) {
    // 로그인 성공 후 세션에 사용자 정보 저장
    session.userId = req.user.id;

    // SSE를 통해 로그인 이벤트 전송
    this.sseService.sendEvent('login', {
      userId: req.user.id,
      username: req.user.username,
    });

    return req.user;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.username || !createUserDto.password) {
      throw new BadRequestException('Username and password must be provided');
    }
    return this.authService.createUser(createUserDto);
  }

  // 세션 정보 확인 엔드포인트
  @Get('session')
  async getSession(@Request() req) {
    return req.session;
  }

  @Get('session2')
  getSession2(@Session() session: Record<string, any>) {
    // 세션에 저장된 사용자 정보 반환
    return session;
  }
}
