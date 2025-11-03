import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceRequestDto {
  @ApiProperty({
    description: 'The amount to add or subtract from the balance',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
}

export class AddBalanceRequestDto extends UpdateBalanceRequestDto {
  @ApiProperty({
    description: 'The amount to add to the balance',
    example: 50.00,
    minimum: 0.01,
  })
  amount: number;
}

export class SubtractBalanceRequestDto extends UpdateBalanceRequestDto {
  @ApiProperty({
    description: 'The amount to subtract from the balance',
    example: 25.75,
    minimum: 0.01,
  })
  amount: number;
}
