import { at, md, q, quiz, site, style, type ModuleDef } from '../shared';
import { pic } from './08-components';

const cells = (n: number, cls = '') =>
  Array.from({ length: n }, (_, i) => `  <div${cls ? ` class="${cls}"` : ''}>${i + 1}</div>`).join(
    '\n',
  );

/** Markup shared by the starter files and the reference solutions. */
export const BODY14 = {
  intro: `<div class="asosiy">
  <div>Asosiy (2fr)</div>
  <div>Yon (1fr)</div>
</div>
<div class="uchlik">
${cells(6)}
</div>`,
  container: `<div class="kartalar">
${cells(5, 'karta')}
</div>
<div class="markaz"><p>Markazda</p></div>`,
  items: `<div class="tor">
  <header class="sarlavha">Sarlavha</header>
  <div class="katta">Katta</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
<figure class="karta">
  ${pic('0071dc', 'Ko‘k manzara', 300, 160).replace('<img', '<img class="rasm"')}
  <figcaption class="yozuv">Rasm ustidagi yozuv</figcaption>
</figure>`,
  layout: `<div class="sahifa">
  <header>Sarlavha</header>
  <aside>Yon panel</aside>
  <main>Asosiy kontent</main>
  <footer>Pastki qism</footer>
</div>`,
  supports: `<div class="panel">Shisha panel</div>
<div class="karta">
  ${pic('fec400', 'Sariq rasm', 200, 100)}
  <p>Rasmli kartochka</p>
</div>`,
};

export const GRID_BASE_CSS = `body {
  margin: 0;
}`;

export const ITEMS_CSS = `.tor > * {
  padding: 8px;
  background-color: #f5faff;
}

.karta {
  margin: 16px 0 0;
}

.yozuv {
  padding: 8px;
  background-color: rgba(14, 17, 51, 0.7);
  color: white;
}`;

export const LAYOUT_CSS = `body {
  margin: 0;
}

.sahifa > * {
  padding: 16px;
  background-color: #f5faff;
}

.sahifa {
  display: grid;
  gap: 16px;
}`;

export const SUPPORTS_CSS = `.panel {
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.95);
}

.karta {
  padding: 16px;
  border: 1px solid #dddddd;
}`;

