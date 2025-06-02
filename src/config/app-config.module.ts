import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import { AppConfigService } from './app-config.service';
import authConfig from './auth.config';
import { validationSchema } from './validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [appConfig, databaseConfig, authConfig],
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
