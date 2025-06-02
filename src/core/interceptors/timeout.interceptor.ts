import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export const TIMEOUT_KEY = 'timeout';
const DEFAULT_TIMEOUT = 10000;

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customTimeout = this.reflector.get<number>(
      TIMEOUT_KEY,
      context.getHandler(),
    );

    const timeoutValue = customTimeout ?? DEFAULT_TIMEOUT;

    return next.handle().pipe(timeout(timeoutValue));
  }
}
