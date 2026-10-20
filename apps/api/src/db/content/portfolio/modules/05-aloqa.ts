import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  attr,
  has,
  md,
  q,
  quiz,
  RESET,
  site,
  style,
  text,
  type ModuleDef,
} from '../../design/shared';

const click = (selector: string) => ({ type: 'click' as const, selector });
const fill = (selector: string, value: string) => ({ type: 'fill' as const, selector, value });

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

const FORM_START = `<section id="aloqa" class="aloqa">
  <h2>Aloqa</h2>
  <form class="forma">
    <label>Ismingiz <input name="ism"></label>
    <label>Email <input name="email"></label>
    <label>Xabar <textarea name="xabar" rows="4"></textarea></label>
    <button type="submit">Yuborish</button>
    <p class="natija" role="status"></p>
  </form>
</section>`;

const FORM_DONE = FORM_START.replace(
  '<input name="ism">',
  '<input name="ism" required autocomplete="name">',
)
  .replace(
    '<input name="email">',
    '<input type="email" name="email" required autocomplete="email">',
  )
  .replace(
    '<textarea name="xabar" rows="4"></textarea>',
    '<textarea name="xabar" rows="4" required minlength="10"></textarea>',
  );

const FORM_CSS = `${RESET}

${TOKENS}

.aloqa {
  padding: 24px;
}

.forma {
  display: grid;
  gap: 16px;
  max-width: 480px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input,
textarea {
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #a8a29e;
  border-radius: 8px;
  font: inherit;
}

button {
  min-height: 44px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: var(--urg);
}`;

const FORM_JS = `const forma = document.querySelector('.forma');
const natija = document.querySelector('.natija');

// Forma yuborilganda (submit): sahifa yangilanmasin (preventDefault),
// natija matni "Rahmat! Xabaringiz yuborildi." bo‘lsin va forma tozalansin.
// Eslatma: brauzer tekshiruvi (required, type="email") xato bo‘lsa submit umuman bo‘lmaydi.`;

const FORM_JS_DONE = `const forma = document.querySelector('.forma');
const natija = document.querySelector('.natija');

forma.addEventListener('submit', (e) => {
  e.preventDefault();
  natija.textContent = 'Rahmat! Xabaringiz yuborildi.';
  forma.reset();
});`;

const QUOTES_START = `<section class="fikrlar">
  <h2>Mijozlar fikri</h2>
  <div class="fikr">
    <div class="matn">Sayt tez va qulay chiqdi, buyurtmalar ko‘paydi.</div>
    <div class="kim">Dilshod Rasulov, “Ko‘k choy” kafesi</div>
  </div>
  <div class="fikr">
    <div class="matn">Har bir bosqichni tushuntirib bordi, muddatda topshirdi.</div>
    <div class="kim">Nigora Saidova, kutubxona</div>
  </div>
  <div class="fikr">
    <div class="matn">Telefonda ham, kompyuterda ham chiroyli.</div>
    <div class="kim">Bekzod Aliyev, onlayn do‘kon</div>
  </div>
</section>`;

const QUOTE = (m: string, who: string, org: string) => `  <figure class="fikr">
    <blockquote><p>${m}</p></blockquote>
    <figcaption>${who}, <cite>${org}</cite></figcaption>
  </figure>`;

const QUOTES_DONE = `<section class="fikrlar">
  <h2>Mijozlar fikri</h2>
${QUOTE('Sayt tez va qulay chiqdi, buyurtmalar ko‘paydi.', 'Dilshod Rasulov', '“Ko‘k choy” kafesi')}
${QUOTE('Har bir bosqichni tushuntirib bordi, muddatda topshirdi.', 'Nigora Saidova', 'kutubxona')}
${QUOTE('Telefonda ham, kompyuterda ham chiroyli.', 'Bekzod Aliyev', 'onlayn do‘kon')}
</section>`;

const QUOTES_CSS = `${RESET}

${TOKENS}

.fikrlar {
  display: grid;
  gap: 16px;
  padding: 24px;
}`;

