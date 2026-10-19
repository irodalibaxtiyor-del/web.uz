import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs4,
  cls,
  md,
  pic,
  q,
  quiz,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const BOX = 'class="border bg-light p-2"';
const col = (id: string, label: string) => `<div id="${id}"{{c}}><div ${BOX}>${label}</div></div>`;

const SYSTEM = `<div class="container">
  <div class="row">
    <div id="forma"{{forma}}><div ${BOX}>Kirish formasi</div></div>
  </div>
  <div class="row">
    <div id="asosiy"{{asosiy}}><div ${BOX}>Asosiy kontent — HTML’da birinchi</div></div>
    <div id="yon"{{yon}}><div ${BOX}>Yon panel — ekranda chapda</div></div>
  </div>
  <div id="galereya"{{gallery}}>
    <div class="col-4"><img src="${pic('1', 300, 200)}" alt="1-surat" class="w-100"></div>
    <div class="col-4"><img src="${pic('2', 300, 200, '#28a745')}" alt="2-surat" class="w-100"></div>
    <div class="col-4"><img src="${pic('3', 300, 200, '#ffc107')}" alt="3-surat" class="w-100"></div>
  </div>
</div>`;

const STACKED = `<div class="container">
  <div class="row">
    <div id="a"{{half}}><div ${BOX}>Chap yarmi</div></div>
    <div id="b"{{half}}><div ${BOX}>O‘ng yarmi</div></div>
  </div>
  <div class="row">
    <div id="c"{{third}}><div ${BOX}>1</div></div>
    <div id="d"{{third}}><div ${BOX}>2</div></div>
    <div id="e"{{third}}><div ${BOX}>3</div></div>
  </div>
</div>`;

const XSMALL = `<div class="container">
  <div class="row align-items-center mb-3">
    <div id="logo"{{auto}}><img src="${pic('W', 40, 40, '#563d7c')}" alt="Logo" width="40" height="40"></div>
    <div id="nom"{{fill}}>WEBDIZAYN — veb-dizayn maktabi</div>
  </div>
  <div class="row">
    ${col('i1', 'Profil')}
    ${col('i2', 'Kurslar')}
    ${col('i3', 'Xabarlar')}
    ${col('i4', 'Sozlamalar')}
  </div>
</div>`;

const FOUR = `<div class="row">
    ${col('k1', 'Kurs 1')}
    ${col('k2', 'Kurs 2')}
    ${col('k3', 'Kurs 3')}
    ${col('k4', 'Kurs 4')}
  </div>`;

const SMALL = `<div class="container">
  <h2>Ikonkalar paneli</h2>
  ${FOUR}
</div>`;

const MEDIUM = `<div class="container">
  <div id="banner"{{banner}}>Kuzgi chegirma: barcha kurslar -20%</div>
  <div class="row">
    ${col('k1', 'Kurs 1')}
    ${col('k2', 'Kurs 2')}
    ${col('k3', 'Kurs 3')}
  </div>
</div>`;

const LARGE = `<div class="container">
  ${FOUR}
  <div id="qator"{{row}}>
    <article id="maqola"{{art}}><div ${BOX}><h2>Qator uzunligi</h2><p>Qulay o‘qish uchun 60–80 belgi.</p></div></article>
  </div>
</div>`;

const XLARGE = `<div class="container">
  <div id="katalog"{{row}}>
    <div id="k1"{{c}}><div ${BOX}>HTML</div></div>
    <div id="k2"{{c}}><div ${BOX}>CSS</div></div>
    <div id="k3"{{c}}><div ${BOX}>JavaScript</div></div>
    <div id="k4"{{c}}><div ${BOX}>Bootstrap</div></div>
  </div>
</div>`;

const stat = (id: string, n: string, label: string) =>
  `<div id="${id}"{{stat}}><div class="card card-body text-center">${n}<br>${label}</div></div>`;

