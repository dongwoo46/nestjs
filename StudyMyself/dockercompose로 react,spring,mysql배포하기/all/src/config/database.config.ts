import { ConfigFactory, ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
    // type: configService.get<'mysql' | 'mariadb' | 'postgres'>('DATABASE_TYPE'),
    // host: configService.get<string>('DATABASE_HOST'),
    // port: parseInt(configService.get<string>('DATABASE_PORT'), 10),
    // username: configService.get<string>('DATABASE_USER'),
    // password: configService.get<string>('DATABASE_PASSWORD'),
    // database: configService.get<string>('DATABASE_DATABASE'),
    // entities: [__dirname + '/../**/*.entity.{js,ts}'],
    // synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
    // // logging: true,
    // dropSchema: true,
  };
};
// export default registerAs('database', () => ({
//   host: process.env.DATABASE_HOST,
//   port: process.env.DATABASE_PORT || 5432,
// }));
