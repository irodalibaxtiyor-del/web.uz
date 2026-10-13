import {
  after,
  app,
  attr,
  clean,
  click,
  fill,
  has,
  md,
  q,
  quiz,
  style,
  text,
  wait,
  type ModuleDef,
} from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY15 = {
  intro: `<h1>Katalog</h1>
<ul id="katalog">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>React</li>
</ul>
<p>Sahifa nomi: <span id="sahifa-nomi"></span></p>
<p>Birinchi kurs: <span id="birinchi"></span></p>
<p>Kurslar ro‘yxatining tegi: <span id="ota"></span></p>`,
  methods: `<div class="karta">
  <h2 class="ism">Mehmon</h2>
  <p id="izoh-chiqish"></p>
</div>
<input id="ism" placeholder="Ism">
<textarea id="izoh" placeholder="O‘zingiz haqingizda"></textarea>
<button type="button" id="saqlash">Saqlash</button>`,
  elements: `<h1>Kurslar</h1>
<ul>
  <li class="kurs boshlangich">HTML</li>
  <li class="kurs boshlangich">CSS</li>
  <li class="kurs orta">JavaScript</li>
  <li class="kurs orta">React</li>
  <li class="kurs yuqori">Node.js</li>
</ul>
<p>Jami: <span id="jami"></span></p>
<input id="daraja" placeholder="boshlangich, orta yoki yuqori">
<button type="button" id="filtr">Filtrlash</button>
<p>Topildi: <span id="topilgan"></span></p>`,
  html: `<h1>Kurs tanlang</h1>
<button type="button" class="kurs" data-kurs="html" data-narx="300000">HTML</button>
<button type="button" class="kurs" data-kurs="css" data-narx="350000">CSS</button>
<button type="button" class="kurs" data-kurs="js" data-narx="450000">JavaScript</button>
<p><a id="havola" href="#">Kursni tanlang</a></p>
<p>Narx: <span id="narx">—</span> so‘m</p>
<button type="button" id="sotib-ol" disabled>Sotib olish</button>`,
  css: `<div class="tablar">
  <button type="button" class="tab">HTML</button>
  <button type="button" class="tab">CSS</button>
  <button type="button" class="tab">JavaScript</button>
</div>
<h2>Progress</h2>
<input id="qiymat" type="number" min="0" max="100" placeholder="0–100">
<div class="trek"><div id="chiziq"></div></div>
<p id="foiz">0%</p>`,
  forms: `<h1>Ro‘yxatdan o‘tish</h1>
<form id="forma" novalidate>
  <label>Ism <input id="ism" name="ism"></label>
  <label>Email <input id="email" name="email" type="email"></label>
  <label>Parol <input id="parol" name="parol" type="password"></label>
  <label>Parolni takrorlang <input id="parol2" name="parol2" type="password"></label>
  <button type="submit" id="yubor">Ro‘yxatdan o‘tish</button>
</form>
<p role="alert" id="xato"></p>
<p id="xabar"></p>`,
  animations: `<div class="maydon"><div id="quti"></div></div>
<button type="button" id="boshla">Harakatlantirish</button>
<p id="holat"></p>
<button type="button" id="korsat">Panelni ko‘rsatish</button>
<div id="panel" class="panel">Salom! Men silliq paydo bo‘ldim.</div>`,
};

export const CSS15 = `.tab {
  padding: 8px 16px;
  border: 1px solid #0071dc;
  background-color: white;
  color: #0071dc;
}

.tab.faol {
  background-color: #0071dc;
  color: white;
}

.trek {
  width: 200px;
  height: 8px;
  background-color: #e5e7eb;
}

#chiziq {
  width: 0;
  height: 8px;
  background-color: #0071dc;
}`;

export const ANIM_CSS = `.maydon {
  position: relative;
  width: 300px;
  height: 60px;
  background-color: #f5faff;
}

#quti {
  position: absolute;
  top: 10px;
  left: 0;
  width: 40px;
  height: 40px;
  background-color: #0071dc;
}

.panel {
  opacity: 0;
  transition: opacity 0.3s;
}

.panel.korinadi {
  opacity: 1;
}`;

const FORM_OK = [
  fill('#ism', 'Ali'),
  fill('#email', 'ali@webdizayn.uz'),
  fill('#parol', 'parol2026'),
  fill('#parol2', 'parol2026'),
];

