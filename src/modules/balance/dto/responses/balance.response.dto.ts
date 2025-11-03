import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty({
    description: 'The user ID associated with this balance',
    example: 1,
  })
  @Expose()
  userId: number;

  @ApiProperty({
    description: 'The current balance amount',
    example: 150.75,
  })
  @Expose()
  amount: number;
}
