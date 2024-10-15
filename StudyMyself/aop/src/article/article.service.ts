import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Log } from 'src/shared/decorators/log.decorator';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  // 전체 게시글 조회
  @Log()
  async findAll(): Promise<Article[]> {
    return this.articleRepository.find();
  }

  // 특정 게시글 조회
  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article)
      throw new NotFoundException(`Article with ID ${id} not found`);
    return article;
  }

  // 게시글 생성
  @Log()
  async create(title: string, content: string): Promise<Article> {
    const article = this.articleRepository.create({ title, content });
    return this.articleRepository.save(article);
  }

  // 게시글 수정
  async update(id: number, title: string, content: string): Promise<Article> {
    const article = await this.findOne(id);
    article.title = title;
    article.content = content;
    return this.articleRepository.save(article);
  }

  // 게시글 삭제
  @Log()
  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }
}
