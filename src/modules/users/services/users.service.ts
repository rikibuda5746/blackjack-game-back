import { Injectable } from '@nestjs/common';
import { LogService } from '@src/core/logger/log-service';
import { plainToInstance } from 'class-transformer';
import { GetUsersQueryDto } from '../dto/queries/get-users.query.dto';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserRequestDto } from '../dto/requests/create-user.request.dto';
import { PaginationResponseDto } from '@src/shared/dtos/pagination.response.dto';
import { PaginationTransformer } from '@src/shared/transformers/pagination.transformer';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: LogService,
    private readonly userRepository: UserRepository,
  ) {
    this.logger.setContext(`${this.constructor.name}`);
  }

  async addUser(user: CreateUserRequestDto): Promise<UserResponseDto> {
    const createdUser = await this.userRepository.addOne(user);
    return plainToInstance(UserResponseDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.getById(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUsers(
    query: GetUsersQueryDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    const [users, total] = await this.userRepository.getManyByQuery(query);
    return PaginationTransformer.toPaginationResponseDto(
      users,
      total,
      query.take,
      query.skip,
      UserResponseDto,
    );
  }
}
