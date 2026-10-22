import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  BOOK_SIZES,
  bookMetaSchema,
  bookPagesQuerySchema,
  bookProgressSchema,
  updateBookSchema,
  type BookMetaInput,
  type BookPagesQuery,
  type UpdateBookInput,
} from '@webdizayn/shared';
import type { Response } from 'express';
import { z } from 'zod';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { ZodPipe } from '../common/zod.pipe';
import { BooksService, type UploadedFile } from './books.service';

/**
 * Images are shown, never offered as files: inline, not cacheable anywhere, not indexable,
 * only for same-origin pages.
 */
function sendImage(res: Response, data: Buffer) {
  res.setHeader('Content-Type', 'image/webp');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.send(data);
}

/**
 * Multer stops reading an oversized upload (413) before buffering past this limit. Decorators
 * are static, so it reads the variable directly; the service checks the parsed config again.
 */
const UPLOAD_MAX_BYTES = Math.min(Number(process.env.BOOK_MAX_MB) || 50, 200) * 1024 * 1024;

const pageQuery = z
  .object({
    size: z.enum(BOOK_SIZES),
    exp: z.coerce.number().int().positive(),
    sig: z.string().min(10).max(100),
  })
  .strict();

const PageNo = new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND });

/** Organization administrators: upload, edit, publish/hide and delete electronic textbooks. */
@Controller('orgs/:orgId/admin/books')
export class AdminBooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  @OrgRoles('ORG_ADMIN')
  list(@CurrentMembership() m: MembershipContext) {
    return this.books.adminList(m);
  }

  @Post()
  @OrgRoles('ORG_ADMIN')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        limits: { fileSize: UPLOAD_MAX_BYTES, files: 2, fields: 10, fieldSize: 16 * 1024 },
      },
    ),
  )
  upload(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Body(new ZodPipe(bookMetaSchema)) body: BookMetaInput,
    @UploadedFiles() files: { file?: UploadedFile[]; cover?: UploadedFile[] } | undefined,
  ) {
    return this.books.upload(auth, m, body, files?.file?.[0], files?.cover?.[0]);
  }

  @Patch(':bookId')
  @OrgRoles('ORG_ADMIN')
  update(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('bookId', Id) bookId: string,
    @Body(new ZodPipe(updateBookSchema)) body: UpdateBookInput,
  ) {
    return this.books.update(auth, m, bookId, body);
  }

  @Delete(':bookId')
  @HttpCode(204)
  @OrgRoles('ORG_ADMIN')
  async remove(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('bookId', Id) bookId: string,
  ) {
    await this.books.remove(auth, m, bookId);
  }

  @Get(':bookId/cover')
  @OrgRoles('ORG_ADMIN')
  async cover(
    @CurrentMembership() m: MembershipContext,
    @Param('bookId', Id) bookId: string,
    @Res() res: Response,
  ) {
    sendImage(res, await this.books.adminCover(m, bookId));
  }
}

/** Readers: every signed-in user (the platform's books and those of their organizations). */
@Controller('books')
export class BooksController {
  constructor(private readonly books: BooksService) {}

  @Get()
  list(@CurrentAuth() auth: AuthContext) {
    return this.books.list(auth);
  }

  @Get(':bookId')
  detail(@CurrentAuth() auth: AuthContext, @Param('bookId', Id) bookId: string) {
    return this.books.detail(auth, bookId);
  }

  /** Short-lived signed URLs for a few pages around the one being read. */
  @Get(':bookId/pages')
  pages(
    @CurrentAuth() auth: AuthContext,
    @Param('bookId', Id) bookId: string,
    @Query(new ZodPipe(bookPagesQuerySchema)) q: BookPagesQuery,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.setHeader('Cache-Control', 'no-store');
    return this.books.pageUrls(auth, bookId, q);
  }

  @Get(':bookId/pages/:page')
  async page(
    @CurrentAuth() auth: AuthContext,
    @Param('bookId', Id) bookId: string,
    @Param('page', PageNo) page: number,
    @Query(new ZodPipe(pageQuery)) q: z.infer<typeof pageQuery>,
    @Res() res: Response,
  ) {
    sendImage(res, await this.books.page(auth, bookId, page, q));
  }

  @Get(':bookId/cover')
  async cover(
    @CurrentAuth() auth: AuthContext,
    @Param('bookId', Id) bookId: string,
    @Res() res: Response,
  ) {
    sendImage(res, await this.books.cover(auth, bookId));
  }

  @Put(':bookId/progress')
  progress(
    @CurrentAuth() auth: AuthContext,
    @Param('bookId', Id) bookId: string,
    @Body(new ZodPipe(bookProgressSchema)) body: z.infer<typeof bookProgressSchema>,
  ) {
    return this.books.saveProgress(auth, bookId, body.page);
  }
}
