import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceController } from './controllers/balance.controller';
import { BalanceService } from './services/balance.service';
import { BalanceRepository } from './repositories/balance.repository';
import { BalanceEntity } from './entities/balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
  exports: [BalanceService],
})
export class BalanceModule {}
