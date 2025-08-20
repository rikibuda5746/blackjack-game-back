import { Injectable , UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogService } from '@src/core/logger/log-service';
import { AppConfigService } from '@src/config/app-config.service';
import { UsersService } from '@src/modules/users/services/users.service';
import { plainToInstance } from 'class-transformer';
import { RegisterRequestDto } from '../dto/requests/register.request.dto';
import { LoginRequestDto } from '../dto/requests/login.request.dto';
import { LoginByTokenRequestDto } from '../dto/requests/login-by-token';
import { RefreshTokenRequestDto } from '../dto/requests/refreshToken.request.dto';
import { LoginResponseDto } from '../dto/responses/login.response.dto';
import { RefreshTokenResponseDto } from '../dto/responses/refresh-token.response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LogService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private usersService: UsersService,
  ) {
    this.logger.setContext(`${this.constructor.name}`);
  }

  async register(registerDto: RegisterRequestDto): Promise<LoginResponseDto> {
    const existingUser = await this.usersService.findOne({email: registerDto.email});
    if (existingUser && existingUser.email === registerDto.email) {
        throw new UnauthorizedException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const createUserDto = {
        ...registerDto,
        password: hashedPassword,
    };
     await this.usersService.addUser(createUserDto);
    
    return this.login({email: registerDto.email, password: registerDto.password});
   }

  async login(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const userExist = await this.usersService.checkPassword(loginDto.email,loginDto.password);
    if (!userExist) {
        throw new UnauthorizedException('Invalid email or password');
    }
    const user = await this.usersService.findOne({email: loginDto.email});
    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.jwtAccessSecret,
      expiresIn: this.appConfigService.jwtAccessExpires,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpires,
    });
    return plainToInstance(LoginResponseDto, {
      accessToken,
      refreshToken,
      user: user,
    }, { excludeExtraneousValues: true });
  }

  async loginByToken(id:number, loginByTokenDto: LoginByTokenRequestDto): Promise<LoginResponseDto> {
    console.log(id);
    const user = await this.usersService.findOne({id: id});
    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }
    return plainToInstance(LoginResponseDto, {
      accessToken: loginByTokenDto.accessToken,
      refreshToken: loginByTokenDto.refreshToken,
      user: user,
    }, { excludeExtraneousValues: true });
  }

   async refreshToken(RefreshTokenDto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(RefreshTokenDto.refreshToken, {
        secret: this.appConfigService.jwtRefreshSecret,
      });
      const accessToken = await this.jwtService.signAsync(
        { id: payload.id},
        {
          secret: this.appConfigService.jwtAccessSecret,
          expiresIn: this.appConfigService.jwtAccessExpires,
        }
      );
      const refreshToken = await this.jwtService.signAsync(
        { id: payload.id},
        {
          secret: this.appConfigService.jwtRefreshSecret,
          expiresIn: this.appConfigService.jwtRefreshExpires,
        }
      );
      return plainToInstance(RefreshTokenResponseDto, {
        accessToken,
        refreshToken,
      }, { excludeExtraneousValues: true });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

}
