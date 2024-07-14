// src/sse/sse.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
  private clients: Response[] = [];

  addClient(res: Response) {
    this.clients.push(res);
  }

  removeClient(res: Response) {
    this.clients = this.clients.filter((client) => client !== res);
  }

  sendEvent(event: string, data: any) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => client.write(message));
  }
}
