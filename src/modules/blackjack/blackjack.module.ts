// import { Module } from '@nestjs/common';
// import { BlackjackController } from './controllers/blackjack.controller';
// import { BlackjackService } from './services/blackjack.service';
// import { GameRepository } from './repositories/game.repository';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Game } from './entities/game.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Game])],
//   controllers: [BlackjackController],
//   providers: [BlackjackService, GameRepository],
//   exports: [BlackjackService],
// })
// export class BlackjackModule {} 