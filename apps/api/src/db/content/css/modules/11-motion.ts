import { after, md, q, quiz, site, style, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY11 = {
  t2d: `<span class="belgi">Yangi!</span>
<div class="karta">Ustiga olib keling</div>
<span class="ikonka">★</span>`,
  t3d: `<div class="sahna">
  <div class="karta">
    <div class="old">Savol: CSS nima?</div>
    <div class="orqa">Javob: uslublar tili</div>
  </div>
</div>`,
  transitions: `<button class="tugma">Saqlash</button>
<div class="karta">Kartochka</div>`,
  animations: `<div class="yuklash" role="status" aria-label="Yuklanmoqda"></div>
<p class="xabar">Saqlandi!</p>`,
};

export const T2D_CSS = `.belgi,
.ikonka {
  display: inline-block;
}

.karta {
  width: 200px;
  padding: 16px;
  border: 1px solid #dddddd;
}`;

export const T3D_CSS = `.karta {
  position: relative;
  width: 240px;
  height: 140px;
}

.old,
.orqa {
  position: absolute;
  inset: 0;
  padding: 16px;
  color: white;
}

.old {
  background-color: #0071dc;
}

.orqa {
  background-color: #0e1133;
}`;

export const TRANSITIONS_CSS = `.tugma {
  padding: 10px 20px;
  border: 0;
  color: white;
  background-color: #0071dc;
}

.karta {
  width: 200px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #dddddd;
}`;

export const ANIMATIONS_CSS = `.yuklash {
  width: 32px;
  height: 32px;
  border: 4px solid #e5e7eb;
  border-top-color: #0071dc;
  border-radius: 50%;
}`;

export const m11: ModuleDef = {
  title: 'Transformatsiya va animatsiya',
  lessons: [
    {
      slug: 'transforms-2d',
      title: '2D transformatsiyalar',
      exercise: {
        title: 'Burish, surish va kattalashtirish',
        description: '`rotate`, `translateY`, `scale` va `transform-origin`.',
        instructions: md(
          '1. `.belgi`: `transform: rotate(-5deg)`, `transform-origin: left top`.',
          '2. `.karta:hover`: `transform: translateY(-4px)`.',
          '3. `.ikonka`: `transform: scale(1.5)`.',
        ),
        expectedBehavior: 'Qiya yorliq, hover’da ko‘tariladigan kartochka, kattaroq yulduzcha.',
        difficulty: 'EASY',
        starterFiles: site(BODY11.t2d, T2D_CSS),
        checks: [
          style('rotate', 'Yorliq -5° burilgan', '.belgi', 'transform', 'rotate(-5deg)'),
          style('origin', 'Chap yuqori burchak atrofida', '.belgi', 'transform-origin', '0px 0px'),
          after(
            [{ type: 'hover', selector: '.karta' }],
            style('hover', 'Hover’da 4px yuqoriga', '.karta', 'transform', 'translateY(-4px)'),
          ),
          style('scale', 'Ikonka 1.5 baravar', '.ikonka', 'transform', 'scale(1.5)'),
        ],
      },
    },
    {
      slug: 'transforms-3d',
      title: '3D transformatsiyalar',
      exercise: {
        title: 'Ag‘dariladigan kartochka',
        description: '`perspective`, `preserve-3d` va `backface-visibility`.',
        instructions: md(
          '1. `.sahna`: `perspective: 800px`.',
          '2. `.karta`: `transform-style: preserve-3d`, `transition: transform 0.6s`.',
          '3. `.sahna:hover .karta`: `transform: rotateY(180deg)`.',
          '4. `.old` va `.orqa`: `backface-visibility: hidden`; `.orqa` oldindan `rotateY(180deg)`.',
        ),
        expectedBehavior: 'Hover’da kartochka ag‘dariladi va orqa tomonidagi javob ko‘rinadi.',
        difficulty: 'HARD',
        starterFiles: site(BODY11.t3d, T3D_CSS),
        checks: [
          style('perspective', 'Sahnada perspektiva', '.sahna', 'perspective', '800px'),
          style('preserve', 'Kartochka 3D fazoda', '.karta', 'transform-style', 'preserve-3d'),
          style('backface', 'Orqa tomon yashirinadi', '.old', 'backface-visibility', 'hidden'),
          style('back', 'Orqa tomon oldindan burilgan', '.orqa', 'transform', 'rotateY(180deg)'),
          after(
            [
              { type: 'hover', selector: '.sahna' },
              { type: 'wait', ms: 800 },
            ],
            style('flip', 'Hover’da ag‘dariladi', '.karta', 'transform', 'rotateY(180deg)'),
          ),
        ],
      },
    },
    {
      slug: 'transitions',
      title: 'O‘tishlar',
      exercise: {
        title: 'Silliq hover',
        description: '`transition` xususiyatlari va davomiyligi.',
        instructions: md(
          '1. `.tugma`: `transition: background-color 0.3s ease`; hover’da fon `#005bb0`.',
          '2. `.karta`: `transition: transform 0.2s ease-out`; hover’da `translateY(-4px)`.',
        ),
        expectedBehavior: 'Tugma rangi va kartochka holati silliq o‘zgaradi.',
        difficulty: 'EASY',
        starterFiles: site(BODY11.transitions, TRANSITIONS_CSS),
        checks: [
          style(
            'prop',
            'Tugmada fon rangi o‘tadi',
            '.tugma',
            'transition-property',
            'background-color',
            {
              hint: '`all` emas, aniq xususiyat yozing.',
            },
          ),
          style('duration', 'Davomiylik 0.3s', '.tugma', 'transition-duration', '0.3s'),
          after(
            [
              { type: 'hover', selector: '.tugma' },
              { type: 'wait', ms: 500 },
            ],
            style('hover', 'Hover’da to‘q ko‘k', '.tugma', 'background-color', '#005bb0'),
          ),
          style('ease', 'Kartochka `ease-out`', '.karta', 'transition-timing-function', 'ease-out'),
          style(
            'card-prop',
            'Kartochkada `transform` o‘tadi',
            '.karta',
            'transition-property',
            'transform',
          ),
        ],
      },
    },
    {
      slug: 'animations',
      title: 'Animatsiyalar',
      exercise: {
        title: 'Yuklanish belgisi va xabar',
        description: '`@keyframes`, cheksiz va bir martalik animatsiya.',
        instructions: md(
          '1. `@keyframes aylanish`: `from` da `rotate(0deg)`, `to` da `rotate(360deg)`.',
          '2. `.yuklash`: `animation: aylanish 1s linear infinite`.',
          '3. `@keyframes paydo`: `from { opacity: 0; transform: translateY(12px); }`.',
          '4. `.xabar`: `animation: paydo 0.4s ease-out`.',
        ),
        expectedBehavior: 'Doimiy aylanuvchi yuklanish belgisi va pastdan paydo bo‘ladigan xabar.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY11.animations, ANIMATIONS_CSS),
        checks: [
          style(
            'name',
            'Belgi `aylanish` animatsiyasida',
            '.yuklash',
            'animation-name',
            'aylanish',
          ),
          style('duration', 'Bir aylanish 1s', '.yuklash', 'animation-duration', '1s'),
          style('linear', 'Bir xil tezlikda', '.yuklash', 'animation-timing-function', 'linear'),
          style('infinite', 'Cheksiz', '.yuklash', 'animation-iteration-count', 'infinite'),
          style('appear', 'Xabar paydo bo‘ladi', '.xabar', 'animation-name', 'paydo'),
        ],
      },
      quiz: quiz('11-modul testi: Transformatsiya va animatsiya', [
        q(
          'q1',
          '`transform: translateY(-4px)` elementning qo‘shnilariga qanday ta’sir qiladi?',
          [
            'Ta’sir qilmaydi — asl joyi saqlanadi',
            'Qo‘shnilarni suradi',
            'Qo‘shnilarni yashiradi',
            'Maket qayta hisoblanadi',
          ],
          [0],
        ),
        q(
          'q2',
          '3D aylanishda chuqurlik hissi uchun otaga nima beriladi?',
          ['`perspective`', '`z-index`', '`transform-origin`', '`opacity`'],
          [0],
        ),
        q(
          'q3',
          '`transition` qaysi holatga yoziladi?',
          ['Boshlang‘ich holatga', 'Faqat `:hover` ga', 'Faqat `@keyframes` ga', 'Farqi yo‘q'],
          [0],
        ),
        q(
          'q4',
          'Eng silliq animatsiya qilinadigan xususiyatlar?',
          ['`transform`', '`opacity`', '`width`', '`margin-left`'],
          [0, 1],
        ),
        q(
          'q5',
          'Animatsiya oxirgi kadrda qolishi uchun?',
          [
            '`animation-fill-mode: forwards`',
            '`animation-direction: alternate`',
            '`animation-iteration-count: 1`',
            '`animation-play-state: paused`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
