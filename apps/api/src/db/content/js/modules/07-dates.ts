import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY07 = {
  dates: `<h1>Kurs taqvimi</h1>
<p>Kurs boshlanadi: <span id="sana"></span></p>
<p>Yil oxirigacha: <span id="kunlar"></span> kun</p>
<label>Boshlanishdan necha kun keyin? <input id="n" type="number"></label>
<button type="button" id="qosh">Hisoblash</button>
<p id="keyin"></p>`,
  formats: `<h1>Sana formati</h1>
<input id="sana" type="date">
<button type="button" id="formatla">Formatlash</button>
<p>O‘zbekcha format: <span id="uzbek"></span></p>
<p>Oy: <span id="oy-nomi"></span></p>`,
  get: `<h1>Sana ma’lumotlari</h1>
<section>
  <h2>Hafta kuni</h2>
  <input id="sana" type="date">
  <button type="button" id="kun-btn">Aniqlash</button>
  <p id="kun"></p>
</section>
<section>
  <h2>Yosh (bugun: 13.10.2026)</h2>
  <input id="tugilgan" type="date">
  <button type="button" id="yosh-btn">Hisoblash</button>
  <p><span id="yosh"></span> yosh</p>
</section>`,
  set: `<h1>Topshiriq muddati (bugun: 13.10.2026)</h1>
<label>Berilgan sana: <input id="berilgan" type="date"></label>
<label>Muddat (kun): <input id="kunlar" type="number"></label>
<button type="button" id="hisobla">Hisoblash</button>
<p>Topshirish muddati: <span id="muddat"></span></p>
<p>Muddat o‘tganmi: <span id="otdimi"></span></p>`,
};

export const SANA_OQI = `// Input qiymatini ('2026-03-08') mahalliy sanaga aylantiradi.
function sanaOqi(qiymat) {
  const q = qiymat.split('-');
  return new Date(Number(q[0]), Number(q[1]) - 1, Number(q[2]));
}

const BUGUN = new Date(2026, 9, 13); // mashq uchun qat’iy “bugun”`;

