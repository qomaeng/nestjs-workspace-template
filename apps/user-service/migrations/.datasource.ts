import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const entities = [
  './src/**/*.entity.ts',
  // './node_modules/@template/user/src/**/*.entity.ts',
];

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  logging: ['migration'],
  entities:
    !process.env.NODE_ENV || process.env.NODE_ENV === 'local'
      ? entities
      : entities.map((e) => e.replace('/src/', '/dist/').replace(/\.ts$/, '.js')),
  migrations: ['./migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});
