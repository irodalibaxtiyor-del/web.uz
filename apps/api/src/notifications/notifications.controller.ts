import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { notificationPrefsSchema, type NotificationPrefsInput } from '@webdizayn/shared';
import { CurrentAuth, Public } from '../common/decorators';
import type { AuthContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { NotificationsService } from './notifications.service';

@Controller('me/telegram')
export class MyTelegramController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  status(@CurrentAuth() auth: AuthContext) {
    return this.notifications.status(auth);
  }

  @Post('link')
  @HttpCode(200)
  link(@CurrentAuth() auth: AuthContext) {
    return this.notifications.startLink(auth);
  }

  @Patch()
  prefs(
    @CurrentAuth() auth: AuthContext,
    @Body(new ZodPipe(notificationPrefsSchema)) body: NotificationPrefsInput,
  ) {
    return this.notifications.updatePrefs(auth, body);
  }

  @Delete()
  @HttpCode(204)
  async unlink(@CurrentAuth() auth: AuthContext) {
    await this.notifications.unlink(auth);
  }
}

/** Telegram Bot API webhook; authenticated by the secret Telegram echoes back. */
@Controller('telegram')
export class TelegramWebhookController {
  constructor(private readonly notifications: NotificationsService) {}

  @Public()
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Headers('x-telegram-bot-api-secret-token') secret: string | undefined,
    @Body() body: unknown,
  ) {
    if (!this.notifications.webhookAuthorized(secret)) throw new UnauthorizedException();
    if (body && typeof body === 'object') await this.notifications.handleUpdate(body);
    return { ok: true };
  }
}
