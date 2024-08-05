export interface IConsumer {
  connect: () => Promise<void>; // message broker랑 연결
  disconnect: () => Promise<void>; // message broker랑 연결해제
  consume: (onMessage: (message: any) => Promise<void>) => Promise<void>;
}
