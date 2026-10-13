import { after, app, clean, click, fill, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY11 = {
  errors: `<h1>Xavfsiz bo‘lish</h1>
<input id="a" placeholder="Bo‘linuvchi">
<input id="b" placeholder="Bo‘luvchi">
<button type="button" id="bol">Bo‘lish</button>
<p>Natija: <span id="natija"></span></p>
<p role="alert" id="xato"></p>
<p id="holat"></p>`,
  scope: `<h1>Savat</h1>
<button type="button" id="qosh">50 000 so‘mlik mahsulot qo‘shish</button>
<p>Jami: <span id="jami"></span> so‘m</p>
<p>To‘lov (100 000 dan oshsa 10% chegirma): <span id="tolov"></span> so‘m</p>`,
  hoisting: `<h1>Tartib</h1>
<p id="salom"></p>
<p>Kurs: <span id="kurs"></span></p>
<p>var e’londan oldin: <span id="var-qiymat"></span></p>
<input id="ism" placeholder="Ism">
<button type="button" id="salomlash">Salomlashish</button>`,
  strict: `<h1>Qat’iy rejim</h1>
<p>Qat’iy rejim yoqilganmi: <span id="rejim"></span></p>
<input id="narx" type="number" placeholder="Narx">
<input id="soni" type="number" placeholder="Soni">
<button type="button" id="hisobla">Hisoblash</button>
<p>Natija: <span id="natija">0</span></p>`,
  this: `<h1>this</h1>
<p>Tanlangan rang: <span id="tanlangan">—</span></p>
<button type="button" class="rang">Qizil</button>
<button type="button" class="rang">Yashil</button>
<button type="button" class="rang">Ko‘k</button>
<h2>Hamyon</h2>
<p>Balans: <span id="balans">0</span></p>
<button type="button" id="qosh">+1000</button>`,
  arrow: `<h1>Narxlar</h1>
<p>Arzonlar (10 000 dan kam): <span id="arzon"></span></p>
<p>QQS bilan: <span id="qqs"></span></p>
<p>Jami: <span id="jami"></span></p>
<input id="yangi" type="number" placeholder="Yangi narx">
<button type="button" id="qosh">Qo‘shish</button>`,
  debugging: `<h1>Statistika</h1>
<input id="sonlar" placeholder="Masalan: 4 8 15 16 23 42">
<button type="button" id="hisobla">Hisoblash</button>
<p>Yig‘indi: <span id="yigindi"></span></p>
<p>O‘rtacha: <span id="ortacha"></span></p>
<p>Eng katta: <span id="eng"></span></p>`,
  style: `<h1>Promokod</h1>
<input id="summa" type="number" placeholder="Summa">
<input id="kod" placeholder="Promokod (ixtiyoriy)">
<button type="button" id="hisobla">Hisoblash</button>
<p>To‘lov: <span id="tolov"></span></p>`,
  mistakes: `<h1>Besh xato</h1>
<section>
  <input id="parol" placeholder="Parol">
  <button type="button" id="kirish">Kirish</button>
  <p id="kirish-natija"></p>
</section>
<section>
  <input id="narx" type="number" placeholder="Narx">
  <input id="qqs" type="number" placeholder="QQS">
  <button type="button" id="jami-btn">Jami</button>
  <p id="jami"></p>
</section>
<section>
  <input id="kun" type="number" placeholder="Hafta kuni (1–7)">
  <button type="button" id="kun-btn">Aniqlash</button>
  <p id="kun-nomi"></p>
</section>`,
};

export const SCOPE_STARTER = `// Bu kodda ko‘rinish doirasi bilan bog‘liq 2 ta xato bor.
let jami = 0;

function qosh(narx) {
  let jami = jami + narx;
  korsat();
}

function korsat() {
  if (jami > 100000) {
    const chegirma = 0.1;
  }
  const tolov = jami * (1 - chegirma);
  document.getElementById('jami').textContent = jami;
  document.getElementById('tolov').textContent = tolov;
}

document.getElementById('qosh').onclick = function () {
  qosh(50000);
};

korsat();`;

export const HOISTING_STARTER = `// Kod tartibi noto‘g‘ri. Tuzating.
document.getElementById('salom').textContent = salomlash('Ali');
document.getElementById('kurs').textContent = kursNomi;
document.getElementById('var-qiymat').textContent = String(eski);

document.getElementById('salomlash').onclick = function () {
  document.getElementById('salom').textContent = salomlash(document.getElementById('ism').value);
};

const salomlash = function (ism) {
  return 'Salom, ' + ism + '!';
};
let kursNomi = 'JavaScript';
var eski = 5;`;

export const STRICT_STARTER = `// Harf xatosi bor, lekin qat’iy rejimsiz brauzer uni ko‘rsatmaydi.
let natija = 0;

document.getElementById('hisobla').onclick = function () {
  const narx = Number(document.getElementById('narx').value);
  const soni = Number(document.getElementById('soni').value);
  natjia = narx * soni;
  document.getElementById('natija').textContent = natija;
};`;

export const THIS_STARTER = `// 1. tanla() — bosilgan tugmaning matnini #tanlangan ga yozsin (this orqali).
function tanla() {
  // ...
}

for (const tugma of document.getElementsByClassName('rang')) {
  tugma.onclick = tanla;
}

// 2. Hamyon tugmasi NaN ko‘rsatadi. Nega? Tuzating.
const hamyon = {
  balans: 0,
  qosh() {
    this.balans += 1000;
    document.getElementById('balans').textContent = this.balans;
  },
};

document.getElementById('qosh').onclick = hamyon.qosh;`;

export const PRICES11 = `const narxlar = [4000, 12000, 1500, 25000];`;

export const DEBUG_STARTER = `// Bu kod xato bermaydi, lekin natijalari noto‘g‘ri. 3 ta mantiq xatosini toping.
document.getElementById('hisobla').onclick = function () {
  const sonlar = document.getElementById('sonlar').value.split(' ');

  let yigindi = '';
  for (let i = 0; i <= sonlar.length; i++) {
    yigindi += sonlar[i];
  }

  let eng = 0;
  for (const s of sonlar) {
    if (Number(s) > eng) eng = Number(s);
  }

  document.getElementById('yigindi').textContent = yigindi;
  document.getElementById('ortacha').textContent = yigindi / sonlar.length;
  document.getElementById('eng').textContent = eng;
};`;

export const STYLE_STARTER = `// Uslub qoidalariga keltiring: const/let, ===, ma’noli nomlar, sehrli sonlarsiz.
// Bitta jiddiy xato ham bor: promokod kiritilmasa ham chegirma beriladi.
document.getElementById('hisobla').onclick=function(){
var s=Number(document.getElementById('summa').value)
var k=document.getElementById('kod').value
if(k==0||k=='WEB10'){s=s*0.9}
document.getElementById('tolov').textContent=s}`;

export const MISTAKES_STARTER = `// Bu kodda 5 ta klassik xato bor.
function kirish(parol) {
  if (parol = 'Web2026') {
    return 'Xush kelibsiz';
  }
  return 'Parol noto‘g‘ri';
}

function jami(narx, qqs) {
  narx + qqs;
}

function kunNomi(n) {
  let natija;
  switch (n) {
    case 6:
      natija = 'shanba';
    case 7:
      natija = 'yakshanba';
      break;
    default:
      natija = 'ish kuni';
  }
  return natija;
}

document.getElementById('kirish').onclick = function () {
  document.getElementById('kirish-natija').textContent = kirish(document.getElementById('parol').value);
};

document.getElementById('jami-btn').onclick = function () {
  const narx = document.getElementById('narx').value;
  const qqs = document.getElementById('qqs').value;
  document.getElementById('jami').textContent = jami(narx, qqs);
};

document.getElementById('kun-btn').onclick = function () {
  document.getElementById('kun-nomi').textContent = kunNomi(document.getElementById('kun').value);
};`;

export const m11: ModuleDef = {
  title: 'Xatolar va sifatli kod',
  lessons: [
    {
      slug: 'errors',
      title: 'Xatolarni boshqarish',
      exercise: {
        title: 'Xavfsiz bo‘lish',
        description: '`throw`, `try...catch...finally`.',
        instructions: md(
          "1. `bol(a, b)` funksiyasini yozing: `a` yoki `b` son bo‘lmasa (`isNaN`) — `throw new TypeError('Son kiriting')`; `b` nol bo‘lsa — `throw new Error('Nolga bo‘lib bo‘lmaydi')`; aks holda `a / b`.",
          '2. `#bol` bosilganda `try...catch` bilan: muvaffaqiyatda `#natija` ga natija, `#xato` bo‘sh; xatoda `#natija` bo‘sh, `#xato` ga `xato.message`.',
          '3. `finally` da `#holat` ga **Tekshirildi** yozing.',
        ),
        expectedBehavior: '10 / 2 → 5; 10 / 0 → xabar; konsolda xato yo‘q.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY11.errors, '// bol(a, b) va #bol tugmasi'),
        checks: [
          after(
            [fill('#a', '10'), fill('#b', '2'), click('#bol')],
            text('ok', '10 / 2 = 5', '#natija', '5', { equals: true }),
          ),
          after(
            [fill('#a', '10'), fill('#b', '0'), click('#bol')],
            text('zero', 'Nolga bo‘lish xabari', '#xato', 'Nolga bo‘lib bo‘lmaydi', {
              equals: true,
            }),
          ),
          after(
            [fill('#a', 'abc'), fill('#b', '2'), click('#bol')],
            text('nan', 'Son emas — xabar', '#xato', 'Son kiriting', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#a', '10'), fill('#b', '0'), click('#bol')],
            text('finally', '`finally` bajariladi', '#holat', 'Tekshirildi', { equals: true }),
          ),
          after([fill('#a', '10'), fill('#b', '0'), click('#bol')], {
            ...clean({
              hint: 'Xato `catch` da ushlanishi kerak — ushlanmagan xato konsolga chiqadi.',
            }),
            id: 'caught',
            title: 'Xato ushlangan, konsolda xato yo‘q',
          }),
        ],
      },
    },
    {
      slug: 'scope',
      title: 'Ko‘rinish doirasi',
      exercise: {
        title: 'Savatdagi doira xatolari',
        description: 'Soyalash va blok doirasi xatolarini tuzatish.',
        instructions: md(
          '`script.js` da ko‘rinish doirasi bilan bog‘liq 2 ta xato bor:',
          '',
          '1. `qosh` ichida global `jami` o‘zgarmayapti.',
          '2. `chegirma` blokdan tashqarida ko‘rinmaydi.',
          '',
          'Xatolarni tuzating: har bosishda jami 50 000 ga oshsin, 100 000 dan **oshsa** to‘lovda 10% chegirma bo‘lsin.',
        ),
        expectedBehavior: '0 → 2 bosish: 100000/100000 → 3 bosish: 150000/135000.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY11.scope, SCOPE_STARTER),
        checks: [
          text('start', 'Boshida to‘lov 0', '#tolov', '0', { equals: true }),
          after(
            [click('#qosh'), click('#qosh')],
            text('two', 'Ikki bosish — chegirmasiz', '#tolov', '100000', { equals: true }),
          ),
          after(
            [click('#qosh'), click('#qosh'), click('#qosh')],
            text('three', 'Uch bosish — 10% chegirma', '#tolov', '135000', { equals: true }),
          ),
          after(
            [click('#qosh'), click('#qosh'), click('#qosh'), click('#qosh')],
            text('four', 'To‘rt bosish — jami', '#jami', '200000', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'hoisting',
      title: 'Hoisting',
      exercise: {
        title: 'To‘g‘ri tartib',
        description: 'Funksiya e’loni, TDZ va `var`.',
        instructions: md(
          '`script.js` e’londan oldin ishlatish tufayli yiqiladi. Tuzating:',
          '',
          '1. `salomlash` ni **funksiya e’loniga** (`function salomlash(ism) { ... }`) aylantiring — u ko‘tariladi.',
          '2. `kursNomi` e’lonini ishlatilishidan **oldinga** ko‘chiring.',
          '3. `var eski` qatoriga tegmang — `#var-qiymat` da nima chiqishini kuzating va tushuntiring.',
        ),
        expectedBehavior: '“Salom, Ali!”, JavaScript, undefined; tugma ham ishlaydi.',
        difficulty: 'EASY',
        starterFiles: app(BODY11.hoisting, HOISTING_STARTER),
        checks: [
          text('hello', 'Salomlashuv chiqadi', '#salom', 'Salom, Ali!', { equals: true }),
          text('course', 'Kurs nomi chiqadi', '#kurs', 'JavaScript', { equals: true }),
          text('var', '`var` e’londan oldin — undefined', '#var-qiymat', 'undefined', {
            equals: true,
          }),
          after(
            [fill('#ism', 'Jasur'), click('#salomlash')],
            text('button', 'Tugma ham ishlaydi', '#salom', 'Salom, Jasur!', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'strict-mode',
      title: 'Qat’iy rejim',
      exercise: {
        title: 'Yashirin harf xatosi',
        description: "`'use strict'` jim xatoni ko‘rinadigan qiladi.",
        instructions: md(
          "1. Fayl boshiga `'use strict';` qo‘shing va tugmani bosib ko‘ring — konsolda xato paydo bo‘ladi.",
          '2. Harf xatosini tuzating: natija to‘g‘ri chiqsin.',
          '3. `#rejim` ga `(function () { return this === undefined; })()` ifodasi natijasini yozing — qat’iy rejim yoqilgan bo‘lsa `true`.',
        ),
        expectedBehavior: 'Qat’iy rejim: true; 12000 × 3 → 36000.',
        difficulty: 'EASY',
        starterFiles: app(BODY11.strict, STRICT_STARTER),
        checks: [
          text('strict', 'Qat’iy rejim yoqilgan', '#rejim', 'true', {
            equals: true,
            hint: "`'use strict';` faylning eng birinchi qatori bo‘lsin.",
          }),
          after(
            [fill('#narx', '12000'), fill('#soni', '3'), click('#hisobla')],
            text('result', '12000 × 3', '#natija', '36000', { equals: true }),
          ),
          after(
            [fill('#narx', '2500'), fill('#soni', '4'), click('#hisobla')],
            text('result2', '2500 × 4', '#natija', '10000', { equals: true, hidden: true }),
          ),
          after([fill('#narx', '1'), fill('#soni', '1'), click('#hisobla')], clean()),
        ],
      },
    },
    {
      slug: 'this',
      title: 'this',
      exercise: {
        title: 'Rang tugmalari va hamyon',
        description: 'Hodisadagi `this` va yo‘qolgan kontekst.',
        instructions: md(
          '1. `tanla()` ichida `this.textContent` ni `#tanlangan` ga yozing.',
          '2. Hamyon tugmasi `NaN` ko‘rsatadi — `this` tugmani ko‘rsatyapti. `bind` yoki o‘rab chaqirish bilan tuzating.',
        ),
        expectedBehavior: '“Yashil” bosilsa — Yashil; +1000 ikki marta → 2000.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY11.this, THIS_STARTER),
        checks: [
          after(
            [click('.rang:nth-of-type(2)')],
            text('green', 'Tanlangan rang', '#tanlangan', 'Yashil', { equals: true }),
          ),
          after(
            [click('.rang:nth-of-type(3)')],
            text('blue', 'Boshqa tugma', '#tanlangan', 'Ko‘k', { equals: true, hidden: true }),
          ),
          after(
            [click('#qosh'), click('#qosh')],
            text('wallet', 'Hamyon 2000', '#balans', '2000', {
              equals: true,
              hint: '`hamyon.qosh.bind(hamyon)` yoki `function () { hamyon.qosh(); }`.',
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'arrow-functions',
      title: 'Arrow funksiyalar',
      exercise: {
        title: 'Narxlar arrow funksiyalar bilan',
        description: '`filter`, `map`, `reduce` va qisqa yozuv.',
        instructions: md(
          '`korsat()` funksiyasida faqat **arrow** callback’lar ishlating:',
          '',
          '1. `#arzon` — 10 000 dan kam narxlar, `, ` bilan.',
          '2. `#qqs` — har biriga 12% qo‘shilgan va yaxlitlangan narxlar, `, ` bilan.',
          '3. `#jami` — narxlar yig‘indisi.',
          '4. `#qosh` bosilganda yangi narxni qo‘shib, `korsat()` ni chaqiring.',
        ),
        expectedBehavior: '4000, 1500 | 4480, 13440, 1680, 28000 | 42500.',
        difficulty: 'EASY',
        starterFiles: app(BODY11.arrow, `${PRICES11}\n\n// korsat() va #qosh`),
        checks: [
          text('cheap', 'Arzon narxlar', '#arzon', '4000, 1500', { equals: true }),
          text('vat', 'QQS bilan', '#qqs', '4480, 13440, 1680, 28000', { equals: true }),
          text('sum', 'Jami', '#jami', '42500', { equals: true }),
          after(
            [fill('#yangi', '5000'), click('#qosh')],
            text('added', 'Yangi narx qo‘shiladi', '#arzon', '4000, 1500, 5000', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'debugging',
      title: 'Xato qidirish',
      exercise: {
        title: 'Uchta mantiq xatosi',
        description: '`console.log` bilan oraliq qiymatlarni kuzatish.',
        instructions: md(
          'Kod xato bermaydi, lekin natijalari noto‘g‘ri. `console.log` bilan oraliq qiymatlarni ko‘ring va 3 ta xatoni tuzating:',
          '',
          '- yig‘indi satrlarni ulamasin;',
          '- sikl massivdan tashqariga chiqmasin;',
          '- eng katta son manfiy sonlar uchun ham to‘g‘ri bo‘lsin.',
        ),
        expectedBehavior: '“4 8 15 16 23 42” → 108, 18, 42; “-5 -2 -9” → eng katta −2.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY11.debugging, DEBUG_STARTER),
        checks: [
          after(
            [fill('#sonlar', '4 8 15 16 23 42'), click('#hisobla')],
            text('sum', 'Yig‘indi 108', '#yigindi', '108', { equals: true }),
          ),
          after(
            [fill('#sonlar', '4 8 15 16 23 42'), click('#hisobla')],
            text('avg', 'O‘rtacha 18', '#ortacha', '18', { equals: true }),
          ),
          after(
            [fill('#sonlar', '4 8 15 16 23 42'), click('#hisobla')],
            text('max', 'Eng katta 42', '#eng', '42', { equals: true }),
          ),
          after(
            [fill('#sonlar', '-5 -2 -9'), click('#hisobla')],
            text('neg', 'Manfiy sonlarda eng katta −2', '#eng', '-2', {
              equals: true,
              hidden: true,
              hint: 'Maksimumni 0 dan emas, birinchi elementdan (yoki `-Infinity` dan) boshlang.',
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'style-guide',
      title: 'Kod uslubi',
      exercise: {
        title: 'Promokod: uslub va xato',
        description: '`===`, `const`, nomlar va sehrli sonlar.',
        instructions: md(
          'Kodni uslub qoidalariga keltiring:',
          '',
          '- `var` o‘rniga `const`/`let`, ma’noli nomlar (`summa`, `kod`), `===`;',
          '- `0.9` o‘rniga `CHEGIRMA = 0.1` konstantasi;',
          '- formatlash (bo‘sh joylar, `;`, chekinish).',
          '',
          'Jiddiy xato ham bor: promokod kiritilmasa yoki `0` yozilsa ham chegirma beriladi. Chegirma **faqat** `WEB10` kodi uchun bo‘lsin.',
        ),
        expectedBehavior: '200000 + WEB10 → 180000; promokodsiz → 200000.',
        difficulty: 'EASY',
        starterFiles: app(BODY11.style, STYLE_STARTER),
        checks: [
          after(
            [fill('#summa', '200000'), fill('#kod', 'WEB10'), click('#hisobla')],
            text('code', 'WEB10 — 10% chegirma', '#tolov', '180000', { equals: true }),
          ),
          after(
            [fill('#summa', '200000'), fill('#kod', ''), click('#hisobla')],
            text('empty', 'Promokodsiz — chegirma yo‘q', '#tolov', '200000', {
              equals: true,
              hint: "`'' == 0` — true. `===` ishlating.",
            }),
          ),
          after(
            [fill('#summa', '200000'), fill('#kod', '0'), click('#hisobla')],
            text('zero', '“0” kodi — chegirma yo‘q', '#tolov', '200000', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'mistakes',
      title: 'Ko‘p uchraydigan xatolar',
      exercise: {
        title: 'Besh klassik xato',
        description: '`=`/`===`, `return`, `+` ulanish, `switch` va tur.',
        instructions: md(
          '`script.js` da 5 ta klassik xato bor. Topib tuzating:',
          '',
          '1. Noto‘g‘ri parol ham qabul qilinadi.',
          '2. `jami` funksiyasi `undefined` qaytaradi.',
          '3. Narx va QQS ulanib ketadi (1000 + 120 → 1000120).',
          '4. 6-kun uchun “yakshanba” chiqadi.',
          '5. Kun raqami umuman topilmaydi (`switch` qat’iy solishtiradi — turga qarang).',
        ),
        expectedBehavior:
          'Noto‘g‘ri parol rad etiladi; 1000 + 120 = 1120; 6 → shanba, 7 → yakshanba.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY11.mistakes, MISTAKES_STARTER),
        checks: [
          after(
            [fill('#parol', 'parol123'), click('#kirish')],
            text('pass', 'Noto‘g‘ri parol rad etiladi', '#kirish-natija', 'Parol noto‘g‘ri', {
              equals: true,
            }),
          ),
          after(
            [fill('#narx', '1000'), fill('#qqs', '120'), click('#jami-btn')],
            text('sum', '1000 + 120 = 1120', '#jami', '1120', { equals: true }),
          ),
          after(
            [fill('#kun', '6'), click('#kun-btn')],
            text('sat', '6 — shanba', '#kun-nomi', 'shanba', { equals: true }),
          ),
          after(
            [fill('#kun', '7'), click('#kun-btn')],
            text('sun', '7 — yakshanba', '#kun-nomi', 'yakshanba', { equals: true, hidden: true }),
          ),
          clean(),
        ],
      },
      quiz: quiz('11-modul testi: Xatolar va sifatli kod', [
        q(
          'finally',
          '`finally` bloki qachon bajariladi?',
          [
            'Har doim — xato bo‘lsa ham, bo‘lmasa ham',
            'Faqat xato bo‘lganda',
            'Faqat xato bo‘lmaganda',
            'Faqat `throw` dan keyin',
          ],
          [0],
        ),
        q(
          'tdz',
          '`console.log(x); let x = 1;` nima beradi?',
          ['`ReferenceError`', '`undefined`', '`1`', '`null`'],
          [0],
        ),
        q(
          'strict',
          'Qat’iy rejimda e’lon qilinmagan o‘zgaruvchiga qiymat berilsa nima bo‘ladi?',
          [
            '`ReferenceError`',
            'Global o‘zgaruvchi yaratiladi',
            'Qiymat e’tiborsiz qoldiriladi',
            '`undefined` qaytadi',
          ],
          [0],
        ),
        q(
          'arrow-return',
          '`const f = (x) => { x * 2; };` — `f(3)` nima qaytaradi?',
          ['`undefined`', '`6`', '`NaN`', 'Xato'],
          [0],
        ),
        q(
          'this-lost',
          '`tugma.onclick = obj.metod;` — metod ichida `this` nima bo‘ladi?',
          ['Tugma', '`obj`', '`window` doim', '`undefined` doim'],
          [0],
        ),
      ]),
    },
  ],
};
