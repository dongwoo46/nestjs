import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TRANSCODE_QUEUE } from './constants';
import { TranscodeConsumer } from './transcode.consumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    // 어떤 queue를 등록할지 정한다.
    BullModule.registerQueue({
      name: TRANSCODE_QUEUE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TranscodeConsumer],
})
export class AppModule {}
