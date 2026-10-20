import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  at,
  attr,
  has,
  md,
  pic,
  q,
  quiz,
  RESET,
  site,
  style,
  svgData,
  type ModuleDef,
} from '../../design/shared';

const click = (selector: string) => ({ type: 'click' as const, selector });

const TOKENS = `:root {
  --fon: #fafaf9;
  --matn: #1c1917;
  --xira: #57534e;
  --chegara: #e7e5e4;
  --urg: #c2410c;
}

body {
  background-color: var(--fon);
  color: var(--matn);
}`;

const PROJECTS: [title: string, color: string, text: string][] = [
  ['Kafe sayti', 'b45309', 'Moslashuvchan lending va onlayn menyu.'],
  ['Kutubxona ilovasi', '0f766e', 'Qidiruv va filtrli katalog.'],
  ['Ob-havo vidjeti', '1d4ed8', 'API bilan ishlash va grafik.'],
];

const CARDS = `<section id="ishlar" class="ishlar">
  <h2>Ishlarim</h2>
  <div class="tor">
${PROJECTS.map(
  ([t, c, d]) => `    <article class="loyiha">
      ${pic(c, `${t} skrinshoti`, 800, 600)}
      <h3><a href="#">${t}</a></h3>
      <p>${d}</p>
    </article>`,
).join('\n')}
  </div>
</section>`;

const CARDS_CSS = `${RESET}

${TOKENS}

.ishlar {
  padding: 24px;
}

.loyiha {
  border: 1px solid var(--chegara);
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
}

.loyiha img {
  display: block;
  width: 100%;
  height: auto;
}

.loyiha h3,
.loyiha p {
  margin: 12px 16px;
}`;

const FILTER = `<section class="ishlar">
  <div class="filtrlar" role="group" aria-label="Loyihalarni saralash">
    <button type="button" data-filtr="hammasi" aria-pressed="true">Hammasi</button>
    <button type="button" data-filtr="css" aria-pressed="false">CSS</button>
    <button type="button" data-filtr="js" aria-pressed="false">JavaScript</button>
  </div>
  <div class="tor">
    <article class="ish" data-toifa="css">Kafe lendingi</article>
    <article class="ish" data-toifa="js">Ob-havo vidjeti</article>
    <article class="ish" data-toifa="css">Galereya maketi</article>
    <article class="ish" data-toifa="js">Vazifalar ro‘yxati</article>
  </div>
</section>`;

const FILTER_CSS = `${RESET}

${TOKENS}

.ishlar {
  padding: 24px;
}

.filtrlar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filtrlar button {
  min-height: 40px;
  padding-inline: 16px;
  border: 1px solid var(--chegara);
  border-radius: 999px;
  background: white;
  font: inherit;
}

.tor {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.ish {
  padding: 24px;
  border-radius: 12px;
  background-color: white;
}`;

const FILTER_JS = `const tugmalar = document.querySelectorAll('[data-filtr]');
const ishlar = document.querySelectorAll('.ish');

// Tugma bosilganda:
// 1) faqat shu tugmada aria-pressed="true";
// 2) "hammasi" bo‘lsa hamma ish ko‘rinsin, aks holda faqat shu toifadagilar (qolganlari hidden).`;

const FILTER_JS_DONE = `const tugmalar = document.querySelectorAll('[data-filtr]');
const ishlar = document.querySelectorAll('.ish');

tugmalar.forEach((tugma) => {
  tugma.addEventListener('click', () => {
    const filtr = tugma.dataset.filtr;
    tugmalar.forEach((t) => t.setAttribute('aria-pressed', String(t === tugma)));
    ishlar.forEach((ish) => {
      ish.hidden = filtr !== 'hammasi' && ish.dataset.toifa !== filtr;
    });
  });
});`;

const BIG = [svgData('b45309', 1200, 900), svgData('0f766e', 1200, 900)];

