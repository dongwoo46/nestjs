import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { AppModule } from './app.module';
const session = require('express-session'); // CommonJS 방식
import * as passport from 'passport'; // Passport 불러오기 (ESM 호환)

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Redis 클라이언트 설정
  const redisClient = new Redis({
    port: 6379,
    host: configService.get<string>('REDIS_HOST'),
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: ['https://10.0.17.98'],
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  const sessionSecret = 'asdfasdfasdf';
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({
        client: redisClient,
        ttl: 1800, // 30분 (초 단위)
      }),
      proxy: true,
      cookie: {
        maxAge: 1800000, // 30분 (밀리초 단위)
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? 'none' : 'lax',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