const EXAMPLES = `<div class="container">
  <div id="banner"{{banner}}>Barcha statistika — real vaqtda.</div>
  <div class="row">
    ${stat('s1', '12', 'Kurs')}
    ${stat('s2', '340', 'Talaba')}
    ${stat('s3', '58', 'Topshiriq')}
    ${stat('s4', '4.8', 'Reyting')}
  </div>
  <div id="qator"{{center}}>
    <div id="forma"{{form}}>
      <form class="card card-body">
        <label for="email">Email</label>
        <input type="email" class="form-control mb-2" id="email">
        <button class="btn btn-primary" type="submit">Kirish</button>
      </form>
    </div>
  </div>
</div>`;

export const m08: ModuleDef = {
  title: 'Setka tizimi',
  lessons: [
    {
      slug: 'grid-system',
      title: 'Setka tizimi chuqurroq',
      exercise: {
        title: 'Offset, order va no-gutters',
        description: 'Bootstrap 4 usullari bilan joylashtirish.',
        instructions: md(
          '- `#forma` — `md` dan 6 ustun va markazda: `col-md-6 offset-md-3`.',
          '- `#asosiy` — `col-md-8 order-md-2`, `#yon` — `col-md-4 order-md-1` (ekranda yon panel chapda).',
          '- `#galereya` — oraliqsiz qator: `row no-gutters`.',
        ),
        expectedBehavior:
          'Markazdagi forma, chapda yon panel va o‘ngda kontent, bir-biriga yopishgan uchta rasm.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(SYSTEM), { title: 'Setka' }),
        checks: [
          at(1000, 800, style('offset', 'Forma markazda', '#forma', 'margin-left', '240px')),
          at(1000, 800, style('width', 'Forma 6 ustun', '#forma', 'width', '480px')),
          at(1000, 800, style('order', 'Yon panel birinchi', '#yon', 'order', '1')),
          at(
            1000,
            800,
            style('order2', 'Kontent ikkinchi', '#asosiy', 'order', '2', { hidden: true }),
          ),
          style('gutters', 'Galereyada oraliq yo‘q', '#galereya > .col-4', 'padding-left', '0px'),
        ],
      },
    },
    {
      slug: 'grid-stacked',
      title: 'Ustma-ust va yonma-yon',
      exercise: {
        title: 'Kichik planshetdan yonma-yon',
        description: 'Bitta sinf (`sm`) bilan moslashuvchan setka.',
        instructions: md(
          '- Birinchi qatordagi ikki blok `sm` dan teng yarim.',
          '- Ikkinchi qatordagi uch blok `sm` dan teng uchdan bir.',
        ),
        expectedBehavior: '576px dan kengda 2 + 3 blok yonma-yon, torroqda ustma-ust.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(STACKED), { title: 'Setka' }),
        checks: [
          at(600, 700, style('half', 'Yarim (sm)', '#b', 'width', '270px')),
          at(600, 700, style('third', 'Uchdan bir (sm)', '#e', 'width', '180px')),
          at(375, 700, style('stack', 'Telefonda to‘liq kenglik', '#d', 'width', '375px')),
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
          '- `#logo` — kontent kengligida (`col-auto`), `#nom` — qolgan joyda (`col`).',
          '- To‘rtta ikonka bloki telefonda ham **ikkitadan** tursin: `col-6`.',
        ),
        expectedBehavior: 'Kichik logo va yonida keng nom; pastda 2×2 bloklar — telefonda ham.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(XSMALL), { title: 'Panel' }),
        checks: [
          at(375, 700, style('auto', 'Logo kontent kengligida', '#logo', 'width', '70px')),
          at(375, 700, style('fill', 'Nom qolgan joyni oladi', '#nom', 'width', '305px')),
          at(375, 700, style('xs', 'Telefonda yarim kenglik', '#i3', 'width', '187.5px')),
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
          'To‘rtta blok telefonda **ikkitadan**, 576px dan boshlab **to‘rttadan** bir qatorda tursin.',
        ),
        expectedBehavior: 'Telefonda 2×2, kichik planshetda bir qator.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(SMALL), { title: 'Panel' }),
        checks: [
          at(400, 700, style('xs', 'Telefonda yarim', '#k3', 'width', '200px')),
          at(600, 700, style('sm', 'Kichik planshetda chorak', '#k3', 'width', '135px')),
        ],
      },
    },
    {
      slug: 'grid-medium',
      title: 'Planshet uchun setka (md)',
      exercise: {
        title: 'Kurslar va banner',
        description: '`sm` + `md` va display utilitalari.',
        instructions: md(
          '- Uchta kurs bloki: `sm` da ikkitadan, `md` da uchtadan (`col-sm-6 col-md-4`).',
          '- `#banner` faqat `md` va undan katta ekranda ko‘rinsin: `d-none d-md-block alert alert-info`.',
        ),
        expectedBehavior:
          'Kichik planshetda 2 ustun va bannersiz; planshet/kompyuterda banner va 3 ustun.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(MEDIUM), { title: 'Kurslar' }),
        checks: [
          at(600, 700, style('sm', 'sm da yarim', '#k2', 'width', '270px')),
          at(800, 700, style('md', 'md da uchdan bir', '#k2', 'width', '240px')),
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
      title: 'Noutbuk uchun setka (lg)',
      exercise: {
        title: 'Noutbuk maketi',
        description: '`md` + `lg` va `justify-content-center`.',
        instructions: md(
          '- To‘rtta kurs bloki: planshetda ikkitadan, noutbukda to‘rttadan (`col-md-6 col-lg-3`).',
          '- `#qator` — `row justify-content-center`; `#maqola` — `col-lg-8`.',
        ),
        expectedBehavior:
          'Planshetda 2 ustunli kurslar, noutbukda 4 ustun; maqola noutbukda o‘rtada tor ustunda.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(LARGE), { title: 'Noutbuk' }),
        checks: [
          at(800, 700, style('md', 'Planshetda yarim', '#k2', 'width', '360px')),
          at(1000, 800, style('lg', 'Noutbukda chorak', '#k2', 'width', '240px')),
          at(1000, 800, style('art', 'Maqola 8 ustun', '#maqola', 'max-width', '66.6667%')),
          style('center', 'Maqola markazda', '#qator', 'justify-content', 'center'),
        ],
      },
    },
    {
      slug: 'grid-xlarge',
      title: 'Katta monitor (xl)',
      exercise: {
        title: '`row-cols` bilan katalog',
        description: 'Bir qatordagi ustunlar sonini qatorga yozish.',
        instructions: md(
          '- `#katalog` — `row row-cols-1 row-cols-lg-3 row-cols-xl-4`.',
          '- Har bir kurs bloki — oddiy `col`.',
        ),
        expectedBehavior: 'Planshetda bitta ustun, noutbukda uchta, katta monitorda to‘rtta.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(XLARGE), { title: 'Katalog' }),
        checks: [
          at(800, 700, style('one', 'Planshetda bitta ustun', '#k1', 'width', '720px')),
          at(1000, 800, style('lg', 'Noutbukda uchtadan', '#k1', 'width', '320px')),
          at(1280, 800, style('xl', 'Monitorda to‘rttadan', '#k1', 'width', '285px')),
        ],
      },
    },
    {
      slug: 'grid-examples',
      title: 'Setka namunalari',
      exercise: {
        title: 'Dashboard sahifasi',
        description: 'Statistika kartalari, markazdagi forma va display.',
        instructions: md(
          '- To‘rtta statistika bloki: telefonda ikkitadan, noutbukda to‘rttadan, pastida bo‘shliq: `col-6 col-lg-3 mb-3`.',
          '- `#qator` — `row justify-content-center`; `#forma` — `col-sm-10 col-md-8 col-lg-5`.',
          '- `#banner` faqat noutbuk va kattada: `d-none d-lg-block alert alert-success`.',
        ),
        expectedBehavior:
          'Telefonda 2×2 statistika, noutbukda bir qator; markazda tor kirish formasi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(EXAMPLES), { title: 'Dashboard' }),
        checks: [
          at(375, 700, style('xs', 'Telefonda ikkitadan', '#s2', 'width', '187.5px')),
          at(1000, 800, style('lg', 'Noutbukda to‘rttadan', '#s2', 'width', '240px')),
          at(1000, 800, style('form', 'Forma 5 ustun', '#forma', 'width', '400px')),
          at(800, 700, style('hide', 'Planshetda banner yashirin', '#banner', 'display', 'none')),
          style('center', 'Forma markazda', '#qator', 'justify-content', 'center', {
            hidden: true,
          }),
        ],
      },
      quiz: quiz('8-modul testi: setka tizimi', [
        q(
          'm8-offset',
          'Bootstrap 4 da `md` ekranda 3 ustun surish klassi?',
          ['`offset-md-3`', '`col-md-offset-3`', '`push-md-3`', '`ml-md-3`'],
          [0],
        ),
        q(
          'm8-order',
          'Bootstrap 3 dagi push/pull o‘rniga Bootstrap 4 da nima?',
          ['`order-*` klasslari', '`float-*`', '`position-*`', '`flex-wrap`'],
          [0],
        ),
        q(
          'm8-md',
          'Bootstrap 4 da `col-md-*` qaysi kenglikdan ishlaydi?',
          ['768px', '992px', '576px', '1200px'],
          [0],
        ),
        q(
          'm8-rowcols',
          '`row-cols-lg-3` nima qiladi?',
          [
            '992px dan boshlab qatordagi har bir `.col` uchdan bir kenglikda',
            'Qatorni 3 marta takrorlaydi',
            'Faqat 3 ta ustun ko‘rsatadi, qolganini yashiradi',
            'Ustunlar orasini 3rem qiladi',
          ],
          [0],
        ),
        q(
          'm8-migrate',
          'Bootstrap 3 dan 4 ga ko‘chirishda qaysi almashtirishlar to‘g‘ri? (bir nechta javob)',
          [
            '`col-xs-6` → `col-6`',
            '`col-md-offset-2` → `offset-md-2`',
            '`hidden-xs` → `d-none d-sm-block`',
            '`col-sm-6` → `col-xs-6`',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s08: Record<string, ProjectFile[]> = {
  'grid-system': bs4(
    slots(SYSTEM, {
      forma: cls('col-md-6 offset-md-3'),
      asosiy: cls('col-md-8 order-md-2'),
      yon: cls('col-md-4 order-md-1'),
      gallery: cls('row no-gutters'),
    }),
    { title: 'Setka' },
  ),
  'grid-stacked': bs4(slots(STACKED, { half: cls('col-sm-6'), third: cls('col-sm-4') }), {
    title: 'Setka',
  }),
  'grid-xsmall': bs4(slots(XSMALL, { auto: cls('col-auto'), fill: cls('col'), c: cls('col-6') }), {
    title: 'Panel',
  }),
  'grid-small': bs4(slots(SMALL, { c: cls('col-6 col-sm-3') }), { title: 'Panel' }),
  'grid-medium': bs4(
    slots(MEDIUM, {
      c: cls('col-sm-6 col-md-4'),
      banner: cls('d-none d-md-block alert alert-info'),
    }),
    {
      title: 'Kurslar',
    },
  ),
  'grid-large': bs4(
    slots(LARGE, {
      c: cls('col-md-6 col-lg-3'),
      row: cls('row justify-content-center'),
      art: cls('col-lg-8'),
    }),
    { title: 'Noutbuk' },
  ),
  'grid-xlarge': bs4(
    slots(XLARGE, { row: cls('row row-cols-1 row-cols-lg-3 row-cols-xl-4'), c: cls('col') }),
    {
      title: 'Katalog',
    },
  ),
  'grid-examples': bs4(
    slots(EXAMPLES, {
      stat: cls('col-6 col-lg-3 mb-3'),
      center: cls('row justify-content-center'),
      form: cls('col-sm-10 col-md-8 col-lg-5'),
      banner: cls('d-none d-lg-block alert alert-success'),
    }),
    { title: 'Dashboard' },
  ),
};
