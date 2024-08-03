import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'mariadb')
    private readonly mariadbRepository: Repository<User>,
    @InjectRepository(User, 'postgres')
    private readonly postgresRepository: Repository<User>,
    @InjectRepository(User, 'sqlite')
    private readonly sqliteRepository: Repository<User>,
    @InjectDataSource('mariadb')
    private readonly mariadbDataSource: DataSource,
    @InjectDataSource('postgres')
    private readonly postgresDataSource: DataSource,
    @InjectDataSource('sqlite')
    private readonly sqliteDataSource: DataSource,
  ) {}

  async createUserDb(createUserDto: CreateUserDto): Promise<string> {
    const user1 = this.mariadbRepository.create(createUserDto);
    const user2 = this.postgresRepository.create(createUserDto);
    const user3 = this.sqliteRepository.create(createUserDto);
    await this.mariadbRepository.save(user1);
    await this.postgresRepository.save(user2);
    await this.sqliteRepository.save(user3);
    return 'user가 db에 save 되었습니다.';
  }

  async insertUserWithQuery(createUserDto: CreateUserDto): Promise<string> {
    const { username, password, description } = createUserDto;
    await this.sqliteDataSource.query(
      `INSERT INTO user (username, password, description) VALUES (?, ?, ?)`,
      [username, password, description],
    );
    await this.mariadbDataSource.query(
      `INSERT INTO user (username, password, description) VALUES (?, ?, ?)`,
      [username, password, description],
    );
    await this.postgresDataSource.query(
      `INSERT INTO "user" (username, password, description) VALUES ($1, $2, $3)`,
      [username, password, description],
    );
    return 'user가 db에 insert 되었습니다.';
  }

  // 추가적인 서비스 메서드 정의
}
