import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceEntity } from '../entities/balance.entity';
import { BaseRepository } from '@src/common/repositories/base-repository';

@Injectable()
export class BalanceRepository extends BaseRepository<
BalanceEntity,['userId', 'amount']> 
{
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
  ) {
    super(balanceRepository);
  }

  protected filterStrategies() {
    return {
      userId: (value: number) => ({
        userId: value,
      }),
      amount: (value: number) => ({
        amount: value,
      }),
    };
  }

  protected getRelations(): string[] {
    return [];
  }

}