const LIGHTBOX = `<section class="galereya">
  <button type="button" class="kichik" data-katta="${BIG[0]}">
    ${pic('b45309', 'Kafe sayti', 300, 225)}
  </button>
  <button type="button" class="kichik" data-katta="${BIG[1]}">
    ${pic('0f766e', 'Kutubxona ilovasi', 300, 225)}
  </button>
</section>
<dialog class="lightbox" aria-label="Rasmni kattalashtirib ko‘rish">
  <img src="" alt="">
  <button type="button" class="yopish" aria-label="Yopish">
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2"/></svg>
  </button>
</dialog>`;

const LIGHTBOX_CSS = `${RESET}

${TOKENS}

.galereya {
  display: flex;
  gap: 16px;
  padding: 24px;
}

.kichik {
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
}

.kichik img {
  display: block;
  border-radius: 12px;
}

.lightbox {
  padding: 0;
  border: 0;
  background: transparent;
}

.lightbox img {
  display: block;
  max-width: min(90vw, 1000px);
  height: auto;
}

.yopish {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 44px;
  height: 44px;
}`;

const LIGHTBOX_JS = `const oyna = document.querySelector('.lightbox');
const kattaRasm = oyna.querySelector('img');

// 1) .kichik tugma bosilganda: kattaRasm.src = data-katta, alt = kichik rasmning alt i, oyna.showModal().
// 2) .yopish bosilganda: oyna.close().`;

const LIGHTBOX_JS_DONE = `const oyna = document.querySelector('.lightbox');
const kattaRasm = oyna.querySelector('img');

document.querySelectorAll('.kichik').forEach((tugma) => {
  tugma.addEventListener('click', () => {
    kattaRasm.src = tugma.dataset.katta;
    kattaRasm.alt = tugma.querySelector('img').alt;
    oyna.showModal();
  });
});

oyna.querySelector('.yopish').addEventListener('click', () => oyna.close());`;

const CASE = `<article class="loyiha-sahifa">
  <div class="hikoya">
    <h1>Kafe sayti</h1>
    <h2>Vazifa</h2>
    <p>Mahalliy kafe telefon orqali buyurtmalarni ko‘paytirmoqchi edi.</p>
    <h2>Yechim</h2>
    <p>Moslashuvchan lending, onlayn menyu va bir bosishda qo‘ng‘iroq tugmasi.</p>
    <h2>Natija</h2>
    <p>Bir oyda telefon orqali buyurtmalar 30% ga oshdi.</p>
  </div>
  <aside class="malumot">
    <dl>
      <dt>Rol</dt><dd>Dizayn va frontend</dd>
      <dt>Muddat</dt><dd>3 hafta</dd>
      <dt>Texnologiyalar</dt><dd>HTML, CSS, JavaScript</dd>
    </dl>
  </aside>
</article>`;

const CASE_CSS = `${RESET}

${TOKENS}

body {
  padding: 24px;
}

.malumot {
  padding: 16px;
  border: 1px solid var(--chegara);
  border-radius: 12px;
  background-color: white;
}`;

const SLIDES = `<section class="fikrlar">
  <h2>Mijozlar fikri</h2>
  <div class="lenta">
    <figure class="slayd">“Sayt tez va qulay chiqdi.” — Kafe egasi</figure>
    <figure class="slayd">“Muddatda topshirildi.” — Kutubxona</figure>
    <figure class="slayd">“Telefonda juda chiroyli.” — Do‘kon</figure>
  </div>
</section>`;

const SLIDES_CSS = `${RESET}

${TOKENS}

.lenta {
  display: flex;
  gap: 16px;
}

.slayd {
  margin: 0;
  padding: 24px;
  border-radius: 12px;
  background-color: white;
}`;

