import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { LogService } from '@src/core/logger/log-service';
import { StartGameRequestDto } from '../models/dto/requests/startGame.request.dto';
import { HitGameRequestDto } from '../models/dto/requests/hitGame.request.dto';
import { StandGameRequestDto } from '../models/dto/requests/standGame.request.dto';
import { GameResponseDto } from '../models/dto/responses/game.response.dto';
import { GameState } from '../models/interfaces/game-state.interface';
import { GameStatus } from '../models/enums/game-status.enum';
import { GameEngine } from '../utils/game-engine.util';
import { GameRepository } from '../repositories/game.repository';

@Injectable()
export class GameService {
    constructor(
      private readonly logger: LogService,
      private readonly gameRepository: GameRepository,
      @InjectRedis() private readonly redis: Redis, 
    ) {
      this.logger.setContext(`${this.constructor.name}`);
    }

    async saveGame(gameId: number, gameState: GameState) {
      await this.redis.set(gameId.toString(), JSON.stringify(gameState));
    }
    
    async getGame(gameId: number): Promise<GameState | null> {
      const value = await this.redis.get(gameId.toString());
      return value ? JSON.parse(value) : null;
    }

    async deleteGame(gameId: number): Promise<void> {
      await this.redis.del(gameId.toString());
    }

    private async finalizeOrSaveGame(gameState: GameState) {
      if (gameState.status !== GameStatus.PLAYING) {
        await this.gameRepository.updateById(gameState.gameId, {
          status: gameState.status,
          result: gameState.result,
        });
        await this.deleteGame(gameState.gameId);
      } else {
        await this.saveGame(gameState.gameId, gameState);
      }
    }

    async startGame(userId:number, startGameDto: StartGameRequestDto): Promise<GameResponseDto> {
      
      const deck = GameEngine.generateDeck();
      const playerCards: string[] = [];
      const dealerCards: string[] = [];
      GameEngine.dealCards(deck, playerCards, 2); 
      GameEngine.dealCards(deck, dealerCards, 1);
      const gameStatusAndResult = GameEngine.checkGameStatus(playerCards, dealerCards);

      const game = await this.gameRepository.addOne({
        userId: userId,
        betAmount: startGameDto.betAmount,
        status: gameStatusAndResult.status,
        result: gameStatusAndResult.result,
      })

      const gameState: GameState = {
        gameId : game.id,
        userId : userId,
        playerCards : playerCards,
        dealerCards : dealerCards,
        deck : deck,
        status :  gameStatusAndResult.status,
        result : gameStatusAndResult.result,
      };

      await this.finalizeOrSaveGame(gameState);

      return plainToInstance(GameResponseDto, gameState, { excludeExtraneousValues: true });
        
    }

    async hit(userId:number, hitGameDto: HitGameRequestDto): Promise<GameResponseDto> {
     
        if (!hitGameDto.gameId) {
          throw new BadRequestException('Missing gameId');
        }
  
        const gameState = await this.getGame(hitGameDto.gameId);
        if (!gameState || gameState.userId !== userId) {
          throw new BadRequestException('Game not found');
        }

        GameEngine.dealCards(gameState.deck, gameState.playerCards, 1);
  
        const gameStatusAndResult = GameEngine.checkGameStatus(gameState.playerCards, gameState.dealerCards);
        gameState.status = gameStatusAndResult.status;
        gameState.result = gameStatusAndResult.result;
  
        await this.finalizeOrSaveGame(gameState);
  
        return plainToInstance(GameResponseDto, gameState, { excludeExtraneousValues: true });

    }

    async stand(userId:number, standGameDto: StandGameRequestDto): Promise<GameResponseDto> {
      if (!standGameDto.gameId) {
        throw new BadRequestException('Missing gameId');
      }
    
      const gameState = await this.getGame(standGameDto.gameId);
      if (!gameState || gameState.userId !== userId) {
        throw new BadRequestException('Game not found');
      }
    
      while (GameEngine.calculateHandValue(gameState.dealerCards) < 17) {
        GameEngine.dealCards(gameState.deck, gameState.dealerCards, 1);
      }
    
      const gameStatusAndResult = GameEngine.checkGameStatus(gameState.playerCards, gameState.dealerCards, true);
      gameState.status = gameStatusAndResult.status;
      gameState.result = gameStatusAndResult.result;
    
      await this.finalizeOrSaveGame(gameState);
    
      return plainToInstance(GameResponseDto, gameState, { excludeExtraneousValues: true });
    }
}
