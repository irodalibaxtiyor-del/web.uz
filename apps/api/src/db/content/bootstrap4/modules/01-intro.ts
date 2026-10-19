import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs4,
  clean,
  cls,
  has,
  md,
  q,
  quiz,
  RGB,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const START = `<div id="sahifa">
  <h1>Shahar kutubxonasi</h1>
  <p>Yangi kitoblar har shanba kuni keladi.</p>
  <button type="button" class="btn btn-success">A’zo bo‘lish</button>
</div>`;

const CONTAINERS = `<div id="asosiy"{{main}}>
  <h1>Kurslar</h1>
  <p>Belgilangan kenglikdagi konteyner.</p>
</div>
<div id="banner"{{banner}}>
  <p>Kuzgi chegirma: barcha kurslar -20%</p>
</div>
<div id="jadval"{{table}}>
  <p>Planshetda to‘liq kenglik, noutbukda 960px.</p>
</div>`;

const BOX = 'class="border bg-light p-2"';

const GRID = `<div class="container">
  <div class="row" id="uch">
    <div{{auto}}><div ${BOX}>1</div></div>
    <div{{auto}}><div ${BOX}>2</div></div>
    <div{{auto}}><div ${BOX}>3</div></div>
  </div>
  <div class="row" id="ikki">
    <div id="menyu"{{side}}><div ${BOX}>Menyu</div></div>
    <div id="kontent"{{auto}}><div ${BOX}>Kontent</div></div>
  </div>
  <div class="row" id="kurslar">
    <div id="k1"{{card}}><div ${BOX}>Kurs 1</div></div>
    <div id="k2"{{card}}><div ${BOX}>Kurs 2</div></div>
    <div id="k3"{{card}}><div ${BOX}>Kurs 3</div></div>
    <div id="k4"{{card}}><div ${BOX}>Kurs 4</div></div>
  </div>
</div>`;

