import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLoggerService } from './logger/my-logger.service';
import { MyLogger } from './logger/my-logger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 의존성 주입 사용 불가 단순히 클래스만 넣어주는 것
    // logger: new MyLogger(),

    // 사용자 정의 로그가 첨부될때까지 기다리는 것 처음부터 사용자정의 로거 사용
    bufferLogs: true,
  });
  // nest에서 사용할 로거의 인스턴스를 주입(싱글톤) ->
  // 다른곳에서   private readonly logger = new Logger(MyService.name); 이렇게 써줘야함
  // app.useLogger(app.get(MyLogger));

  //처음부터 윈스턴 로그 쓰기
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Passport 초기화
  app.use(passport.initialize());

  // express-session 필요함
  // app.use(passport.session());
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
