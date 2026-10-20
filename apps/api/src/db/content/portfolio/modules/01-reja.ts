import type { ProjectFile } from '@webdizayn/shared';
import { after, has, md, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const tab = [{ type: 'press' as const, selector: 'body', key: 'Tab' }];

const DIVS = `<div class="sarlavha">
  <div class="logo">Aziza Karimova</div>
  <div class="menyu">
    <a href="#">Men haqimda</a>
    <a href="#">Ishlarim</a>
    <a href="#">Aloqa</a>
  </div>
</div>
<div class="bosh">
  <div class="katta">Salom, men frontend dasturchiman</div>
</div>
<div class="bolim">
  <div class="nom">Men haqimda</div>
  <p>Toshkentda yashayman, 2 yildan beri sahifalar yasayman.</p>
</div>
<div class="bolim">
  <div class="nom">Ishlarim</div>
  <p>Tez orada shu yerda loyihalar bo‘ladi.</p>
</div>
<div class="bolim">
  <div class="nom">Aloqa</div>
  <p>aziza@example.uz</p>
</div>
<div class="pastki">© 2026 Aziza Karimova</div>`;

const SEMANTIC = `<header class="sarlavha">
  <a class="logo" href="#bosh">Aziza Karimova</a>
  <nav aria-label="Asosiy">
    <a href="#haqimda">Men haqimda</a>
    <a href="#ishlar">Ishlarim</a>
    <a href="#aloqa">Aloqa</a>
  </nav>
</header>
<main>
  <section id="bosh" class="bosh">
    <h1>Salom, men frontend dasturchiman</h1>
  </section>
  <section id="haqimda">
    <h2>Men haqimda</h2>
    <p>Toshkentda yashayman, 2 yildan beri sahifalar yasayman.</p>
  </section>
  <section id="ishlar">
    <h2>Ishlarim</h2>
    <p>Tez orada shu yerda loyihalar bo‘ladi.</p>
  </section>
  <section id="aloqa">
    <h2>Aloqa</h2>
    <p>aziza@example.uz</p>
  </section>
</main>
<footer class="pastki">© 2026 Aziza Karimova</footer>`;

const SKIP_BODY = `<a class="otish" href="#asosiy">Asosiy kontentga o‘tish</a>
<header class="sarlavha">
  <a class="logo" href="#bosh">Aziza Karimova</a>
  <nav aria-label="Asosiy">
    <a href="#haqimda">Men haqimda</a>
    <a href="#ishlar">Ishlarim</a>
  </nav>
</header>
<main id="asosiy">
  <section id="bosh"><h1>Salom!</h1></section>
  <section id="haqimda"><h2>Men haqimda</h2><p>Qisqa tanishuv.</p></section>
  <section id="ishlar"><h2>Ishlarim</h2><p>Loyihalar ro‘yxati.</p></section>
</main>`;

const SKIP_START = SKIP_BODY.replace(
  '<a class="otish" href="#asosiy">Asosiy kontentga o‘tish</a>\n',
  '',
).replace('<main id="asosiy">', '<main>');

const SKIP_CSS = `${RESET}

.sarlavha {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
}

section {
  min-height: 60vh;
  padding: 24px;
}`;

const TOKENS_BODY = `<header class="sarlavha">
  <a class="logo" href="#">AK</a>
</header>
<section class="bolim">
  <h2>Ishlarim</h2>
  <article class="karta">
    <h3>Kafe sayti</h3>
    <p>Moslashuvchan lending.</p>
    <a class="tugma" href="#">Ko‘rish</a>
  </article>
</section>`;

const TOKENS_CSS = `${RESET}

body {
  background-color: #fafaf9;
  color: #1c1917;
}

.sarlavha,
.bolim {
  padding: 24px;
}

.karta {
  padding: 24px;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  background-color: white;
}

.tugma {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  color: white;
  background-color: #c2410c;
  text-decoration: none;
}`;

export const m01: ModuleDef = {
  title: 'Rejalashtirish',
  lessons: [
    {
      slug: 'portfolio-nima',
      title: 'Portfolio nima va unga nima kiradi',
      exercise: {
        title: 'Semantik skelet',
        description: '`div` lardan ma’noli elementlarga.',
        instructions: md(
          '1. Yuqori qismni `<header>` qiling, havolalarni `<nav aria-label="Asosiy">` ichiga oling; havolalar `#haqimda`, `#ishlar`, `#aloqa` ga olib borsin.',
          '2. Bo‘limlarni `<main>` ichida `<section id="bosh">`, `<section id="haqimda">`, `<section id="ishlar">`, `<section id="aloqa">` qiling.',
          '3. Bosh ekran sarlavhasi — yagona `<h1>`, bo‘lim nomlari — `<h2>`.',
          '4. Pastki qismni `<footer>` qiling.',
        ),
        expectedBehavior:
          'Sahifa ko‘rinishi deyarli o‘zgarmaydi, lekin ekran o‘quvchi va qidiruv tizimi uning tuzilishini tushunadi.',
        difficulty: 'EASY',
        starterFiles: site(DIVS, RESET),
        checks: [
          has('nav', 'Navigatsiya bo‘limlarga olib boradi', 'header nav a[href="#ishlar"]'),
          has('sections', 'To‘rtta bo‘lim', 'main > section[id]', { min: 4 }),
          has('h1', 'Bitta h1', 'h1', { min: 1, max: 1 }),
          has('h2', 'Bo‘lim sarlavhalari h2', 'section#haqimda h2'),
          has('footer', 'Pastki qism footer', 'footer'),
        ],
      },
    },
    {
      slug: 'tuzilma',
      title: 'Bir sahifali sayt tuzilmasi',
      exercise: {
        title: 'O‘tish havolasi va silliq aylantirish',
        description: 'Skip-link, `scroll-behavior` va `scroll-margin-top`.',
        instructions: md(
          '1. `<body>` boshiga `<a class="otish" href="#asosiy">Asosiy kontentga o‘tish</a>` qo‘shing, `<main>` ga `id="asosiy"` bering.',
          '2. `.otish`: `position: absolute`, `left: 16px`, `top: 8px`, `transform: translateY(-150%)`; `.otish:focus` — `transform: none`.',
          '3. `html`: `scroll-behavior: smooth`; `section`: `scroll-margin-top: 80px` (keyin yopishqoq header uchun).',
        ),
        expectedBehavior:
          'Tab bosilganda birinchi bo‘lib “Asosiy kontentga o‘tish” havolasi ko‘rinadi; bo‘limlarga o‘tish silliq.',
        difficulty: 'EASY',
        starterFiles: site(SKIP_START, SKIP_CSS),
        checks: [
          has('skip', 'O‘tish havolasi bor', 'a.otish[href="#asosiy"]'),
          has('target', '`main` ning id si', 'main#asosiy'),
          after(tab, style('visible', 'Tab bosilganda ko‘rinadi', '.otish', 'transform', 'none')),
          style('smooth', 'Silliq aylantirish', 'html', 'scroll-behavior', 'smooth'),
          style(
            'margin',
            'Bo‘limlar header ostida qolmaydi',
            'section',
            'scroll-margin-top',
            '80px',
          ),
        ],
      },
    },
    {
      slug: 'portfolio-tokenlar',
      title: 'Shaxsiy uslub va tokenlar',
      exercise: {
        title: 'Portfolio palitrasi',
        description: 'Ranglar, radius va shriftni tokenlarga yig‘ish.',
        instructions: md(
          '1. `:root` da: `--fon: #fafaf9`, `--matn: #1c1917`, `--sirt: #ffffff`, `--chegara: #e7e5e4`, `--urg: #c2410c`, `--r-karta: 16px`, `--shrift: Georgia, serif`.',
          '2. Barcha mavjud qiymatlarni shu tokenlar bilan almashtiring.',
          '3. Sarlavhalar (`h2, h3`) uchun `font-family: var(--shrift)`.',
        ),
        expectedBehavior:
          'Ko‘rinish o‘zgarmaydi, sarlavhalar serifli; har bir qiymat tokendan keladi.',
        difficulty: 'EASY',
        starterFiles: site(TOKENS_BODY, TOKENS_CSS),
        checks: [
          style('accent', 'Urg‘u tokeni', ':root', '--urg', '#c2410c'),
          style('font-token', 'Shrift tokeni', ':root', '--shrift', 'Georgia, serif'),
          style('heading', 'Sarlavhalar serifli', 'h2', 'font-family', 'Georgia, serif'),
          style('button', 'Tugma urg‘u rangida', '.tugma', 'background-color', '#c2410c'),
          style('card', 'Karta radiusi', '.karta', 'border-top-left-radius', '16px'),
        ],
      },
      quiz: quiz('1-modul testi: Rejalashtirish', [
        q(
          'p1-goal',
          'Portfolio’ning asosiy maqsadi?',
          [
            'Ish beruvchi yoki mijozga ko‘nikmalaringizni ishlaringiz orqali ko‘rsatish',
            'Iloji boricha ko‘p animatsiya ko‘rsatish',
            'Barcha o‘quv mashqlarini joylash',
            'Faqat rezyumeni yuklab berish',
          ],
          [0],
        ),
        q(
          'p1-projects',
          'Portfolioga nechta loyiha qo‘yish yaxshi?',
          [
            'Eng yaxshi 3–6 ta, har biri haqida qisqa hikoya bilan',
            'Hamma qilingan narsa, hatto tugallanmaganlari',
            'Faqat bitta',
            'Kamida 30 ta',
          ],
          [0],
        ),
        q(
          'p1-h1',
          'Sahifada nechta `h1` bo‘lishi tavsiya etiladi?',
          ['Bitta', 'Har bo‘limda bittadan', 'Umuman yo‘q', 'Kamida uchta'],
          [0],
        ),
        q(
          'p1-skip',
          '“Asosiy kontentga o‘tish” havolasi kimga yordam beradi?',
          [
            'Klaviatura va ekran o‘quvchi foydalanuvchilariga — menyuni har safar o‘tib chiqmaslik uchun',
            'Faqat qidiruv tizimlariga',
            'Faqat telefon foydalanuvchilariga',
            'Hech kimga',
          ],
          [0],
        ),
        q(
          'p1-tokens',
          'Shaxsiy brend uchun tokenlarning foydasi? (bir nechta javob)',
          [
            'Uslubni bir joyda o‘zgartirish mumkin',
            'Barcha bo‘limlar izchil ko‘rinadi',
            'Qorong‘i mavzu qo‘shish osonlashadi',
            'Sayt avtomatik tezlashadi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s01: Record<string, ProjectFile[]> = {
  'portfolio-nima': site(SEMANTIC, RESET),
  tuzilma: site(
    SKIP_BODY,
    `${SKIP_CSS}

html {
  scroll-behavior: smooth;
}

section {
  scroll-margin-top: 80px;
}

.otish {
  position: absolute;
  left: 16px;
  top: 8px;
  transform: translateY(-150%);
}

.otish:focus {
  transform: none;
}`,
  ),
  'portfolio-tokenlar': site(
    TOKENS_BODY,
    `${RESET}

:root {
  --fon: #fafaf9;
  --matn: #1c1917;
  --sirt: #ffffff;
  --chegara: #e7e5e4;
  --urg: #c2410c;
  --r-karta: 16px;
  --shrift: Georgia, serif;
}

body {
  background-color: var(--fon);
  color: var(--matn);
}

h2,
h3 {
  font-family: var(--shrift);
}

.sarlavha,
.bolim {
  padding: 24px;
}

.karta {
  padding: 24px;
  border: 1px solid var(--chegara);
  border-radius: var(--r-karta);
  background-color: var(--sirt);
}

.tugma {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  color: white;
  background-color: var(--urg);
  text-decoration: none;
}`,
  ),
};
