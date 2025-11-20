import { Expose } from 'class-transformer';
import { RoleEnum } from '@src/common/enums/role.enum';
import { BalanceResponseDto } from '@src/modules/balance/dto/responses/balance.response.dto';

export class AdminUserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: RoleEnum;

  @Expose()
  balance: BalanceResponseDto;
}
