import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  bs3,
  click,
  has,
  md,
  pic,
  q,
  quiz,
  style,
  text,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const TYPO = (s: {
  h1: string;
  lead: string;
  ul: string;
  warn: string;
  small: string;
}) => `<div class="container">
  <h1${s.h1}>Shahar kutubxonasi${s.small}</h1>
  <p${s.lead}>Kutubxonamizda 40 mingdan ortiq kitob va jurnal bor.</p>
  <p>Ish vaqti: dushanba–shanba, 9:00 dan 18:00 gacha.</p>
  <h3>Bo‘limlar</h3>
  <ul${s.ul}>
    <li>Badiiy adabiyot</li>
    <li>Ilmiy-ommabop</li>
    <li>Bolalar bo‘limi</li>
  </ul>
  <p${s.warn}>Diqqat: kitoblarni 14 kun ichida qaytaring.</p>
</div>`;

const TABLE = (s: { table: string; wrapOpen: string; wrapClose: string; fail: string }) =>
  `<div class="container">
  <h2>Imtihon natijalari</h2>
  ${s.wrapOpen}<table${s.table}>
    <thead>
      <tr><th>Talaba</th><th>Fan</th><th>Ball</th><th>Natija</th></tr>
    </thead>
    <tbody>
      <tr><td>Aziza</td><td>HTML</td><td>92</td><td>O‘tdi</td></tr>
      <tr><td>Bekzod</td><td>CSS</td><td>85</td><td>O‘tdi</td></tr>
      <tr${s.fail}><td>Sardor</td><td>JavaScript</td><td>48</td><td>O‘tmadi</td></tr>
      <tr><td>Madina</td><td>Bootstrap</td><td>77</td><td>O‘tdi</td></tr>
    </tbody>
  </table>${s.wrapClose}
</div>`;

const IMAGES = (s: { banner: string; avatar: string; photo: string }) => `<div class="container">
  <h2>Sayohat albomi</h2>
  <img id="banner" src="${pic('Toshkent', 1600, 400)}" alt="Toshkent manzarasi"${s.banner}>
  <h3>Muallif</h3>
  <img id="avatar" src="${pic('AK', 120, 120, '#5cb85c')}" alt="Aziza Karimova" width="120" height="120"${s.avatar}>
  <h3>Kun surati</h3>
  <img id="surat" src="${pic('Chorvoq', 300, 200, '#f0ad4e')}" alt="Chorvoq suv ombori"${s.photo}>
</div>`;

const JUMBO = (s: { jumbo: string; header: string }) => `<div class="container">
  <div id="banner"${s.jumbo}>
    <h1>Veb-dizayn maktabi</h1>
    <p>Uch oyda HTML, CSS va Bootstrap bilan birinchi saytingizni yarating.</p>
    <p><a class="btn btn-primary btn-lg" href="#">Kursga yozilish</a></p>
  </div>
  <div id="sarlavha"${s.header}>
    <h2>Yaqin kurslar <small>kuzgi mavsum</small></h2>
  </div>
  <p>Kurslar har oyning birinchi dushanbasida boshlanadi.</p>
</div>`;

const WELLS = (s: { a: string; b: string }) => `<div class="container">
  <div class="row">
    <div class="col-sm-8">
      <h2>Dars rejasi</h2>
      <p>Bugun setka tizimi va tipografiyani takrorlaymiz.</p>
      <div id="vazifa"${s.a}>Uy vazifasi: o‘z rezyume sahifangizni Bootstrap bilan yarating.</div>
    </div>
    <div class="col-sm-4">
      <div id="eslatma"${s.b}><strong>Eslatma:</strong> keyingi dars payshanba kuni.</div>
    </div>
  </div>
</div>`;

const ALERTS = (s: { ok: string; danger: string; info: string; close: string }) =>
  `<div class="container">
  <h2>Xabarlar</h2>
  <div id="saqlandi"${s.ok}><strong>Tayyor!</strong> Profilingiz saqlandi.</div>
  <div id="xato"${s.danger}><strong>Xato!</strong> Parol kamida 8 ta belgidan iborat bo‘lishi kerak.</div>
  <div id="yangilik"${s.info}>${s.close}
    Yangi kurslar e’lon qilindi.
  </div>
</div>`;

