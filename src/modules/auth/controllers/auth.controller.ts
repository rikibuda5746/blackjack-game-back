import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@src/common/decorators/public.decorator'
import { AuthService } from '../services/auth.service';
import { RegisterRequestDto } from '../dto/requests/register.request.dto';
import { LoginRequestDto } from '../dto/requests/login.request.dto'
import { LoginByTokenRequestDto } from '../dto/requests/login-by-token';
import { RefreshTokenRequestDto } from '../dto/requests/refreshToken.request.dto';
import { LoginResponseDto } from '../dto/responses/login.response.dto';
import { RefreshTokenResponseDto } from '../dto/responses/refresh-token.response.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { JwtUserDetailsDto } from '@src/common/dto/jwt-user-details.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto): Promise<LoginResponseDto> {
    return this.AuthService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.AuthService.login(loginDto);
  }
  
  @Post('login-by-token')
  async loginByToken(@Body() loginDto: LoginByTokenRequestDto, @CurrentUser() user: JwtUserDetailsDto): Promise<LoginResponseDto> {
    return this.AuthService.loginByToken(user.id, loginDto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    return this.AuthService.refreshToken(refreshToken);
  }

}
