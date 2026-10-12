import { at, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY13 = {
  flexbox: `<header class="sarlavha">
  <a class="logo" href="#">WEBDIZAYN.UZ</a>
  <nav class="menyu">
    <a href="#">Kurslar</a>
    <a href="#">Narxlar</a>
    <a href="#">Aloqa</a>
  </nav>
</header>`,
  container: `<div class="teglar">
  <span>HTML</span><span>CSS</span><span>Flexbox</span><span>Grid</span><span>JavaScript</span>
</div>
<div class="markaz"><p>Markazdagi matn</p></div>
<nav class="menyu">
  <a href="#">Bosh sahifa</a>
  <a href="#">Kurslar</a>
</nav>`,
  items: `<header class="qator">
  <a class="logo" href="#">WEBDIZAYN.UZ</a>
  <input class="qidiruv" placeholder="Qidirish">
  <a class="kirish" href="#">Kirish</a>
</header>
<div class="ustunlar">
  <div class="ustun">Qisqa</div>
  <div class="ustun">Bu ustunda ancha uzunroq matn bor</div>
  <div class="ustun pastda">O‘rta</div>
</div>`,
  responsive: `<nav class="menyu">
  <a href="#">Bosh sahifa</a>
  <a href="#">Kurslar</a>
</nav>
<div class="kartalar">
  <div class="karta"><h3>HTML</h3><p>60 dars</p><a class="tugma" href="#">Boshlash</a></div>
  <div class="karta"><h3>CSS</h3><p>101 dars va ko‘plab mashqlar</p><a class="tugma" href="#">Boshlash</a></div>
  <div class="karta"><h3>Flexbox</h3><p>4 dars</p><a class="tugma" href="#">Boshlash</a></div>
  <div class="karta"><h3>Grid</h3><p>5 dars</p><a class="tugma" href="#">Boshlash</a></div>
</div>`,
};

export const ITEMS_CSS = `body {
  margin: 0;
}

.ustunlar {
  display: flex;
  align-items: flex-start;
  height: 120px;
  background-color: #f5faff;
}`;

export const RESPONSIVE_CSS = `body {
  margin: 0;
}

.karta {
  box-sizing: border-box;
  padding: 16px;
  background-color: #f5faff;
}`;

export const m13: ModuleDef = {
  title: 'Flexbox',
  lessons: [
    {
      slug: 'flexbox',
      title: 'Flexbox bilan tanishuv',
      exercise: {
        title: 'Birinchi flex sarlavha',
        description: 'Konteyner, ikki o‘q va `gap`.',
        instructions: md(
          '1. `.sarlavha`: `display: flex`, `justify-content: space-between`, `align-items: center`.',
          '2. `.menyu`: `display: flex`, `gap: 16px`.',
        ),
        expectedBehavior: 'Logo chapda, menyu o‘ngda, menyu havolalari orasida 16px.',
        difficulty: 'EASY',
        starterFiles: site(BODY13.flexbox, TODO),
        checks: [
          style('flex', 'Sarlavha flex konteyner', '.sarlavha', 'display', 'flex'),
          style(
            'between',
            'Logo va menyu chetlarda',
            '.sarlavha',
            'justify-content',
            'space-between',
          ),
          style('center', 'Vertikal markazda', '.sarlavha', 'align-items', 'center'),
          style('menu', 'Menyu ham flex', '.menyu', 'display', 'flex'),
          style('gap', 'Havolalar orasida 16px', '.menyu', 'column-gap', '16px'),
        ],
      },
    },
    {
      slug: 'flex-container',
      title: 'Flex konteyner',
      exercise: {
        title: 'Teglar, markaz va ustun',
        description: '`flex-wrap`, `justify-content`, `align-items`, `flex-direction`.',
        instructions: md(
          '1. `.teglar`: `display: flex`, `flex-wrap: wrap`, `gap: 8px`.',
          '2. `.markaz`: `display: flex`, `justify-content: center`, `align-items: center`, `min-height: 200px`.',
          '3. `.menyu`: `display: flex`, `flex-direction: column`.',
        ),
        expectedBehavior:
          'Qatorga o‘tuvchi teglar, ikki yo‘nalishda markazlangan matn, ustma-ust menyu.',
        difficulty: 'EASY',
        starterFiles: site(BODY13.container, TODO),
        checks: [
          style('wrap', 'Teglar qatorga o‘tadi', '.teglar', 'flex-wrap', 'wrap'),
          style('gap', 'Teglar orasida 8px', '.teglar', 'row-gap', '8px'),
          style('justify', 'Gorizontal markaz', '.markaz', 'justify-content', 'center'),
          style('align', 'Vertikal markaz', '.markaz', 'align-items', 'center'),
          style('column', 'Menyu ustun', '.menyu', 'flex-direction', 'column'),
        ],
      },
    },
    {
      slug: 'flex-items',
      title: 'Flex elementlar',
      exercise: {
        title: 'O‘sish, siqilish va teng ustunlar',
        description: '`flex-grow`, `flex-shrink`, `flex: 1`, `align-self`.',
        instructions: md(
          '1. `.qator`: `display: flex`, `gap: 12px`. `.qidiruv` bo‘sh joyni egallasin (`flex-grow: 1`), `.logo` siqilmasin (`flex-shrink: 0`).',
          '2. `.ustun` lar matnidan qat’i nazar teng kenglikda bo‘lsin: `flex: 1`.',
          '3. `.pastda` faqat o‘zi pastga tekislansin: `align-self: flex-end`.',
        ),
        expectedBehavior:
          'Qidiruv maydoni keng, logo siqilmaydi, uchta teng ustun, oxirgisi pastda.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY13.items, ITEMS_CSS),
        checks: [
          style('grow', 'Qidiruv o‘sadi', '.qidiruv', 'flex-grow', '1'),
          style('shrink', 'Logo siqilmaydi', '.logo', 'flex-shrink', '0'),
          at(
            900,
            600,
            style('equal', 'Ustunlar teng: 300px', '.ustun', 'width', '300px', {
              hint: '`flex: 1` — `flex-basis: 0%`, shuning uchun matn uzunligi ta’sir qilmaydi.',
            }),
          ),
          style('self', 'Oxirgi ustun pastda', '.pastda', 'align-self', 'flex-end'),
        ],
      },
    },
    {
      slug: 'flex-responsive',
      title: 'Moslashuvchan Flexbox',
      exercise: {
        title: 'Media so‘rovsiz kartochkalar',
        description: '`flex-wrap` + `flex: 1 1 240px` va mobil birinchi menyu.',
        instructions: md(
          '1. `.kartalar`: `display: flex`, `flex-wrap: wrap`, `gap: 16px`. `.karta`: `flex: 1 1 240px`.',
          '2. `.karta`: `display: flex`, `flex-direction: column`; `.tugma`: `margin-top: auto`.',
          '3. `.menyu`: `display: flex`, `flex-direction: column`; `@media (min-width: 768px)` da `row`.',
        ),
        expectedBehavior:
          'Keng ekranda 4 kartochka bir qatorda, telefonda bittadan; menyu telefonda ustma-ust.',
        difficulty: 'HARD',
        starterFiles: site(BODY13.responsive, RESPONSIVE_CSS),
        checks: [
          at(
            1100,
            700,
            style('wide', 'Keng ekranda 4 tadan', '.karta', 'width', '263px', {
              hint: '(1100 − 3 × 16) / 4 = 263px.',
            }),
          ),
          at(400, 700, style('narrow', 'Telefonda bittadan', '.karta', 'width', '400px')),
          style('card', 'Kartochka ichi ustun', '.karta', 'flex-direction', 'column'),
          at(
            375,
            700,
            style('menu-mobile', 'Telefonda menyu ustma-ust', '.menyu', 'flex-direction', 'column'),
          ),
          at(
            1000,
            700,
            style('menu-desktop', 'Katta ekranda menyu qatorda', '.menyu', 'flex-direction', 'row'),
          ),
        ],
      },
      quiz: quiz('13-modul testi: Flexbox', [
        q(
          'q1',
          '`flex-direction: row` da `justify-content` qaysi yo‘nalishni boshqaradi?',
          ['Gorizontal (asosiy o‘q)', 'Vertikal', 'Ikkalasini', 'Hech qaysini'],
          [0],
        ),
        q(
          'q2',
          'Sig‘magan elementlar keyingi qatorga o‘tishi uchun?',
          ['`flex-wrap: wrap`', '`flex-grow: 1`', '`align-content: center`', '`order: 1`'],
          [0],
        ),
        q(
          'q3',
          '`flex: 1` qiymati nimani bildiradi?',
          ['`1 1 0%` — teng ulushlar', '`0 0 auto`', '`1 0 auto`', 'Kenglik 1px'],
          [0],
        ),
        q(
          'q4',
          'Flex konteynerda elementni o‘ng chetga surish usullari?',
          [
            '`margin-left: auto`',
            '`justify-content: flex-end` (yagona element bo‘lsa)',
            '`float: right`',
            '`text-align: right`',
          ],
          [0, 1],
        ),
        q(
          'q5',
          '`order` xususiyati haqida to‘g‘risi?',
          [
            'Faqat ko‘rinishdagi tartibni o‘zgartiradi',
            'Tab tartibini ham o‘zgartiradi',
            'HTML’ni qayta yozadi',
            'Faqat Grid’da ishlaydi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
