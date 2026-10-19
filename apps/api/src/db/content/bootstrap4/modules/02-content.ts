import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs4,
  cls,
  has,
  md,
  pic,
  q,
  quiz,
  RGB,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const TYPO = `<div class="container">
  <h1 id="sarlavha"{{display}}>Shahar kutubxonasi</h1>
  <h2>Bo‘limlar{{small}}</h2>
  <ul id="bolimlar"{{ul}}>
    <li{{li}}>Badiiy</li>
    <li{{li}}>Ilmiy</li>
    <li{{li}}>Bolalar</li>
  </ul>
  <blockquote id="iqtibos"{{quote}}>
    <p class="mb-0">Kitob — eng yaxshi do‘st.</p>
    {{footer}}
  </blockquote>
  <p id="eslatma"{{upper}}>Ish vaqti: 9:00–18:00</p>
</div>`;

const COLORS = `<div class="container">
  <h2>Buyurtma holati</h2>
  <p id="ok"{{ok}}><strong>Tayyor:</strong> buyurtmangiz yuborildi.</p>
  <div id="diqqat"{{warn}}><strong>Diqqat:</strong> yetkazib berish 3 kun.</div>
  <div id="footer"{{dark}}>Savollar: +998 71 000 00 00</div>
  <a href="#" id="ochir"{{link}}>Buyurtmani bekor qilish</a>
</div>`;

const TABLE = `<div class="container">
  <h2>Imtihon natijalari</h2>
  {{wrapOpen}}<table id="jadval"{{table}}>
    <thead{{thead}}>
      <tr><th scope="col">Talaba</th><th scope="col">Fan</th><th scope="col">Natija</th></tr>
    </thead>
    <tbody>
      <tr><td>Aziza</td><td>HTML</td><td>O‘tdi</td></tr>
      <tr{{fail}}><td>Sardor</td><td>CSS</td><td>O‘tmadi</td></tr>
      <tr><td>Madina</td><td>Bootstrap</td><td>O‘tdi</td></tr>
    </tbody>
  </table>{{wrapClose}}
</div>`;

const IMAGES = `<div class="container">
  <img id="logo" src="${pic('LOGO', 120, 60, '#563d7c')}" alt="Sayohat klubi logotipi" width="120" height="60"{{logo}}>
  <img id="banner" src="${pic('Toshkent', 1600, 400)}" alt="Toshkent manzarasi"{{banner}}>
  <h3>Muallif</h3>
  <img id="avatar" src="${pic('AK', 120, 120, '#28a745')}" alt="Aziza Karimova" width="120" height="120"{{avatar}}>
  <h3>Kun surati</h3>
  <img id="surat" src="${pic('Chorvoq', 300, 200, '#ffc107')}" alt="Chorvoq suv ombori"{{photo}}>
</div>`;

const JUMBO = `<div id="banner"{{jumbo}}>
  <div{{inner}}>
    <h1{{h1}}>Veb-dizayn maktabi</h1>
    <p{{lead}}>Uch oyda Bootstrap bilan birinchi saytingizni yarating.</p>
    <a class="btn btn-primary btn-lg" href="#" role="button">Kursga yozilish</a>
  </div>
</div>
<div class="container">
  <p>Kurslar har oyning birinchi dushanbasida boshlanadi.</p>
</div>`;

