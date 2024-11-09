import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QueueService } from './queue.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // 클라이언트 도메인으로 변경 가능
  },
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
  ) {}

  // 클라이언트 연결 처리
  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id); // 연결 시 로그

    // 클라이언트가 `createOrder` 이벤트를 통해 주문을 전송
    client.on('createOrder', async (orderData) => {
      // QueueService를 통해 주문을 대기열에 추가
      console.log('Received createOrder event with data:', orderData); // 수신된 데이터 출력

      const job = await this.queueService.addOrderToQueue(orderData, client.id);

      // 대기열 위치와 예상 대기 시간 계산
      const position = await this.queueService.getQueuePosition(job.id);
      const estimatedWaitTime =
        await this.queueService.estimateWaitTime(position);
      // 클라이언트에게 대기열 상태를 실시간으로 전송
      this.sendQueueUpdate(client.id, {
        position,
        estimatedWaitTime,
      });

      // 전체 대기열 상태 업데이트 (옵션)
      this.sendQueueStatus();
    });
  }

  // 클라이언트 연결 해제 처리
  async handleDisconnect(client: Socket) {
    // QueueService를 통해 해당 클라이언트의 주문을 대기열에서 제거
    await this.queueService.removeOrderFromQueue(client.id);

    // 전체 대기열 상태를 업데이트하여 모든 클라이언트에게 전송
    this.sendQueueStatus();
  }

  // 모든 클라이언트에게 대기열 상태 전송
  async sendQueueStatus() {
    const count = await this.queueService.getQueueCount();
    this.server.emit('queueStatus', { count }); // 클라이언트로 대기 수 전송
  }

  // 특정 클라이언트에게 실시간 메시지 전송
  sendQueueUpdate(clientId: string, data: any) {
    this.server.to(clientId).emit('queueUpdate', data);
  }
}
