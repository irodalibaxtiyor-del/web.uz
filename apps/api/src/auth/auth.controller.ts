import { Body, Controller, Get, HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@webdizayn/shared';
import { CurrentAuth, Public } from '../common/decorators';
import type { AuthContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { APP_CONFIG, type AppConfig } from '../config';
import { AuthService } from './auth.service';
import { SESSION_COOKIE } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  private setCookie(res: Response, token: string, expiresAt: Date) {
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: this.config.cookieSecure,
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });
  }

  @Public()
  @Post('register')
  async register(
    @Body(new ZodPipe(registerSchema)) body: RegisterInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, token, expiresAt } = await this.auth.register(body);
    this.setCookie(res, token, expiresAt);
    return this.auth.me(userId);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodPipe(loginSchema)) body: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, token, expiresAt } = await this.auth.login(body, req.ip ?? 'unknown');
    this.setCookie(res, token, expiresAt);
    return this.auth.me(userId);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@CurrentAuth() auth: AuthContext, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(auth.sessionId, auth.userId);
    res.clearCookie(SESSION_COOKIE, { path: '/' });
  }

  @Get('me')
  me(@CurrentAuth() auth: AuthContext) {
    return this.auth.me(auth.userId);
  }
}
