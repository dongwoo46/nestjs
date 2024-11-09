// src/queue/queue.controller.ts
import { Controller, Get } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('counts')
  async getJobCounts() {
    const counts = await this.queueService.getJobCounts();
    return counts;
  }

  @Get('all-jobs')
  async getAllJobs() {
    const jobs = await this.queueService.getAllJobs();
    return jobs;
  }

  @Get('waiting-jobs')
  async getWaitingJobs() {
    const waitingJobs = await this.queueService.getJobsByStatus('waiting');
    return waitingJobs;
  }

  @Get('active-jobs')
  async getActiveJobs() {
    const activeJobs = await this.queueService.getJobsByStatus('active');
    return activeJobs;
  }

  @Get('completed-jobs')
  async getCompletedJobs() {
    const completedJobs = await this.queueService.getJobsByStatus('completed');
    return completedJobs;
  }

  @Get('failed-jobs')
  async getFailedJobs() {
    const failedJobs = await this.queueService.getJobsByStatus('failed');
    return failedJobs;
  }
}
