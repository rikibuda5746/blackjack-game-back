import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get isProduction(): boolean {
    return this.configService.get('application.nodeEnv') === 'production';
  }

  get jwtAccessSecret(): string {
    return this.configService.get('auth.jwtAccessSecret');
  }

  get jwtAccessExpires(): number {
    return Number(this.configService.get('auth.jwtAccessExpires'));
  }

  get jwtRefreshSecret(): string {
    return this.configService.get('auth.jwtRefreshSecret');
  }

  get jwtRefreshExpires(): number {
    return Number(this.configService.get('auth.jwtRefreshExpires'));
  }

  get logToFile(): boolean {
    return this.configService.get('application.logToFile') === 'true';
  }

  get logLevel(): string {
    return this.configService.get('application.logLevel');
  }

  getKey(key: string): string | undefined {
    return this.configService.get(`application.${key}`);
  }
}
