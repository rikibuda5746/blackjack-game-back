import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('application', () => ({
  name: process.env.APP_NAME,
  port: Number.parseInt(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  logToFile: process.env.LOG_TO_FILE,
}));
