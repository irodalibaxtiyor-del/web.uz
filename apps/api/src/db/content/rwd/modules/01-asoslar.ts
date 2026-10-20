import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  attr,
  files,
  md,
  page,
  pic,
  q,
  quiz,
  RESET,
  site,
  style,
  type ModuleDef,
} from '../../design/shared';

const STORY = `<div class="sahifa">
  <h1>Toshkent bo‘ylab sayohat</h1>
  ${pic('0071dc', 'Shahar manzarasi', 900, 400)}
  <p>Eski shahar ko‘chalari, Chorsu bozori va Minor masjidi bir kunda ko‘rib chiqsa bo‘ladigan joylar.</p>
</div>`;

const STORY_CSS = `${RESET}

.sahifa {
  width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}`;

/** Page with a custom viewport meta (the usual `page()` always writes the correct one). */
function withViewport(content: string, body: string, css: string): ProjectFile[] {
  const doc = page(body, { head: '<link rel="stylesheet" href="style.css">' }).replace(
    'content="width=device-width, initial-scale=1"',
    `content="${content}"`,
  );
  return files({ 'index.html': doc, 'style.css': `${css.trim()}\n` });
}

const PHONE = `${pic('fec400', 'Mahsulot rasmi', 600, 300, ' class="rasm"')}
<h1>Simsiz quloqchin</h1>
<p>Bir zaryadda 30 soat ishlaydi.</p>
<button type="button" class="tugma">Savatga qo‘shish</button>`;

const PHONE_CSS = `${RESET}

.rasm {
  display: block;
  width: 600px;
}

.tugma {
  padding: 4px 8px;
}`;

const CARDS = `<div class="kartalar">
  <div class="karta">Kitob</div>
  <div class="karta">Daftar</div>
  <div class="karta">Ruchka</div>
  <div class="karta">Qalam</div>
  <div class="karta">Chizg‘ich</div>
  <div class="karta">O‘chirg‘ich</div>
</div>`;

const CARD_CSS = `.karta {
  padding: 24px;
  background-color: #eef6ff;
}`;

const UNITS = `<section class="ekran">
  <h1>O‘lchov birliklari</h1>
  <p>Oddiy matn <span class="izoh">(kichik izoh)</span></p>
  <div class="tartib">
    <aside class="yon">Yon panel</aside>
    <main>Asosiy kontent</main>
  </div>
</section>`;

const UNITS_CSS = `${RESET}

.tartib {
  display: flex;
  width: 800px;
}

h1 {
  font-size: 28px;
}

.izoh {
  font-size: 12px;
}

.yon {
  width: 150px;
}

.ekran {
  min-height: 500px;
}`;

const FLUID = `<section class="bosh">
  <div class="konteyner">
    <h1>Kurslar bahorgi chegirmada</h1>
    <p>Har bir kurs amaliy mashqlar bilan.</p>
  </div>
</section>`;

const FLUID_CSS = `${RESET}

.konteyner {
  width: 1120px;
  margin-inline: auto;
}

h1 {
  font-size: 40px;
}

.bosh {
  padding: 32px 0;
  background-color: #eef6ff;
}`;

