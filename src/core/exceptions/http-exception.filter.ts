import { Catch } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { LogService } from '../logger/log-service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LogService) {
    logger.setContext(this.constructor.name);
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || res;
      }
    } else if (exception && exception.message) {
      message = exception.message;
    }

    this.logger.error('Global error', {
      message,
      status,
      stack: exception.stack,
      path: request.url,
      method: request.method,
    });

    response.status(status).json({
      error: {
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
