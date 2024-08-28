import { Article } from 'src/article/entities/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from './../dto/create-user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  protected constructor() {}

  static createUser({ username, password }: CreateUserDto): User {
    const user = new User();
    user.username = username;
    user.password = password;

    return user;
  }
}
