import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  files,
  has,
  md,
  pic,
  q,
  quiz,
  RESET,
  site,
  style,
  text,
  type ModuleDef,
} from '../../design/shared';

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

const HEAD_START = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mashq</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <main>
      <h1>Aziza Karimova</h1>
      <p>Frontend dasturchi. Kichik bizneslar uchun tez va qulay saytlar.</p>
    </main>
  </body>
</html>
`;

const HEAD_DONE = HEAD_START.replace('<html>', '<html lang="uz">').replace(
  '    <title>Mashq</title>\n',
  `    <title>Aziza Karimova — frontend dasturchi</title>
    <meta name="description" content="Aziza Karimova — Toshkentdagi frontend dasturchi. Kichik bizneslar uchun tez va qulay saytlar: ishlar, tajriba va aloqa.">
    <link rel="canonical" href="https://aziza.example.uz/">
    <meta property="og:title" content="Aziza Karimova — frontend dasturchi">
    <meta property="og:description" content="Kichik bizneslar uchun tez va qulay saytlar.">
    <meta property="og:image" content="https://aziza.example.uz/og.png">
    <meta property="og:type" content="website">
`,
);

const AUDIT = `<header class="sarlavha">
  <strong>AK</strong>
  <button type="button" class="menyu-tugma">
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2"/></svg>
  </button>
</header>
<main>
  <section class="bosh">
    <h1>Aziza Karimova</h1>
    <p class="izoh">Frontend dasturchi</p>
    ${pic('78716c', '', 480, 480).replace(' width="480" height="480" alt=""', '').replace('<img', '<img class="surat"')}
  </section>
  <section class="ishlar">
    <h3>Ishlarim</h3>
    ${pic('b45309', '', 800, 500).replace(' width="800" height="500" alt=""', '').replace('<img', '<img class="loyiha-rasm"')}
  </section>
</main>`;

const AUDIT_DONE = AUDIT.replace(
  '<button type="button" class="menyu-tugma">',
  '<button type="button" class="menyu-tugma" aria-label="Menyu">',
)
  .replace(
    '<img class="surat"',
    '<img class="surat" width="480" height="480" alt="Aziza Karimova portreti"',
  )
  .replace(
    '<img class="loyiha-rasm"',
    '<img class="loyiha-rasm" width="800" height="500" loading="lazy" alt="Kafe sayti skrinshoti"',
  )
  .replace('<h3>Ishlarim</h3>', '<h2>Ishlarim</h2>');

const AUDIT_CSS = `${RESET}

${TOKENS}

.sarlavha {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
}

.menyu-tugma {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
}

section {
  padding: 24px;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

.izoh {
  color: #d6d3d1;
}`;

const FINAL = `<header class="sarlavha">
  <a class="logo" href="#bosh">AK</a>
  <nav aria-label="Asosiy">
    <a href="#ishlar">Ishlarim</a>
    <a href="#haqimda">Men haqimda</a>
    <a href="#aloqa">Aloqa</a>
  </nav>
</header>
<main>
  <section id="bosh" class="bosh">
    <h1>Aziza Karimova</h1>
    <p>Frontend dasturchi</p>
    <a class="tugma" href="#ishlar">Ishlarimni ko‘rish</a>
  </section>
  <section id="ishlar">
    <h2>Ishlarim</h2>
    <div class="tor">
      <article class="loyiha"><h3>Kafe sayti</h3></article>
      <article class="loyiha"><h3>Kutubxona</h3></article>
      <article class="loyiha"><h3>Ob-havo</h3></article>
    </div>
  </section>
  <section id="haqimda"><h2>Men haqimda</h2><p>Ikki yillik tajriba.</p></section>
  <section id="aloqa">
    <h2>Aloqa</h2>
    <form class="forma">
      <label>Email <input name="email"></label>
      <button type="submit" class="tugma">Yuborish</button>
    </form>
  </section>
</main>
<footer class="pastki">© 2026 Aziza Karimova</footer>`;

const FINAL_DONE = FINAL.replace(
  '<input name="email">',
  '<input type="email" name="email" required autocomplete="email">',
);

const FINAL_CSS = `${RESET}

${TOKENS}

.sarlavha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: var(--fon);
  border-bottom: 1px solid var(--chegara);
}

