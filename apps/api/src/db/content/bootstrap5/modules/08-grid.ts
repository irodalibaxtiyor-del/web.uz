import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs5,
  cls,
  has,
  md,
  pic,
  q,
  quiz,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const BOX = 'class="p-2 border bg-body-tertiary"';
const col = (id: string, label: string) => `<div id="${id}"{{c}}><div ${BOX}>${label}</div></div>`;
const four = (prefix: string) =>
  [1, 2, 3, 4].map((n) => col(`${prefix}${n}`, `Kurs ${n}`)).join('\n    ');

const SYSTEM = `<div class="container">
  <div class="row mb-3">
    <div id="forma"{{forma}}><div ${BOX}>Kirish formasi</div></div>
  </div>
  <div class="row mb-3">
    <div id="asosiy"{{asosiy}}><div ${BOX}>Asosiy kontent — HTML’da birinchi</div></div>
    <div id="yon"{{yon}}><div ${BOX}>Yon panel — ekranda chapda</div></div>
  </div>
  <div id="galereya"{{gallery}}>
    <div class="col-4"><img src="${pic('1', 300, 200)}" alt="1-surat" class="w-100"></div>
    <div class="col-4"><img src="${pic('2', 300, 200, '#198754')}" alt="2-surat" class="w-100"></div>
    <div class="col-4"><img src="${pic('3', 300, 200, '#ffc107')}" alt="3-surat" class="w-100"></div>
  </div>
</div>`;

const STACKED = `<div class="container">
  <div id="qator1"{{row}}>
    <div id="a"{{half}}><div ${BOX}>Chap yarmi</div></div>
    <div id="b"{{half}}><div ${BOX}>O‘ng yarmi</div></div>
  </div>
  <div class="row mt-3">
    ${col('c1', '1').replace('{{c}}', '{{quarter}}')}
    ${col('c2', '2').replace('{{c}}', '{{quarter}}')}
    ${col('c3', '3').replace('{{c}}', '{{quarter}}')}
    ${col('c4', '4').replace('{{c}}', '{{quarter}}')}
  </div>
</div>`;

const XSMALL = `<div class="container">
  <div class="row align-items-center mb-3">
    <div id="logo"{{auto}}><img src="${pic('W', 40, 40, '#7952b3')}" alt="Logo" width="40" height="40"></div>
    <div id="nom"{{fill}}>WEBDIZAYN — veb-dizayn maktabi</div>
  </div>
  <div class="row">
    ${col('i1', 'Profil')}
    ${col('i2', 'Kurslar')}
    ${col('i3', 'Xabarlar')}
    ${col('i4', 'Sozlamalar')}
  </div>
</div>`;

const SINGLE = (title: string) => `<div class="container">
  <h2>${title}</h2>
  <div class="row">
    ${four('k')}
  </div>
</div>`;

const MEDIUM = `<div class="container">
  <div id="banner"{{banner}}>Kuzgi chegirma: barcha kurslar -20%</div>
  <div class="row">
    ${four('k')}
  </div>
</div>`;

const LARGE = `<div class="container">
  <div class="row">
    ${four('k')}
  </div>
  <div id="qator"{{row}}>
    <article id="maqola"{{art}}><div ${BOX}><h2>Qator uzunligi</h2><p>Qulay o‘qish uchun 60–80 belgi.</p></div></article>
  </div>
</div>`;

const XXL = `<div id="konteyner"{{container}}>
  <div class="row">
    ${four('k')}
  </div>
  <div id="faqat"{{only}}>Katta monitor uchun qo‘shimcha panel</div>
</div>`;

const stat = (id: string, n: string, label: string) =>
  `<div id="${id}"{{stat}}><div class="card card-body text-center">${n}<br>${label}</div></div>`;

const EXAMPLES = `<div class="container">
  <div id="banner"{{banner}}>Barcha statistika — real vaqtda.</div>
  <div id="statistika"{{statsRow}}>
    ${stat('s1', '12', 'Kurs')}
    ${stat('s2', '340', 'Talaba')}
    ${stat('s3', '58', 'Topshiriq')}
    ${stat('s4', '4.8', 'Reyting')}
  </div>
  <div id="katalog"{{catalog}}>
    <div class="col"><div class="card h-100"><div class="card-body">HTML</div></div></div>
    <div class="col"><div class="card h-100"><div class="card-body">CSS</div></div></div>
    <div class="col"><div class="card h-100"><div class="card-body">JavaScript</div></div></div>
    <div class="col"><div class="card h-100"><div class="card-body">Bootstrap</div></div></div>
  </div>
</div>`;

