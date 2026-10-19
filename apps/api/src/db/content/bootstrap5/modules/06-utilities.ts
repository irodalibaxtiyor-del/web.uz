import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs5,
  click,
  cls,
  has,
  ICONS_CDN,
  md,
  q,
  quiz,
  RGB,
  slots,
  style,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const UTILS = `<div class="container">
  <div id="karta"{{card}}>
    <h3>Kurs haqida</h3>
    <p class="m-0">Bootstrap 5 utilitalari bilan bezalgan blok.</p>
  </div>
  <div id="qator"{{row}}>
    <span class="badge text-bg-primary">HTML</span>
    <span class="badge text-bg-success">CSS</span>
    <span class="badge text-bg-warning">JS</span>
  </div>
  <button type="button" class="btn btn-primary mt-4{{rel}}" id="xabar">
    Xabarlar{{dot}}
  </button>
</div>`;

const DOT = `
    <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
      <span class="visually-hidden">Yangi xabar</span>
    </span>`;

const DARK = `<div class="container py-3">
  <button class="btn btn-outline-secondary mb-3" id="rejim" type="button" aria-pressed="false">Qorong‘i rejim</button>
  <div id="kartochka"{{card}}>
    <h3>Profil</h3>
    <p{{muted}}>Oxirgi kirish: kecha</p>
    <ul class="list-group">
      <li class="list-group-item">Kurslarim</li>
      <li class="list-group-item">Sertifikatlar</li>
    </ul>
  </div>
</div>`;

const DARK_JS = `const tugma = document.getElementById('rejim');
tugma.addEventListener('click', () => {
  const html = document.documentElement;
  const yangi = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-bs-theme', yangi);
  tugma.setAttribute('aria-pressed', String(yangi === 'dark'));
});`;

const FLEX = `<div class="container">
  <div id="sarlavha"{{head}}>
    <h3 class="m-0">Kurslar</h3>
    <button type="button" class="btn btn-primary">Yangi kurs</button>
  </div>
  <nav id="menyu"{{menu}}>
    <a href="#">Bosh sahifa</a>
    <a href="#">Kurslar</a>
    <a href="#" id="kirish"{{login}}>Kirish</a>
  </nav>
  <div id="ikonkalar"{{even}}>
    <span>HTML</span><span>CSS</span><span>JS</span>
  </div>
  <div id="sharh"{{media}}>
    <div{{shrink}}><div class="rounded-circle bg-success" style="width: 64px; height: 64px;"></div></div>
    <div id="matn"{{grow}}>Setka darsi juda tushunarli bo‘ldi!</div>
  </div>
</div>`;

const ICONS = `<div class="container">
  <h2>Vazifalar</h2>
  <p>{{okIcon}}Hisobot tayyor</p>
  <button type="button" class="btn btn-primary" id="yuklash">{{download}}Yuklab olish</button>
  <button type="button" class="btn btn-outline-secondary" id="sozlama"{{label}}>{{gear}}</button>
</div>`;

