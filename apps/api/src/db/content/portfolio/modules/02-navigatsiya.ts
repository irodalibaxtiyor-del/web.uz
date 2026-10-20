import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  at,
  attr,
  has,
  md,
  q,
  quiz,
  RESET,
  site,
  style,
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

const HERO = `<section id="bosh" class="bosh">
  <p class="salom">Salom, men</p>
  <h1>Aziza Karimova</h1>
  <p class="rol">Frontend dasturchi: tez, qulay va chiroyli sahifalar yasayman.</p>
  <div class="tugmalar">
    <a class="tugma asosiy" href="#ishlar">Ishlarimni ko‘rish</a>
    <a class="tugma" href="#aloqa">Bog‘lanish</a>
  </div>
</section>`;

const HERO_CSS = `${RESET}

${TOKENS}

.bosh {
  padding: 48px 24px;
}

.salom {
  margin: 0;
  color: var(--urg);
  font-weight: 600;
}

h1 {
  margin: 8px 0;
}

.rol {
  max-width: 36rem;
  color: var(--xira);
}

.tugmalar {
  display: flex;
  gap: 12px;
}

.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: 20px;
  border: 1px solid var(--urg);
  border-radius: 999px;
  color: var(--urg);
  text-decoration: none;
}

.asosiy {
  color: white;
  background-color: var(--urg);
}`;

const STICKY = `<header class="sarlavha">
  <a class="logo" href="#bosh">AK</a>
  <nav aria-label="Asosiy">
    <a href="#ishlar">Ishlarim</a>
    <a href="#aloqa">Aloqa</a>
  </nav>
</header>
<main>
  <section id="bosh"><h1>Aziza Karimova</h1></section>
  <section id="ishlar"><h2>Ishlarim</h2></section>
  <section id="aloqa"><h2>Aloqa</h2></section>
</main>`;

const STICKY_CSS = `${RESET}

${TOKENS}

.sarlavha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

nav {
  display: flex;
  gap: 24px;
}

section {
  min-height: 80vh;
  padding: 24px;
}`;

const MOBILE = `<header class="sarlavha">
  <a class="logo" href="#bosh">AK</a>
  <button type="button" class="burger" aria-expanded="false" aria-controls="menyu" aria-label="Menyu">
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2"/></svg>
  </button>
  <nav id="menyu" class="menyu" aria-label="Asosiy">
    <a href="#ishlar">Ishlarim</a>
    <a href="#haqimda">Men haqimda</a>
    <a href="#aloqa">Aloqa</a>
  </nav>
</header>
<main>
  <section id="ishlar"><h2>Ishlarim</h2></section>
  <section id="haqimda"><h2>Men haqimda</h2></section>
  <section id="aloqa"><h2>Aloqa</h2></section>
</main>`;

const MOBILE_CSS = `${RESET}

${TOKENS}

.sarlavha {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
}

.burger {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
}

.menyu {
  display: none;
  flex-basis: 100%;
  flex-direction: column;
}

.menyu.ochiq {
  display: flex;
}

.menyu a {
  padding: 12px 0;
}

section {
  min-height: 60vh;
  padding: 16px;
}

@media (min-width: 768px) {
  .burger {
    display: none;
  }

  .menyu {
    display: flex;
    flex-basis: auto;
    flex-direction: row;
    gap: 24px;
  }
}`;

const MOBILE_JS = `const burger = document.querySelector('.burger');
const menyu = document.querySelector('#menyu');

// 1) Burger bosilganda menyuni oching/yoping (ochiq klassi + aria-expanded).
// 2) Menyudagi havola bosilganda menyuni yoping.
// 3) Escape bosilganda menyuni yoping va fokusni burgerga qaytaring.`;

