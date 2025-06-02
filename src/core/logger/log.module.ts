import { Module } from '@nestjs/common';
import { LogService } from '@src/core/logger/log-service';

@Module({
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
