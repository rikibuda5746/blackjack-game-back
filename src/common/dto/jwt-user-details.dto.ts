import { RoleEnum } from '../enums/role.enum';

export class JwtUserDetailsDto {
  id: number;
  role: RoleEnum;
}