const MOBILE_JS_DONE = `const burger = document.querySelector('.burger');
const menyu = document.querySelector('#menyu');

function yopish() {
  menyu.classList.remove('ochiq');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => {
  const ochiq = burger.getAttribute('aria-expanded') === 'true';
  if (ochiq) {
    yopish();
  } else {
    menyu.classList.add('ochiq');
    burger.setAttribute('aria-expanded', 'true');
  }
});

menyu.addEventListener('click', (e) => {
  if (e.target.closest('a')) yopish();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menyu.classList.contains('ochiq')) {
    yopish();
    burger.focus();
  }
});`;

const ACTIVE = `<nav class="menyu" aria-label="Asosiy">
  <a href="#ishlar">Ishlarim</a>
  <a href="#haqimda">Men haqimda</a>
  <a href="#aloqa">Aloqa</a>
</nav>
<main>
  <section id="ishlar"><h2>Ishlarim</h2></section>
  <section id="haqimda"><h2>Men haqimda</h2></section>
  <section id="aloqa"><h2>Aloqa</h2></section>
</main>`;

const ACTIVE_CSS = `${RESET}

${TOKENS}

.menyu {
  display: flex;
  gap: 24px;
  padding: 16px 24px;
}

.menyu a {
  color: var(--xira);
  text-decoration: none;
}

section {
  min-height: 60vh;
  padding: 24px;
}`;

const ACTIVE_JS = `const havolalar = document.querySelectorAll('.menyu a');

// Havola bosilganda: faqat shu havolada aria-current="true" bo‘lsin.`;

const ACTIVE_JS_DONE = `const havolalar = document.querySelectorAll('.menyu a');

havolalar.forEach((havola) => {
  havola.addEventListener('click', () => {
    havolalar.forEach((h) => h.removeAttribute('aria-current'));
    havola.setAttribute('aria-current', 'true');
  });
});`;

