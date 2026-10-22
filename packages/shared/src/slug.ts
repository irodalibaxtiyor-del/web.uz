import { z } from 'zod';

export const SLUG_MAX = 80;

/** Lowercase latin letters and digits, single `-` between words, no `-` at either end. */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Uzbek (and Russian) Cyrillic → Uzbek Latin. `е` is handled separately (ye/e). */
const CYRILLIC: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'x',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sh',
  ъ: '',
  ы: 'i',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ў: 'o',
  ғ: 'g',
  қ: 'q',
  ҳ: 'h',
};

const VOWELS = new Set('аеёиоуэюяўaeiou');

/** Every apostrophe-like mark used in Uzbek Latin (oʻ, g‘, o', o`, ʼ …). */
const APOSTROPHES = /['`´ʹʻʼʽ‘’‛′]/g;

/**
 * URL slug from a title in Uzbek Latin or Cyrillic (or Russian):
 * "Oʻzbek tili: Grammatika asoslari" → "ozbek-tili-grammatika-asoslari",
 * "Ўзбек тили" → "ozbek-tili". Returns "" when nothing usable is left.
 */
export function slugify(input: string, max = SLUG_MAX): string {
  const slug = toLatin(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return trimSlug(slug, max);
}

/**
 * Lowercase Uzbek Latin without apostrophes or diacritics, other characters kept:
 * "Ўзбек тили" → "ozbek tili", "Oʻqish" → "oqish". Used for slugs and for matching text
 * typed in either script.
 */
export function toLatin(input: string): string {
  const lower = input.normalize('NFC').toLowerCase();
  let out = '';
  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i]!;
    if (ch === 'е') {
      // Uzbek Cyrillic writes "ye" as е at the start of a word and after a vowel ("Ер" → "yer").
      const prev = i > 0 ? lower[i - 1]! : ' ';
      out += /[\p{L}]/u.test(prev) && !VOWELS.has(prev) ? 'e' : 'ye';
    } else {
      out += CYRILLIC[ch] ?? ch;
    }
  }
  return out.replace(APOSTROPHES, '').normalize('NFKD').replace(/\p{M}/gu, ''); // é → e, ñ → n
}

/** Cut to `max` characters without leaving a trailing `-`. */
function trimSlug(slug: string, max: number): string {
  return slug.length <= max ? slug : slug.slice(0, max).replace(/-+$/, '');
}

/** Candidate number `n` for a base slug: n = 1 → base, n ≥ 2 → "base-n", always ≤ 80 chars. */
export function slugCandidate(base: string, n: number): string {
  if (n <= 1) return trimSlug(base, SLUG_MAX);
  const suffix = `-${n}`;
  return `${trimSlug(base, SLUG_MAX - suffix.length)}${suffix}`;
}

/**
 * Server-side check for a slug typed by a person. It is not silently rewritten: anything that
 * is not already a valid slug (after trimming and lower-casing) is rejected.
 */
export const courseSlugSchema = z.string().trim().toLowerCase().min(1).max(SLUG_MAX).regex(SLUG_RE);

/** Query for the live slug preview in the course form (`courseId` excludes the course itself). */
export const slugSuggestionQuerySchema = z
  .object({
    title: z.string().max(200).optional(),
    slug: courseSlugSchema.optional(),
    courseId: z.uuid().optional(),
  })
  .strict();
export type SlugSuggestionQuery = z.infer<typeof slugSuggestionQuerySchema>;

export interface SlugSuggestion {
  /** The slug asked for (typed, or generated from the title). */
  requested: string;
  /** What the server would assign now: `requested`, or the first free "-2", "-3"… */
  slug: string;
  /** Whether `requested` itself is free. */
  available: boolean;
}
