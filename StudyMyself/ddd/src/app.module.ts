import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { OrderModule } from './order/order.module';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order/domain/entities/order.entity';
import { Post } from './post/entities/post.entity';
import { MemberEntity } from './member/domain/entities/member.entity';

@Module({
  imports: [
    MemberModule,
    OrderModule,
    PostModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [MemberEntity, Order, Post],
      synchronize: true,
      dropSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
