import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginByTokenRequestDto {
  @ApiProperty({
    description: 'The access token of the user',
    example: 'accessToken',
  })
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token of the user',
    example: 'refreshToken',
  })
  @IsNotEmpty()
  refreshToken: string;
}
