import {
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestDto  {
  @ApiProperty({
    description: 'refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiO',
  })
  @IsString()
  refreshToken: string;
}
