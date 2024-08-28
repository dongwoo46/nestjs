import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateArticleDto } from './../dto/create-article.dto';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  views: number;

  protected constructor() {}

  static createArticle({ title, content, user }: CreateArticleDto): Article {
    const article = new Article();
    article.title = title;
    article.content = content;
    if (user) {
      article.user = user;
    }

    return article;
  }
}
