import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TRANSCODE_QUEUE } from './constants';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async transcode() {
    // delay, timeout 등의 옵션 설정 가능
    await this.transcodeQueue.add({
      fileName: './file.mp3',
    });
  }
}
