import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@src/common/repositories/base-repository';
import { Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { GameStatus } from '../models/enums/game-status.enum';
import { GameResult } from '../models/enums/game-result.enum';

@Injectable()
export class GameRepository extends BaseRepository<
  GameEntity,
  ['id', 'userId', 'status', 'result']
> {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {
    super(gameRepository);
  }

  protected filterStrategies() {
    return {
      id: (value: number) => ({
        id: value,
      }),
      userId: (value: number) => ({
        userId: value,
      }),
      status: (value: GameStatus) => ({
        status: value,
      }),
      result: (value: GameResult) => ({
        result: value,
      }),
    };
  }

  protected getRelations(): string[] {
    return [];
  }
  
}
