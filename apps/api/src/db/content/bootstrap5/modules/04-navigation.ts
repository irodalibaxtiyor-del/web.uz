import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs5,
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
      <li{{disabled}}><a{{link}}>Oldingi</a></li>
      <li{{item}}><a{{link}} href="#">1</a></li>
      <li{{active}}><a{{link}} href="#">2</a></li>
      <li{{item}}><a{{link}} href="#">3</a></li>
      <li{{item}}><a{{link}} href="#">Keyingi</a></li>
    </ul>
  </nav>
</div>`;

const LIST = `<div class="container">
  <div class="row g-4">
    <div class="col-md-4">
      <div id="menyu"{{lg}}>
        <a href="#"{{a1}}>Profil</a>
        <a href="#"{{a}}>Kurslarim</a>
        <a href="#"{{a}}>Sertifikatlar</a>
      </div>
    </div>
    <div class="col-md-8">
      <ol id="qadamlar"{{ol}}>
        <li{{li}}>Darsni o‘qish</li>
        <li{{li}}>Mashqni bajarish</li>
        <li{{li}}>Testdan o‘tish</li>
      </ol>
      <ul class="list-group mt-3">
        <li id="tolov"{{ok}}>To‘lov qabul qilindi</li>
      </ul>
    </div>
  </div>
</div>`;

const card = (n: number, name: string, color: string) => `<div{{col}}>
      <div id="c${n}"{{card}}>
        <img src="${pic(name, 400, 200, color)}" alt="${name} kursi"{{img}}>
        <div{{body}}>
          <h5{{title}}>${name}</h5>
          <p{{text}}>${name} bo‘yicha amaliy kurs.</p>
          <a href="#"{{link}}>Kursga o‘tish</a>
        </div>
        <div{{footer}}><small>Yangilangan: oktabr</small></div>
      </div>
    </div>`;

const CARDS = `<div class="container">
  <h2>Kurslar</h2>
  <div id="katalog"{{row}}>
    ${card(1, 'HTML', '#e34c26')}
    ${card(2, 'CSS', '#264de4')}
    ${card(3, 'Bootstrap', '#7952b3')}
  </div>
</div>`;

const DROPDOWN = `<div class="container">
  <h2>Kurslar</h2>
  <div id="menyu"{{wrap}}>
    <button type="button" id="kursMenyu"{{btn}}>Yo‘nalishni tanlang</button>
    <ul id="royxat"{{menu}}>
      <li><h6{{header}}>Frontend</h6></li>
      <li><a href="#"{{item}}>HTML</a></li>
      <li><a href="#"{{item}}>CSS</a></li>
      <li>{{divider}}</li>
      <li><h6{{header}}>Backend</h6></li>
      <li><a href="#"{{item}}>PHP</a></li>
    </ul>
  </div>
</div>`;

const ACC = (n: number, question: string, answer: string) => `<div{{item}}>
      <h2{{header}}>
        <button type="button" id="tugma${n}"{{b${n}}}>${question}</button>
      </h2>
      <div id="javob${n}"{{c${n}}}>
        <div{{body}}>${answer}</div>
      </div>
    </div>`;

const ACCORDION = `<div class="container">
  <h2>Ko‘p so‘raladigan savollar</h2>
  <div id="faq"{{acc}}>
    ${ACC(1, 'Kurs qancha davom etadi?', 'Uch oy, haftasiga uch dars.')}
    ${ACC(2, 'Sertifikat beriladimi?', 'Ha, yakuniy loyihadan keyin.')}
  </div>
</div>`;

const tabBtn = (id: string, label: string, active: boolean) =>
  `<li class="nav-item" role="presentation">
      <button type="button" id="${id}-tab"{{${active ? 'b1' : 'b'}}} data-bs-target="#${id}" role="tab" aria-controls="${id}" aria-selected="${active}">${label}</button>
    </li>`;

const NAVS = `<div class="container">
  <h2>Kurs sahifasi</h2>
  <ul id="yorliqlar"{{ul}} role="tablist">
    ${tabBtn('tavsif', 'Tavsif', true)}
    ${tabBtn('dastur', 'Dastur', false)}
    ${tabBtn('sharhlar', 'Sharhlar', false)}
  </ul>
  <div{{content}}>
    <div id="tavsif" role="tabpanel" tabindex="0"{{p1}}><p class="pt-3">Bootstrap 5 bilan zamonaviy sahifalar.</p></div>
    <div id="dastur" role="tabpanel" tabindex="0"{{p}}><p class="pt-3">8 modul, 49 dars.</p></div>
    <div id="sharhlar" role="tabpanel" tabindex="0"{{p}}><p class="pt-3">“Juda foydali!” — Aziza</p></div>
  </div>
