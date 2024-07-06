import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
import { ClusterService } from './cluster.service';
const cluster = require('cluster');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log(`Worker ${process.pid} started`);
}
ClusterService.clusterize(bootstrap);
//   bootstrap();
// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length;
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('online', (worker) => {
//     console.log(`Worker ${worker.process.pid} is online`);
//   });

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
//   async function bootstrap() {
//     const app = await NestFactory.create(AppModule);
//     await app.listen(3000);
//     console.log(`Worker ${process.pid} started`);
//   }
//   bootstrap();
// }
