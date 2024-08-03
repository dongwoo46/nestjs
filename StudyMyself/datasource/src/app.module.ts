import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 글로벌 설정으로 모든 모듈에서 환경 변수 접근 가능
    }),
    TypeOrmModule.forRootAsync({
      name: 'mariadb',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('MARIADB_HOST'),
        port: configService.get<number>('MARIADB_PORT'),
        username: configService.get<string>('MARIADB_USER'),
        password: configService.get<string>('MARIADB_PASSWORD'),
        database: configService.get<string>('MARIADB_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'postgres',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'sqlite',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('SQLITE_DATABASE'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}