export const m15: ModuleDef = {
  title: 'HTML DOM',
  lessons: [
    {
      slug: 'dom-intro',
      title: 'DOM bilan tanishuv',
      exercise: {
        title: 'Katalogni o‘rganish',
        description: '`document`, `querySelector` va DOM daraxti.',
        instructions: md(
          '1. `#sahifa-nomi` ga `document.title` ni yozing.',
          '2. `<li>` lar sonini hisoblab, `<h1>` matnini **Katalog (4 ta kurs)** qiling.',
          '3. `#birinchi` ga birinchi `<li>` matnini, `#ota` ga uning ota elementining `tagName` ini yozing.',
          '',
          'Hech narsani qo‘lda yozmang — hammasini DOM’dan oling.',
        ),
        expectedBehavior: 'Kurslar katalogi; Katalog (4 ta kurs); HTML; UL.',
        difficulty: 'EASY',
        starterFiles: app(BODY15.intro, '// DOM bilan ishlang', { title: 'Kurslar katalogi' }),
        checks: [
          text('title', 'Sahifa nomi', '#sahifa-nomi', 'Kurslar katalogi', { equals: true }),
          text('h1', 'Sarlavhada kurslar soni', 'h1', 'Katalog (4 ta kurs)', { equals: true }),
          text('first', 'Birinchi kurs', '#birinchi', 'HTML', { equals: true }),
          text('parent', 'Ota element tegi', '#ota', 'UL', { equals: true, caseSensitive: true }),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-methods',
      title: 'DOM metodlari',
      exercise: {
        title: 'Xavfsiz profil kartasi',
        description: '`querySelector`, `textContent` va XSS’dan himoya.',
        instructions: md(
          '`#saqlash` bosilganda:',
          '',
          '1. `.karta` ichidagi `.ism` ga (`querySelector` bilan) `#ism` qiymatini yozing.',
          '2. `#izoh-chiqish` ga `#izoh` qiymatini yozing.',
          '',
          'Foydalanuvchi `<img src=x onerror=alert(1)>` yozsa ham u kod sifatida ishlamasin — teglar oddiy matn bo‘lib ko‘rinsin.',
        ),
        expectedBehavior: 'Kartada ism va izoh; HTML teglar matn bo‘lib qoladi.',
        difficulty: 'EASY',
        starterFiles: app(BODY15.methods, '// #saqlash tugmasi'),
        checks: [
          after(
            [fill('#ism', 'Madina'), fill('#izoh', 'Frontend'), click('#saqlash')],
            text('name', 'Kartadagi ism', '.karta .ism', 'Madina', { equals: true }),
          ),
          after(
            [fill('#ism', 'Jasur'), fill('#izoh', 'Backend'), click('#saqlash')],
            text('name2', 'Boshqa ism', '.karta .ism', 'Jasur', { equals: true, hidden: true }),
          ),
          after(
            [fill('#ism', 'X'), fill('#izoh', '<img src=x onerror=alert(1)>'), click('#saqlash')],
            has('no-html', 'Izohdan HTML element yaratilmaydi', '#izoh-chiqish img', {
              min: 0,
              max: 0,
              hint: 'Foydalanuvchi matni uchun `innerHTML` emas, `textContent`.',
            }),
          ),
          after(
            [fill('#ism', 'X'), fill('#izoh', '<img src=x onerror=alert(1)>'), click('#saqlash')],
            text('as-text', 'Teglar matn bo‘lib ko‘rinadi', '#izoh-chiqish', '<img src=x'),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-elements',
      title: 'Elementlarni topish',
      exercise: {
        title: 'Kurslar filtri',
        description: '`getElementsByTagName`, `querySelectorAll`, `classList.contains`.',
        instructions: md(
          "1. `#jami` ga `getElementsByTagName('li')` bilan kurslar sonini yozing.",
          '2. `#filtr` bosilganda `.kurs` elementlaridan `#daraja` dagi klassga ega bo‘lganlarini (`classList.contains`) tanlang va nomlarini `, ` bilan `#topilgan` ga yozing. Hech biri bo‘lmasa — **Topilmadi**.',
        ),
        expectedBehavior: '5; orta → JavaScript, React.',
        difficulty: 'EASY',
        starterFiles: app(BODY15.elements, '// #jami va #filtr'),
        checks: [
          text('total', 'Jami 5', '#jami', '5', { equals: true }),
          after(
            [fill('#daraja', 'orta'), click('#filtr')],
            text('mid', 'O‘rta daraja', '#topilgan', 'JavaScript, React', { equals: true }),
          ),
          after(
            [fill('#daraja', 'boshlangich'), click('#filtr')],
            text('beg', 'Boshlang‘ich daraja', '#topilgan', 'HTML, CSS', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [fill('#daraja', 'ekspert'), click('#filtr')],
            text('none', 'Topilmadi', '#topilgan', 'Topilmadi', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-html',
      title: 'HTML va atributlar',
      exercise: {
        title: 'Kurs tanlash',
        description: '`dataset`, `setAttribute`, `disabled`.',
        instructions: md(
          'Har bir `.kurs` tugmasi bosilganda (bitta funksiya, `this` yoki hodisa orqali):',
          '',
          '1. `#havola` ning `href` atributi — `/kurslar/<data-kurs>`, matni — **<tugma matni> kursiga o‘tish**.',
          '2. `#narx` — tugmaning `data-narx` qiymati.',
          '3. `#sotib-ol` faollashsin (`disabled` olib tashlansin).',
        ),
        expectedBehavior: 'CSS → /kurslar/css, 350000, tugma faol.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY15.html, '// .kurs tugmalari'),
        checks: [
          after(
            [click('[data-kurs="css"]')],
            attr('href', 'Havola manzili', '#havola', 'href', '/kurslar/css'),
          ),
          after(
            [click('[data-kurs="css"]')],
            text('price', 'Narx data-narx dan', '#narx', '350000', { equals: true }),
          ),
          after(
            [click('[data-kurs="css"]')],
            has('enabled', 'Sotib olish tugmasi faol', '#sotib-ol:not([disabled])', {
              hint: "`setAttribute('disabled', 'false')` baribir faolsiz qoldiradi — `disabled = false`.",
            }),
          ),
          after(
            [click('[data-kurs="js"]')],
            text('link-text', 'Havola matni', '#havola', 'JavaScript kursiga o‘tish', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-css',
      title: 'Uslublarni o‘zgartirish',
      exercise: {
        title: 'Tablar va progress',
        description: '`classList` va `style`.',
        instructions: md(
          '1. `.tab` bosilganda faqat **shu** tabda `faol` klassi bo‘lsin (qolganlaridan olib tashlang).',
          '2. `#qiymat` ga yozilganda (`input`) `#chiziq` kengligini shu foizga teng qiling (`style.width`) va `#foiz` ga **50%** ko‘rinishida yozing.',
        ),
        expectedBehavior: 'Bitta faol tab; 50 → chiziq trekning yarmi.',
        difficulty: 'EASY',
        starterFiles: app(BODY15.css, '// Tablar va progress', { css: CSS15 }),
        checks: [
          after(
            [click('.tab:nth-of-type(2)')],
            has('active', 'Bosilgan tab faol', '.tab:nth-of-type(2).faol'),
          ),
          after(
            [click('.tab:nth-of-type(1)'), click('.tab:nth-of-type(3)')],
            has('single', 'Faqat bitta tab faol', '.tab.faol', { min: 1, max: 1, hidden: true }),
          ),
          after(
            [fill('#qiymat', '50')],
            style('width', '50% — 100px', '#chiziq', 'width', '100px', {
              hint: "Birlik bilan: `qiymat + '%'`.",
            }),
          ),
          after(
            [fill('#qiymat', '25')],
            text('label', 'Foiz yozuvi', '#foiz', '25%', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-forms',
      title: 'Formalar va validatsiya',
      exercise: {
        title: 'Ro‘yxatdan o‘tish formasi',
        description: '`submit`, `preventDefault` va o‘z tekshiruvingiz.',
        instructions: md(
          'Formaning `submit` hodisasida `preventDefault()` qiling va tekshiring (birinchi xato `#xato` ga):',
          '',
          '- ism bo‘sh — **Ism kiriting**;',
          '- email `@` va nuqtali domenga ega emas — **Email noto‘g‘ri**;',
          '- parol 8 belgidan qisqa — **Parol kamida 8 belgi**;',
          '- parollar farq qiladi — **Parollar mos emas**.',
          '',
          'Xato bo‘lmasa: `#xato` bo‘sh, `#xabar` → **Xush kelibsiz, Ali!**, forma tozalansin (`reset`).',
        ),
        expectedBehavior: 'To‘g‘ri ma’lumot — salomlashuv; xatoda bitta tushunarli xabar.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY15.forms, '// Forma tekshiruvi'),
        checks: [
          after(
            [...FORM_OK, click('#yubor')],
            text('ok', 'Muvaffaqiyatli ro‘yxatdan o‘tish', '#xabar', 'Xush kelibsiz, Ali!', {
              equals: true,
              hint: '`event.preventDefault()` bo‘lmasa sahifa qayta yuklanadi.',
            }),
          ),
          after(
            [...FORM_OK, fill('#parol2', 'boshqa2026'), click('#yubor')],
            text('mismatch', 'Parollar mos emas', '#xato', 'Parollar mos emas', { equals: true }),
          ),
          after(
            [...FORM_OK, fill('#parol', 'qisqa'), fill('#parol2', 'qisqa'), click('#yubor')],
            text('short', 'Qisqa parol', '#xato', 'Parol kamida 8 belgi', {
              equals: true,
              hidden: true,
            }),
          ),
          after(
            [...FORM_OK, fill('#email', 'ali@'), click('#yubor')],
            text('email', 'Noto‘g‘ri email', '#xato', 'Email noto‘g‘ri', { equals: true }),
          ),
          after([fill('#ism', ' '), click('#yubor')], clean()),
        ],
      },
    },
    {
      slug: 'dom-animations',
      title: 'Animatsiyalar',
      exercise: {
        title: 'Harakat va paydo bo‘lish',
        description: '`requestAnimationFrame` va CSS transition.',
        instructions: md(
          '1. `#boshla` bosilganda `#quti` ni `requestAnimationFrame` bilan 500 ms davomida `left: 0` dan `200px` gacha siljiting (o‘tgan vaqtga qarab hisoblang). Tugagach `#holat` → **Tugadi**.',
          '2. `#korsat` bosilganda `#panel` da `korinadi` klassini almashtiring (`toggle`) — silliq paydo bo‘lishni CSS bajaradi.',
        ),
        expectedBehavior: 'Quti o‘ngga siljiydi va 200px da to‘xtaydi; panel silliq ko‘rinadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY15.animations, '// Animatsiyalar', { css: ANIM_CSS }),
        checks: [
          style('start', 'Boshida joyida', '#quti', 'left', '0px'),
          after(
            [click('#boshla'), wait(1200)],
            style('end', 'Oxirida 200px', '#quti', 'left', '200px', {
              hint: '`Math.min(o‘tganVaqt / 500, 1)` — oxirgi kadrda aniq 1.',
            }),
          ),
          after(
            [click('#boshla'), wait(1200)],
            text('done', 'Tugadi', '#holat', 'Tugadi', { equals: true }),
          ),
          after(
            [click('#korsat'), wait(600)],
            style('fade', 'Panel ko‘rinadi', '#panel', 'opacity', '1'),
          ),
          clean(),
        ],
      },
      quiz: quiz('15-modul testi: HTML DOM', [
        q(
          'xss',
          'Foydalanuvchi kiritgan matnni sahifaga qanday chiqarish kerak?',
          ['`textContent`', '`innerHTML`', '`outerHTML`', '`document.write`'],
          [0],
        ),
        q(
          'qsa',
          '`querySelectorAll` nima qaytaradi?',
          ['Statik `NodeList`', 'Jonli `HTMLCollection`', 'Massiv', 'Birinchi element'],
          [0],
        ),
        q(
          'disabled',
          'Tugmani qayta faollashtirishning to‘g‘ri usuli?',
          [
            '`tugma.disabled = false`',
            "`tugma.setAttribute('disabled', 'false')`",
            "`tugma.disabled = 'false'`",
            '`tugma.style.disabled = false`',
          ],
          [0],
        ),
        q(
          'submit',
          'Forma yuborilganda sahifa qayta yuklanmasligi uchun nima qilinadi?',
          [
            '`submit` hodisasida `event.preventDefault()`',
            'Tugmaga `onclick` yozish',
            'Formaga `novalidate` qo‘shish',
            '`return true`',
          ],
          [0],
        ),
        q(
          'dataset',
          '`<button data-kurs-nomi="css">` — qiymat qanday olinadi?',
          [
            '`tugma.dataset.kursNomi`',
            "`tugma.dataset['kurs-nomi']`",
            '`tugma.data.kursNomi`',
            '`tugma.kursNomi`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