export const m07: ModuleDef = {
  title: 'Sana va vaqt',
  lessons: [
    {
      slug: 'dates',
      title: 'Sanalar',
      exercise: {
        title: 'Kurs taqvimi',
        description: '`new Date(y, m, d)`, sanalar farqi va oshib ketgan kunlar.',
        instructions: md(
          '1. `boshlanish` — 2026-yil 1-sentabr (oylar 0 dan!). `#sana` ga `toDateString()` ni yozing.',
          '2. `#kunlar` ga 1-sentabrdan 31-dekabrgacha bo‘lgan kunlar sonini yozing (`Math.round`).',
          '3. `#qosh` bosilganda boshlanishdan `#n` kun keyingi sanani `new Date(2026, 8, 1 + n)` bilan hisoblab, `#keyin` ga `toDateString()` ni yozing.',
        ),
        expectedBehavior: 'Tue Sep 01 2026; 121 kun; 30 kun keyin — Thu Oct 01 2026.',
        difficulty: 'EASY',
        starterFiles: app(BODY07.dates, '// Kurs taqvimi'),
        checks: [
          text('start', 'Boshlanish sanasi', '#sana', 'Tue Sep 01 2026', {
            equals: true,
            hint: 'Sentabr — `8`, chunki oylar 0 dan sanaladi.',
          }),
          text('days', 'Yil oxirigacha 121 kun', '#kunlar', '121', { equals: true }),
          after(
            [fill('#n', '30'), click('#qosh')],
            text('plus30', '30 kun keyin', '#keyin', 'Thu Oct 01 2026', { equals: true }),
          ),
          after(
            [fill('#n', '122'), click('#qosh')],
            text('plus122', '122 kun keyin — keyingi yil', '#keyin', 'Fri Jan 01 2027', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'date-formats',
      title: 'Sana formatlari',
      exercise: {
        title: 'O‘zbekcha sana',
        description: '`YYYY-MM-DD` ni qismlarga ajratish va oy nomi.',
        instructions: md(
          "`#formatla` bosilganda `#sana` qiymatini (`2026-03-08`) `split('-')` bilan ajrating va:",
          '',
          '1. `#uzbek` ga **08.03.2026** formatini yozing.',
          '2. `#oy-nomi` ga oy nomini yozing (`OYLAR` massivi: yanvar … dekabr).',
        ),
        expectedBehavior: '2026-03-08 → 08.03.2026, mart.',
        difficulty: 'EASY',
        starterFiles: app(BODY07.formats, '// OYLAR massivi va #formatla'),
        checks: [
          after(
            [fill('#sana', '2026-03-08'), click('#formatla')],
            text('fmt', 'KK.OO.YYYY format', '#uzbek', '08.03.2026', { equals: true }),
          ),
          after(
            [fill('#sana', '2026-12-31'), click('#formatla')],
            text('fmt2', 'Boshqa sana ham', '#uzbek', '31.12.2026', { equals: true, hidden: true }),
          ),
          after(
            [fill('#sana', '2026-03-08'), click('#formatla')],
            text('month', 'Oy nomi', '#oy-nomi', 'mart', { equals: true }),
          ),
          after(
            [fill('#sana', '2026-12-31'), click('#formatla')],
            text('month2', 'Dekabr', '#oy-nomi', 'dekabr', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'date-get',
      title: 'Sanadan qiymat olish',
      exercise: {
        title: 'Hafta kuni va yosh',
        description: '`getDay`, millisoniyalar farqi va `Math.floor`.',
        instructions: md(
          '`sanaOqi` va `BUGUN` tayyor.',
          '',
          '1. `HAFTA` massivini yarating (yakshanba, dushanba, …, shanba). `#kun-btn` bosilganda tanlangan sananing hafta kunini `#kun` ga yozing.',
          '2. `#yosh-btn` bosilganda tug‘ilgan sanadan `BUGUN` gacha to‘liq yillar sonini `#yosh` ga yozing (`365.25` kunlik yil, `Math.floor`).',
        ),
        expectedBehavior: '2026-03-08 → yakshanba; 2006-05-20 → 20 yosh.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY07.get, `${SANA_OQI}\n\n// 1. HAFTA va #kun-btn\n\n// 2. #yosh-btn`),
        checks: [
          after(
            [fill('#sana', '2026-03-08'), click('#kun-btn')],
            text('day', '8-mart 2026 — yakshanba', '#kun', 'yakshanba', {
              equals: true,
              hint: '`getDay()` da 0 — yakshanba.',
            }),
          ),
          after(
            [fill('#sana', '2026-09-01'), click('#kun-btn')],
            text('day2', '1-sentabr 2026 — seshanba', '#kun', 'seshanba', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#tugilgan', '2006-05-20'), click('#yosh-btn')],
            text('age', '2006-05-20 — 20 yosh', '#yosh', '20', { equals: true }),
          ),
          after(
            [fill('#tugilgan', '1990-12-25'), click('#yosh-btn')],
            text('age2', '1990-12-25 — 35 yosh', '#yosh', '35', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'date-set',
      title: 'Sanani o‘zgartirish',
      exercise: {
        title: 'Topshiriq muddati',
        description: '`setDate` bilan kun qo‘shish va sanalarni solishtirish.',
        instructions: md(
          '`sanaOqi` va `BUGUN` tayyor.',
          '',
          '1. `kunQosh(sana, n)` — sananing **nusxasiga** `n` kun qo‘shib qaytarsin (`setDate`).',
          '2. `formatla(d)` — **KK.OO.YYYY** matnini qaytarsin.',
          '3. `#hisobla` bosilganda muddatni `#muddat` ga, `muddat < BUGUN` natijasini `#otdimi` ga yozing.',
        ),
        expectedBehavior: '2026-10-01 + 14 → 15.10.2026, false; 2026-09-01 + 7 → true.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY07.set, `${SANA_OQI}\n\n// kunQosh, formatla va #hisobla`),
        checks: [
          after(
            [fill('#berilgan', '2026-10-01'), fill('#kunlar', '14'), click('#hisobla')],
            text('deadline', '1-oktabr + 14 kun', '#muddat', '15.10.2026', { equals: true }),
          ),
          after(
            [fill('#berilgan', '2026-12-25'), fill('#kunlar', '10'), click('#hisobla')],
            text('deadline2', 'Yil almashadi', '#muddat', '04.01.2027', {
              equals: true,
              hidden: true,
              hint: '`setDate(getDate() + n)` oy va yilni o‘zi almashtiradi.',
            }),
          ),
          after(
            [fill('#berilgan', '2026-10-01'), fill('#kunlar', '14'), click('#hisobla')],
            text('notlate', 'Muddat hali o‘tmagan', '#otdimi', 'false', { equals: true }),
          ),
          after(
            [fill('#berilgan', '2026-09-01'), fill('#kunlar', '7'), click('#hisobla')],
            text('late', 'Muddat o‘tgan', '#otdimi', 'true', { equals: true }),
          ),
          clean(),
        ],
      },
      quiz: quiz('7-modul testi: Sana va vaqt', [
        q(
          'month',
          '`new Date(2026, 1, 10)` qaysi sana?',
          ['10-fevral 2026', '10-yanvar 2026', '1-oktabr 2026', '2-oktabr 2026'],
          [0],
        ),
        q(
          'getday',
          '`getDay()` nima qaytaradi?',
          ['Hafta kuni (0 — yakshanba)', 'Oyning kuni', 'Yilning kuni', 'Kunlar soni'],
          [0],
        ),
        q(
          'overflow',
          '`new Date(2026, 8, 31)` qaysi sana bo‘ladi?',
          ['1-oktabr 2026', '31-sentabr 2026', 'Xato', '30-sentabr 2026'],
          [0],
        ),
        q(
          'equal',
          '`new Date(2026, 0, 1) === new Date(2026, 0, 1)` natijasi?',
          ['`false` — ikki xil obyekt', '`true`', 'Xato', '`undefined`'],
          [0],
        ),
        q(
          'iso',
          '`<input type="date">` qiymatini mahalliy sanaga aylantirishning ishonchli usuli?',
          [
            "`split('-')` va `new Date(y, m - 1, d)`",
            '`new Date(value)` — har doim mahalliy vaqt',
            '`Date.parse(value).toLocal()`',
            '`Number(value)`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
