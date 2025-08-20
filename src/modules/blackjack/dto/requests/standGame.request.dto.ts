import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StandGameRequestDto {
  @ApiProperty({
    description: 'ID of the game to stand',
    example: 'abc123',
  })
  @IsString()
  gameId: string;
}
