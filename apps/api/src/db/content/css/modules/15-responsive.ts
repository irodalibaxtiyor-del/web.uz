import { at, attr, files, has, md, q, quiz, site, style, type ModuleDef } from '../shared';
import { pic } from './08-components';

const cards = (n: number) =>
  Array.from({ length: n }, (_, i) => `  <div class="karta">Kartochka ${i + 1}</div>`).join('\n');

/** Markup shared by the starter files and the reference solutions. */
export const BODY15 = {
  intro: `<div class="konteyner">
  <h1>Moslashuvchan sahifa</h1>
  <div class="kartalar">
${cards(4)}
  </div>
</div>`,
  gridView: `<div class="tor">
  <main class="md-8">Asosiy kontent</main>
  <aside class="md-4">Yon panel</aside>
</div>`,
  mq: `<div class="maket">
  <main>Asosiy</main>
  <aside>Yon</aside>
</div>
<p class="faqat-katta">Bu blok faqat katta ekranda ko‘rinadi.</p>`,
  mqExamples: `<div class="kartalar">
${cards(4)}
</div>`,
  images: `${pic('0071dc', 'Chorvoq suv ombori', 1200, 800).replace('<img', '<img class="rasm"')}
<div class="karta">
  ${pic('fec400', 'Galereyadagi rasm', 400, 400)}
</div>`,
  videos: `<div class="video">
  <iframe width="560" height="315"></iframe>
</div>`,
  frameworks: `<div class="flex flex-col md:flex-row items-center gap-4 p-4">
  <div>Birinchi</div>
  <div>Ikkinchi</div>
  <div>Uchinchi</div>
</div>`,
};

export const BASE_CSS = `body {
  margin: 0;
}`;

export const VIEWPORT_CSS = `body {
  margin: 0;
}

.maqola {
  width: 800px;
}`;