</div>`;

const NAVBAR = `<nav id="panel"{{nav}}>
  <div{{fluid}}>
    <a href="#"{{brand}}>WEBDIZAYN</a>{{toggler}}
    <div id="menyu"{{collapse}}>
      <ul{{ul}}>
        <li{{li}}><a href="#"{{link}}>Bosh sahifa</a></li>
        <li{{li}}><a href="#"{{link}}>Kurslar</a></li>
        <li{{li}}><a href="#"{{link}}>Aloqa</a></li>
      </ul>
    </div>
  </div>
</nav>
<div class="container">
  <h1>Xush kelibsiz!</h1>
</div>`;

const TOGGLER = `
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menyu" aria-controls="menyu" aria-expanded="false" aria-label="Menyuni ochish">
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
        description: 'Pagination, `aria-current` va fonli breadcrumb.',
        instructions: md(
          '- `#yol` — `breadcrumb bg-body-tertiary p-2 rounded`; bandlar — `breadcrumb-item`, oxirgisi qo‘shimcha `active` va `aria-current="page"`.',
          '- `#sahifalar` — `pagination justify-content-center`.',
          '- `<li>` — `page-item`, havolalar — `page-link`; “Oldingi” — `page-item disabled`, 2-sahifa — `page-item active` va `aria-current="page"`.',
        ),
        expectedBehavior: 'Kulrang fonli yo‘l ko‘rsatkichi va markazdagi sahifalash, 2 ko‘k fonda.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(PAGINATION), { title: 'Katalog' }),
        checks: [
          style('crumb', 'Breadcrumb foni', '#yol', 'background-color', RGB.bs5.light),
          style('center', 'Sahifalash markazda', '#sahifalar', 'justify-content', 'center'),
          style(
            'active',
            '2-sahifa ko‘k',
            '#sahifalar > li:nth-child(3) > a',
            'background-color',
            RGB.bs5.primary,
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
            '`aria-current` joriy sahifada',
            '#sahifalar > li.active[aria-current="page"]',
          ),
        ],
      },
    },
    {
      slug: 'list-groups',
      title: 'List group',
      exercise: {
        title: 'Kabinet menyusi va qadamlar',
        description: 'Bosiladigan, raqamlangan va rangli list group.',
        instructions: md(
          '- `#menyu` — `list-group`; havolalar — `list-group-item list-group-item-action`, “Profil” — qo‘shimcha `active`.',
          '- `#qadamlar` — raqamlangan: `list-group list-group-numbered`, bandlari `list-group-item`.',
          '- `#tolov` — `list-group-item list-group-item-success`.',
        ),
        expectedBehavior: 'Ko‘k “Profil”li menyu, raqamlangan qadamlar ro‘yxati va yashil xabar.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(LIST), { title: 'Kabinet' }),
        checks: [
          style(
            'active',
            '“Profil” tanlangan',
            '#menyu > a:first-child',
            'background-color',
            RGB.bs5.primary,
          ),
          has('action', 'Bandlar `-action`', '#menyu > a.list-group-item-action', { min: 3 }),
          style('numbered', 'Ro‘yxat raqamlangan', '#qadamlar', 'list-style-type', 'none'),
          has(
            'numbered-class',
            'Raqamlangan list group',
            'ol.list-group.list-group-numbered > li.list-group-item',
            {
              min: 3,
              hidden: true,
            },
          ),
          style('success', 'Yashil xabar', '#tolov', 'background-color', 'rgb(209, 231, 221)'),
        ],
      },
    },
    {
      slug: 'cards',
      title: 'Card',
      exercise: {
        title: 'Kurslar katalogi',
        description: '`row-cols` + `g-4` + `.card.h-100` va `.stretched-link`.',
        instructions: md(
          '- `#katalog` — `row row-cols-1 row-cols-md-3 g-4`; har bir o‘ram `<div>` — `col`.',
          '- Kartalar — `card h-100`; rasm — `card-img-top`; tana — `card-body`; sarlavha — `card-title`; matn — `card-text`.',
          '- Havola — `btn btn-primary stretched-link` (butun karta bosiladigan bo‘ladi).',
          '- Pastki qism — `card-footer text-body-secondary`.',
        ),
        expectedBehavior:
          'Uch ustunda bir xil balandlikdagi kartalar; karta istalgan joyiga bosish havolani ochadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(CARDS), { title: 'Kurslar' }),
        checks: [
          at(1000, 800, style('width', 'Uch ustun', '#c2', 'width', '295.984px')),
          style('radius', 'Card yumaloq', '#c1', 'border-top-left-radius', '6px'),
          style(
            'stretched',
            'Havola butun kartani qoplaydi',
            '#c1 .stretched-link',
            'position',
            'static',
          ),
          style(
            'stretched-after',
            'Bosish maydoni',
            '#c1 .stretched-link',
            'position',
            'absolute',
            {
              pseudo: '::after',
            },
          ),
          has('footer', 'Pastki qism', '.card > .card-footer', { min: 3 }),
        ],
      },
    },
    {
      slug: 'dropdowns',
      title: 'Dropdown',
      exercise: {
        title: 'Yo‘nalishlar menyusi',
        description: '`data-bs-toggle`, `ul > li > .dropdown-item`.',
        instructions: md(
          '- `#menyu` — `dropdown`.',
          '- Tugma — `btn btn-secondary dropdown-toggle`, `data-bs-toggle="dropdown"`, `aria-expanded="false"`.',
          '- `#royxat` — `dropdown-menu`; havolalar — `dropdown-item`; sarlavhalar — `dropdown-header`;',
          '  bo‘sh `<li>` ichiga `<hr class="dropdown-divider">`.',
        ),
        expectedBehavior: 'Tugma bosilganda guruhlangan menyu ochiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(DROPDOWN), { title: 'Menyu' }),
        checks: [
          style('hidden', 'Menyu boshida yashirin', '#royxat', 'display', 'none'),
          after(
            [click('#kursMenyu'), wait(300)],
            has('open', 'Bosilganda menyu ochiladi', '#royxat.dropdown-menu.show'),
          ),
          after(
            [click('#kursMenyu'), wait(300)],
            attr('aria', 'Tugmada `aria-expanded="true"`', '#kursMenyu', 'aria-expanded', 'true', {
              hidden: true,
            }),
          ),
          has('items', 'Bandlar', '#royxat > li > a.dropdown-item', { min: 3 }),
          has('divider', 'Ajratuvchi', '#royxat hr.dropdown-divider'),
        ],
      },
    },
    {
      slug: 'collapse',
      title: 'Collapse va accordion',
      exercise: {
        title: 'Savol-javob akkordeoni',
        description: 'Bootstrap 5 accordion komponenti.',
        instructions: md(
          '- `#faq` — `accordion`; bo‘limlar — `accordion-item`; `h2` — `accordion-header`; javob ichidagi `<div>` — `accordion-body`.',
          '- `#tugma1` — `accordion-button`, `#tugma2` — `accordion-button collapsed`; ikkalasiga `data-bs-toggle="collapse"` va `data-bs-target="#javobN"`.',
          '- `#javob1` — `accordion-collapse collapse show`, `#javob2` — `accordion-collapse collapse`; ikkalasiga `data-bs-parent="#faq"`.',
        ),
        expectedBehavior:
          'Birinchi javob ochiq; ikkinchi savol bosilsa u ochiladi, birinchisi yopiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(ACCORDION), { title: 'FAQ' }),
        checks: [
          style(
            'active',
            'Ochiq bo‘lim sarlavhasi ajralgan',
            '#tugma1',
            'background-color',
            'rgb(207, 226, 255)',
          ),
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
        description: '`<button>` yorliqlar va `aria-selected`.',
        instructions: md(
          '- `#yorliqlar` — `nav nav-tabs`.',
          '- Har bir `<button>` — `nav-link` va `data-bs-toggle="tab"`; birinchisi qo‘shimcha `active`.',
          '- Kontent — `tab-content`; panellar — `tab-pane fade`, birinchisi `tab-pane fade show active`.',
        ),
        expectedBehavior: 'Uchta yorliq; bosilganda tegishli panel ochiladi va yorliq faollashadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(NAVS), { title: 'Kurs' }),
        checks: [
          style('hidden', 'Boshqa panellar yashirin', '#dastur', 'display', 'none'),
          after(
            [click('#dastur-tab'), wait(500)],
            style('switch', '“Dastur” paneli ochiladi', '#dastur', 'display', 'block'),
          ),
          after(
            [click('#dastur-tab'), wait(500)],
            attr('aria', '`aria-selected` yangilanadi', '#dastur-tab', 'aria-selected', 'true'),
          ),
          has('tabs', 'Yorliqlar `nav-tabs`', 'ul.nav.nav-tabs > li > button.nav-link', { min: 3 }),
        ],
      },
    },
    {
      slug: 'navbar',
      title: 'Navbar',
      exercise: {
        title: 'Qorong‘i navbar',
        description: '`navbar-expand-lg`, `data-bs-theme="dark"` va ☰.',
        instructions: md(
          '- `#panel` — `navbar navbar-expand-lg bg-dark` va `data-bs-theme="dark"`.',
          '- Ichki `<div>` — `container-fluid`; havola — `navbar-brand`.',
          '- Brand’dan keyin ☰ tugmasi: `navbar-toggler`, `data-bs-toggle="collapse"`, `data-bs-target="#menyu"`, ichida `navbar-toggler-icon`.',
          '- `#menyu` — `collapse navbar-collapse`; ro‘yxat — `navbar-nav ms-auto`; `<li>` — `nav-item`; havolalar — `nav-link`.',
        ),
        expectedBehavior:
          'Kompyuterda to‘q panel va o‘ngda menyu; telefonda ☰ bosilsa menyu ochiladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(NAVBAR), { title: 'Sayt' }),
        checks: [
          style('dark', 'To‘q navbar', '#panel', 'background-color', RGB.bs5.dark),
          at(1280, 800, style('expand', 'Kompyuterda menyu ochiq', '#menyu', 'display', 'flex')),
          at(
            375,
            700,
            after(
              [click('.navbar-toggler'), wait(700)],
              has('mobile', 'Telefonda ☰ menyuni ochadi', '#menyu.show'),
            ),
          ),
          style(
            'theme',
            'Qorong‘i mavzu havolalari',
            '#menyu .nav-link',
            'color',
            'rgba(255, 255, 255, 0.55)',
          ),
          has('fluid', 'Ichida konteyner', '#panel > .container-fluid > .navbar-brand', {
            hidden: true,
          }),
        ],
      },
      quiz: quiz('4-modul testi: navigatsiya va kartalar', [
        q(
          'm4-deck',
          'Bootstrap 5 da `.card-deck` o‘rniga nima ishlatiladi?',
          [
            '`row row-cols-* g-*` setka va `.card.h-100`',
            '`.card-columns`',
            '`.card-deck` o‘zgarmagan',
            '`.d-deck`',
          ],
          [0],
        ),
        q(
          'm4-stretched',
          '`.stretched-link` nima qiladi?',
          [
            'Havolaning bosish maydonini pozitsiyali ota elementga (masalan, kartaga) cho‘zadi',
            'Havola matnini cho‘zadi',
            'Havolani yangi oynada ochadi',
            'Havolani tugma qiladi',
          ],
          [0],
        ),
        q(
          'm4-acc',
          'Bootstrap 5 akkordeonida bir vaqtda faqat bitta bo‘lim ochiq bo‘lishi uchun nima kerak?',
          [
            '`.accordion-collapse` larda `data-bs-parent="#id"`',
            'Tugmalarda `data-bs-single`',
            '`.accordion-flush`',
            'Buni faqat JavaScript bilan qilish mumkin',
          ],
          [0],
        ),
        q(
          'm4-end',
          'Bootstrap 4 dagi `dropdown-menu-right` va `dropright` Bootstrap 5 da? (bir nechta javob)',
          ['`dropdown-menu-end`', '`dropend`', '`dropdown-right`', '`drop-right`'],
          [0, 1],
        ),
        q(
          'm4-dark',
          'Bootstrap 5.3 da to‘q navbar uchun tavsiya etilgan usul?',
          [
            '`bg-dark` va `data-bs-theme="dark"`',
            '`navbar-inverse`',
            '`navbar-black`',
            'Faqat o‘z CSS’ingiz',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  pagination: bs5(
    slots(PAGINATION, {
      crumb: cls('breadcrumb bg-body-tertiary p-2 rounded'),
      ci: cls('breadcrumb-item'),
      cActive: `${cls('breadcrumb-item active')} aria-current="page"`,
      ul: cls('pagination justify-content-center'),
      disabled: cls('page-item disabled'),
      item: cls('page-item'),
      active: `${cls('page-item active')} aria-current="page"`,
      link: cls('page-link'),
    }),
    { title: 'Katalog' },
  ),
  'list-groups': bs5(
    slots(LIST, {
      lg: cls('list-group'),
      a1: cls('list-group-item list-group-item-action active'),
      a: cls('list-group-item list-group-item-action'),
      ol: cls('list-group list-group-numbered'),
      li: cls('list-group-item'),
      ok: cls('list-group-item list-group-item-success'),
    }),
    { title: 'Kabinet' },
  ),
  cards: bs5(
    slots(CARDS, {
      row: cls('row row-cols-1 row-cols-md-3 g-4'),
      col: cls('col'),
      card: cls('card h-100'),
      img: cls('card-img-top'),
      body: cls('card-body'),
      title: cls('card-title'),
      text: cls('card-text'),
      link: cls('btn btn-primary stretched-link'),
      footer: cls('card-footer text-body-secondary'),
    }),
    { title: 'Kurslar' },
  ),
  dropdowns: bs5(
    slots(DROPDOWN, {
      wrap: cls('dropdown'),
      btn: `${cls('btn btn-secondary dropdown-toggle')} data-bs-toggle="dropdown" aria-expanded="false"`,
      menu: cls('dropdown-menu'),
      header: cls('dropdown-header'),
      item: cls('dropdown-item'),
      divider: '<hr class="dropdown-divider">',
    }),
    { title: 'Menyu' },
  ),
  collapse: bs5(
    slots(ACCORDION, {
      acc: cls('accordion'),
      item: cls('accordion-item'),
      header: cls('accordion-header'),
      body: cls('accordion-body'),
      b1: `${cls('accordion-button')} data-bs-toggle="collapse" data-bs-target="#javob1" aria-expanded="true" aria-controls="javob1"`,
      b2: `${cls('accordion-button collapsed')} data-bs-toggle="collapse" data-bs-target="#javob2" aria-expanded="false" aria-controls="javob2"`,
      c1: `${cls('accordion-collapse collapse show')} data-bs-parent="#faq"`,
      c2: `${cls('accordion-collapse collapse')} data-bs-parent="#faq"`,
    }),
    { title: 'FAQ' },
  ),
  navs: bs5(
    slots(NAVS, {
      ul: cls('nav nav-tabs'),
      b1: `${cls('nav-link active')} data-bs-toggle="tab"`,
      b: `${cls('nav-link')} data-bs-toggle="tab"`,
      content: cls('tab-content'),
      p1: cls('tab-pane fade show active'),
      p: cls('tab-pane fade'),
    }),
    { title: 'Kurs' },
  ),
  navbar: bs5(
    slots(NAVBAR, {
      nav: `${cls('navbar navbar-expand-lg bg-dark')} data-bs-theme="dark"`,
      fluid: cls('container-fluid'),
      brand: cls('navbar-brand'),
      toggler: TOGGLER,
      collapse: cls('collapse navbar-collapse'),
      ul: cls('navbar-nav ms-auto'),
      li: cls('nav-item'),
      link: cls('nav-link'),
    }),
    { title: 'Sayt' },
  ),
};
