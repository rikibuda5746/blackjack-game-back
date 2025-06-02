import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// npm run migration MigrationName

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_SCHEMA,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/src/migrations/*.ts`],
  synchronize: false,
});

export default AppDataSource;