export const m02: ModuleDef = {
  title: 'Matn, ranglar va jadvallar',
  lessons: [
    {
      slug: 'typography',
      title: 'Tipografiya',
      exercise: {
        title: 'Kutubxona sahifasi matni',
        description: 'Display sarlavha, iqtibos va qatorli ro‘yxat.',
        instructions: md(
          '- `#sarlavha` — `display-4`.',
          '- `h2` ga ` <small class="text-muted">uchta yo‘nalish</small>` qo‘shing.',
          '- `#bolimlar` — `list-inline`, har bir band — `list-inline-item`.',
          '- `#iqtibos` — `blockquote`; ichiga `<footer class="blockquote-footer">Xalq maqoli</footer>` qo‘shing.',
          '- `#eslatma` — katta harflarda (`text-uppercase`).',
        ),
        expectedBehavior:
          'Katta yengil sarlavha, kulrang izohli h2, bir qatordagi bo‘limlar, imzoli iqtibos.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(TYPO), { title: 'Kutubxona' }),
        checks: [
          style('display', 'Display sarlavha', '#sarlavha', 'font-size', '56px'),
          style('muted', 'Kulrang `<small>`', 'h2 small', 'color', RGB.bs4.secondary),
          style('inline', 'Ro‘yxat bir qatorda', '#bolimlar > li', 'display', 'inline-block'),
          style('quote', 'Iqtibos `.blockquote`', '#iqtibos', 'font-size', '20px'),
          has('footer', 'Iqtibos imzosi', '#iqtibos > .blockquote-footer'),
        ],
      },
    },
    {
      slug: 'colors',
      title: 'Ranglar',
      exercise: {
        title: 'Buyurtma holati xabarlari',
        description: 'Matn va fon rang klasslari.',
        instructions: md(
          '- `#ok` — yashil matn (`text-success`).',
          '- `#diqqat` — sariq fon va to‘q matn, ichki bo‘shliq bilan: `bg-warning text-dark p-3`.',
          '- `#footer` — to‘q fon, oq matn: `bg-dark text-white p-3`.',
          '- `#ochir` havolasi qizil (`text-danger`).',
        ),
        expectedBehavior: 'Yashil xabar, sariq ogohlantirish, to‘q footer va qizil havola.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(COLORS), { title: 'Buyurtma' }),
        checks: [
          style('ok', 'Yashil matn', '#ok', 'color', RGB.bs4.success),
          style('warn', 'Sariq fon', '#diqqat', 'background-color', RGB.bs4.warning),
          style('warn-text', 'Sariq fonda to‘q matn', '#diqqat', 'color', 'rgb(52, 58, 64)'),
          style('dark', 'To‘q footer', '#footer', 'background-color', RGB.bs4.dark),
          style('link', 'Qizil havola', '#ochir', 'color', RGB.bs4.danger),
        ],
      },
    },
    {
      slug: 'tables',
      title: 'Jadvallar',
      exercise: {
        title: 'Imtihon natijalari',
        description: 'Zebra jadval, to‘q sarlavha va rangli qator.',
        instructions: md(
          '- Jadvalga `table table-striped table-hover` bering.',
          '- `<thead>` — `thead-dark`.',
          '- “O‘tmadi” qatori — `table-danger`.',
          '- Jadvalni `<div class="table-responsive">` ichiga oling.',
        ),
        expectedBehavior: 'To‘q sarlavhali zebra jadval; o‘tmagan talaba qatori qizg‘ish.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(TABLE), { title: 'Natijalar' }),
        checks: [
          style(
            'thead',
            'Sarlavha qatori to‘q',
            '#jadval thead th',
            'background-color',
            RGB.bs4.dark,
          ),
          style(
            'striped',
            '“Zebra” qatorlar',
            '#jadval tbody tr:nth-of-type(1)',
            'background-color',
            'rgba(0, 0, 0, 0.05)',
          ),
          style(
            'danger',
            '“O‘tmadi” qatori qizg‘ish',
            '#jadval tbody tr:nth-of-type(2)',
            'background-color',
            'rgb(245, 198, 203)',
          ),
          has('responsive', 'Moslashuvchan o‘ram', '.table-responsive > #jadval'),
        ],
      },
    },
    {
      slug: 'images',
      title: 'Rasmlar',
      exercise: {
        title: 'Sayohat klubi sahifasi',
        description: 'Rasm shakllari, `.img-fluid` va markazlash.',
        instructions: md(
          '- `#logo` markazda bo‘lsin: `mx-auto d-block`.',
          '- `#banner` konteynerdan chiqmasin: `img-fluid`.',
          '- `#avatar` — doira (`rounded-circle`).',
          '- `#surat` — ramkali (`img-thumbnail`).',
        ),
        expectedBehavior:
          'O‘rtada logo, konteyner kengligidagi banner, dumaloq avatar va ramkali surat.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(IMAGES), { title: 'Sayohat' }),
        checks: [
          at(1280, 800, style('center', 'Logo markazda', '#logo', 'margin-left', '495px')),
          at(
            1280,
            800,
            style('fluid', 'Banner konteyner kengligida', '#banner', 'width', '1110px'),
          ),
          style('circle', 'Avatar doira', '#avatar', 'border-top-left-radius', '50%'),
          style('thumb', 'Surat ramkada', '#surat', 'padding-top', '4px'),
        ],
      },
    },
    {
      slug: 'jumbotron',
      title: 'Jumbotron',
      exercise: {
        title: 'To‘liq kenglikdagi jumbotron',
        description: '`.jumbotron-fluid`, `.display-4` va `.lead`.',
        instructions: md(
          '- `#banner` — `jumbotron jumbotron-fluid`; ichki `<div>` — `container`.',
          '- Sarlavha — `display-4`, paragraf — `lead`.',
        ),
        expectedBehavior:
          'Ekranning butun kengligidagi kulrang blok, ichida markazlashgan katta sarlavha.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(JUMBO), { title: 'Maktab' }),
        checks: [
          style('bg', 'Kulrang jumbotron', '#banner', 'background-color', 'rgb(233, 236, 239)'),
          at(1280, 800, style('fluid', 'To‘liq kenglik', '#banner', 'width', '1280px')),
          at(1280, 800, style('inner', 'Kontent konteynerda', '#banner > div', 'width', '1140px')),
          style('display', 'Sarlavha `display-4`', '#banner h1', 'font-size', '56px'),
          style('lead', 'Paragraf `lead`', '#banner p', 'font-size', '20px', { hidden: true }),
        ],
      },
      quiz: quiz('2-modul testi: matn, ranglar va jadvallar', [
        q(
          'm2-rem',
          'Bootstrap 4 da asosiy shrift o‘lchami qancha?',
          ['16px (1rem)', '14px', '12px', '18px'],
          [0],
        ),
        q(
          'm2-muted',
          'Bootstrap 4 da `<small>` ni kulrang qilish uchun nima qo‘shiladi?',
          ['`.text-muted`', 'Hech narsa — u o‘zi kulrang', '`.small-gray`', '`.lead`'],
          [0],
        ),
        q(
          'm2-warning',
          '`bg-warning` (sariq) fonida qaysi matn rangi to‘g‘ri?',
          ['`text-dark`', '`text-white`', '`text-warning`', '`text-white-50`'],
          [0],
        ),
        q(
          'm2-row',
          'Bootstrap 4 da jadval qatorini yashil qilish klassi?',
          ['`.table-success`', '`.success`', '`.bg-success-row`', '`.row-success`'],
          [0],
        ),
        q(
          'm2-img',
          'Bootstrap 3 dagi `.img-responsive` va `.img-circle` ning Bootstrap 4 dagi muqobili? (bir nechta javob)',
          ['`.img-fluid`', '`.rounded-circle`', '`.img-round`', '`.responsive`'],
          [0, 1],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  typography: bs4(
    slots(TYPO, {
      display: cls('display-4'),
      small: ' <small class="text-muted">uchta yo‘nalish</small>',
      ul: cls('list-inline'),
      li: cls('list-inline-item'),
      quote: cls('blockquote'),
      footer: '<footer class="blockquote-footer">Xalq maqoli</footer>',
      upper: cls('text-uppercase'),
    }),
    { title: 'Kutubxona' },
  ),
  colors: bs4(
    slots(COLORS, {
      ok: cls('text-success'),
      warn: cls('bg-warning text-dark p-3'),
      dark: cls('bg-dark text-white p-3'),
      link: cls('text-danger'),
    }),
    { title: 'Buyurtma' },
  ),
  tables: bs4(
    slots(TABLE, {
      wrapOpen: '<div class="table-responsive">\n  ',
      wrapClose: '\n  </div>',
      table: cls('table table-striped table-hover'),
      thead: cls('thead-dark'),
      fail: cls('table-danger'),
    }),
    { title: 'Natijalar' },
  ),
  images: bs4(
    slots(IMAGES, {
      logo: cls('mx-auto d-block'),
      banner: cls('img-fluid'),
      avatar: cls('rounded-circle'),
      photo: cls('img-thumbnail'),
    }),
    { title: 'Sayohat' },
  ),
  jumbotron: bs4(
    slots(JUMBO, {
      jumbo: cls('jumbotron jumbotron-fluid'),
      inner: cls('container'),
      h1: cls('display-4'),
      lead: cls('lead'),
    }),
    { title: 'Maktab' },
  ),
};
