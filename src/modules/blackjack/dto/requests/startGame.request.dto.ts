import {
  IsNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartGameRequestDto  {
  @ApiProperty({
    description: 'Amount of the bet for the new game',
    example: 10,
  })
  @IsNumber()
  betAmount: number;
}
