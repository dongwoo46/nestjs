// src/queue/queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueGateway } from './queue.gateway';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('orderQueue') private readonly orderQueue: Queue,
    private readonly gateway: QueueGateway,
  ) {}

  // 각 작업 상태별 작업 수 가져오기
  async getJobCounts() {
    return await this.orderQueue.getJobCounts();
  }

  // 특정 상태의 작업 목록 가져오기
  // src/queue/queue.service.ts
  async getJobsByStatus(status: 'waiting' | 'completed' | 'active' | 'failed') {
    const jobs = await this.orderQueue.getJobs([status]);
    return jobs.map((job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      status,
    }));
  }

  // getAllJobs 함수에서 status를 각각 명시
  async getAllJobs() {
    const waitingJobs = await this.getJobsByStatus('waiting');
    const activeJobs = await this.getJobsByStatus('active');
    const completedJobs = await this.getJobsByStatus('completed');
    const failedJobs = await this.getJobsByStatus('failed');

    return {
      waiting: waitingJobs.map((job) => ({ id: job.id, data: job.data })),
      active: activeJobs.map((job) => ({ id: job.id, data: job.data })),
      completed: completedJobs.map((job) => ({ id: job.id, data: job.data })),
      failed: failedJobs.map((job) => ({ id: job.id, data: job.data })),
    };
  }

  // 주문을 대기열에 추가하고, 위치 정보를 클라이언트에게 전달
  async addOrderToQueue(orderData: Partial<Order>, clientId: string) {
    console.log(`addOrderToQueue ${clientId}`);

    const existingJobs = await this.orderQueue.getJobs(['waiting', 'active']);
    const hasExistingJob = existingJobs.some(
      (job) => job.data.clientId === clientId,
    );

    if (hasExistingJob) {
      console.log(`Order for client ${clientId} is already in the queue.`);
      return null; // 중복 작업 방지
    }

    const job = await this.orderQueue.add('processOrder', {
      ...orderData,
      clientId,
    });
    const position = await this.getQueuePosition(job.id);
    this.gateway.sendQueueUpdate(clientId, { position });
    return job;
  }

  // 특정 작업의 대기열 위치 계산
  async getQueuePosition(jobId: string): Promise<number | null> {
    const jobs = await this.orderQueue.getJobs(['waiting']);
    const position = jobs.findIndex((job) => job.id === jobId);
    return position >= 0 ? position + 1 : null;
  }

  // 대기열에서 주문 제거
  async removeOrderFromQueue(clientId: string) {
    const jobs = await this.orderQueue.getJobs(['waiting', 'active']);
    for (const job of jobs) {
      if (job.data.clientId === clientId) {
        await job.remove();
      }
    }
  }

  // 현재 대기열 작업 수 반환
  async getQueueCount(): Promise<number> {
    return await this.orderQueue.count();
  }

  async estimateWaitTime(queuePosition: number | null): Promise<number> {
    const averageProcessingTime = 5; // 평균 작업 처리 시간 (초 단위 예: 5초)
    return queuePosition ? averageProcessingTime * (queuePosition - 1) : 0;
  }
}
