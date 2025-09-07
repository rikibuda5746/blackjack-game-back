import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StandGameRequestDto {
  @ApiProperty({
    description: 'ID of the game to stand',
    example: 'abc123',
  })
  @IsNumber()
  gameId: number;
}