export const m04: ModuleDef = {
  title: 'Loyihalar',
  lessons: [
    {
      slug: 'loyiha-kartalari',
      title: 'Loyiha kartalari',
      exercise: {
        title: 'Loyihalar galereyasi',
        description: 'Moslashuvchan to‘r, bir xil muqova va butunlay bosiladigan karta.',
        instructions: md(
          '1. `.tor`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr))`, `gap: 24px`.',
          '2. `.loyiha img`: `aspect-ratio: 16 / 10`, `object-fit: cover`.',
          '3. Karta butunlay bosilsin: `.loyiha { position: relative; }` va `.loyiha h3 a::after { content: ""; position: absolute; inset: 0; }`.',
        ),
        expectedBehavior:
          'Kompyuterda uchta karta yonma-yon, telefonda bittadan; muqovalar bir xil nisbatda; kartaning istalgan joyi bosiladi.',
        difficulty: 'MEDIUM',
        starterFiles: site(CARDS, CARDS_CSS),
        checks: [
          at(
            1032,
            700,
            style('cols', 'Uch ustun', '.tor', 'grid-template-columns', '312px 312px 312px'),
          ),
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.tor', 'grid-template-columns', '327px'),
          ),
          style('ratio', 'Muqova 16:10', '.loyiha img', 'aspect-ratio', '16 / 10'),
          style('rel', 'Karta — relative', '.loyiha', 'position', 'relative'),
          style(
            'stretch',
            'Havola butun kartani qoplaydi',
            '.loyiha h3 a',
            'position',
            'absolute',
            { pseudo: '::after' },
          ),
        ],
      },
    },
    {
      slug: 'filtr',
      title: 'Loyihalarni filtrlash',
      exercise: {
        title: 'Toifa bo‘yicha filtr',
        description: '`data-` atributlar, `hidden` va `aria-pressed`.',
        instructions: md(
          '1. `script.js`: filtr tugmasi bosilganda faqat shu tugmada `aria-pressed="true"` bo‘lsin.',
          '2. `hammasi` bo‘lsa barcha `.ish` ko‘rinsin; aks holda `data-toifa` filtrga teng bo‘lmaganlarga `hidden = true`.',
          '3. `style.css`: `.filtrlar [aria-pressed="true"]` — `background-color: var(--urg)`, `color: white`, `border-color: var(--urg)`.',
        ),
        expectedBehavior:
          '“CSS” bosilganda faqat CSS loyihalari qoladi; “Hammasi” hammasini qaytaradi; tanlangan tugma ajralib turadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(FILTER, FILTER_JS, { css: FILTER_CSS }),
        checks: [
          after(
            [click('[data-filtr="css"]')],
            has('hide', 'JS loyihalari yashirildi', '.ish[data-toifa="js"][hidden]', { min: 2 }),
          ),
          after(
            [click('[data-filtr="css"]')],
            has('keep', 'CSS loyihalari ko‘rinadi', '.ish[data-toifa="css"]:not([hidden])', {
              min: 2,
            }),
          ),
          after(
            [click('[data-filtr="css"]')],
            attr(
              'pressed',
              'Tanlangan tugma belgilangan',
              '[data-filtr="css"]',
              'aria-pressed',
              'true',
            ),
          ),
          after(
            [click('[data-filtr="css"]'), click('[data-filtr="hammasi"]')],
            has('all', '“Hammasi” hammasini qaytaradi', '.ish[hidden]', { min: 0, max: 0 }),
          ),
          after(
            [click('[data-filtr="js"]')],
            style(
              'style',
              'Tanlangan tugma rangli',
              '[data-filtr="js"]',
              'background-color',
              '#c2410c',
            ),
          ),
        ],
      },
    },
    {
      slug: 'lightbox',
      title: 'Lightbox: rasmni kattalashtirish',
      exercise: {
        title: '`<dialog>` bilan lightbox',
        description: 'Kichik rasm bosilganda katta rasm modal oynada.',
        instructions: md(
          '`script.js` da:',
          '1. Har bir `.kichik` tugma bosilganda: oynadagi rasmga `src` — tugmaning `data-katta` qiymati, `alt` — kichik rasmning `alt` i; keyin `oyna.showModal()`.',
          '2. `.yopish` bosilganda `oyna.close()` (Esc ni `<dialog>` o‘zi biladi).',
        ),
        expectedBehavior:
          'Rasm bosilganda katta varianti ochiladi, yopish tugmasi yoki Esc bilan yopiladi.',
        difficulty: 'MEDIUM',
        starterFiles: app(LIGHTBOX, LIGHTBOX_JS, { css: LIGHTBOX_CSS }),
        checks: [
          after([click('.kichik')], has('open', 'Oyna ochiladi', 'dialog.lightbox[open]')),
          after(
            [click('.kichik:nth-of-type(2)')],
            attr('alt', 'Katta rasmning alt matni', '.lightbox img', 'alt', 'Kutubxona ilovasi'),
          ),
          after(
            [click('.kichik')],
            has('src', 'Katta rasm yuklanadi', '.lightbox img[src^="data:image/svg+xml"]'),
          ),
          after(
            [click('.kichik'), click('.yopish')],
            has('close', 'Yopish tugmasi yopadi', 'dialog.lightbox[open]', { min: 0, max: 0 }),
          ),
        ],
      },
    },
    {
      slug: 'loyiha-sahifasi',
      title: 'Loyiha sahifasi (case study)',
      exercise: {
        title: 'Hikoya va yopishqoq ma’lumot paneli',
        description: 'Ikki ustunli o‘qish maketi.',
        instructions: md(
          '1. `.loyiha-sahifa`: `display: grid`, `gap: 48px`; `@media (min-width: 1024px)` — `grid-template-columns: 1fr 280px`.',
          '2. `.malumot`: `position: sticky`, `top: 96px`, `align-self: start`.',
          '3. `.hikoya`: `max-width: 65ch`.',
        ),
        expectedBehavior:
          'Kompyuterda hikoya chapda, ma’lumot paneli o‘ngda va aylantirganda ko‘rinib turadi; telefonda ustma-ust.',
        difficulty: 'MEDIUM',
        starterFiles: site(CASE, CASE_CSS),
        checks: [
          at(
            1280,
            800,
            style(
              'cols',
              'Kompyuterda ikki ustun',
              '.loyiha-sahifa',
              'grid-template-columns',
              '904px 280px',
            ),
          ),
          at(
            375,
            700,
            style(
              'one',
              'Telefonda bitta ustun',
              '.loyiha-sahifa',
              'grid-template-columns',
              '327px',
            ),
          ),
          style('sticky', 'Panel yopishqoq', '.malumot', 'position', 'sticky'),
          style('top', 'Header ostida qoladi', '.malumot', 'top', '96px'),
          style('align', 'Panel cho‘zilmaydi', '.malumot', 'align-self', 'start'),
        ],
      },
    },
    {
      slug: 'karusel',
      title: 'CSS karusel',
      exercise: {
        title: 'Scroll-snap bilan slayder',
        description: 'JavaScript’siz gorizontal aylanadigan lenta.',
        instructions: md(
          '1. `.lenta`: `overflow-x: auto`, `scroll-snap-type: x mandatory`, `padding-bottom: 8px`.',
          '2. `.slayd`: `flex: 0 0 80%`, `scroll-snap-align: start`.',
          '3. `@media (min-width: 768px)`: `.slayd` — `flex-basis: 45%`.',
        ),
        expectedBehavior:
          'Fikrlar lentasi barmoq bilan suriladi va har bir slayd chetga “yopishib” to‘xtaydi.',
        difficulty: 'EASY',
        starterFiles: site(SLIDES, SLIDES_CSS),
        checks: [
          style('snap', 'Lenta yopishib to‘xtaydi', '.lenta', 'scroll-snap-type', 'x mandatory'),
          style('align', 'Slayd boshidan tekislanadi', '.slayd', 'scroll-snap-align', 'start'),
          style('scroll', 'Lenta o‘zi aylanadi', '.lenta', 'overflow-x', 'auto'),
          at(400, 700, style('sm', 'Telefonda slayd 80%', '.slayd', 'width', '320px')),
          at(1000, 700, style('lg', 'Kengroq ekranda 45%', '.slayd', 'width', '450px')),
        ],
      },
      quiz: quiz('4-modul testi: Loyihalar', [
        q(
          'p4-story',
          'Loyiha sahifasida qaysi tuzilma yaxshi ishlaydi?',
          [
            'Vazifa → yechim → natija (va sizning rolingiz)',
            'Faqat skrinshotlar',
            'Faqat texnologiyalar ro‘yxati',
            'Kodning to‘liq nusxasi',
          ],
          [0],
        ),
        q(
          'p4-stretch',
          '“Cho‘zilgan havola” (stretched link) usulining afzalligi?',
          [
            'Kartada bitta havola qoladi, lekin kartaning istalgan joyi bosiladi',
            'Har bir element alohida havola bo‘ladi',
            'Havola yashirinadi',
            'JavaScript kerak bo‘lmaydi — boshqa farqi yo‘q',
          ],
          [0],
        ),
        q(
          'p4-hidden',
          'Filtrlangan elementni yashirish uchun `hidden` atributi nimasi bilan qulay?',
          [
            'Element ko‘rinishdan ham, ekran o‘quvchidan ham yashiriladi va holat HTML’da ko‘rinadi',
            'Element o‘chirib yuboriladi',
            'Element shaffof bo‘ladi, lekin bosiladi',
            'Faqat ekran o‘quvchidan yashiriladi',
          ],
          [0],
        ),
        q(
          'p4-dialog',
          'Lightbox uchun `<dialog>` va `showModal()` nima beradi? (bir nechta javob)',
          [
            'Esc bilan yopish',
            'Fokus oyna ichida ushlanadi',
            'Orqa sahifa bosilmaydi',
            'Rasm avtomatik siqiladi',
          ],
          [0, 1, 2],
        ),
        q(
          'p4-snap',
          '`scroll-snap-type: x mandatory` nima qiladi?',
          [
            'Gorizontal aylantirish to‘xtaganda eng yaqin slayd chetiga yopishadi',
            'Lentani avtomatik aylantiradi',
            'Aylantirishni taqiqlaydi',
            'Slaydlarni vertikal qiladi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s04: Record<string, ProjectFile[]> = {
  'loyiha-kartalari': site(
    CARDS,
    `${CARDS_CSS.replace(
      '.loyiha {\n  border:',
      '.loyiha {\n  position: relative;\n  border:',
    ).replace(
      '  height: auto;\n}',
      '  height: auto;\n  aspect-ratio: 16 / 10;\n  object-fit: cover;\n}',
    )}

.tor {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 24px;
}

.loyiha h3 a::after {
  content: "";
  position: absolute;
  inset: 0;
}`,
  ),
  filtr: app(FILTER, FILTER_JS_DONE, {
    css: `${FILTER_CSS}

.filtrlar [aria-pressed="true"] {
  background-color: var(--urg);
  color: white;
  border-color: var(--urg);
}`,
  }),
  lightbox: app(LIGHTBOX, LIGHTBOX_JS_DONE, { css: LIGHTBOX_CSS }),
  'loyiha-sahifasi': site(
    CASE,
    `${CASE_CSS}

.loyiha-sahifa {
  display: grid;
  gap: 48px;
}

.hikoya {
  max-width: 65ch;
}

.malumot {
  position: sticky;
  top: 96px;
  align-self: start;
}

@media (min-width: 1024px) {
  .loyiha-sahifa {
    grid-template-columns: 1fr 280px;
  }
}`,
  ),
  karusel: site(
    SLIDES,
    `${SLIDES_CSS}

.lenta {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
}

.slayd {
  flex: 0 0 80%;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .slayd {
    flex-basis: 45%;
  }
}`,
  ),
};
