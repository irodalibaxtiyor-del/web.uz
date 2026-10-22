import { Injectable } from '@nestjs/common';
import type { ChatLink, PublicCourseSummary } from '@webdizayn/shared';
import { CatalogService } from '../catalog/catalog.service';
import { FAQ } from './faq';
import { Bm25Index, type SearchDoc, type SearchHit } from './search';

export interface KbDoc extends SearchDoc {
  kind: 'faq' | 'direction' | 'course';
  /** Short label for follow-up suggestion buttons. */
  question: string;
  answer: string;
  links: ChatLink[];
}

/** The catalogue changes rarely; a new course shows up in answers within this time. */
const TTL_MS = 5 * 60_000;

/**
 * The chatbot's knowledge: the FAQ plus the public catalogue (directions and published
 * platform courses, through CatalogService — the same data guests can already see). Nothing
 * about learners, lesson bodies, exercises or answers is ever indexed.
 */
@Injectable()
export class KnowledgeBase {
  private index: { built: number; promise: Promise<Bm25Index<KbDoc>> } | null = null;

  constructor(private readonly catalog: CatalogService) {}

  async search(query: string, limit = 4): Promise<SearchHit<KbDoc>[]> {
    return (await this.current()).search(query, limit);
  }

  /** Forget the cached catalogue (tests, or right after seeding). */
  invalidate() {
    this.index = null;
  }

  private current(): Promise<Bm25Index<KbDoc>> {
    if (!this.index || Date.now() - this.index.built > TTL_MS) {
      const promise = this.build();
      this.index = { built: Date.now(), promise };
      // A failed build is not cached: the next question retries.
      promise.catch(() => {
        if (this.index?.promise === promise) this.index = null;
      });
    }
    return this.index.promise;
  }

  private async build(): Promise<Bm25Index<KbDoc>> {
    const docs: KbDoc[] = FAQ.map((f) => ({
      id: `faq:${f.id}`,
      kind: 'faq',
      title: [f.question, ...f.ask].join('. '),
      body: f.answer,
      question: f.question,
      answer: f.answer,
      links: f.links,
    }));

    const courses = new Map<string, { course: PublicCourseSummary; directions: string[] }>();
    for (const d of await this.catalog.directions()) {
      const detail = await this.catalog.direction(d.slug);
      for (const c of detail.courses) {
        const entry = courses.get(c.slug) ?? { course: c, directions: [] };
        entry.directions.push(d.title);
        courses.set(c.slug, entry);
      }
      const list = detail.courses.map((c) => `«${c.title}»`).join(', ');
      docs.push({
        id: `direction:${d.slug}`,
        kind: 'direction',
        title: `${d.title} yo‘nalishi`,
        body: [d.summary, detail.description, ...detail.courses.map((c) => c.title)].join('. '),
        question: `${d.title} yo‘nalishi haqida`,
        answer:
          `${d.title}: ${d.summary}` +
          (list
            ? `\n\nBu yo‘nalishdagi kurslar: ${list}.`
            : '\n\nHozircha bu yo‘nalishda e’lon qilingan kurs yo‘q.'),
        links: [
          { label: `${d.title} yo‘nalishi`, href: `/yonalishlar/${d.slug}` },
          ...detail.courses
            .slice(0, 3)
            .map((c) => ({ label: c.title, href: `/kurslar/${c.slug}` })),
        ],
      });
    }

    for (const { course: c, directions } of courses.values()) {
      const detail = await this.catalog.course(c.slug);
      const modules = 'modules' in detail ? detail.modules.map((m) => m.title) : [];
      const n = c.counts;
      const parts = [`${n.modules} modul`, `${n.lessons} dars`];
      if (n.exercises) parts.push(`${n.exercises} ta avtomatik tekshiriladigan mashq`);
      if (n.quizzes) parts.push(`${n.quizzes} ta test`);
      docs.push({
        id: `course:${c.slug}`,
        kind: 'course',
        title: `${c.title} kursi`,
        body: [c.description, ...directions, ...modules].join('. '),
        question: `«${c.title}» kursi haqida`,
        answer: `«${c.title}» kursi: ${c.description}\n\nKursda ${parts.join(', ')} bor.`,
        links: [{ label: `«${c.title}» kursi`, href: `/kurslar/${c.slug}` }],
      });
    }
    return new Bm25Index(docs);
  }
}
