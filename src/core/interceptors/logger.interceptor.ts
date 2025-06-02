import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogService } from '@src/core/logger/log-service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogService) {
    logger.setContext(`${this.constructor.name}`);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { path, body, query, method } = request;
    const now = Date.now();

    this.logger.log(
      '--- New Request ---\n',
      JSON.stringify({ path, method, body, query }),
    );

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`Request to ${path} completed in ${responseTime}ms`);
      }),
    );
  }
}
