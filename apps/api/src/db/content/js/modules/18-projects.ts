import type { CheckAction } from '@webdizayn/shared';
import { after, app, click, fill, has, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY18 = {
  todo: `<h1>Vazifalar</h1>
<form id="forma">
  <input id="matn" placeholder="Yangi vazifa" aria-label="Yangi vazifa">
  <button type="submit" id="qosh">Qo‘shish</button>
</form>
<div id="filtrlar">
  <button type="button" data-filtr="hammasi" class="faol">Hammasi</button>
  <button type="button" data-filtr="faol">Faol</button>
  <button type="button" data-filtr="bajarilgan">Bajarilgan</button>
</div>
<ul id="royxat"></ul>
<p id="qolgan"></p>`,
  calculator: `<div class="kalkulyator">
  <output id="ekran">0</output>
  <div id="tugmalar">
    <button type="button" data-tugma="7">7</button>
    <button type="button" data-tugma="8">8</button>
    <button type="button" data-tugma="9">9</button>
    <button type="button" data-tugma="/">÷</button>
    <button type="button" data-tugma="4">4</button>
    <button type="button" data-tugma="5">5</button>
    <button type="button" data-tugma="6">6</button>
    <button type="button" data-tugma="*">×</button>
    <button type="button" data-tugma="1">1</button>
    <button type="button" data-tugma="2">2</button>
    <button type="button" data-tugma="3">3</button>
    <button type="button" data-tugma="-">−</button>
    <button type="button" data-tugma="0">0</button>
    <button type="button" data-tugma=".">.</button>
    <button type="button" data-tugma="=">=</button>
    <button type="button" data-tugma="+">+</button>
    <button type="button" data-tugma="C">C</button>
  </div>
</div>`,
  quiz: `<h1>JavaScript testi</h1>
<p id="raqam"></p>
<h2 id="savol"></h2>
<div id="variantlar"></div>
<button type="button" id="keyingi" disabled>Keyingi</button>
<p id="natija" role="status"></p>
<button type="button" id="qaytadan" hidden>Qaytadan</button>`,
  filter: `<h1>Kurslar katalogi</h1>
<input id="qidiruv" placeholder="Kurs nomi bo‘yicha qidirish" aria-label="Qidiruv">
<div id="darajalar">
  <button type="button" data-daraja="hammasi" class="faol">Hammasi</button>
  <button type="button" data-daraja="boshlangich">Boshlang‘ich</button>
  <button type="button" data-daraja="orta">O‘rta</button>
  <button type="button" data-daraja="yuqori">Yuqori</button>
</div>
<button type="button" id="arzon">Avval arzon</button>
<button type="button" id="qimmat">Avval qimmat</button>
<p id="topildi" role="status"></p>
<div id="katalog"></div>`,
};

export const TODO_CSS = `.faol {
  background-color: #0071dc;
  color: white;
}

.bajarilgan span {
  text-decoration: line-through;
  color: #6b7280;
}`;

export const CALC_CSS = `.kalkulyator {
  width: 240px;
}

#ekran {
  display: block;
  padding: 12px;
  font-size: 28px;
  text-align: right;
  background-color: #0e1133;
  color: white;
}

#tugmalar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: 4px;
}

#tugmalar button {
  padding: 14px 0;
  font-size: 18px;
}`;

export const QUIZ_DATA = `const SAVOLLAR = [
  {
    matn: 'Qaysi kalit so‘z qayta tayinlanmaydigan o‘zgaruvchi e’lon qiladi?',
    variantlar: ['let', 'const', 'var'],
    togri: 1,
  },
  {
    matn: 'Foydalanuvchi matnini sahifaga xavfsiz chiqaradigan xususiyat?',
    variantlar: ['textContent', 'innerHTML', 'outerHTML'],
    togri: 0,
  },
  {
    matn: '[1, 2, 3].map((x) => x * 2) natijasi?',
    variantlar: ['[1, 2, 3]', '12', '[2, 4, 6]'],
    togri: 2,
  },
];`;

export const QUIZ_CSS = `.variant {
  display: block;
  margin: 6px 0;
  padding: 8px 12px;
}

.togri {
  background-color: #d1fae5;
}

.xato {
  background-color: #fee2e2;
}`;

export const COURSES_DATA = `const KURSLAR = [
  { nom: 'HTML asoslari', daraja: 'boshlangich', narx: 300000 },
  { nom: 'CSS asoslari', daraja: 'boshlangich', narx: 350000 },
  { nom: 'CSS Grid va Flexbox', daraja: 'orta', narx: 400000 },
  { nom: 'JavaScript asoslari', daraja: 'boshlangich', narx: 450000 },
  { nom: 'JavaScript: DOM', daraja: 'orta', narx: 500000 },
  { nom: 'React', daraja: 'yuqori', narx: 700000 },
  { nom: 'Node.js', daraja: 'yuqori', narx: 650000 },
  { nom: 'TypeScript', daraja: 'orta', narx: 550000 },
];`;

export const FILTER_CSS = `#katalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.karta {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.faol {
  background-color: #0071dc;
  color: white;
}`;

const add = (matn: string): CheckAction[] => [fill('#matn', matn), click('#qosh')];
const keys = (...ks: string[]): CheckAction[] => ks.map((k) => click(`[data-tugma="${k}"]`));
const pick = (i: number) => click(`#variantlar .variant:nth-child(${i + 1})`);
const next = click('#keyingi');

export const m18: ModuleDef = {
  title: 'Amaliy loyihalar',
  lessons: [
    {
      slug: 'project-todo',
      title: 'Loyiha: vazifalar menejeri',
      exercise: {
        title: 'Vazifalar menejeri',
        description: 'Holat → chizish, delegatsiya, filtr va `localStorage`.',
        instructions: md(
          'Darsdagi talablar bo‘yicha ilovani yozing:',
          '',
          '1. Formadan vazifa qo‘shish (`submit`, bo‘sh matn qo‘shilmaydi).',
          '2. Har `<li>` da: `<input type="checkbox">`, matn uchun `<span>`, `.ochir` tugmasi.',
          '3. Filtr tugmalari (`data-filtr`): hammasi / faol / bajarilgan.',
          '4. `#qolgan` — **2 ta vazifa qoldi** (bajarilmaganlar soni).',
          '5. `localStorage` da saqlash (`try...catch` va zaxira bilan).',
          '6. Matn faqat `textContent` bilan.',
        ),
        expectedBehavior:
          'Vazifalar qo‘shiladi, belgilanadi, filtrlanadi, o‘chiriladi va saqlanadi.',
        difficulty: 'HARD',
        starterFiles: app(BODY18.todo, '// Holat, chiz(), saqla() va hodisalar', { css: TODO_CSS }),
        checks: [
          after(
            [...add('Non olish'), ...add('Dars qilish'), ...add('Sport')],
            has('three', 'Uch vazifa qo‘shildi', '#royxat li', { min: 3, max: 3 }),
          ),
          after(
            [
              ...add('Non olish'),
              ...add('Dars qilish'),
              ...add('Sport'),
              click('#royxat li:first-child input[type="checkbox"]'),
            ],
            text('left', 'Qolgan vazifalar', '#qolgan', '2 ta vazifa qoldi', { equals: true }),
          ),
          after(
            [
              ...add('Non olish'),
              ...add('Dars qilish'),
              ...add('Sport'),
              click('#royxat li:first-child input[type="checkbox"]'),
              click('[data-filtr="faol"]'),
            ],
            has('filter', '“Faol” filtri', '#royxat li', { min: 2, max: 2, hidden: true }),
          ),
          after(
            [...add('Non olish'), ...add('Dars qilish'), click('#royxat li:first-child .ochir')],
            text('delete', 'O‘chirish', '#royxat li span', 'Dars qilish', { equals: true }),
          ),
          after(
            [...add('<img src=x onerror=alert(1)>')],
            has('xss', 'HTML matn bo‘lib qoladi', '#royxat img', {
              min: 0,
              max: 0,
              hint: '`innerHTML` emas, `createElement` va `textContent`.',
            }),
          ),
        ],
      },
    },
    {
      slug: 'project-calculator',
      title: 'Loyiha: kalkulyator',
      exercise: {
        title: 'Kalkulyator',
        description: 'Holat mashinasi, delegatsiya, `eval` siz hisoblash.',
        instructions: md(
          'Darsdagi talablar bo‘yicha kalkulyatorni yozing (`eval` ishlatmang — u preview’da taqiqlangan):',
          '',
          '- `#tugmalar` ga bitta ishlovchi, tugma `data-tugma` qiymati bo‘yicha;',
          '- amallar chapdan o‘ngga: `2 + 3 × 4 =` → **20**;',
          '- nolga bo‘lish → **Xato**; `C` → **0**;',
          '- kasrlar chiroyli: `0.1 + 0.2 =` → **0.3**.',
        ),
        expectedBehavior: '12 + 3 = 15; 7 ÷ 0 = Xato; 1.5 × 2 = 3.',
        difficulty: 'HARD',
        starterFiles: app(BODY18.calculator, '// Holat va tugmalar', { css: CALC_CSS }),
        checks: [
          after(
            keys('1', '2', '+', '3', '='),
            text('add', '12 + 3 = 15', '#ekran', '15', { equals: true }),
          ),
          after(
            keys('2', '+', '3', '*', '4', '='),
            text('chain', 'Chapdan o‘ngga: 20', '#ekran', '20', { equals: true, hidden: true }),
          ),
          after(
            keys('7', '/', '0', '='),
            text('zero', 'Nolga bo‘lish', '#ekran', 'Xato', { equals: true }),
          ),
          after(
            keys('1', '.', '5', '*', '2', '='),
            text('decimal', '1.5 × 2 = 3', '#ekran', '3', { equals: true }),
          ),
          after(
            keys('0', '.', '1', '+', '0', '.', '2', '='),
            text('float', '0.1 + 0.2 = 0.3', '#ekran', '0.3', {
              equals: true,
              hint: '`Number(son.toFixed(10))` kasr xatosini yo‘qotadi.',
            }),
          ),
        ],
      },
    },
    {
      slug: 'project-quiz',
      title: 'Loyiha: test ilovasi',
      exercise: {
        title: 'Test ilovasi',
        description: 'Ma’lumotdan chizish, bir martalik javob va natija.',
        instructions: md(
          '`SAVOLLAR` tayyor. Darsdagi talablar bo‘yicha:',
          '',
          '- `#raqam` — **1 / 3**, `#savol` — savol matni;',
          '- variantlar `#variantlar` ichida `.variant` tugmalari (massiv tartibida);',
          '- javobdan keyin barcha variantlar `disabled`, `#keyingi` faol;',
          '- oxirida `#natija` — **Natija: 2 / 3**, `#qaytadan` ko‘rinadi va testni boshidan boshlaydi.',
        ),
        expectedBehavior: 'Uch savol, har biriga bir marta javob, oxirida natija.',
        difficulty: 'HARD',
        starterFiles: app(BODY18.quiz, `${QUIZ_DATA}\n\n// Holat, chizish va hodisalar`, {
          css: QUIZ_CSS,
        }),
        checks: [
          text('start', 'Birinchi savol', '#raqam', '1 / 3', { equals: true }),
          after(
            [pick(1)],
            has('locked', 'Javobdan keyin variantlar faolsiz', '#variantlar .variant:disabled', {
              min: 3,
              max: 3,
            }),
          ),
          after(
            [pick(1), next, pick(0), next, pick(2), next],
            text('all', 'Hammasi to‘g‘ri', '#natija', 'Natija: 3 / 3', { equals: true }),
          ),
          after(
            [pick(0), next, pick(0), next, pick(2), next],
            text('one-wrong', 'Bitta xato', '#natija', 'Natija: 2 / 3', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [pick(1), next, pick(0), next, pick(2), next, click('#qaytadan')],
            text('restart', 'Qaytadan boshlash', '#raqam', '1 / 3', { equals: true }),
          ),
        ],
      },
    },
    {
      slug: 'project-filter',
      title: 'Loyiha: kurslar katalogi',
      exercise: {
        title: 'Kurslar katalogi',
        description: 'Qidiruv, filtr va saralash birgalikda.',
        instructions: md(
          '`KURSLAR` tayyor. Darsdagi talablar bo‘yicha:',
          '',
          '- har kurs — `#katalog` ichida `article.karta` (`<h3>` nom, daraja, narx);',
          '- `#qidiruv` (`input` hodisasi, katta-kichik harfsiz), `data-daraja` tugmalari, `#arzon` / `#qimmat` saralash — hammasi birga ishlaydi;',
          '- `#topildi` — **Topildi: 3 ta kurs** yoki **Hech narsa topilmadi**;',
          '- asl `KURSLAR` massivi o‘zgarmasin.',
        ),
        expectedBehavior: '8 ta kurs; “css” → 2 ta; yuqori + arzon → Node.js birinchi.',
        difficulty: 'HARD',
        starterFiles: app(BODY18.filter, `${COURSES_DATA}\n\n// Holat, chiz() va hodisalar`, {
          css: FILTER_CSS,
        }),
        checks: [
          has('all', 'Barcha 8 ta kurs', '#katalog .karta', { min: 8, max: 8 }),
          after(
            [fill('#qidiruv', 'CSS')],
            has('search', 'Qidiruv: CSS', '#katalog .karta', { min: 2, max: 2 }),
          ),
          after(
            [fill('#qidiruv', 'javascript'), click('[data-daraja="orta"]')],
            text('combined', 'Qidiruv + daraja', '#topildi', 'Topildi: 1 ta kurs', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [click('[data-daraja="yuqori"]'), click('#arzon')],
            text('sort', 'Saralash', '#katalog .karta:first-child h3', 'Node.js', { equals: true }),
          ),
          after(
            [fill('#qidiruv', 'python')],
            text('empty', 'Hech narsa topilmadi', '#topildi', 'Hech narsa topilmadi', {
              equals: true,
            }),
          ),
        ],
      },
      quiz: quiz('18-modul testi: Amaliy loyihalar', [
        q(
          'state',
          '“Holat → chizish” yondashuvining asosiy afzalligi?',
          [
            'Interfeysning barcha qismlari bitta ma’lumotdan quriladi va bir-biriga zid bo‘lmaydi',
            'Kod qisqaroq bo‘ladi, lekin sekinroq',
            'DOM ishlatilmaydi',
            '`localStorage` keraksiz bo‘ladi',
          ],
          [0],
        ),
        q(
          'eval',
          'Kalkulyatorda nega `eval` ishlatilmaydi?',
          [
            'U satrni kod sifatida bajaradi — xavfli, va CSP uni taqiqlashi mumkin',
            'U faqat butun sonlar bilan ishlaydi',
            'U asinxron',
            'U eski brauzerlarda yo‘q',
          ],
          [0],
        ),
        q(
          'filter-copy',
          'Katalogda filtr qo‘llanganda asl `KURSLAR` massivi qanday bo‘lishi kerak?',
          [
            'O‘zgarmasdan qoladi — natija `filter`/`toSorted` bilan yangi massivda',
            'Filtrlangan elementlar `splice` bilan o‘chiriladi',
            'U `sort()` bilan joyida saralanadi',
            'Har filtrda serverdan qayta yuklanadi',
          ],
          [0],
        ),
        q(
          'double',
          'Test ilovasida bitta savolga ikki marta javob berib ball oshirishning oldini nima oladi?',
          [
            'Holatdagi “javob berildi” belgisi va variantlarni `disabled` qilish',
            'Faqat CSS’dagi rang',
            '`alert` ko‘rsatish',
            'Sahifani qayta yuklash',
          ],
          [0],
        ),
        q(
          'debounce',
          'Debounce nima uchun kerak?',
          [
            'Tez-tez sodir bo‘ladigan hodisada (masalan, yozish) og‘ir ishni foydalanuvchi to‘xtagandan keyin bir marta bajarish',
            'Xatolarni ushlash',
            'Elementlarni saralash',
            'Cookie’ni o‘chirish',
          ],
          [0],
        ),
      ]),
    },
  ],
};
