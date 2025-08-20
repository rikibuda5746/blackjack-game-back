import { Expose } from 'class-transformer';
import { GameStatus } from '../../enums/game-status.enum';
import { GameResult } from '../../enums/game-result.enum';

export class GameResponseDto {
  @Expose()
  gameId: string;

  @Expose()
  playerCards: string[];

  @Expose()
  dealerCards: string[];

  @Expose()
  status: GameStatus;

  @Expose()
  result?: GameResult;
}
