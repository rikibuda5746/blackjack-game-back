import { Injectable } from '@nestjs/common';
import { LogService } from '@src/core/logger/log-service';
import { plainToInstance } from 'class-transformer';
import { GetUsersQueryDto } from '../dto/queries/get-users.query.dto';
import { UserRepository } from '../repositories/user.repository';
import { PaginationResponseDto } from '@src/shared/dtos/pagination.response.dto';
import { AdminUserResponseDto } from '../dto/responses/admin-user.response.dto';
import { PaginationTransformer } from '@src/shared/transformers/pagination.transformer';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly logger: LogService,
    private readonly userRepository: UserRepository,
  ) {
    this.logger.setContext(`${this.constructor.name}`);
  }

  async getById(id: number): Promise<AdminUserResponseDto> {
    const user = await this.userRepository.getById(id, ['balance']);
    return plainToInstance(AdminUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUsers(
    query: GetUsersQueryDto,
  ): Promise<PaginationResponseDto<AdminUserResponseDto>> {
    const [users, total] = await this.userRepository.getManyByQuery(query, undefined, ['balance']);
    const usersWithBalance = users.map(user => ({
      ...user,
      balance: user.balance?.amount ?? 0,
    }));
    return PaginationTransformer.toPaginationResponseDto(
      usersWithBalance,
      total,
      query.take,
      query.skip,
      AdminUserResponseDto,
    );
  }
}
