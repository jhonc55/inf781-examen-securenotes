import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.email,
      dto.password,
    );
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(
      dto.email,
      dto.password,
    );
  }

  @Post('refresh')
  refresh(
    @Body() dto: RefreshDto,
  ) {
    return this.authService.refresh(
      dto.refreshToken,
    );
  }

  @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: any) {
    return req.user;
    }

  @Post('logout')
  logout(@Body() dto: LogoutDto) {
    return this.authService.logout(
      dto.refreshToken,
    );
  }
}