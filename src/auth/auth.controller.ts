import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { Request } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() dto: AuthRegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() dto: AuthLoginDto) {
    return await this.authService.login(dto);
  }

  @Auth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }

  @Auth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(@Req() req: Request) {
    return await this.authService.refresh(req);
  }

}
