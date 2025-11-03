import { Body, Controller, Get, Post, Patch, Put, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BalanceResponseDto } from '../dto/responses/balance.response.dto';
import { BalanceService } from '../services/balance.service';
import { CreateBalanceRequestDto } from '../dto/requests/create-balance.request.dto';
import { UpdateBalanceRequestDto } from '../dto/requests/update-balance.request.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { JwtUserDetailsDto } from '@src/common/dto/jwt-user-details.dto';

@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('create')
  async createBalance(@Body() createBalanceDto: CreateBalanceRequestDto, @CurrentUser() user: JwtUserDetailsDto,): Promise<BalanceResponseDto> {
    return this.balanceService.createBalance(user.id, createBalanceDto);
  }

  @Patch('update')
  async updateBalance(@Body() updateBalanceRequestDto: UpdateBalanceRequestDto, @CurrentUser() user: JwtUserDetailsDto,): Promise<BalanceResponseDto> {
    return this.balanceService.updateBalance(user.id, updateBalanceRequestDto);
  }

  @Get()
  async getBalance(@CurrentUser() user: JwtUserDetailsDto,): Promise<BalanceResponseDto> {
    return this.balanceService.getBalance(user.id);
  }

}
