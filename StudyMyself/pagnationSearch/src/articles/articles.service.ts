import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Like, Repository } from 'typeorm';
import { CursorPageOptionsDto } from './dto/cursor/cursor-page.options';
import { CursorPageDto } from './dto/cursor/cursor-page.dto';
import { CursorPageMetaDto } from './dto/cursor/cursor-page.meta.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    // const article = new Article();
    // article.context = createArticleDto.context;
    // article.title = createArticleDto.title;

    return this.articleRepository.save(createArticleDto);
  }

  // cursor paginatnion
  async cursorBasedPaginated(
    cursorPageOptionsDto: CursorPageOptionsDto,
  ): Promise<CursorPageDto<Article>> {
    console.log(cursorPageOptionsDto);
    const [articles, total] = await this.articleRepository.findAndCount({
      take: cursorPageOptionsDto.take,
      where: cursorPageOptionsDto.cursorId
        ? {
            id: LessThan(cursorPageOptionsDto.cursorId),
          }
        : null,
      order: {
        id: cursorPageOptionsDto.sort,
      },
    });

    //페이지 당 가져올 데이터 갯수
    const takePerPage = cursorPageOptionsDto.take;
    //페이지가 마지막 데이터를 가지고 있는지에 대한 불리언 값
    const isLastPage = articles.length < takePerPage;

    //meta 정보에 넘겨줄 값이다. default로 true를 유지하고 isLastPage일 시 false를 반환케끔 한다.
    let hasNextData = !isLastPage;
    let cursor: number | null = null;

    if (articles.length > 0) {
      cursor = articles[articles.length - 1].id;
    }

    const cursorPageMetaDto = new CursorPageMetaDto({
      cursorPageOptionsDto,
      total,
      hasNextData,
      cursor,
    });

    return new CursorPageDto(articles, cursorPageMetaDto);
  }

  // offset 기반 pagination
  async paginate(page: number, take: number): Promise<any> {
    // take=> limit, skip => offset - take 몇개의 데이터를 가지고 올것인가 , skip = 몇번재에 있는 데이터를 take만큼 가지고 올 것 인가?
    const [articles, total] = await this.articleRepository.findAndCount({
      take,
      skip: (page - 1) * take,
    });

    return {
      data: articles,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async nameSearch(title: string, context: string): Promise<Article[]> {
    // if (title && !context) {
    //   const articles = await this.articleRepository.find({
    //     where: { title: Like(`%${title}%`) },
    //   });
    //   return articles;
    // }

    // if (context && !title) {
    //   const articles = await this.articleRepository.find({
    //     where: { context: Like(`%${context}%`) },
    //   });
    //   return articles;
    // }

    const articles = await this.articleRepository.find({
      where: { title: Like(`%${title}%`), context: Like(`%${context}%`) },
    });

    return articles;
  }

  async createCustomCursor(cursorIndex: number): Promise<string> {
    const products = await this.articleRepository.find();

    const customCursor = products.map((product) => {
      const id = product.id;
      const price = product.price;
      const customCursor: string =
        String(price).padStart(7, '0') + String(id).padStart(7, '0');
      return customCursor;
    });

    return customCursor[cursorIndex];
  }

  findAll() {
    return this.articleRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
