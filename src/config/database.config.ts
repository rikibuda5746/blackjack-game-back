import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: Number.parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  schema: process.env.DATABASE_SCHEMA,
}));
