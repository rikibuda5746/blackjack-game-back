// src/common/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtUserDetailsDto } from '@src/common/dto/jwt-user-details.dto';
import { Request } from 'express';
import { AppConfigService } from 'src/config/app-config.service';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
declare module 'express' {
  interface Request {
    user?: JwtUserDetailsDto;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('Missing token');

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.appConfigService.jwtAccessSecret,
      });

      request.user = {
        id: Number.parseInt(payload['id']),
      };

      return true;
    } catch (err) {
      // token decode
      const decoded = this.jwtService.decode(token);
      if(decoded['exp'] < Date.now() / 1000) {
        throw new HttpException('Token expired', 800);
      }
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
