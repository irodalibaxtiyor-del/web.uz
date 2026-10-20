import type { ProjectFile } from '@webdizayn/shared';
import { at, md, pic, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const CONSTRAINTS = `<section class="ekran">
  <div class="banner">Kuzgi chegirma: −20%</div>
  ${pic('0071dc', 'Kurs rasmi', 600, 300, ' class="rasm"')}
  <a class="tugma" href="#">Batafsil</a>
</section>`;

const CONSTRAINTS_CSS = `${RESET}

.ekran {
  padding-block: 24px;
}

.banner {
  width: 327px;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fff3cd;
}

.rasm {
  display: block;
  width: 300px;
  height: auto;
  margin-block: 16px;
}

.tugma {
  display: block;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  color: white;
  background-color: #0071dc;
}`;

const MINMAX = `<article class="karta">
  <h2 class="nomi">“Toshkent shahrining tarixiy obidalari va ularning bugungi holati” — onlayn ekskursiya</h2>
  <p>Davomiyligi: 90 daqiqa</p>
</article>`;

const MINMAX_CSS = `${RESET}

.karta {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.nomi {
  margin: 0 0 8px;
  font-size: 1.125rem;
}

.karta p {
  margin: 0;
}`;

const GRID = `<div class="tor">
  <main class="asosiy">Asosiy kontent</main>
  <aside class="yon">Yon panel</aside>
</div>`;

const GRID_CSS = `${RESET}

.tor > * {
  min-height: 160px;
  padding: 16px;
  background-color: #eef6ff;
}`;

const FRAMES = `<header class="sarlavha">
  <h1>Studiya</h1>
  <nav class="menyu">
    <a href="#">Ishlar</a>
    <a href="#">Xizmatlar</a>
    <a href="#">Aloqa</a>
  </nav>
</header>`;

const FRAMES_CSS = `${RESET}

.sarlavha {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h1 {
  margin: 0;
}`;

export const m03: ModuleDef = {
  title: 'Constraints va moslashuv',
  lessons: [
    {
      slug: 'constraints',
      title: 'Constraints',
      exercise: {
        title: 'Freym kengayganda nima bo‘ladi',
        description: 'Left & Right, Center va Scale qoidalarini CSS’ga o‘girish.',
        instructions: md(
          '**Maket (Mobile 375):**',
          '- `Banner` — W 327, Constraints: **Left & Right** (chetlardan 24 da qoladi, kengayadi).',
          '- `Image` — W 300, Constraints: **Scale** (freym kengligining ~50%).',
          '- `Button` — W **Fixed 200**, Constraints: **Center**.',
          '',
          '1. `.banner`: `width` ni olib tashlang, `margin-inline: 24px` yozing.',
          '2. `.rasm`: `width: 50%`.',
          '3. `.tugma`: `width: 200px`, `margin-inline: auto`.',
        ),
        expectedBehavior:
          'Kengroq ekranda banner cho‘ziladi, rasm mutanosib kattalashadi, tugma markazda o‘z kengligida qoladi.',
        difficulty: 'EASY',
        starterFiles: site(CONSTRAINTS, CONSTRAINTS_CSS),
        checks: [
          at(375, 700, style('lr-sm', 'Left & Right: telefonda 327', '.banner', 'width', '327px')),
          at(
            1000,
            700,
            style('lr-lg', 'Left & Right: kengroq ekranda cho‘ziladi', '.banner', 'width', '952px'),
          ),
          at(1000, 700, style('scale', 'Scale: rasm 50%', '.rasm', 'width', '500px')),
          style('fixed', 'Tugma Fixed 200', '.tugma', 'width', '200px'),
          at(1000, 700, style('center', 'Tugma markazda', '.tugma', 'margin-left', '400px')),
        ],
      },
    },
    {
      slug: 'min-max',
      title: 'Min/max o‘lcham va matnni qisqartirish',
      exercise: {
        title: 'Cheklangan karta va bir qatorli sarlavha',
        description: 'Min W / Max W va “Truncate text”.',
        instructions: md(
          '**Maket:** `Card` — W **Fill**, Min W **280**, Max W **480**. Sarlavha: **Truncate text** (bir qator, oxirida “…”).',
          '',
          '1. `.karta`: `width: 100%`, `min-width: 280px`, `max-width: 480px`.',
          '2. `.nomi`: `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.',
        ),
        expectedBehavior:
          'Karta 280–480px oralig‘ida, uzun sarlavha bitta qatorda uch nuqta bilan tugaydi.',
        difficulty: 'EASY',
        starterFiles: site(MINMAX, MINMAX_CSS),
        checks: [
          at(1000, 700, style('max', 'Katta ekranda 480', '.karta', 'width', '480px')),
          at(360, 700, style('fill', 'Telefonda to‘ldiradi', '.karta', 'width', '360px')),
          at(
            240,
            600,
            style('min', 'Juda tor joyda ham 280 dan kichik emas', '.karta', 'width', '280px'),
          ),
          style('nowrap', 'Sarlavha bir qatorda', '.nomi', 'white-space', 'nowrap'),
          style('ellipsis', 'Oxirida uch nuqta', '.nomi', 'text-overflow', 'ellipsis'),
        ],
      },
    },
    {
      slug: 'layout-grid',
      title: 'Layout Grid → CSS Grid',
      exercise: {
        title: '12 va 4 ustunli to‘r',
        description: 'Maketdagi Columns, Gutter va Margin qiymatlari.',
        instructions: md(
          '**Layout Grid:** Mobile 360 — Columns **4**, Gutter **16**, Margin **16**. Desktop 1440 — Columns **12**, Gutter **24**, Margin **72**. Asosiy blok 8 ustun, yon panel 4 ustun (telefonda ikkalasi 4 ustun).',
          '',
          '1. `.tor`: `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `column-gap: 16px`, `row-gap: 16px`, `padding-inline: 16px`.',
          '2. `.tor > *`: `grid-column: span 4`.',
          '3. `@media (min-width: 1024px)`: `.tor` — `repeat(12, 1fr)`, `column-gap: 24px`, `padding-inline: 72px`; `.asosiy` — `span 8`; `.yon` — `span 4`.',
        ),
        expectedBehavior: 'Ustunlar maketdagi to‘r bilan aynan bir xil kenglikda.',
        difficulty: 'MEDIUM',
        starterFiles: site(GRID, GRID_CSS),
        checks: [
          at(
            360,
            700,
            style(
              'mobile',
              'Mobil: 4 × 70',
              '.tor',
              'grid-template-columns',
              '70px 70px 70px 70px',
            ),
          ),
          at(
            1440,
            900,
            style(
              'desktop',
              'Desktop: 12 × 86',
              '.tor',
              'grid-template-columns',
              Array(12).fill('86px').join(' '),
            ),
          ),
          at(1440, 900, style('margin', 'Desktop margin 72', '.tor', 'padding-left', '72px')),
          at(
            1440,
            900,
            style('span', 'Asosiy blok 8 ustun', '.asosiy', 'grid-column-start', 'span 8'),
          ),
          at(
            360,
            700,
            style('gutter', 'Mobil gutter 16', '.tor', 'column-gap', '16px', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'breakpoint-freymlar',
      title: 'Breakpoint freymlar',
      exercise: {
        title: 'Ikki freymdan bitta sahifa',
        description: 'Mobile va Desktop freymlardagi farqlarni media so‘rovga aylantirish.',
        instructions: md(
          '**Mobile 360:** padding 16, sarlavha 24px, menyu yashirin. **Desktop 1440:** padding 24 72, sarlavha 40px, menyu ko‘rinadi (Horizontal, Gap 32).',
          '',
          '1. Standart (mobil): `.sarlavha` — `padding: 16px`; `h1` — `font-size: 24px`; `.menyu` — `display: none`.',
          '2. `@media (min-width: 1024px)`: `.sarlavha` — `padding: 24px 72px`; `h1` — `font-size: 40px`; `.menyu` — `display: flex`, `gap: 32px`.',
        ),
        expectedBehavior: 'Telefonda ixcham sarlavha, kompyuterda katta sarlavha va menyu.',
        difficulty: 'EASY',
        starterFiles: site(FRAMES, FRAMES_CSS),
        checks: [
          at(360, 700, style('h1-sm', 'Mobil sarlavha 24', 'h1', 'font-size', '24px')),
          at(360, 700, style('nav-sm', 'Mobilda menyu yashirin', '.menyu', 'display', 'none')),
          at(1440, 900, style('h1-lg', 'Desktop sarlavha 40', 'h1', 'font-size', '40px')),
          at(1440, 900, style('nav-lg', 'Desktop menyu Gap 32', '.menyu', 'column-gap', '32px')),
          at(1440, 900, style('pad', 'Desktop chetlar 72', '.sarlavha', 'padding-left', '72px')),
        ],
      },
      quiz: quiz('3-modul testi: Constraints va moslashuv', [
        q(
          'f3-lr',
          '“Left & Right” constraint CSS’da nimaga yaqin?',
          [
            'Kenglik berilmay, chap va o‘ng chetlar qotiriladi (`margin-inline`)',
            '`width: 327px`',
            '`float: left`',
            '`position: fixed`',
          ],
          [0],
        ),
        q(
          'f3-grid',
          'Layout Grid’dagi “Gutter” CSS’da qaysi xususiyat?',
          ['`column-gap`', '`padding`', '`border`', '`margin-top`'],
          [0],
        ),
        q(
          'f3-margin',
          'Layout Grid’dagi “Margin” ko‘pincha nimaga aylanadi?',
          [
            'Konteynerning `padding-inline` qiymatiga',
            '`grid-template-rows` ga',
            '`border-radius` ga',
            'Hech nimaga',
          ],
          [0],
        ),
        q(
          'f3-frames',
          'Maketda faqat 360 va 1440 freymlar bo‘lsa, 768 da sahifa qanday bo‘lishi kerak?',
          [
            'Dasturchi oraliq holatni o‘ylab topadi yoki dizayner bilan kelishadi; sahifa buzilmasligi shart',
            'Sahifa faqat 360 va 1440 da ishlashi yetarli',
            'Brauzer o‘zi hal qiladi — tekshirish shart emas',
            '768 da 1440 maket kichraytirib ko‘rsatiladi',
          ],
          [0],
        ),
        q(
          'f3-truncate',
          '“Truncate text” uchun kerakli CSS? (bir nechta javob)',
          [
            '`white-space: nowrap`',
            '`overflow: hidden`',
            '`text-overflow: ellipsis`',
            '`font-size: 0`',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  constraints: site(
    CONSTRAINTS,
    CONSTRAINTS_CSS.replace('  width: 327px;\n', '  margin-inline: 24px;\n')
      .replace('  width: 300px;\n', '  width: 50%;\n')
      .replace(
        '.tugma {\n  display: block;',
        '.tugma {\n  display: block;\n  width: 200px;\n  margin-inline: auto;',
      ),
  ),
  'min-max': site(
    MINMAX,
    `${MINMAX_CSS}

.karta {
  width: 100%;
  min-width: 280px;
  max-width: 480px;
}

.nomi {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,
  ),
  'layout-grid': site(
    GRID,
    `${GRID_CSS}

.tor {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 16px;
  row-gap: 16px;
  padding-inline: 16px;
}

.tor > * {
  grid-column: span 4;
}

@media (min-width: 1024px) {
  .tor {
    grid-template-columns: repeat(12, 1fr);
    column-gap: 24px;
    padding-inline: 72px;
  }

  .asosiy {
    grid-column: span 8;
  }

  .yon {
    grid-column: span 4;
  }
}`,
  ),
  'breakpoint-freymlar': site(
    FRAMES,
    `${FRAMES_CSS}

.sarlavha {
  padding: 16px;
}

h1 {
  font-size: 24px;
}

.menyu {
  display: none;
}

@media (min-width: 1024px) {
  .sarlavha {
    padding: 24px 72px;
  }

  h1 {
    font-size: 40px;
  }

  .menyu {
    display: flex;
    gap: 32px;
  }
}`,
  ),
};
