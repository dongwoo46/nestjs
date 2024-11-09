// src/queue/queue.processor.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { QueueGateway } from './queue.gateway';
import { QueueService } from './queue.service'; // QueueService import
import { OrderService } from 'src/order/order.service';

@Injectable()
export class QueueProcessor implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;

  constructor(
    private readonly gateway: QueueGateway,
    private readonly queueService: QueueService, // QueueService 주입
    private readonly orderService: OrderService,
  ) {}

  onModuleInit() {
    // Worker를 초기화하여 orderQueue에서 작업을 처리하도록 설정
    this.worker = new Worker(
      'orderQueue',
      async (job: Job) => this.handleJob(job),
      {
        connection: {
          host: 'localhost',
          port: 6379,
        },
      },
    );
  }

  // 작업 이름에 따라 분기 처리하는 메서드
  async handleJob(job: Job) {
    switch (job.name) {
      case 'processOrder': {
        await this.processOrder(job);
        break;
      }
      default: {
        console.log(`Unknown job name: ${job.name}`);
      }
    }
  }

  // 'processOrder' 작업을 처리하는 메서드
  async processOrder(job: Job) {
    console.log(job.data);
    const { clientId, ...orderData } = job.data;

    // QueueService의 addOrderToQueue 메서드를 호출하여 주문을 대기열에 추가
    console.log(
      `Processing order for client: ${clientId} with job ID ${job.id}`,
    );

    const result = await this.orderService.createOrder(orderData);

    // 대기열 위치와 예상 대기 시간을 계산
    const queuePosition = await this.queueService.getQueuePosition(job.id);
    const estimatedWaitTime = await this.estimateWaitTime(queuePosition);

    console.log(`Order for client ${clientId} processed successfully`);

    // 대기열 상태와 남은 시간을 클라이언트로 전달
    this.gateway.sendQueueUpdate(clientId, {
      status: 'ready',
      queuePosition,
      estimatedWaitTime,
    });

    await job.remove(); // 또는 await job.remove();
  }

  // 예상 대기 시간을 계산하는 메서드
  private async estimateWaitTime(
    queuePosition: number | null,
  ): Promise<number> {
    const averageProcessingTime = 5; // 초 단위 (예: 5초)
    return queuePosition ? averageProcessingTime * (queuePosition - 1) : 0;
  }

  // onModuleDestroy를 통해 Worker를 닫아 리소스를 해제
  onModuleDestroy() {
    this.worker.close();
  }
}
