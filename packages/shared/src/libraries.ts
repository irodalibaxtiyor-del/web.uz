/**
 * Front-end libraries the platform hosts itself. Student code links them with the usual
 * public CDN URLs; RUN and CHECK replace exactly these URLs with the platform's own copy,
 * so the sandbox and the CHECK browser keep blocking every other network request.
 *
 * Only exact host + version + file combinations listed here are recognised.
 */
export interface LibraryDef {
  /** `<npm name>@<version>`; also the path segment the files are served under. */
  id: string;
  /** Files relative to the library root (`css/bootstrap.min.css`). */
  files: string[];
  /** CDN prefixes under which `files` live (`https://cdn…/bootstrap@5.3.8/dist/`). */
  bases: string[];
  /** Extra exact CDN URLs that do not follow a base layout → file. */
  urls?: Record<string, string>;
}

const BOOTSTRAP3_FILES = [
  'css/bootstrap.min.css',
  'css/bootstrap.css',
  'css/bootstrap-theme.min.css',
  'css/bootstrap-theme.css',
  'js/bootstrap.min.js',
  'js/bootstrap.js',
  'fonts/glyphicons-halflings-regular.eot',
  'fonts/glyphicons-halflings-regular.svg',
  'fonts/glyphicons-halflings-regular.ttf',
  'fonts/glyphicons-halflings-regular.woff',
  'fonts/glyphicons-halflings-regular.woff2',
];

const BOOTSTRAP4_FILES = [
  'css/bootstrap.min.css',
  'css/bootstrap.css',
  'css/bootstrap-grid.min.css',
  'css/bootstrap-reboot.min.css',
  'js/bootstrap.min.js',
  'js/bootstrap.js',
  'js/bootstrap.bundle.min.js',
  'js/bootstrap.bundle.js',
];

const BOOTSTRAP5_FILES = [
  'css/bootstrap.min.css',
  'css/bootstrap.css',
  'css/bootstrap-grid.min.css',
  'css/bootstrap-utilities.min.css',
  'css/bootstrap-reboot.min.css',
  'js/bootstrap.min.js',
  'js/bootstrap.js',
  'js/bootstrap.bundle.min.js',
  'js/bootstrap.bundle.js',
];

export const LIBRARIES: LibraryDef[] = [
  {
    id: 'bootstrap@3.4.1',
    files: BOOTSTRAP3_FILES,
    bases: [
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/',
      'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/',
      'https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/',
    ],
  },
  {
    id: 'bootstrap@4.6.2',
    files: BOOTSTRAP4_FILES,
    bases: [
      'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.6.2/',
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.6.2/',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/',
    ],
  },
  {
    id: 'bootstrap@5.3.8',
    files: BOOTSTRAP5_FILES,
    bases: [
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/',
      'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/',
    ],
  },
  {
    id: 'jquery@3.7.1',
    files: ['jquery.min.js', 'jquery.js', 'jquery.slim.min.js', 'jquery.slim.js'],
    bases: [
      'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/',
      'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/',
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/',
    ],
    urls: {
      'https://code.jquery.com/jquery-3.7.1.min.js': 'jquery.min.js',
      'https://code.jquery.com/jquery-3.7.1.js': 'jquery.js',
      'https://code.jquery.com/jquery-3.7.1.slim.min.js': 'jquery.slim.min.js',
      'https://code.jquery.com/jquery-3.7.1.slim.js': 'jquery.slim.js',
    },
  },
  {
    id: 'popper.js@1.16.1',
    files: ['popper.min.js', 'popper.js'],
    bases: [
      'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/',
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/',
    ],
  },
  {
    id: 'bootstrap-icons@1.13.1',
    files: [
      'bootstrap-icons.min.css',
      'bootstrap-icons.css',
      'fonts/bootstrap-icons.woff2',
      'fonts/bootstrap-icons.woff',
    ],
    bases: ['https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/'],
  },
];

const BY_URL = new Map<string, { id: string; file: string }>();
for (const lib of LIBRARIES) {
  for (const base of lib.bases)
    for (const file of lib.files) BY_URL.set(base + file, { id: lib.id, file });
  for (const [url, file] of Object.entries(lib.urls ?? {})) BY_URL.set(url, { id: lib.id, file });
}

/** Maps a CDN URL (`https:` or protocol-relative, query/hash ignored) to a hosted library file. */
export function resolveLibraryUrl(url: string): { id: string; file: string } | null {
  const normalized = (url.startsWith('//') ? `https:${url}` : url).split(/[?#]/)[0] ?? '';
  return BY_URL.get(normalized.replace(/^http:/i, 'https:')) ?? null;
}

/** Whether `file` is a served file of the library `id`. */
export function isLibraryFile(id: string, file: string): boolean {
  return LIBRARIES.some((l) => l.id === id && l.files.includes(file));
}

const URL_RE = /(?:https?:)?\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}\/[^\s"'`()<>]*/g;

/**
 * Replaces every recognised CDN URL in an HTML or CSS text with `<prefix><id>/<file>`.
 * Unknown URLs are left untouched (and stay blocked).
 */
export function rewriteLibraryUrls(text: string, prefix: string): string {
  return text.replace(URL_RE, (url) => {
    const hit = resolveLibraryUrl(url);
    return hit ? `${prefix}${hit.id}/${hit.file}` : url;
  });
}
