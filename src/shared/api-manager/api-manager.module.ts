import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiManager } from './api-manager.service';

@Module({
  imports: [HttpModule],
  providers: [ApiManager],
  exports: [ApiManager],
})
export class ApiManagerModule {}
