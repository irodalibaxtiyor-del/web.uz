import type { ProjectFile } from '@webdizayn/shared';
import { at, md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const COLUMNS = `<div class="qator">
  <article class="ustun ustun-9">
    <h2>Yangiliklar</h2>
    <p>Platformaga uchta yangi kurs qo‘shildi.</p>
  </article>
  <aside class="ustun ustun-3">
    <h2>E’lonlar</h2>
    <p>Shanba kuni ochiq dars.</p>
  </aside>
</div>`;

const COLUMNS_CSS = `${RESET}

.ustun {
  padding: 12px;
}

.ustun-9 {
  float: left;
  width: 75%;
}

.ustun-3 {
  float: left;
  width: 25%;
}`;

const FEATURES = `<ul class="xususiyatlar">
  <li class="xususiyat">Har darsda mashq</li>
  <li class="xususiyat">Natija darhol tekshiriladi</li>
  <li class="xususiyat">O‘qituvchi izohi</li>
  <li class="xususiyat">Portfolio uchun loyiha</li>
</ul>`;

const FEATURES_CSS = `${RESET}

.xususiyatlar {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.xususiyat {
  width: 220px;
  flex-shrink: 0;
  padding: 16px;
  background-color: #eef6ff;
}`;

const GALLERY = `<div class="galereya">
${Array.from({ length: 6 }, (_, i) => `  <div class="ish">Ish ${i + 1}</div>`).join('\n')}
</div>`;

const GALLERY_CSS = `${RESET}

.galereya {
  display: grid;
  grid-template-columns: repeat(4, 250px);
  gap: 20px;
}

.ish {
  min-height: 120px;
  padding: 16px;
  background-color: #eef6ff;
}`;

const AREAS = `<div class="sahifa">
  <header>Sarlavha</header>
  <nav>Menyu</nav>
  <main>Asosiy kontent</main>
  <aside>Yon panel</aside>
  <footer>Pastki qism</footer>
</div>`;

const AREAS_CSS = `${RESET}

.sahifa {
  display: grid;
  gap: 16px;
}

.sahifa > * {
  padding: 16px;
  background-color: #eef6ff;
}`;

const GRAIL = `<div class="sahifa">
  <header class="bosh">WEBDIZAYN.UZ</header>
  <nav class="chap">Bo‘limlar</nav>
  <main class="markaz">Maqola</main>
  <aside class="ong">Reklama</aside>
  <footer class="oxir">© 2026</footer>
</div>`;

const GRAIL_CSS = `${RESET}

.sahifa > * {
  padding: 16px;
  background-color: #eef6ff;
}`;

export const m03: ModuleDef = {
  title: 'Maketlar',
  lessons: [
    {
      slug: 'ustunlar',
      title: 'Moslashuvchan ustunlar',
      exercise: {
        title: 'Foizli ustunlar va media so‘rov',
        description: 'Float’dan Flexbox’ga va avval mobil ustunlar.',
        instructions: md(
          '1. `.ustun-9` va `.ustun-3` dagi `float` va `width` ni olib tashlang.',
          '2. `.qator`: `display: flex`, `flex-wrap: wrap`; `.ustun`: `width: 100%`.',
          '3. `@media (min-width: 768px)`: `.ustun-9` — `width: 75%` (12 dan 9), `.ustun-3` — `width: 25%` (12 dan 3).',
        ),
        expectedBehavior: 'Telefonda ustunlar ustma-ust, planshetdan boshlab 3/4 va 1/4.',
        difficulty: 'EASY',
        starterFiles: site(COLUMNS, COLUMNS_CSS),
        checks: [
          style('flex', 'Qator flex', '.qator', 'display', 'flex'),
          at(
            375,
            700,
            style('main-sm', 'Telefonda asosiy ustun to‘liq', '.ustun-9', 'width', '375px'),
          ),
          at(
            900,
            700,
            style('main-lg', 'Planshetda asosiy ustun 3/4', '.ustun-9', 'width', '675px'),
          ),
          at(900, 700, style('side-lg', 'Planshetda yon ustun 1/4', '.ustun-3', 'width', '225px')),
        ],
      },
    },
    {
      slug: 'flex-orash',
      title: 'Flexbox bilan o‘rash',
      exercise: {
        title: 'O‘zi qatorga tushadigan bloklar',
        description: '`flex-wrap` va `flex: 1 1 220px`.',
        instructions: md(
          '1. `.xususiyatlar`: `flex-wrap: wrap`.',
          '2. `.xususiyat` dan `width` va `flex-shrink` ni olib tashlang, o‘rniga `flex: 1 1 220px` yozing.',
        ),
        expectedBehavior:
          'Keng ekranda to‘rtta blok bir qatorda, o‘rtacha ekranda ikkitadan, telefonda bittadan.',
        difficulty: 'EASY',
        starterFiles: site(FEATURES, FEATURES_CSS),
        checks: [
          style('wrap', 'Bloklar o‘raladi', '.xususiyatlar', 'flex-wrap', 'wrap'),
          at(1000, 700, style('four', 'Keng ekranda to‘rttadan', '.xususiyat', 'width', '238px')),
          at(500, 700, style('two', 'O‘rtacha ekranda ikkitadan', '.xususiyat', 'width', '242px')),
          at(375, 700, style('one', 'Telefonda bittadan', '.xususiyat', 'width', '375px')),
        ],
      },
    },
    {
      slug: 'grid-auto-fit',
      title: 'Grid: auto-fit va minmax()',
      exercise: {
        title: 'Media so‘rovsiz galereya',
        description: '`repeat(auto-fit, minmax(min(100%, 250px), 1fr))`.',
        instructions: md(
          '1. `.galereya` da `grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr))` yozing.',
          '2. Natijani 1100px, 375px va juda tor (240px) oynada tekshiring.',
        ),
        expectedBehavior:
          'Ustunlar soni joyga qarab o‘zi o‘zgaradi; juda tor ekranda ham blok ekrandan chiqmaydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(GALLERY, GALLERY_CSS),
        checks: [
          at(
            1100,
            700,
            style(
              'wide',
              'Keng ekranda 4 ustun',
              '.galereya',
              'grid-template-columns',
              '260px 260px 260px 260px',
            ),
          ),
          at(
            560,
            700,
            style('mid', '560px da 2 ustun', '.galereya', 'grid-template-columns', '270px 270px'),
          ),
          at(
            375,
            700,
            style('phone', 'Telefonda 1 ustun', '.galereya', 'grid-template-columns', '375px'),
          ),
          at(
            240,
            600,
            style(
              'tiny',
              'Juda tor ekranda ham sig‘adi',
              '.galereya',
              'grid-template-columns',
              '240px',
              {
                hint: '`minmax(250px, 1fr)` 250px dan torroq ekranda chiqib ketadi — `min(100%, 250px)` yozing.',
              },
            ),
          ),
        ],
      },
    },
    {
      slug: 'maket-hududlari',
      title: 'Maketni hududlar bilan almashtirish',
      exercise: {
        title: '`grid-template-areas` va media so‘rov',
        description: 'Bir HTML — ikki xil maket.',
        instructions: md(
          '1. `header`, `nav`, `main`, `aside`, `footer` ga `grid-area` bilan bir xil nom bering (`header`, `nav`, `main`, `aside`, `footer`).',
          '2. Standart holda `.sahifa`: `grid-template-areas: "header" "nav" "main" "aside" "footer"`.',
          '3. `@media (min-width: 768px)`: `grid-template-columns: 240px 1fr` va `grid-template-areas: "header header" "nav main" "aside main" "footer footer"`.',
        ),
        expectedBehavior:
          'Telefonda hamma bo‘lim ustma-ust, planshetdan boshlab chapda menyu va yon panel.',
        difficulty: 'MEDIUM',
        starterFiles: site(AREAS, AREAS_CSS),
        checks: [
          style('area', '`main` o‘z hududida', 'main', 'grid-column-start', 'main'),
          at(
            375,
            700,
            style(
              'mobile',
              'Telefonda ustma-ust',
              '.sahifa',
              'grid-template-areas',
              '"header" "nav" "main" "aside" "footer"',
            ),
          ),
          at(
            900,
            700,
            style(
              'desktop',
              'Planshetda ikki ustunli maket',
              '.sahifa',
              'grid-template-areas',
              '"header header" "nav main" "aside main" "footer footer"',
            ),
          ),
          at(
            900,
            700,
            style('cols', 'Chap ustun 240px', '.sahifa', 'grid-template-columns', '240px 644px'),
          ),
        ],
      },
    },
    {
      slug: 'muqaddas-grail',
      title: '“Muqaddas grail” maketi',
      exercise: {
        title: 'Uch ustun va pastga yopishgan footer',
        description: 'Klassik sahifa maketi Grid bilan.',
        instructions: md(
          '1. `.sahifa`: `display: grid`, `gap: 8px`, `min-height: 100dvh`, `grid-template-rows: auto 1fr auto auto auto` (telefonda: sarlavha, asosiy, chap, o‘ng, footer).',
          '2. Telefonda tartib: `.bosh`, `.markaz`, `.chap`, `.ong`, `.oxir` — `.markaz` ga `order: -1`, `.bosh` ga `order: -2` bering.',
          '3. `@media (min-width: 900px)`: `grid-template-columns: 200px 1fr 200px`, `grid-template-rows: auto 1fr auto`; `.bosh` va `.oxir` — `grid-column: 1 / -1`; `.markaz` va `.bosh` uchun `order: 0`.',
        ),
        expectedBehavior:
          'Telefonda asosiy kontent menyudan oldin; kompyuterda uch ustun, footer har doim ekran pastida.',
        difficulty: 'HARD',
        starterFiles: site(GRAIL, GRAIL_CSS),
        checks: [
          at(
            1280,
            800,
            style(
              'cols',
              'Kompyuterda uch ustun',
              '.sahifa',
              'grid-template-columns',
              '200px 864px 200px',
            ),
          ),
          at(
            1280,
            800,
            style('tall', 'Sahifa kamida ekran balandligida', '.sahifa', 'min-height', '800px'),
          ),
          at(
            1280,
            800,
            style('span', 'Sarlavha butun kenglikda', '.bosh', 'grid-column-end', '-1'),
          ),
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.sahifa', 'grid-template-columns', '375px'),
          ),
          at(375, 700, style('order', 'Telefonda maqola menyudan oldin', '.markaz', 'order', '-1')),
        ],
      },
      quiz: quiz('3-modul testi: Maketlar', [
        q(
          'm3-wrap',
          '`flex: 1 1 220px` nimani anglatadi?',
          [
            'Asosiy o‘lcham 220px, bo‘sh joy bo‘lsa kengayadi, tor bo‘lsa qisqaradi',
            'Kenglik doim 220px',
            'Blok faqat kengayadi, hech qachon qisqarmaydi',
            'Uchta blok bir qatorga sig‘adi',
          ],
          [0],
        ),
        q(
          'm3-autofit',
          '`auto-fit` va `auto-fill` farqi?',
          [
            '`auto-fit` bo‘sh ustunlarni yig‘ib, elementlarni cho‘zadi; `auto-fill` bo‘sh ustunlarni saqlaydi',
            'Hech qanday farq yo‘q',
            '`auto-fill` faqat Flexbox’da ishlaydi',
            '`auto-fit` media so‘rov talab qiladi',
          ],
          [0],
        ),
        q(
          'm3-minmax',
          'Nega `minmax(250px, 1fr)` o‘rniga `minmax(min(100%, 250px), 1fr)` yoziladi?',
          [
            '250px dan tor ekranda ustun ekrandan chiqib ketmasligi uchun',
            'Ustunlar soni ko‘payishi uchun',
            'Brauzer tezroq chizishi uchun',
            'Bu majburiy sintaksis',
          ],
          [0],
        ),
        q(
          'm3-areas',
          '`grid-template-areas` ning afzalliklari? (bir nechta javob)',
          [
            'Maketni media so‘rovda bitta xususiyat bilan almashtirish mumkin',
            'Maket CSS’da “rasm” kabi o‘qiladi',
            'HTML tartibini o‘zgartirish shart emas',
            'Ekran o‘quvchi tartibi ham avtomatik o‘zgaradi',
          ],
          [0, 1, 2],
        ),
        q(
          'm3-order',
          '`order` bilan vizual tartibni o‘zgartirishning xavfi nima?',
          [
            'Klaviatura va ekran o‘quvchi tartibi HTML’dagidek qoladi',
            'Sahifa sekinlashadi',
            'Grid ishlamay qoladi',
            'Hech qanday xavf yo‘q',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  ustunlar: site(
    COLUMNS,
    `${RESET}

.qator {
  display: flex;
  flex-wrap: wrap;
}

.ustun {
  width: 100%;
  padding: 12px;
}

@media (min-width: 768px) {
  .ustun-9 {
    width: 75%;
  }

  .ustun-3 {
    width: 25%;
  }
}`,
  ),
  'flex-orash': site(
    FEATURES,
    `${RESET}

.xususiyatlar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.xususiyat {
  flex: 1 1 220px;
  padding: 16px;
  background-color: #eef6ff;
}`,
  ),
  'grid-auto-fit': site(
    GALLERY,
    GALLERY_CSS.replace('repeat(4, 250px)', 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))'),
  ),
  'maket-hududlari': site(
    AREAS,
    `${AREAS_CSS.replace('gap: 16px;', 'gap: 16px;\n  grid-template-areas: "header" "nav" "main" "aside" "footer";')}

header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; }
aside { grid-area: aside; }
footer { grid-area: footer; }

@media (min-width: 768px) {
  .sahifa {
    grid-template-columns: 240px 1fr;
    grid-template-areas:
      "header header"
      "nav main"
      "aside main"
      "footer footer";
  }
}`,
  ),
  'muqaddas-grail': site(
    GRAIL,
    `${GRAIL_CSS}

.sahifa {
  display: grid;
  gap: 8px;
  min-height: 100dvh;
  grid-template-rows: auto 1fr auto auto auto;
}

.bosh {
  order: -2;
}

.markaz {
  order: -1;
}

@media (min-width: 900px) {
  .sahifa {
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
  }

  .bosh,
  .oxir {
    grid-column: 1 / -1;
  }

  .bosh,
  .markaz {
    order: 0;
  }
}`,
  ),
};
