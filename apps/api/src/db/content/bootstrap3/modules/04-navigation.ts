import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs3,
  click,
  cls,
  has,
  md,
  q,
  quiz,
  RGB,
  slots,
  style,
  text,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const PAGINATION = `<div class="container">
  <h2>Kurslar katalogi</h2>
  <p>2-sahifa: 11–20-kurslar</p>
  <nav aria-label="Katalog sahifalari">
    <ul id="sahifalar"{{ul}}>
      <li{{prev}}><span aria-hidden="true">&laquo;</span></li>
      <li><a href="#">1</a></li>
      <li{{active}}><a href="#">2</a></li>
      <li><a href="#">3</a></li>
      <li><a href="#" aria-label="Keyingi"><span aria-hidden="true">&raquo;</span></a></li>
    </ul>
  </nav>
  <ol id="yol"{{crumb}}>
    <li><a href="#">Bosh sahifa</a></li>
    <li><a href="#">Kurslar</a></li>
    <li{{crumbActive}}>Bootstrap 3</li>
  </ol>
</div>`;

const PAGER = `<div class="container">
  <h2>3-dars: Setka asoslari</h2>
  <p>Setka 12 ta ustundan iborat…</p>
  <nav aria-label="Darslar">
    <ul id="darslar"{{ul}}>
      <li{{prev}}><a href="#">&larr; Oldingi dars</a></li>
      <li{{next}}><a href="#">Keyingi dars &rarr;</a></li>
    </ul>
  </nav>
</div>`;

const LIST = `<div class="container">
  <div class="row">
    <div class="col-sm-4">
      <div id="menyu"{{menu}}>
        <a href="#"{{a1}}>Profil</a>
        <a href="#"{{a2}}>Kurslarim</a>
        <a href="#"{{a3}}>Sertifikatlar</a>
      </div>
    </div>
    <div class="col-sm-8">
      <ul id="xabarlar"{{ul}}>
        <li{{li1}}>To‘lov qabul qilindi</li>
        <li{{li2}}>Yangi topshiriqlar{{badge}}</li>
        <li{{li3}}>Ertangi dars 10:00 da</li>
      </ul>
    </div>
  </div>
</div>`;

const PANELS = `<div class="container">
  <div id="kurs"{{panel}}>
    <div{{head}}>
      <h3{{title}}>Bootstrap 3 kursi</h3>
    </div>
    <div{{body}}>8 modul, 44 dars va har bir darsda amaliy mashq.</div>
    <div{{foot}}>Yangilangan: 2026-yil oktabr</div>
  </div>
</div>`;

const DROPDOWN = `<div class="container">
  <h2>Kurslar</h2>
  <div id="menyu"{{wrap}}>
    <button type="button" id="kursMenyu"{{btn}}>
      Yo‘nalishni tanlang{{caret}}
    </button>
    <ul{{menu}}>
      <li{{h1}}>Frontend</li>
      <li><a href="#">HTML</a></li>
      <li><a href="#">CSS</a></li>
      <li{{divider}}></li>
      <li{{h2}}>Backend</li>
      <li><a href="#">PHP</a></li>
    </ul>
  </div>
</div>`;

const COLLAPSE = `<div class="container">
  <h2>Bootstrap 3 kursi</h2>
  <p>Kurs 44 ta darsdan iborat.</p>
  <button type="button" class="btn btn-info" id="tugma"{{btn}}>Batafsil</button>
  <div id="batafsil"{{box}}>
    <div class="well">Har bir darsdan keyin amaliy mashq va har modul oxirida test bor.</div>
  </div>
</div>`;

const TABS = `<div class="container">
  <h2>Kurs sahifasi</h2>
  <ul id="yorliqlar"{{ul}}>
    <li{{li1}}><a href="#tavsif"{{t}}>Tavsif</a></li>
    <li><a href="#dastur"{{t}}>Dastur</a></li>
    <li><a href="#sharhlar"{{t}}>Sharhlar</a></li>
  </ul>
  <div{{content}}>
    <div id="tavsif"{{pane1}}><p>Kurs Bootstrap 3 bilan tez sahifa yaratishni o‘rgatadi.</p></div>
    <div id="dastur"{{pane}}><p>8 modul, 44 dars.</p></div>
    <div id="sharhlar"{{pane}}><p>“Juda tushunarli!” — Aziza</p></div>
  </div>
</div>`;

