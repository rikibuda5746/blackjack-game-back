import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LogService } from '@src/core/logger/log-service';

export interface SimpleRequestConfig extends AxiosRequestConfig {
  logContext?: string;
}

@Injectable()
export class ApiManager {
  private readonly TAG = 'ApiManager';

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LogService,
  ) {
    this.logger.log('Initialized', { name: this.TAG });
  }

  request<T = any>(config: SimpleRequestConfig): Observable<T> {
    const context = config.logContext || this.TAG;

    this.logger.log(`Sending request`, { context, config });

    return this.httpService.request<T>(config).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.logger.error('Request failed', {
          context,
          message: error.message,
          status: error.response?.status,
        });
        return throwError(() => error);
      }),
    );
  }
}
