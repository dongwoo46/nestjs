import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 모든 게시글 조회
  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  // 특정 게시글 조회
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Article> {
    return this.articleService.findOne(id);
  }

  // 게시글 생성
  @Post()
  async create(
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Article> {
    return this.articleService.create(title, content);
  }

  // 게시글 수정
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<Article> {
    return this.articleService.update(id, title, content);
  }

  // 게시글 삭제
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.articleService.remove(id);
  }
}
