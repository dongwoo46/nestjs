import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  Logger,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { Article } from './entities/article.entity';
import { CursorPageOptionsDto } from './dto/cursor/cursor-page.options';
import { CursorPageDto } from './dto/cursor/cursor-page.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    const test = { name: 'cdragon', email: 'abcd@test.com', password: '1234' };
    const { title, context, name } = createArticleDto;

    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get('cursorPaginate')
  async cursorPaginate(
    @Query() { take = 5, sort, cursorId }: CursorPageOptionsDto,
  ): Promise<CursorPageDto<Article>> {
    return await this.articlesService.cursorBasedPaginated({
      take,
      sort,
      cursorId,
    });
  }

  @Get('/pagination')
  async paginate(
    @Query('page') page: number = 1,
    @Query('take') take: number = 10,
  ): Promise<{
    data: Article[];
    meta: { total: number; page: number; last_page: number };
  }> {
    const pageNumber = parseInt(page as any, 10) || 1;
    const takeNumber = parseInt(take as any, 10) || 10;
    return await this.articlesService.paginate(pageNumber, takeNumber);
  }

  @Get('/search')
  async search(
    @Query('title') title: string = '',
    @Query('context') context: string = '',
  ): Promise<Article[]> {
    Logger.log(title);
    return await this.articlesService.nameSearch(title, context);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
