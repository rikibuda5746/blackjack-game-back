import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/responses/user.response.dto';

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
