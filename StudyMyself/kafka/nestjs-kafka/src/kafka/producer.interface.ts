export interface IProducer {
  connect: () => Promise<void>; // message broker랑 연결
  disconnect: () => Promise<void>; // message broker랑 연결해제
  produce: (message: any) => Promise<void>;
}