export const m02: ModuleDef = {
  title: 'Matn, jadval va xabarlar',
  lessons: [
    {
      slug: 'typography',
      title: 'Tipografiya',
      exercise: {
        title: 'Kutubxona sahifasi matni',
        description: 'Tipografiya klasslari bilan matnni bezash.',
        instructions: md(
          '- Sarlavhani markazga oling (`text-center`) va unga `<small>Yunusobod filiali</small>` qo‘shing.',
          '- Birinchi paragraf kirish matni bo‘lsin (`lead`).',
          '- Bo‘limlar ro‘yxatidan nuqtalarni olib tashlang (`list-unstyled`).',
          '- “Diqqat” paragrafi qizil bo‘lsin (`text-danger`).',
        ),
        expectedBehavior:
          'Markazdagi sarlavha ostida kulrang kichik matn, katta kirish paragrafi, nuqtasiz ro‘yxat va qizil ogohlantirish.',
        difficulty: 'EASY',
        starterFiles: bs3(TYPO({ h1: '', lead: '', ul: '', warn: '', small: '' }), {
          title: 'Kutubxona',
        }),
        checks: [
          style('center', 'Sarlavha markazda', 'h1', 'text-align', 'center'),
          text('small', 'Sarlavhada `<small>` matn', 'h1 small', 'Yunusobod'),
          style(
            'lead',
            'Kirish paragrafi `.lead`',
            '.container > p:first-of-type',
            'font-size',
            '21px',
            {
              hint: 'Keng ekranda `.lead` shrifti 21px.',
            },
          ),
          style('list', 'Ro‘yxat nuqtasiz', 'ul', 'list-style-type', 'none'),
          style(
            'danger',
            'Ogohlantirish qizil',
            '.container > p:last-child',
            'color',
            'rgb(169, 68, 66)',
          ),
        ],
      },
    },
    {
      slug: 'tables',
      title: 'Jadvallar',
      exercise: {
        title: 'Imtihon natijalari jadvali',
        description: 'Jadval klasslari, rangli qator va moslashuvchanlik.',
        instructions: md(
          '- Jadvalga `table`, `table-striped`, `table-bordered` va `table-hover` klasslarini bering.',
          '- “O‘tmadi” qatori qizil bo‘lsin (`danger`).',
          '- Jadvalni `<div class="table-responsive">` ichiga oling.',
        ),
        expectedBehavior:
          'Chegarali, “zebra” qatorli jadval; o‘tmagan talaba qatori qizil; telefonda jadval o‘zi aylanadi.',
        difficulty: 'EASY',
        starterFiles: bs3(TABLE({ table: '', wrapOpen: '', wrapClose: '', fail: '' }), {
          title: 'Natijalar',
        }),
        checks: [
          has(
            'classes',
            'Jadval klasslari',
            'table.table.table-striped.table-bordered.table-hover',
          ),
          style(
            'fail',
            '“O‘tmadi” qatori qizil',
            'tbody tr:nth-of-type(3) td',
            'background-color',
            'rgb(242, 222, 222)',
            {
              hint: '“O‘tmadi” qatoriga `class="danger"` bering.',
            },
          ),
          style(
            'zebra',
            '“Zebra” qatorlar',
            'tbody tr:nth-of-type(1)',
            'background-color',
            'rgb(249, 249, 249)',
            {
              hidden: true,
            },
          ),
          has('responsive', 'Jadval `.table-responsive` ichida', '.table-responsive > table'),
        ],
      },
    },
    {
      slug: 'images',
      title: 'Rasmlar',
      exercise: {
        title: 'Sayohat albomi',
        description: 'Rasm shakllari va moslashuvchan rasm.',
        instructions: md(
          '- Katta `#banner` rasmi konteynerdan chiqib ketmasin: `img-responsive`.',
          '- Muallif rasmi (`#avatar`) doira bo‘lsin: `img-circle`.',
          '- `#surat` ramkali bo‘lsin: `img-thumbnail`.',
        ),
        expectedBehavior: 'Banner konteyner kengligida, avatar dumaloq, kun surati oq ramkada.',
        difficulty: 'EASY',
        starterFiles: bs3(IMAGES({ banner: '', avatar: '', photo: '' }), { title: 'Albom' }),
        checks: [
          at(
            1280,
            800,
            style('banner', 'Banner konteyner kengligida', '#banner', 'width', '1140px', {
              hint: '`img-responsive` — `max-width: 100%`.',
            }),
          ),
          style('circle', 'Avatar doira', '#avatar', 'border-top-left-radius', '50%'),
          style('thumb', 'Surat ramkada', '#surat', 'padding-top', '4px'),
        ],
      },
    },
    {
      slug: 'jumbotron',
      title: 'Jumbotron va sahifa sarlavhasi',
      exercise: {
        title: 'Maktab bosh sahifasi',
        description: 'Jumbotron va page header.',
        instructions: md(
          '- `#banner` blokini jumbotronga aylantiring.',
          '- `#sarlavha` blokiga `page-header` klassini bering.',
        ),
        expectedBehavior:
          'Yuqorida kulrang katta blok, pastda chiziq bilan ajratilgan bo‘lim sarlavhasi.',
        difficulty: 'EASY',
        starterFiles: bs3(JUMBO({ jumbo: '', header: '' }), { title: 'Maktab' }),
        checks: [
          style(
            'jumbo',
            'Jumbotron foni kulrang',
            '#banner',
            'background-color',
            'rgb(238, 238, 238)',
          ),
          at(
            1280,
            800,
            style('pad', 'Jumbotron keng padding’li', '#banner', 'padding-top', '48px', {
              hidden: true,
            }),
          ),
          style(
            'header',
            'Bo‘lim sarlavhasi ostida chiziq',
            '#sarlavha',
            'border-bottom-width',
            '1px',
          ),
        ],
      },
    },
    {
      slug: 'wells',
      title: 'Well',
      exercise: {
        title: 'Dars rejasi va eslatma',
        description: 'Turli o‘lchamdagi well’lar.',
        instructions: md(
          '- Uy vazifasi (`#vazifa`) katta well bo‘lsin: `well well-lg`.',
          '- Eslatma (`#eslatma`) kichik well bo‘lsin: `well well-sm`.',
        ),
        expectedBehavior: 'Ikkala blok kulrang qutida, uy vazifasi kattaroq bo‘shliq bilan.',
        difficulty: 'EASY',
        starterFiles: bs3(WELLS({ a: '', b: '' }), { title: 'Dars rejasi' }),
        checks: [
          style(
            'bg',
            'Uy vazifasi kulrang qutida',
            '#vazifa',
            'background-color',
            'rgb(245, 245, 245)',
          ),
          style('lg', 'Uy vazifasi — `well-lg`', '#vazifa', 'padding-top', '24px'),
          style('sm', 'Eslatma — `well-sm`', '#eslatma', 'padding-top', '9px'),
        ],
      },
    },
    {
      slug: 'alerts',
      title: 'Ogohlantirish xabarlari',
      exercise: {
        title: 'Uchta xabar',
        description: 'Rangli va yopiladigan alert.',
        instructions: md(
          '- `#saqlandi` — yashil xabar (`alert alert-success`).',
          '- `#xato` — qizil xabar (`alert alert-danger`).',
          '- `#yangilik` — yopiladigan moviy xabar: `alert alert-info alert-dismissible`, ichida birinchi bo‘lib',
          '  `<button type="button" class="close" data-dismiss="alert" aria-label="Yopish">&times;</button>`.',
          '',
          'Tugma bosilganda `#yangilik` sahifadan yo‘qolishi kerak.',
        ),
        expectedBehavior:
          'Yashil, qizil va moviy xabarlar; moviy xabardagi × bosilsa, u yo‘qoladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(ALERTS({ ok: '', danger: '', info: '', close: '' }), {
          title: 'Xabarlar',
        }),
        checks: [
          style('success', 'Yashil xabar', '#saqlandi', 'background-color', 'rgb(223, 240, 216)'),
          style('danger', 'Qizil xabar', '#xato', 'background-color', 'rgb(242, 222, 222)'),
          style('info', 'Moviy xabar', '#yangilik', 'background-color', 'rgb(217, 237, 247)'),
          after(
            [click('#yangilik .close'), wait(500)],
            has('dismiss', '× bosilganda xabar yopiladi', '#yangilik', {
              min: 0,
              max: 0,
              hint: 'Tugmada `data-dismiss="alert"` bormi? jQuery va bootstrap.min.js ulanganmi?',
            }),
          ),
        ],
      },
      quiz: quiz('2-modul testi: matn, jadval va xabarlar', [
        q(
          'm2-lead',
          'Kirish paragrafini kattaroq shriftda ko‘rsatadigan klass qaysi?',
          ['`.lead`', '`.intro`', '`.text-lg`', '`.h1`'],
          [0],
        ),
        q(
          'm2-striped',
          'Jadval qatorlarini navbatma-navbat bo‘yaydigan klass qaysi?',
          ['`.table-striped`', '`.table-hover`', '`.table-bordered`', '`.table-zebra`'],
          [0],
        ),
        q(
          'm2-responsive',
          '`.img-responsive` klassi qaysi uslublarni beradi?',
          [
            '`display: block; max-width: 100%; height: auto;`',
            '`width: 100vw;`',
            '`border-radius: 50%;`',
            '`float: left;`',
          ],
          [0],
        ),
        q(
          'm2-full',
          'Jumbotron ekranning butun kengligini egallashi uchun nima qilinadi?',
          [
            'Jumbotron konteynerdan tashqarida, `.container` esa uning ichida bo‘ladi',
            '`.jumbotron-full` klassi qo‘shiladi',
            'Jumbotronga `width: 100%` yoziladi',
            'Buning iloji yo‘q',
          ],
          [0],
        ),
        q(
          'm2-dismiss',
          'Yopiladigan alert uchun nimalar kerak? (bir nechta javob)',
          [
            '`.alert-dismissible` klassi',
            '`data-dismiss="alert"` atributli tugma',
            'jQuery va bootstrap.min.js',
            '`.alert-close` klassi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  typography: bs3(
    TYPO({
      h1: ' class="text-center"',
      small: ' <small>Yunusobod filiali</small>',
      lead: ' class="lead"',
      ul: ' class="list-unstyled"',
      warn: ' class="text-danger"',
    }),
    { title: 'Kutubxona' },
  ),
  tables: bs3(
    TABLE({
      table: ' class="table table-striped table-bordered table-hover"',
      wrapOpen: '<div class="table-responsive">\n  ',
      wrapClose: '\n  </div>',
      fail: ' class="danger"',
    }),
    { title: 'Natijalar' },
  ),
  images: bs3(
    IMAGES({
      banner: ' class="img-responsive"',
      avatar: ' class="img-circle"',
      photo: ' class="img-thumbnail"',
    }),
    { title: 'Albom' },
  ),
  jumbotron: bs3(JUMBO({ jumbo: ' class="jumbotron"', header: ' class="page-header"' }), {
    title: 'Maktab',
  }),
  wells: bs3(WELLS({ a: ' class="well well-lg"', b: ' class="well well-sm"' }), {
    title: 'Dars rejasi',
  }),
  alerts: bs3(
    ALERTS({
      ok: ' class="alert alert-success"',
      danger: ' class="alert alert-danger"',
      info: ' class="alert alert-info alert-dismissible"',
      close:
        '\n    <button type="button" class="close" data-dismiss="alert" aria-label="Yopish">&times;</button>',
    }),
    { title: 'Xabarlar' },
  ),
};
