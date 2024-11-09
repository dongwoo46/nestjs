// src/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  transports: ['websocket'],
  reconnection: false, // 자동 재연결 방지
});

export default socket;