export const m02: ModuleDef = {
  title: 'Bosh ekran va navigatsiya',
  lessons: [
    {
      slug: 'hero',
      title: 'Bosh ekran',
      exercise: {
        title: 'Birinchi taassurot',
        description: 'Ekran balandligidagi markazlangan bo‘lim va suyuq sarlavha.',
        instructions: md(
          '1. `.bosh`: `display: grid`, `align-content: center`, `min-height: calc(100dvh - 64px)` (header uchun joy).',
          '2. `h1`: `font-size: clamp(2.25rem, 1.5rem + 3vw, 4rem)`, `line-height: 1.05`.',
          '3. `.tugmalar`: `flex-wrap: wrap`.',
        ),
        expectedBehavior:
          'Bosh ekran deyarli butun ekranni egallaydi, ism katta va markazda; tor ekranda tugmalar o‘raladi.',
        difficulty: 'EASY',
        starterFiles: site(HERO, HERO_CSS),
        checks: [
          style('grid', 'Bo‘lim grid', '.bosh', 'display', 'grid'),
          at(
            1280,
            800,
            style('height', 'Ekran balandligi (header’siz)', '.bosh', 'min-height', '736px'),
          ),
          at(320, 700, style('h1-sm', 'Telefonda ism 36px', 'h1', 'font-size', '36px')),
          at(1600, 900, style('h1-lg', 'Katta ekranda ism 64px', 'h1', 'font-size', '64px')),
          style('wrap', 'Tugmalar o‘raladi', '.tugmalar', 'flex-wrap', 'wrap'),
        ],
      },
    },
    {
      slug: 'sticky-nav',
      title: 'Yopishqoq navigatsiya',
      exercise: {
        title: 'Ekran tepasida qoladigan header',
        description: '`position: sticky`, qatlam tartibi va shaffof fon.',
        instructions: md(
          '`.sarlavha`:',
          '1. `position: sticky`, `top: 0`, `z-index: 10`.',
          '2. `background-color: rgb(250 250 249 / 0.9)`, `backdrop-filter: blur(8px)`.',
          '3. `border-bottom: 1px solid var(--chegara)`.',
        ),
        expectedBehavior:
          'Sahifa aylantirilganda header tepada qoladi, ostidagi kontent biroz xiralashib ko‘rinadi.',
        difficulty: 'EASY',
        starterFiles: site(STICKY, STICKY_CSS),
        checks: [
          style('sticky', 'Header yopishqoq', '.sarlavha', 'position', 'sticky'),
          style('top', 'Tepaga yopishadi', '.sarlavha', 'top', '0px'),
          style('z', 'Kontent ustida', '.sarlavha', 'z-index', '10'),
          style('blur', 'Fon xiralashadi', '.sarlavha', 'backdrop-filter', 'blur(8px)'),
          style('line', 'Pastki chiziq', '.sarlavha', 'border-bottom-color', '#e7e5e4'),
        ],
      },
    },
    {
      slug: 'mobil-menyu',
      title: 'Mobil menyu',
      exercise: {
        title: 'O‘zi yopiladigan menyu',
        description: 'Burger, havola bosilganda yopilish va Esc.',
        instructions: md(
          '`script.js` da:',
          '1. Burger bosilganda `#menyu` ga `ochiq` klassini qo‘shing/olib tashlang va `aria-expanded` ni yangilang.',
          '2. Menyudagi havola bosilganda menyuni yoping (bir sahifali saytda foydalanuvchi bo‘limga o‘tadi va menyu yo‘lni to‘sib qolmaydi).',
          '3. Escape bosilganda menyuni yoping va fokusni burgerga qaytaring.',
        ),
        expectedBehavior:
          'Telefonda burger menyuni ochadi; havolani tanlash yoki Esc menyuni yopadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(MOBILE, MOBILE_JS, { css: MOBILE_CSS }),
        checks: [
          at(
            375,
            700,
            after(
              [click('.burger')],
              style('open', 'Burger menyuni ochadi', '#menyu', 'display', 'flex'),
            ),
          ),
          at(
            375,
            700,
            after(
              [click('.burger')],
              attr('aria', '`aria-expanded` — true', '.burger', 'aria-expanded', 'true'),
            ),
          ),
          at(
            375,
            700,
            after(
              [click('.burger'), click('#menyu a[href="#aloqa"]')],
              style('close', 'Havola bosilganda yopiladi', '#menyu', 'display', 'none'),
            ),
          ),
          at(
            375,
            700,
            after(
              [click('.burger'), { type: 'press', selector: 'body', key: 'Escape' }],
              style('esc', 'Esc menyuni yopadi', '#menyu', 'display', 'none'),
            ),
          ),
          at(
            1000,
            700,
            style('desktop', 'Kompyuterda menyu doim ko‘rinadi', '#menyu', 'display', 'flex', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'aktiv-bolim',
      title: 'Faol bo‘limni belgilash',
      exercise: {
        title: '`aria-current` bilan faol havola',
        description: 'Joriy bo‘limni ham ko‘rinishda, ham ekran o‘quvchi uchun belgilash.',
        instructions: md(
          '1. `script.js`: havola bosilganda barcha havolalardan `aria-current` ni olib tashlang va bosilganiga `aria-current="true"` qo‘ying.',
          '2. `style.css`: `.menyu a[aria-current="true"]` — `color: var(--urg)`, `font-weight: 600`, `text-decoration: underline`, `text-underline-offset: 6px`.',
        ),
        expectedBehavior: 'Bosilgan havola urg‘u rangida va chizilgan, boshqalari oddiy.',
        difficulty: 'EASY',
        starterFiles: app(ACTIVE, ACTIVE_JS, { css: ACTIVE_CSS }),
        checks: [
          after(
            [click('.menyu a[href="#haqimda"]')],
            attr(
              'current',
              'Bosilgan havola joriy',
              '.menyu a[href="#haqimda"]',
              'aria-current',
              'true',
            ),
          ),
          after(
            [click('.menyu a[href="#ishlar"]'), click('.menyu a[href="#haqimda"]')],
            has('one', 'Faqat bitta havola joriy', '.menyu a[aria-current]', { min: 1, max: 1 }),
          ),
          after(
            [click('.menyu a[href="#haqimda"]')],
            style('color', 'Joriy havola rangli', '.menyu a[href="#haqimda"]', 'color', '#c2410c'),
          ),
          after(
            [click('.menyu a[href="#haqimda"]')],
            style(
              'weight',
              'Joriy havola qalin',
              '.menyu a[href="#haqimda"]',
              'font-weight',
              '600',
            ),
          ),
        ],
      },
      quiz: quiz('2-modul testi: Bosh ekran va navigatsiya', [
        q(
          'p2-hero',
          'Bosh ekranda birinchi navbatda nima bo‘lishi kerak?',
          [
            'Kimligingiz, nima qilishingiz va asosiy harakat (tugma)',
            'Barcha loyihalar ro‘yxati',
            'Katta animatsiya',
            'Faqat fotosurat',
          ],
          [0],
        ),
        q(
          'p2-sticky',
          '`position: sticky` ishlashi uchun nima kerak?',
          [
            '`top` (yoki boshqa chet) qiymati berilishi',
            '`position: absolute` ota element',
            'JavaScript',
            '`display: flex`',
          ],
          [0],
        ),
        q(
          'p2-z',
          'Yopishqoq header nega `z-index` oladi?',
          [
            'Aylantirilganda ostidagi kontent uning ustidan chiqmasligi uchun',
            'Header kattaroq ko‘rinishi uchun',
            'Sahifa tezlashishi uchun',
            'Bu majburiy emas va hech qanday ta’siri yo‘q',
          ],
          [0],
        ),
        q(
          'p2-menu',
          'Yaxshi mobil menyu qachon yopilishi kerak? (bir nechta javob)',
          [
            'Burger qayta bosilganda',
            'Menyudagi havola tanlanganda',
            'Escape bosilganda',
            'Hech qachon — foydalanuvchi o‘zi sahifani yangilaydi',
          ],
          [0, 1, 2],
        ),
        q(
          'p2-current',
          '`aria-current="true"` nima beradi?',
          [
            'Ekran o‘quvchi bu havolani “joriy” deb e’lon qiladi; CSS’da ham shunga qarab bezash mumkin',
            'Havola bosilmaydigan bo‘ladi',
            'Havola yangi oynada ochiladi',
            'Havola yashiriladi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  hero: site(
    HERO,
    `${HERO_CSS.replace(
      '.bosh {\n  padding: 48px 24px;\n}',
      '.bosh {\n  display: grid;\n  align-content: center;\n  min-height: calc(100dvh - 64px);\n  padding: 48px 24px;\n}',
    )
      .replace(
        'h1 {\n  margin: 8px 0;\n}',
        'h1 {\n  margin: 8px 0;\n  font-size: clamp(2.25rem, 1.5rem + 3vw, 4rem);\n  line-height: 1.05;\n}',
      )
      .replace(
        '.tugmalar {\n  display: flex;',
        '.tugmalar {\n  display: flex;\n  flex-wrap: wrap;',
      )}`,
  ),
  'sticky-nav': site(
    STICKY,
    STICKY_CSS.replace(
      '.sarlavha {\n  display: flex;',
      '.sarlavha {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  background-color: rgb(250 250 249 / 0.9);\n  backdrop-filter: blur(8px);\n  border-bottom: 1px solid var(--chegara);\n  display: flex;',
    ),
  ),
  'mobil-menyu': app(MOBILE, MOBILE_JS_DONE, { css: MOBILE_CSS }),
  'aktiv-bolim': app(ACTIVE, ACTIVE_JS_DONE, {
    css: `${ACTIVE_CSS}

.menyu a[aria-current="true"] {
  color: var(--urg);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 6px;
}`,
  }),
};
