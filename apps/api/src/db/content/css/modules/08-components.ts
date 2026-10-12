import { after, at, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

/** Solid-colour placeholder picture as a data URL (external images are blocked). */
export function pic(color: string, alt: string, w = 160, h = 120): string {
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect width='${w}' height='${h}' fill='%23${color}'/%3E%3C/svg%3E`;
  return `<img src="data:image/svg+xml,${svg}" width="${w}" height="${h}" alt="${alt}">`;
}

const SPRITE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='32'%3E%3Crect width='32' height='32' fill='%230071dc'/%3E%3Crect x='32' width='32' height='32' fill='%23fec400'/%3E%3Crect x='64' width='32' height='32' fill='%23e11d48'/%3E%3C/svg%3E";

/** Markup shared by the starter files and the reference solutions. */
export const BODY08 = {
  opacity: `<div class="galereya">
  ${pic('0071dc', 'Ko‘k rang namunasi')}
  ${pic('fec400', 'Sariq rang namunasi')}
</div>
<div class="banner">Yangi kurslar ochildi!</div>`,
  navVertical: `<nav class="yon-menyu" aria-label="Bo‘limlar">
  <ul>
    <li><a href="#" aria-current="page">Bosh sahifa</a></li>
    <li><a href="#">Kurslar</a></li>
    <li><a href="#">Aloqa</a></li>
  </ul>
</nav>`,
  navHorizontal: `<header class="sarlavha">
  <a class="logo" href="#">WEBDIZAYN.UZ</a>
  <nav class="menyu">
    <ul>
      <li><a href="#">Kurslar</a></li>
      <li><a href="#">Narxlar</a></li>
      <li><a href="#">Aloqa</a></li>
    </ul>
  </nav>
</header>`,
  dropdowns: `<div class="dropdown">
  <button class="dropdown-tugma">Kurslar ▾</button>
  <ul class="dropdown-menyu">
    <li><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
  </ul>
</div>
<p>Menyu ostidagi matn.</p>`,
  gallery: `<div class="galereya">
  <figure>${pic('0071dc', 'Ko‘k fon', 400, 200)}<figcaption>Dengiz</figcaption></figure>
  <figure>${pic('16a34a', 'Yashil fon', 200, 300)}<figcaption>O‘rmon</figcaption></figure>
  <figure>${pic('fec400', 'Sariq fon', 300, 300)}<figcaption>Cho‘l</figcaption></figure>
</div>`,
  sprites: `<p>
  <span class="ikonka ikonka-uy" role="img" aria-label="Bosh sahifa"></span>
  <span class="ikonka ikonka-qidiruv" role="img" aria-label="Qidiruv"></span>
  <span class="ikonka ikonka-savat" role="img" aria-label="Savat"></span>
</p>`,
  forms: `<form class="forma">
  <div class="maydon">
    <label for="ism">Ism</label>
    <input id="ism" type="text">
  </div>
  <div class="maydon">
    <label for="izoh">Izoh</label>
    <textarea id="izoh"></textarea>
  </div>
  <div class="maydon">
    <label><input type="checkbox"> Yangiliklarga obuna bo‘lish</label>
  </div>
  <button>Yuborish</button>
</form>`,
  counters: `<article class="maqola">
  <h2>Kirish</h2>
  <p>…</p>
  <h2>Asosiy qism</h2>
  <p>…</p>
  <h2>Xulosa</h2>
</article>
<ul class="qadamlar">
  <li>Ro‘yxatdan o‘ting</li>
  <li>Kursni tanlang</li>
  <li>O‘qishni boshlang</li>
</ul>`,
  layout: `<header class="sayt-sarlavha">WEBDIZAYN.UZ</header>
<div class="sahifa">
  <main>
    <h1>Asosiy kontent</h1>
    <p>Maqola matni.</p>
  </main>
  <aside>Yon panel</aside>
</div>
<footer class="sayt-pasti">© WEBDIZAYN.UZ</footer>`,
};

export const SPRITE_CSS = `.ikonka {
  background-image: url("${SPRITE}");
}`;

export const LAYOUT_CSS = `.sayt-sarlavha,
.sayt-pasti {
  padding: 16px;
  background-color: #0e1133;
  color: white;
}

aside {
  padding: 16px;
  background-color: #f5faff;
}`;

export const m08: ModuleDef = {
  title: 'Amaliy komponentlar',
  lessons: [
    {
      slug: 'opacity',
      title: 'Shaffoflik',
      exercise: {
        title: 'Galereya va banner',
        description: '`opacity` hover bilan va faqat fonni shaffof qilish.',
        instructions: md(
          '1. `.galereya img` — `opacity: 0.8`, hover’da `1`.',
          '2. `.banner` dagi `opacity: 0.6` matnni ham xira qilyapti. Uni olib tashlang va o‘rniga fonni `rgba(0, 113, 220, 0.6)` qiling.',
        ),
        expectedBehavior: 'Rasmlar hover’da yorqinlashadi, banner foni shaffof, matni aniq.',
        difficulty: 'EASY',
        starterFiles: site(
          BODY08.opacity,
          `.banner {
  padding: 24px;
  background-color: #0071dc;
  color: white;
  opacity: 0.6;
}`,
        ),
        checks: [
          style('img', 'Rasm biroz xira', '.galereya img', 'opacity', '0.8'),
          after(
            [{ type: 'hover', selector: '.galereya img' }],
            style('hover', 'Hover’da to‘liq ko‘rinadi', '.galereya img', 'opacity', '1'),
          ),
          style('banner', 'Banner matni xira emas', '.banner', 'opacity', '1', {
            hint: '`opacity` bolalarga ham ta’sir qiladi.',
          }),
          style(
            'rgba',
            'Banner foni shaffof',
            '.banner',
            'background-color',
            'rgba(0, 113, 220, 0.6)',
          ),
        ],
      },
    },
    {
      slug: 'navbar-vertical',
      title: 'Vertikal menyu',
      exercise: {
        title: 'Yon menyu',
        description: 'Ro‘yxatni tozalash, blok havolalar, hover va joriy sahifa.',
        instructions: md(
          '1. `.yon-menyu ul`: belgisiz, `margin: 0`, `padding: 0`.',
          '2. `.yon-menyu a`: `display: block`, `padding: 10px 16px`.',
          '3. Hover’da fon `#f5faff`.',
          '4. `aria-current="page"` bo‘lgan havola: fon `#0071dc`, matn oq.',
        ),
        expectedBehavior: 'Butun qatori bosiladigan menyu, joriy sahifa ko‘k.',
        difficulty: 'EASY',
        starterFiles: site(BODY08.navVertical, TODO),
        checks: [
          style('list', 'Ro‘yxat belgisiz', '.yon-menyu ul', 'list-style-type', 'none'),
          style('pad', 'Ro‘yxat chekinishsiz', '.yon-menyu ul', 'padding-left', '0px'),
          style('block', 'Havolalar blok', '.yon-menyu a', 'display', 'block'),
          style(
            'current',
            'Joriy sahifa ko‘k',
            '[aria-current="page"]',
            'background-color',
            '#0071dc',
          ),
          after(
            [{ type: 'hover', selector: '.yon-menyu li:nth-child(2) a' }],
            style(
              'hover',
              'Hover’da och fon',
              '.yon-menyu li:nth-child(2) a',
              'background-color',
              '#f5faff',
            ),
          ),
        ],
      },
    },
    {
      slug: 'navbar-horizontal',
      title: 'Gorizontal menyu',
      exercise: {
        title: 'Sayt sarlavhasi',
        description: 'Flex menyu, logo chapda va menyu o‘ngda.',
        instructions: md(
          '1. `.sarlavha`: `display: flex`, `justify-content: space-between`, `align-items: center`, fon `#0e1133`.',
          '2. `.menyu ul`: `display: flex`, `gap: 4px`, belgisiz, `margin: 0`, `padding: 0`.',
          '3. `.menyu a`: `display: block`, `padding: 12px 16px`, oq rang, tagchiziqsiz.',
        ),
        expectedBehavior: 'To‘q fonli sarlavha: logo chapda, menyu bandlari o‘ngda bir qatorda.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY08.navHorizontal, '.logo {\n  color: white;\n}'),
        checks: [
          style('flex', 'Sarlavha flex', '.sarlavha', 'display', 'flex'),
          style(
            'between',
            'Logo va menyu chetlarda',
            '.sarlavha',
            'justify-content',
            'space-between',
          ),
          style('ul', 'Menyu bandlari bir qatorda', '.menyu ul', 'display', 'flex'),
          style('gap', 'Bandlar orasida 4px', '.menyu ul', 'column-gap', '4px'),
          style('link', 'Havola padding 16px', '.menyu a', 'padding-left', '16px'),
        ],
      },
    },
    {
      slug: 'dropdowns',
      title: 'Ochiladigan menyu',
      exercise: {
        title: 'Hover va klaviatura bilan ochiladigan menyu',
        description: '`absolute` menyu, `:hover` va `:focus-within`.',
        instructions: md(
          '1. `.dropdown`: `position: relative`, `display: inline-block`.',
          '2. `.dropdown-menyu`: `display: none`, `position: absolute`, `top: 100%`, `left: 0`, `z-index: 20`, fon oq.',
          '3. `.dropdown:hover` **va** `.dropdown:focus-within` bo‘lganda menyu `display: block`.',
        ),
        expectedBehavior:
          'Menyu yopiq; sichqoncha bilan ham, Tab bilan ham ochiladi va matn ustida turadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY08.dropdowns, TODO),
        checks: [
          style('hidden', 'Menyu boshida yopiq', '.dropdown-menyu', 'display', 'none'),
          style('rel', 'Ota `relative`', '.dropdown', 'position', 'relative'),
          style('abs', 'Menyu `absolute`', '.dropdown-menyu', 'position', 'absolute'),
          after(
            [{ type: 'hover', selector: '.dropdown-tugma' }],
            style('hover', 'Hover’da ochiladi', '.dropdown-menyu', 'display', 'block'),
          ),
          after(
            [{ type: 'press', selector: 'body', key: 'Tab' }],
            style('focus', 'Klaviatura bilan ochiladi', '.dropdown-menyu', 'display', 'block', {
              hint: '`.dropdown:focus-within .dropdown-menyu`',
            }),
          ),
        ],
      },
    },
    {
      slug: 'image-gallery',
      title: 'Rasmlar galereyasi',
      exercise: {
        title: 'Bir xil kartochkalar',
        description: 'Grid to‘r, `aspect-ratio` va `object-fit`.',
        instructions: md(
          '1. `.galereya`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`, `gap: 16px`.',
          '2. `figure`: `margin: 0`.',
          '3. `img`: `display: block`, `width: 100%`, `height: auto`, `aspect-ratio: 4 / 3`, `object-fit: cover`.',
        ),
        expectedBehavior: 'Har xil o‘lchamdagi rasmlar bir xil kartochkalarga aylanadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY08.gallery, 'figcaption {\n  padding: 8px;\n}'),
        checks: [
          style('grid', 'Galereya grid', '.galereya', 'display', 'grid'),
          style('gap', 'Kartochkalar orasida 16px', '.galereya', 'row-gap', '16px'),
          style('figure', '`figure` marginsiz', 'figure', 'margin-left', '0px'),
          style('ratio', 'Rasm nisbati 4:3', '.galereya img', 'aspect-ratio', '4 / 3'),
          style('cover', 'Rasm cho‘zilmaydi', '.galereya img', 'object-fit', 'cover'),
        ],
      },
    },
    {
      slug: 'image-sprites',
      title: 'Rasm spraytlari',
      exercise: {
        title: 'Uchta ikonka — bitta rasm',
        description: '“Oyna” o‘lchami va `background-position`.',
        instructions: md(
          'Sprayt 96×32 px: ko‘k, sariq va qizil kvadratlar ketma-ket.',
          '',
          '1. `.ikonka`: `display: inline-block`, `width: 32px`, `height: 32px`.',
          '2. `.ikonka-qidiruv`: `background-position: -32px 0` (sariq).',
          '3. `.ikonka-savat`: `background-position: -64px 0` (qizil).',
        ),
        expectedBehavior: 'Uchta har xil rangli kvadrat — bitta fon rasmidan.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY08.sprites, SPRITE_CSS),
        checks: [
          style('display', 'Ikonka `inline-block`', '.ikonka', 'display', 'inline-block'),
          style('w', 'Oyna 32px', '.ikonka', 'width', '32px'),
          style(
            'search',
            'Qidiruv sariq qismda',
            '.ikonka-qidiruv',
            'background-position-x',
            '-32px',
          ),
          style('cart', 'Savat qizil qismda', '.ikonka-savat', 'background-position-x', '-64px'),
        ],
      },
    },
    {
      slug: 'forms',
      title: 'Formalar',
      exercise: {
        title: 'Qulay forma',
        description: 'Maydon o‘lchami, shrift, `accent-color` va `resize`.',
        instructions: md(
          '1. `input[type="text"]` va `textarea`: `box-sizing: border-box`, `width: 100%`, `padding: 10px 12px`, `font: inherit`.',
          '2. Checkbox rangi: `accent-color: #0071dc`.',
          '3. `textarea` faqat vertikal o‘lchamini o‘zgartirsin: `resize: vertical`.',
        ),
        expectedBehavior:
          'Keng, qulay maydonlar, ko‘k checkbox, faqat balandligi o‘zgaradigan izoh maydoni.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY08.forms, 'body {\n  font: 16px/1.5 Arial, sans-serif;\n}'),
        checks: [
          style('sizing', 'Maydon `border-box`', 'input[type="text"]', 'box-sizing', 'border-box'),
          style('pad', 'Maydon padding 12px', 'input[type="text"]', 'padding-left', '12px'),
          style('font', 'Maydon sahifa shriftida', 'textarea', 'font-size', '16px'),
          style('accent', 'Checkbox ko‘k', 'input[type="checkbox"]', 'accent-color', '#0071dc'),
          style('resize', 'Faqat vertikal o‘zgaradi', 'textarea', 'resize', 'vertical'),
        ],
      },
    },
    {
      slug: 'counters',
      title: 'CSS hisoblagichlari',
      exercise: {
        title: 'Avtomatik raqamlash',
        description: '`counter-reset`, `counter-increment` va `counter()`.',
        instructions: md(
          '1. `.maqola`: `counter-reset: bolim`.',
          '2. `.maqola h2`: `counter-increment: bolim`; `::before` da `content: counter(bolim) ". "`.',
          '3. `.qadamlar`: `counter-reset: qadam`, `list-style: none`. Har `li` da `counter-increment: qadam`.',
          '4. `.qadamlar li::before`: `content: counter(qadam)`, fon `#0071dc`, `border-radius: 50%`.',
        ),
        expectedBehavior:
          'Bo‘limlar 1., 2., 3. bilan, qadamlar ko‘k doirachalardagi raqamlar bilan.',
        difficulty: 'HARD',
        starterFiles: site(BODY08.counters, TODO),
        checks: [
          style('reset', 'Hisoblagich yaratilgan', '.maqola', 'counter-reset', 'bolim 0'),
          style('inc', 'Har sarlavha hisoblanadi', '.maqola h2', 'counter-increment', 'bolim 1'),
          style(
            'content',
            'Sarlavha oldida raqam',
            '.maqola h2',
            'content',
            'counter(bolim) ". "',
            {
              pseudo: '::before',
            },
          ),
          style('step-bg', 'Qadam raqami ko‘k', '.qadamlar li', 'background-color', '#0071dc', {
            pseudo: '::before',
          }),
          style(
            'step-round',
            'Qadam raqami doirada',
            '.qadamlar li',
            'border-top-left-radius',
            '50%',
            {
              pseudo: '::before',
            },
          ),
        ],
      },
    },
    {
      slug: 'website-layout',
      title: 'Sayt maketi',
      exercise: {
        title: 'Ikki ustunli sahifa',
        description: 'Grid ustunlar, media so‘rov va pastda turadigan footer.',
        instructions: md(
          '1. `body`: `margin: 0`, `min-height: 100vh`, `display: flex`, `flex-direction: column`.',
          '2. `.sahifa`: `flex: 1`, `display: grid`, `grid-template-columns: 1fr 280px`, `gap: 24px`, `max-width: 1100px`, `margin: 0 auto`, `padding: 24px 16px`. (`width: 100%` va `box-sizing: border-box` ham qo‘shing.)',
          '3. `@media (max-width: 768px)` da `.sahifa` bitta ustunli (`1fr`).',
        ),
        expectedBehavior:
          'Katta ekranda asosiy kontent va yon panel, telefonda bitta ustun, footer doim pastda.',
        difficulty: 'HARD',
        starterFiles: site(BODY08.layout, LAYOUT_CSS),
        checks: [
          style('body', '`body` flex ustun', 'body', 'flex-direction', 'column'),
          style('grow', 'Asosiy qism bo‘sh joyni egallaydi', '.sahifa', 'flex-grow', '1'),
          at(
            1000,
            700,
            style(
              'cols',
              'Ikki ustun: 1fr va 280px',
              '.sahifa',
              'grid-template-columns',
              '664px 280px',
              {
                hint: '1000 − 2×16 padding − 24 gap − 280 = 664px.',
              },
            ),
          ),
          style('gap', 'Ustunlar orasida 24px', '.sahifa', 'column-gap', '24px'),
          at(
            600,
            700,
            style('mobile', 'Telefonda bitta ustun', '.sahifa', 'grid-template-columns', '568px'),
          ),
        ],
      },
      quiz: quiz('8-modul testi: Amaliy komponentlar', [
        q(
          'q1',
          'Faqat fonni shaffof qilib, matnni aniq qoldirish uchun nima ishlatiladi?',
          ['`rgba()` rang', '`opacity: 0.5`', '`visibility: hidden`', '`filter: blur()`'],
          [0],
        ),
        q(
          'q2',
          'Menyu havolasida butun qator bosiladigan bo‘lishi uchun?',
          ['`display: block`', '`display: inline`', '`cursor: pointer`', '`text-decoration: none`'],
          [0],
        ),
        q(
          'q3',
          'Klaviatura foydalanuvchisi ham dropdownni ocha olishi uchun qaysi psevdoklass kerak?',
          ['`:focus-within`', '`:hover`', '`:visited`', '`:empty`'],
          [0],
        ),
        q(
          'q4',
          'Har xil o‘lchamdagi rasmlarni cho‘zmasdan bir xil kartochkaga sig‘dirish uchun?',
          [
            '`aspect-ratio` va `object-fit: cover`',
            '`width` va `height` ni qat’iy berish',
            '`float: left`',
            '`opacity: 1`',
          ],
          [0],
        ),
        q(
          'q5',
          'CSS hisoblagichi uchun kerakli qismlar qaysilar?',
          ['`counter-reset`', '`counter-increment`', '`content: counter()`', '`list-style: none`'],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};
