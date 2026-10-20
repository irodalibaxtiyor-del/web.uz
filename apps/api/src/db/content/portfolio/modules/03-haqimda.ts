import type { ProjectFile } from '@webdizayn/shared';
import { at, has, md, pic, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

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

const PROFILE = `<section id="haqimda" class="haqimda">
  ${pic('78716c', 'Aziza Karimova portreti', 480, 640, ' class="surat"')}
  <div class="matn">
    <h2>Men haqimda</h2>
    <p>Ikki yildan beri kichik bizneslar uchun saytlar yasayman. Eng yoqtirgan ishim — murakkab narsani oddiy va tushunarli ko‘rsatish.</p>
  </div>
</section>`;

const PROFILE_CSS = `${RESET}

${TOKENS}

.haqimda {
  padding: 48px 24px;
}`;

const SKILLS = (roles: boolean) => {
  const row = (name: string, value: number) => `  <div class="konikma">
    <span>${name}</span>
    <div class="chiziq"${roles ? ` role="progressbar" aria-label="${name}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"` : ''}>
      <div class="daraja" style="--qiymat: ${value}%"></div>
    </div>
  </div>`;
  return `<section class="konikmalar">
  <h2>Ko‘nikmalar</h2>
${row('HTML', 90)}
${row('CSS', 75)}
${row('JavaScript', 60)}
</section>`;
};

const SKILLS_CSS = `${RESET}

${TOKENS}

.konikmalar {
  padding: 24px;
}

.konikma {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.chiziq {
  width: 300px;
  height: 8px;
}`;

const TIMELINE = `<section class="tajriba">
  <h2>Tajriba</h2>
  <ol class="vaqt">
    <li class="band"><time datetime="2026">2026</time> — Frontend dasturchi, “Raqam” studiyasi</li>
    <li class="band"><time datetime="2025">2025</time> — Amaliyot, onlayn do‘kon</li>
    <li class="band"><time datetime="2024">2024</time> — WEBDIZAYN.UZ kurslari</li>
  </ol>
</section>`;

const TIMELINE_CSS = `${RESET}

${TOKENS}

.tajriba {
  padding: 24px;
}

.vaqt {
  margin: 0;
  list-style: none;
}

.band {
  padding-bottom: 20px;
}

time {
  font-weight: 700;
}`;

const ICON = (d: string) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="${d}"/></svg>`;

const SOCIAL = `<footer class="pastki">
  <p>Bog‘lanish:</p>
  <div class="ijtimoiy">
    <a href="https://github.com/">${ICON('M9 19c-4 1-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 00-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21')}</a>
    <a href="https://t.me/">${ICON('M21 4L3 11l6 2 2 6 3-4 5 4z')}</a>
    <a href="mailto:aziza@example.uz">${ICON('M4 6h16v12H4zM4 7l8 6 8-6')}</a>
  </div>
</footer>`;

const SOCIAL_CSS = `${RESET}

${TOKENS}

.pastki {
  padding: 24px;
}

.ijtimoiy {
  display: flex;
  gap: 12px;
}`;

export const m03: ModuleDef = {
  title: 'Men haqimda',
  lessons: [
    {
      slug: 'profil',
      title: 'Profil bo‘limi',
      exercise: {
        title: 'Surat va matn yonma-yon',
        description: 'Ikki ustunli moslashuvchan bo‘lim va portret bezagi.',
        instructions: md(
          '1. `.haqimda`: `display: grid`, `gap: 32px`; `@media (min-width: 768px)` — `grid-template-columns: 240px 1fr`, `align-items: center`.',
          '2. `.surat`: `display: block`, `width: 100%`, `max-width: 240px`, `height: auto`, `aspect-ratio: 1`, `object-fit: cover`, `border-radius: 24px`.',
        ),
        expectedBehavior:
          'Telefonda surat matn ustida, kengroq ekranda chapda; portret kvadrat ramkada, yumaloq burchakli.',
        difficulty: 'EASY',
        starterFiles: site(PROFILE, PROFILE_CSS),
        checks: [
          at(
            1000,
            700,
            style(
              'cols',
              'Kengroq ekranda 240px + matn',
              '.haqimda',
              'grid-template-columns',
              '240px 680px',
            ),
          ),
          at(
            375,
            700,
            style('one', 'Telefonda bitta ustun', '.haqimda', 'grid-template-columns', '327px'),
          ),
          style('ratio', 'Surat kvadrat', '.surat', 'aspect-ratio', '1 / 1'),
          style('cover', 'Surat qirqib to‘ldiriladi', '.surat', 'object-fit', 'cover'),
          style('radius', 'Burchaklar 24px', '.surat', 'border-top-left-radius', '24px'),
        ],
      },
    },
    {
      slug: 'konikmalar',
      title: 'Ko‘nikmalar paneli',
      exercise: {
        title: 'Foizli chiziqlar',
        description: 'CSS o‘zgaruvchisi bilan kenglik va `role="progressbar"`.',
        instructions: md(
          '1. Har bir `.chiziq` ga: `role="progressbar"`, `aria-label` (ko‘nikma nomi), `aria-valuenow` (son), `aria-valuemin="0"`, `aria-valuemax="100"`.',
          '2. `.chiziq`: `overflow: hidden`, `border-radius: 999px`, `background-color: var(--chegara)`.',
          '3. `.daraja`: `height: 100%`, `width: var(--qiymat)`, `background-color: var(--urg)`.',
        ),
        expectedBehavior:
          'Uchta chiziq 90%, 75% va 60% gacha to‘ldirilgan; ekran o‘quvchi har birini “HTML, 90%” deb o‘qiydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(SKILLS(false), SKILLS_CSS),
        checks: [
          has(
            'role',
            'Har bir chiziq — progressbar',
            '.chiziq[role="progressbar"][aria-valuenow]',
            { min: 3 },
          ),
          style('html', 'HTML — 90%', '.konikma:nth-of-type(1) .daraja', 'width', '270px'),
          style('css', 'CSS — 75%', '.konikma:nth-of-type(2) .daraja', 'width', '225px'),
          style('fill', 'Urg‘u rangida', '.daraja', 'background-color', '#c2410c'),
          style('clip', 'Chiziq ichidan chiqmaydi', '.chiziq', 'overflow-x', 'hidden'),
        ],
      },
    },
    {
      slug: 'vaqt-chizigi',
      title: 'Vaqt chizig‘i',
      exercise: {
        title: 'Tajriba vaqt chizig‘i',
        description: 'Psevdoelementlar bilan chiziq va nuqtalar.',
        instructions: md(
          '1. `.vaqt`: `position: relative`, `padding-left: 28px`.',
          '2. `.vaqt::before`: `content: ""`, `position: absolute`, `left: 6px`, `top: 4px`, `bottom: 4px`, `width: 2px`, `background-color: var(--chegara)`.',
          '3. `.band`: `position: relative`; `.band::before`: `content: ""`, `position: absolute`, `left: -27px`, `top: 6px`, `width: 12px`, `height: 12px`, `border-radius: 50%`, `background-color: var(--urg)`.',
        ),
        expectedBehavior: 'Chapda vertikal kulrang chiziq, har bir yil oldida rangli nuqta.',
        difficulty: 'MEDIUM',
        starterFiles: site(TIMELINE, TIMELINE_CSS),
        checks: [
          style('rel', 'Ro‘yxat — relative', '.vaqt', 'position', 'relative'),
          style('line', 'Vertikal chiziq 2px', '.vaqt', 'width', '2px', { pseudo: '::before' }),
          style('dot', 'Nuqta doira', '.band', 'border-top-left-radius', '50%', {
            pseudo: '::before',
          }),
          style('dot-color', 'Nuqta urg‘u rangida', '.band', 'background-color', '#c2410c', {
            pseudo: '::before',
          }),
          has('time', 'Sanalar `time` elementida', 'ol.vaqt time[datetime]', {
            min: 3,
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'ijtimoiy',
      title: 'Ijtimoiy tarmoq havolalari',
      exercise: {
        title: 'Ikonkali havolalar',
        description: 'Nom, xavfsiz tashqi havola va bosish maydoni.',
        instructions: md(
          '1. Har bir havolaga `aria-label`: “GitHub”, “Telegram”, “Email”.',
          '2. GitHub va Telegram havolalariga `target="_blank"` va `rel="noopener noreferrer"`.',
          '3. Barcha `<svg>` ga `aria-hidden="true"`.',
          '4. `.ijtimoiy a`: `display: grid`, `place-items: center`, `width: 44px`, `height: 44px`, `border: 1px solid var(--chegara)`, `border-radius: 50%`, `color: var(--matn)`.',
        ),
        expectedBehavior:
          'Uchta doira ikonkali havola; ekran o‘quvchi har birining nomini aytadi; tashqi havolalar yangi oynada xavfsiz ochiladi.',
        difficulty: 'EASY',
        starterFiles: site(SOCIAL, SOCIAL_CSS),
        checks: [
          has('label', 'Havolalarning nomi bor', '.ijtimoiy a[aria-label]', { min: 3 }),
          has('rel', 'Tashqi havolalar xavfsiz', '.ijtimoiy a[target="_blank"][rel~="noopener"]', {
            min: 2,
          }),
          has('hidden', 'Ikonkalar yashirin', '.ijtimoiy svg[aria-hidden="true"]', { min: 3 }),
          style('size', 'Bosish maydoni 44px', '.ijtimoiy a', 'width', '44px'),
          style('round', 'Doira', '.ijtimoiy a', 'border-top-left-radius', '50%'),
        ],
      },
      quiz: quiz('3-modul testi: Men haqimda', [
        q(
          'p3-about',
          '“Men haqimda” bo‘limida nima muhim?',
          [
            'Qisqa, aniq hikoya: nima qilasiz va nima sizni qiziqtiradi',
            'Tug‘ilgandan beri bo‘lgan barcha voqealar',
            'Faqat ko‘nikmalar ro‘yxati',
            'Ko‘p emoji',
          ],
          [0],
        ),
        q(
          'p3-bars',
          'Ko‘nikma chiziqlarining (90% CSS kabi) kamchiligi nima?',
          [
            'Foiz o‘lchab bo‘lmaydigan narsani aniq qilib ko‘rsatadi; loyihalar bilan ko‘rsatish ishonchliroq',
            'Ular brauzerda ishlamaydi',
            'Ular sahifani sekinlashtiradi',
            'Hech qanday kamchiligi yo‘q',
          ],
          [0],
        ),
        q(
          'p3-progress',
          'Div’dan yasalgan chiziqni ekran o‘quvchi tushunishi uchun nima kerak?',
          [
            '`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` va nom',
            'Faqat rang',
            '`title` atributi',
            'Hech narsa',
          ],
          [0],
        ),
        q(
          'p3-noopener',
          'Nega `target="_blank"` havolaga `rel="noopener"` qo‘shiladi?',
          [
            'Yangi oyna asl sahifani `window.opener` orqali boshqara olmasligi uchun',
            'Havola tezroq ochilishi uchun',
            'Qidiruv tizimi uchun majburiy',
            'Havola rangini o‘zgartirish uchun',
          ],
          [0],
        ),
        q(
          'p3-pseudo',
          '`::before` psevdoelementi ko‘rinishi uchun nima shart?',
          [
            '`content` xususiyati (hatto bo‘sh `""`)',
            '`display: none`',
            'JavaScript',
            '`id` atributi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  profil: site(
    PROFILE,
    `${PROFILE_CSS.replace('.haqimda {\n  padding: 48px 24px;\n}', '.haqimda {\n  display: grid;\n  gap: 32px;\n  padding: 48px 24px;\n}')}

.surat {
  display: block;
  width: 100%;
  max-width: 240px;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 24px;
}

@media (min-width: 768px) {
  .haqimda {
    grid-template-columns: 240px 1fr;
    align-items: center;
  }
}`,
  ),
  konikmalar: site(
    SKILLS(true),
    `${SKILLS_CSS.replace('.chiziq {\n  width: 300px;\n  height: 8px;\n}', '.chiziq {\n  width: 300px;\n  height: 8px;\n  overflow: hidden;\n  border-radius: 999px;\n  background-color: var(--chegara);\n}')}

.daraja {
  height: 100%;
  width: var(--qiymat);
  background-color: var(--urg);
}`,
  ),
  'vaqt-chizigi': site(
    TIMELINE,
    `${TIMELINE_CSS.replace('.vaqt {\n  margin: 0;', '.vaqt {\n  position: relative;\n  padding-left: 28px;\n  margin: 0;').replace('.band {\n  padding-bottom: 20px;', '.band {\n  position: relative;\n  padding-bottom: 20px;')}

.vaqt::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background-color: var(--chegara);
}

.band::before {
  content: "";
  position: absolute;
  left: -27px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--urg);
}`,
  ),
  ijtimoiy: site(
    SOCIAL.replace(
      '<a href="https://github.com/">',
      '<a href="https://github.com/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">',
    )
      .replace(
        '<a href="https://t.me/">',
        '<a href="https://t.me/" aria-label="Telegram" target="_blank" rel="noopener noreferrer">',
      )
      .replace(
        '<a href="mailto:aziza@example.uz">',
        '<a href="mailto:aziza@example.uz" aria-label="Email">',
      )
      .replaceAll('<svg viewBox', '<svg aria-hidden="true" viewBox'),
    `${SOCIAL_CSS}

.ijtimoiy a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--chegara);
  border-radius: 50%;
  color: var(--matn);
}`,
  ),
};
