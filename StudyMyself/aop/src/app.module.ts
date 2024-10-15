import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { databaseConfig } from './shared/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AopModule } from '@toss/nestjs-aop';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService를 전역으로 사용 가능하게 설정
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await databaseConfig(configService),
    }),
    ArticleModule,
    AopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
