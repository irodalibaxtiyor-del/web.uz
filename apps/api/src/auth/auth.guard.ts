import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC } from '../common/decorators';
import { SESSION_COOKIE, SessionService } from './session.service';

/** Global guard: every route requires a valid server-side session unless marked @Public(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessions: SessionService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<Request>();
    const token = (req.cookies as Record<string, string> | undefined)?.[SESSION_COOKIE];
    const auth = await this.sessions.validate(token);
    if (!auth) throw new UnauthorizedException('Tizimga kiring');
    req.auth = auth;
    return true;
  }
}
