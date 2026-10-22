import { toLatin } from '@webdizayn/shared';

/**
 * Retrieval for the help chatbot: Uzbek text in Latin or Cyrillic is normalized to Latin,
 * lightly stemmed, and ranked with BM25.
 */

/**
 * Common Uzbek suffixes, longest first, stripped repeatedly. The stem keeps at least 3 letters,
 * or 4 for 2-letter suffixes (so "kursi" stays "kurs", not "kur").
 */
const SUFFIXES = [
  'laringiz',
  'larimiz',
  'yapman',
  'yapsiz',
  'yapti',
  'ingiz',
  'imiz',
  'lari',
  'larni',
  'larga',
  'larda',
  'lardan',
  'ning',
  'dagi',
  'dan',
  'lar',
  'sini',
  'siz',
  'man',
  'miz',
  'mi',
  'ni',
  'ga',
  'ka',
  'qa',
  'da',
  'im',
  'ing',
  'si',
  'i',
];

/** Index keys are cut to this many letters: "tekshirish", "tekshiriladi" → "teksh". */
const KEY_LEN = 5;

function stem(word: string): string {
  let w = word;
  for (let changed = true; changed;) {
    changed = false;
    for (const s of SUFFIXES) {
      if (w.length - s.length >= (s.length <= 2 ? 4 : 3) && w.endsWith(s)) {
        w = w.slice(0, -s.length);
        changed = true;
        break;
      }
    }
  }
  return w.slice(0, KEY_LEN);
}

/** Words that say nothing about the topic ("how", "I", "please" …). Compared after stemming. */
const STOP = new Set(
  [
    'qanday',
    'qanaqa',
    'qaysi',
    'nima',
    'nimaga',
    'nega',
    'qachon',
    'qayerda',
    'qayer',
    'qani',
    'qancha',
    'men',
    'mening',
    'meni',
    'menga',
    'biz',
    'siz',
    'sizning',
    'u',
    'bu',
    'shu',
    'va',
    'yoki',
    'bilan',
    'uchun',
    'kerak',
    'mumkin',
    'bormi',
    'bor',
    'yoq',
    'ham',
    'edi',
    'emas',
    'iltimos',
    'ayting',
    'aytib',
    'bering',
    'qilish',
    'qilaman',
    'qilsam',
    'qila',
    'qiling',
    'boladi',
    'bolsa',
    // Generic verbs: "berasizlarmi", "olsam", "istayman" say nothing about the topic.
    'berasiz',
    'beradi',
    'beraman',
    'olsam',
    'olaman',
    'olish',
    'istayman',
    'xohlayman',
    'mumkinmi',
    'kerakmi',
    'ni',
    'da',
    'ga',
    'how',
    'what',
    'the',
    'is',
    'a',
    'i',
    'to',
    'do',
    'can',
  ].map((w) => stem(w)),
);

/** Search terms of a text: Latin, lowercase, stemmed, without stop words or 1-letter tokens. */
export function terms(text: string): string[] {
  return toLatin(text)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 2)
    .map(stem)
    .filter((t) => !STOP.has(t));
}

export interface SearchDoc {
  id: string;
  /** Matched with double weight (question wording, titles). */
  title: string;
  body: string;
}

export interface SearchHit<D> {
  doc: D;
  score: number;
  /**
   * Share of the query's information (IDF-weighted) that this document contains, 0..1.
   * Low coverage means the question is about something the knowledge base does not cover,
   * even if a common word like "kurs" matched.
   */
  coverage: number;
}

const K1 = 1.2;
const B = 0.75;

export class Bm25Index<D extends SearchDoc> {
  private readonly tf: Map<string, number>[] = [];
  private readonly len: number[] = [];
  private readonly df = new Map<string, number>();
  private readonly avgLen: number;

  constructor(private readonly docs: D[]) {
    for (const d of docs) {
      const ts = [...terms(d.title), ...terms(d.title), ...terms(d.body)];
      const m = new Map<string, number>();
      for (const t of ts) m.set(t, (m.get(t) ?? 0) + 1);
      this.tf.push(m);
      this.len.push(ts.length);
      for (const t of m.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    }
    this.avgLen = this.len.reduce((a, b) => a + b, 0) / Math.max(1, docs.length);
  }

  /** Unknown terms get the highest weight, so they pull coverage down. */
  private idf(term: string) {
    const n = this.docs.length;
    const df = this.df.get(term) ?? 0;
    return Math.log(1 + (n - df + 0.5) / (df + 0.5));
  }

  search(query: string, limit = 5): SearchHit<D>[] {
    const q = [...new Set(terms(query))];
    if (q.length === 0) return [];
    const totalIdf = q.reduce((s, t) => s + this.idf(t), 0);
    const hits: SearchHit<D>[] = [];
    this.docs.forEach((doc, i) => {
      const tf = this.tf[i]!;
      let score = 0;
      let covered = 0;
      for (const t of q) {
        const f = tf.get(t);
        if (!f) continue;
        const idf = this.idf(t);
        covered += idf;
        score += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * this.len[i]!) / this.avgLen));
      }
      if (score > 0) hits.push({ doc, score, coverage: covered / totalIdf });
    });
    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
