import { describe, expect, it } from 'vitest';
import { MIN_COVERAGE, MIN_SCORE } from './chatbot.service';
import { FAQ } from './faq';
import { Bm25Index, terms } from './search';

const index = new Bm25Index(
  FAQ.map((f) => ({ id: f.id, title: [f.question, ...f.ask].join('. '), body: f.answer })),
);

/** What the bot would answer from the FAQ alone, or null for "I don't know". */
function answer(q: string): string | null {
  const top = index.search(q)[0];
  return top && top.score >= MIN_SCORE && top.coverage >= MIN_COVERAGE ? top.doc.id : null;
}

describe('terms', () => {
  it('reads Latin and Cyrillic the same, ignoring case and apostrophe forms', () => {
    expect(terms('Курсга қандай ёзиламан?')).toEqual(terms('kursga QANDAY yozilaman'));
    expect(terms('Yo‘nalish')).toEqual(terms("yo'nalish"));
    expect(terms('Yo‘nalish')).toEqual(terms('yoʻnalish'));
  });

  it('strips suffixes but keeps short stems whole', () => {
    expect(terms('kursga')).toEqual(terms('kursi'));
    expect(terms('kurslarni')).toEqual(['kurs']);
    expect(terms('tekshirish')).toEqual(terms('tekshiriladi'));
  });

  it('drops stop words and generic verbs', () => {
    expect(terms('Qanday qilsam bo‘ladi, iltimos?')).toEqual([]);
    expect(terms('sertifikat berasizlarmi')).toEqual(terms('sertifikat'));
  });
});

describe('FAQ retrieval', () => {
  it.each([
    ['Kursga qanday yozilaman?', 'enroll'],
    ['Курсга қандай ёзиламан?', 'enroll'],
    ['Qaysi yo‘nalishdan boshlash kerak?', 'where-to-start'],
    ['Mashq qanday tekshiriladi?', 'check'],
    ['Parolimni unutdim', 'forgot-password'],
    ['парол эсимдан чиқди', 'forgot-password'],
    ['Elektron darslik qayerda?', 'books'],
    ['kitobni yuklab olsam bo‘ladimi', 'books'],
    ['Portfolio nima?', 'portfolio'],
    ['sertifikat berasizlarmi', 'certificate'],
    ['dars nega ochilmayapti', 'locked'],
    ['admin bilan gaplashmoqchiman', 'contact'],
    ['salom', 'greeting'],
  ])('%s → %s', (q, id) => {
    expect(answer(q)).toBe(id);
  });

  it('says "I don\'t know" instead of guessing from a common word', () => {
    // Prices, schedules and off-topic questions are not in the knowledge base.
    for (const q of [
      'Kurslar pullikmi?',
      'kurs narxi qancha',
      'ob-havo qanday',
      'Toshkentda qayerda o‘qisa bo‘ladi',
      '???',
    ]) {
      expect(answer(q)).toBeNull();
    }
  });

  it('every FAQ entry is found by its own question', () => {
    for (const f of FAQ) expect(answer(f.question), f.question).toBe(f.id);
  });
});
