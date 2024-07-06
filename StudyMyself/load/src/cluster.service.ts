import { Injectable } from '@nestjs/common';
import * as os from 'os';
const cluster = require('cluster');

@Injectable()
export class ClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isPrimary) {
      const numCPUs = os.cpus().length;
      console.log(numCPUs);
      console.log(`Primary ${process.pid} is running`);

      // Fork workers
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
      });

      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      //Primary 프로세스가 아닌 경우, 즉 워커 프로세스인 경우 주어진 콜백 함수를 호출
      callback();
    }
  }
}
