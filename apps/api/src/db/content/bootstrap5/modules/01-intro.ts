import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs5,
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
  <button type="button" class="btn btn-primary">A’zo bo‘lish</button>
</div>`;

const CONTAINERS = `<div id="asosiy"{{main}}>
  <h1>Kurslar</h1>
  <p>Belgilangan kenglikdagi konteyner.</p>
</div>
<div id="banner"{{banner}}>
  <p class="m-0">Kuzgi chegirma: barcha kurslar -20%</p>
</div>
<div id="keng"{{xxl}}>
  <p>1400px gacha to‘liq kenglik, keyin 1320px.</p>
</div>`;

const BOX = 'class="p-3 border bg-light"';

const GRID = `<div class="container">
  <div class="row mb-3" id="uch">
    <div{{auto}}><div ${BOX}>1</div></div>
    <div{{auto}}><div ${BOX}>2</div></div>
    <div{{auto}}><div ${BOX}>3</div></div>
  </div>
  <div id="kurslar"{{row}}>
    <div id="k1"{{card}}><div ${BOX}>Kurs 1</div></div>
    <div id="k2"{{card}}><div ${BOX}>Kurs 2</div></div>
    <div id="k3"{{card}}><div ${BOX}>Kurs 3</div></div>
    <div id="k4"{{card}}><div ${BOX}>Kurs 4</div></div>
  </div>
</div>`;

export const m01: ModuleDef = {
  title: 'Bootstrap 5 bilan tanishuv',
  lessons: [
    { slug: 'home', title: 'Bootstrap 5 nima?' },
    {
      slug: 'get-started',
      title: 'Bootstrap 5 ni ulash',
      exercise: {
        title: 'Bootstrap 5 ni sahifaga ulang',
        description: 'CSS va bundle — jQuery’siz.',
        instructions: md(
          '1. `<head>` ga Bootstrap 5.3.8 CSS havolasini qo‘shing.',
          '2. `</body>` dan oldin `bootstrap.bundle.min.js` (5.3.8) ni ulang. jQuery kerak emas.',
          '3. `#sahifa` ga `container` klassini bering.',
        ),
        expectedBehavior:
          'Tugma ko‘k Bootstrap tugmasiga aylanadi, kontent markazdagi konteynerda, konsolda xato yo‘q.',
        difficulty: 'EASY',
        starterFiles: bs5(START, { bare: true, title: 'Kutubxona' }),
        checks: [
          style(
            'css',
            'Bootstrap CSS ulangan',
            '.btn-primary',
            'background-color',
            RGB.bs5.primary,
          ),
          has('js', 'Bootstrap bundle ulangan', 'script[src*="bootstrap.bundle"]'),
          at(
            1280,
            800,
            style('container', 'Kontent `.container` ichida', '#sahifa', 'width', '1140px'),
          ),
          at(
            1440,
            900,
            style('xxl', 'xxl ekranda 1320px', '#sahifa', 'width', '1320px', { hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'containers',
      title: 'Konteynerlar',
      exercise: {
        title: 'Uch xil konteyner',
        description: '`.container`, `.container-fluid` va `.container-xxl`.',
        instructions: md(
          '- `#asosiy` — oddiy konteyner.',
          '- `#banner` — to‘liq kenglikdagi to‘q blok: `container-fluid p-5 my-3 bg-dark text-white`.',
          '- `#keng` — `xxl` sinfigacha to‘liq kenglikda: `container-xxl`.',
        ),
        expectedBehavior:
          'Katta monitorda o‘rtadagi ikki konteyner va to‘liq kenglikdagi to‘q banner.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(CONTAINERS), { title: 'Konteynerlar' }),
        checks: [
          at(
            1440,
            900,
            style('container', '`#asosiy` xxl da 1320px', '#asosiy', 'width', '1320px'),
          ),
          at(1440, 900, style('fluid', 'Banner to‘liq kenglikda', '#banner', 'width', '1440px')),
          style('dark', 'Banner to‘q', '#banner', 'background-color', RGB.bs5.dark),
          at(1280, 800, style('xxl-xl', '`#keng` xl da 100%', '#keng', 'width', '1280px')),
          at(
            1440,
            900,
            style('xxl-xxl', '`#keng` xxl da 1320px', '#keng', 'width', '1320px', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'grid-basic',
      title: 'Setka asoslari',
      exercise: {
        title: 'Avtomatik ustunlar va gutter',
        description: '`.col`, `.col-sm-6 .col-lg-3` va `g-3`.',
        instructions: md(
          '- `#uch` qatoridagi uchta ustun — avtomatik teng (`col`).',
          '- `#kurslar` — `row g-3`.',
          '- Har bir kurs — `col-sm-6 col-lg-3`.',
        ),
        expectedBehavior:
          'Uchta teng ustun; kurslar telefonda 1, planshetda 2, noutbukda 4 ustunda, orasida oraliq bilan.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(GRID), { title: 'Setka' }),
        checks: [
          at(
            1280,
            800,
            style('auto', 'Uchta teng ustun', '#uch > div:nth-child(2)', 'width', '380px'),
          ),
          style('gutter', 'Oraliq `g-3`', '#kurslar', '--bs-gutter-x', '1rem'),
          at(600, 700, style('sm', 'Planshetda yarim', '#k2', 'width', '266px')),
          at(1280, 800, style('lg', 'Noutbukda chorak', '#k2', 'width', '283px')),
        ],
      },
      quiz: quiz('1-modul testi: Bootstrap 5 bilan tanishuv', [
        q(
          'm1-jquery',
          'Bootstrap 5 ga jQuery kerakmi?',
          [
            'Yo‘q, plaginlar sof JavaScript’da',
            'Ha, har doim',
            'Faqat modal uchun',
            'Faqat Bootstrap 5.3 da',
          ],
          [0],
        ),
        q(
          'm1-data',
          'Bootstrap 5 da collapse tugmasining atributi qanday yoziladi?',
          [
            '`data-bs-toggle="collapse"`',
            '`data-toggle="collapse"`',
            '`bs-toggle="collapse"`',
            '`data-collapse`',
          ],
          [0],
        ),
        q(
          'm1-xxl',
          'Bootstrap 5 dagi yangi ekran sinfi va undagi `.container` kengligi?',
          ['`xxl`, 1320px', '`xl`, 1140px', '`xxs`, 360px', '`xxl`, 1440px'],
          [0],
        ),
        q(
          'm1-g0',
          'Bootstrap 4 dagi `.no-gutters` ning Bootstrap 5 dagi muqobili?',
          ['`g-0`', '`gutter-0`', '`p-0`', '`no-g`'],
          [0],
        ),
        q(
          'm1-me',
          'Bootstrap 4 dagi `ml-3` va `mr-3` Bootstrap 5 da qanday yoziladi? (bir nechta javob)',
          ['`ms-3`', '`me-3`', '`ml-3` o‘zgarmagan', '`mx-3`'],
          [0, 1],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  'get-started': bs5(START.replace('<div id="sahifa">', '<div id="sahifa" class="container">'), {
    title: 'Kutubxona',
  }),
  containers: bs5(
    slots(CONTAINERS, {
      main: cls('container'),
      banner: cls('container-fluid p-5 my-3 bg-dark text-white'),
      xxl: cls('container-xxl'),
    }),
    { title: 'Konteynerlar' },
  ),
  'grid-basic': bs5(
    slots(GRID, { auto: cls('col'), row: cls('row g-3'), card: cls('col-sm-6 col-lg-3') }),
    {
      title: 'Setka',
    },
  ),
};
