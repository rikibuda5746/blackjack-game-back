import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '@src/core/guards/jwt-auth.guard';
import { AllExceptionsFilter } from '@src/core/exceptions/http-exception.filter';
import { LoggerInterceptor } from '@src/core/interceptors/logger.interceptor';
import { TimeoutInterceptor } from '@src/core/interceptors/timeout.interceptor';
import { DatabaseModule } from '@src/database/database.module';
import { DatabaseService } from '@src/database/database.service';
import { AppConfigModule } from '../config/app-config.module';
import { LogModule } from './logger/log.module';
import { AppRedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [
    AppConfigModule,
    ConfigModule,
    LogModule,
    AppRedisModule,
    JwtModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: DatabaseService,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AppConfigModule, LogModule, ConfigModule, JwtModule, AppRedisModule],
})
export class CoreModule {}
