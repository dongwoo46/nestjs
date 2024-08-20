// src/sse/sse.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { SseService } from './sse.service';
import { Request, Response } from 'express';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('connect')
  connect(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.sseService.addClient(res);

    req.on('close', () => {
      this.sseService.removeClient(res);
      res.end();
    });
  }
}
