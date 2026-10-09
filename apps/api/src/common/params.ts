import { HttpStatus, ParseUUIDPipe } from '@nestjs/common';

/** Malformed IDs are indistinguishable from missing ones. */
export const Id = new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND });
