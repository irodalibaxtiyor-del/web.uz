import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

export class ZodPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        message: "So'rov ma'lumotlari noto'g'ri",
        issues: result.error.issues.map((i) => ({ path: i.path.join('.'), code: i.code })),
      });
    }
    return result.data;
  }
}
