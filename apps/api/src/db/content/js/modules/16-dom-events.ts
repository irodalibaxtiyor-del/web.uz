import { after, app, clean, click, fill, has, md, q, quiz, text, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY16 = {
  events: `<h1>Kurslar</h1>
<ul id="royxat">
  <li><span>HTML</span> <button type="button" class="ochir">O‘chirish</button></li>
  <li><span>CSS</span> <button type="button" class="ochir">O‘chirish</button></li>
  <li><span>JavaScript</span> <button type="button" class="ochir">O‘chirish</button></li>
</ul>
<p>Oxirgi amal: <span id="oxirgi">—</span></p>
<p><a id="havola" href="/tashqi-sahifa">Tashqi havola</a></p>
<p id="xabar"></p>`,
  listener: `<h1>Vazifalar</h1>
<ul id="vazifalar">
  <li><span>Darsni o‘qish</span> <button type="button" class="bajarildi">✓</button></li>
  <li><span>Mashqni bajarish</span> <button type="button" class="bajarildi">✓</button></li>
</ul>
<input id="yangi" placeholder="Yangi vazifa">
<button type="button" id="qosh">Qo‘shish</button>
<h2>Bir martalik tugma</h2>
<button type="button" id="bir-marta">Sovg‘ani olish</button>
<p>Olingan: <span id="sanoq">0</span></p>
<h2>Ikki ishlovchi</h2>
<button type="button" id="ikki">Bosing</button>
<p id="log"></p>`,
  navigation: `<h1>Ko‘p so‘raladigan savollar</h1>
<div class="blok">
  <button type="button" class="savol" aria-expanded="false">Kurs qancha davom etadi?</button>
  <p class="javob" hidden>Uch oy, haftasiga uch dars.</p>
</div>
<div class="blok">
  <button type="button" class="savol" aria-expanded="false">Sertifikat beriladimi?</button>
  <p class="javob" hidden>Ha, barcha mashqlar topshirilgach.</p>
</div>
<h2>Kartalar (<span id="soni"></span>)</h2>
<div id="kartalar">
  <article class="karta"><h3>HTML</h3><button type="button" class="ochir">×</button></article>
  <article class="karta"><h3>CSS</h3><button type="button" class="ochir">×</button></article>
  <article class="karta"><h3>JavaScript</h3><button type="button" class="ochir">×</button></article>
</div>`,
  nodes: `<h1>Vazifalar ro‘yxati</h1>
<input id="matn" placeholder="Vazifa">
<button type="button" id="qosh">Qo‘shish</button>
<ul id="royxat"></ul>
<p>Jami: <span id="soni">0</span></p>`,
  collections: `<h1>Savat</h1>
<ul id="savat">
  <li class="mahsulot" data-narx="4000">Non</li>
  <li class="mahsulot" data-narx="12000">Sut</li>
  <li class="mahsulot" data-narx="1500">Tuxum</li>
</ul>
<input id="nom" placeholder="Mahsulot">
<input id="narx" type="number" placeholder="Narx">
<button type="button" id="qosh">Qo‘shish</button>
<p>Jonli to‘plam: <span id="jonli"></span></p>
<p>Statik to‘plam: <span id="statik"></span></p>
<p>Jami: <span id="jami"></span> so‘m</p>`,
};

export const LISTENER_HELPER = `// Yangi vazifa qo‘shuvchi tayyor funksiya (u tugmaga ishlovchi ULAMAYDI).
function vazifaQosh(matn) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = matn;
  const tugma = document.createElement('button');
  tugma.type = 'button';
  tugma.className = 'bajarildi';
  tugma.textContent = '✓';
  li.append(span, ' ', tugma);
  document.getElementById('vazifalar').append(li);
}

document.getElementById('qosh').addEventListener('click', () => {
  vazifaQosh(document.getElementById('yangi').value);
});`;

export const LISTENER_CSS = `.tugagan span {
  text-decoration: line-through;
  color: #6b7280;
}`;

export const m16: ModuleDef = {
  title: 'DOM hodisalari va tugunlar',
  lessons: [
    {
      slug: 'dom-events',
      title: 'Hodisa obyekti va tarqalish',
      exercise: {
        title: 'Tanlash va o‘chirish',
        description: '`event.target`, `stopPropagation`, `preventDefault`.',
        instructions: md(
          '1. Har bir `<li>` bosilganda unda `tanlangan` klassi almashsin (`toggle`).',
          '2. `.ochir` tugmasi bosilganda `#oxirgi` ga **O‘chirish: CSS** (o‘sha qatordagi `<span>` matni) yozilsin, lekin `<li>` **tanlanmasin** (`stopPropagation`).',
          '3. `#havola` bosilganda sahifa almashmasin (`preventDefault`), `#xabar` → **Havola bloklandi**.',
        ),
        expectedBehavior:
          'Qator tanlanadi; o‘chirish tugmasi qatorni tanlamaydi; havola bloklanadi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY16.events, '// Hodisalar', {
          css: '.tanlangan { background-color: #eef6ff; }',
        }),
        checks: [
          after(
            [click('#royxat li:nth-child(1) span')],
            has('select', 'Qator tanlanadi', '#royxat li:nth-child(1).tanlangan'),
          ),
          after(
            [click('#royxat li:nth-child(2) .ochir')],
            text('delete', 'O‘chirish amali', '#oxirgi', 'O‘chirish: CSS', { equals: true }),
          ),
          after(
            [click('#royxat li:nth-child(2) .ochir')],
            has('stop', 'Tugma qatorni tanlamaydi', '.tanlangan', {
              min: 0,
              max: 0,
              hidden: true,
              hint: 'Hodisa tugmadan `<li>` ga ko‘tariladi — `event.stopPropagation()`.',
            }),
          ),
          after(
            [click('#havola')],
            text('link', 'Havola bloklandi', '#xabar', 'Havola bloklandi', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-event-listener',
      title: 'addEventListener',
      exercise: {
        title: 'Delegatsiya va bir martalik hodisa',
        description: 'Delegatsiya, `{ once: true }`, bir nechta ishlovchi.',
        instructions: md(
          '1. `#vazifalar` ga **bitta** `click` ishlovchisi ulang (delegatsiya): `.bajarildi` bosilsa, uning `<li>` sida `tugagan` klassi almashsin (`closest`). Yangi qo‘shilgan vazifalar ham ishlasin.',
          '2. `#bir-marta` ga `{ once: true }` bilan ishlovchi ulang: `#sanoq` ni 1 ga oshirsin.',
          '3. `#ikki` ga ikkita alohida ishlovchi ulang: biri `#log` ga `A`, ikkinchisi ` B` qo‘shsin (natija **A B**).',
        ),
        expectedBehavior: 'Har qanday vazifa belgilanadi; sovg‘a faqat bir marta; “A B”.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY16.listener, `${LISTENER_HELPER}\n\n// 1–3`, { css: LISTENER_CSS }),
        checks: [
          after(
            [click('#vazifalar li:nth-child(1) .bajarildi')],
            has('done', 'Vazifa belgilandi', '#vazifalar li:nth-child(1).tugagan'),
          ),
          after(
            [
              fill('#yangi', 'Testni yechish'),
              click('#qosh'),
              click('#vazifalar li:last-child .bajarildi'),
            ],
            has('delegated', 'Yangi vazifa ham ishlaydi', '#vazifalar li:last-child.tugagan', {
              hidden: true,
              hint: 'Ishlovchini har bir tugmaga emas, `#vazifalar` ga ulang va `event.target.closest(...)` ishlating.',
            }),
          ),
          after(
            [click('#bir-marta'), click('#bir-marta'), click('#bir-marta')],
            text('once', 'Faqat bir marta', '#sanoq', '1', { equals: true }),
          ),
          after([click('#ikki')], text('two', 'Ikki ishlovchi', '#log', 'A B', { equals: true })),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-navigation',
      title: 'DOM bo‘ylab harakatlanish',
      exercise: {
        title: 'Akkordeon va kartalar',
        description: '`nextElementSibling`, `closest`, `children`.',
        instructions: md(
          '1. `.savol` bosilganda uning **keyingi** elementi (`.javob`) ning `hidden` holati almashsin; `aria-expanded` ham yangilansin.',
          "2. `.karta .ochir` bosilganda tugmaning kartasi (`closest('.karta')`) o‘chirilsin.",
          '3. `#soni` ga `#kartalar` ning bolalari sonini yozing — sahifa ochilganda va har o‘chirishdan keyin.',
        ),
        expectedBehavior: 'Savol bosilsa javob ochiladi/yopiladi; × karta o‘chiradi.',
        difficulty: 'EASY',
        starterFiles: app(BODY16.navigation, '// Akkordeon va kartalar'),
        checks: [
          after(
            [click('.blok:nth-of-type(2) .savol')],
            has('open', 'Ikkinchi javob ochildi', '.blok:nth-of-type(2) .javob:not([hidden])'),
          ),
          after(
            [click('.blok:nth-of-type(2) .savol'), click('.blok:nth-of-type(2) .savol')],
            has('close', 'Qayta bosilsa yopiladi', '.javob:not([hidden])', {
              min: 0,
              max: 0,
              hidden: true,
            }),
          ),
          after(
            [click('.karta:nth-child(1) .ochir')],
            has('removed', 'Karta o‘chirildi', '.karta', { min: 2, max: 2 }),
          ),
          after(
            [click('.karta:nth-child(1) .ochir')],
            text('count', 'Soni yangilandi', '#soni', '2', { equals: true }),
          ),
          clean(),
        ],
      },
    },
    {
      slug: 'dom-nodes',
      title: 'Elementlarni yaratish va o‘chirish',
      exercise: {
        title: 'Xavfsiz vazifalar ro‘yxati',
        description: '`createElement`, `append`, `remove`.',
        instructions: md(
          '`#qosh` bosilganda `createElement` bilan yangi `<li>` yarating: ichida vazifa matni bilan `<span>` (`textContent`!) va **O‘chirish** tugmasi. Tugma o‘z `<li>` sini o‘chirsin.',
          '',
          'Bo‘sh matn qo‘shilmasin. `#soni` doim ro‘yxatdagi vazifalar sonini ko‘rsatsin. `innerHTML` ishlatmang.',
        ),
        expectedBehavior: 'Vazifalar qo‘shiladi va o‘chiriladi; HTML teglar matn bo‘lib qoladi.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY16.nodes, '// Vazifalar ro‘yxati'),
        checks: [
          after(
            [
              fill('#matn', 'Non olish'),
              click('#qosh'),
              fill('#matn', 'Dars qilish'),
              click('#qosh'),
            ],
            has('two', 'Ikki vazifa', '#royxat li', { min: 2, max: 2 }),
          ),
          after(
            [fill('#matn', 'Non olish'), click('#qosh')],
            text('span', 'Vazifa matni span’da', '#royxat li span', 'Non olish', { equals: true }),
          ),
          after(
            [fill('#matn', '<b>qalin</b>'), click('#qosh')],
            has('xss', 'Teglar element bo‘lib qolmaydi', '#royxat b', {
              min: 0,
              max: 0,
              hint: 'Matnni `textContent` bilan yozing.',
            }),
          ),
          after(
            [
              fill('#matn', 'A'),
              click('#qosh'),
              fill('#matn', 'B'),
              click('#qosh'),
              click('#royxat li:first-child button'),
            ],
            text('delete', 'O‘chirgandan keyin soni', '#soni', '1', { equals: true, hidden: true }),
          ),
          after([fill('#matn', 'A'), click('#qosh'), click('#royxat li button')], clean()),
        ],
      },
    },
    {
      slug: 'dom-collections',
      title: 'DOM to‘plamlari',
      exercise: {
        title: 'Jonli va statik savat',
        description: '`HTMLCollection`, `NodeList` va `Array.from`.',
        instructions: md(
          "Skript boshida ikki to‘plam oling: `jonli = getElementsByClassName('mahsulot')` va `statik = querySelectorAll('.mahsulot')`.",
          '',
          '1. `korsat()` — `#jonli` va `#statik` ga ularning `length` ini, `#jami` ga **jonli** to‘plamdan (`Array.from` + `reduce`) `data-narx` lar yig‘indisini yozsin.',
          '2. `#qosh` — yangi `<li class="mahsulot" data-narx="...">` yaratib `#savat` ga qo‘shsin va `korsat()` ni chaqirsin. To‘plamlarni **qayta so‘ramang**.',
        ),
        expectedBehavior: 'Boshida 3/3, 17500. Qo‘shilgach: jonli 4, statik 3.',
        difficulty: 'MEDIUM',
        starterFiles: app(BODY16.collections, '// To‘plamlar'),
        checks: [
          text('sum', 'Boshlang‘ich jami', '#jami', '17500', { equals: true }),
          after(
            [fill('#nom', 'Choy'), fill('#narx', '9000'), click('#qosh')],
            text('live', 'Jonli to‘plam yangilandi', '#jonli', '4', { equals: true }),
          ),
          after(
            [fill('#nom', 'Choy'), fill('#narx', '9000'), click('#qosh')],
            text('static', 'Statik to‘plam o‘zgarmadi', '#statik', '3', { equals: true }),
          ),
          after(
            [fill('#nom', 'Choy'), fill('#narx', '9000'), click('#qosh')],
            text('sum2', 'Jami yangi mahsulot bilan', '#jami', '26500', {
              equals: true,
              hidden: true,
            }),
          ),
          clean(),
        ],
      },
      quiz: quiz('16-modul testi: DOM hodisalari va tugunlar', [
        q(
          'bubble',
          'Tugma `<li>` ichida. Tugma bosilganda `<li>` dagi `click` ishlovchisi ishlaydimi?',
          [
            'Ha — hodisa otaga ko‘tariladi (bubbling)',
            'Yo‘q, hech qachon',
            'Faqat `capture: true` bo‘lsa',
            'Faqat ikki marta bosilsa',
          ],
          [0],
        ),
        q(
          'target',
          'Delegatsiyada aynan bosilgan elementni qaysi xususiyat beradi?',
          ['`event.target`', '`event.currentTarget`', '`this`', '`event.parent`'],
          [0],
        ),
        q(
          'remove',
          "`addEventListener('click', () => {})` bilan ulangan ishlovchini olib tashlash mumkinmi?",
          [
            'Yo‘q — xuddi o‘sha funksiyaga havola kerak',
            "Ha, `removeEventListener('click', () => {})` bilan",
            'Ha, `el.onclick = null` bilan',
            'Ha, `event.stop()` bilan',
          ],
          [0],
        ),
        q(
          'closest',
          "`tugma.closest('.karta')` nima qaytaradi?",
          [
            '`.karta` selektoriga mos eng yaqin ota (yoki o‘zi)',
            'Ichidagi birinchi `.karta`',
            'Keyingi aka-uka element',
            'Barcha `.karta` lar',
          ],
          [0],
        ),
        q(
          'live',
          'Qaysi to‘plam **jonli**? (bir nechta javob)',
          [
            '`getElementsByClassName(...)`',
            '`querySelectorAll(...)`',
            '`el.children`',
            '`[...el.children]`',
          ],
          [0, 2],
        ),
      ]),
    },
  ],
};
