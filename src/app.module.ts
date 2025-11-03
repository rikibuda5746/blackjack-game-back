import { Module } from '@nestjs/common';
import { CoreModule } from '@src/core/core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { GameModule } from './modules/blackjack/game.module';
import { BalanceModule } from './modules/balance/balance.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, GameModule, BalanceModule],
})
export class AppModule {}
