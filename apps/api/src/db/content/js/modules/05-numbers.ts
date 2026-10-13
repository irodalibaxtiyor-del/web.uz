import { after, app, clean, click, fill, has, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY05 = {
  numbers: `<h1>Sonlar</h1>
<p>0.1 + 0.2 = <span id="oddiy"></span></p>
<p>Tuzatilgan: <span id="tuzatilgan"></span></p>
<input id="kiritma" placeholder="Biror narsa yozing">
<button type="button" id="tekshir">Son emasmi?</button>
<p>NaN: <span id="son-emas"></span></p>`,
  methods: `<h1>Konvertor</h1>
<section>
  <h2>Dollardan so‘mga (kurs 12650)</h2>
  <input id="dollar" type="number" step="0.01">
  <button type="button" id="aylantir">Aylantirish</button>
  <p><span id="som"></span> so‘m</p>
</section>
<section>
  <h2>Matndan son</h2>
  <input id="vazn" placeholder="Masalan: 45.7 kg">
  <button type="button" id="ajrat">Ajratish</button>
  <p>parseFloat: <span id="float"></span></p>
  <p>parseInt: <span id="int"></span></p>
</section>`,
  math: `<h1>Math</h1>
<section>
  <h2>Doira maydoni</h2>
  <input id="radius" type="number">
  <button type="button" id="doira">Hisoblash</button>
  <p><span id="maydon"></span> sm²</p>
</section>
<section>
  <h2>Avtobuslar (har biriga 45 kishi)</h2>
  <input id="odam" type="number">
  <button type="button" id="avtobus">Hisoblash</button>
  <p><span id="soni"></span> ta avtobus</p>
</section>`,
  random: `<h1>Tasodif</h1>
<section>
  <h2>Oraliqdan son</h2>
  <input id="min" type="number" value="1">
  <input id="max" type="number" value="100">
  <button type="button" id="tanla">Tanlash</button>
  <p id="son"></p>
</section>
<section>
  <h2>Zar</h2>
  <button type="button" id="zar">Zar tashlash</button>
  <p id="zar-natija"></p>
</section>`,
};

export const m05: ModuleDef = {
  title: 'Sonlar va Math',
  lessons: [
    {
      slug: 'numbers',
      title: 'Sonlar',
      exercise: {
        title: 'Kasrlar va NaN',
        description: 'Kasr aniqligi va `isNaN`.',
        instructions: md(
          '1. `#oddiy` ga `0.1 + 0.2` ning **o‘zini** yozing — natijani ko‘ring.',
          '2. `#tuzatilgan` ga uni butun sonlar orqali hisoblang: `(0.1 * 10 + 0.2 * 10) / 10`.',
          '3. `#tekshir` bosilganda `#kiritma` ni `Number` ga aylantiring va `#son-emas` ga `isNaN(...)` natijasini yozing.',
        ),
        expectedBehavior: '0.30000000000000004 va 0.3; “abc” → true, “12” → false.',
        difficulty: 'EASY',
        starterFiles: app(BODY05.numbers, '// Kodingizni shu yerda yozing.'),
        checks: [
          text('raw', 'Aniqlik muammosi ko‘rinadi', '#oddiy', '0.30000000000000004', {
            equals: true,
          }),
          text('fixed', 'Tuzatilgan natija', '#tuzatilgan', '0.3', { equals: true }),
          after(
            [fill('#kiritma', 'abc'), click('#tekshir')],
            text('nan', '“abc” — NaN', '#son-emas', 'true', { equals: true }),
          ),
          after(
            [fill('#kiritma', '12'), click('#tekshir')],
            text('num', '“12” — son', '#son-emas', 'false', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'number-methods',
      title: 'Son metodlari',
      exercise: {
        title: 'Valyuta va matndan son',
        description: '`toFixed`, `parseFloat`, `parseInt`.',
        instructions: md(
          '1. `KURS = 12650` konstantasi va `somga(dollar)` funksiyasini yozing: u `toFixed(2)` bilan matn qaytarsin.',
          '2. `#aylantir` bosilganda natijani `#som` ga yozing.',
          '3. `#ajrat` bosilganda `#vazn` matnidan `parseFloat` va `parseInt` natijalarini `#float` va `#int` ga yozing.',
        ),
        expectedBehavior: '10 → 126500.00; “45.7 kg” → 45.7 va 45.',
        difficulty: 'EASY',
        starterFiles: app(BODY05.methods, '// 1–2. Valyuta\n\n// 3. Matndan son'),
        checks: [
          after(
            [fill('#dollar', '10'), click('#aylantir')],
            text('usd', '10 dollar', '#som', '126500.00', { equals: true }),
          ),
          after(
            [fill('#dollar', '2.5'), click('#aylantir')],
            text('usd2', '2.5 dollar', '#som', '31625.00', { equals: true, hidden: true }),
          ),
          after(
            [fill('#vazn', '45.7 kg'), click('#ajrat')],
            text('float', '`parseFloat` — 45.7', '#float', '45.7', { equals: true }),
          ),
          after(
            [fill('#vazn', '45.7 kg'), click('#ajrat')],
            text('int', '`parseInt` — 45', '#int', '45', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'math',
      title: 'Math obyekti',
      exercise: {
        title: 'Doira va avtobuslar',
        description: '`Math.PI` va to‘g‘ri yaxlitlash.',
        instructions: md(
          '1. `#doira` bosilganda `Math.PI * r²` ni hisoblang va `#maydon` ga 2 xona aniqlikda yozing.',
          '2. `#avtobus` bosilganda kerakli avtobuslar sonini `#soni` ga yozing (har biriga 45 kishi). Qaysi yaxlitlash kerakligini o‘ylang.',
        ),
        expectedBehavior: 'r = 3 → 28.27; 100 kishi → 3 avtobus; 90 kishi → 2 avtobus.',
        difficulty: 'EASY',
        starterFiles: app(BODY05.math, '// 1. Doira\n\n// 2. Avtobuslar'),
        checks: [
          after(
            [fill('#radius', '3'), click('#doira')],
            text('circle', 'r = 3 → 28.27', '#maydon', '28.27', { equals: true }),
          ),
          after(
            [fill('#radius', '10'), click('#doira')],
            text('circle2', 'r = 10 → 314.16', '#maydon', '314.16', { equals: true, hidden: true }),
          ),
          after(
            [fill('#odam', '100'), click('#avtobus')],
            text('bus', '100 kishi — 3 avtobus', '#soni', '3', {
              equals: true,
              hint: '2.22 avtobus bo‘lmaydi — yuqoriga yaxlitlang: `Math.ceil`.',
            }),
          ),
          after(
            [fill('#odam', '90'), click('#avtobus')],
            text('bus2', '90 kishi — 2 avtobus', '#soni', '2', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'random',
      title: 'Tasodifiy sonlar',
      exercise: {
        title: 'Oraliqdan son va zar',
        description: '`Math.random` va `Math.floor` bilan butun son.',
        instructions: md(
          '1. `tasodifiy(min, max)` funksiyasini yozing: `min` va `max` ham kiradigan tasodifiy butun son qaytarsin.',
          '2. `#tanla` bosilganda `#min` va `#max` dan foydalanib natijani `#son` ga yozing.',
          '3. `#zar` bosilganda `tasodifiy(1, 6)` natijasini `#zar-natija` ga yozing.',
        ),
        expectedBehavior: 'min = max = 5 bo‘lsa doim 5; zar 1 dan 6 gacha.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY05.random, '// tasodifiy(min, max) va tugmalar'),
        checks: [
          after(
            [fill('#min', '5'), fill('#max', '5'), click('#tanla')],
            text('same', 'min = max = 5 → 5', '#son', '5', {
              equals: true,
              hint: '`Math.floor(Math.random() * (max - min + 1)) + min`',
            }),
          ),
          after(
            [fill('#min', '7'), fill('#max', '7'), click('#tanla')],
            text('same2', 'min = max = 7 → 7', '#son', '7', { equals: true, hidden: true }),
          ),
          after([click('#zar')], has('dice', 'Zar natijasi chiqadi', '#zar-natija:not(:empty)')),
          clean(),
        ],
      },
      quiz: quiz('5-modul testi: Sonlar va Math', [
        q(
          'float',
          '`0.1 + 0.2 === 0.3` nima qaytaradi?',
          ['`false`', '`true`', '`NaN`', 'Xato'],
          [0],
        ),
        q('nan', '`NaN === NaN` nimaga teng?', ['`false`', '`true`', '`NaN`', '`undefined`'], [0]),
        q(
          'ceil',
          '100 kishi, avtobusga 45 kishi. Nechta avtobus kerakligini qaysi ifoda to‘g‘ri hisoblaydi?',
          [
            '`Math.ceil(100 / 45)`',
            '`Math.floor(100 / 45)`',
            '`Math.round(100 / 45)`',
            '`100 % 45`',
          ],
          [0],
        ),
        q('parse', "`parseInt('12px')` natijasi?", ['`12`', '`NaN`', "`'12'`", '`12.0`'], [0]),
        q(
          'dice',
          'Zar (1–6) uchun to‘g‘ri ifoda?',
          [
            '`Math.floor(Math.random() * 6) + 1`',
            '`Math.round(Math.random() * 6)`',
            '`Math.random() * 6`',
            '`Math.floor(Math.random() * 7)`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
