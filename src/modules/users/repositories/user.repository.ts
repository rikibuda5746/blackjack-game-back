import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@src/common/repositories/base-repository';
import { ILike, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<
  UserEntity,
  ['id', 'email', 'name']
> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  protected filterStrategies() {
    return {
      id: (value: number) => ({
        id: value,
      }),
      email: (value: string) => ({
        email: ILike(`%${value}%`),
      }),
      name: (value: string) => ({
        name: ILike(`%${value}%`),
      }),
    };
  }

  protected getRelations(): string[] {
    return [];
  }
}