const NAVBAR = `<nav id="panel"{{nav}}>
  <div class="container-fluid">
    <div{{header}}>{{toggle}}
      <a href="#"{{brand}}>WEBDIZAYN</a>
    </div>
    <div id="menyu"{{collapse}}>
      <ul{{ul}}>
        <li{{active}}><a href="#">Bosh sahifa</a></li>
        <li><a href="#">Kurslar</a></li>
        <li><a href="#">Aloqa</a></li>
      </ul>
    </div>
  </div>
</nav>
<div class="container">
  <h1>Xush kelibsiz!</h1>
</div>`;

const NAV_TOGGLE = `
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#menyu" aria-expanded="false" aria-controls="menyu">
        <span class="sr-only">Menyuni ochish</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>`;

export const m04: ModuleDef = {
  title: 'Navigatsiya komponentlari',
  lessons: [
    {
      slug: 'pagination',
      title: 'Sahifalash',
      exercise: {
        title: 'Katalog sahifalari',
        description: 'Pagination va breadcrumb.',
        instructions: md(
          '- `#sahifalar` ro‘yxati sahifalash bo‘lsin (`pagination`).',
          '- Hozir 2-sahifa ochiq: uning `<li>` siga `active` bering.',
          '- « belgisi bu yerda bosilmaydi: uning `<li>` siga `disabled` bering.',
          '- `#yol` ro‘yxati yo‘l ko‘rsatkichi bo‘lsin (`breadcrumb`), oxirgi bandi `active`.',
        ),
        expectedBehavior:
          'Raqamli tugmachalar qatori, 2 ko‘k fonda, « kulrang; ostida “Bosh sahifa / Kurslar / Bootstrap 3”.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(PAGINATION), { title: 'Katalog' }),
        checks: [
          style(
            'active',
            '2-sahifa ko‘k fonda',
            '#sahifalar > li:nth-child(3) > a',
            'background-color',
            RGB.bs3.primary,
          ),
          style(
            'disabled',
            '« o‘chirilgan',
            '#sahifalar > li:first-child > span',
            'cursor',
            'not-allowed',
          ),
          style(
            'crumb',
            'Yo‘l ko‘rsatkichi foni',
            '#yol',
            'background-color',
            'rgb(245, 245, 245)',
          ),
          has('crumb-active', 'Oxirgi band `active`', '#yol > li.active:last-child', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'pager',
      title: 'Pager',
      exercise: {
        title: 'Darslar orasida o‘tish',
        description: 'Chetlarga tekislangan pager.',
        instructions: md(
          '- `#darslar` ro‘yxatiga `pager` klassini bering.',
          '- “Oldingi dars” bandi chapda (`previous`), “Keyingi dars” o‘ngda (`next`) tursin.',
        ),
        expectedBehavior: 'Ikki yumaloq havola: chapda “← Oldingi dars”, o‘ngda “Keyingi dars →”.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(PAGER), { title: 'Dars' }),
        checks: [
          style('pill', 'Havolalar yumaloq', '#darslar a', 'border-top-left-radius', '15px'),
          style('prev', '“Oldingi” chapda', '#darslar > li:first-child > a', 'float', 'left'),
          style('next', '“Keyingi” o‘ngda', '#darslar > li:last-child > a', 'float', 'right'),
        ],
      },
    },
    {
      slug: 'list-groups',
      title: 'List group',
      exercise: {
        title: 'Shaxsiy kabinet menyusi',
        description: 'Havolali va rangli list group.',
        instructions: md(
          '- `#menyu` — havolali ro‘yxat: `list-group`, har bir havola `list-group-item`, “Profil” — `active`.',
          '- `#xabarlar` — `list-group`, bandlari `list-group-item`.',
          '- “To‘lov qabul qilindi” yashil bo‘lsin (`list-group-item-success`).',
          '- “Yangi topshiriqlar” bandiga ` <span class="badge">3</span>` qo‘shing.',
        ),
        expectedBehavior: 'Chapda ko‘k “Profil” bilan menyu, o‘ngda yashil xabar va badge’li band.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(LIST), { title: 'Kabinet' }),
        checks: [
          style(
            'active',
            '“Profil” tanlangan',
            '#menyu > a:first-child',
            'background-color',
            RGB.bs3.primary,
          ),
          has(
            'items',
            'Menyu bandlari `list-group-item`',
            '#menyu.list-group > a.list-group-item',
            { min: 3 },
          ),
          style(
            'success',
            'To‘lov xabari yashil',
            '#xabarlar > li:first-child',
            'background-color',
            'rgb(223, 240, 216)',
          ),
          style('badge', 'Badge o‘ng tomonda', '#xabarlar .badge', 'float', 'right'),
        ],
      },
    },
    {
      slug: 'panels',
      title: 'Panellar',
      exercise: {
        title: 'Kurs paneli',
        description: 'Sarlavha, tana va pastki qismli panel.',
        instructions: md(
          '- `#kurs` — ko‘k panel: `panel panel-primary`.',
          '- Ichki bloklar: `panel-heading`, `panel-body`, `panel-footer`.',
          '- `h3` ga `panel-title` bering.',
        ),
        expectedBehavior: 'Ko‘k sarlavhali panel, ichida matn va pastda kulrang qism.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(PANELS), { title: 'Panel' }),
        checks: [
          style(
            'heading',
            'Ko‘k sarlavha qismi',
            '#kurs > div:first-child',
            'background-color',
            RGB.bs3.primary,
          ),
          style(
            'body',
            'Tana 15px ichki bo‘shliqli',
            '#kurs > div:nth-child(2)',
            'padding-top',
            '15px',
          ),
          style(
            'footer',
            'Pastki qism kulrang',
            '#kurs > div:last-child',
            'background-color',
            'rgb(245, 245, 245)',
          ),
          style('title', 'Sarlavha `panel-title`', '#kurs h3', 'font-size', '16px', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'dropdowns',
      title: 'Ochiladigan menyu',
      exercise: {
        title: 'Yo‘nalishlar menyusi',
        description: 'Dropdown, sarlavha va ajratuvchi.',
        instructions: md(
          '- `#menyu` — `dropdown`.',
          '- Tugma: `btn btn-default dropdown-toggle`, `data-toggle="dropdown"`, `aria-haspopup="true"`, `aria-expanded="false"`; matn oxiriga ` <span class="caret"></span>`.',
          '- `<ul>` — `dropdown-menu`; “Frontend” va “Backend” — `dropdown-header`, bo‘sh `<li>` — `divider`.',
        ),
        expectedBehavior: 'Tugma bosilganda guruhlangan menyu ochiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(DROPDOWN), { title: 'Menyu' }),
        checks: [
          style('hidden', 'Menyu boshida yashirin', '#menyu ul', 'display', 'none'),
          after(
            [click('#kursMenyu'), wait(300)],
            style('open', 'Tugma bosilganda menyu ochiladi', '#menyu ul', 'display', 'block', {
              hint: '`data-toggle="dropdown"` va `.dropdown-menu`.',
            }),
          ),
          has('header', 'Guruh sarlavhalari', '.dropdown-menu > .dropdown-header', { min: 2 }),
          has('divider', 'Ajratuvchi chiziq', '.dropdown-menu > .divider'),
        ],
      },
    },
    {
      slug: 'collapse',
      title: 'Collapse',
      exercise: {
        title: '“Batafsil” bloki',
        description: 'Yashirin kontentni tugma bilan ochish.',
        instructions: md(
          '- `#batafsil` boshida yashirin bo‘lsin (`collapse`).',
          '- `#tugma` uni ochsin: `data-toggle="collapse"`, `data-target="#batafsil"`, `aria-controls="batafsil"`, `aria-expanded="false"`.',
        ),
        expectedBehavior:
          'Sahifa ochilganda blok ko‘rinmaydi, “Batafsil” bosilganda silliq ochiladi.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(COLLAPSE), { title: 'Kurs' }),
        checks: [
          style('hidden', 'Blok boshida yashirin', '#batafsil', 'display', 'none'),
          after(
            [click('#tugma'), wait(700)],
            has('open', 'Tugma bosilganda ochiladi', '#batafsil.in'),
          ),
          attr('aria', '`aria-controls` bor', '#tugma', 'aria-controls', 'batafsil', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'tabs-pills',
      title: 'Tabs va pills',
      exercise: {
        title: 'Kurs sahifasi yorliqlari',
        description: 'Dinamik yorliqlar.',
        instructions: md(
          '- `#yorliqlar` — `nav nav-tabs`, birinchi `<li>` — `active`.',
          '- Har bir havolaga `data-toggle="tab"`.',
          '- Kontent bloki — `tab-content`; har bir panel — `tab-pane fade`, birinchisi `tab-pane fade in active`.',
        ),
        expectedBehavior: 'Uchta yorliq; bosilganda tegishli matn chiqadi, qolganlari yashirinadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(TABS), { title: 'Kurs' }),
        checks: [
          style('first', 'Faqat birinchi panel ko‘rinadi', '#dastur', 'display', 'none'),
          after(
            [click('a[href="#dastur"]'), wait(500)],
            style(
              'switch',
              '“Dastur” bosilganda uning paneli ochiladi',
              '#dastur',
              'display',
              'block',
            ),
          ),
          after(
            [click('a[href="#dastur"]'), wait(500)],
            style('hide', 'Eski panel yashirinadi', '#tavsif', 'display', 'none', { hidden: true }),
          ),
          has('tabs', 'Yorliqlar `nav-tabs`', 'ul.nav.nav-tabs'),
        ],
      },
    },
    {
      slug: 'navbar',
      title: 'Navbar',
      exercise: {
        title: 'Sayt navigatsiyasi',
        description: 'Qora, yig‘iladigan navbar.',
        instructions: md(
          '- `#panel` — `navbar navbar-inverse`.',
          '- Ichki `<div>` — `navbar-header`, havola — `navbar-brand`.',
          '- `#menyu` — `collapse navbar-collapse`, ro‘yxat — `nav navbar-nav`, birinchi band — `active`.',
          '- `navbar-header` ichiga brand’dan **oldin** “gamburger” tugmasini qo‘shing (`navbar-toggle`, `data-toggle="collapse"`, `data-target="#menyu"`, ichida `sr-only` matn va uchta `icon-bar`).',
        ),
        expectedBehavior:
          'Kompyuterda qora panel va gorizontal menyu; telefonda menyu ☰ tugmasi ortida.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(NAVBAR), { title: 'Sayt' }),
        checks: [
          style('inverse', 'Qora navbar', '#panel', 'background-color', 'rgb(34, 34, 34)'),
          text('brand', 'Brand havolasi', '.navbar-header > .navbar-brand', 'WEBDIZAYN'),
          at(
            1280,
            800,
            style(
              'row',
              'Kompyuterda menyu gorizontal',
              '#menyu .navbar-nav > li',
              'float',
              'left',
            ),
          ),
          at(
            375,
            700,
            after(
              [click('.navbar-toggle'), wait(700)],
              has('mobile', 'Telefonda ☰ tugmasi menyuni ochadi', '#menyu.in', {
                hint: '`data-target="#menyu"` bormi?',
              }),
            ),
          ),
        ],
      },
      quiz: quiz('4-modul testi: navigatsiya komponentlari', [
        q(
          'm4-active',
          'Pagination’da joriy sahifa qanday belgilanadi?',
          [
            '`<li class="active">`',
            '`<a class="current">`',
            '`<li class="selected">`',
            '`aria-hidden="true"`',
          ],
          [0],
        ),
        q(
          'm4-panel',
          'Panel sarlavhasi qaysi klass bilan yoziladi?',
          ['`.panel-heading`', '`.panel-header`', '`.panel-top`', '`.card-header`'],
          [0],
        ),
        q(
          'm4-open',
          'Dropdown ochilganda Bootstrap 3 ota elementga qaysi klassni qo‘shadi?',
          ['`.open`', '`.show`', '`.in`', '`.active`'],
          [0],
        ),
        q(
          'm4-collapse',
          'Boshidanoq ochiq turgan collapse elementi qaysi klasslarga ega?',
          ['`.collapse.in`', '`.collapse.open`', '`.collapse.show`', '`.collapsed`'],
          [0],
        ),
        q(
          'm4-navbar',
          'Yig‘iladigan navbar uchun nimalar kerak? (bir nechta javob)',
          [
            '`.navbar-toggle` tugmasi `data-toggle="collapse"` bilan',
            'Menyu `.collapse.navbar-collapse` ichida',
            'Tugmadagi `data-target` menyu id’siga ishora qiladi',
            '`.navbar-fixed-top` klassi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  pagination: bs3(
    slots(PAGINATION, {
      ul: cls('pagination'),
      prev: cls('disabled'),
      active: cls('active'),
      crumb: cls('breadcrumb'),
      crumbActive: cls('active'),
    }),
    { title: 'Katalog' },
  ),
  pager: bs3(slots(PAGER, { ul: cls('pager'), prev: cls('previous'), next: cls('next') }), {
    title: 'Dars',
  }),
  'list-groups': bs3(
    slots(LIST, {
      menu: cls('list-group'),
      a1: cls('list-group-item active'),
      a2: cls('list-group-item'),
      a3: cls('list-group-item'),
      ul: cls('list-group'),
      li1: cls('list-group-item list-group-item-success'),
      li2: cls('list-group-item'),
      li3: cls('list-group-item'),
      badge: ' <span class="badge">3</span>',
    }),
    { title: 'Kabinet' },
  ),
  panels: bs3(
    slots(PANELS, {
      panel: cls('panel panel-primary'),
      head: cls('panel-heading'),
      title: cls('panel-title'),
      body: cls('panel-body'),
      foot: cls('panel-footer'),
    }),
    { title: 'Panel' },
  ),
  dropdowns: bs3(
    slots(DROPDOWN, {
      wrap: cls('dropdown'),
      btn: `${cls('btn btn-default dropdown-toggle')} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"`,
      caret: ' <span class="caret"></span>',
      menu: `${cls('dropdown-menu')} aria-labelledby="kursMenyu"`,
      h1: cls('dropdown-header'),
      h2: cls('dropdown-header'),
      divider: ` role="separator"${cls('divider')}`,
    }),
    { title: 'Menyu' },
  ),
  collapse: bs3(
    slots(COLLAPSE, {
      btn: ' data-toggle="collapse" data-target="#batafsil" aria-controls="batafsil" aria-expanded="false"',
      box: cls('collapse'),
    }),
    { title: 'Kurs' },
  ),
  'tabs-pills': bs3(
    slots(TABS, {
      ul: cls('nav nav-tabs'),
      li1: cls('active'),
      t: ' data-toggle="tab"',
      content: cls('tab-content'),
      pane1: cls('tab-pane fade in active'),
      pane: cls('tab-pane fade'),
    }),
    { title: 'Kurs' },
  ),
  navbar: bs3(
    slots(NAVBAR, {
      nav: cls('navbar navbar-inverse'),
      header: cls('navbar-header'),
      toggle: NAV_TOGGLE,
      brand: cls('navbar-brand'),
      collapse: cls('collapse navbar-collapse'),
      ul: cls('nav navbar-nav'),
      active: cls('active'),
    }),
    { title: 'Sayt' },
  ),
};
