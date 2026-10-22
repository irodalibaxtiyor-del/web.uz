import { Body, Controller, Get, HttpCode, Inject, Param, Post, Put, Req } from '@nestjs/common';
import {
  chatAskSchema,
  chatContactSchema,
  resolveContactSchema,
  type ChatAskInput,
  type ChatContactInput,
} from '@webdizayn/shared';
import type { Request } from 'express';
import { SESSION_COOKIE, SessionService } from '../auth/session.service';
import { CurrentAuth, CurrentMembership, OrgRoles, Public } from '../common/decorators';
import { Id } from '../common/params';
import { RateLimiter } from '../common/rate-limiter';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { APP_CONFIG, type AppConfig } from '../config';
import { ChatbotService } from './chatbot.service';

/** Help chatbot, open to guests. Limited per client IP. */
@Controller('public/chat')
export class ChatbotController {
  constructor(
    private readonly chat: ChatbotService,
    private readonly sessions: SessionService,
    private readonly limiter: RateLimiter,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  @Public()
  @Post()
  @HttpCode(200)
  async ask(@Body(new ZodPipe(chatAskSchema)) body: ChatAskInput, @Req() req: Request) {
    await this.limiter.consume(
      `chat:${req.ip ?? 'unknown'}`,
      this.config.CHATBOT_RATE_PER_MINUTE,
      60_000,
      'CHAT_RATE_LIMITED',
    );
    return this.chat.ask(body.message);
  }

  @Public()
  @Post('contact')
  @HttpCode(201)
  async contact(@Body(new ZodPipe(chatContactSchema)) body: ChatContactInput, @Req() req: Request) {
    await this.limiter.consume(
      `chat-contact:${req.ip ?? 'unknown'}`,
      this.config.CHATBOT_CONTACT_PER_HOUR,
      60 * 60_000,
      'CHAT_CONTACT_RATE_LIMITED',
    );
    // Public route: the guard does not attach a session, so look it up here. Only a valid
    // server-side session links the request to an account; nothing from the body does.
    const token = (req.cookies as Record<string, string> | undefined)?.[SESSION_COOKIE];
    const auth = await this.sessions.validate(token);
    return this.chat.contact(body, auth?.userId ?? null);
  }
}

/** Requests sent from the chatbot, for organization administrators. */
@Controller('orgs/:orgId/admin/contact-requests')
export class AdminContactsController {
  constructor(private readonly chat: ChatbotService) {}

  @Get()
  @OrgRoles('ORG_ADMIN')
  list(@CurrentMembership() m: MembershipContext) {
    return this.chat.list(m);
  }

  @Put(':id/resolved')
  @OrgRoles('ORG_ADMIN')
  resolve(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('id', Id) id: string,
    @Body(new ZodPipe(resolveContactSchema)) body: { resolved: boolean },
  ) {
    return this.chat.resolve(auth, m, id, body.resolved);
  }
}
