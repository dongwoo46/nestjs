import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();

// main.ts 내에서 마이크로서비스 설정: 마이크로서비스가 독립적으로 구동되며, HTTP 서버로서 동작하지 않을 때 사용됩니다.
// Redis, Kafka 등의 메시지 브로커와 통신하는 독립적인 마이크로서비스로서 동작합니다.
