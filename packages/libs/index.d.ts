export interface LibraryFile {
  body: Buffer;
  contentType: string;
}
/** A listed file of a hosted library, or null. */
export function readLibraryFile(id: string, file: string): LibraryFile | null;
/** `<id>/<file>` (e.g. `bootstrap@5.3.8/css/bootstrap.min.css`) → file, or null. */
export function readLibraryPath(path: string): LibraryFile | null;
