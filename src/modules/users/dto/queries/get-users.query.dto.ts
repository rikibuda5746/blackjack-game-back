import { PaginationQueryDto } from '@src/shared/dtos/pagination.query.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetUsersQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
