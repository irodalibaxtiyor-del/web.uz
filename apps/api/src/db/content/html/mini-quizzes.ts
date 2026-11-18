import { codeFill, match, miniQuiz, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/**
 * Exercise mini-tests of the HTML course: three quick self-check questions on exactly what the
 * exercise asks for. Optional, unlimited attempts, never gate the lesson.
 */
export const HTML_MINI_QUIZZES: Record<string, QuizDef> = {
  introduction: miniQuiz([
    why(
      q(
        'q1',
        'Ko‘rinadigan sarlavha qaysi element ichiga yoziladi?',
        ['<body>', '<head>', '<title>', '<meta>'],
        [0],
      ),
      '`<head>` dagi narsalar sahifada ko‘rinmaydi.',
    ),
    why(
      codeFill('q2', 'Asosiy sarlavha.', '<{{1}}>Salom</h1>', ['h1']),
      'Ochuvchi va yopuvchi teg nomi bir xil.',
    ),
    why(
      tf(
        'q3',
        '“Ishga tushirish” natijani faqat sizga ko‘rsatadi, rasmiy natijani “Tekshirish” beradi.',
        true,
      ),
      'Tekshiruv serverda haqiqiy brauzerda bajariladi.',
    ),
  ]),
  basic: miniQuiz([
    why(
      match('q1', 'Elementni majburiy atributi bilan moslang.', [
        ['<a>', 'href'],
        ['<img>', 'src va alt'],
      ]),
      'Havolasiz `<a>` hech qayerga olib bormaydi; rasmga `alt` kerak.',
    ),
    why(
      codeFill('q2', 'Uch bandli ro‘yxatning bandi.', '<ul>\n  <{{1}}>HTML</li>\n</ul>', ['li']),
      'Har band `<li>`.',
    ),
    why(
      tf('q3', '`<img>` uchun yopuvchi `</img>` tegi yoziladi.', false),
      '`<img>` — bo‘sh element.',
    ),
  ]),
  elements: miniQuiz([
    why(
      codeFill('q1', 'So‘zni qalin qiling.', '<p>Bugun <{{1}}>imtihon</strong> bor.</p>', [
        'strong',
      ]),
      '`<strong>` muhimlikni bildiradi.',
    ),
    why(
      q(
        'q2',
        'Manzilda yangi qatorga o‘tish uchun?',
        ['<br>', '<hr>', '<p> ichida bo‘sh joylar', '<nl>'],
        [0],
      ),
      'Mashqda kamida 2 ta `<br>` kerak.',
    ),
    why(
      tf('q3', 'Ichkaridagi teg tashqaridagidan oldin yopiladi.', true),
      'Teglar kesishmasligi kerak.',
    ),
  ]),
  attributes: miniQuiz([
    why(
      codeFill(
        'q1',
        'Havolaga izoh qo‘shing.',
        '<a href="https://kun.uz" {{1}}="Yangiliklar sayti">Kun.uz</a>',
        ['title'],
      ),
      '`title` sichqoncha ustiga kelganda chiqadi.',
    ),
    why(
      sortInto('q2', 'Mashqda rasmga qaysi atributlar beriladi?', {
        Beriladi: ['alt', 'width', 'height'],
        'Kerak emas': ['href'],
      }),
      '`href` — havola atributi.',
    ),
    why(tf('q3', 'Atribut qiymati qo‘shtirnoq ichida yoziladi.', true), 'Masalan: `width="200"`.'),
  ]),
  headings: miniQuiz([
    why(
      q(
        'q1',
        'Maqolada nechta `<h1>` qolishi kerak?',
        ['Bitta', 'Ikkita', 'Har bo‘limda bittadan', 'Hech qancha'],
        [0],
      ),
      '`<h1>` — maqola nomi.',
    ),
    why(
      codeFill(
        'q2',
        'Bo‘limlar orasini ajrating.',
        '<h2>Kirish</h2>\n<p>…</p>\n<{{1}}>\n<h2>Asosiy qism</h2>',
        ['hr'],
      ),
      '`<hr>` — mavzu almashganini bildiradi.',
    ),
    why(
      tf('q3', 'Bo‘lim sarlavhalari uchun `<h2>` ishlatiladi.', true),
      '`<h1>` dan keyingi daraja.',
    ),
  ]),
  paragraphs: miniQuiz([
    why(
      q(
        'q1',
        'She’r qatorlarini bitta paragraf ichida ajratish?',
        ['<br>', '<hr>', 'Bir nechta bo‘sh joy', '<p> ichida <p>'],
        [0],
      ),
      'Kodda yangi qator qoldirish yetmaydi.',
    ),
    why(
      codeFill('q2', 'Bo‘sh joylar saqlansin.', '<{{1}}>\n   *\n  ***\n</pre>', ['pre']),
      '`<pre>` matnni aynan ko‘rsatadi.',
    ),
    why(
      tf('q3', 'Oddiy `<p>` ichidagi ketma-ket bo‘sh joylar ham ekranda ko‘rinadi.', false),
      'Brauzer ularni bitta bo‘sh joyga aylantiradi.',
    ),
  ]),
  styles: miniQuiz([
    why(
      codeFill('q1', 'Sarlavha rangini bering.', '<h2 style="{{1}}: #0071dc;">E’lon</h2>', [
        'color',
      ]),
      'Matn rangi — `color`.',
    ),
    why(
      match('q2', 'Talabni xususiyat bilan moslang.', [
        ['Shrift o‘lchami 18px', 'font-size'],
        ['Matn markazda', 'text-align'],
        ['Fon rangi', 'background-color'],
      ]),
      'Bir nechta xususiyat `;` bilan ajratiladi.',
    ),
    why(
      tf('q3', '`style="color: red background: blue"` to‘g‘ri yozilgan.', false),
      'Xususiyatlar orasida nuqta-vergul yo‘q.',
    ),
  ]),
  formatting: miniQuiz([
    why(
      match('q1', 'Talabni teg bilan moslang.', [
        ['Eski narx o‘chirilgan', '<del>'],
        ['Yangi narx ajratilgan', '<strong>'],
        ['“Faqat bugun” belgilangan', '<mark>'],
        ['H2O dagi 2', '<sub>'],
      ]),
      'Har teg o‘z ma’nosiga ega.',
    ),
    why(
      codeFill('q2', 'Formulani yozing.', 'H<{{1}}>2</sub>O', ['sub']),
      '`<sup>` — yuqori indeks.',
    ),
    why(
      tf('q3', '`<b>` va `<strong>` ma’no jihatdan bir xil.', false),
      '`<strong>` — muhimlik, `<b>` — faqat ko‘rinish.',
    ),
  ]),
  quotations: miniQuiz([
    why(
      codeFill(
        'q1',
        'Uzun iqtibosga manba.',
        '<blockquote {{1}}="https://example.uz/manba">…</blockquote>',
        ['cite'],
      ),
      'Manba manzili `cite` atributida.',
    ),
    why(
      match('q2', 'Talabni teg bilan moslang.', [
        ['Gap ichidagi qisqa iqtibos', '<q>'],
        ['HTML qisqartmasi', '<abbr title>'],
        ['Aloqa ma’lumoti', '<address>'],
      ]),
      '`<q>` uchun tirnoqni brauzer qo‘yadi.',
    ),
    why(
      tf('q3', '`<abbr>` ning to‘liq nomi `title` atributida yoziladi.', true),
      'Sichqoncha ustiga kelganda chiqadi.',
    ),
  ]),
  comments: miniQuiz([
    why(
      codeFill('q1', 'Paragrafni izohga oling.', '{{1}} <p class="eski-aksiya">…</p> -->', [
        '<!--',
      ]),
      'Izoh `<!--` bilan boshlanib `-->` bilan tugaydi.',
    ),
    why(
      tf('q2', 'Izoh ichidagi kod sahifada ko‘rinmaydi, lekin manba kodda qoladi.', true),
      'Shuning uchun izohga maxfiy ma’lumot yozmang.',
    ),
    why(
      q(
        'q3',
        'Bo‘lim tepasidagi tushuntiruvchi izoh kim uchun?',
        [
          'Kodni o‘qiydigan dasturchi uchun',
          'Sayt foydalanuvchisi uchun',
          'Brauzer uchun',
          'Qidiruv tizimi uchun',
        ],
        [0],
      ),
      'Izoh kodni tushunishni osonlashtiradi.',
    ),
  ]),
  colors: miniQuiz([
    why(
      sortInto('q1', 'Rang yozuvlarini usuliga ajrating.', {
        HEX: ['#f5faff'],
        RGB: ['rgb(0, 113, 220)'],
        HSL: ['hsl(48, 100%, 50%)'],
      }),
      'Uchalasi ham ishlaydi.',
    ),
    why(
      codeFill('q2', '`.eslatma` chegarasi.', '.eslatma {\n  border: 2px {{1}} orange;\n}', [
        'solid',
      ]),
      'Chegara: qalinlik, tur, rang.',
    ),
    why(
      tf('q3', '`body` ga berilgan fon rangi butun sahifa foni bo‘ladi.', true),
      'Mashqda `body` foni `#f5faff`.',
    ),
  ]),
  css: miniQuiz([
    why(
      codeFill('q1', 'CSS faylni ulang.', '<link {{1}}="stylesheet" href="style.css">', ['rel']),
      '`<head>` ichida.',
    ),
    why(
      tf('q2', 'Mashqda HTML’da `style` atributini ishlatish ruxsat etilgan.', false),
      'Hamma uslub CSS faylda bo‘lishi kerak.',
    ),
    why(
      q(
        'q3',
        '`style.css` da `h1` ga rang berish qoidasi qaysi?',
        [
          'h1 { color: #0071dc; }',
          '<h1 color="#0071dc">',
          'h1 = #0071dc',
          '.h1 { color: #0071dc; }',
        ],
        [0],
      ),
      '`.h1` — klass selektori, element emas.',
    ),
  ]),
  links: miniQuiz([
    why(
      codeFill(
        'q1',
        'Tashqi havola yangi oynada.',
        '<a href="https://gov.uz" target="{{1}}">Hukumat portali</a>',
        ['_blank'],
      ),
      'Xavfsizlik uchun `rel="noopener"` ham qo‘shing.',
    ),
    why(
      match('q2', 'Havola turini manzil bilan moslang.', [
        ['Email', 'mailto:info@example.uz'],
        ['Telefon', 'tel:+998901234567'],
        ['Sahifa ichidagi bo‘lim', '#aloqa'],
      ]),
      '`#aloqa` uchun pastda `id="aloqa"` kerak.',
    ),
    why(
      tf('q3', '`#aloqa` havolasi ishlashi uchun bo‘limga `class="aloqa"` berish yetarli.', false),
      'Kerakli atribut — `id`.',
    ),
  ]),
  images: miniQuiz([
    why(
      order('q1', 'Izohli rasm tuzilmasini tartiblang.', [
        '<figure>',
        '<img alt width height>',
        '<figcaption>',
      ]),
      'Izoh rasm ostida.',
    ),
    why(
      q(
        'q2',
        'Qaysi `alt` mazmunli?',
        ['Registon maydoni kechqurun', 'rasm', 'IMG_01.jpg', 'foto'],
        [0],
      ),
      '`alt` rasmni so‘z bilan tasvirlaydi.',
    ),
    why(
      tf('q3', '`width` va `height` berilsa, sahifa rasm yuklanayotganda “sakramaydi”.', true),
      'Brauzer joyni oldindan ajratadi.',
    ),
  ]),
  project: miniQuiz([
    why(
      codeFill('q1', 'Papka ichidagi CSS faylni ulang.', '<link rel="stylesheet" href="{{1}}">', [
        'css/style.css',
      ]),
      'Nisbiy yo‘l: papka/fayl.',
    ),
    why(
      sortInto('q2', 'Vizitka talablari?', {
        Kerak: ['Ismingiz <h1> da', 'alt li rasm', 'Kamida 3 bandli <ul>'],
        'Kerak emas': ['Jadval bilan maket'],
      }),
      'Mashq talablarini ro‘yxatdek tekshiring.',
    ),
    why(
      tf('q3', '`<h1>` rangi HTML’da emas, `css/style.css` da beriladi.', true),
      'Ko‘rinish CSS faylda.',
    ),
  ]),
  favicon: miniQuiz([
    why(
      codeFill('q1', 'Faviconni ulang.', '<link rel="{{1}}" href="favicon.png">', ['icon']),
      '`<head>` ichida.',
    ),
    why(
      q(
        'q2',
        'Favicon qayerda ko‘rinadi?',
        ['Brauzer tabida', 'Sahifa markazida', 'Footer’da', 'Hech qayerda'],
        [0],
      ),
      'Saytni tablar orasida tez topishga yordam beradi.',
    ),
    why(
      tf('q3', 'Favicon `<body>` ichiga `<img>` qilib qo‘yiladi.', false),
      'U `<head>` dagi `<link>` bilan ulanadi.',
    ),
  ]),
  'page-title': miniQuiz([
    why(
      codeFill('q1', 'Sahifa nomini yozing.', '<{{1}}>Bahor choyxonasi — Menyu</title>', ['title']),
      '`<title>` tab va qidiruv natijasida chiqadi.',
    ),
    why(
      q(
        'q2',
        '`<title>` qayerda yoziladi?',
        ['<head> ichida', '<body> ichida', '<h1> ichida', 'CSS faylda'],
        [0],
      ),
      'U sahifa haqidagi ma’lumot.',
    ),
    why(
      tf('q3', '`<title>` va `<h1>` bir xil element.', false),
      '`<title>` — tab nomi, `<h1>` — sahifadagi sarlavha.',
    ),
  ]),
  tables: miniQuiz([
    why(
      codeFill('q1', 'Ustun sarlavhasi.', '<th {{1}}="col">Kun</th>', ['scope']),
      '`scope` ekran o‘quvchiga yordam beradi.',
    ),
    why(
      order('q2', 'Jadval qismlarini tartiblang.', ['<caption>', '<thead>', '<tbody>']),
      '`<caption>` — jadval nomi.',
    ),
    why(
      q('q3', 'Oddiy ma’lumot katakchasi qaysi teg?', ['<td>', '<th>', '<tr>', '<tc>'], [0]),
      '`<tr>` — qator, `<th>` — sarlavha katak.',
    ),
  ]),
  lists: miniQuiz([
    why(
      match('q1', 'Retsept qismini ro‘yxat turi bilan moslang.', [
        ['Masalliqlar', '<ul>'],
        ['Tayyorlash bosqichlari', '<ol>'],
        ['Atamalar izohi', '<dl>'],
      ]),
      'Tartib muhim bo‘lsa — `<ol>`.',
    ),
    why(
      codeFill(
        'q2',
        'Atama va izoh.',
        '<dl>\n  <{{1}}>Zira</dt>\n  <dd>Xushbo‘y ziravor</dd>\n</dl>',
        ['dt'],
      ),
      '`dt` — atama, `dd` — izoh.',
    ),
    why(tf('q3', 'Ichki ro‘yxat `<li>` ichiga joylanadi.', true), 'Masalan, ziravorlar ro‘yxati.'),
  ]),
  'block-inline': miniQuiz([
    why(
      codeFill('q1', 'So‘zni belgilang.', '<p>Bu <{{1}} class="belgi">yangi</span> kurs.</p>', [
        'span',
      ]),
      '`<span>` — satr ichidagi konteyner.',
    ),
    why(
      codeFill('q2', 'Menyu bandlari bir qatorda.', 'nav li {\n  display: {{1}};\n}', [
        'inline-block',
      ]),
      '`inline-block` qatorda turadi va o‘lcham oladi.',
    ),
    why(
      q('q3', '`<li>` ning standart turi?', ['Blok', 'Inline', 'Inline-block', 'Flex'], [0]),
      'Shuning uchun bandlar ustma-ust turadi.',
    ),
  ]),
  div: miniQuiz([
    why(
      codeFill('q1', 'Kartochkalar yonma-yon.', '.qator {\n  display: {{1}};\n}', ['flex']),
      'Flexbox — yonma-yon joylashtirish.',
    ),
    why(
      codeFill('q2', 'Karta 250px dan kengaymasin.', '.karta {\n  {{1}}: 250px;\n}', ['max-width']),
      '`max-width` tor ekranda qisqarishga ruxsat beradi.',
    ),
    why(
      tf('q3', '`<div>` o‘zi ma’no bildirmaydigan konteyner.', true),
      'Ma’noli qismlar uchun semantik teglar.',
    ),
  ]),
  classes: miniQuiz([
    why(
      codeFill('q1', 'CSS’da klassni tanlang.', '{{1}}muhim {\n  color: crimson;\n}', ['.']),
      'Klass selektori nuqta bilan.',
    ),
    why(
      q(
        'q2',
        'Elementga ikki klass?',
        [
          'class="muhim katta"',
          'class="muhim, katta"',
          'class="muhim" class="katta"',
          'class="muhim+katta"',
        ],
        [0],
      ),
      'Bo‘sh joy bilan ajratiladi.',
    ),
    why(
      tf('q3', 'Bitta klass bir nechta turli elementga berilishi mumkin.', true),
      'Mashqda kamida uchta elementga.',
    ),
  ]),
  id: miniQuiz([
    why(
      codeFill(
        'q1',
        'Bo‘limga olib boradigan havola.',
        '<a href="{{1}}">Narxlar</a>\n…\n<section id="narxlar">',
        ['#narxlar'],
      ),
      'Havola manzili: `#` va bo‘lim `id` si.',
    ),
    why(
      codeFill(
        'q2',
        'Yorliqni maydonga bog‘lang.',
        '<label {{1}}="ism">Ism</label>\n<input id="ism">',
        ['for'],
      ),
      '`for` qiymati — maydon `id` si.',
    ),
    why(
      tf('q3', 'Bir sahifada bir xil `id` ikki elementda bo‘lishi mumkin.', false),
      '`id` yagona bo‘ladi.',
    ),
  ]),
  buttons: miniQuiz([
    why(
      codeFill(
        'q1',
        'Oddiy (formani yubormaydigan) tugma.',
        '<button type="{{1}}" id="salom">Salom</button>',
        ['button'],
      ),
      'Forma ichida standart `submit`.',
    ),
    why(
      codeFill(
        'q2',
        'Paragrafga matn yozing.',
        "document.getElementById('natija').{{1}} = 'Salom!';",
        ['textContent'],
      ),
      '`textContent` matnni o‘zgartiradi.',
    ),
    why(
      q('q3', 'Faolsiz tugma uchun atribut?', ['disabled', 'hidden', 'readonly', 'off'], [0]),
      '`disabled` tugmani bosib bo‘lmaydi.',
    ),
  ]),
  iframes: miniQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['title', 'Mazmun tavsifi (ekran o‘quvchi uchun)'],
        ['loading="lazy"', 'Ekranga yaqinlashganda yuklash'],
        ['sandbox', 'Imkoniyatlarni cheklash'],
      ]),
      'Mashqda uchalasi ham kerak.',
    ),
    why(
      tf('q2', 'Bo‘sh `sandbox` atributi ham ishlaydi.', true),
      'U eng qattiq cheklovlarni yoqadi.',
    ),
    why(
      q(
        'q3',
        'Begona sahifani iframe’da ko‘rsatishda nima muhim?',
        [
          'Faqat ishonchli manbalar va sandbox',
          'Iloji boricha katta o‘lcham',
          'title siz',
          'Hech narsa',
        ],
        [0],
      ),
      'Iframe ichidagi kod — boshqa birovning kodi.',
    ),
  ]),
  javascript: miniQuiz([
    why(
      codeFill('q1', 'Tashqi skriptni ulang.', '<script {{1}}="app.js" defer></script>', ['src']),
      '`defer` bilan `<head>` da ham ishlaydi.',
    ),
    why(
      q(
        'q2',
        'Skript `#xabar` ni topishi uchun qayerga ulanadi?',
        [
          '<body> oxiriga yoki defer bilan',
          '<head> boshiga deferSIZ',
          'HTML’dan oldin',
          'CSS fayl ichiga',
        ],
        [0],
      ),
      'Element skriptdan oldin yaratilgan bo‘lishi kerak.',
    ),
    why(
      tf('q3', '`app.js` ichida `<script>` tegi yoziladi.', false),
      'JS faylda faqat JavaScript kodi.',
    ),
  ]),
  'file-paths': miniQuiz([
    why(
      q(
        'q1',
        '`sahifalar/aloqa.html` dan `index.html` ga yo‘l?',
        ['../index.html', 'index.html', '/sahifalar/index.html', 'sahifalar/index.html'],
        [0],
      ),
      '`../` — bitta yuqori papka.',
    ),
    why(
      codeFill('q2', '`index.html` dan aloqa sahifasiga havola.', '<a href="{{1}}">Aloqa</a>', [
        'sahifalar/aloqa.html',
      ]),
      'Shu papkadagi `sahifalar` ichidan.',
    ),
    why(
      tf('q3', 'Yo‘lda Windows uslubidagi `\\` ishlatiladi.', false),
      'Veb-manzillarda doim `/`.',
    ),
  ]),
  head: miniQuiz([
    why(
      codeFill(
        'q1',
        'Viewport tegini yozing.',
        '<meta name="{{1}}" content="width=device-width, initial-scale=1">',
        ['viewport'],
      ),
      'Telefon uchun majburiy.',
    ),
    why(
      match('q2', 'Meta tegni vazifasi bilan moslang.', [
        ['description', 'Qidiruv natijasidagi qisqa matn'],
        ['og:title', 'Ijtimoiy tarmoqda ulashilgandagi sarlavha'],
      ]),
      '`og:` — Open Graph.',
    ),
    why(
      tf('q3', 'Meta teglar sahifada ko‘rinadi.', false),
      'Ular `<head>` da — sahifa haqidagi ma’lumot.',
    ),
  ]),
  layout: miniQuiz([
    why(
      match('q1', '`div` ni semantik teg bilan almashtiring.', [
        ['div.header', '<header>'],
        ['div.nav', '<nav>'],
        ['div.main', '<main>'],
        ['div.aside', '<aside>'],
        ['div.footer', '<footer>'],
      ]),
      'Teg nomi qism ma’nosini bildiradi.',
    ),
    why(
      tf('q2', 'Semantik teglar ko‘rinishni o‘zgartiradi.', false),
      'Ular ma’no beradi; ko‘rinish CSS’da.',
    ),
    why(
      q('q3', 'Sahifada nechta `<main>`?', ['Bitta', 'Ikkita', 'Har bo‘limda', 'Cheksiz'], [0]),
      '`<main>` — asosiy mazmun.',
    ),
  ]),
  responsive: miniQuiz([
    why(
      codeFill('q1', 'Rasm konteynerdan chiqmasin.', 'img {\n  {{1}}: 100%;\n}', ['max-width']),
      'Rasm ota kengligidan oshmaydi.',
    ),
    why(
      codeFill(
        'q2',
        '600px va undan tor ekranda ustunlar ustma-ust.',
        '@media (max-width: 600px) {\n  .ustunlar {\n    flex-direction: {{1}};\n  }\n}',
        ['column'],
      ),
      'Katta ekranda `row` qoladi.',
    ),
    why(
      tf('q3', '`max-width: 600px` so‘rovi 800px ekranda ham ishlaydi.', false),
      'U faqat 600px va undan torroq ekranda.',
    ),
  ]),
  computercode: miniQuiz([
    why(
      match('q1', 'Talabni teg bilan moslang.', [
        ['Ctrl tugmasi', '<kbd>'],
        ['Kod bloki', '<pre><code>'],
        ['Dastur natijasi', '<samp>'],
      ]),
      'Har biri alohida ma’noga ega.',
    ),
    why(
      codeFill('q2', 'Tugma birikmasi.', '<kbd>Ctrl</kbd> + <{{1}}>S</kbd>', ['kbd']),
      'Har tugma alohida `<kbd>`.',
    ),
    why(
      tf('q3', '`<pre>` kod blokidagi bo‘sh joy va qatorlarni saqlaydi.', true),
      'Shuning uchun kod chiroyli ko‘rinadi.',
    ),
  ]),
  semantics: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ochiladigan savol.',
        '<details>\n  <{{1}}>Kurs qancha davom etadi?</summary>\n  <p>6 hafta.</p>\n</details>',
        ['summary'],
      ),
      'JavaScript’siz ishlaydi.',
    ),
    why(
      match('q2', 'Talabni teg bilan moslang.', [
        ['Blog posti', '<article>'],
        ['Post ichidagi qism', '<section>'],
      ]),
      '`<article>` — mustaqil mazmun.',
    ),
    why(tf('q3', 'Mashqda post sarlavhasi `<h2>` bo‘ladi.', true), 'Sahifaning `<h1>` i boshqa.'),
  ]),
  'style-guide': miniQuiz([
    why(
      codeFill('q1', 'Sahifa tilini bering.', '<html {{1}}="uz">', ['lang']),
      'Ekran o‘quvchi to‘g‘ri talaffuz qiladi.',
    ),
    why(
      sortInto('q2', 'Kod uslubi qoidalari.', {
        "To'g'ri": ['Teglar kichik harfda', 'Chekinishlar bilan', '<meta charset="UTF-8">'],
        "Noto'g'ri": ['<IMG SRC=a.jpg>'],
      }),
      'Kod o‘qiluvchan bo‘lsin.',
    ),
    why(
      q(
        'q3',
        'Rasmga mashqda qaysi atributlar qo‘shiladi?',
        ['alt, width, height', 'href', 'title faqat', 'class faqat'],
        [0],
      ),
      'Qulaylik va barqaror maket uchun.',
    ),
  ]),
  entities: miniQuiz([
    why(
      codeFill('q1', '`<h1>` ni matn sifatida yozing.', '<p id="teg">{{1}}h1{{2}}</p>', [
        '&lt;',
        '&gt;',
      ]),
      'Aks holda brauzer haqiqiy teg deb o‘ylaydi.',
    ),
    why(
      q('q2', '© belgisi qaysi entity?', ['&copy;', '&c;', '&reg;', '&copyright;'], [0]),
      '`&reg;` — ®.',
    ),
    why(
      tf('q3', '`5 < 10` ni matnda `5 &lt; 10` deb yozish xavfsiz.', true),
      '`<` teg boshlanishi deb o‘qilmaydi.',
    ),
  ]),
  symbols: miniQuiz([
    why(
      match('q1', 'Belgini entity bilan moslang.', [
        ['π', '&pi;'],
        ['∑', '&sum;'],
        ['→', '&rarr;'],
        ['€', '&euro;'],
      ]),
      'Klaviaturada yo‘q belgilar uchun.',
    ),
    why(
      tf('q2', 'Entity har doim `&` bilan boshlanib `;` bilan tugaydi.', true),
      'Masalan, `&pi;`.',
    ),
    why(q('q3', '`&larr;` qaysi belgi?', ['←', '→', '↑', '↓'], [0]), 'left arrow.'),
  ]),
  emojis: miniQuiz([
    why(
      q('q1', '`&#128640;` qaysi emoji?', ['🚀', '😀', '📚', '❤️'], [0]),
      'Emoji o‘nlik kod bilan ham yoziladi.',
    ),
    why(
      codeFill('q2', 'Emoji’ga ma’no bering.', '<span role="img" {{1}}="yurak">❤️</span>', [
        'aria-label',
      ]),
      'Ekran o‘quvchi “yurak” deb o‘qiydi.',
    ),
    why(
      tf('q3', 'Emoji rasm fayli emas, Unicode belgisi.', true),
      'Shuning uchun `font-size` bilan kattalashadi.',
    ),
  ]),
  forms: miniQuiz([
    why(
      codeFill('q1', 'Yuborish tugmasi.', '<button type="{{1}}">Yuborish</button>', ['submit']),
      'Formani yuboradi.',
    ),
    why(
      sortInto('q2', 'Ism maydoni uchun nima kerak?', {
        Kerak: ['id="ism"', 'name="ism"', '<label for="ism">'],
        'Kerak emas': ['href="ism"'],
      }),
      '`name` siz maydon yuborilmaydi.',
    ),
    why(
      q('q3', 'Email maydoni turi?', ['email', 'text', 'mail', 'address'], [0]),
      '`@` tekshiriladi va telefonda mos klaviatura chiqadi.',
    ),
  ]),
  'form-attributes': miniQuiz([
    why(
      match('q1', 'Talabni atribut bilan moslang.', [
        ['/royxat manziliga yuborish', 'action'],
        ['post usulida', 'method'],
        ['Avtomatik to‘ldirmaslik', 'autocomplete="off"'],
      ]),
      'Atributlar `<form>` ga beriladi.',
    ),
    why(
      codeFill('q2', 'Usulni yozing.', '<form action="/royxat" method="{{1}}">', ['post']),
      'Maxfiy ma’lumot uchun `post`.',
    ),
    why(
      tf('q3', '`get` usulida ma’lumot URL’da ko‘rinadi.', true),
      'Shuning uchun parol uchun yaramaydi.',
    ),
  ]),
  'form-elements': miniQuiz([
    why(
      match('q1', 'Talabni element bilan moslang.', [
        ['O‘lcham tanlovi', '<select>'],
        ['Izoh', '<textarea>'],
        ['Maydonlar guruhi', '<fieldset> + <legend>'],
        ['Shahar takliflari', '<datalist>'],
      ]),
      'Har biri o‘z vazifasiga.',
    ),
    why(
      codeFill(
        'q2',
        'Maydonni takliflar bilan bog‘lang.',
        '<input {{1}}="shaharlar" name="shahar">\n<datalist id="shaharlar">…</datalist>',
        ['list'],
      ),
      '`list` qiymati — datalist `id` si.',
    ),
    why(
      tf('q3', '`<datalist>` foydalanuvchiga erkin yozishga ham ruxsat beradi.', true),
      '`<select>` dan farqi shu.',
    ),
  ]),
  'input-types': miniQuiz([
    why(
      match('q1', 'Maydonni `type` bilan moslang.', [
        ['Telefon', 'tel'],
        ['Yosh', 'number'],
        ['Tug‘ilgan sana', 'date'],
        ['Sevimli rang', 'color'],
      ]),
      'To‘g‘ri tur mos klaviatura va tanlagich beradi.',
    ),
    why(
      tf('q2', 'Ikkita radio bitta tanlov bo‘lishi uchun `name` lari bir xil bo‘ladi.', true),
      'Aks holda ikkalasi ham tanlanadi.',
    ),
    why(
      q('q3', 'Obuna (ha/yo‘q) uchun qaysi tur?', ['checkbox', 'radio', 'switch', 'toggle'], [0]),
      'Bitta belgilash — checkbox.',
    ),
  ]),
  'input-attributes': miniQuiz([
    why(
      match('q1', 'Talabni atribut bilan moslang.', [
        ['Majburiy', 'required'],
        ['30 belgidan oshmasin', 'maxlength="30"'],
        ['7 dan 99 gacha', 'min="7" max="99"'],
        ['Faqat 4 raqam', 'pattern="[0-9]{4}"'],
      ]),
      'Brauzer yuborishdan oldin tekshiradi.',
    ),
    why(
      tf('q2', '`placeholder` yorliq o‘rnini bosadi.', false),
      'U faqat ko‘rsatma va yozganda yo‘qoladi.',
    ),
    why(
      codeFill('q3', 'Ko‘rsatma matni.', '<input id="ism" {{1}}="Masalan: Aziza">', [
        'placeholder',
      ]),
      'Bo‘sh maydonda kulrang chiqadi.',
    ),
  ]),
  'input-form-attributes': miniQuiz([
    why(
      codeFill(
        'q1',
        'Tashqi maydonni formaga bog‘lang.',
        '<form id="anketa">…</form>\n<textarea {{1}}="anketa"></textarea>',
        ['form'],
      ),
      '`form` atributi — forma `id` si.',
    ),
    why(
      match('q2', 'Atributni vazifasi bilan moslang.', [
        ['formaction', 'Shu tugma boshqa manzilga yuboradi'],
        ['formnovalidate', 'Shu tugma tekshiruvsiz yuboradi'],
      ]),
      '“Qoralama” tugmasi uchun qulay.',
    ),
    why(
      tf('q3', '`formaction` tugmaga beriladi, formaga emas.', true),
      'Har tugma o‘z manzilini berishi mumkin.',
    ),
  ]),
  canvas: miniQuiz([
    why(
      codeFill('q1', '2D kontekst.', "const ctx = mato.getContext('{{1}}');", ['2d']),
      'Barcha chizish shu orqali.',
    ),
    why(
      match('q2', 'Buyruqni shakl bilan moslang.', [
        ['fillRect', 'To‘ldirilgan to‘rtburchak'],
        ['arc', 'Aylana'],
      ]),
      'Aylanadan keyin `fill()` yoki `stroke()`.',
    ),
    why(
      tf(
        'q3',
        'Canvas chizmasini ekran o‘quvchi ko‘rmaydi, shuning uchun `aria-label` kerak.',
        true,
      ),
      'Chizma nimani ko‘rsatishini so‘z bilan ayting.',
    ),
  ]),
  svg: miniQuiz([
    why(
      codeFill(
        'q1',
        'SVG koordinatalar maydoni.',
        '<svg {{1}}="0 0 100 100" role="img" aria-label="Logo">',
        ['viewBox'],
      ),
      '`viewBox` SVG’ni har o‘lchamda moslashtiradi.',
    ),
    why(
      match('q2', 'SVG elementini shakl bilan moslang.', [
        ['<rect>', 'To‘rtburchak'],
        ['<circle>', 'Aylana'],
      ]),
      'Rang `fill` atributi bilan.',
    ),
    why(
      tf('q3', 'SVG logotipga `role="img"` va `aria-label` berish qulaylikni oshiradi.', true),
      'Ekran o‘quvchi uni rasm deb e’lon qiladi.',
    ),
  ]),
  video: miniQuiz([
    why(
      match('q1', 'Talabni atribut yoki element bilan moslang.', [
        ['Boshqaruv tugmalari', 'controls'],
        ['Muqova rasm', 'poster'],
        ['Subtitrlar', '<track kind="subtitles">'],
      ]),
      'Mashqda uchalasi ham kerak.',
    ),
    why(
      codeFill('q2', 'MP4 manba.', '<source src="dars.mp4" type="{{1}}">', ['video/mp4']),
      'WebM uchun `video/webm`.',
    ),
    why(
      tf('q3', 'Brauzer `<source>` lardan birinchi tushunganini tanlaydi.', true),
      'Shuning uchun bir nechta format beriladi.',
    ),
  ]),
  audio: miniQuiz([
    why(
      codeFill('q1', 'MP3 manba.', '<source src="podkast.mp3" type="{{1}}">', ['audio/mpeg']),
      'MP3 ning MIME turi.',
    ),
    why(
      q(
        'q2',
        '`preload="metadata"` nima qiladi?',
        [
          'Faqat davomiylik kabi ma’lumotni oldindan yuklaydi',
          'Butun faylni yuklaydi',
          'Hech narsa yuklamaydi',
          'Avtomatik ijro etadi',
        ],
        [0],
      ),
      'Trafik tejaladi.',
    ),
    why(
      tf('q3', '`download` atributli havola faylni yuklab olishni taklif qiladi.', true),
      'Masalan, `<a href="podkast.mp3" download>`.',
    ),
  ]),
  youtube: miniQuiz([
    why(
      q(
        'q1',
        'YouTube videosini joylash uchun manzil qanday boshlanadi?',
        [
          'https://www.youtube.com/embed/',
          'https://youtu.be/',
          'https://www.youtube.com/watch?v=',
          'youtube://',
        ],
        [0],
      ),
      'Faqat `embed` manzili iframe’da ishlaydi.',
    ),
    why(
      codeFill(
        'q2',
        'To‘liq ekranga ruxsat.',
        '<iframe src="…" title="Dars videosi" {{1}}></iframe>',
        ['allowfullscreen'],
      ),
      '`title` ham majburiy.',
    ),
    why(
      tf('q3', 'Manzil oxiridagi `?mute=1` video ovozsiz boshlanishini so‘raydi.', true),
      'Avtomatik ijro uchun ovozsiz bo‘lishi kerak.',
    ),
  ]),
  'drag-drop': miniQuiz([
    why(
      codeFill(
        'q1',
        'Kartochka sudraladigan bo‘lsin.',
        '<div class="vazifa" draggable="{{1}}">…</div>',
        ['true'],
      ),
      'Standart holda elementlar sudralmaydi.',
    ),
    why(
      order('q2', 'Hodisalarni tartiblang.', ['dragstart', 'dragover', 'drop']),
      '`dragstart` da id `dataTransfer` ga yoziladi.',
    ),
    why(
      tf('q3', '`dragover` da `preventDefault()` chaqirilmasa, `drop` ishlamaydi.', true),
      'Brauzer tashlashga ruxsat bermaydi.',
    ),
  ]),
  popover: miniQuiz([
    why(
      codeFill('q1', 'Tugma popover’ni ochsin.', '<button {{1}}="yordam">Yordam</button>', [
        'popovertarget',
      ]),
      'Popover’ning `id` si.',
    ),
    why(
      codeFill(
        'q2',
        'Popover ichidagi yopish tugmasi.',
        '<button popovertarget="yordam" popovertargetaction="{{1}}">Yopish</button>',
        ['hide'],
      ),
      '`toggle` (standart), `show`, `hide`.',
    ),
    why(
      tf('q3', 'Popover ishlashi uchun JavaScript yozish shart.', false),
      '`popover` + `popovertarget` JavaScript’siz ishlaydi.',
    ),
  ]),
};
