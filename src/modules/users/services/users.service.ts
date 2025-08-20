import { Injectable } from '@nestjs/common';
import { LogService } from '@src/core/logger/log-service';
import { plainToInstance } from 'class-transformer';
import { GetUsersQueryDto } from '../dto/queries/get-users.query.dto';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserRequestDto } from '../dto/requests/create-user.request.dto';
import { PaginationResponseDto } from '@src/shared/dtos/pagination.response.dto';
import { PaginationTransformer } from '@src/shared/transformers/pagination.transformer';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

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

  async findOne(criteria: Partial<UserEntity>): Promise< UserResponseDto | null> {
    return await this.userRepository.getOneByQuery(criteria);
  }

  async checkPassword(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.getOneByQuery({ email });
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.password) && email === user.email;
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
