import { DataSource } from 'typeorm';
import { SnakeCaseNamingStrategy } from '../shared/repositories/snakeCaseNaming.strategy';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'pgtl_test',
  entities: [__dirname + '/../modules/core/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  namingStrategy: new SnakeCaseNamingStrategy(),
  synchronize: false,
});
