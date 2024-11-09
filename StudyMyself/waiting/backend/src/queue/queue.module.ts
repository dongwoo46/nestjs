// src/queue/queue.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';
import { QueueController } from './queue.controller';
import { QueueGateway } from './queue.gateway';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'orderQueue',
      defaultJobOptions: {
        attempts: 1,
        removeOnComplete: 100, // 완료된 작업 중 최근 100개만 유지
        removeOnFail: 50,
      },
    }),
    forwardRef(() => OrderModule),
  ],
  providers: [QueueService, QueueProcessor, QueueGateway],
  controllers: [QueueController],
  exports: [QueueService, QueueGateway],
})
export class QueueModule {}