export const m01: ModuleDef = {
  title: 'Asoslar',
  lessons: [
    {
      slug: 'nima',
      title: 'Moslashuvchan dizayn nima?',
      exercise: {
        title: 'Qotgan sahifani suyuq qilish',
        description: 'Belgilangan kenglikdan maksimal kenglikka o‘tish.',
        instructions: md(
          '1. `.sahifa` dagi `width: 960px` ni `max-width: 960px` ga almashtiring.',
          '2. `margin: 0 auto` o‘rniga `margin-inline: auto`, `padding: 0 16px` o‘rniga `padding-inline: 16px` yozing (natija bir xil, yozuv aniqroq).',
          '3. `img` uchun: `display: block`, `max-width: 100%`, `height: auto`.',
        ),
        expectedBehavior:
          'Telefonda sahifa va rasm ekranga sig‘adi, kompyuterda kontent 960px kenglikda markazda turadi.',
        difficulty: 'EASY',
        starterFiles: site(STORY, STORY_CSS),
        checks: [
          at(
            375,
            700,
            style('page-sm', 'Telefonda sahifa ekran kengligida', '.sahifa', 'width', '375px'),
          ),
          at(
            375,
            700,
            style('img-sm', 'Rasm ekranga sig‘adi', 'img', 'width', '343px', {
              hint: 'Rasmga `max-width: 100%` bering.',
            }),
          ),
          at(1280, 800, style('page-lg', 'Kompyuterda 960px', '.sahifa', 'width', '960px')),
          at(
            1280,
            800,
            style('center', 'Kompyuterda markazda', '.sahifa', 'margin-left', '160px', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'viewport',
      title: 'Viewport va qurilma pikseli',
      exercise: {
        title: 'Telefon uchun to‘g‘ri sozlash',
        description: 'Viewport meta tegi, sig‘adigan rasm va bosish maydoni.',
        instructions: md(
          '1. `index.html` dagi viewport tegini `content="width=device-width, initial-scale=1"` qiling.',
          '2. `.rasm`: `width: 100%` va `max-width: 600px` (o‘rniga `width: 600px` ni olib tashlang).',
          '3. `.tugma`: `min-height: 44px` va `padding-inline: 20px` — barmoq bilan bosishga qulay.',
        ),
        expectedBehavior:
          'Telefonda sahifa o‘z kengligida ochiladi, rasm sig‘adi, tugma kamida 44px baland.',
        difficulty: 'EASY',
        starterFiles: withViewport('width=1024', PHONE, PHONE_CSS),
        checks: [
          attr(
            'meta',
            'Viewport to‘g‘ri',
            'meta[name="viewport"]',
            'content',
            'width=device-width, initial-scale=1',
          ),
          at(
            375,
            700,
            style('img-sm', 'Telefonda rasm ekran kengligida', '.rasm', 'width', '375px'),
          ),
          at(
            1280,
            800,
            style('img-lg', 'Katta ekranda rasm 600px dan oshmaydi', '.rasm', 'width', '600px'),
          ),
          style('tap', 'Tugma kamida 44px', '.tugma', 'min-height', '44px', {
            hint: 'Barmoq uchun bosish maydoni kamida 44×44 piksel bo‘lsin.',
          }),
        ],
      },
    },
    {
      slug: 'avval-mobil',
      title: 'Avval mobil (mobile first)',
      exercise: {
        title: '1 → 2 → 3 ustun',
        description: 'Standart uslub telefon uchun, kattaroq ekranlar `min-width` bilan.',
        instructions: md(
          '1. `.kartalar` dan `grid-template-columns` ni olib tashlang: standart holda bitta ustun qolsin (`display: grid` va `gap: 16px` qoladi).',
          '2. `@media (min-width: 600px)` ichida: `grid-template-columns: repeat(2, 1fr)`.',
          '3. `@media (min-width: 1000px)` ichida: `grid-template-columns: repeat(3, 1fr)`.',
        ),
        expectedBehavior: 'Telefonda bitta ustun, planshetda ikkita, kompyuterda uchta.',
        difficulty: 'EASY',
        starterFiles: site(
          CARDS,
          `${RESET}\n\n.kartalar {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n${CARD_CSS}`,
        ),
        checks: [
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.kartalar', 'grid-template-columns', '375px'),
          ),
          at(
            599,
            700,
            style(
              'edge',
              '599px da hali bitta ustun',
              '.kartalar',
              'grid-template-columns',
              '599px',
              {
                hidden: true,
              },
            ),
          ),
          at(
            700,
            700,
            style(
              'two',
              'Planshetda ikki ustun',
              '.kartalar',
              'grid-template-columns',
              '342px 342px',
            ),
          ),
          at(
            1232,
            800,
            style(
              'three',
              'Kompyuterda uch ustun',
              '.kartalar',
              'grid-template-columns',
              '400px 400px 400px',
            ),
          ),
        ],
      },
    },
    {
      slug: 'birliklar',
      title: 'Nisbiy o‘lchov birliklari',
      exercise: {
        title: 'Piksellardan nisbiy birliklarga',
        description: '`rem`, `em`, `%` va `dvh` bilan ishlash.',
        instructions: md(
          '1. `h1`: `font-size: 2rem`.',
          '2. `.izoh`: `font-size: 0.875em` — ota matnga nisbatan.',
          '3. `.yon`: `width: 25%` — `.tartib` kengligining chorak qismi.',
          '4. `.ekran`: `min-height: 100dvh` — kamida bitta ekran balandligi.',
        ),
        expectedBehavior:
          'Sarlavha 32px, izoh 14px, yon panel 200px, bo‘lim kamida ekran balandligida.',
        difficulty: 'EASY',
        starterFiles: site(UNITS, UNITS_CSS),
        checks: [
          style('rem', 'Sarlavha 2rem (32px)', 'h1', 'font-size', '32px'),
          style('em', 'Izoh 0.875em (14px)', '.izoh', 'font-size', '14px'),
          style('pct', 'Yon panel 25% (200px)', '.yon', 'width', '200px'),
          at(1000, 700, style('vh', 'Bo‘lim ekran balandligida', '.ekran', 'min-height', '700px')),
          at(
            1000,
            900,
            style('vh2', 'Boshqa ekranda ham', '.ekran', 'min-height', '900px', {
              hidden: true,
              hint: 'Piksel emas, `100dvh` yozing — u ekran balandligiga qarab o‘zgaradi.',
            }),
          ),
        ],
      },
    },
    {
      slug: 'suyuq-olchamlar',
      title: 'Suyuq o‘lchamlar: min(), max(), clamp()',
      exercise: {
        title: 'Media so‘rovsiz moslashuv',
        description: 'Kenglik, sarlavha va bo‘shliqni funksiyalar bilan cheklash.',
        instructions: md(
          '1. `.konteyner`: `width: min(100% - 2rem, 70rem)`.',
          '2. `h1`: `font-size: clamp(1.5rem, 1rem + 2.5vw, 3rem)`.',
          '3. `.bosh`: `padding-block: max(2rem, 5vh)`.',
        ),
        expectedBehavior:
          'Telefonda konteyner chetlardan 16px ichkarida, sarlavha 24px dan kichik emas va 48px dan katta emas.',
        difficulty: 'MEDIUM',
        starterFiles: site(FLUID, FLUID_CSS),
        checks: [
          at(375, 700, style('w-sm', 'Telefonda chetlardan 16px', '.konteyner', 'width', '343px')),
          at(
            1400,
            800,
            style('w-lg', 'Katta ekranda 70rem (1120px)', '.konteyner', 'width', '1120px'),
          ),
          at(320, 700, style('h1-sm', 'Kichik ekranda sarlavha 24px', 'h1', 'font-size', '24px')),
          at(1400, 800, style('h1-lg', 'Katta ekranda sarlavha 48px', 'h1', 'font-size', '48px')),
          at(
            1000,
            1000,
            style('pad', 'Baland ekranda bo‘shliq 5vh', '.bosh', 'padding-top', '50px', {
              hidden: true,
            }),
          ),
        ],
      },
      quiz: quiz('1-modul testi: Asoslar', [
        q(
          'm1-def',
          'Moslashuvchan dizaynning asosiy g‘oyasi qaysi?',
          [
            'Bitta sahifa har xil ekran kengligiga o‘zi moslashadi',
            'Telefon uchun alohida sayt yoziladi',
            'Sahifa doim 960px kenglikda bo‘ladi',
            'Kichik ekranda sahifa kichraytirib ko‘rsatiladi',
          ],
          [0],
        ),
        q(
          'm1-meta',
          'Qaysi viewport tegi to‘g‘ri?',
          [
            '`<meta name="viewport" content="width=device-width, initial-scale=1">`',
            '`<meta name="viewport" content="width=1024">`',
            '`<meta name="viewport" content="user-scalable=no">`',
            '`<meta name="screen" content="mobile">`',
          ],
          [0],
        ),
        q(
          'm1-first',
          '“Avval mobil” yondashuvida qaysi media so‘rovlar asosan ishlatiladi?',
          ['`min-width`', '`max-width`', '`orientation`', '`print`'],
          [0],
        ),
        q(
          'm1-units',
          'Qaysi birliklar nisbiy? (bir nechta javob)',
          ['`rem`', '`%`', '`vw`', '`px`'],
          [0, 1, 2],
        ),
        q(
          'm1-clamp',
          '`clamp(1.5rem, 4vw, 3rem)` nimani anglatadi?',
          [
            'Qiymat 4vw, lekin 1.5rem dan kichik va 3rem dan katta bo‘lmaydi',
            'Uchta qiymatdan eng kattasi tanlanadi',
            'Qiymat doim 3rem',
            'Qiymat ekran balandligiga bog‘liq',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  nima: site(
    STORY,
    `${RESET}

.sahifa {
  max-width: 960px;
  margin-inline: auto;
  padding-inline: 16px;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}`,
  ),
  viewport: withViewport(
    'width=device-width, initial-scale=1',
    PHONE,
    `${RESET}

.rasm {
  display: block;
  width: 100%;
  max-width: 600px;
  height: auto;
}

.tugma {
  min-height: 44px;
  padding-inline: 20px;
}`,
  ),
  'avval-mobil': site(
    CARDS,
    `${RESET}

.kartalar {
  display: grid;
  gap: 16px;
}

@media (min-width: 600px) {
  .kartalar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .kartalar {
    grid-template-columns: repeat(3, 1fr);
  }
}

${CARD_CSS}`,
  ),
  birliklar: site(
    UNITS,
    `${RESET}

.tartib {
  display: flex;
  width: 800px;
}

h1 {
  font-size: 2rem;
}

.izoh {
  font-size: 0.875em;
}

.yon {
  width: 25%;
}

.ekran {
  min-height: 100dvh;
}`,
  ),
  'suyuq-olchamlar': site(
    FLUID,
    `${RESET}

.konteyner {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}

h1 {
  font-size: clamp(1.5rem, 1rem + 2.5vw, 3rem);
}

.bosh {
  padding-block: max(2rem, 5vh);
  background-color: #eef6ff;
}`,
  ),
};
