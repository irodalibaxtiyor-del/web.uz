import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY08 = {
  booleans: `<h1>Truthy yoki falsy?</h1>
<input id="qiymat" placeholder="Biror narsa yozing (yoki bo‘sh qoldiring)">
<button type="button" id="tekshir">Tekshirish</button>
<p>Boolean(value): <span id="matn"></span></p>
<p>Boolean(Number(value)): <span id="son"></span></p>`,
  comparisons: `<h1>Kirish</h1>
<input id="yosh" type="number" placeholder="Yosh">
<input id="parol" placeholder="Parol">
<button type="button" id="kirish">Kirish</button>
<p>Ruxsat: <span id="ruxsat"></span></p>
<p>Chipta turi: <span id="turi"></span></p>`,
  ifElse: `<h1>Baho kalkulyatori</h1>
<input id="ball" placeholder="Ball (0–100)">
<button type="button" id="baholash">Baholash</button>
<p id="baho"></p>`,
  switch: `<h1>Kalkulyator</h1>
<input id="a" type="number">
<input id="amal" placeholder="+ - * /" size="3">
<input id="b" type="number">
<button type="button" id="hisobla">=</button>
<p id="natija"></p>`,
};

export const m08: ModuleDef = {
  title: 'Mantiq va shartlar',
  lessons: [
    {
      slug: 'booleans',
      title: 'Mantiqiy qiymatlar',
      exercise: {
        title: 'Truthy yoki falsy?',
        description: '`Boolean()` va falsy qiymatlar.',
        instructions: md(
          '`#tekshir` bosilganda:',
          '',
          '1. `#matn` ga `Boolean(value)` natijasini yozing.',
          '2. `#son` ga `Boolean(Number(value))` natijasini yozing.',
          '',
          'Keyin turli qiymatlarni sinab ko‘ring: `salom`, `0`, bo‘sh maydon, ` ` (bo‘sh joy). Natijalarni tushuntira olasizmi?',
        ),
        expectedBehavior: '“0” → matn true, son false; bo‘sh → false.',
        difficulty: 'EASY',
        starterFiles: app(BODY08.booleans, '// #tekshir tugmasi'),
        checks: [
          after(
            [fill('#qiymat', 'salom'), click('#tekshir')],
            text('text', '“salom” — true', '#matn', 'true', { equals: true }),
          ),
          after(
            [fill('#qiymat', '0'), click('#tekshir')],
            text('zero-text', '“0” matni — true', '#matn', 'true', { equals: true }),
          ),
          after(
            [fill('#qiymat', '0'), click('#tekshir')],
            text('zero-num', '0 soni — false', '#son', 'false', { equals: true }),
          ),
          after(
            [fill('#qiymat', ''), click('#tekshir')],
            text('empty', 'Bo‘sh satr — false', '#matn', 'false', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'comparisons',
      title: 'Taqqoslash va mantiq',
      exercise: {
        title: 'Kirish nazorati',
        description: '`===`, `&&`, `||` va ternar operator.',
        instructions: md(
          '`#kirish` bosilganda:',
          '',
          '1. `#ruxsat` — yosh 18 yoki undan katta **va** parol aynan `Web2026` bo‘lsa `true`, aks holda `false`.',
          '2. `#turi` — yosh 7 dan kichik **yoki** 65 va undan katta bo‘lsa **imtiyozli**, aks holda **oddiy** (ternar operator `? :`).',
        ),
        expectedBehavior:
          '20 + Web2026 → true; web2026 (kichik harf) → false; 70 yosh → imtiyozli.',
        difficulty: 'EASY',
        starterFiles: app(BODY08.comparisons, '// #kirish tugmasi'),
        checks: [
          after(
            [fill('#yosh', '20'), fill('#parol', 'Web2026'), click('#kirish')],
            text('ok', 'To‘g‘ri yosh va parol', '#ruxsat', 'true', { equals: true }),
          ),
          after(
            [fill('#yosh', '20'), fill('#parol', 'web2026'), click('#kirish')],
            text('case', 'Parol harflari mos emas', '#ruxsat', 'false', {
              equals: true,
              hint: '`===` katta-kichik harfni farqlaydi.',
            }),
          ),
          after(
            [fill('#yosh', '16'), fill('#parol', 'Web2026'), click('#kirish')],
            text('young', '16 yosh — ruxsat yo‘q', '#ruxsat', 'false', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#yosh', '70'), fill('#parol', 'x'), click('#kirish')],
            text('type', '70 yosh — imtiyozli', '#turi', 'imtiyozli', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'if-else',
      title: 'if va else',
      exercise: {
        title: 'Baho kalkulyatori',
        description: '`if / else if / else` va noto‘g‘ri kiritma.',
        instructions: md(
          '`baho(ball)` funksiyasini yozing va `#baholash` bosilganda natijani `#baho` ga yozing:',
          '',
          '| Ball            | Natija             |',
          '| --------------- | ------------------ |',
          '| 86–100          | `5 (a’lo)`         |',
          '| 71–85           | `4 (yaxshi)`       |',
          '| 56–70           | `3 (qoniqarli)`    |',
          '| 0–55            | `2 (qoniqarsiz)`   |',
          '| boshqa, son emas | `Noto‘g‘ri ball`  |',
          '',
          'Chegaraviy qiymatlarni (85/86, 70/71, 55/56) o‘zingiz sinab ko‘ring.',
        ),
        expectedBehavior: '92 → 5 (a’lo); 71 → 4 (yaxshi); 120 → Noto‘g‘ri ball.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY08.ifElse, '// function baho(ball) { ... }\n\n// #baholash tugmasi'),
        checks: [
          after(
            [fill('#ball', '92'), click('#baholash')],
            text('a', '92 — a’lo', '#baho', '5 (a’lo)', { equals: true }),
          ),
          after(
            [fill('#ball', '71'), click('#baholash')],
            text('edge', '71 — chegarada yaxshi', '#baho', '4 (yaxshi)', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#ball', '55'), click('#baholash')],
            text('low', '55 — qoniqarsiz', '#baho', '2 (qoniqarsiz)', { equals: true }),
          ),
          after(
            [fill('#ball', '120'), click('#baholash')],
            text('invalid', '120 — noto‘g‘ri', '#baho', 'Noto‘g‘ri ball', {
              equals: true,
              hint: 'Avval noto‘g‘ri holatlarni tekshiring: `isNaN`, `< 0`, `> 100`.',
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'switch',
      title: 'switch',
      exercise: {
        title: 'Kalkulyator',
        description: '`switch`, `default` va nolga bo‘lish.',
        instructions: md(
          '`hisobla(a, amal, b)` funksiyasini `switch` bilan yozing:',
          '',
          '- `+`, `-`, `*`, `/` — tegishli amal;',
          '- `/` da `b` nol bo‘lsa — **Nolga bo‘lib bo‘lmaydi**;',
          '- boshqa belgi — **Noma’lum amal**.',
          '',
          '`#hisobla` bosilganda natijani `#natija` ga yozing (amal belgisidan bo‘sh joylarni olib tashlang).',
        ),
        expectedBehavior: '8 * 3 = 24; 10 / 0 → xabar; 5 % 2 → Noma’lum amal.',
        difficulty: 'MEDIUM',
        starterFiles: app(
          BODY08.switch,
          '// function hisobla(a, amal, b) { ... }\n\n// #hisobla tugmasi',
        ),
        checks: [
          after(
            [fill('#a', '8'), fill('#amal', '*'), fill('#b', '3'), click('#hisobla')],
            text('mul', '8 * 3 = 24', '#natija', '24', { equals: true }),
          ),
          after(
            [fill('#a', '9'), fill('#amal', '/'), fill('#b', '3'), click('#hisobla')],
            text('div', '9 / 3 = 3', '#natija', '3', { equals: true }),
          ),
          after(
            [fill('#a', '10'), fill('#amal', '/'), fill('#b', '0'), click('#hisobla')],
            text('zero', 'Nolga bo‘lish', '#natija', 'Nolga bo‘lib bo‘lmaydi', { equals: true }),
          ),
          after(
            [fill('#a', '5'), fill('#amal', ' % '), fill('#b', '2'), click('#hisobla')],
            text('unknown', 'Noma’lum amal', '#natija', 'Noma’lum amal', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
      quiz: quiz('8-modul testi: Mantiq va shartlar', [
        q(
          'falsy',
          'Qaysilari falsy? (bir nechta javob)',
          ['`0`', "`'0'`", "`''`", '`[]`', '`null`'],
          [0, 2, 4],
        ),
        q('eq', "`5 === '5'` natijasi?", ['`false`', '`true`', '`undefined`', 'Xato'], [0]),
        q(
          'order',
          '`if (ball >= 56) ... else if (ball >= 86) ...` — 92 ball qaysi shartga tushadi?',
          [
            'Birinchisiga — shartlar yuqoridan pastga tekshiriladi',
            'Ikkinchisiga — u aniqroq',
            'Ikkalasiga ham',
            'Hech biriga',
          ],
          [0],
        ),
        q(
          'break',
          '`switch` da `break` yozilmasa nima bo‘ladi?',
          [
            'Keyingi `case` lar ham ketma-ket bajariladi',
            'Xato chiqadi',
            'Faqat `default` bajariladi',
            'Hech narsa o‘zgarmaydi',
          ],
          [0],
        ),
        q('nullish', '`0 ?? 10` natijasi?', ['`0`', '`10`', '`null`', '`false`'], [0]),
      ]),
    },
  ],
};
