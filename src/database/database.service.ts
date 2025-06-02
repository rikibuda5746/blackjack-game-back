import { Inject, Injectable } from '@nestjs/common';
import databaseConfig from '../config/database.config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly databaseConfigModel: ConfigType<typeof databaseConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'mysql',
      type: 'mysql',
      synchronize: false,
      logging: false,
      host: this.databaseConfigModel.host,
      port: Number(this.databaseConfigModel.port),
      username: this.databaseConfigModel.username,
      password: this.databaseConfigModel.password,
      database: this.databaseConfigModel.schema,
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: [
        `${__dirname}/**/*.migration{.ts,.js}`,
        `${__dirname}/**/*.seeder{.ts,.js}`,
      ],
      migrationsRun: true,
    };
  }
}
