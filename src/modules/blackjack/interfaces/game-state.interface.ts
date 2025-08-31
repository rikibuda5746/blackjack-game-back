import { GameStatus } from '../enums/game-status.enum';
import { GameResult } from '../enums/game-result.enum';

export interface GameState {
  gameId: string;
  playerCards: string[];
  dealerCards: string[];
  deck: string[];
  status: GameStatus;
  result?: GameResult;
}
