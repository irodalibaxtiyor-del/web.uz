import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY02 = {
  variables: `<h1>Profil</h1>
<p id="kurs"></p>
<label>Ismingiz: <input id="ism"></label>
<button type="button" id="saqlash">Saqlash</button>
<p id="salom"></p>`,
  let: `<h1>Hisoblagich</h1>
<p id="son">0</p>
<button type="button" id="minus">−1</button>
<button type="button" id="plus">+1</button>
<button type="button" id="nol">Nolga qaytarish</button>`,
  const: `<h1>Kino chiptasi</h1>
<p>Chipta narxi: <span id="narx"></span> so‘m</p>
<p>Bayramdagi narx: <span id="yangi"></span> so‘m</p>
<label>Chiptalar soni: <input id="soni" type="number" min="1" value="1"></label>
<button type="button" id="hisobla">Hisoblash</button>
<p>Jami: <span id="jami"></span> so‘m</p>`,
  operators: `<h1>Operatorlar laboratoriyasi</h1>
<label>A: <input id="a"></label>
<label>B: <input id="b"></label>
<button type="button" id="hisobla">Hisoblash</button>
<p>A + B (son) = <span id="yigindi"></span></p>
<p>A + B (matn) = <span id="ulash"></span></p>
<p>A &gt; B = <span id="katta"></span></p>`,
  arithmetic: `<h1>Kalkulyatorlar</h1>
<section>
  <h2>Daqiqadan soatga</h2>
  <input id="daqiqa" type="number">
  <button type="button" id="aylantir">Aylantirish</button>
  <p id="vaqt"></p>
</section>
<section>
  <h2>O‘rtacha baho</h2>
  <input id="x" type="number"> <input id="y" type="number"> <input id="z" type="number">
  <button type="button" id="ortacha">O‘rtacha</button>
  <p id="natija"></p>
</section>`,
  assignment: `<h1>Hamyon</h1>
<p>Balans: <span id="balans"></span> so‘m</p>
<input id="summa" type="number" placeholder="Summa">
<button type="button" id="kirim">Kirim</button>
<button type="button" id="chiqim">Chiqim</button>
<button type="button" id="ikki">×2</button>
<p>Tarix: <span id="tarix"></span></p>`,
  dataTypes: `<h1>Ma’lumot turlari</h1>
<table>
  <tr><td>typeof null</td><td id="t-null"></td></tr>
  <tr><td>typeof (qiymatsiz o‘zgaruvchi)</td><td id="t-und"></td></tr>
</table>
<label>Son kiriting: <input id="son"></label>
<button type="button" id="aniqla">Turini aniqlash</button>
<p>value turi: <span id="kiritma"></span></p>
<p>Number(value) turi: <span id="raqam"></span></p>`,
};

