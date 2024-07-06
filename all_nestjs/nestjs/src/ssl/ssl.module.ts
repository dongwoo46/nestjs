import { Module } from '@nestjs/common';
import { SslService } from './ssl.service';
import { SslController } from './ssl.controller';

@Module({
  controllers: [SslController],
  providers: [SslService],
})
export class SslModule {}
