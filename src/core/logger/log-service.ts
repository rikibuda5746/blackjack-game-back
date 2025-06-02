import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService {
  private logger: winston.Logger;
  private context?: string;

  constructor(private readonly appConfigService: AppConfigService) {
    this.logger = winston.createLogger({
      level: this.appConfigService.logLevel || 'info',
      defaultMeta: { context: 'App' },
      format: format.combine(
        format.splat(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize({ all: true }),
        format.printf(({ timestamp, level, message, context, ...meta }) => {
          const ctx = context || this.context || 'App';
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `[${timestamp}] [${ctx}] [${level}] ${message} ${metaStr}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        ...(this.appConfigService.logToFile
          ? [
              new winston.transports.File({
                filename: 'logs/combined.log',
                level: 'info',
                format: format.combine(format.timestamp(), format.json()),
              }),
              new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: format.combine(format.timestamp(), format.json()),
              }),
            ]
          : []),
      ],
    });
  }

  setContext(context: string): void {
    this.context = context;
  }

  private prepareMessageAndMeta(
    message: string,
    maybeMeta?: any,
  ): { message: string; meta: object } {
    if (
      maybeMeta === undefined ||
      maybeMeta === null ||
      typeof maybeMeta === 'string' ||
      typeof maybeMeta === 'number' ||
      typeof maybeMeta === 'boolean'
    ) {
      return { message: `${message} ${maybeMeta ?? ''}`.trim(), meta: {} };
    }
    if (typeof maybeMeta === 'object') {
      return { message, meta: maybeMeta };
    }
    return { message, meta: {} };
  }

  error(message: string, maybeMeta?: any): void {
    const { message: msg, meta } = this.prepareMessageAndMeta(
      message,
      maybeMeta,
    );
    this.logger.error(msg, { context: this.context, ...meta });
  }

  warn(message: string, maybeMeta?: any): void {
    const { message: msg, meta } = this.prepareMessageAndMeta(
      message,
      maybeMeta,
    );
    this.logger.warn(msg, { context: this.context, ...meta });
  }

  log(message: string, maybeMeta?: any): void {
    const { message: msg, meta } = this.prepareMessageAndMeta(
      message,
      maybeMeta,
    );
    this.logger.info(msg, { context: this.context, ...meta });
  }

  debug(message: string, maybeMeta?: any): void {
    const { message: msg, meta } = this.prepareMessageAndMeta(
      message,
      maybeMeta,
    );
    this.logger.debug(msg, { context: this.context, ...meta });
  }
}
