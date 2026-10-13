import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  app,
  clean,
  click,
  has,
  md,
  page,
  q,
  quiz,
  style,
  text,
  type ModuleDef,
} from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY01 = {
  intro: `<h1>Birinchi skript</h1>
<p id="xabar">Tugmani bosing</p>
<button type="button" id="salom">Salomlashish</button>

<div id="chiroq">O‘chiq</div>
<button type="button" id="yoq">Chiroqni yoqish</button>`,
  output: `<h1>Natijani chiqarish</h1>
<p>125 + 375 = <span id="yigindi"></span></p>
<p id="muhim"></p>
<p id="izoh"></p>
<button type="button" id="hisob">Hisoblash</button>
<p id="jami"></p>`,
  statements: `<h1>Buyurtma</h1>
<p>Narx: <span id="narx"></span> so‘m</p>
<p>Soni: <span id="soni"></span></p>
<p>Jami: <span id="jami"></span> so‘m</p>
<p id="holat">Yangi buyurtma</p>
<button type="button" id="bekor">Bekor qilish</button>`,
  syntax: `<h1>Talaba</h1>
<p>To‘liq ism: <span id="toliq"></span></p>
<p>Yoshi: <span id="yosh"></span></p>`,
  comments: `<h1>Izohlar</h1>
<p>Rang: <span id="rang"></span></p>
<p id="holat">Yuklanmoqda...</p>`,
};

export const INTRO_CSS = `#chiroq {
  width: 120px;
  margin: 16px 0;
  padding: 16px;
  text-align: center;
  background-color: #dddddd;
}`;

/** Where-to exercise: the starter has its code in <head>, the student moves it. */
export function whereTo(opts: { head: string; script: string }): ProjectFile[] {
  return [
    {
      path: 'index.html',
      content: page(
        `<h1>Skript qayerda?</h1>
<p id="holat">Kutilmoqda...</p>
<p id="defer">defer kutilmoqda...</p>

<script src="script.js"></script>`,
        { title: 'Skript qayerda?', head: opts.head },
      ),
    },
    { path: 'script.js', content: `${opts.script.trim()}\n` },
    {
      path: 'ilova.js',
      content: "document.getElementById('defer').textContent = 'defer ishladi';\n",
    },
  ];
}

export const WHERE_TO_INLINE = `<script>
  document.getElementById('holat').textContent = 'Skript ishladi';
</script>`;

export const SYNTAX_STARTER = `// Bu kodda 4 ta xato bor. Konsolni ochib, ularni birma-bir tuzating.
let ism = 'Ali;
let familiya = "Valiyev';
let tugilganYil = 2006;

document.getElementById('toliq').textContent = Ism + ' ' + familiya;
document.getElementById('yosh').textContent = 2026 - tugilganyil;`;

export const COMMENTS_STARTER = `document.getElementById('rang').textContent = 'qizil';
document.getElementById('rang').textContent = 'yashil';
document.getElementById('rang').textContent = 'ko‘k';
eskiFunksiya();
document.getElementById('holat').textContent = 'Tayyor';`;

