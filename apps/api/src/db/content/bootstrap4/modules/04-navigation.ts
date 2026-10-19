import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  bs4,
  click,
  cls,
  has,
  md,
  pic,
  q,
  quiz,
  RGB,
  slots,
  style,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const PAGINATION = `<div class="container">
  <h2>Kurslar katalogi</h2>
  <nav aria-label="breadcrumb">
    <ol id="yol"{{crumb}}>
      <li{{ci}}><a href="#">Bosh sahifa</a></li>
      <li{{ci}}><a href="#">Kurslar</a></li>
      <li{{cActive}}>2-sahifa</li>
    </ol>
  </nav>
  <nav aria-label="Katalog sahifalari">
    <ul id="sahifalar"{{ul}}>
      <li{{disabled}}><a{{link}} href="#" tabindex="-1" aria-disabled="true">Oldingi</a></li>
      <li{{item}}><a{{link}} href="#">1</a></li>
      <li{{active}}><a{{link}} href="#">2</a></li>
      <li{{item}}><a{{link}} href="#">3</a></li>
      <li{{item}}><a{{link}} href="#">Keyingi</a></li>
    </ul>
  </nav>
</div>`;

const LIST = `<div class="container">
  <div class="row">
    <div class="col-md-4">
      <div id="menyu"{{lg}}>
        <a href="#"{{a1}}>Profil</a>
        <a href="#"{{a}}>Kurslarim</a>
        <a href="#"{{a}}>Sertifikatlar</a>
      </div>
    </div>
    <div class="col-md-8">
      <ul id="davr"{{h}}>
        <li{{li}}>Kun</li>
        <li{{li}}>Hafta</li>
        <li{{li}}>Oy</li>
      </ul>
      <ul class="list-group mt-3">
        <li id="tolov"{{ok}}>To‘lov qabul qilindi</li>
      </ul>
    </div>
  </div>
</div>`;

const card = (n: number, name: string, color: string) => `<div class="col-md-4 mb-3">
      <div id="c${n}"{{card}}>
        <img src="${pic(name, 400, 200, color)}" alt="${name} kursi"{{img}}>
        <div{{body}}>
          <h5{{title}}>${name}</h5>
          <p{{text}}>${name} bo‘yicha amaliy kurs.</p>
          <a href="#" class="btn btn-primary">Kursga o‘tish</a>
        </div>
        <div{{footer}}>Yangilangan: oktabr</div>
      </div>
    </div>`;

const CARDS = `<div class="container">
  <h2>Kurslar</h2>
  <div class="row">
    ${card(1, 'HTML', '#e34c26')}
    ${card(2, 'CSS', '#264de4')}
    ${card(3, 'Bootstrap', '#563d7c')}
  </div>
</div>`;

const DROPDOWN = `<div class="container">
  <h2>Kurslar</h2>
  <div id="menyu"{{wrap}}>
    <button type="button" id="kursMenyu"{{btn}}>Yo‘nalishni tanlang</button>
    <div id="royxat"{{menu}}>
      <h6{{header}}>Frontend</h6>
      <a href="#"{{item}}>HTML</a>
      <a href="#"{{item}}>CSS</a>
      <div{{divider}}></div>
      <h6{{header}}>Backend</h6>
      <a href="#"{{item}}>PHP</a>
    </div>
  </div>
</div>`;

const section = (n: number, q: string, a: string) => `<div class="card">
      <div class="card-header" id="sarlavha${n}">
        <h2 class="mb-0">
          <button class="btn btn-link btn-block text-left" type="button" id="tugma${n}"{{t${n}}}>${q}</button>
        </h2>
      </div>
      <div id="javob${n}"{{c${n}}} aria-labelledby="sarlavha${n}">
        <div class="card-body">${a}</div>
      </div>
    </div>`;

const COLLAPSE = `<div class="container">
  <h2>Ko‘p so‘raladigan savollar</h2>
  <div class="accordion" id="faq">
    ${section(1, 'Kurs qancha davom etadi?', 'Uch oy, haftasiga uch dars.')}
    ${section(2, 'Sertifikat beriladimi?', 'Ha, yakuniy loyihadan keyin.')}
  </div>
</div>`;