export const m02: ModuleDef = {
  title: 'O‘zgaruvchilar va operatorlar',
  lessons: [
    {
      slug: 'variables',
      title: 'O‘zgaruvchilar',
      exercise: {
        title: 'Profil va salomlashish',
        description: 'O‘zgaruvchi, matnni ulash va input qiymatini o‘qish.',
        instructions: md(
          '1. `kurs` (`JavaScript`) va `modullar` (`18`) o‘zgaruvchilarini yarating.',
          '2. Ularni ulab, `#kurs` ga **JavaScript kursi: 18 modul** yozing.',
          '3. `#saqlash` bosilganda `#ism` maydonidagi qiymatni o‘zgaruvchiga oling va `#salom` ga **Salom, <ism>!** yozing.',
        ),
        expectedBehavior: 'Masalan, “Madina” yozib saqlansa — “Salom, Madina!”.',
        difficulty: 'EASY',
        starterFiles: app(
          BODY02.variables,
          `// 1–2. kurs va modullar o‘zgaruvchilari, #kurs ga yozish

// 3. #saqlash bosilganda #ism qiymatini o‘qib, #salom ga yozing`,
        ),
        checks: [
          text('kurs', 'Kurs haqida yozuv', '#kurs', 'JavaScript kursi: 18 modul', {
            equals: true,
          }),
          after(
            [fill('#ism', 'Madina'), click('#saqlash')],
            text('salom', '“Madina” uchun salom', '#salom', 'Salom, Madina!', {
              equals: true,
              hint: "Qiymatni tugma bosilganda o‘qing: `document.getElementById('ism').value`.",
            }),
          ),
          after(
            [fill('#ism', 'Jasur'), click('#saqlash')],
            text('salom2', 'Boshqa ism bilan ham ishlaydi', '#salom', 'Salom, Jasur!', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'let',
      title: '`let` kalit so‘zi',
      exercise: {
        title: 'Hisoblagich',
        description: 'Bosishlar orasida saqlanadigan `let` holat.',
        instructions: md(
          '1. Funksiyalardan **tashqarida** `let son = 0;` e’lon qiling.',
          '2. `#plus` sonni 1 ga oshirsin, `#minus` 1 ga kamaytirsin, `#nol` 0 ga qaytarsin.',
          '3. Har bosishdan keyin `#son` ga yangi qiymat yozilsin.',
        ),
        expectedBehavior: 'Uch marta +1 → 3; keyin “Nolga qaytarish” → 0; manfiy son ham mumkin.',
        difficulty: 'EASY',
        starterFiles: app(BODY02.let, '// Hisoblagichni shu yerda yozing.'),
        checks: [
          after(
            [click('#plus'), click('#plus'), click('#plus')],
            text('plus', 'Uch marta +1 → 3', '#son', '3', {
              equals: true,
              hint: '`son` funksiya ichida e’lon qilinsa, har bosishda 0 dan boshlanadi.',
            }),
          ),
          after(
            [click('#plus'), click('#minus'), click('#minus')],
            text('minus', '+1, −1, −1 → −1', '#son', '-1', { equals: true }),
          ),
          after(
            [click('#plus'), click('#plus'), click('#nol')],
            text('reset', 'Nolga qaytarish', '#son', '0', { equals: true }),
          ),
          after(
            [click('#plus'), click('#nol'), click('#plus'), click('#plus')],
            text('after-reset', 'Nolga qaytgandan keyin yana sanaydi', '#son', '2', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'const',
      title: '`const` kalit so‘zi',
      exercise: {
        title: 'Kino chiptasi',
        description: 'Konstanta, undan hisoblangan yangi qiymat va tugma.',
        instructions: md(
          '1. `script.js` dagi xatoni tuzating: konstantaga qayta qiymat berib bo‘lmaydi. `NARX` ni o‘zgartirmang — `yangiNarx` konstantasini `NARX + 5000` sifatida yarating va `#yangi` ga yozing.',
          '2. `#hisobla` bosilganda `#soni` dagi qiymatni `NARX` ga ko‘paytirib, `#jami` ga yozing.',
        ),
        expectedBehavior: 'Narx 25000, bayramda 30000; 4 ta chipta — 100000.',
        difficulty: 'EASY',
        starterFiles: app(
          BODY02.const,
          `const NARX = 25000;
document.getElementById('narx').textContent = NARX;

// Bayramda narx 5000 so‘mga oshadi. Bu qator xato beradi — to‘g‘rilang:
NARX = NARX + 5000;
document.getElementById('yangi').textContent = NARX;

// #hisobla tugmasi`,
        ),
        checks: [
          text('narx', 'Asosiy narx o‘zgarmagan', '#narx', '25000', { equals: true }),
          text('yangi', 'Bayramdagi narx', '#yangi', '30000', {
            equals: true,
            hint: 'Yangi konstanta: `const yangiNarx = NARX + 5000;`',
          }),
          after(
            [fill('#soni', '4'), click('#hisobla')],
            text('jami', '4 ta chipta — 100000', '#jami', '100000', { equals: true }),
          ),
          after(
            [fill('#soni', '7'), click('#hisobla')],
            text('jami2', 'Boshqa son bilan ham to‘g‘ri', '#jami', '175000', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'operators',
      title: 'Operatorlar',
      exercise: {
        title: 'Operatorlar laboratoriyasi',
        description: 'Son va matn sifatida qo‘shish, taqqoslash.',
        instructions: md(
          '`#hisobla` bosilganda:',
          '',
          '1. `#yigindi` ga A va B ning **sonli** yig‘indisini yozing (`Number`).',
          '2. `#ulash` ga A va B ni **matn sifatida** ulab yozing.',
          '3. `#katta` ga `A > B` taqqoslash natijasini (sonlar sifatida) yozing.',
        ),
        expectedBehavior: 'A = 7, B = 5 → 12, 75, true.',
        difficulty: 'EASY',
        starterFiles: app(BODY02.operators, '// #hisobla tugmasi uchun kod'),
        checks: [
          after(
            [fill('#a', '7'), fill('#b', '5'), click('#hisobla')],
            text('sum', '7 + 5 = 12', '#yigindi', '12', {
              equals: true,
              hint: '`value` — matn. Qo‘shishdan oldin `Number(...)` bilan songa aylantiring.',
            }),
          ),
          after(
            [fill('#a', '7'), fill('#b', '5'), click('#hisobla')],
            text('concat', 'Matn sifatida “75”', '#ulash', '75', { equals: true }),
          ),
          after(
            [fill('#a', '7'), fill('#b', '5'), click('#hisobla')],
            text('gt', '7 > 5 — true', '#katta', 'true', { equals: true }),
          ),
          after(
            [fill('#a', '3'), fill('#b', '10'), click('#hisobla')],
            text('gt2', '3 > 10 — false (son sifatida)', '#katta', 'false', {
              equals: true,
              hidden: true,
              hint: "Matnlar alifbo bo‘yicha solishtiriladi: `'3' > '10'` — true.",
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'arithmetic',
      title: 'Arifmetika',
      exercise: {
        title: 'Vaqt va o‘rtacha baho',
        description: 'Qoldiq (`%`) va amallar tartibi.',
        instructions: md(
          '1. `#aylantir` bosilganda `#daqiqa` dagi sonni soat va daqiqaga ajrating va `#vaqt` ga **2 soat 5 daqiqa** shaklida yozing (`%` ishlating).',
          '2. `#ortacha` bosilganda `#x`, `#y`, `#z` ning o‘rtacha qiymatini `#natija` ga yozing. Qavslarga e’tibor bering.',
        ),
        expectedBehavior: '125 → “2 soat 5 daqiqa”; 4, 5, 9 → 6.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY02.arithmetic, '// 1. #aylantir\n\n// 2. #ortacha'),
        checks: [
          after(
            [fill('#daqiqa', '125'), click('#aylantir')],
            text('time', '125 daqiqa → 2 soat 5 daqiqa', '#vaqt', '2 soat 5 daqiqa', {
              equals: true,
              hint: 'Qoldiq: `daqiqa % 60`; soat: `(daqiqa - qoldiq) / 60`.',
            }),
          ),
          after(
            [fill('#daqiqa', '59'), click('#aylantir')],
            text('time2', '59 daqiqa → 0 soat 59 daqiqa', '#vaqt', '0 soat 59 daqiqa', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#x', '4'), fill('#y', '5'), fill('#z', '9'), click('#ortacha')],
            text('avg', '4, 5, 9 → 6', '#natija', '6', {
              equals: true,
              hint: 'Bo‘lish qo‘shishdan oldin bajariladi: yig‘indini qavsga oling.',
            }),
          ),
          after(
            [fill('#x', '1'), fill('#y', '2'), fill('#z', '6'), click('#ortacha')],
            text('avg2', '1, 2, 6 → 3', '#natija', '3', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'assignment',
      title: 'Tayinlash operatorlari',
      exercise: {
        title: 'Hamyon',
        description: '`+=`, `-=`, `*=` va matnli tarix.',
        instructions: md(
          "1. `let balans = 100000;` va `let tarix = '';` e’lon qiling, sahifa ochilganda balansni ko‘rsating.",
          '2. `#kirim`: balansga `#summa` ni qo‘shing (`+=`), tarixga `+<summa>; ` qo‘shing.',
          '3. `#chiqim`: balansdan ayiring (`-=`), tarixga `-<summa>; ` qo‘shing.',
          '4. `#ikki`: balansni ikki baravar oshiring (`*=`).',
          '5. Har amaldan keyin `#balans` va `#tarix` ni yangilang.',
        ),
        expectedBehavior:
          '25000 kirim → 125000; keyin 2000 chiqim → 123000, tarix “+25000; -2000;”.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY02.assignment, '// Hamyon kodini shu yerda yozing.'),
        checks: [
          text('start', 'Boshlang‘ich balans 100000', '#balans', '100000', { equals: true }),
          after(
            [fill('#summa', '25000'), click('#kirim')],
            text('in', 'Kirim: 125000', '#balans', '125000', {
              equals: true,
              hint: '`value` matn — `Number(...)` siz `+=` uni ulab yuboradi.',
            }),
          ),
          after(
            [fill('#summa', '30000'), click('#chiqim'), click('#ikki')],
            text('out-x2', 'Chiqim, keyin ×2: 140000', '#balans', '140000', { equals: true }),
          ),
          after(
            [fill('#summa', '5000'), click('#kirim'), fill('#summa', '2000'), click('#chiqim')],
            text('log', 'Tarix yoziladi', '#tarix', '+5000; -2000;', { hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'data-types',
      title: 'Ma’lumot turlari',
      exercise: {
        title: 'Turini aniqlang',
        description: '`typeof`, `null`, `undefined` va input qiymatining turi.',
        instructions: md(
          '1. `#t-null` ga `typeof null` natijasini yozing.',
          '2. Qiymatsiz `let` o‘zgaruvchi e’lon qiling va `#t-und` ga uning `typeof` ini yozing.',
          '3. `#aniqla` bosilganda: `#kiritma` ga `#son` maydoni `value` sining turini, `#raqam` ga `Number(value)` ning turini yozing.',
          '',
          'Natijalarni qo‘lda yozmang — `typeof` hisoblasin.',
        ),
        expectedBehavior: 'object, undefined; bosilgandan keyin string va number.',
        difficulty: 'EASY',
        starterFiles: app(BODY02.dataTypes, '// typeof bilan ishlang'),
        checks: [
          text('null', '`typeof null`', '#t-null', 'object', { equals: true }),
          text('und', 'Qiymatsiz o‘zgaruvchi turi', '#t-und', 'undefined', { equals: true }),
          after(
            [fill('#son', '42'), click('#aniqla')],
            text('string', '`value` — string', '#kiritma', 'string', { equals: true }),
          ),
          after(
            [fill('#son', '42'), click('#aniqla')],
            text('number', '`Number(value)` — number', '#raqam', 'number', { equals: true }),
          ),
          clean(),
        ],
      },
      quiz: quiz('2-modul testi: O‘zgaruvchilar va operatorlar', [
        q('concat', "`'5' + 2` ning natijasi nima?", ['`7`', "`'52'`", '`NaN`', 'Xato'], [1]),
        q(
          'const',
          '`const a = 1; a = 2;` nima bo‘ladi?',
          [
            '`TypeError` — konstantaga qayta qiymat berib bo‘lmaydi',
            '`a` 2 ga teng bo‘ladi',
            '`a` 1 ligicha qoladi, xato yo‘q',
            '`SyntaxError` sahifa yuklanishidan oldin',
          ],
          [0],
        ),
        q('mod', '`17 % 5` ning qiymati?', ['`3`', '`2`', '`3.4`', '`12`'], [1]),
        q(
          'let-block',
          '`let x = 1; { let x = 2; } ` — blokdan keyin `x` nechaga teng?',
          ['`1`', '`2`', '`undefined`', 'Xato chiqadi'],
          [0],
        ),
        q(
          'types',
          "Qaysi ifodalarning `typeof` natijasi `'object'`? (bir nechta javob)",
          ['`null`', '`[1, 2]`', "`'obyekt'`", '`{ a: 1 }`', '`undefined`'],
          [0, 1, 3],
        ),
      ]),
    },
  ],
};
