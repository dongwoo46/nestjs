import { ConfigFactory, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: configService.get<'mysql' | 'mariadb'>('DATABASE_TYPE', 'mysql'),
    host: process.env.DB_HOST || 'localhost', // MySQL 호스트
    port: parseInt(process.env.DB_PORT, 10) || 3306, // MySQL 포트
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'test',
    entities: [__dirname + '/../**/*.entity.{js,ts}', Article],
    synchronize: true,
    dropSchema: true,
    logging: true,
  };
};
