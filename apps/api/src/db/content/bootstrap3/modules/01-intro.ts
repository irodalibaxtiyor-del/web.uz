import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs3,
  clean,
  has,
  md,
  q,
  quiz,
  RGB,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const START_BODY = `<div id="sahifa">
  <h1>Kutubxona yangiliklari</h1>
  <p>Har shanba kuni yangi kitoblar taqdimoti bo‘ladi.</p>
  <button type="button" class="btn btn-primary">Ro‘yxatdan o‘tish</button>
</div>`;

const GRID_START = `<div class="container">
  <h1>Bizning xizmatlar</h1>
  <div class="row" id="xizmatlar">
    <div>Dizayn</div>
    <div>Dasturlash</div>
    <div>Qo‘llab-quvvatlash</div>
  </div>
  <div class="row" id="asosiy">
    <div>Menyu</div>
    <div>Asosiy matn shu yerda bo‘ladi.</div>
  </div>
</div>`;

export const m01: ModuleDef = {
  title: 'Bootstrap 3 bilan tanishuv',
  lessons: [
    { slug: 'home', title: 'Bootstrap nima?' },
    {
      slug: 'get-started',
      title: 'Bootstrap’ni ulash',
      exercise: {
        title: 'Bootstrap’ni sahifaga ulang',
        description: 'CDN havolalari va konteyner.',
        instructions: md(
          'Sahifada Bootstrap hali ulanmagan. `index.html` da:',
          '',
          '1. `<head>` ga Bootstrap 3.4.1 CSS havolasini qo‘shing.',
          '2. `</body>` dan oldin **avval** jQuery 3.7.1, **keyin** `bootstrap.min.js` ni ulang.',
          '3. `<div id="sahifa">` ga `container` klassini bering.',
          '',
          'Havolalar darsda berilgan.',
        ),
        expectedBehavior:
          'Tugma ko‘k Bootstrap tugmasiga aylanadi, kontent markazdagi konteynerda turadi, konsolda xato yo‘q.',
        difficulty: 'EASY',
        starterFiles: bs3(START_BODY, { bare: true, title: 'Kutubxona' }),
        checks: [
          style(
            'css',
            'Bootstrap CSS ulangan',
            '.btn-primary',
            'background-color',
            RGB.bs3.primary,
            {
              hint: '`<link rel="stylesheet" href="…bootstrap.min.css">` `<head>` ichidami?',
            },
          ),
          has(
            'js',
            'jQuery va Bootstrap JS ulangan',
            'script[src*="jquery"] ~ script[src*="bootstrap.min.js"]',
            {
              hint: 'Avval jQuery, keyin bootstrap.min.js.',
            },
          ),
          at(
            1280,
            800,
            style('container', 'Kontent `.container` ichida', '#sahifa', 'width', '1170px', {
              hint: '`<div id="sahifa" class="container">`',
            }),
          ),
          clean({ hint: 'Skriptlar tartibini tekshiring: jQuery birinchi bo‘lishi kerak.' }),
        ],
      },
    },
    {
      slug: 'grid-basic',
      title: 'Setka asoslari',
      exercise: {
        title: 'Xizmatlar sahifasi setkasi',
        description: 'Teng va teng bo‘lmagan ustunlar.',
        instructions: md(
          '- `#xizmatlar` qatoridagi uchta blok planshetdan boshlab **teng uch ustun** bo‘lsin (`col-sm-4`).',
          '- `#asosiy` qatorida menyu **3 ustun**, matn **9 ustun** egallasin (`sm` o‘lchamidan boshlab).',
          '',
          'Telefonda (768px dan tor) bloklar ustma-ust tushishi kerak.',
        ),
        expectedBehavior:
          'Keng ekranda xizmatlar uchta teng ustunda, pastda tor menyu va keng matn; telefonda hammasi ustma-ust.',
        difficulty: 'EASY',
        starterFiles: bs3(GRID_START, { title: 'Xizmatlar' }),
        checks: [
          has('three', 'Uchta `col-sm-4` ustun', '#xizmatlar > .col-sm-4', { min: 3, max: 3 }),
          at(
            1280,
            800,
            style('side', 'Menyu 3/12 kenglikda', '#asosiy > div:first-child', 'width', '292.5px', {
              hint: 'Menyu blokiga `col-sm-3` bering.',
            }),
          ),
          at(
            1280,
            800,
            style('main', 'Matn 9/12 kenglikda', '#asosiy > div:last-child', 'width', '877.5px', {
              hint: 'Matn blokiga `col-sm-9` bering.',
            }),
          ),
          at(
            375,
            700,
            style(
              'stack',
              'Telefonda ustunlar ustma-ust',
              '#xizmatlar > div:nth-child(2)',
              'float',
              'none',
              {
                hidden: true,
                hint: '`col-xs-*` emas, `col-sm-*` ishlating.',
              },
            ),
          ),
        ],
      },
      quiz: quiz('1-modul testi: Bootstrap 3 bilan tanishuv', [
        q(
          'm1-order',
          'Bootstrap 3 skriptlari qaysi tartibda ulanadi?',
          [
            'Avval jQuery, keyin bootstrap.min.js',
            'Avval bootstrap.min.js, keyin jQuery',
            'Tartib ahamiyatsiz',
            'jQuery kerak emas',
          ],
          [0],
        ),
        q(
          'm1-viewport',
          'Viewport meta tegi nima uchun kerak?',
          [
            'Telefon sahifani qurilma kengligida ko‘rsatishi va setka moslashishi uchun',
            'Sahifa sarlavhasini belgilash uchun',
            'jQuery’ni yuklash uchun',
            'Shriftni o‘zgartirish uchun',
          ],
          [0],
        ),
        q(
          'm1-fluid',
          'Ekranning to‘liq kengligini egallaydigan konteyner klassi qaysi?',
          ['`.container-fluid`', '`.container`', '`.container-full`', '`.row`'],
          [0],
        ),
        q('m1-cols', 'Bootstrap setkasi nechta ustundan iborat?', ['12', '10', '16', '24'], [0]),
        q(
          'm1-sm',
          '`col-sm-6` klassli blok 600px kenglikdagi ekranda qanday ko‘rinadi?',
          [
            'To‘liq kenglikda (100%), boshqa bloklar ustma-ust',
            'Yarim kenglikda (50%)',
            'Ko‘rinmaydi',
            '6px kenglikda',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  'get-started': bs3(
    START_BODY.replace('<div id="sahifa">', '<div id="sahifa" class="container">'),
    {
      title: 'Kutubxona',
    },
  ),
  'grid-basic': bs3(
    GRID_START.replace(/<div>(Dizayn|Dasturlash|Qo‘llab)/g, '<div class="col-sm-4">$1')
      .replace('<div>Menyu', '<div class="col-sm-3">Menyu')
      .replace('<div>Asosiy', '<div class="col-sm-9">Asosiy'),
    { title: 'Xizmatlar' },
  ),
};
