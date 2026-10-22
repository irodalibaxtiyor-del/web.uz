/**
 * Child-process entry: reads the job from stdin, renders the pages and the cover and
 * prints one JSON line. Started by `BookProcessor` with a filtered environment (no database
 * URL or secrets), a heap limit and a hard kill timer.
 */
import { join } from 'node:path';
import { makeCover, rasterize, RasterizeError } from './rasterize';

async function main() {
  let raw = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) raw += chunk;
  const input = JSON.parse(raw) as {
    pdfPath: string;
    outDir: string;
    maxPages: number;
    coverUpload: string | null;
    coverOut: string;
  };
  try {
    const result = await rasterize(input.pdfPath, input.outDir, input.maxPages);
    const customCover = await makeCover(
      input.coverUpload,
      join(input.outDir, '1-sm.webp'),
      input.coverOut,
    );
    process.stdout.write(JSON.stringify({ ok: true, result: { ...result, customCover } }));
  } catch (e) {
    const code = e instanceof RasterizeError ? e.code : 'RENDER';
    process.stdout.write(JSON.stringify({ ok: false, code }));
  }
}

main().then(
  () => process.exit(0),
  () => process.exit(1),
);