const NAVS = `<div class="container">
  <h2>Kurs sahifasi</h2>
  <ul id="yorliqlar"{{ul}}>
    <li{{li}}><a href="#tavsif"{{a1}}>Tavsif</a></li>
    <li{{li}}><a href="#dastur"{{a}}>Dastur</a></li>
    <li{{li}}><a href="#sharhlar"{{a}}>Sharhlar</a></li>
  </ul>
  <div{{content}}>
    <div id="tavsif"{{p1}}><p>Bootstrap 4 bilan zamonaviy sahifalar.</p></div>
    <div id="dastur"{{p}}><p>8 modul, 45 dars.</p></div>
    <div id="sharhlar"{{p}}><p>“Juda foydali!” — Aziza</p></div>
  </div>
</div>`;

const NAVBAR = `<nav id="panel"{{nav}}>
  <a href="#"{{brand}}>WEBDIZAYN</a>{{toggler}}
  <div id="menyu"{{collapse}}>
    <ul{{ul}}>
      <li{{li}}><a href="#"{{link}}>Bosh sahifa</a></li>
      <li{{li}}><a href="#"{{link}}>Kurslar</a></li>
      <li{{li}}><a href="#"{{link}}>Aloqa</a></li>
    </ul>
  </div>
</nav>
<div class="container">
  <h1>Xush kelibsiz!</h1>
</div>`;

const TOGGLER = `
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#menyu" aria-controls="menyu" aria-expanded="false" aria-label="Menyuni ochish">
    <span class="navbar-toggler-icon"></span>
  </button>`;