export const m14: ModuleDef = {
  title: 'Grid',
  lessons: [
    {
      slug: 'grid-intro',
      title: 'CSS Grid bilan tanishuv',
      exercise: {
        title: 'Birinchi to‘rlar',
        description: '`display: grid`, `fr` va `gap`.',
        instructions: md(
          '1. `.asosiy`: `display: grid`, `grid-template-columns: 2fr 1fr`, `gap: 16px`.',
          '2. `.uchlik`: `display: grid`, uchta teng ustun (`1fr 1fr 1fr`), `gap: 8px`.',
        ),
        expectedBehavior: 'Ikki ustunli maket (2:1) va 3×2 to‘r.',
        difficulty: 'EASY',
        starterFiles: site(BODY14.intro, GRID_BASE_CSS),
        checks: [
          style('grid', '`.asosiy` grid', '.asosiy', 'display', 'grid'),
          at(
            916,
            600,
            style(
              'fr',
              'Ustunlar 2:1 nisbatda',
              '.asosiy',
              'grid-template-columns',
              '600px 300px',
              {
                hint: '(916 − 16) ni 3 ulushga bo‘ling: 2 ulush va 1 ulush.',
              },
            ),
          ),
          style('gap', '`.asosiy` da 16px oraliq', '.asosiy', 'column-gap', '16px'),
          at(
            916,
            600,
            style(
              'three',
              'Uchta teng ustun',
              '.uchlik',
              'grid-template-columns',
              '300px 300px 300px',
            ),
          ),
          style('gap3', '`.uchlik` da 8px oraliq', '.uchlik', 'column-gap', '8px'),
        ],
      },
    },
    {
      slug: 'grid-container',
      title: 'Grid konteyner',
      exercise: {
        title: 'Moslashuvchan kartochkalar to‘ri',
        description: '`repeat(auto-fill, minmax())`, `grid-auto-rows`, `place-items`.',
        instructions: md(
          '1. `.kartalar`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`, `gap: 16px`, `grid-auto-rows: minmax(120px, auto)`.',
          '2. `.markaz`: `display: grid`, `place-items: center`, `min-height: 200px`.',
        ),
        expectedBehavior: 'Kengroq ekranda ko‘proq ustun, telefonda bitta; matn markazda.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY14.container,
          `${GRID_BASE_CSS}\n\n.karta {\n  background-color: #f5faff;\n}`,
        ),
        checks: [
          at(
            1000,
            700,
            style(
              'wide',
              'Keng ekranda 4 ustun',
              '.kartalar',
              'grid-template-columns',
              '238px 238px 238px 238px',
            ),
          ),
          at(
            400,
            700,
            style('narrow', 'Telefonda 1 ustun', '.kartalar', 'grid-template-columns', '400px'),
          ),
          style(
            'rows',
            'Qatorlar kamida 120px',
            '.kartalar',
            'grid-auto-rows',
            'minmax(120px, auto)',
          ),
          style('justify', 'Gorizontal markaz', '.markaz', 'justify-items', 'center'),
          style('align', 'Vertikal markaz', '.markaz', 'align-items', 'center'),
        ],
      },
    },
    {
      slug: 'grid-items',
      title: 'Grid elementlar',
      exercise: {
        title: 'Joy va o‘lcham berish',
        description: '`grid-column: 1 / -1`, `span` va ustma-ust qo‘yish.',
        instructions: md(
          '1. `.tor`: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 8px`.',
          '2. `.sarlavha` butun kenglikda: `grid-column: 1 / -1`.',
          '3. `.katta` ikki qator balandligida: `grid-row: span 2`.',
          '4. `.karta`: `display: grid`; `.rasm` va `.yozuv` bir katakda: `grid-area: 1 / 1`; `.yozuv`: `align-self: end`.',
        ),
        expectedBehavior: 'To‘liq kenglikdagi sarlavha, baland katak, rasm pastida yozuv.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY14.items, ITEMS_CSS),
        checks: [
          style('full', 'Sarlavha oxirgi chiziqqacha', '.sarlavha', 'grid-column-end', '-1'),
          style('span', 'Katta katak 2 qator', '.katta', 'grid-row-start', 'span 2'),
          style('card', 'Kartochka grid', '.karta', 'display', 'grid'),
          style('stack', 'Yozuv rasm katagida', '.yozuv', 'grid-row-start', '1'),
          style('end', 'Yozuv pastda', '.yozuv', 'align-self', 'end'),
        ],
      },
    },
    {
      slug: 'grid-layout',
      title: 'Nomlangan hududlar',
      exercise: {
        title: 'Sahifa maketi hududlar bilan',
        description: '`grid-template-areas` va media so‘rov.',
        instructions: md(
          '1. `header`, `aside`, `main`, `footer` ga `grid-area`: `sarlavha`, `yon`, `asosiy`, `pasti`.',
          '2. Telefonda (standart): bitta ustun, tartib — sarlavha, asosiy, yon, pasti.',
          '3. `@media (min-width: 768px)`: `grid-template-columns: 240px 1fr` va',
          '   `"sarlavha sarlavha" "yon asosiy" "pasti pasti"`.',
        ),
        expectedBehavior: 'Telefonda ustma-ust bloklar, katta ekranda yon panel chapda.',
        difficulty: 'HARD',
        starterFiles: site(BODY14.layout, LAYOUT_CSS),
        checks: [
          style('main', '`main` — asosiy hudud', 'main', 'grid-column-start', 'asosiy'),
          style('aside', '`aside` — yon hudud', 'aside', 'grid-column-start', 'yon'),
          at(
            1000,
            700,
            style(
              'areas',
              'Katta ekran xaritasi',
              '.sahifa',
              'grid-template-areas',
              '"sarlavha sarlavha" "yon asosiy" "pasti pasti"',
            ),
          ),
          at(
            1000,
            700,
            style('cols', 'Yon panel 240px', '.sahifa', 'grid-template-columns', '240px 744px'),
          ),
          at(
            400,
            700,
            style(
              'mobile',
              'Telefon xaritasi',
              '.sahifa',
              'grid-template-areas',
              '"sarlavha" "asosiy" "yon" "pasti"',
            ),
          ),
        ],
      },
    },
    {
      slug: 'supports',
      title: '`@supports`',
      exercise: {
        title: 'Progressiv yaxshilash',
        description: 'Oddiy asos va `@supports` ichidagi yaxshilanish.',
        instructions: md(
          '1. `@supports (backdrop-filter: blur(8px))` ichida `.panel` ga `backdrop-filter: blur(8px)` va fon `rgba(255, 255, 255, 0.6)` bering. Asosiy (0.95) fon qoidasini o‘chirmang.',
          '2. `@supports selector(:has(img))` ichida `.karta:has(img)` ning `padding-top` i `0`.',
        ),
        expectedBehavior:
          'Zamonaviy brauzerda shisha panel va rasm tepasida bo‘shliqsiz kartochka.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY14.supports, SUPPORTS_CSS),
        checks: [
          style('blur', 'Panel orqasi xira', '.panel', 'backdrop-filter', 'blur(8px)'),
          style(
            'bg',
            'Panel foni shaffofroq',
            '.panel',
            'background-color',
            'rgba(255, 255, 255, 0.6)',
          ),
          style('has', 'Rasmli kartochka tepasida bo‘shliq yo‘q', '.karta', 'padding-top', '0px'),
        ],
      },
      quiz: quiz('14-modul testi: Grid', [
        q(
          'q1',
          'Grid va Flexbox’ning asosiy farqi?',
          [
            'Grid ikki o‘lchamli, Flexbox bir o‘lchamli',
            'Grid faqat rasmlar uchun',
            'Flexbox eskirgan',
            'Farqi yo‘q',
          ],
          [0],
        ),
        q(
          'q2',
          '`fr` birligi nimani bildiradi?',
          ['Qolgan bo‘sh joyning ulushini', 'Shrift o‘lchamini', 'Foizni', 'Pikselni'],
          [0],
        ),
        q(
          'q3',
          'Element butun kenglikni egallashi uchun?',
          ['`grid-column: 1 / -1`', '`grid-column: span 1`', '`grid-row: 1 / 1`', '`width: auto`'],
          [0],
        ),
        q(
          'q4',
          '`grid-template-areas` haqida qaysilari to‘g‘ri?',
          [
            'Hudud to‘rtburchak bo‘lishi kerak',
            'Bo‘sh katak nuqta bilan belgilanadi',
            '“L” shaklidagi hudud mumkin',
            'Har qatorda ustunlar soni har xil bo‘lishi mumkin',
          ],
          [0, 1],
        ),
        q(
          'q5',
          '`@supports` qachon ayniqsa kerak?',
          [
            'Bir nechta xususiyat birga o‘zgarishi kerak bo‘lganda',
            'Har bir xususiyat uchun doim',
            'Faqat ranglar uchun',
            'Hech qachon',
          ],
          [0],
        ),
      ]),
    },
  ],
};