nav {
  display: flex;
  gap: 24px;
}

section {
  padding: 48px 24px;
}

.loyiha {
  padding: 24px;
  border: 1px solid var(--chegara);
  border-radius: 16px;
  background-color: white;
}

.tugma {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding-inline: 20px;
  border: 0;
  font: inherit;
  text-decoration: none;
}`;

export const m06: ModuleDef = {
  title: 'Nashr va sifat',
  lessons: [
    {
      slug: 'seo-meta',
      title: 'SEO va meta teglar',
      exercise: {
        title: 'Qidiruv va ijtimoiy tarmoqlar uchun `<head>`',
        description: 'Til, sarlavha, tavsif, canonical va Open Graph.',
        instructions: md(
          '1. `<html lang="uz">`.',
          '2. `<title>Aziza Karimova — frontend dasturchi</title>`.',
          '3. `<meta name="description" content="…">` — 120–160 belgili tavsif.',
          '4. `<link rel="canonical" href="https://aziza.example.uz/">`.',
          '5. Open Graph: `og:title`, `og:description`, `og:image`, `og:type`.',
        ),
        expectedBehavior:
          'Qidiruv natijasida va Telegram’da ulashilganda sahifa nomi, tavsifi va rasmi to‘g‘ri chiqadi.',
        difficulty: 'EASY',
        starterFiles: files({ 'index.html': HEAD_START, 'style.css': `${RESET}\n` }),
        checks: [
          has('lang', 'Sahifa tili', 'html[lang="uz"]'),
          text('title', 'Ma’noli sarlavha', 'title', 'Aziza Karimova'),
          has('desc', 'Tavsif bor', 'meta[name="description"]:not([content=""])'),
          has('canonical', 'Canonical manzil', 'link[rel="canonical"][href^="https://"]'),
          has('og', 'Open Graph teglari', 'meta[property="og:title"], meta[property="og:image"]', {
            min: 2,
          }),
        ],
      },
    },
    {
      slug: 'tezlik-a11y',
      title: 'Tezlik va accessibility tekshiruvi',
      exercise: {
        title: 'Lighthouse topgan xatolarni tuzatish',
        description: 'Rasm atributlari, tugma nomi, sarlavha tartibi va kontrast.',
        instructions: md(
          '1. Portretga `width="480" height="480" alt="Aziza Karimova portreti"`.',
          '2. Loyiha rasmiga `width="800" height="500" loading="lazy" alt="Kafe sayti skrinshoti"`.',
          '3. Menyu tugmasiga `aria-label="Menyu"`.',
          '4. “Ishlarim” sarlavhasini `h3` dan `h2` ga o‘zgartiring (darajani o‘tkazib yubormang).',
          '5. `.izoh` rangini `var(--xira)` qiling (oldingi `#d6d3d1` och fonda o‘qilmaydi).',
        ),
        expectedBehavior:
          'Lighthouse’ning accessibility va eng yaxshi amaliyotlar bo‘yicha asosiy ogohlantirishlari yo‘qoladi.',
        difficulty: 'EASY',
        starterFiles: site(AUDIT, AUDIT_CSS),
        checks: [
          has('alt', 'Har bir rasmda alt', 'img:not([alt])', { min: 0, max: 0 }),
          has('dims', 'Rasmlar uchun joy ajratilgan', 'img[width][height]', { min: 2 }),
          has('lazy', 'Pastdagi rasm kechiktiriladi', 'img.loyiha-rasm[loading="lazy"]'),
          has('button', 'Tugmaning nomi bor', 'button.menyu-tugma[aria-label]'),
          style('contrast', 'Izoh o‘qiladi', '.izoh', 'color', '#57534e'),
        ],
      },
    },
    {
      slug: 'yakuniy-loyiha',
      title: 'Yakuniy loyiha va nashr',
      exercise: {
        title: 'Portfolioni yig‘ish',
        description: 'Kursdagi asosiy qismlarni bitta sahifada birlashtirish.',
        instructions: md(
          '1. `.sarlavha`: `position: sticky`, `top: 0`, `z-index: 10`.',
          '2. `section`: `scroll-margin-top: 80px`.',
          '3. `.tor`: `display: grid`, `grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr))`, `gap: 24px`.',
          '4. `.tugma`: `border-radius: 999px`, `color: white`, `background-color: var(--urg)`.',
          '5. Email maydoni: `type="email" required autocomplete="email"`.',
        ),
        expectedBehavior:
          'Yopishqoq header, bo‘limlarga to‘g‘ri o‘tish, moslashuvchan loyihalar to‘ri, bir xil tugmalar va tekshiriladigan forma.',
        difficulty: 'MEDIUM',
        starterFiles: site(FINAL, FINAL_CSS),
        checks: [
          style('sticky', 'Header yopishqoq', '.sarlavha', 'position', 'sticky'),
          style(
            'anchor',
            'Bo‘limlar header ostida qolmaydi',
            'section',
            'scroll-margin-top',
            '80px',
          ),
          at(
            1032,
            800,
            style(
              'grid',
              'Loyihalar uch ustunda',
              '.tor',
              'grid-template-columns',
              '312px 312px 312px',
            ),
          ),
          style('button', 'Tugmalar urg‘u rangida', '.tugma', 'background-color', '#c2410c'),
          has('email', 'Email maydoni tekshiriladi', 'input[type="email"][required]'),
        ],
      },
      quiz: quiz('6-modul testi: Nashr va sifat', [
        q(
          'p6-title',
          'Yaxshi `<title>` qanday?',
          [
            'Qisqa va aniq: ism + kim (“Aziza Karimova — frontend dasturchi”)',
            '“Bosh sahifa”',
            '“Mashq”',
            'Kalit so‘zlar ro‘yxati',
          ],
          [0],
        ),
        q(
          'p6-og',
          'Open Graph teglari nima uchun?',
          [
            'Havola Telegram, Facebook kabi joylarda ulashilganda sarlavha, tavsif va rasm ko‘rsatish uchun',
            'Sahifani tezlashtirish uchun',
            'Parolni himoya qilish uchun',
            'Faqat Google uchun majburiy',
          ],
          [0],
        ),
        q(
          'p6-lazy',
          'Qaysi rasmlarga `loading="lazy"` qo‘ymaslik kerak?',
          [
            'Birinchi ekranda ko‘rinadigan (bosh ekran) rasmlarga',
            'Sahifa pastidagi rasmlarga',
            'Galereyadagi kichik rasmlarga',
            'Hech qaysi — hammasiga qo‘yish kerak',
          ],
          [0],
        ),
        q(
          'p6-host',
          'Statik portfolio saytini bepul joylash mumkin bo‘lgan joylar? (bir nechta javob)',
          [
            'GitHub Pages',
            'Netlify yoki Vercel kabi xizmatlar',
            'Platformadagi ochiq portfolio sahifasi',
            'Faqat o‘z serveringiz',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  'seo-meta': files({ 'index.html': HEAD_DONE, 'style.css': `${RESET}\n` }),
  'tezlik-a11y': site(AUDIT_DONE, AUDIT_CSS.replace('color: #d6d3d1;', 'color: var(--xira);')),
  'yakuniy-loyiha': site(
    FINAL_DONE,
    `${FINAL_CSS.replace(
      '.sarlavha {\n  display: flex;',
      '.sarlavha {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  display: flex;',
    ).replace(
      'section {\n  padding: 48px 24px;\n}',
      'section {\n  padding: 48px 24px;\n  scroll-margin-top: 80px;\n}',
    )}

.tor {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 24px;
}

.tugma {
  border-radius: 999px;
  color: white;
  background-color: var(--urg);
}`,
  ),
};