export const m04: ModuleDef = {
  title: 'Navigatsiya va kartalar',
  lessons: [
    {
      slug: 'pagination',
      title: 'Sahifalash va breadcrumb',
      exercise: {
        title: 'Katalog sahifalari',
        description: '`.page-item`, `.page-link` va breadcrumb.',
        instructions: md(
          '- `#yol` — `breadcrumb`; bandlar — `breadcrumb-item`, oxirgisi `breadcrumb-item active` va `aria-current="page"`.',
          '- `#sahifalar` — `pagination justify-content-center`.',
          '- Har bir `<li>` — `page-item`, har bir `<a>` — `page-link`.',
          '- “Oldingi” bandi — `page-item disabled`, 2-sahifa — `page-item active`.',
        ),
        expectedBehavior:
          'Kulrang yo‘l ko‘rsatkichi va markazdagi sahifalash, 2 ko‘k fonda, “Oldingi” o‘chirilgan.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(PAGINATION), { title: 'Katalog' }),
        checks: [
          style('crumb', 'Breadcrumb foni', '#yol', 'background-color', 'rgb(233, 236, 239)'),
          style('center', 'Sahifalash markazda', '#sahifalar', 'justify-content', 'center'),
          style(
            'active',
            '2-sahifa ko‘k',
            '#sahifalar > li:nth-child(3) > a',
            'background-color',
            RGB.bs4.primary,
          ),
          style(
            'disabled',
            '“Oldingi” bosilmaydi',
            '#sahifalar > li:first-child > a',
            'pointer-events',
            'none',
          ),
          has(
            'aria',
            'Oxirgi bandda `aria-current`',
            '#yol > .breadcrumb-item.active[aria-current="page"]',
            {
              hidden: true,
            },
          ),
        ],
      },
    },
    {
      slug: 'list-groups',
      title: 'List group',
      exercise: {
        title: 'Kabinet menyusi',
        description: 'Bosiladigan, gorizontal va rangli list group.',
        instructions: md(
          '- `#menyu` — `list-group`; havolalar — `list-group-item list-group-item-action`, “Profil” — qo‘shimcha `active`.',
          '- `#davr` — gorizontal: `list-group list-group-horizontal`, bandlari `list-group-item`.',
          '- `#tolov` — `list-group-item list-group-item-success`.',
        ),
        expectedBehavior:
          'Chapda ko‘k “Profil”li menyu, o‘ngda bir qatordagi Kun/Hafta/Oy va yashil xabar.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(LIST), { title: 'Kabinet' }),
        checks: [
          style(
            'active',
            '“Profil” tanlangan',
            '#menyu > a:first-child',
            'background-color',
            RGB.bs4.primary,
          ),
          style(
            'action',
            'Qolgan bandlar `-action`',
            '#menyu > a:nth-child(2)',
            'color',
            'rgb(73, 80, 87)',
          ),
          style('horizontal', 'Gorizontal ro‘yxat', '#davr', 'flex-direction', 'row'),
          style('success', 'Yashil xabar', '#tolov', 'background-color', 'rgb(195, 230, 203)'),
        ],
      },
    },
    {
      slug: 'cards',
      title: 'Card',
      exercise: {
        title: 'Kurs kartalari',
        description: 'Rasm, tana va pastki qismli card’lar setkada.',
        instructions: md(
          'Uchta kurs blokining har birida:',
          '',
          '- tashqi `<div>` — `card h-100`; rasm — `card-img-top`;',
          '- tana — `card-body`, sarlavha — `card-title`, matn — `card-text`;',
          '- pastki qism — `card-footer text-muted`.',
        ),
        expectedBehavior:
          'Uchta bir xil balandlikdagi kurs kartasi: tepada rasm, o‘rtada matn va tugma, pastda kulrang qism.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(CARDS), { title: 'Kurslar' }),
        checks: [
          style('border', 'Card chegarasi yumaloq', '#c1', 'border-top-left-radius', '4px'),
          style('body', 'Card tanasi padding’li', '#c2 > div:nth-child(2)', 'padding-top', '20px'),
          style(
            'footer',
            'Pastki qism kulrang',
            '#c3 > div:last-child',
            'color',
            RGB.bs4.secondary,
          ),
          at(1280, 800, style('grid', 'Card ustunni to‘ldiradi', '#c2', 'width', '350px')),
          has('img', 'Rasm `card-img-top`', '.card > img.card-img-top', { min: 3 }),
        ],
      },
    },
    {
      slug: 'dropdowns',
      title: 'Dropdown',
      exercise: {
        title: 'Yo‘nalishlar menyusi',
        description: '`.dropdown-item`, sarlavha va ajratuvchi.',
        instructions: md(
          '- `#menyu` — `dropdown`.',
          '- Tugma — `btn btn-secondary dropdown-toggle`, `data-toggle="dropdown"`, `aria-haspopup="true"`, `aria-expanded="false"`.',
          '- `#royxat` — `dropdown-menu`; havolalar — `dropdown-item`; sarlavhalar — `dropdown-header`; bo‘sh `<div>` — `dropdown-divider`.',
        ),
        expectedBehavior: 'Tugma bosilganda guruhlangan menyu ochiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(DROPDOWN), { title: 'Menyu' }),
        checks: [
          style('hidden', 'Menyu boshida yashirin', '#royxat', 'display', 'none'),
          after(
            [click('#kursMenyu'), wait(300)],
            has('open', 'Bosilganda menyu ochiladi (`.show`)', '#royxat.dropdown-menu.show'),
          ),
          has('items', 'Bandlar `dropdown-item`', '#royxat > a.dropdown-item', { min: 3 }),
          has(
            'divider',
            'Ajratuvchi va sarlavhalar',
            '#royxat > .dropdown-divider ~ .dropdown-header',
          ),
        ],
      },
    },
    {
      slug: 'collapse',
      title: 'Collapse va akkordeon',
      exercise: {
        title: 'Savol-javob akkordeoni',
        description: 'Bitta bo‘limi ochiq turadigan akkordeon.',
        instructions: md(
          '- Har bir tugmaga `data-toggle="collapse"`, `data-target="#javobN"`, `aria-controls="javobN"` bering.',
          '- `#javob1` — `collapse show`, `#javob2` — `collapse`; ikkalasiga `data-parent="#faq"`.',
        ),
        expectedBehavior:
          'Birinchi javob ochiq; ikkinchi savol bosilganda u ochilib, birinchisi yopiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(COLLAPSE), { title: 'FAQ' }),
        checks: [
          style('closed', 'Ikkinchi javob boshida yopiq', '#javob2', 'display', 'none'),
          after(
            [click('#tugma2'), wait(700)],
            has('open', 'Ikkinchi savol javobni ochadi', '#javob2.show'),
          ),
          after(
            [click('#tugma2'), wait(700)],
            has('parent', 'Birinchi javob yopiladi', '#javob1.show', { min: 0, max: 0 }),
          ),
        ],
      },
    },
    {
      slug: 'navs',
      title: 'Navs va yorliqlar',
      exercise: {
        title: 'Kurs sahifasi yorliqlari',
        description: 'Pills va dinamik yorliqlar.',
        instructions: md(
          '- `#yorliqlar` — `nav nav-pills`; `<li>` — `nav-item`; havolalar — `nav-link` va `data-toggle="pill"`; birinchisi qo‘shimcha `active`.',
          '- Kontent — `tab-content`; panellar — `tab-pane fade`, birinchisi `tab-pane fade show active`.',
        ),
        expectedBehavior: 'Uchta yumaloq yorliq; bosilganda tegishli matn ochiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(NAVS), { title: 'Kurs' }),
        checks: [
          style(
            'active',
            'Faol yorliq ko‘k',
            'a[href="#tavsif"]',
            'background-color',
            RGB.bs4.primary,
          ),
          style('hidden', 'Boshqa panellar yashirin', '#dastur', 'display', 'none'),
          after(
            [click('a[href="#dastur"]'), wait(500)],
            style('switch', '“Dastur” bosilganda paneli ochiladi', '#dastur', 'display', 'block'),
          ),
          after(
            [click('a[href="#dastur"]'), wait(500)],
            style('hide', 'Eski panel yashirinadi', '#tavsif', 'display', 'none', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'navbar',
      title: 'Navbar',
      exercise: {
        title: 'Sayt navigatsiyasi',
        description: 'To‘q, `md` dan ochiladigan navbar.',
        instructions: md(
          '- `#panel` — `navbar navbar-expand-md navbar-dark bg-dark`; havola — `navbar-brand`.',
          '- Brand’dan keyin ☰ tugmasini qo‘shing (`navbar-toggler`, `data-toggle="collapse"`, `data-target="#menyu"`, ichida `navbar-toggler-icon`).',
          '- `#menyu` — `collapse navbar-collapse`; ro‘yxat — `navbar-nav ml-auto`; `<li>` — `nav-item`; havolalar — `nav-link`.',
        ),
        expectedBehavior:
          'Kompyuterda to‘q panel va o‘ng tomonda menyu; telefonda menyu ☰ tugmasi ortida.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(NAVBAR), { title: 'Sayt' }),
        checks: [
          style('dark', 'To‘q navbar', '#panel', 'background-color', RGB.bs4.dark),
          at(1280, 800, style('expand', 'Kompyuterda menyu ochiq', '#menyu', 'display', 'flex')),
          at(1280, 800, style('row', 'Menyu gorizontal', '#menyu > ul', 'flex-direction', 'row')),
          at(
            375,
            700,
            after(
              [click('.navbar-toggler'), wait(700)],
              has('mobile', 'Telefonda ☰ menyuni ochadi', '#menyu.show'),
            ),
          ),
          style(
            'link',
            'Havolalar och rangda',
            '#menyu .nav-link',
            'color',
            'rgba(255, 255, 255, 0.5)',
            {
              hidden: true,
            },
          ),
        ],
      },
      quiz: quiz('4-modul testi: navigatsiya va kartalar', [
        q(
          'm4-page',
          'Bootstrap 4 da sahifalash bandlarining klasslari?',
          [
            '`li.page-item` va `a.page-link`',
            '`li.pagination-item`',
            'Klass shart emas',
            '`a.page`',
          ],
          [0],
        ),
        q(
          'm4-card',
          'Bootstrap 3 dagi `.panel` o‘rniga Bootstrap 4 da qaysi komponent?',
          ['`.card`', '`.box`', '`.panel` o‘zgarmagan', '`.well`'],
          [0],
        ),
        q(
          'm4-show',
          'Bootstrap 4 da ochilgan collapse elementi qaysi klassga ega?',
          ['`.show`', '`.in`', '`.open`', '`.active`'],
          [0],
        ),
        q(
          'm4-expand',
          '`.navbar-expand-md` nima qiladi?',
          [
            '768px dan keng ekranda menyuni ochiq ko‘rsatadi, torroqda ☰ ortiga yashiradi',
            'Navbar balandligini oshiradi',
            'Navbar’ni tepaga mahkamlaydi',
            'Faqat `md` ekranda navbar ko‘rinadi',
          ],
          [0],
        ),
        q(
          'm4-nav',
          'Bootstrap 4 navlarida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            '`.active` havolaga (`.nav-link`) beriladi',
            'Vertikal menyu uchun `.flex-column`',
            'Ochiq yorliq paneli `.tab-pane.fade.show.active`',
            'Vertikal menyu uchun `.nav-stacked`',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  pagination: bs4(
    slots(PAGINATION, {
      crumb: cls('breadcrumb'),
      ci: cls('breadcrumb-item'),
      cActive: `${cls('breadcrumb-item active')} aria-current="page"`,
      ul: cls('pagination justify-content-center'),
      disabled: cls('page-item disabled'),
      item: cls('page-item'),
      active: cls('page-item active'),
      link: cls('page-link'),
    }),
    { title: 'Katalog' },
  ),
  'list-groups': bs4(
    slots(LIST, {
      lg: cls('list-group'),
      a1: cls('list-group-item list-group-item-action active'),
      a: cls('list-group-item list-group-item-action'),
      h: cls('list-group list-group-horizontal'),
      li: cls('list-group-item'),
      ok: cls('list-group-item list-group-item-success'),
    }),
    { title: 'Kabinet' },
  ),
  cards: bs4(
    slots(CARDS, {
      card: cls('card h-100'),
      img: cls('card-img-top'),
      body: cls('card-body'),
      title: cls('card-title'),
      text: cls('card-text'),
      footer: cls('card-footer text-muted'),
    }),
    { title: 'Kurslar' },
  ),
  dropdowns: bs4(
    slots(DROPDOWN, {
      wrap: cls('dropdown'),
      btn: `${cls('btn btn-secondary dropdown-toggle')} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"`,
      menu: `${cls('dropdown-menu')} aria-labelledby="kursMenyu"`,
      header: cls('dropdown-header'),
      item: cls('dropdown-item'),
      divider: cls('dropdown-divider'),
    }),
    { title: 'Menyu' },
  ),
  collapse: bs4(
    slots(COLLAPSE, {
      t1: ' data-toggle="collapse" data-target="#javob1" aria-expanded="true" aria-controls="javob1"',
      t2: ' data-toggle="collapse" data-target="#javob2" aria-expanded="false" aria-controls="javob2"',
      c1: `${cls('collapse show')} data-parent="#faq"`,
      c2: `${cls('collapse')} data-parent="#faq"`,
    }),
    { title: 'FAQ' },
  ),
  navs: bs4(
    slots(NAVS, {
      ul: cls('nav nav-pills'),
      li: cls('nav-item'),
      a1: `${cls('nav-link active')} data-toggle="pill"`,
      a: `${cls('nav-link')} data-toggle="pill"`,
      content: cls('tab-content'),
      p1: cls('tab-pane fade show active'),
      p: cls('tab-pane fade'),
    }),
    { title: 'Kurs' },
  ),
  navbar: bs4(
    slots(NAVBAR, {
      nav: cls('navbar navbar-expand-md navbar-dark bg-dark'),
      brand: cls('navbar-brand'),
      toggler: TOGGLER,
      collapse: cls('collapse navbar-collapse'),
      ul: cls('navbar-nav ml-auto'),
      li: cls('nav-item'),
      link: cls('nav-link'),
    }),
    { title: 'Sayt' },
  ),
};
