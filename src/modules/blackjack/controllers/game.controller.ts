import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from '../services/game.service';
import { StartGameRequestDto } from '../dto/requests/startGame.request.dto';
import { HitGameRequestDto } from '../dto/requests/hitGame.request.dto';
import { StandGameRequestDto } from '../dto/requests/standGame.request.dto';
import { GameResponseDto } from '../dto/responses/game.response.dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { JwtUserDetailsDto } from '@src/common/dto/jwt-user-details.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}


  @Post('start')
  async startGame(@Body() startGameDto: StartGameRequestDto, @CurrentUser() user: JwtUserDetailsDto): Promise<GameResponseDto> {
    return this.gameService.startGame(startGameDto);
  }

  @Post('hit')
  async hit(@Body() hitGameDto: HitGameRequestDto, @CurrentUser() user: JwtUserDetailsDto): Promise<GameResponseDto> {
    return this.gameService.hit(hitGameDto);
  }

  @Post('stand')
  async stand(@Body() standGameDto: StandGameRequestDto, @CurrentUser() user: JwtUserDetailsDto): Promise<GameResponseDto> {
    return this.gameService.stand(standGameDto);
  }

}
