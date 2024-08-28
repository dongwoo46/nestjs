import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order/domain/entities/order.entity';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { Article } from './article/entities/article.entity';
import { User } from './user/entities/user.entity';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      entities: [Article, Order, User],
      synchronize: true,
      dropSchema: false,
    }),
    ArticleModule,
    UserModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
