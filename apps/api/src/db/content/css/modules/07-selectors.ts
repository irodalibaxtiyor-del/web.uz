import { md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

const KEEP_HTML = '`index.html` ni o‘zgartirmang — faqat selektorlar bilan ishlang.';

/** Markup shared by the starter files and the reference solutions. */
export const BODY07 = {
  combinators: `<ul class="menyu">
  <li>Kurslar
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Narxlar</li>
</ul>
<h2>Kurs haqida</h2>
<p>Sarlavhadan keyingi birinchi paragraf — kirish.</p>
<p>Oddiy paragraf.</p>
<ul class="royxat">
  <li>Birinchi</li>
  <li>Ikkinchi</li>
  <li>Uchinchi</li>
</ul>`,
  pseudoClasses: `<nav class="menyu">
  <a class="faol" href="#">Bosh sahifa</a>
  <a href="#">Kurslar</a>
  <a href="#">Aloqa</a>
</nav>
<ul class="royxat">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
<form>
  <label class="tanlov"><input type="checkbox" checked> Yangiliklarga obuna</label>
  <label class="tanlov"><input type="checkbox"> SMS xabarlar</label>
  <input type="text" value="aziza" disabled>
</form>`,
  pseudoElements: `<h2 class="sarlavha">Yangi kurslar</h2>
<p class="muhim">Ro‘yxatdan o‘tish ertaga tugaydi.</p>
<div class="maqola">
  <p>Bir paytlar kitoblar katta, bezakli bosh harf bilan boshlanardi.</p>
  <p>Ikkinchi paragraf oddiy.</p>
</div>
<input placeholder="Email manzilingiz">`,
  attributes: `<form>
  <input type="text" placeholder="Ism">
  <input type="email" placeholder="Email">
</form>
<p>
  <a href="dastur.pdf">O‘quv dasturi</a> ·
  <a href="https://misol.uz" target="_blank">Hamkor sayt</a>
</p>
<button aria-expanded="true">Menyu</button>
<button aria-expanded="false">Filtr</button>
<div data-holat="xato">Parol juda qisqa.</div>`,
  specificity: `<main id="asosiy">
  <p class="matn">Bu matn to‘q ko‘k bo‘lishi kerak.</p>
  <p>Oddiy paragraf kulrang qolsin.</p>
  <button class="tugma">Saqlash</button>
  <span class="belgi" style="color: red">Yangi</span>
</main>`,
  important: `<p id="xabar" class="yashirin">Bu xabar ko‘rinmasligi kerak.</p>
<nav id="menyu">
  <a href="#">Bosh sahifa</a>
  <a class="havola" href="#">Kurslar</a>
</nav>`,
};

export const SPECIFICITY_CSS = `#asosiy p {
  color: gray;
}

.matn {
  color: #0e1133;
}

#asosiy button {
  background-color: gray;
}

.tugma {
  background-color: #0071dc;
  color: white;
}

.belgi {
  color: #0071dc;
}`;

export const IMPORTANT_CSS = `#xabar {
  display: block;
}

#menyu a {
  color: gray;
}

.havola {
  color: #0071dc;
}`;

export const m07: ModuleDef = {
  title: 'Selektorlar va kaskad',
  lessons: [
    {
      slug: 'combinators',
      title: 'Kombinatorlar',
      exercise: {
        title: 'Munosabat bo‘yicha tanlash',
        description: 'Bola (`>`), qo‘shni (`+`) kombinatorlari.',
        instructions: md(
          KEEP_HTML,
          '',
          '1. Faqat `.menyu` ning **bevosita** bandlariga `border-bottom: 1px solid #dddddd` (ichki ro‘yxat bandlariga emas).',
          '2. `h2` dan **darhol keyin** kelgan paragrafning shrifti `1.125rem`.',
          '3. `.royxat` da birinchisidan tashqari har bir band tepasida `8px` margin (`li + li`).',
        ),
        expectedBehavior:
          'Menyuning faqat yuqori bandlari chiziqli, kirish paragrafi kattaroq, ro‘yxat bandlari orasida masofa.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY07.combinators, TODO),
        checks: [
          style('child', 'Menyu bandida chiziq', '.menyu > li', 'border-bottom-width', '1px'),
          style(
            'nested',
            'Ichki bandlarda chiziq yo‘q',
            '.menyu li li',
            'border-bottom-width',
            '0px',
            {
              hint: 'Bo‘sh joy (`.menyu li`) ichki bandlarni ham tanlaydi. `>` ishlating.',
            },
          ),
          style('adjacent', 'Kirish paragrafi 1.125rem', 'h2 + p', 'font-size', '18px'),
          style('second-p', 'Keyingi paragraf oddiy', 'h2 + p + p', 'font-size', '16px', {
            hidden: true,
          }),
          style(
            'li-li',
            'Ikkinchi band tepasida 8px',
            '.royxat li:nth-child(2)',
            'margin-top',
            '8px',
          ),
        ],
      },
    },
    {
      slug: 'pseudo-classes',
      title: 'Psevdoklasslar',
      exercise: {
        title: 'Holat va tuzilma bo‘yicha',
        description: '`:last-child`, `:disabled`, `:has()` va `:not()`.',
        instructions: md(
          KEEP_HTML,
          '',
          '1. `.royxat li` larning hammasida pastki chegara bor. Oxirgisida bo‘lmasin (`:last-child`, `border-bottom: none`).',
          '2. O‘chirilgan maydon (`input:disabled`) foni `#eeeeee`.',
          '3. Ichida belgilangan checkbox bor `label` ning foni `#e6f1fc` (`:has()`).',
          '4. `.menyu` dagi `.faol` bo‘lmagan havolalar `opacity: 0.7` (`:not()`).',
        ),
        expectedBehavior:
          'Ro‘yxat oxirida chiziq yo‘q, o‘chiq maydon kulrang, belgilangan tanlov ko‘k, nofaol havolalar xiraroq.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY07.pseudoClasses,
          `.royxat li {
  padding: 8px 0;
  border-bottom: 1px solid #dddddd;
}

.tanlov {
  display: block;
  padding: 8px;
}`,
        ),
        checks: [
          style(
            'last',
            'Oxirgi bandda chiziq yo‘q',
            '.royxat li:last-child',
            'border-bottom-style',
            'none',
          ),
          style(
            'disabled',
            'O‘chiq maydon kulrang',
            'input:disabled',
            'background-color',
            '#eeeeee',
          ),
          style(
            'has',
            'Belgilangan tanlov ajralib turadi',
            '.tanlov:first-of-type',
            'background-color',
            '#e6f1fc',
            { hint: '`label:has(input:checked)`' },
          ),
          style('not', 'Nofaol havola xira', '.menyu a:nth-child(2)', 'opacity', '0.7'),
          style('active', 'Faol havola to‘liq ko‘rinadi', '.menyu .faol', 'opacity', '1', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'pseudo-elements',
      title: 'Psevdoelementlar',
      exercise: {
        title: 'HTML’siz bezaklar',
        description: '`::before`, `::after`, `::first-letter` va `::placeholder`.',
        instructions: md(
          KEEP_HTML,
          '',
          '1. `.sarlavha::after`: `content: ""`, `display: block`, `width: 48px`, `height: 4px`, fon `#fec400`.',
          '2. `.muhim::before`: `content: "⚠ "`.',
          '3. `.maqola` dagi birinchi paragrafning birinchi harfi `#0071dc` rangda va `3em` o‘lchamda.',
          '4. `input::placeholder` rangi `#666666`.',
        ),
        expectedBehavior:
          'Sarlavha ostida sariq chiziq, ogohlantirish belgisi, katta ko‘k bosh harf, o‘qiladigan placeholder.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY07.pseudoElements, TODO),
        checks: [
          style('line-w', 'Sarlavha ostida 48px chiziq', '.sarlavha', 'width', '48px', {
            pseudo: '::after',
          }),
          style('line-bg', 'Chiziq sariq', '.sarlavha', 'background-color', '#fec400', {
            pseudo: '::after',
          }),
          style('before', 'Ogohlantirish belgisi', '.muhim', 'content', '"⚠ "', {
            pseudo: '::before',
          }),
          style('letter', 'Bosh harf ko‘k', '.maqola p:first-child', 'color', '#0071dc', {
            pseudo: '::first-letter',
            hint: '`.maqola p:first-child::first-letter`',
          }),
          style('placeholder', 'Placeholder #666666', 'input', 'color', '#666666', {
            pseudo: '::placeholder',
          }),
        ],
      },
    },
    {
      slug: 'attribute-selectors',
      title: 'Atribut selektorlari',
      exercise: {
        title: 'Klasssiz uslub',
        description: 'Maydon turi, havola manzili, ARIA va `data-*` atributlari.',
        instructions: md(
          KEEP_HTML,
          '',
          '1. `input[type="email"]` chegarasi `2px solid #0071dc`.',
          '2. `.pdf` bilan tugaydigan havolalardan keyin `" (PDF)"` yozuvi chiqsin (`::after`).',
          '3. `target="_blank"` havolalardan keyin `" ↗"`.',
          '4. `button[aria-expanded="true"]` foni `#e6f1fc`.',
          '5. `[data-holat="xato"]` matni `crimson`.',
        ),
        expectedBehavior: 'Har bir element atributiga qarab bezalgan.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY07.attributes, TODO),
        checks: [
          style(
            'email',
            'Email maydoni ko‘k chegarali',
            'input[type="email"]',
            'border-top-color',
            '#0071dc',
          ),
          style('pdf', 'PDF belgisi', 'a[href="dastur.pdf"]', 'content', '" (PDF)"', {
            pseudo: '::after',
            hint: '`a[href$=".pdf"]::after`',
          }),
          style('blank', 'Tashqi havola belgisi', 'a[target]', 'content', '" ↗"', {
            pseudo: '::after',
          }),
          style('aria', 'Ochiq menyu tugmasi ajralgan', 'button', 'background-color', '#e6f1fc'),
          style('data', 'Xato matni qizil', 'div', 'color', 'crimson'),
        ],
      },
    },
    {
      slug: 'specificity',
      title: 'Kaskad va maxsuslik',
      exercise: {
        title: 'Kim yutadi?',
        description: 'Maxsuslikni `!important` siz tuzatish.',
        instructions: md(
          '`.matn`, `.tugma` va `.belgi` qoidalari ishlamayapti. `!important` **ishlatmang**.',
          '',
          '1. `#asosiy p` va `#asosiy button` dagi ID maxsusligini nolga tushiring: `:where(#asosiy) p` va `:where(#asosiy) button`.',
          '2. `.belgi` ga inline uslub xalaqit beryapti — `index.html` dagi `style` atributini olib tashlang.',
          '',
          'Oddiy paragraf kulrangligicha qolsin.',
        ),
        expectedBehavior: 'Matn to‘q ko‘k, tugma ko‘k, belgi ko‘k, oddiy paragraf kulrang.',
        difficulty: 'HARD',
        starterFiles: site(BODY07.specificity, SPECIFICITY_CSS),
        checks: [
          style('matn', '`.matn` to‘q ko‘k', '.matn', 'color', '#0e1133', {
            hint: '`#asosiy p` maxsusligi (1,0,1) — `.matn` (0,1,0) dan kuchli.',
          }),
          style('tugma', 'Tugma ko‘k', '.tugma', 'background-color', '#0071dc'),
          style('belgi', 'Belgi ko‘k', '.belgi', 'color', '#0071dc', {
            hint: 'Inline uslub har qanday selektordan kuchli.',
          }),
          style('oddiy', 'Oddiy paragraf kulrang', '.matn + p', 'color', 'gray'),
        ],
      },
    },
    {
      slug: 'important',
      title: '`!important`',
      exercise: {
        title: 'Yordamchi klass va qatlam',
        description: 'O‘rinli `!important` va `@layer`.',
        instructions: md(
          '1. `.yashirin { display: none !important; }` yozing — ID bilan berilgan `display: block` ni ham yengsin.',
          '2. `#menyu a` qoidasini `@layer asos { … }` ichiga oling. Qatlamdagi qoidalar qatlamsiz qoidalardan kuchsiz, shuning uchun `.havola` yutadi — `!important` siz.',
        ),
        expectedBehavior: 'Xabar ko‘rinmaydi, “Kurslar” havolasi ko‘k, “Bosh sahifa” kulrang.',
        difficulty: 'HARD',
        starterFiles: site(BODY07.important, IMPORTANT_CSS),
        checks: [
          style('hidden', 'Xabar yashirin', '#xabar', 'display', 'none'),
          style('layer', '`.havola` ko‘k', '.havola', 'color', '#0071dc', {
            hint: 'Qatlamsiz `.havola` qatlamdagi `#menyu a` dan kuchli.',
          }),
          style('gray', 'Boshqa havola kulrang qoladi', '#menyu a:first-child', 'color', 'gray'),
        ],
      },
      quiz: quiz('7-modul testi: Selektorlar va kaskad', [
        q(
          'q1',
          '`.menyu > li` nimani tanlaydi?',
          [
            '`.menyu` ning faqat bevosita bolasi bo‘lgan `li` larni',
            '`.menyu` ichidagi barcha `li` larni',
            '`.menyu` dan keyingi `li` ni',
            '`li` ichidagi `.menyu` ni',
          ],
          [0],
        ),
        q(
          'q2',
          'Qaysi selektorning maxsusligi eng yuqori?',
          ['`#bosh .matn`', '`.a .b .c .d`', '`main article p`', '`p.matn:hover`'],
          [0],
        ),
        q(
          'q3',
          'Maxsusligi doim nol bo‘lgan psevdoklass?',
          ['`:where()`', '`:is()`', '`:not()`', '`:has()`'],
          [0],
        ),
        q(
          'q4',
          '`::before` va `::after` haqida qaysilari to‘g‘ri?',
          [
            '`content` xususiyatisiz chiqmaydi',
            'Bezak uchun ishlatilgani ma’qul',
            '`<img>` ichida ishlaydi',
            'Muhim matnni shu yerga yozish kerak',
          ],
          [0, 1],
        ),
        q(
          'q5',
          '`a[href$=".pdf"]` nimani tanlaydi?',
          [
            'Manzili `.pdf` bilan tugaydigan havolalar',
            'Manzili `.pdf` bilan boshlanadigan havolalar',
            'Manzilida `.pdf` bor havolalar',
            '`pdf` klassi bor havolalar',
          ],
          [0],
        ),
      ]),
    },
  ],
};
