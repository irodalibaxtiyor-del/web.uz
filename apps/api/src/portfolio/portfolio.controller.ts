import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import {
  addPortfolioItemSchema,
  updatePortfolioItemSchema,
  updatePortfolioSchema,
  type AddPortfolioItemInput,
  type UpdatePortfolioInput,
  type UpdatePortfolioItemInput,
} from '@webdizayn/shared';
import { CurrentAuth, Public } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { PortfolioService } from './portfolio.service';

/** The owner is always the session user; no user id is ever taken from the request. */
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Get('me')
  mine(@CurrentAuth() auth: AuthContext) {
    return this.portfolio.mine(auth);
  }

  @Put('me')
  update(
    @CurrentAuth() auth: AuthContext,
    @Body(new ZodPipe(updatePortfolioSchema)) body: UpdatePortfolioInput,
  ) {
    return this.portfolio.update(auth, body);
  }

  @Post('me/publish')
  @HttpCode(200)
  publish(@CurrentAuth() auth: AuthContext) {
    return this.portfolio.publish(auth, true);
  }

  @Post('me/unpublish')
  @HttpCode(200)
  unpublish(@CurrentAuth() auth: AuthContext) {
    return this.portfolio.publish(auth, false);
  }

  @Post('me/items')
  addItem(
    @CurrentAuth() auth: AuthContext,
    @Body(new ZodPipe(addPortfolioItemSchema)) body: AddPortfolioItemInput,
  ) {
    return this.portfolio.addItem(auth, body);
  }

  @Get('me/items/:itemId')
  getItem(@CurrentAuth() auth: AuthContext, @Param('itemId', Id) itemId: string) {
    return this.portfolio.getItem(auth, itemId);
  }

  @Patch('me/items/:itemId')
  updateItem(
    @CurrentAuth() auth: AuthContext,
    @Param('itemId', Id) itemId: string,
    @Body(new ZodPipe(updatePortfolioItemSchema)) body: UpdatePortfolioItemInput,
  ) {
    return this.portfolio.updateItem(auth, itemId, body);
  }

  @Delete('me/items/:itemId')
  @HttpCode(204)
  async removeItem(@CurrentAuth() auth: AuthContext, @Param('itemId', Id) itemId: string) {
    await this.portfolio.removeItem(auth, itemId);
  }

  @Public()
  @Get('public/:slug')
  publicView(@Param('slug') slug: string) {
    return this.portfolio.publicView(slug);
  }

  @Public()
  @Get('public/:slug/items/:itemId')
  publicItem(@Param('slug') slug: string, @Param('itemId', Id) itemId: string) {
    return this.portfolio.publicItem(slug, itemId);
  }
}
