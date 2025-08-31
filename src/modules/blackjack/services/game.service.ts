import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { LogService } from '@src/core/logger/log-service';
import { StartGameRequestDto } from '../dto/requests/startGame.request.dto';
import { HitGameRequestDto } from '../dto/requests/hitGame.request.dto';
import { StandGameRequestDto } from '../dto/requests/standGame.request.dto';
import { GameResponseDto } from '../dto/responses/game.response.dto';
import { GameState } from '../interfaces/game-state.interface';
import { GameStatus } from '../enums/game-status.enum';
import { GameEngine } from '../utils/game-engine.util';

@Injectable()
export class GameService {
    constructor(
      private readonly logger: LogService,
      @InjectRedis() private readonly redis: Redis, 
    ) {
      this.logger.setContext(`${this.constructor.name}`);
    }

    async saveGame(gameId: string, gameState: GameState) {
      await this.redis.set(gameId, JSON.stringify(gameState));
    }
    
    async getGame(gameId: string): Promise<GameState | null> {
      const value = await this.redis.get(gameId);
      return value ? JSON.parse(value) : null;
    }

    async deleteGame(gameId: string): Promise<void> {
      await this.redis.del(gameId);
    }

    private async finalizeOrSaveGame(gameId: string, gameState: GameState) {
      if (gameState.status !== GameStatus.PLAYING) {
        await this.deleteGame(gameId);
      } else {
        await this.saveGame(gameId, gameState);
      }
    }

    async startGame(startGameDto: StartGameRequestDto): Promise<GameResponseDto> {
      
      const gameId = uuidv4();
      const deck = GameEngine.generateDeck();
      const playerCards: string[] = [];
      const dealerCards: string[] = [];
      GameEngine.dealCards(deck, playerCards, 2); 
      GameEngine.dealCards(deck, dealerCards, 1);
      const gameStatusAndResult = GameEngine.checkGameStatus(playerCards, dealerCards);

      const gameState: GameState = {
        gameId : gameId,
        playerCards : playerCards,
        dealerCards : dealerCards,
        deck : deck,
        status :  gameStatusAndResult.status,
        result : gameStatusAndResult.result,
      };

      await this.finalizeOrSaveGame(gameId, gameState);

      return plainToInstance(GameResponseDto, gameState, { excludeExtraneousValues: true });
        
    }

    async hit(hitGameDto: HitGameRequestDto): Promise<GameResponseDto> {
     
        if (!hitGameDto.gameId) {
          throw new BadRequestException('Missing gameId');
        }
  
        const gameState = await this.getGame(hitGameDto.gameId);
        if (!gameState) {
          throw new BadRequestException('Game not found');
        }

        GameEngine.dealCards(gameState.deck, gameState.playerCards, 1);
  
        const gameStatusAndResult = GameEngine.checkGameStatus(gameState.playerCards, gameState.dealerCards);
        gameState.status = gameStatusAndResult.status;
        gameState.result = gameStatusAndResult.result;
  
        await this.finalizeOrSaveGame(hitGameDto.gameId, gameState);
  
        return plainToInstance(GameResponseDto, gameState, { excludeExtraneousValues: true });

    }

    async stand(standGameDto: StandGameRequestDto): Promise<GameResponseDto> {
      if (!standGameDto.gameId) {
        throw new BadRequestException('Missing gameId');
      }
    
      const gameState = await this.getGame(standGameDto.gameId);
      if (!gameState) {
        throw new BadRequestException('Game not found');
      }
    
      while (GameEngine.calculateHandValue(gameState.dealerCards) < 17) {
        GameEngine.dealCards(gameState.deck, gameState.dealerCards, 1);
      }
    
      const gameStatusAndResult = GameEngine.checkGameStatus(gameState.playerCards, gameState.dealerCards, true);
      gameState.status = gameStatusAndResult.status;
      gameState.result = gameStatusAndResult.result;
    
      await this.finalizeOrSaveGame(standGameDto.gameId, gameState);
    
      return plainToInstance(GameResponseDto, gameState, { excludeExtraneousValues: true });
    }
}
