import { Module } from '@nestjs/common';
import { CoreModule } from '@src/core/core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/blackjack/game.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, GameModule],
})
export class AppModule {}
