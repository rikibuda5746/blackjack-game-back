import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LogService } from '@src/core/logger/log-service';
import { plainToInstance } from 'class-transformer';
import { BalanceRepository } from '../repositories/balance.repository';
import { BalanceResponseDto } from '../dto/responses/balance.response.dto';
import { CreateBalanceRequestDto } from '../dto/requests/create-balance.request.dto';
import { UpdateBalanceRequestDto } from '../dto/requests/update-balance.request.dto';

@Injectable()
export class BalanceService {
  constructor(
    private readonly logger: LogService,
    private readonly balanceRepository: BalanceRepository,
  ) {
    this.logger.setContext(`${this.constructor.name}`);
  }

  async createBalance(userId: number, createBalanceDto: CreateBalanceRequestDto): Promise<BalanceResponseDto> {
    
    const balanceEntity = await this.balanceRepository.addOne({
      userId: userId,
      amount: createBalanceDto.amount,
    });
    
    if (!balanceEntity) {
      throw new BadRequestException('Failed to create balance');
    }

    return plainToInstance(BalanceResponseDto, balanceEntity, {
      excludeExtraneousValues: true,
    });
  }

  async updateBalance(userId: number, updateBalanceDto: UpdateBalanceRequestDto): Promise<BalanceResponseDto> {
    const balance = await this.balanceRepository.getOneByQuery({ userId });
    
    if (!balance) {
      throw new NotFoundException('Balance not found');
    }
    
    const newAmount = Number(balance.amount) + Number(updateBalanceDto.amount);

    if (newAmount < 0) {
      throw new BadRequestException('Insufficient funds');
    }

    const updatedBalance = await this.balanceRepository.updateById(balance.id, {
      amount: newAmount,
    });

    if (!updatedBalance) {
      throw new BadRequestException('Failed to update balance');
    }

    return plainToInstance(BalanceResponseDto, updatedBalance, {
      excludeExtraneousValues: true,
    });
  }

  async getBalance(userId: number): Promise<BalanceResponseDto> {
    const balance = await this.balanceRepository.getOneByQuery({ userId });
    
    if (!balance) {
      throw new NotFoundException('Balance not found');
    }

    return plainToInstance(BalanceResponseDto, balance, {
      excludeExtraneousValues: true,
    });
  }
}
