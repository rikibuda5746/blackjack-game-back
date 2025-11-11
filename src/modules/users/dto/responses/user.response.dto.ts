import { Expose } from 'class-transformer';
import { RoleEnum } from '@src/common/enums/role.enum';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: RoleEnum;
}
