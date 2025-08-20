import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('auth', () => ({
  salt: Number.parseInt(process.env.SALT),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpires: Number.parseInt(process.env.JWT_ACCESS_EXPIRES),
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpires: Number.parseInt(process.env.JWT_REFRESH_EXPIRES),
}));
