import { Module } from '@nestjs/common';
import { CoreModule } from '@src/core/core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
// import { BlackjackModule } from './modules/blackjack/blackjack.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule],
})
export class AppModule {}
