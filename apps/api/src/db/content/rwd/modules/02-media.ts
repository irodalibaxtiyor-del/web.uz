import type { ProjectFile } from '@webdizayn/shared';
import { at, md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const LAYOUT = `<div class="maket">
  <main class="asosiy">Maqola matni</main>
  <aside class="yon">Reklama va havolalar</aside>
</div>`;

const LAYOUT_CSS = `${RESET}

.maket {
  display: grid;
  gap: 16px;
}

.asosiy,
.yon {
  padding: 16px;
  border: 1px solid #cbd5e1;
}`;

const MENU = `<nav>
  <ul class="menyu">
    <li><a href="#">Bosh sahifa</a></li>
    <li><a href="#">Kurslar</a></li>
    <li><a href="#">Narxlar</a></li>
    <li><a href="#">Aloqa</a></li>
  </ul>
</nav>`;

const MENU_CSS = `${RESET}

.menyu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.menyu a {
  display: block;
  padding: 12px;
}

@media (min-width: 700px) {
  .menyu {
    flex-direction: row;
  }
}`;

const SCREEN = `<section class="ekran">
  <h1>Ob-havo</h1>
  <div class="malumot">Bugun +18°, ertaga yomg‘ir</div>
</section>`;

const SCREEN_CSS = `${RESET}

.ekran {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

h1 {
  margin: 0;
  font-size: 40px;
}`;

const HIDE = `<header class="sarlavha">
  <button type="button" class="burger faqat-telefon">
    <span class="sr-only">Menyuni ochish</span>
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2"/></svg>
  </button>
  <nav class="faqat-kompyuter">
    <a href="#">Kurslar</a>
    <a href="#">Narxlar</a>
  </nav>
</header>`;

const HIDE_CSS = `${RESET}

.sarlavha {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.faqat-kompyuter {
  gap: 16px;
}`;

const CONTAINER = `<div class="tartib">
  <div class="joy asosiy">
    <article class="karta">
      <div class="rasm"></div>
      <h2>Yangi kurs: Figma’dan kodga</h2>
    </article>
  </div>
  <div class="joy yon">
    <article class="karta">
      <div class="rasm"></div>
      <h2>Yangi kurs: Figma’dan kodga</h2>
    </article>
  </div>
</div>`;

const CONTAINER_CSS = `${RESET}

.tartib {
  display: flex;
  gap: 20px;
  width: 1020px;
}

.asosiy {
  width: 700px;
}

.yon {
  width: 300px;
}

.rasm {
  min-width: 160px;
  height: 100px;
  background-color: #0071dc;
}

.karta h2 {
  font-size: 20px;
}`;

export const m02: ModuleDef = {
  title: 'Media so‘rovlar',
  lessons: [
    {
      slug: 'sorov-sintaksisi',
      title: 'Media so‘rov sintaksisi',
      exercise: {
        title: 'Diapazon yozuvi va bir nechta shart',
        description: '`width >=`, oraliq va `and` bilan so‘rovlar.',
        instructions: md(
          '1. `@media (width >= 768px)`: `.maket` — `grid-template-columns: 2fr 1fr`.',
          '2. `@media (768px <= width < 1024px)`: `.yon` — `background-color: #fff3cd` (faqat planshetda).',
          '3. `@media screen and (min-width: 1024px)`: `.maket` — `gap: 32px`.',
        ),
        expectedBehavior:
          'Telefonda bitta ustun, planshetda ikki ustun va sariq yon panel, kompyuterda kengroq oraliq.',
        difficulty: 'MEDIUM',
        starterFiles: site(LAYOUT, LAYOUT_CSS),
        checks: [
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.maket', 'grid-template-columns', '375px'),
          ),
          at(
            916,
            700,
            style('two', 'Planshetda 2:1', '.maket', 'grid-template-columns', '600px 300px'),
          ),
          at(
            916,
            700,
            style('tablet', 'Planshetda yon panel sariq', '.yon', 'background-color', '#fff3cd'),
          ),
          at(
            1100,
            700,
            style(
              'desktop',
              'Kompyuterda yon panel oq',
              '.yon',
              'background-color',
              'rgba(0, 0, 0, 0)',
              {
                hint: 'Oraliq so‘rov `width < 1024px` bilan yopilishi kerak.',
              },
            ),
          ),
          at(1100, 700, style('gap', 'Kompyuterda oraliq 32px', '.maket', 'column-gap', '32px')),
        ],
      },
    },
    {
      slug: 'tanaffus-nuqtalari',
      title: 'Tanaffus nuqtalarini tanlash',
      exercise: {
        title: '`em` dagi tanaffus nuqtalari',
        description: 'Kontentga qarab tanlangan, shriftga moslashadigan nuqtalar.',
        instructions: md(
          '1. `@media (min-width: 700px)` ni `@media (min-width: 40em)` ga almashtiring (40em = 640px).',
          '2. `@media (min-width: 64em)` qo‘shing: `.menyu a` — `padding: 12px 24px`.',
        ),
        expectedBehavior:
          'Menyu 640px dan boshlab bir qatorga o‘tadi, 1024px dan keyin havolalar kengroq.',
        difficulty: 'EASY',
        starterFiles: site(MENU, MENU_CSS),
        checks: [
          at(639, 700, style('col', '639px da ustun', '.menyu', 'flex-direction', 'column')),
          at(640, 700, style('row', '640px (40em) dan qator', '.menyu', 'flex-direction', 'row')),
          at(
            1023,
            700,
            style('pad-sm', '1023px da oddiy bo‘shliq', '.menyu a', 'padding-left', '12px', {
              hidden: true,
            }),
          ),
          at(
            1024,
            700,
            style('pad-lg', '1024px (64em) dan keng havolalar', '.menyu a', 'padding-left', '24px'),
          ),
        ],
      },
    },
    {
      slug: 'media-xususiyatlari',
      title: 'Media xususiyatlari',
      exercise: {
        title: 'Ekran yo‘nalishi',
        description: '`orientation` va balandlik sharti.',
        instructions: md(
          '1. `@media (orientation: landscape)`: `.ekran` — `flex-direction: row`.',
          '2. `@media (orientation: landscape) and (max-height: 500px)`: `h1` — `font-size: 24px` (telefon yotiq holatda).',
        ),
        expectedBehavior:
          'Tik holatda bloklar ustma-ust, yotiq holatda yonma-yon; past ekranda sarlavha kichikroq.',
        difficulty: 'EASY',
        starterFiles: site(SCREEN, SCREEN_CSS),
        checks: [
          at(
            400,
            800,
            style('portrait', 'Tik holatda ustun', '.ekran', 'flex-direction', 'column'),
          ),
          at(
            800,
            400,
            style('landscape', 'Yotiq holatda qator', '.ekran', 'flex-direction', 'row'),
          ),
          at(800, 400, style('small-h1', 'Past ekranda sarlavha 24px', 'h1', 'font-size', '24px')),
          at(
            1200,
            900,
            style('big-h1', 'Katta yotiq ekranda sarlavha 40px', 'h1', 'font-size', '40px', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'yashirish',
      title: 'Ko‘rsatish va yashirish',
      exercise: {
        title: 'Telefon va kompyuter uchun navigatsiya',
        description: 'Ekranga qarab ko‘rsatish va faqat ekran o‘quvchiga mo‘ljallangan matn.',
        instructions: md(
          '1. `.faqat-kompyuter`: standart holda `display: none`; `@media (min-width: 768px)` da `display: flex`.',
          '2. `@media (min-width: 768px)`: `.faqat-telefon` — `display: none`.',
          '3. `.sr-only` klassini yozing: `position: absolute`, `width: 1px`, `height: 1px`, `overflow: hidden`, `clip-path: inset(50%)`, `white-space: nowrap`.',
        ),
        expectedBehavior:
          'Telefonda faqat burger tugmasi, kompyuterda faqat menyu; tugma yozuvi ko‘rinmaydi, lekin ekran o‘quvchi uni o‘qiydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(HIDE, HIDE_CSS),
        checks: [
          at(
            375,
            700,
            style('nav-sm', 'Telefonda menyu yashirin', '.faqat-kompyuter', 'display', 'none'),
          ),
          at(
            1000,
            700,
            style('nav-lg', 'Kompyuterda menyu flex', '.faqat-kompyuter', 'display', 'flex'),
          ),
          at(
            1000,
            700,
            style('burger-lg', 'Kompyuterda burger yashirin', '.faqat-telefon', 'display', 'none'),
          ),
          style(
            'sr-pos',
            'Yozuv ko‘rinmaydi, lekin DOMda qoladi',
            '.sr-only',
            'position',
            'absolute',
          ),
          style('sr-w', 'Yozuv 1px ga siqilgan', '.sr-only', 'width', '1px', { hidden: true }),
        ],
      },
    },
    {
      slug: 'konteyner-sorovlari',
      title: 'Konteyner so‘rovlari',
      exercise: {
        title: 'Joyiga qarab moslashadigan karta',
        description: '`container-type`, `@container` va `cqi` birligi.',
        instructions: md(
          '1. `.joy`: `container-type: inline-size`.',
          '2. `@container (min-width: 500px)`: `.karta` — `display: flex`, `gap: 16px`.',
          '3. `.karta h2`: `font-size: clamp(1rem, 4cqi, 1.5rem)`.',
        ),
        expectedBehavior:
          'Keng joydagi karta gorizontal, tor joydagisi vertikal; sarlavha joy kengligiga qarab o‘lchanadi.',
        difficulty: 'HARD',
        starterFiles: site(CONTAINER, CONTAINER_CSS),
        checks: [
          style('type', 'Joy — konteyner', '.asosiy', 'container-type', 'inline-size'),
          style('wide', 'Keng joyda karta gorizontal', '.asosiy .karta', 'display', 'flex'),
          style('narrow', 'Tor joyda karta oddiy blok', '.yon .karta', 'display', 'block'),
          style('cqi-lg', 'Keng joyda sarlavha 24px', '.asosiy h2', 'font-size', '24px'),
          style('cqi-sm', 'Tor joyda sarlavha 16px', '.yon h2', 'font-size', '16px', {
            hidden: true,
          }),
        ],
      },
      quiz: quiz('2-modul testi: Media so‘rovlar', [
        q(
          'm2-range',
          '`@media (768px <= width < 1024px)` qachon ishlaydi?',
          [
            'Kenglik 768px va undan katta, lekin 1024px dan kichik bo‘lsa',
            'Faqat aynan 768px yoki 1024px da',
            'Kenglik 1024px dan katta bo‘lsa',
            'Hech qachon — bunday yozuv yo‘q',
          ],
          [0],
        ),
        q(
          'm2-comma',
          'Media so‘rovda vergul nimani bildiradi?',
          ['“Yoki”', '“Va”', '“Emas”', 'Xato yozuv'],
          [0],
        ),
        q(
          'm2-bp',
          'Tanaffus nuqtasini qanday tanlash to‘g‘ri?',
          [
            'Kontent noqulay bo‘la boshlagan kenglikda',
            'Faqat mashhur telefon modellarining kengligida',
            'Har 100px da bittadan',
            'Faqat 1920px da',
          ],
          [0],
        ),
        q(
          'm2-hide',
          'Ko‘zga ko‘rinmasin, lekin ekran o‘quvchi o‘qisin desak, nima ishlatiladi?',
          [
            '`.sr-only` (visually hidden) klassi',
            '`display: none`',
            '`visibility: hidden`',
            '`opacity: 0` va `pointer-events: none`',
          ],
          [0],
        ),
        q(
          'm2-container',
          'Konteyner so‘rovi nimaga qarab ishlaydi? (bir nechta javob)',
          [
            '`container-type` berilgan ota element o‘lchamiga',
            '`cqi` birligi shu konteyner kengligidan hisoblanadi',
            'Butun ekran kengligiga',
            'Qurilma turiga',
          ],
          [0, 1],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  'sorov-sintaksisi': site(
    LAYOUT,
    `${LAYOUT_CSS}

@media (width >= 768px) {
  .maket {
    grid-template-columns: 2fr 1fr;
  }
}

@media (768px <= width < 1024px) {
  .yon {
    background-color: #fff3cd;
  }
}

@media screen and (min-width: 1024px) {
  .maket {
    gap: 32px;
  }
}`,
  ),
  'tanaffus-nuqtalari': site(
    MENU,
    `${MENU_CSS.replace('@media (min-width: 700px)', '@media (min-width: 40em)')}

@media (min-width: 64em) {
  .menyu a {
    padding: 12px 24px;
  }
}`,
  ),
  'media-xususiyatlari': site(
    SCREEN,
    `${SCREEN_CSS}

@media (orientation: landscape) {
  .ekran {
    flex-direction: row;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  h1 {
    font-size: 24px;
  }
}`,
  ),
  yashirish: site(
    HIDE,
    `${HIDE_CSS}

.faqat-kompyuter {
  display: none;
}

@media (min-width: 768px) {
  .faqat-kompyuter {
    display: flex;
  }

  .faqat-telefon {
    display: none;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}`,
  ),
  'konteyner-sorovlari': site(
    CONTAINER,
    `${CONTAINER_CSS.replace('.karta h2 {\n  font-size: 20px;\n}', '.karta h2 {\n  font-size: clamp(1rem, 4cqi, 1.5rem);\n}')}

.joy {
  container-type: inline-size;
}

@container (min-width: 500px) {
  .karta {
    display: flex;
    gap: 16px;
  }
}`,
  ),
};