export const m01: ModuleDef = {
  title: 'Bootstrap 4 bilan tanishuv',
  lessons: [
    { slug: 'home', title: 'Bootstrap 4 nima?' },
    {
      slug: 'get-started',
      title: 'Bootstrap 4 ni ulash',
      exercise: {
        title: 'Bootstrap 4 ni sahifaga ulang',
        description: 'CSS, jQuery slim va bundle.',
        instructions: md(
          '1. `<head>` ga Bootstrap 4.6.2 CSS havolasini qo‘shing.',
          '2. `</body>` dan oldin **avval** `jquery.slim.min.js` (3.7.1), **keyin** `bootstrap.bundle.min.js` (4.6.2) ni ulang.',
          '3. `#sahifa` ga `container` klassini bering.',
        ),
        expectedBehavior:
          'Tugma yashil Bootstrap tugmasiga aylanadi, kontent markazdagi konteynerda, konsolda xato yo‘q.',
        difficulty: 'EASY',
        starterFiles: bs4(START, { bare: true, title: 'Kutubxona' }),
        checks: [
          style(
            'css',
            'Bootstrap CSS ulangan',
            '.btn-success',
            'background-color',
            RGB.bs4.success,
          ),
          has(
            'js',
            'jQuery va bundle to‘g‘ri tartibda',
            'script[src*="jquery"] ~ script[src*="bootstrap.bundle"]',
          ),
          at(
            1280,
            800,
            style('container', 'Kontent `.container` ichida', '#sahifa', 'width', '1140px'),
          ),
          clean({ hint: 'Avval jQuery, keyin bootstrap.bundle.min.js.' }),
        ],
      },
    },
    {
      slug: 'containers',
      title: 'Konteynerlar',
      exercise: {
        title: 'Uch xil konteyner',
        description: '`.container`, `.container-fluid` va `.container-lg`.',
        instructions: md(
          '- `#asosiy` — oddiy konteyner.',
          '- `#banner` — to‘liq kenglikdagi konteyner, to‘q fon va oq matn bilan: `container-fluid p-3 my-3 bg-dark text-white`.',
          '- `#jadval` — `lg` sinfigacha to‘liq kenglikda, keyin belgilangan: `container-lg`.',
        ),
        expectedBehavior: 'Keng ekranda o‘rtada ikki konteyner va to‘liq kenglikdagi to‘q banner.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(CONTAINERS), { title: 'Konteynerlar' }),
        checks: [
          at(1280, 800, style('container', '`#asosiy` 1140px', '#asosiy', 'width', '1140px')),
          at(1280, 800, style('fluid', 'Banner to‘liq kenglikda', '#banner', 'width', '1280px')),
          style('dark', 'Banner foni to‘q', '#banner', 'background-color', RGB.bs4.dark),
          at(800, 600, style('lg-md', '`#jadval` planshetda 100%', '#jadval', 'width', '800px')),
          at(
            1000,
            800,
            style('lg-lg', '`#jadval` noutbukda 960px', '#jadval', 'width', '960px', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'grid-basic',
      title: 'Setka asoslari',
      exercise: {
        title: 'Avtomatik va moslashuvchan ustunlar',
        description: '`.col`, `.col-3` va `.col-sm-6 .col-lg-3`.',
        instructions: md(
          '- `#uch` qatoridagi uchta ustun — avtomatik teng (`col`).',
          '- `#ikki` qatorida menyu — `col-3`, kontent — `col` (qolgan joy).',
          '- `#kurslar` dagi har bir kurs — `col-sm-6 col-lg-3`.',
        ),
        expectedBehavior:
          'Uchta teng ustun; tor menyu va keng kontent; kurslar telefonda 1, planshetda 2, noutbukda 4 ustunda.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(GRID), { title: 'Setka' }),
        checks: [
          at(
            1280,
            800,
            style('auto', 'Uchta teng ustun', '#uch > div:nth-child(2)', 'width', '380px'),
          ),
          at(1280, 800, style('side', 'Menyu 3/12', '#menyu', 'width', '285px')),
          at(1280, 800, style('rest', 'Kontent qolgan joyda', '#kontent', 'width', '855px')),
          at(600, 700, style('sm', 'Kurs planshetda yarim', '#k2', 'width', '270px')),
          at(
            1280,
            800,
            style('lg', 'Kurs noutbukda chorak', '#k2', 'width', '285px', { hidden: true }),
          ),
        ],
      },
      quiz: quiz('1-modul testi: Bootstrap 4 bilan tanishuv', [
        q(
          'm1-flex',
          'Bootstrap 4 setkasi qaysi texnologiyaga asoslangan?',
          ['Flexbox', '`float`', 'CSS Grid', 'Jadval'],
          [0],
        ),
        q(
          'm1-bundle',
          '`bootstrap.bundle.min.js` ichida nima bor?',
          ['Bootstrap plaginlari va Popper', 'Faqat jQuery', 'Bootstrap CSS', 'Bootstrap Icons'],
          [0],
        ),
        q(
          'm1-xs',
          'Bootstrap 4 da eng kichik ekran uchun ustun klassi qanday yoziladi?',
          ['`col-6`', '`col-xs-6`', '`col-sm-6`', '`col-min-6`'],
          [0],
        ),
        q(
          'm1-container',
          'Noutbukda (≥ 992px) `.container` maksimal kengligi?',
          ['960px', '970px', '1140px', '720px'],
          [0],
        ),
        q(
          'm1-col',
          '`<div class="row">` ichidagi to‘rtta `<div class="col">` qanday joylashadi?',
          [
            'To‘rtta teng ustun',
            'Ustma-ust',
            'Birinchisi 12 ustun, qolganlari keyingi qatorda',
            'Hammasi 3 ustundan',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  'get-started': bs4(START.replace('<div id="sahifa">', '<div id="sahifa" class="container">'), {
    title: 'Kutubxona',
  }),
  containers: bs4(
    slots(CONTAINERS, {
      main: cls('container'),
      banner: cls('container-fluid p-3 my-3 bg-dark text-white'),
      table: cls('container-lg'),
    }),
    { title: 'Konteynerlar' },
  ),
  'grid-basic': bs4(
    slots(GRID, { auto: cls('col'), side: cls('col-3'), card: cls('col-sm-6 col-lg-3') }),
    {
      title: 'Setka',
    },
  ),
};