const TOP = `<section id="bosh" class="bosh"><h1>Aziza Karimova</h1></section>
<section class="uzun"><h2>Ishlarim</h2></section>
<section class="uzun"><h2>Aloqa</h2></section>
<a class="yuqoriga" href="#bosh">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</a>`;

const TOP_CSS = `${RESET}

${TOKENS}

.bosh,
.uzun {
  min-height: 90vh;
  padding: 24px;
}`;

const THEME = `<header class="sarlavha">
  <strong>Aziza Karimova</strong>
  <button type="button" class="mavzu" aria-pressed="false">Qorong‘i rejim</button>
</header>
<main class="sahifa"><p>Portfolio sahifasi.</p></main>`;

const THEME_CSS = `${RESET}

${TOKENS}

.sarlavha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.mavzu {
  min-height: 44px;
  padding-inline: 16px;
  border: 1px solid var(--chegara);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
}

.sahifa {
  padding: 24px;
}`;

const THEME_JS = `const tugma = document.querySelector('.mavzu');

// 1) Sahifa ochilganda localStorage dagi "mavzu" ni o‘qing (try...catch ichida) va qo‘llang.
// 2) Tugma bosilganda <html data-theme="dark"> ni yoqing/o‘chiring, aria-pressed ni yangilang
//    va tanlovni localStorage ga yozing (yana try...catch).`;

const THEME_JS_DONE = `const tugma = document.querySelector('.mavzu');

function qollash(mavzu) {
  const qorongi = mavzu === 'dark';
  if (qorongi) document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
  tugma.setAttribute('aria-pressed', String(qorongi));
}

try {
  qollash(localStorage.getItem('mavzu'));
} catch {
  // Saqlash imkoni yo‘q (yashirin rejim, sandbox) — standart mavzu qoladi.
}

tugma.addEventListener('click', () => {
  const yangi = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  qollash(yangi);
  try {
    localStorage.setItem('mavzu', yangi);
  } catch {
    // Tanlov faqat shu sahifa ochiq turganda amal qiladi.
  }
});`;

const THEME_CSS_DONE = `${THEME_CSS}

:root {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
  --fon: #1c1917;
  --matn: #fafaf9;
  --xira: #d6d3d1;
  --chegara: #44403c;
  --urg: #fb923c;
}`;

