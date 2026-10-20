import type { ProjectFile } from '@webdizayn/shared';
import { at, md, pic, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const HERO = `<section class="hero">
  <div class="matn">
    <p class="kicker">Yangi mavsum</p>
    <h1>Veb-dizaynni 3 oyda o‘rganing</h1>
    <p>Har darsda amaliy mashq, natija darhol tekshiriladi.</p>
    <div class="tugmalar">
      <a class="tugma asosiy" href="#">Bepul boshlash</a>
      <a class="tugma" href="#">Dastur bilan tanishish</a>
    </div>
  </div>
  ${pic('0071dc', 'Talaba noutbukda kod yozmoqda', 600, 450, ' class="rasm"')}
</section>`;

const HERO_CSS = `${RESET}

.hero {
  padding: 48px 16px;
}

.tugmalar {
  display: flex;
  gap: 12px;
}

.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: 20px;
  border: 1px solid #0071dc;
  border-radius: 8px;
  white-space: nowrap;
}

.asosiy {
  background-color: #0071dc;
  color: white;
}

.rasm {
  display: block;
  max-width: 100%;
  height: auto;
}`;

const PRICES = `<section class="tariflar">
  <article class="tarif">
    <h2>Boshlang‘ich</h2>
    <p class="narx">Bepul</p>
    <a class="tugma" href="#">Tanlash</a>
  </article>
  <article class="tarif tavsiya">
    <h2>Standart</h2>
    <p class="narx">99 000 so‘m / oy</p>
    <a class="tugma" href="#">Tanlash</a>
  </article>
  <article class="tarif">
    <h2>Guruh</h2>
    <p class="narx">Kelishiladi</p>
    <a class="tugma" href="#">Bog‘lanish</a>
  </article>
</section>`;

const PRICES_CSS = `${RESET}

.tarif {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.tavsiya {
  border-color: #0071dc;
}`;

const BROKEN = `<div class="sahifa">
  <div class="banner">Kuzgi chegirma — 20%</div>
  ${pic('fec400', 'Kurs muqovasi', 800, 400)}
  <p>Batafsil: <a class="havola" href="#">https://webdizayn.uz/kurslar/moslashuvchan-dizayn/darslar/birinchi-dars</a></p>
  <div class="jadval-quti">
    <table>
      <tr><th>Kurs</th><th>Darslar</th><th>Mashqlar</th><th>Testlar</th><th>Davomiylik</th></tr>
      <tr><td>Moslashuvchan dizayn</td><td>28</td><td>27</td><td>6</td><td>1 oy</td></tr>
    </table>
  </div>
  <button type="button" class="ikonka-tugma" aria-label="Sevimlilarga qo‘shish">
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 21l-8-8a5 5 0 017-7l1 1 1-1a5 5 0 017 7z" fill="currentColor"/></svg>
  </button>
</div>`;

const BROKEN_CSS = `${RESET}

.sahifa {
  padding-inline: 16px;
}

.banner {
  width: 500px;
  padding: 12px;
  background-color: #fff3cd;
}

.ikonka-tugma {
  display: grid;
  place-items: center;
  padding: 4px;
}`;

export const m06: ModuleDef = {
  title: 'Amaliy loyiha: lending sahifa',
  lessons: [
    {
      slug: 'lending-bosh',
      title: 'Lending: bosh ekran',
      exercise: {
        title: 'Moslashuvchan hero bo‘limi',
        description: 'Ekran balandligi, ikki ustun va o‘raladigan tugmalar.',
        instructions: md(
          '1. `.hero`: `display: grid`, `gap: 32px`, `align-content: center`, `min-height: min(100dvh, 720px)`.',
          '2. `@media (min-width: 900px)`: `.hero` — `grid-template-columns: 1fr 1fr`, `align-items: center`.',
          '3. `.tugmalar`: `flex-wrap: wrap` — tor ekranda tugmalar keyingi qatorga tushadi.',
          '4. `h1`: `font-size: clamp(2rem, 1.25rem + 3vw, 3.5rem)`.',
        ),
        expectedBehavior:
          'Telefonda matn va rasm ustma-ust, kompyuterda yonma-yon; bo‘lim ekranni to‘ldiradi, lekin 720px dan oshmaydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(HERO, HERO_CSS),
        checks: [
          at(
            1280,
            800,
            style(
              'cols',
              'Kompyuterda ikki ustun',
              '.hero',
              'grid-template-columns',
              '608px 608px',
            ),
          ),
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.hero', 'grid-template-columns', '343px'),
          ),
          at(
            1280,
            800,
            style('cap', 'Balandlik 720px dan oshmaydi', '.hero', 'min-height', '720px'),
          ),
          at(
            375,
            600,
            style('screen', 'Past ekranda — ekran balandligi', '.hero', 'min-height', '600px', {
              hidden: true,
            }),
          ),
          style('wrap', 'Tugmalar o‘raladi', '.tugmalar', 'flex-wrap', 'wrap'),
        ],
      },
    },
    {
      slug: 'lending-narxlar',
      title: 'Lending: tariflar',
      exercise: {
        title: 'Tariflar to‘ri va tavsiya etilgan tarif',
        description: '`auto-fit` to‘r va telefonda tavsiya etilgan tarifni birinchi qo‘yish.',
        instructions: md(
          '1. `.tariflar`: `display: grid`, `gap: 24px`, `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))`, `max-width: 1100px`, `margin-inline: auto`, `padding-inline: 16px`.',
          '2. Telefonda (`max-width: 599px`) `.tavsiya` — `order: -1` (birinchi ko‘rinsin).',
          '3. `.tarif`: `display: flex`, `flex-direction: column`; `.tugma`: `margin-top: auto`.',
        ),
        expectedBehavior:
          'Kompyuterda uch tarif yonma-yon, telefonda ustma-ust va “Standart” birinchi.',
        difficulty: 'MEDIUM',
        starterFiles: site(PRICES, PRICES_CSS),
        checks: [
          at(
            1200,
            800,
            style(
              'cols',
              'Kompyuterda uch ustun',
              '.tariflar',
              'grid-template-columns',
              '340px 340px 340px',
            ),
          ),
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.tariflar', 'grid-template-columns', '343px'),
          ),
          at(
            375,
            700,
            style('first', 'Telefonda tavsiya etilgan tarif birinchi', '.tavsiya', 'order', '-1'),
          ),
          at(
            1200,
            800,
            style('keep', 'Kompyuterda tartib o‘zgarmaydi', '.tavsiya', 'order', '0', {
              hidden: true,
            }),
          ),
          style('col', 'Tarif ichida ustun', '.tarif', 'flex-direction', 'column'),
        ],
      },
    },
    {
      slug: 'sinov',
      title: 'Sinov va tuzatish',
      exercise: {
        title: 'Buzilgan sahifani tuzatish',
        description: 'Telefonda gorizontal aylanishga sabab bo‘ladigan beshta xato.',
        instructions: md(
          'Sahifani 375px kenglikda oching va quyidagilarni tuzating:',
          '1. `.banner`: `width: 500px` o‘rniga `max-width: 500px`.',
          '2. `img`: `display: block`, `max-width: 100%`, `height: auto`.',
          '3. `.havola`: `overflow-wrap: anywhere` — uzun manzil qatorga sig‘sin.',
          '4. `.jadval-quti`: `overflow-x: auto`.',
          '5. `.ikonka-tugma`: `min-width: 44px`, `min-height: 44px`.',
        ),
        expectedBehavior:
          'Telefonda sahifa yon tomonga aylanmaydi, ikonka tugmasini barmoq bilan bosish qulay.',
        difficulty: 'EASY',
        starterFiles: site(BROKEN, BROKEN_CSS),
        checks: [
          at(375, 700, style('banner', 'Banner ekranga sig‘adi', '.banner', 'width', '343px')),
          at(375, 700, style('img', 'Rasm ekranga sig‘adi', 'img', 'width', '343px')),
          style('url', 'Uzun manzil o‘raladi', '.havola', 'overflow-wrap', 'anywhere'),
          style('table', 'Jadval o‘ramda aylanadi', '.jadval-quti', 'overflow-x', 'auto'),
          style('tap', 'Ikonka tugmasi kamida 44px', '.ikonka-tugma', 'min-width', '44px'),
        ],
      },
      quiz: quiz('6-modul testi: Amaliy loyiha', [
        q(
          'm6-hero',
          '`min-height: min(100dvh, 720px)` nimani beradi?',
          [
            'Bo‘lim ekranni to‘ldiradi, lekin juda baland ekranda 720px dan oshmaydi',
            'Bo‘lim doim 720px',
            'Bo‘lim ekrandan 720px baland',
            'Faqat telefonda ishlaydi',
          ],
          [0],
        ),
        q(
          'm6-overflow',
          'Telefonda gorizontal aylanish paydo bo‘lishining odatiy sabablari? (bir nechta javob)',
          [
            'Pikselda berilgan katta `width`',
            '`max-width` siz rasm',
            'O‘ralmaydigan uzun so‘z yoki manzil',
            '`rem` dagi shrift o‘lchami',
          ],
          [0, 1, 2],
        ),
        q(
          'm6-find',
          'Qaysi element sahifani kengaytirayotganini qanday topish mumkin?',
          [
            'DevTools’da qurilma rejimida aylantirib, kenglikdan chiqqan elementni tanlash yoki vaqtincha `* { outline: 1px solid red }` qo‘shish',
            'Sahifani qayta yuklash',
            'Brauzer keshini tozalash',
            'Barcha CSS’ni o‘chirish',
          ],
          [0],
        ),
        q(
          'm6-real',
          'Nega sahifani haqiqiy telefonda ham sinash kerak?',
          [
            'DevTools taqlidi barmoq bilan bosish, haqiqiy tezlik va brauzer panellarini to‘liq ko‘rsatmaydi',
            'DevTools noto‘g‘ri kenglik ko‘rsatadi',
            'Telefonda CSS boshqacha yoziladi',
            'Kerak emas',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  'lending-bosh': site(
    HERO,
    `${HERO_CSS.replace(
      '.hero {\n  padding: 48px 16px;\n}',
      '.hero {\n  display: grid;\n  gap: 32px;\n  align-content: center;\n  min-height: min(100dvh, 720px);\n  padding: 48px 16px;\n}',
    ).replace('.tugmalar {\n  display: flex;', '.tugmalar {\n  display: flex;\n  flex-wrap: wrap;')}

h1 {
  font-size: clamp(2rem, 1.25rem + 3vw, 3.5rem);
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}`,
  ),
  'lending-narxlar': site(
    PRICES,
    `${PRICES_CSS}

.tariflar {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: 16px;
}

.tarif {
  display: flex;
  flex-direction: column;
}

.tugma {
  margin-top: auto;
}

@media (max-width: 599px) {
  .tavsiya {
    order: -1;
  }
}`,
  ),
  sinov: site(
    BROKEN,
    `${BROKEN_CSS.replace('width: 500px;', 'max-width: 500px;').replace(
      '.ikonka-tugma {\n  display: grid;',
      '.ikonka-tugma {\n  min-width: 44px;\n  min-height: 44px;\n  display: grid;',
    )}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

.havola {
  overflow-wrap: anywhere;
}

.jadval-quti {
  overflow-x: auto;
}`,
  ),
};