export const m06: ModuleDef = {
  title: 'Utilitalar, qorong‘i rejim va Flex',
  lessons: [
    {
      slug: 'utilities',
      title: 'Utilitalar',
      exercise: {
        title: 'Faqat utilitalar bilan bezash',
        description: 'Chegara, burchak, soya, gap va pozitsiya utilitalari.',
        instructions: md(
          '- `#karta` — `border border-2 border-primary rounded-3 shadow p-4 mb-3`.',
          '- `#qator` — elementlar orasida masofa: `d-flex gap-3`.',
          '- `#xabar` tugmasiga `position-relative` qo‘shing va ichiga burchakdagi nuqtani joylang:',
          '  `<span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"><span class="visually-hidden">Yangi xabar</span></span>`.',
        ),
        expectedBehavior:
          'Ko‘k chegarali soyali karta, orasida masofali belgilar va burchagida qizil nuqtali tugma.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(UTILS), { title: 'Utilitalar' }),
        checks: [
          style('border', 'Qalin ko‘k chegara', '#karta', 'border-top-color', RGB.bs5.primary),
          style('border-w', 'Chegara 2px', '#karta', 'border-top-width', '2px'),
          style('radius', '`rounded-3`', '#karta', 'border-top-left-radius', '8px'),
          style('gap', 'Belgilar orasida masofa', '#qator', 'column-gap', '16px'),
          style('dot', 'Nuqta burchakda', '#xabar > .position-absolute', 'top', '0px'),
        ],
      },
    },
    {
      slug: 'dark-mode',
      title: 'Qorong‘i rejim',
      exercise: {
        title: 'Rejim almashtirgich',
        description: '`data-bs-theme` va moslashadigan klasslar.',
        instructions: md(
          '- `#kartochka` doim qorong‘i bo‘lsin: `data-bs-theme="dark"` va `class="bg-body text-body p-4 rounded-3"`.',
          '- Kartochkadagi paragrafga `text-body-secondary`.',
          '- `script.js`: `#rejim` bosilganda `<html>` ning `data-bs-theme` qiymati `dark` ↔ `light` almashsin va tugmaning `aria-pressed` qiymati yangilansin.',
        ),
        expectedBehavior:
          'Kartochka doim qorong‘i; tugma bosilganda butun sahifa qorong‘i rejimga o‘tadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(DARK), {
          title: 'Qorong‘i rejim',
          js: '// Rejim almashtirgichni shu yerda yozing',
        }),
        checks: [
          style(
            'card-bg',
            'Kartochka foni qorong‘i',
            '#kartochka',
            'background-color',
            RGB.bs5.dark,
          ),
          style('card-text', 'Kartochka matni och', '#kartochka', 'color', 'rgb(222, 226, 230)'),
          style(
            'list',
            'Ichidagi ro‘yxat ham qorong‘i',
            '#kartochka .list-group-item',
            'background-color',
            RGB.bs5.dark,
          ),
          after(
            [click('#rejim'), wait(200)],
            style(
              'page',
              'Tugma sahifani qorong‘i qiladi',
              'body',
              'background-color',
              RGB.bs5.dark,
            ),
          ),
          after(
            [click('#rejim'), wait(200)],
            attr('pressed', '`aria-pressed` yangilanadi', '#rejim', 'aria-pressed', 'true'),
          ),
        ],
      },
    },
    {
      slug: 'flex',
      title: 'Flex utilitalari',
      exercise: {
        title: 'Flex bilan maket',
        description: '`gap`, `ms-auto`, `justify-content-evenly` va media object o‘rnida flex.',
        instructions: md(
          '- `#sarlavha` — `d-flex justify-content-between align-items-center mb-3`.',
          '- `#menyu` — telefonda ustun, `md` dan qator, oraliq bilan: `d-flex flex-column flex-md-row gap-2`; `#kirish` — `ms-md-auto`.',
          '- `#ikonkalar` — `d-flex justify-content-evenly my-3`.',
          '- `#sharh` — `d-flex`; birinchi ichki blok — `flex-shrink-0`, `#matn` — `flex-grow-1 ms-3`.',
        ),
        expectedBehavior:
          'Chetlarga tarqalgan sarlavha, moslashuvchan menyu, teng tarqalgan belgilar va rasm + matn bloki.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(FLEX), { title: 'Flex' }),
        checks: [
          style(
            'between',
            'Sarlavha va tugma chetlarda',
            '#sarlavha',
            'justify-content',
            'space-between',
          ),
          at(
            375,
            700,
            style('column', 'Telefonda menyu ustun', '#menyu', 'flex-direction', 'column'),
          ),
          at(1000, 800, style('row', 'Kompyuterda qator', '#menyu', 'flex-direction', 'row')),
          style(
            'evenly',
            'Belgilar teng tarqalgan',
            '#ikonkalar',
            'justify-content',
            'space-evenly',
          ),
          style('grow', 'Matn qolgan joyni egallaydi', '#matn', 'flex-grow', '1'),
        ],
      },
    },
    {
      slug: 'icons',
      title: 'Bootstrap Icons',
      exercise: {
        title: 'Ikonkali interfeys',
        description: 'Bootstrap Icons’ni ulash va accessibility.',
        instructions: md(
          `- \`<head>\` ga Bootstrap Icons’ni ulang: \`${ICONS_CDN}\`.`,
          '- “Hisobot tayyor” oldiga `<i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i> `.',
          '- “Yuklab olish” tugmasiga `bi-download` ikonkasi.',
          '- `#sozlama` — faqat `bi-gear` ikonkasi va tugmaga `aria-label="Sozlamalar"`.',
        ),
        expectedBehavior: 'Yashil ✓, yuklab olish ikonkali tugma va tishli g‘ildirakli tugma.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(ICONS), { title: 'Ikonkalar' }),
        checks: [
          style(
            'font',
            'Ikonka shrifti ulangan',
            '.bi-download',
            'font-family',
            'bootstrap-icons',
            { pseudo: '::before' },
          ),
          style('green', 'Yashil belgi', '.bi-check-circle-fill', 'color', RGB.bs5.success),
          attr('label', 'Sozlamalar tugmasi nomli', '#sozlama', 'aria-label', 'Sozlamalar'),
          has('hidden', 'Ikonkalar yashirin', 'i.bi[aria-hidden="true"]', { min: 3 }),
        ],
      },
      quiz: quiz('6-modul testi: utilitalar, qorong‘i rejim va Flex', [
        q(
          'm6-start',
          'Bootstrap 5 da nega `ml-*` o‘rniga `ms-*` (start) ishlatiladi?',
          [
            'O‘ngdan chapga yoziladigan tillarda ham to‘g‘ri ishlashi uchun',
            'Qisqaroq yozilishi uchun',
            'Faqat telefon uchun',
            'Brauzerlar `ml` ni tushunmaydi',
          ],
          [0],
        ),
        q(
          'm6-theme',
          'Butun sahifani qorong‘i rejimga o‘tkazish uchun?',
          [
            '`<html data-bs-theme="dark">`',
            '`<body class="dark">`',
            '`<html class="bg-dark">`',
            '`<meta name="theme" content="dark">`',
          ],
          [0],
        ),
        q(
          'm6-adapt',
          'Qorong‘i rejimda o‘zi moslashadigan klasslar? (bir nechta javob)',
          ['`bg-body-tertiary`', '`text-body-secondary`', '`bg-body`', '`bg-light`'],
          [0, 1, 2],
        ),
        q(
          'm6-gap',
          'Flex konteynerdagi elementlar orasiga 1rem masofa berish?',
          ['`gap-3`', '`m-3` har bir elementga', '`space-3`', '`flex-gap-1`'],
          [0],
        ),
        q(
          'm6-media',
          'Bootstrap 5 da `.media` o‘rniga nima ishlatiladi?',
          [
            '`d-flex` + `flex-shrink-0` + `flex-grow-1`',
            '`.media` o‘zgarmagan',
            '`.card-media`',
            '`.row` + `.col-media`',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  utilities: bs5(
    slots(UTILS, {
      card: cls('border border-2 border-primary rounded-3 shadow p-4 mb-3'),
      row: cls('d-flex gap-3'),
      rel: ' position-relative',
      dot: DOT,
    }),
    { title: 'Utilitalar' },
  ),
  'dark-mode': bs5(
    slots(DARK, {
      card: ` data-bs-theme="dark"${cls('bg-body text-body p-4 rounded-3')}`,
      muted: cls('text-body-secondary'),
    }),
    { title: 'Qorong‘i rejim', js: DARK_JS },
  ),
  flex: bs5(
    slots(FLEX, {
      head: cls('d-flex justify-content-between align-items-center mb-3'),
      menu: cls('d-flex flex-column flex-md-row gap-2'),
      login: cls('ms-md-auto'),
      even: cls('d-flex justify-content-evenly my-3'),
      media: cls('d-flex'),
      shrink: cls('flex-shrink-0'),
      grow: cls('flex-grow-1 ms-3'),
    }),
    { title: 'Flex' },
  ),
  icons: bs5(
    slots(ICONS, {
      okIcon: '<i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i> ',
      download: '<i class="bi bi-download" aria-hidden="true"></i> ',
      gear: '<i class="bi bi-gear" aria-hidden="true"></i>',
      label: ' aria-label="Sozlamalar"',
    }),
    { title: 'Ikonkalar', head: `<link rel="stylesheet" href="${ICONS_CDN}">` },
  ),
};
