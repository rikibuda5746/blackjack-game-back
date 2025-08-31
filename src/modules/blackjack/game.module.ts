import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
// import { GameRepository } from './repositories/game.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { GameEntity } from './entities/game.entity';

@Module({
  // TypeOrmModule.forFeature([GameEntity])
  imports: [],
  controllers: [GameController],
  providers: [GameService],
  exports: [],
})
export class GameModule {} 