export const m05: ModuleDef = {
  title: 'Aloqa va qo‘shimchalar',
  lessons: [
    {
      slug: 'aloqa-forma',
      title: 'Aloqa formasi',
      exercise: {
        title: 'Tekshiriladigan forma',
        description: 'Brauzer tekshiruvi, `autocomplete` va natija xabari.',
        instructions: md(
          '1. HTML: `ism` — `required autocomplete="name"`; `email` — `type="email" required autocomplete="email"`; `xabar` — `required minlength="10"`.',
          '2. `script.js`: `submit` hodisasida `preventDefault()`, `.natija` matni “Rahmat! Xabaringiz yuborildi.”, keyin `forma.reset()`.',
        ),
        expectedBehavior:
          'Bo‘sh yoki noto‘g‘ri forma yuborilmaydi; to‘g‘ri to‘ldirilganda rahmat xabari chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(FORM_START, FORM_JS, { css: FORM_CSS }),
        checks: [
          has('name', 'Ism majburiy', 'input[name="ism"][required][autocomplete="name"]'),
          has('email', 'Email turi va majburiy', 'input[type="email"][name="email"][required]'),
          has('msg', 'Xabar kamida 10 belgi', 'textarea[name="xabar"][required][minlength="10"]'),
          after(
            [
              fill('input[name="ism"]', 'Dilshod'),
              fill('input[name="email"]', 'dilshod@example.uz'),
              fill('textarea', 'Sayt kerak edi, gaplashsak.'),
              click('button[type="submit"]'),
            ],
            text('ok', 'To‘g‘ri formadan keyin rahmat xabari', '.natija', 'Rahmat'),
          ),
          after(
            [click('button[type="submit"]')],
            has('blocked', 'Bo‘sh forma yuborilmaydi', '.natija:empty'),
          ),
        ],
      },
    },
    {
      slug: 'fikrlar',
      title: 'Mijozlar fikri',
      exercise: {
        title: 'Iqtiboslar semantikasi',
        description: '`figure`, `blockquote`, `figcaption` va `cite`.',
        instructions: md(
          '1. Har bir `.fikr` ni `<figure class="fikr">` qiling: matn — `<blockquote><p>…</p></blockquote>`, muallif — `<figcaption>Ism, <cite>tashkilot</cite></figcaption>`.',
          '2. `.fikr`: `margin: 0`, `padding: 20px`, `border-left: 4px solid var(--urg)`, `background-color: white`.',
          '3. `.fikr blockquote`: `margin: 0`, `font-style: italic`.',
        ),
        expectedBehavior:
          'Uchta fikr kartasi chapda rangli chiziq bilan; ekran o‘quvchi ularni iqtibos va muallif sifatida taniydi.',
        difficulty: 'EASY',
        starterFiles: site(QUOTES_START, QUOTES_CSS),
        checks: [
          has('quote', 'Fikrlar `blockquote` da', 'figure.fikr > blockquote', { min: 3 }),
          has('caption', 'Muallif `figcaption` da', 'figure.fikr > figcaption cite', { min: 3 }),
          style('line', 'Chapda urg‘u chizig‘i', '.fikr', 'border-left-color', '#c2410c'),
          style('italic', 'Iqtibos kursivda', '.fikr blockquote', 'font-style', 'italic'),
          style('margin', 'Ortiqcha chet yo‘q', '.fikr blockquote', 'margin-left', '0px'),
        ],
      },
    },
    {
      slug: 'yuqoriga',
      title: '“Yuqoriga” tugmasi',
      exercise: {
        title: 'Doim qo‘l ostidagi tugma',
        description: 'Qotirilgan joylashuv, nom va silliq aylantirish.',
        instructions: md(
          '1. Havolaga `aria-label="Sahifa boshiga qaytish"`, ikonkaga `aria-hidden="true"`.',
          '2. `.yuqoriga`: `position: fixed`, `right: 24px`, `bottom: 24px`, `z-index: 20`, `display: grid`, `place-items: center`, `width: 48px`, `height: 48px`, `border-radius: 50%`, `color: white`, `background-color: var(--urg)`.',
          '3. `html`: `scroll-behavior: smooth`.',
        ),
        expectedBehavior:
          'O‘ng pastki burchakda doira tugma; bosilganda sahifa silliq tepaga qaytadi.',
        difficulty: 'EASY',
        starterFiles: site(TOP, TOP_CSS),
        checks: [
          style('fixed', 'Tugma qotirilgan', '.yuqoriga', 'position', 'fixed'),
          style('corner', 'Pastdan 24px', '.yuqoriga', 'bottom', '24px'),
          style('size', 'O‘lcham 48px', '.yuqoriga', 'width', '48px'),
          has('label', 'Tugmaning nomi bor', 'a.yuqoriga[aria-label]'),
          style('smooth', 'Silliq aylantirish', 'html', 'scroll-behavior', 'smooth'),
        ],
      },
    },
    {
      slug: 'mavzu-rejimi',
      title: 'Yorug‘ va qorong‘i rejim',
      exercise: {
        title: 'Saqlanadigan mavzu tanlovi',
        description: 'Tokenlar, `data-theme`, `color-scheme` va `localStorage`.',
        instructions: md(
          '1. CSS: `[data-theme="dark"]` da `color-scheme: dark`, `--fon: #1c1917`, `--matn: #fafaf9`, `--xira: #d6d3d1`, `--chegara: #44403c`, `--urg: #fb923c`.',
          '2. JS: tugma bosilganda `<html>` ga `data-theme="dark"` qo‘ying yoki olib tashlang, `aria-pressed` ni yangilang.',
          '3. Tanlovni `localStorage` ga yozing va sahifa ochilganda o‘qing — ikkalasi ham `try…catch` ichida (ba’zi muhitlarda saqlash taqiqlangan).',
        ),
        expectedBehavior:
          'Tugma mavzuni almashtiradi; tanlov keyingi tashrifda ham saqlanadi (agar brauzer ruxsat bersa).',
        difficulty: 'MEDIUM',
        starterFiles: app(THEME, THEME_JS, { css: THEME_CSS }),
        checks: [
          after(
            [click('.mavzu')],
            attr('attr', '`data-theme="dark"`', 'html', 'data-theme', 'dark'),
          ),
          after(
            [click('.mavzu')],
            style('bg', 'Qorong‘i fon', 'body', 'background-color', '#1c1917'),
          ),
          after(
            [click('.mavzu')],
            attr('pressed', '`aria-pressed` — true', '.mavzu', 'aria-pressed', 'true'),
          ),
          after(
            [click('.mavzu'), click('.mavzu')],
            style('back', 'Ikkinchi bosish qaytaradi', 'body', 'background-color', '#fafaf9'),
          ),
          after(
            [click('.mavzu')],
            style('scheme', 'Brauzer ham qorong‘i rejimda', 'html', 'color-scheme', 'dark', {
              hidden: true,
            }),
          ),
        ],
      },
      quiz: quiz('5-modul testi: Aloqa va qo‘shimchalar', [
        q(
          'p5-required',
          'Brauzer tekshiruvi (`required`, `type="email"`) bo‘lsa, server tekshiruvi kerakmi?',
          [
            'Ha — brauzer tekshiruvini chetlab o‘tish oson, server baribir tekshirishi shart',
            'Yo‘q, brauzer yetarli',
            'Faqat email uchun',
            'Faqat parol bo‘lsa',
          ],
          [0],
        ),
        q(
          'p5-status',
          'Forma natijasi uchun `role="status"` nima beradi?',
          [
            'Ekran o‘quvchi xabar paydo bo‘lganini e’lon qiladi',
            'Xabar qizil bo‘ladi',
            'Forma qayta yuboriladi',
            'Hech narsa',
          ],
          [0],
        ),
        q(
          'p5-quote',
          'Iqtibos va muallifni qaysi elementlar bilan belgilash to‘g‘ri?',
          [
            '`figure` + `blockquote` + `figcaption` (+ `cite`)',
            '`div` + `span`',
            '`q` + `b`',
            '`section` + `h6`',
          ],
          [0],
        ),
        q(
          'p5-storage',
          'Nega `localStorage` ga murojaat `try…catch` ichida bo‘ladi?',
          [
            'Yashirin rejim yoki sandbox kabi muhitlarda u xato tashlashi mumkin',
            'U doim sekin ishlaydi',
            'Bu sintaksis talabi',
            'Ma’lumot shifrlanishi uchun',
          ],
          [0],
        ),
        q(
          'p5-scheme',
          '`color-scheme: dark` nimaga ta’sir qiladi? (bir nechta javob)',
          [
            'Brauzer forma maydonlarini qorong‘i chizadi',
            'Aylantirish chizig‘i qorong‘i bo‘ladi',
            'Standart fon va matn ranglari qorong‘i mavzuga mos',
            'Rasmlar avtomatik qorayadi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  'aloqa-forma': app(FORM_DONE, FORM_JS_DONE, { css: FORM_CSS }),
  fikrlar: site(
    QUOTES_DONE,
    `${QUOTES_CSS}

.fikr {
  margin: 0;
  padding: 20px;
  border-left: 4px solid var(--urg);
  background-color: white;
}

.fikr blockquote {
  margin: 0;
  font-style: italic;
}`,
  ),
  yuqoriga: site(
    TOP.replace(
      '<a class="yuqoriga" href="#bosh">',
      '<a class="yuqoriga" href="#bosh" aria-label="Sahifa boshiga qaytish">',
    ).replace('<svg viewBox', '<svg aria-hidden="true" viewBox'),
    `${TOP_CSS}

html {
  scroll-behavior: smooth;
}

.yuqoriga {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 20;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: white;
  background-color: var(--urg);
}`,
  ),
  'mavzu-rejimi': app(THEME, THEME_JS_DONE, { css: THEME_CSS_DONE }),
};
