// src/app.module.ts
import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // PostgreSQL 데이터베이스 타입 지정
      host: 'localhost', // PostgreSQL 서버 호스트 (예: 로컬 서버)
      port: 5432, // PostgreSQL 기본 포트
      username: 'postgres', // 데이터베이스 사용자 이름
      password: '1234', // 데이터베이스 비밀번호
      database: 'test', // 사용할 데이터베이스 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 경로 지정
      synchronize: true, // 개발 중에만 true로 설정 (자동으로 스키마 생성)
    }),
    QueueModule,
    OrderModule,
  ],
})
export class AppModule {}
