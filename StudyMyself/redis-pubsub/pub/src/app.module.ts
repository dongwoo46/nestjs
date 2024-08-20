import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE', // micro service
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// AppModule 내에서 마이크로서비스 설정: HTTP 서버와 함께 사용하거나 클라이언트로 동작하는 경우에 적합합니다.
//  이 경우, 마이크로서비스는 일반적인 HTTP 서버와 동일한 프로세스에서 실행됩니다.
