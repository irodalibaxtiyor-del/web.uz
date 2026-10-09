import { ForbiddenException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * CSRF defence in depth (cookies are already SameSite=Lax): reject state-changing
 * browser requests whose Origin is not an allowed web origin.
 */
export function originCheck(allowed: string[]) {
  const set = new Set(allowed);
  return (req: Request, _res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (!SAFE_METHODS.has(req.method) && origin !== undefined && !set.has(origin)) {
      next(new ForbiddenException("So'rov manbasiga ruxsat yo'q"));
      return;
    }
    next();
  };
}