export function viewportPage(meta: string, body: string): Record<string, string> {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="${meta}">
    <title>Mashq</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
${body
  .trim()
  .split('\n')
  .map((l) => `    ${l}`)
  .join('\n')}
  </body>
</html>
`,
  };
}

export const VIEWPORT_BODY = `<article class="maqola">
  ${pic('0071dc', 'Keng rasm', 1200, 400)}
  <div class="jadval-quti">
    <table>
      <tr><th>Kurs</th><th>Darslar</th><th>Mashqlar</th><th>Testlar</th><th>Narx</th><th>Muddat</th></tr>
      <tr><td>CSS: to‘liq kurs</td><td>101</td><td>101</td><td>15</td><td>240 000 so‘m</td><td>3 oy</td></tr>
    </table>
  </div>
</article>`;

const BAD_META = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

export const m15: ModuleDef = {
  title: 'Moslashuvchan dizayn',
  lessons: [
    {
      slug: 'rwd-intro',
      title: 'Moslashuvchan dizayn nima?',
      exercise: {
        title: 'Media so‘rovsiz moslashuv',
        description: '`min()`, `clamp()` va `auto-fill` bilan suyuq sahifa.',
        instructions: md(
          '1. `.konteyner`: `width: min(100% - 32px, 1100px)`, `margin-inline: auto`.',
          '2. `h1`: `font-size: clamp(1.75rem, 4vw + 1rem, 3rem)`.',
          '3. `.kartalar`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`, `gap: 16px`.',
        ),
        expectedBehavior:
          'Telefonda bitta ustun va kichikroq sarlavha, kompyuterda bir nechta ustun.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY15.intro,
          `${BASE_CSS}\n\n.karta {\n  padding: 16px;\n  background-color: #f5faff;\n}`,
        ),
        checks: [
          at(
            1000,
            700,
            style('container', 'Konteyner chetlardan 16px', '.konteyner', 'width', '968px'),
          ),
          at(400, 700, style('container-sm', 'Telefonda ham 16px', '.konteyner', 'width', '368px')),
          at(
            1000,
            700,
            style(
              'cols',
              'Kompyuterda 3 ustun',
              '.kartalar',
              'grid-template-columns',
              '312px 312px 312px',
            ),
          ),
          at(
            400,
            700,
            style('cols-sm', 'Telefonda 1 ustun', '.kartalar', 'grid-template-columns', '368px'),
          ),
          at(1400, 700, style('h1', 'Sarlavha 3rem dan oshmaydi', 'h1', 'font-size', '48px')),
        ],
      },
    },
    {
      slug: 'rwd-viewport',
      title: 'Viewport meta tegi',
      exercise: {
        title: 'Telefonga tayyorlash',
        description: 'To‘g‘ri viewport va ekrandan chiqmaydigan kontent.',
        instructions: md(
          '1. `index.html` dagi viewport tegidan `maximum-scale=1` va `user-scalable=no` ni olib tashlang: `content="width=device-width, initial-scale=1"`.',
          '2. `.maqola` dagi `width: 800px` ni `max-width: 800px` ga almashtiring.',
          '3. `img`: `max-width: 100%`, `height: auto`.',
          '4. `.jadval-quti`: `overflow-x: auto`.',
        ),
        expectedBehavior: 'Telefonda sahifa yon tomonga aylanmaydi va kattalashtirish mumkin.',
        difficulty: 'MEDIUM',
        starterFiles: files({
          ...viewportPage(BAD_META, VIEWPORT_BODY),
          'style.css': `${VIEWPORT_CSS}\n`,
        }),
        checks: [
          attr(
            'meta',
            'Viewport to‘g‘ri',
            'meta[name="viewport"]',
            'content',
            'width=device-width, initial-scale=1',
          ),
          has('zoom', 'Kattalashtirish taqiqlanmagan', 'meta[content*="user-scalable"]', {
            min: 0,
            max: 0,
            hint: 'Ko‘zi yaxshi ko‘rmaydiganlar sahifani kattalashtira olishi kerak.',
          }),
          at(375, 700, style('article', 'Maqola ekranga sig‘adi', '.maqola', 'width', '375px')),
          at(375, 700, style('img', 'Rasm ekranga sig‘adi', '.maqola img', 'width', '375px')),
          style('table', 'Jadval o‘ramda aylanadi', '.jadval-quti', 'overflow-x', 'auto'),
        ],
      },
    },
    {
      slug: 'rwd-grid-view',
      title: 'To‘r ko‘rinishi',
      exercise: {
        title: '12 ustunli to‘r',
        description: '`repeat(12, 1fr)`, `span` va mobil birinchi yondashuv.',
        instructions: md(
          '1. `.tor`: `display: grid`, `grid-template-columns: repeat(12, 1fr)`, `gap: 24px`.',
          '2. Standart holda `.tor > *` — `grid-column: span 12`.',
          '3. `@media (min-width: 768px)`: `.md-8` — `span 8`, `.md-4` — `span 4`.',
        ),
        expectedBehavior: 'Telefonda asosiy kontent va yon panel ustma-ust, kompyuterda 8 + 4.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY15.gridView,
          `${BASE_CSS}\n\n.tor > * {\n  padding: 16px;\n  background-color: #f5faff;\n}`,
        ),
        checks: [
          style('grid', 'To‘r grid', '.tor', 'display', 'grid'),
          style('gap', 'Ustunlar orasida 24px', '.tor', 'column-gap', '24px'),
          at(
            375,
            700,
            style('mobile', 'Telefonda butun kenglik', 'main', 'grid-column-start', 'span 12'),
          ),
          at(
            1000,
            700,
            style('main', 'Kompyuterda asosiy 8 ustun', 'main', 'grid-column-start', 'span 8'),
          ),
          at(
            1000,
            700,
            style('aside', 'Kompyuterda yon 4 ustun', 'aside', 'grid-column-start', 'span 4'),
          ),
        ],
      },
    },
    {
      slug: 'media-queries',
      title: 'Media so‘rovlar',
      exercise: {
        title: 'Tanaffus nuqtalari',
        description: '`min-width` so‘rovlari bilan maket va ko‘rinish.',
        instructions: md(
          '1. `.maket`: `display: grid`, `gap: 16px` — standart holda bitta ustun.',
          '2. `@media (min-width: 768px)`: `.maket` — `grid-template-columns: 2fr 1fr`.',
          '3. `.faqat-katta`: standart holda `display: none`; `@media (min-width: 1024px)` da `display: block`.',
        ),
        expectedBehavior:
          'Telefonda bitta ustun, planshetdan boshlab ikki ustun; maxsus blok faqat katta ekranda.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY15.mq, BASE_CSS),
        checks: [
          at(
            375,
            700,
            style('mobile', 'Telefonda bitta ustun', '.maket', 'grid-template-columns', '375px'),
          ),
          at(
            767,
            700,
            style('edge', '767px da hali bitta ustun', '.maket', 'grid-template-columns', '767px'),
          ),
          at(
            916,
            700,
            style('tablet', 'Planshetda 2:1', '.maket', 'grid-template-columns', '600px 300px'),
          ),
          at(
            375,
            700,
            style('hidden', 'Telefonda blok yashirin', '.faqat-katta', 'display', 'none'),
          ),
          at(
            1100,
            700,
            style('shown', 'Katta ekranda blok ko‘rinadi', '.faqat-katta', 'display', 'block'),
          ),
        ],
      },
    },
    {
      slug: 'mq-examples',
      title: 'Media so‘rov misollari',
      exercise: {
        title: '1 → 2 → 4 ustun va katta shrift',
        description: 'Bir nechta tanaffus nuqtasi.',
        instructions: md(
          '1. `.kartalar`: `display: grid`, `gap: 16px` (standart — bitta ustun).',
          '2. `@media (min-width: 600px)`: `repeat(2, 1fr)`.',
          '3. `@media (min-width: 1024px)`: `repeat(4, 1fr)`.',
          '4. `@media (min-width: 1280px)`: `html { font-size: 112.5%; }`.',
        ),
        expectedBehavior:
          'Ekran kengayishi bilan ustunlar 1, 2, 4 ga ko‘payadi; juda katta ekranda shrift 18px.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY15.mqExamples,
          `${BASE_CSS}\n\n.karta {\n  padding: 16px;\n  background-color: #f5faff;\n}`,
        ),
        checks: [
          at(
            400,
            700,
            style('one', 'Telefonda 1 ustun', '.kartalar', 'grid-template-columns', '400px'),
          ),
          at(
            700,
            700,
            style('two', 'Planshetda 2 ustun', '.kartalar', 'grid-template-columns', '342px 342px'),
          ),
          at(
            1100,
            700,
            style(
              'four',
              'Kompyuterda 4 ustun',
              '.kartalar',
              'grid-template-columns',
              '263px 263px 263px 263px',
            ),
          ),
          at(1300, 700, style('font', 'Katta ekranda shrift 18px', 'html', 'font-size', '18px')),
          at(
            1000,
            700,
            style('font-sm', 'Oddiy ekranda 16px', 'html', 'font-size', '16px', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'rwd-images',
      title: 'Moslashuvchan rasmlar',
      exercise: {
        title: 'Rasmlar har qanday ekranda',
        description: '`max-width`, `aspect-ratio`, `object-fit` va `loading="lazy"`.',
        instructions: md(
          '1. `img`: `max-width: 100%`, `height: auto`.',
          '2. `.karta img`: `width: 100%`, `aspect-ratio: 16 / 9`, `object-fit: cover`.',
          '3. `index.html` da `.karta` dagi rasmga `loading="lazy"` qo‘shing.',
        ),
        expectedBehavior: 'Katta rasm telefonga sig‘adi va nisbati saqlanadi, galereya rasmi 16:9.',
        difficulty: 'EASY',
        starterFiles: site(BODY15.images, BASE_CSS),
        checks: [
          at(375, 700, style('width', 'Rasm ekranga sig‘adi', '.rasm', 'width', '375px')),
          at(
            375,
            700,
            style('height', 'Rasm nisbati saqlanadi', '.rasm', 'height', '250px', {
              hint: '`height: auto` — aks holda HTML’dagi 800px qoladi.',
            }),
          ),
          style('ratio', 'Galereya rasmi 16:9', '.karta img', 'aspect-ratio', '16 / 9'),
          style('cover', 'Galereya rasmi cho‘zilmaydi', '.karta img', 'object-fit', 'cover'),
          attr('lazy', 'Galereya rasmi kech yuklanadi', '.karta img', 'loading', 'lazy'),
        ],
      },
    },
    {
      slug: 'rwd-videos',
      title: 'Moslashuvchan videolar',
      exercise: {
        title: '16:9 video',
        description: '`aspect-ratio` bilan iframe va keng ekranda chegaralash.',
        instructions: md(
          '1. `.video`: `max-width: 960px`, `margin-inline: auto`.',
          '2. `.video iframe`: `width: 100%`, `height: auto`, `aspect-ratio: 16 / 9`, `border: 0`.',
          '3. `index.html` da iframe’ga `title="CSS Grid bo‘yicha videodars"` qo‘shing.',
        ),
        expectedBehavior:
          'Video har qanday kenglikda 16:9, katta ekranda 960px dan oshmaydi va markazda.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY15.videos, BASE_CSS),
        checks: [
          at(1200, 700, style('max', 'Video 960px dan oshmaydi', '.video', 'width', '960px')),
          at(1200, 700, style('center', 'Video markazda', '.video', 'margin-left', '120px')),
          at(
            400,
            700,
            style('ratio', 'Telefonda 16:9', '.video iframe', 'height', '225px', {
              hint: '400 × 9 / 16 = 225px.',
            }),
          ),
          style('border', 'Chegara yo‘q', '.video iframe', 'border-top-style', 'none'),
          attr('title', 'Iframe nomi bor', '.video iframe', 'title'),
        ],
      },
    },
    {
      slug: 'rwd-frameworks',
      title: 'CSS freymvorklari',
      exercise: {
        title: 'O‘z utility klasslarimiz',
        description: 'Freymvork ichida nima borligini o‘zingiz yozib ko‘ring.',
        instructions: md(
          '`index.html` da utility klasslar ishlatilgan, lekin CSS yo‘q. Ularni yozing:',
          '',
          '- `.flex` — `display: flex`; `.flex-col` — `flex-direction: column`;',
          '- `.items-center` — `align-items: center`; `.gap-4` — `gap: 1rem`; `.p-4` — `padding: 1rem`;',
          '- `@media (min-width: 768px)` ichida `.md\\:flex-row` — `flex-direction: row`.',
        ),
        expectedBehavior: 'Telefonda elementlar ustma-ust, 768px dan keng ekranda bir qatorda.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY15.frameworks, '/* Utility klasslarni shu yerga yozing */'),
        checks: [
          style('flex', '`.flex` ishlaydi', '.flex', 'display', 'flex'),
          style('gap', '`.gap-4` — 16px', '.flex', 'column-gap', '16px'),
          style('pad', '`.p-4` — 16px', '.flex', 'padding-top', '16px'),
          at(375, 700, style('col', 'Telefonda ustun', '.flex', 'flex-direction', 'column')),
          at(
            1000,
            700,
            style('row', 'Katta ekranda qator', '.flex', 'flex-direction', 'row', {
              hint: 'CSS’da klass nomidagi `:` ni `\\:` bilan ekranlang.',
            }),
          ),
        ],
      },
      quiz: quiz('15-modul testi: Moslashuvchan dizayn', [
        q(
          'q1',
          'Mobil birinchi yondashuvda qaysi media so‘rov ko‘proq ishlatiladi?',
          ['`min-width`', '`max-width`', '`orientation`', '`print`'],
          [0],
        ),
        q(
          'q2',
          'Viewport meta tegida nima yozmaslik kerak?',
          [
            '`user-scalable=no`',
            '`width=device-width`',
            '`initial-scale=1`',
            'Hech narsa yozmaslik kerak',
          ],
          [0],
        ),
        q(
          'q3',
          'Tanaffus nuqtasini qanday tanlash to‘g‘ri?',
          [
            'Kontent noqulay bo‘la boshlagan joyda',
            'Faqat mashhur telefon o‘lchamlari bo‘yicha',
            'Har 100px da',
            'Faqat 768px',
          ],
          [0],
        ),
        q(
          'q4',
          'Moslashuvchan rasmlar uchun qaysilari foydali?',
          ['`max-width: 100%`', '`srcset` va `sizes`', '`loading="lazy"`', '`user-select: none`'],
          [0, 1, 2],
        ),
        q(
          'q5',
          'Iframe’ni 16:9 nisbatda saqlashning zamonaviy usuli?',
          ['`aspect-ratio: 16 / 9`', '`height: 56.25px`', '`object-fit: cover`', '`zoom: 1.6`'],
          [0],
        ),
      ]),
    },
  ],
};