export const m01: ModuleDef = {
  title: 'JavaScript bilan tanishuv',
  lessons: [
    {
      slug: 'intro',
      title: 'JavaScript nima?',
      exercise: {
        title: 'Salomlashish va chiroq',
        description: 'Tugma bosilganda matn va uslubni o‘zgartirish.',
        instructions: md(
          '1. `#salom` tugmasi bosilganda `#xabar` matni **Salom, JavaScript!** bo‘lsin.',
          '2. `#yoq` tugmasi bosilganda `#chiroq` matni **Yoniq** bo‘lsin va fon rangi `gold` ga o‘zgarsin (`style.backgroundColor`).',
          '3. Sahifa ochilganda hech narsa o‘zgarmasin — faqat tugma bosilganda.',
        ),
        expectedBehavior:
          'Birinchi tugma salomlashadi, ikkinchisi kulrang “chiroq”ni oltin rangga bo‘yaydi.',
        difficulty: 'EASY',
        starterFiles: app(
          BODY01.intro,
          `// 1. #salom tugmasi bosilganda #xabar matni "Salom, JavaScript!" bo‘lsin.

// 2. #yoq tugmasi bosilganda #chiroq matni "Yoniq" bo‘lsin
//    va uning fon rangi (style.backgroundColor) "gold" ga o‘zgarsin.`,
          { css: INTRO_CSS },
        ),
        checks: [
          after(
            [click('#salom')],
            text('salom', 'Bosilganda salom chiqadi', '#xabar', 'Salom, JavaScript!', {
              equals: true,
              hint: '`onclick` ichida `#xabar` ning `textContent` ini o‘zgartiring.',
            }),
          ),
          after(
            [click('#yoq')],
            text('yoniq', 'Chiroq “Yoniq” bo‘ladi', '#chiroq', 'Yoniq', { equals: true }),
          ),
          after(
            [click('#yoq')],
            style('gold', 'Chiroq oltin rangda', '#chiroq', 'background-color', 'gold', {
              hint: 'CSS’dagi `background-color` JavaScript’da `style.backgroundColor` bo‘ladi.',
            }),
          ),
          text('wait', 'Bosilmaguncha matn o‘zgarmaydi', '#xabar', 'Tugmani bosing', {
            equals: true,
            hidden: true,
          }),
          clean(),
        ],
      },
    },
    {
      slug: 'where-to',
      title: 'JavaScript qayerga yoziladi',
      exercise: {
        title: 'Skriptni to‘g‘ri joyga ko‘chiring',
        description: '`<head>` dagi xato, tashqi fayl va `defer`.',
        instructions: md(
          '1. `index.html` dagi `<head>` ichidagi `<script>` blok xato beradi (konsolni qarang). Uning ichidagi kodni `script.js` ga ko‘chiring va blokni o‘chiring.',
          '2. Tayyor `ilova.js` faylini `<head>` da `defer` atributi bilan ulang.',
        ),
        expectedBehavior:
          'Sahifada “Skript ishladi” va “defer ishladi” yozuvlari, konsolda xato yo‘q.',
        difficulty: 'EASY',
        starterFiles: whereTo({
          head: WHERE_TO_INLINE,
          script: '// <head> dagi kodni shu faylga ko‘chiring.',
        }),
        checks: [
          text('holat', '“Skript ishladi” chiqadi', '#holat', 'Skript ishladi', { equals: true }),
          has('inline', 'Sahifa ichidagi `<script>` blok qolmagan', 'script:not([src])', {
            min: 0,
            max: 0,
          }),
          has(
            'defer',
            '`ilova.js` `<head>` da `defer` bilan ulangan',
            'head script[src="ilova.js"][defer]',
            {
              hint: '`<script src="ilova.js" defer></script>`',
            },
          ),
          text('defer-run', '“defer ishladi” chiqadi', '#defer', 'defer ishladi', { equals: true }),
          clean(),
        ],
      },
    },
    {
      slug: 'output',
      title: 'Natijani chiqarish',
      exercise: {
        title: 'To‘rt xil chiqish',
        description: '`textContent`, `innerHTML` va hisoblangan ifoda.',
        instructions: md(
          '1. `#yigindi` ga `125 + 375` ifodasining natijasini yozing — sonni o‘zingiz hisoblamang, JavaScript hisoblasin.',
          '2. `#muhim` ga `innerHTML` orqali `<strong>Muhim!</strong> Darsni oxirigacha o‘qing.` yozing.',
          '3. `#izoh` ga `textContent` orqali `<b>Bu teg emas</b>` matnini yozing — u qalin bo‘lmasdan, teglari bilan ko‘rinsin.',
          '4. `#hisob` tugmasi bosilganda `#jami` ga `Jami: ` va `15000 * 3` natijasini yozing.',
          '5. Qo‘shimcha: `console.log` bilan konsolga **Tayyor** yozing va RUN konsolida ko‘ring.',
        ),
        expectedBehavior:
          '500, qalin “Muhim!”, teglari ko‘rinib turgan izoh va tugmadan keyin “Jami: 45000”.',
        difficulty: 'EASY',
        starterFiles: app(BODY01.output, '// Kodingizni shu yerga yozing.'),
        checks: [
          text('sum', '`#yigindi` da 500', '#yigindi', '500', { equals: true }),
          text('strong', '`#muhim` ichida qalin “Muhim!”', '#muhim strong', 'Muhim!', {
            equals: true,
            hint: 'HTML sifatida o‘qilishi uchun `innerHTML` kerak.',
          }),
          text('plain', '`#izoh` da teglar matn bo‘lib ko‘rinadi', '#izoh', '<b>Bu teg emas</b>', {
            equals: true,
            hint: '`textContent` teglarni HTML deb o‘qimaydi.',
          }),
          after(
            [click('#hisob')],
            text('total', 'Tugmadan keyin “Jami: 45000”', '#jami', 'Jami: 45000', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'statements',
      title: 'Buyruqlar',
      exercise: {
        title: 'Buyurtma hisobi',
        description: 'Ketma-ket buyruqlar va kod bloki.',
        instructions: md(
          '1. `narx` (12000) va `soni` (3) o‘zgaruvchilarini yarating.',
          '2. `jami` ni `narx * soni` sifatida hisoblang.',
          '3. Uchala qiymatni `#narx`, `#soni` va `#jami` ga yozing.',
          '4. `#bekor` bosilganda bitta blokda ikki buyruq bajarilsin: `#holat` → **Bekor qilindi**, `#soni` → **0**.',
        ),
        expectedBehavior: 'Sahifada 12000, 3 va 36000; tugmadan keyin holat va soni yangilanadi.',
        difficulty: 'EASY',
        starterFiles: app(
          BODY01.statements,
          `// 1. narx va soni o‘zgaruvchilari
// 2. jami
// 3. Qiymatlarni sahifaga yozing
// 4. #bekor tugmasi`,
        ),
        checks: [
          text('narx', '`#narx` da 12000', '#narx', '12000', { equals: true }),
          text('jami', '`#jami` da 36000', '#jami', '36000', { equals: true }),
          after(
            [click('#bekor')],
            text('holat', 'Bekor qilinganda holat yangilanadi', '#holat', 'Bekor qilindi', {
              equals: true,
            }),
          ),
          after(
            [click('#bekor')],
            text('soni', 'Bekor qilinganda soni 0', '#soni', '0', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'syntax',
      title: 'Sintaksis',
      exercise: {
        title: 'Sintaksis xatolarini tuzating',
        description: 'Qo‘shtirnoqlar va katta-kichik harf.',
        instructions: md(
          '`script.js` da 4 ta xato bor. Ishga tushiring, konsoldagi xabarni o‘qing va xatolarni birma-bir tuzating:',
          '',
          '- qo‘shtirnoqlar to‘g‘ri yopilsin;',
          '- o‘zgaruvchi nomlari e’lon qilinganidek yozilsin (katta-kichik harf farqi bor).',
          '',
          'Natijada `#toliq` da **Ali Valiyev**, `#yosh` da **20** chiqsin. Hisoblashlarni o‘zgartirmang.',
        ),
        expectedBehavior: 'To‘liq ism va yosh chiqadi, konsolda xato yo‘q.',
        difficulty: 'EASY',
        starterFiles: app(BODY01.syntax, SYNTAX_STARTER),
        checks: [
          text('toliq', 'To‘liq ism chiqadi', '#toliq', 'Ali Valiyev', { equals: true }),
          text('yosh', 'Yosh hisoblanadi', '#yosh', '20', { equals: true }),
          clean(),
        ],
      },
    },
    {
      slug: 'comments',
      title: 'Izohlar',
      exercise: {
        title: 'Izoh bilan nosozlikni o‘chirish',
        description: 'Qatorlarni o‘chirmasdan izohga aylantirish.',
        instructions: md(
          '1. Uchinchi qatorni (`ko‘k`) izohga aylantiring — rang **yashil** bo‘lib qolsin.',
          '2. `eskiFunksiya();` qatori xato beradi va skriptni to‘xtatadi. Uni ham izohga aylantiring.',
          '3. Fayl boshiga kod nima qilishini tushuntiruvchi ko‘p qatorli izoh yozing.',
          '',
          'Hech bir qatorni o‘chirmang — faqat izohga aylantiring.',
        ),
        expectedBehavior: 'Rang “yashil”, holat “Tayyor”, konsolda xato yo‘q.',
        difficulty: 'EASY',
        starterFiles: app(BODY01.comments, COMMENTS_STARTER),
        checks: [
          text('rang', 'Rang “yashil”', '#rang', 'yashil', { equals: true }),
          text('holat', 'Oxirgi qator ham bajarildi', '#holat', 'Tayyor', {
            equals: true,
            hint: 'Xato skriptni to‘xtatadi — undan keyingi qatorlar bajarilmaydi.',
          }),
          clean(),
        ],
      },
      quiz: quiz('1-modul testi: JavaScript bilan tanishuv', [
        q(
          'safe',
          'Foydalanuvchi kiritgan matnni sahifaga xavfsiz chiqarish uchun nima ishlatiladi?',
          ['`innerHTML`', '`textContent`', '`document.write()`', '`alert()`'],
          [1],
        ),
        q(
          'head',
          '`<head>` dagi oddiy `<script>` `getElementById` bilan `<body>` dagi elementni topa olmaydi. Nega?',
          [
            'Element hali yaratilmagan — brauzer HTML’ni yuqoridan pastga o‘qiydi',
            '`<head>` da JavaScript ishlamaydi',
            '`getElementById` faqat tashqi faylda ishlaydi',
            'Element `class` bilan topilishi kerak',
          ],
          [0],
        ),
        q(
          'src',
          'Tashqi `app.js` faylini qanday ulaymiz?',
          [
            '`<script src="app.js"></script>`',
            '`<script href="app.js"></script>`',
            '`<link rel="script" href="app.js">`',
            '`<js src="app.js">`',
          ],
          [0],
        ),
        q(
          'names',
          'Qaysilari to‘g‘ri o‘zgaruvchi nomi? (bir nechta javob)',
          ['`tugilganYil`', '`_ichki`', '`2narx`', '`kurs-narxi`', '`$tugma`'],
          [0, 1, 4],
        ),
        q(
          'error',
          'Skriptning 3-qatorida `ReferenceError` chiqdi. 4-qator nima bo‘ladi?',
          [
            'Bajarilmaydi — skript xato joyida to‘xtaydi',
            'Bajariladi, xato e’tiborsiz qoldiriladi',
            'Ikki marta bajariladi',
            'Sahifa qayta yuklanadi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
