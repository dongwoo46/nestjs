import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { LoggingDecorator } from 'src/shared/decorators/logging.decorator';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService, LoggingDecorator],
  controllers: [ArticleController],
})
export class ArticleModule {}
