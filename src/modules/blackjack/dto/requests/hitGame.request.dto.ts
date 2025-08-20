import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HitGameRequestDto {
  @ApiProperty({
    description: 'ID of the game to hit',
    example: 'abc123',
  })
  @IsString()
  gameId: string;
}
