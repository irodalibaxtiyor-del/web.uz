import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import {
  createGradebookSchema,
  GRADEBOOK_IMPORT_MAX_BYTES,
  gradebookColumnSchema,
  gradebookImportSchema,
  gradebookScoresSchema,
  type CreateGradebookInput,
  type GradebookColumnInput,
  type GradebookImportInput,
  type GradebookScoresInput,
} from '@webdizayn/shared';
import { CurrentAuth, CurrentMembership, OrgRoles } from '../common/decorators';
import { Id } from '../common/params';
import type { AuthContext, MembershipContext } from '../common/types';
import { attachmentHeader, XLSX_MIME } from '../common/xlsx';
import { ZodPipe } from '../common/zod.pipe';
import { GradebookService } from './gradebook.service';

interface Upload {
  buffer: Buffer;
  size: number;
}

/** Teacher gradebooks of a group: teachers of that group and organization admins. */
@Controller('orgs/:orgId/groups/:groupId/gradebooks')
@OrgRoles('TEACHER', 'ORG_ADMIN')
export class GroupGradebooksController {
  constructor(private readonly gradebooks: GradebookService) {}

  @Get()
  list(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
  ) {
    return this.gradebooks.list(auth, m, groupId);
  }

  @Post()
  create(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Body(new ZodPipe(createGradebookSchema)) body: CreateGradebookInput,
  ) {
    return this.gradebooks.create(auth, m, groupId, body);
  }

  @Get(':id')
  view(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
  ) {
    return this.gradebooks.view(auth, m, groupId, id);
  }

  @Patch(':id')
  rename(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Body(new ZodPipe(createGradebookSchema)) body: CreateGradebookInput,
  ) {
    return this.gradebooks.rename(auth, m, groupId, id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
  ) {
    await this.gradebooks.remove(auth, m, groupId, id);
  }

  @Post(':id/columns')
  addColumn(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Body(new ZodPipe(gradebookColumnSchema)) body: GradebookColumnInput,
  ) {
    return this.gradebooks.addColumn(auth, m, groupId, id, body);
  }

  @Patch(':id/columns/:columnId')
  updateColumn(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Param('columnId', Id) columnId: string,
    @Body(new ZodPipe(gradebookColumnSchema)) body: GradebookColumnInput,
  ) {
    return this.gradebooks.updateColumn(auth, m, groupId, id, columnId, body);
  }

  @Delete(':id/columns/:columnId')
  removeColumn(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Param('columnId', Id) columnId: string,
  ) {
    return this.gradebooks.removeColumn(auth, m, groupId, id, columnId);
  }

  @Put(':id/scores')
  setScores(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Body(new ZodPipe(gradebookScoresSchema)) body: GradebookScoresInput,
  ) {
    return this.gradebooks.setScores(auth, m, groupId, id, body);
  }

  @Post(':id/import/preview')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: GRADEBOOK_IMPORT_MAX_BYTES, files: 1, fields: 4 },
    }),
  )
  previewImport(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @UploadedFile() file: Upload | undefined,
  ) {
    return this.gradebooks.previewImport(auth, m, groupId, id, file?.buffer);
  }

  @Post(':id/import')
  applyImport(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Body(new ZodPipe(gradebookImportSchema)) body: GradebookImportInput,
  ) {
    return this.gradebooks.applyImport(auth, m, groupId, id, body);
  }

  @Get(':id/export.xlsx')
  async export(
    @CurrentAuth() auth: AuthContext,
    @CurrentMembership() m: MembershipContext,
    @Param('groupId', Id) groupId: string,
    @Param('id', Id) id: string,
    @Res() res: Response,
  ) {
    const file = await this.gradebooks.exportXlsx(auth, m, groupId, id);
    res.setHeader('Content-Type', XLSX_MIME);
    res.setHeader('Content-Disposition', attachmentHeader(file.fileName));
    res.setHeader('Cache-Control', 'no-store');
    res.send(file.data);
  }
}

/** A student's own grades from the teacher gradebooks of their group. */
@Controller('orgs/:orgId/gradebooks')
export class MyGradebooksController {
  constructor(private readonly gradebooks: GradebookService) {}

  @Get('mine')
  @OrgRoles('STUDENT', 'TEACHER', 'ORG_ADMIN')
  mine(@CurrentAuth() auth: AuthContext, @CurrentMembership() m: MembershipContext) {
    return this.gradebooks.mine(auth, m);
  }
}
