import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import ms, { StringValue } from 'ms';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResponseMessage } from './strategy/interfaces/response-message.interface';
import { TokenPayload } from './strategy/interfaces/token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseMessage> {
    const token = await this.authService.login(user);

    const maxAge = ms(
      this.configService.getOrThrow<StringValue>('JWT_EXPIRATION'),
    );

    res.cookie(this.configService.get('COOKIE_NAME'), token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge,
    });

    return { message: 'Successfully login!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