export const m08: ModuleDef = {
  title: 'Setka tizimi',
  lessons: [
    {
      slug: 'grid-system',
      title: 'Setka tizimi chuqurroq',
      exercise: {
        title: 'Offset, order va gutter',
        description: 'Bootstrap 5 setkasini boshqarish.',
        instructions: md(
          '- `#forma` — `col-md-6 offset-md-3`.',
          '- `#asosiy` — `col-md-8 order-md-2`, `#yon` — `col-md-4 order-md-1`.',
          '- `#galereya` — oraliqsiz qator: `row g-0`.',
        ),
        expectedBehavior:
          'Markazdagi forma, chapda yon panel, o‘ngda kontent, bir-biriga yopishgan rasmlar.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(SYSTEM), { title: 'Setka' }),
        checks: [
          at(1000, 800, style('offset', 'Forma markazda', '#forma', 'margin-left', '240px')),
          at(1000, 800, style('width', 'Forma 6 ustun', '#forma', 'width', '480px')),
          at(1000, 800, style('order', 'Yon panel birinchi', '#yon', 'order', '1')),
          style('g0', 'Galereyada oraliq yo‘q', '#galereya', '--bs-gutter-x', '0'),
          at(
            1000,
            800,
            style('order2', 'Kontent ikkinchi', '#asosiy', 'order', '2', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'grid-stacked',
      title: 'Ustma-ust va yonma-yon',
      exercise: {
        title: 'Kichik planshetdan yonma-yon',
        description: '`col-sm-*` va `gy-*`.',
        instructions: md(
          '- `#qator1` — `row gy-3` (ustma-ust bo‘lganda bloklar orasida masofa).',
          '- Birinchi qatordagi ikki blok `sm` dan teng yarim (`col-sm-6`).',
          '- Ikkinchi qatordagi to‘rt blok `sm` dan to‘rttadan (`col-sm-3`).',
        ),
        expectedBehavior: '576px dan kengda yonma-yon, torroqda ustma-ust va orasida masofa.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(STACKED), { title: 'Setka' }),
        checks: [
          at(600, 700, style('half', 'Yarim (sm)', '#b', 'width', '270px')),
          at(600, 700, style('quarter', 'Chorak (sm)', '#c3', 'width', '135px')),
          at(375, 700, style('stack', 'Telefonda to‘liq kenglik', '#c2', 'width', '375px')),
          style('gy', 'Vertikal oraliq', '#qator1', '--bs-gutter-y', '1rem'),
        ],
      },
    },
    {
      slug: 'grid-xsmall',
      title: 'Eng kichik ekran (xs)',
      exercise: {
        title: 'Logo qatori va ikonkalar',
        description: '`.col-auto`, `.col` va `.col-6`.',
        instructions: md(
          '- `#logo` — `col-auto`, `#nom` — `col`.',
          '- To‘rtta ikonka bloki telefonda ham ikkitadan: `col-6`.',
        ),
        expectedBehavior: 'Kichik logo va yonida keng nom; pastda 2×2 bloklar telefonda ham.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(XSMALL), { title: 'Panel' }),
        checks: [
          at(375, 700, style('auto', 'Logo kontent kengligida', '#logo', 'width', '64px')),
          at(375, 700, style('fill', 'Nom qolgan joyda', '#nom', 'width', '311px')),
          at(375, 700, style('xs', 'Telefonda yarim', '#i3', 'width', '187.5px')),
        ],
      },
    },
    {
      slug: 'grid-small',
      title: 'xs va sm birga',
      exercise: {
        title: 'Ikonkalar paneli',
        description: 'Telefonda 2, kichik planshetda 4 ustun.',
        instructions: md(
          'To‘rtta blok telefonda ikkitadan (`col-6`), 576px dan to‘rttadan (`col-sm-3`) tursin.',
        ),
        expectedBehavior: 'Telefonda 2×2, kichik planshetda bir qator.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(SINGLE('Ikonkalar paneli')), { title: 'Panel' }),
        checks: [
          at(400, 700, style('xs', 'Telefonda yarim', '#k3', 'width', '200px')),
          at(600, 700, style('sm', 'Kichik planshetda chorak', '#k3', 'width', '135px')),
        ],
      },
    },
    {
      slug: 'grid-medium',
      title: 'Planshet (md)',
      exercise: {
        title: 'Kurslar va banner',
        description: '`sm` + `md` va display.',
        instructions: md(
          '- To‘rtta kurs: `sm` da ikkitadan, `md` da to‘rttadan (`col-sm-6 col-md-3`).',
          '- `#banner` faqat `md` va kattada: `d-none d-md-block alert alert-info`.',
        ),
        expectedBehavior: 'Kichik planshetda 2 ustun va bannersiz; planshetda banner va 4 ustun.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(MEDIUM), { title: 'Kurslar' }),
        checks: [
          at(600, 700, style('sm', 'sm da yarim', '#k2', 'width', '270px')),
          at(800, 700, style('md', 'md da chorak', '#k2', 'width', '180px')),
          at(600, 700, style('hide', 'sm da banner yashirin', '#banner', 'display', 'none')),
          at(
            800,
            700,
            style('show', 'md da banner ko‘rinadi', '#banner', 'display', 'block', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'grid-large',
      title: 'Noutbuk (lg)',
      exercise: {
        title: 'Noutbuk maketi',
        description: '`md` + `lg` va markazdagi maqola.',
        instructions: md(
          '- Kurslar: planshetda ikkitadan, noutbukda to‘rttadan (`col-md-6 col-lg-3`).',
          '- `#qator` — `row justify-content-center`; `#maqola` — `col-lg-6`.',
        ),
        expectedBehavior: 'Planshetda 2, noutbukda 4 ustunli kurslar; maqola noutbukda o‘rtada.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(LARGE), { title: 'Noutbuk' }),
        checks: [
          at(800, 700, style('md', 'Planshetda yarim', '#k2', 'width', '360px')),
          at(1000, 800, style('lg', 'Noutbukda chorak', '#k2', 'width', '240px')),
          at(1000, 800, style('art', 'Maqola yarim kenglikda', '#maqola', 'width', '480px')),
          style('center', 'Maqola markazda', '#qator', 'justify-content', 'center'),
        ],
      },
    },
    {
      slug: 'grid-xlarge',
      title: 'Katta ekran (xl)',
      exercise: {
        title: 'Kurslar katalogi (xl)',
        description: '`lg` + `xl`.',
        instructions: md(
          'To‘rtta kurs noutbukda ikkitadan (`col-lg-6`), 1200px dan to‘rttadan (`col-xl-3`) tursin.',
        ),
        expectedBehavior: 'Noutbukda 2, katta ekranda 4 ustun; planshetda bitta ustun.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(SINGLE('Kurslar')), { title: 'Katalog' }),
        checks: [
          at(800, 700, style('md', 'Planshetda to‘liq', '#k1', 'width', '720px')),
          at(1000, 800, style('lg', 'Noutbukda yarim', '#k1', 'width', '480px')),
          at(1280, 800, style('xl', 'Katta ekranda chorak', '#k1', 'width', '285px')),
        ],
      },
    },
    {
      slug: 'grid-xxl',
      title: 'Juda katta ekran (xxl)',
      exercise: {
        title: 'Katta monitor maketi',
        description: '`xxl` sinfi: `container`, `col-xxl-*`, `d-xxl-*`.',
        instructions: md(
          '- `#konteyner` — oddiy `container`.',
          '- Kurslar: `xl` da ikkitadan, `xxl` da to‘rttadan (`col-xl-6 col-xxl-3`).',
          '- `#faqat` — faqat 1400px dan ko‘rinsin: `d-none d-xxl-block`.',
        ),
        expectedBehavior:
          '1280px da 2 ustun, 1440px da konteyner 1320px va 4 ustun hamda qo‘shimcha panel.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(XXL), { title: 'Monitor' }),
        checks: [
          at(
            1440,
            900,
            style('container', 'xxl da konteyner 1320px', '#konteyner', 'width', '1320px'),
          ),
          at(1280, 800, style('xl', 'xl da yarim', '#k2', 'width', '570px')),
          at(1440, 900, style('xxl', 'xxl da chorak', '#k2', 'width', '330px')),
          at(1280, 800, style('hide', 'xl da panel yashirin', '#faqat', 'display', 'none')),
          at(
            1440,
            900,
            style('show', 'xxl da panel ko‘rinadi', '#faqat', 'display', 'block', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'grid-examples',
      title: 'Setka namunalari',
      exercise: {
        title: 'Dashboard sahifasi',
        description: 'Statistika, `row-cols` katalog va display.',
        instructions: md(
          '- `#statistika` — `row g-3 mb-4`; har bir statistika bloki — `col-6 col-lg-3`.',
          '- `#katalog` — `row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4`.',
          '- `#banner` faqat noutbuk va kattada: `d-none d-lg-block alert alert-success`.',
        ),
        expectedBehavior:
          'Telefonda 2×2 statistika va bitta ustunli katalog; katta ekranda hammasi bir qatorda.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(EXAMPLES), { title: 'Dashboard' }),
        checks: [
          has('stats', 'Statistika qatori `g-3`', '#statistika.row.g-3 > .col-6.col-lg-3', {
            min: 4,
          }),
          at(
            600,
            700,
            style('sm', 'Katalog sm da yarim', '#katalog > .col:first-child', 'width', '270px'),
          ),
          at(
            1280,
            800,
            style('xl', 'Katalog xl da chorak', '#katalog > .col:first-child', 'width', '285px'),
          ),
          at(800, 700, style('hide', 'Planshetda banner yashirin', '#banner', 'display', 'none')),
        ],
      },
      quiz: quiz('8-modul testi: setka tizimi', [
        q(
          'm8-xxl',
          '`xxl` sinfi qaysi kenglikdan boshlanadi?',
          ['1400px', '1200px', '1600px', '1920px'],
          [0],
        ),
        q(
          'm8-gy',
          'Ustunlar ustma-ust tushganda ular orasiga vertikal masofa berish?',
          [
            'Qatorga `gy-*`',
            'Har bir ustunga `py-*`',
            '`row-gap-*` faqat CSS’da',
            'Buning iloji yo‘q',
          ],
          [0],
        ),
        q(
          'm8-g0',
          'Ustunlar orasidagi oraliqni butunlay olib tashlash?',
          ['`g-0`', '`no-gutters`', '`gap-0`', '`p-0`'],
          [0],
        ),
        q(
          'm8-auto',
          '`.col-auto` qanday kenglik oladi?',
          ['Kontentining kengligi', 'Teng ulush', 'Har doim 1/12', 'Har doim 100%'],
          [0],
        ),
        q(
          'm8-versions',
          'Uchala Bootstrap versiyasi haqida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            'Bootstrap 3 setkasi `float`, Bootstrap 4 va 5 setkasi Flexbox asosida',
            'Bootstrap 4 da `col-xs-*` o‘rniga `col-*`',
            'Bootstrap 5 da `ml-auto` o‘rniga `ms-auto`',
            'Bootstrap 5 ga jQuery kerak',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s08: Record<string, ProjectFile[]> = {
  'grid-system': bs5(
    slots(SYSTEM, {
      forma: cls('col-md-6 offset-md-3'),
      asosiy: cls('col-md-8 order-md-2'),
      yon: cls('col-md-4 order-md-1'),
      gallery: cls('row g-0'),
    }),
    { title: 'Setka' },
  ),
  'grid-stacked': bs5(
    slots(STACKED, { row: cls('row gy-3'), half: cls('col-sm-6'), quarter: cls('col-sm-3') }),
    {
      title: 'Setka',
    },
  ),
  'grid-xsmall': bs5(slots(XSMALL, { auto: cls('col-auto'), fill: cls('col'), c: cls('col-6') }), {
    title: 'Panel',
  }),
  'grid-small': bs5(slots(SINGLE('Ikonkalar paneli'), { c: cls('col-6 col-sm-3') }), {
    title: 'Panel',
  }),
  'grid-medium': bs5(
    slots(MEDIUM, {
      c: cls('col-sm-6 col-md-3'),
      banner: cls('d-none d-md-block alert alert-info'),
    }),
    {
      title: 'Kurslar',
    },
  ),
  'grid-large': bs5(
    slots(LARGE, {
      c: cls('col-md-6 col-lg-3'),
      row: cls('row justify-content-center'),
      art: cls('col-lg-6'),
    }),
    { title: 'Noutbuk' },
  ),
  'grid-xlarge': bs5(slots(SINGLE('Kurslar'), { c: cls('col-lg-6 col-xl-3') }), {
    title: 'Katalog',
  }),
  'grid-xxl': bs5(
    slots(XXL, {
      container: cls('container'),
      c: cls('col-xl-6 col-xxl-3'),
      only: cls('d-none d-xxl-block'),
    }),
    { title: 'Monitor' },
  ),
  'grid-examples': bs5(
    slots(EXAMPLES, {
      statsRow: cls('row g-3 mb-4'),
      stat: cls('col-6 col-lg-3'),
      catalog: cls('row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4'),
      banner: cls('d-none d-lg-block alert alert-success'),
    }),
    { title: 'Dashboard' },
  ),
};
