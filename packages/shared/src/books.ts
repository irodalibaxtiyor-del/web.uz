import { z } from 'zod';
import { toLatin } from './slug';

/** Electronic textbooks: PDFs shown page by page as images, never handed out as files. */

export const BOOK_STATUSES = ['PROCESSING', 'READY', 'FAILED'] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

/**
 * TEXTBOOK: course e-textbooks (signed-in readers, "Elektron darslik").
 * AUTHOR: the author's published books, listed on the public "Muallif kitoblari" page.
 */
export const BOOK_COLLECTIONS = ['TEXTBOOK', 'AUTHOR'] as const;
export type BookCollection = (typeof BOOK_COLLECTIONS)[number];
export const BOOK_COLLECTION_LABEL: Record<BookCollection, string> = {
  TEXTBOOK: 'Elektron darslik',
  AUTHOR: 'Muallif kitoblari',
};

export const BOOK_SIZES = ['sm', 'lg'] as const;
export type BookPageSize = (typeof BOOK_SIZES)[number];

/** Signed page URLs live this long (the page endpoint also re-checks the session). */
export const BOOK_URL_TTL_SECONDS = 300;

const optionalUuid = z.union([z.uuid(), z.literal('').transform(() => null), z.null()]);

/** Text fields of the upload form (multipart: every value arrives as a string). */
export const bookMetaSchema = z.object({
  title: z.string().trim().min(2).max(200),
  author: z.string().trim().max(200).default(''),
  year: z
    .union([z.coerce.number().int().min(1900).max(2100), z.literal('').transform(() => null)])
    .nullable()
    .optional(),
  description: z.string().trim().max(4000).default(''),
  publisher: z.string().trim().max(200).default(''),
  isbn: z.string().trim().max(40).default(''),
  collection: z.enum(BOOK_COLLECTIONS).default('TEXTBOOK'),
  directionId: optionalUuid.optional(),
  courseId: optionalUuid.optional(),
});
export type BookMetaInput = z.infer<typeof bookMetaSchema>;

export const updateBookSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    author: z.string().trim().max(200).optional(),
    year: z.number().int().min(1900).max(2100).nullable().optional(),
    description: z.string().trim().max(4000).optional(),
    publisher: z.string().trim().max(200).optional(),
    isbn: z.string().trim().max(40).optional(),
    collection: z.enum(BOOK_COLLECTIONS).optional(),
    directionId: z.uuid().nullable().optional(),
    courseId: z.uuid().nullable().optional(),
    published: z.boolean().optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdateBookInput = z.infer<typeof updateBookSchema>;

export const bookProgressSchema = z.object({ page: z.number().int().min(1).max(10_000) }).strict();

export const bookPagesQuerySchema = z
  .object({
    from: z.coerce.number().int().min(1).max(10_000),
    to: z.coerce.number().int().min(1).max(10_000),
    size: z.enum(BOOK_SIZES).default('lg'),
  })
  .strict()
  .refine((v) => v.to >= v.from && v.to - v.from < 12, { message: 'range' });
export type BookPagesQuery = z.infer<typeof bookPagesQuerySchema>;

export interface BookTocEntry {
  title: string;
  page: number;
  level: number;
}

export interface BookSummary {
  id: string;
  title: string;
  author: string;
  year: number | null;
  description: string;
  publisher: string;
  isbn: string;
  collection: BookCollection;
  direction: { slug: string; title: string } | null;
  course: { id: string; title: string } | null;
  pageCount: number;
  /** Text was extracted, so the reader can search inside the book. */
  searchable: boolean;
  /** Reader's last page; null before the first visit. */
  progress: { page: number; percent: number } | null;
  createdAt: string;
}

export interface BookDetail extends BookSummary {
  toc: BookTocEntry[];
  /** First page size in points; the reader keeps this aspect ratio. */
  pageWidth: number;
  pageHeight: number;
  /** Text drawn over every page (also stamped into the images by the server). */
  watermark: string;
}

export interface BookAdmin extends Omit<BookSummary, 'progress'> {
  status: BookStatus;
  /** Why processing failed (safe, user-facing text). */
  error: string | null;
  published: boolean;
  fileSize: number;
  directionId: string | null;
  courseId: string | null;
}

export interface BookPageUrls {
  expiresAt: string;
  pages: { page: number; url: string }[];
}

export interface BookAlert {
  at: string;
  bookId: string | null;
  bookTitle: string | null;
  userName: string | null;
  userLogin: string | null;
}

export interface BookAdminList {
  books: BookAdmin[];
  alerts: BookAlert[];
  directions: { id: string; title: string }[];
  courses: { id: string; title: string }[];
  limits: { maxBytes: number; maxPages: number };
}

// ---- Search inside a book ----

/**
 * How book text and queries are compared: Latin script (Cyrillic transliterated), lower case,
 * no apostrophes, single spaces. "Ўзбек" and "o‘zbek" both become "ozbek".
 */
export function normalizeBookText(input: string): string {
  return toLatin(input).replace(/\s+/g, ' ');
}

export const bookSearchQuerySchema = z
  .object({ q: z.string().trim().min(2).max(100) })
  .strict()
  .refine((v) => normalizeBookText(v.q).trim().length >= 2, { message: 'short' });

/** Where on the page a match is: fractions of the page width/height (0..1). */
export type BookRect = [x: number, y: number, w: number, h: number];

export interface BookSearchHit {
  page: number;
  /** Original text around the first match on the page. */
  before: string;
  match: string;
  after: string;
  /** Matches on this page (capped). */
  count: number;
  rects: BookRect[];
}

export interface BookSearchResponse {
  query: string;
  hits: BookSearchHit[];
  /** Pages with a match (may exceed hits.length when capped). */
  pages: number;
  truncated: boolean;
}

/** Public card of an author's book (no reading access implied). */
export interface PublicBook {
  id: string;
  title: string;
  author: string;
  year: number | null;
  publisher: string;
  isbn: string;
  description: string;
  pageCount: number;
  searchable: boolean;
}
