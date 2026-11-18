import {
  codeFill,
  fill,
  lessonQuiz,
  match,
  order,
  q,
  sortInto,
  tf,
  why,
  type QuizDef,
} from '../helpers';

/**
 * Per-lesson tests of the HTML course (lessons that close a module keep their module quiz).
 * Original Uzbek questions based on each lesson's text; every question has an explanation.
 */
export const HTML_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. HTML bilan tanishuv -------------------------------------------------
  introduction: lessonQuiz([
    why(
      tf('q1', 'HTML — dasturlash tili.', false),
      'HTML belgilash tili: u mazmunning qaysi qismi sarlavha, paragraf yoki havola ekanini teglar bilan belgilaydi, hisob-kitob va mantiq bajarmaydi.',
    ),
    why(
      match('q2', 'Veb-sahifa qatlamini uning vazifasi bilan moslang.', [
        ['HTML', 'Tuzilma va mazmun'],
        ['CSS', 'Ko‘rinish'],
        ['JavaScript', 'Xatti-harakat'],
      ]),
      'HTML sahifaning skeleti, CSS uning ko‘rinishi (rang, shrift, joylashuv), JavaScript esa harakatlar (tugma bosilganda nima bo‘lishi) uchun javob beradi.',
    ),
    why(
      q(
        'q3',
        'Foydalanuvchi ekranda ko‘radigan mazmun qaysi element ichida yoziladi?',
        ['<body>', '<head>', '<title>', '<!DOCTYPE html>'],
        [0],
      ),
      '`<head>` sahifa haqidagi ma’lumotlarni saqlaydi va ekranda ko‘rinmaydi; ko‘rinadigan barcha narsa `<body>` ichida bo‘ladi.',
    ),
    why(
      order('q4', 'Eng kichik HTML hujjat qismlarini yuqoridan pastga tartiblang.', [
        '<!DOCTYPE html>',
        '<html lang="uz">',
        '<head> … </head>',
        '<body> … </body>',
      ]),
      'Hujjat turi birinchi qatorda e’lon qilinadi, `<html>` hamma narsani o‘raydi, uning ichida avval `<head>`, keyin `<body>` keladi.',
    ),
  ]),
  editors: lessonQuiz([
    why(
      q(
        'q1',
        'Bosh sahifa fayli odatda qanday nomlanadi?',
        ['index.html', 'main.htm', 'home.txt', 'sahifa.html'],
        [0],
      ),
      'Veb-server papka manzili so‘ralganda odatda `index.html` faylini avtomatik qaytaradi.',
    ),
    why(
      tf('q2', 'HTML yozish uchun maxsus pullik dastur o‘rnatish shart.', false),
      'Istalgan matn muharriri yetadi; VS Code kabi muharrirlar faqat ishni qulaylashtiradi.',
    ),
    why(
      fill(
        'q3',
        'Bo‘sh joyni to‘ldiring.',
        'O‘zbekcha harflar to‘g‘ri ko‘rinishi uchun faylni {{1}} kodirovkasida saqlang.',
        [['UTF-8', 'utf8', 'utf-8']],
      ),
      'UTF-8 barcha tillarning harflarini to‘g‘ri saqlaydi; `<meta charset="utf-8">` brauzerga buni aytadi.',
    ),
    why(
      sortInto('q4', 'Fayl nomlarini yaxshi va yomon guruhlarga ajrating.', {
        'Yaxshi nom': ['mening-sahifam.html', 'kurslar.html'],
        'Yomon nom': ['Mening sahifam.html', 'bo‘lim 2.html'],
      }),
      'Fayl nomlarida bo‘sh joy va o‘zbekcha maxsus harflardan qoching — ular manzilda muammo tug‘diradi.',
    ),
  ]),
  basic: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Havola manzilini yozadigan atributni to‘ldiring.',
        '<a {{1}}="https://developer.mozilla.org">MDN</a>',
        ['href'],
      ),
      'Havola `<a>` tegi bilan yaratiladi, manzil esa `href` atributida yoziladi.',
    ),
    why(
      q(
        'q2',
        'Rasm ko‘rinmasa uning o‘rnida chiqadigan matn qaysi atributda yoziladi?',
        ['alt', 'src', 'title', 'width'],
        [0],
      ),
      '`src` — rasm manzili, `alt` — rasm o‘rnini bosadigan matn (ko‘rmaydigan foydalanuvchilar uchun ham).',
    ),
    why(
      tf('q3', '`<img>` elementining yopuvchi tegi yo‘q.', true),
      '`<img>` bo‘sh element: unda mazmun bo‘lmaydi, shuning uchun `</img>` yozilmaydi.',
    ),
    why(
      q(
        'q4',
        'Brauzerda dasturchi vositalarini (Inspect) qaysi tugma ochadi?',
        ['F12', 'F5', 'Ctrl + S', 'Esc'],
        [0],
      ),
      'F12 (yoki o‘ng tugma → Inspect) dasturchi vositalarini ochadi; Ctrl + U esa sahifaning asl kodini ko‘rsatadi.',
    ),
  ]),
  elements: lessonQuiz([
    why(
      q(
        'q1',
        'Qaysi yozuvda teglar to‘g‘ri yopilgan?',
        [
          '<p><strong>Muhim</strong> matn</p>',
          '<p><strong>Muhim</p> matn</strong>',
          '<p><strong>Muhim matn</p>',
          '<strong><p>Muhim</strong> matn</p>',
        ],
        [0],
      ),
      'Ichkaridagi element tashqaridagisidan oldin yopilishi kerak; teglar kesishib ketmasligi lozim.',
    ),
    why(
      sortInto('q2', 'Elementlarni guruhlarga ajrating.', {
        'Bo‘sh element (yopuvchi tegi yo‘q)': ['<br>', '<hr>', '<img>'],
        'Yopuvchi tegi bor': ['<p>', '<strong>', '<h1>'],
      }),
      '`<br>`, `<hr>`, `<img>`, `<meta>`, `<link>`, `<input>` — bo‘sh elementlar; ular mazmun saqlamaydi.',
    ),
    why(
      tf('q3', 'HTML teglari registrga sezgir: `<P>` va `<p>` turli teglar.', false),
      'Teglar registrga sezgir emas, lekin hamma joyda kichik harf bilan yozish qabul qilingan.',
    ),
    why(
      codeFill('q4', 'Paragrafning yopuvchi tegini yozing.', '<p>Bu paragraf.{{1}}', ['</p>']),
      'Yopuvchi teg nomidan oldin `/` belgisi turadi.',
    ),
  ]),

  // ---- 2. Matn bilan ishlash ---------------------------------------------------
  headings: lessonQuiz([
    why(
      q(
        'q1',
        'Sahifada odatda nechta `<h1>` bo‘ladi?',
        [
          'Bitta',
          'Ikkita',
          'Har bo‘limda bittadan',
          'Cheklanmagan, qancha ko‘p bo‘lsa shuncha yaxshi',
        ],
        [0],
      ),
      '`<h1>` sahifaning asosiy mavzusi; qidiruv tizimlari va ekran o‘qiydigan dasturlar uni shunday tushunadi.',
    ),
    why(
      order('q2', 'Sarlavha darajalarini eng muhimidan eng kichigiga tartiblang.', [
        '<h1>',
        '<h2>',
        '<h3>',
        '<h6>',
      ]),
      'Darajalar `<h1>` (eng muhim) dan `<h6>` (eng kichik) gacha.',
    ),
    why(
      tf('q3', 'Matnni kattalashtirish uchun sarlavha tegini ishlatish to‘g‘ri yo‘l.', false),
      'Sarlavha ma’no (tuzilma) beradi; o‘lchamni CSS bilan o‘zgartiring.',
    ),
    why(
      q(
        'q4',
        '`<h2>` dan keyingi kichik bo‘lim uchun qaysi teg to‘g‘ri?',
        ['<h3>', '<h4>', '<h1>', '<h5>'],
        [0],
      ),
      'Darajalarni sakratmang: `<h2>` dan keyin `<h3>` keladi.',
    ),
  ]),
  paragraphs: lessonQuiz([
    why(
      tf(
        'q1',
        'Kodda bir necha bo‘sh joy va yangi qator qoldirsangiz, brauzer ularni ham xuddi shunday ko‘rsatadi.',
        false,
      ),
      'Brauzer ketma-ket bo‘sh joy va qatorlarni bitta bo‘sh joyga aylantiradi (`<pre>` bundan mustasno).',
    ),
    why(
      match('q2', 'Tegni vazifasi bilan moslang.', [
        ['<br>', 'Paragraf ichida yangi qatorga o‘tish'],
        ['<pre>', 'Matnni bo‘sh joylari bilan aynan ko‘rsatish'],
        ['<hr>', 'Mavzu almashganini bildirish'],
        ['<p>', 'Matn bloki'],
      ]),
      'Manzil yoki she’r — `<br>`, kod yoki naqsh — `<pre>`, mavzu ajratish — `<hr>`.',
    ),
    why(
      q(
        'q3',
        'Paragraflar orasidagi bo‘sh joyni qanday kattalashtirish to‘g‘ri?',
        [
          'CSS bilan',
          'Bir nechta `<br>` qo‘yib',
          'Bo‘sh `<p></p>` qo‘yib',
          'Kodda bo‘sh qatorlar qoldirib',
        ],
        [0],
      ),
      '`<br>` va bo‘sh paragraflar bilan masofa qilish noto‘g‘ri; masofa — ko‘rinish, u CSS ishi.',
    ),
    why(
      codeFill(
        'q4',
        'Manzilni ikki qatorga bo‘ling.',
        '<p>Toshkent shahri,{{1}}Amir Temur ko‘chasi</p>',
        ['<br>'],
      ),
      '`<br>` paragraf ichida qatorni yangi qatorga o‘tkazadi.',
    ),
  ]),
  styles: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Matn rangini beradigan xususiyatni yozing.',
        '<p style="{{1}}: navy;">Matn</p>',
        ['color'],
      ),
      '`color` — matn rangi, `background-color` — fon rangi.',
    ),
    why(
      q(
        'q2',
        '`style` atributida bir nechta xususiyat qanday ajratiladi?',
        [
          'Nuqta-vergul (;) bilan',
          'Vergul (,) bilan',
          'Bo‘sh joy bilan',
          'Har biri alohida `style` atributida',
        ],
        [0],
      ),
      'Yozilishi: `style="color: white; text-align: center;"`.',
    ),
    why(
      match('q3', 'Xususiyatni vazifasi bilan moslang.', [
        ['background-color', 'Fon rangi'],
        ['font-family', 'Shrift'],
        ['font-size', 'Shrift o‘lchami'],
        ['text-align', 'Gorizontal tekislash'],
      ]),
      'Bu besh xususiyat (`color` bilan birga) eng ko‘p ishlatiladi.',
    ),
    why(
      tf(
        'q4',
        'Katta loyihada uslublarni alohida CSS faylga yozish `style` atributidan qulayroq.',
        true,
      ),
      'Har elementga alohida `style` yozish takrorlanadi; umumiy CSS fayl bitta joydan boshqariladi.',
    ),
  ]),
  formatting: lessonQuiz([
    why(
      q(
        'q1',
        'Matn **muhim** ekanini (faqat qalinligini emas) bildiradigan teg qaysi?',
        ['<strong>', '<b>', '<mark>', '<small>'],
        [0],
      ),
      '`<strong>` ma’no beradi — ekran o‘qiydigan dasturlar uni urg‘u bilan o‘qiydi; `<b>` faqat uslubiy qalinlik.',
    ),
    why(
      codeFill('q2', 'Suv formulasini to‘g‘ri yozing.', 'H{{1}}2{{2}}O', ['<sub>', '</sub>']),
      '`<sub>` — pastki indeks (H₂O), `<sup>` — yuqori indeks (x²).',
    ),
    why(
      match('q3', 'Tegni ma’nosi bilan moslang.', [
        ['<del>', 'O‘chirilgan matn'],
        ['<ins>', 'Qo‘shilgan matn'],
        ['<mark>', 'Marker bilan belgilangan'],
        ['<em>', 'Gapdagi urg‘u'],
      ]),
      'Eski va yangi narx uchun `<del>` va `<ins>` juda qulay.',
    ),
    why(
      tf(
        'q4',
        '`<i>` atama, chet so‘z yoki nom kabi boshqacha ohangdagi matn uchun ishlatiladi.',
        true,
      ),
      'Urg‘u uchun `<em>`, boshqacha ohangdagi matn (atama, nom) uchun `<i>`.',
    ),
  ]),
  quotations: lessonQuiz([
    why(
      match('q1', 'Tegni vazifasi bilan moslang.', [
        ['<blockquote>', 'Uzun iqtibos'],
        ['<q>', 'Gap ichidagi qisqa iqtibos'],
        ['<abbr>', 'Qisqartma'],
        ['<cite>', 'Asar nomi'],
      ]),
      '`<q>` uchun brauzer tirnoqlarni o‘zi qo‘yadi; `<blockquote>` odatda chetdan surib ko‘rsatiladi.',
    ),
    why(
      codeFill(
        'q2',
        'Qisqartmaning to‘liq nomi chiqishi uchun atributni yozing.',
        '<abbr {{1}}="Birlashgan Millatlar Tashkiloti">BMT</abbr>',
        ['title'],
      ),
      '`title` dagi matn sichqoncha ustiga kelganda chiqadi.',
    ),
    why(
      q(
        'q3',
        'Maqola muallifi bilan bog‘lanish ma’lumotlari qaysi tegda yoziladi?',
        ['<address>', '<cite>', '<footer>', '<contact>'],
        [0],
      ),
      '`<address>` — aloqa ma’lumoti; `<contact>` degan teg yo‘q.',
    ),
    why(
      tf('q4', '`<bdo dir="rtl">` matnni o‘ngdan chapga yo‘nalishda ko‘rsatadi.', true),
      '`<bdo>` matn yo‘nalishini majburan o‘zgartiradi.',
    ),
  ]),

  // ---- 3. Ranglar va CSS ---------------------------------------------------------
  colors: lessonQuiz([
    why(
      q('q1', '`rgb(255, 255, 255)` qaysi rang?', ['Oq', 'Qora', 'Qizil', 'Kulrang'], [0]),
      'Uchala qism eng katta (255) bo‘lsa — oq, hammasi 0 bo‘lsa — qora.',
    ),
    why(
      sortInto('q2', 'Rang yozuvlarini usuliga qarab ajrating.', {
        HEX: ['#0071dc', '#333'],
        RGB: ['rgb(0, 113, 220)', 'rgb(0 113 220 / 0.2)'],
        HSL: ['hsl(210, 100%, 43%)'],
      }),
      '`#` bilan — HEX, `rgb()` — qizil/yashil/ko‘k, `hsl()` — rang, to‘yinganlik, yorug‘lik.',
    ),
    why(
      tf('q3', '`#333` yozuvi `#333333` bilan bir xil rang.', true),
      'Qisqa HEX yozuvida har bir belgi ikki marta takrorlanadi.',
    ),
    why(
      q(
        'q4',
        'HSL’da bir rangning ochroq variantini olish uchun qaysi qiymat o‘zgartiriladi?',
        ['Yorug‘lik (Lightness)', 'Rang (Hue)', 'To‘yinganlik (Saturation)', 'Shaffoflik'],
        [0],
      ),
      'HSL qulayligi shunda: rangni saqlab, faqat oxirgi qiymatni (yorug‘likni) o‘zgartirasiz.',
    ),
  ]),

  // ---- 4. Havolalar va rasmlar -------------------------------------------------
  links: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Havola yangi tabda ochilishi uchun atribut qiymatini yozing.',
        '<a href="https://developer.mozilla.org" target="{{1}}" rel="noopener">MDN</a>',
        ['_blank'],
      ),
      '`_self` — shu oyna (standart), `_blank` — yangi tab; tashqi havolaga `rel="noopener"` qo‘shish yaxshi odat.',
    ),
    why(
      sortInto('q2', 'Manzillarni turiga ajrating.', {
        Mutlaq: ['https://www.gov.uz', 'https://kun.uz/news'],
        Nisbiy: ['haqida.html', 'kurslar/html.html'],
      }),
      'Mutlaq manzil to‘liq (protokol va domen bilan), nisbiy — shu saytning ichidagi yo‘l.',
    ),
    why(
      match('q3', 'Havola manzilini vazifasi bilan moslang.', [
        ['#aloqa', 'Sahifa ichidagi bo‘limga o‘tish'],
        ['mailto:info@example.uz', 'Email yozish'],
        ['tel:+998901234567', 'Qo‘ng‘iroq qilish'],
      ]),
      '`#id` sahifadagi `id` li elementga olib boradi.',
    ),
    why(
      q(
        'q4',
        'Qaysi havola matni eng yaxshi?',
        ['Narxlar ro‘yxatini ko‘rish', 'Bu yerni bosing', 'Havola', 'Batafsil…'],
        [0],
      ),
      'Havola matni qayerga olib borishini aytsin — bu ekran o‘qiydigan dasturlar va qidiruv tizimlari uchun muhim.',
    ),
  ]),
  images: lessonQuiz([
    why(
      q(
        'q1',
        'Qaysi `alt` matni eng yaxshi?',
        ['Samarqanddagi Registon maydoni kechqurun', 'rasm', 'IMG_2034.jpg', 'Bu yerda rasm bor'],
        [0],
      ),
      '`alt` rasmni ko‘ra olmaydigan odamga uning mazmunini aytib berishi kerak.',
    ),
    why(
      tf('q2', 'Faqat bezak uchun qo‘yilgan rasmga bo‘sh `alt=""` berish to‘g‘ri.', true),
      'Bo‘sh `alt` bo‘lsa, ekran o‘qiydigan dastur bezak rasmni o‘tkazib yuboradi.',
    ),
    why(
      match('q3', 'Formatni qo‘llanish holati bilan moslang.', [
        ['JPEG', 'Fotosuratlar'],
        ['PNG', 'Shaffof fonli rasm, skrinshot'],
        ['SVG', 'Logotip va ikonka — har o‘lchamda tiniq'],
        ['GIF', 'Oddiy animatsiyalar'],
      ]),
      'WebP va AVIF — zamonaviy formatlar, hajmi kichik.',
    ),
    why(
      codeFill(
        'q4',
        'Rasmga izoh qo‘shish uchun teglarni yozing.',
        '<figure>\n  <img src="buxoro.jpg" alt="Minorai Kalon">\n  <{{1}}>Minorai Kalon, XII asr</{{2}}>\n</figure>',
        ['figcaption', 'figcaption'],
      ),
      '`<figure>` rasmni, `<figcaption>` esa uning izohini o‘raydi.',
    ),
  ]),
  project: lessonQuiz([
    why(
      codeFill('q1', 'Tashqi CSS faylni ulang.', '<link rel="{{1}}" href="css/style.css">', [
        'stylesheet',
      ]),
      '`<link rel="stylesheet" href="…">` `<head>` ichida yoziladi.',
    ),
    why(
      order('q2', 'Shaxsiy sahifa ustida ishlash bosqichlarini tartiblang.', [
        'Hujjat tuzilmasi: DOCTYPE, html, head, body',
        'Sarlavha va qisqa tanishtiruv',
        'Qiziqishlar ro‘yxati va rasm',
        'Ko‘rinishni alohida CSS faylda bezash',
      ]),
      'Avval tuzilma (HTML), keyin mazmun, oxirida ko‘rinish (CSS).',
    ),
    why(
      q(
        'q3',
        'Tekshirish ro‘yxatidagi qaysi talab **noto‘g‘ri**?',
        [
          'Har bo‘limda alohida `<h1>` bo‘lsin',
          'Rasmda mazmunli `alt` bor',
          'CSS alohida faylda',
          '`<title>` sahifa mazmunini aks ettiradi',
        ],
        [0],
      ),
      'Sahifada bitta `<h1>` bo‘ladi; bo‘limlar `<h2>` bilan yoziladi.',
    ),
    why(
      tf(
        'q4',
        'Ko‘rinishni CSS faylga chiqarish sahifani kengaytirish va o‘zgartirishni osonlashtiradi.',
        true,
      ),
      'Tuzilma HTML’da, ko‘rinish CSS’da — ularni alohida o‘zgartirish mumkin.',
    ),
  ]),
  favicon: lessonQuiz([
    why(
      codeFill('q1', 'Faviconni ulang.', '<link rel="{{1}}" href="favicon.ico">', ['icon']),
      'Favicon `<head>` ichida `<link rel="icon">` bilan ulanadi.',
    ),
    why(
      q(
        'q2',
        'iPhone bosh ekraniga qo‘shilganda ishlatiladigan belgi qaysi `rel` bilan ulanadi?',
        ['apple-touch-icon', 'icon', 'mobile-icon', 'shortcut'],
        [0],
      ),
      'Odatda 180×180 pikselli PNG tayyorlanadi.',
    ),
    why(
      tf(
        'q3',
        'Favicon almashtirilgandan keyin ham eskisi ko‘rinsa, sababi brauzer keshi bo‘lishi mumkin.',
        true,
      ),
      'Ctrl + F5 sahifani keshsiz yangilaydi.',
    ),
    why(
      q(
        'q4',
        'Favicon uchun qaysi tavsiya to‘g‘ri?',
        [
          'Oddiy belgi yoki bosh harf',
          'Mayda detalli katta surat',
          'Uzun matnli logotip',
          'Animatsiyali video',
        ],
        [0],
      ),
      'Kichik o‘lchamda mayda detallar ko‘rinmaydi.',
    ),
  ]),

  // ---- 5. Jadvallar va ro‘yxatlar ----------------------------------------------
  tables: lessonQuiz([
    why(
      match('q1', 'Jadval tegini ma’nosi bilan moslang.', [
        ['<tr>', 'Satr'],
        ['<th>', 'Sarlavha katakchasi'],
        ['<td>', 'Oddiy katakcha'],
        ['<caption>', 'Jadval nomi'],
      ]),
      'Tuzilma: `<table>` → `<tr>` → `<th>`/`<td>`.',
    ),
    why(
      q(
        'q2',
        'Katakcha ikki **ustunni** egallashi uchun qaysi atribut kerak?',
        ['colspan="2"', 'rowspan="2"', 'span="2"', 'cols="2"'],
        [0],
      ),
      '`colspan` — ustunlar, `rowspan` — satrlar bo‘yicha birlashtiradi.',
    ),
    why(
      tf('q3', 'Sahifa maketini (joylashuvini) jadval bilan qurish tavsiya etiladi.', false),
      'Jadval faqat satr va ustunlardagi ma’lumot uchun; maket CSS bilan quriladi.',
    ),
    why(
      order('q4', 'Jadval qismlarini tartib bilan joylang.', [
        '<caption>',
        '<thead>',
        '<tbody>',
        '<tfoot>',
      ]),
      'Nom, sarlavha qismi, asosiy qism va yakun — shu tartibda.',
    ),
  ]),

  // ---- 6. Sahifa tuzilmasi ---------------------------------------------------
  'block-inline': lessonQuiz([
    why(
      sortInto('q1', 'Elementlarni standart turiga qarab ajrating.', {
        Blok: ['<div>', '<p>', '<ul>', '<section>'],
        'Satr ichidagi (inline)': ['<span>', '<a>', '<strong>', '<code>'],
      }),
      'Blok elementlar yangi qatordan boshlanib butun kenglikni egallaydi; inline elementlar matn oqimida qoladi.',
    ),
    why(
      tf('q2', 'Inline element faqat mazmuni kerak qilgan kenglikni egallaydi.', true),
      'Masalan, `<strong>` gap ichida faqat qalin so‘z kengligida bo‘ladi.',
    ),
    why(
      q(
        'q3',
        'Qaysi yozuv noto‘g‘ri HTML hisoblanadi?',
        [
          '<span><div>…</div></span>',
          '<div><span>…</span></div>',
          '<p><a href="#">…</a></p>',
          '<li><strong>…</strong></li>',
        ],
        [0],
      ),
      'Inline element ichiga blok element joylashtirilmaydi; `display` faqat ko‘rinishni o‘zgartiradi, qoidani emas.',
    ),
    why(
      codeFill('q4', 'Ro‘yxat elementlarini bir qatorga qo‘ying.', 'li {\n  display: {{1}};\n}', [
        'inline',
      ]),
      '`display: inline` blok elementni satr ichidagidek tutadi.',
    ),
  ]),
  div: lessonQuiz([
    why(
      tf('q1', '`<div>` o‘zi hech qanday ma’no bildirmaydi va ko‘rinishi yo‘q.', true),
      '`<div>` — universal guruhlovchi konteyner; kuchi CSS bilan ochiladi.',
    ),
    why(
      codeFill(
        'q2',
        'Ichki bloklarni yonma-yon qo‘ying.',
        '<div style="display: {{1}}; gap: 16px;">',
        ['flex'],
      ),
      'Flexbox (`display: flex`) — bloklarni yonma-yon joylashtirishning zamonaviy usuli; yana biri — Grid.',
    ),
    why(
      q(
        'q3',
        'Blokni sahifa markaziga qo‘yish uchun `max-width` bilan birga nima yoziladi?',
        ['margin: 0 auto;', 'text-align: center;', 'padding: auto;', 'align: middle;'],
        [0],
      ),
      '`margin: 0 auto` chap va o‘ng tashqi oraliqni teng qiladi.',
    ),
    why(
      q(
        'q4',
        'Sahifaning menyu qismi uchun qaysi teg eng to‘g‘ri?',
        ['<nav>', '<div>', '<span>', '<menu-div>'],
        [0],
      ),
      'Ma’noga ega qismlar uchun semantik teglar (`<header>`, `<nav>`, `<footer>`) afzal; `<div>` faqat guruhlash uchun.',
    ),
  ]),
  classes: lessonQuiz([
    why(
      codeFill(
        'q1',
        '`eslatma` klassiga CSS qoidasini yozing.',
        '{{1}}eslatma {\n  padding: 8px;\n}',
        ['.'],
      ),
      'CSS’da klass nomi oldiga nuqta qo‘yiladi: `.eslatma`.',
    ),
    why(
      q(
        'q2',
        'Bitta elementga ikkita klass qanday beriladi?',
        [
          'class="tugma tugma-asosiy"',
          'class="tugma, tugma-asosiy"',
          'class="tugma" class="tugma-asosiy"',
          'class="tugma+tugma-asosiy"',
        ],
        [0],
      ),
      'Klasslar bo‘sh joy bilan ajratiladi; umumiy uslub bir klassda, farqlar boshqasida.',
    ),
    why(
      q(
        'q3',
        'Qaysi klass nomi yaxshiroq?',
        ['.xato-xabari', '.qizil-matn', '.Katta_Qizil', '.a1'],
        [0],
      ),
      'Nom elementning vazifasini aytsin, ko‘rinishini emas — rang o‘zgarsa `.qizil-matn` yolg‘on bo‘lib qoladi.',
    ),
    why(
      tf('q4', 'Klass nomi registrga sezgir emas: `.Eslatma` va `.eslatma` bir xil.', false),
      'Klass nomlari registrga sezgir — ular boshqa-boshqa klasslar.',
    ),
  ]),
  id: lessonQuiz([
    why(
      match('q1', '`class` va `id` farqini moslang.', [
        ['class', 'Ko‘p elementda takrorlanadi, selektor `.nom`'],
        ['id', 'Sahifada yagona, selektor `#nom`'],
      ]),
      'Uslub uchun odatda `class` afzal, `id` — yagona element uchun.',
    ),
    why(
      codeFill(
        'q2',
        'Yorliqni maydon bilan bog‘lang.',
        '<label {{1}}="ism">Ismingiz</label>\n<input id="ism" type="text">',
        ['for'],
      ),
      '`label` ning `for` atributi `input` ning `id` siga mos keladi; yorliq bosilganda maydon faollashadi.',
    ),
    why(
      sortInto('q3', '`id` ning qaysi ishlatilishi to‘g‘ri?', {
        'To‘g‘ri': [
          'Sahifa ichidagi havola (#savollar)',
          'JavaScript’da getElementById',
          'Forma yorlig‘ini bog‘lash',
        ],
        'Noto‘g‘ri': ['Bir xil id ni bir nechta elementga berish', 'id ichida bo‘sh joy ishlatish'],
      }),
      'Bir sahifada bir `id` faqat bitta elementda bo‘ladi va bo‘sh joysiz yoziladi.',
    ),
    why(
      fill(
        'q4',
        'Boshqa sahifadagi bo‘limga havola.',
        '<a href="kurs.html{{1}}savollar">Savollar</a>',
        ['#'],
      ),
      '`kurs.html#savollar` — `kurs.html` sahifasining `id="savollar"` bo‘limi.',
    ),
  ]),
  buttons: lessonQuiz([
    why(
      match('q1', '`type` qiymatini vazifasi bilan moslang.', [
        ['button', 'Oddiy tugma, ishini JavaScript belgilaydi'],
        ['submit', 'Formani yuboradi'],
        ['reset', 'Forma maydonlarini tozalaydi'],
      ]),
      'Forma ichida `type` yozilmasa tugma `submit` bo‘ladi.',
    ),
    why(
      tf(
        'q2',
        'Forma ichidagi tugmaga `type` yozmasangiz, u kutilmaganda formani yuborib yuborishi mumkin.',
        true,
      ),
      'Standart qiymat `submit`; shuning uchun `type` ni har doim ko‘rsating.',
    ),
    why(
      q(
        'q3',
        'Boshqa sahifaga o‘tish uchun qaysi element to‘g‘ri?',
        ['<a href="…">', '<button>', '<button type="submit">', '<div onclick>'],
        [0],
      ),
      'Sahifaga o‘tish — havola, shu sahifadagi harakat — tugma. Klaviatura va ekran o‘qiydigan dasturlar shunga qarab ishlaydi.',
    ),
    why(
      codeFill(
        'q4',
        'Bosib bo‘lmaydigan tugma yasang.',
        '<button type="submit" {{1}}>Yuborish</button>',
        ['disabled'],
      ),
      '`disabled` atributli tugma faolsiz bo‘ladi.',
    ),
  ]),
  iframes: lessonQuiz([
    why(
      q(
        'q1',
        'Ekran o‘qiydigan dasturlar uchun iframe mazmunini qaysi atribut tavsiflaydi?',
        ['title', 'alt', 'name', 'src'],
        [0],
      ),
      '`title` ni iframe uchun majburiy deb hisoblang.',
    ),
    why(
      tf(
        'q2',
        'Bo‘sh `sandbox` atributi iframe ichidagi skriptlar, formalar va ochiladigan oynalarni taqiqlaydi.',
        true,
      ),
      'Kerakli imkoniyatlar alohida ruxsat etiladi: `sandbox="allow-scripts"`.',
    ),
    why(
      codeFill(
        'q3',
        'Iframe ekranga yaqinlashganda yuklansin.',
        '<iframe src="xarita.html" title="Xarita" loading="{{1}}"></iframe>',
        ['lazy'],
      ),
      '`loading="lazy"` sahifani tezroq ochadi.',
    ),
    why(
      q(
        'q4',
        'Havolani `name="ichki-oyna"` li iframe’da ochish uchun havolaga nima yoziladi?',
        ['target="ichki-oyna"', 'href="ichki-oyna"', 'frame="ichki-oyna"', 'rel="ichki-oyna"'],
        [0],
      ),
      'Havolaning `target` i iframe’ning `name` iga teng bo‘ladi.',
    ),
  ]),
  javascript: lessonQuiz([
    why(
      codeFill('q1', 'Tashqi skriptni ulang.', '<script {{1}}="js/app.js" defer></script>', [
        'src',
      ]),
      'Tashqi JavaScript fayl `<script src>` bilan ulanadi.',
    ),
    why(
      q(
        'q2',
        '`<head>` dagi skript sahifa to‘liq o‘qilgandan keyin ishlashi uchun qaysi atribut kerak?',
        ['defer', 'async-load', 'later', 'onload'],
        [0],
      ),
      'Yoki `<script>` ni `<body>` oxiriga qo‘ying; aks holda skript hali mavjud bo‘lmagan elementlarni topa olmaydi.',
    ),
    why(
      match('q3', 'Kodni vazifasi bilan moslang.', [
        ["document.getElementById('xabar')", 'Elementni id bo‘yicha topish'],
        ['.textContent = …', 'Element matnini o‘zgartirish'],
        ["console.log('…')", 'Konsolga chiqarish'],
        ['<noscript>', 'JavaScript o‘chiq bo‘lganda matn ko‘rsatish'],
      ]),
      'Muharrirdagi “Konsol” bo‘limida `console.log` natijalari va xatolar ko‘rinadi.',
    ),
    why(
      tf(
        'q4',
        'Skript elementlardan oldin ishlasa, `getElementById` ularni topa olmasligi mumkin.',
        true,
      ),
      'Brauzer HTML’ni yuqoridan pastga o‘qiydi.',
    ),
  ]),
  'file-paths': lessonQuiz([
    why(
      q(
        'q1',
        '`blog/birinchi-post.html` dan `images/logo.png` ga to‘g‘ri yo‘l qaysi?',
        ['../images/logo.png', 'images/logo.png', './logo.png', 'images\\logo.png'],
        [0],
      ),
      '`../` bitta yuqori papkaga chiqaradi, keyin `images` papkasiga kiriladi.',
    ),
    why(
      match('q2', 'Yo‘lni ma’nosi bilan moslang.', [
        ['logo.png', 'Shu papkadagi fayl'],
        ['../logo.png', 'Bitta yuqori papkadagi fayl'],
        ['/images/logo.png', 'Sayt ildizidan hisoblangan yo‘l'],
        ['https://example.uz/logo.png', 'Boshqa saytdagi resurs (mutlaq URL)'],
      ]),
      'Sayt ichidagi fayllar uchun nisbiy yo‘llar afzal: sayt ko‘chirilganda havolalar buzilmaydi.',
    ),
    why(
      tf('q3', 'Serverda `Logo.png` va `logo.png` bir xil fayl deb hisoblanadi.', false),
      'Serverlarda fayl nomlari registrga sezgir bo‘ladi.',
    ),
    why(
      q(
        'q4',
        'Yo‘lda qaysi ajratuvchi ishlatiladi?',
        ['/ (oddiy chiziq)', '\\ (teskari chiziq)', ': (ikki nuqta)', '| (vertikal chiziq)'],
        [0],
      ),
      'Veb-manzillarda har doim `/`; Windows uslubidagi `\\` ishlamaydi.',
    ),
  ]),

  // ---- 7. Maket va semantika ---------------------------------------------------
  layout: lessonQuiz([
    why(
      match('q1', 'Maket tegini vazifasi bilan moslang.', [
        ['<header>', 'Yuqori qism: logo, sarlavha'],
        ['<nav>', 'Asosiy navigatsiya havolalari'],
        ['<main>', 'Sahifaning asosiy, yagona mazmuni'],
        ['<aside>', 'Yon ma’lumot, bog‘liq havolalar'],
        ['<footer>', 'Pastki qism: mualliflik huquqi, aloqa'],
      ]),
      'HTML5 maket teglari sahifa qismlarining ma’nosini bildiradi.',
    ),
    why(
      tf('q2', 'Sahifada bir nechta `<main>` bo‘lishi mumkin.', false),
      '`<main>` sahifaning asosiy mazmuni — u bitta bo‘ladi.',
    ),
    why(
      q(
        'q3',
        'Bugun maketni qurishning tavsiya etilgan usuli qaysi?',
        ['Flexbox yoki Grid', 'Jadval bilan', 'float bilan', '<br> va bo‘sh joylar bilan'],
        [0],
      ),
      'Teglar tuzilmani beradi, ustunlar esa Flexbox (bir yo‘nalish) yoki Grid (ikki o‘lchov) bilan quriladi.',
    ),
    why(
      order('q4', 'Odatiy sahifa qismlarini yuqoridan pastga tartiblang.', [
        '<header>',
        '<main>',
        '<footer>',
      ]),
      'Yuqori qism, asosiy mazmun (yon paneli bilan), pastki qism.',
    ),
  ]),
  responsive: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Viewport meta tegini to‘ldiring.',
        '<meta name="viewport" content="width={{1}}, initial-scale=1">',
        ['device-width'],
      ),
      'Busiz telefon sahifani 980 pikselli kompyuter sahifasi deb chizib kichraytiradi.',
    ),
    why(
      q(
        'q2',
        'Rasm konteynerdan kengroq bo‘lmasligi uchun qaysi qoida yoziladi?',
        ['max-width: 100%; height: auto;', 'width: 980px;', 'height: 100%;', 'display: inline;'],
        [0],
      ),
      'Rasm konteynerga sig‘adi va proporsiyasini saqlaydi.',
    ),
    why(
      tf(
        'q3',
        '“Avval mobil” usulida kichik ekran uchun uslub yoziladi, katta ekranlar `min-width` bilan qo‘shiladi.',
        true,
      ),
      'Mobile-first: asosiy uslub telefon uchun, `@media (min-width: …)` — kattaroq ekranlar uchun.',
    ),
    why(
      codeFill(
        'q4',
        'Ekran 600 pikseldan tor bo‘lganda ishlaydigan qoidani yozing.',
        '@media ({{1}}: 600px) {\n  .ustunlar { flex-direction: column; }\n}',
        ['max-width'],
      ),
      '`max-width` — “shu kenglikgacha”, `min-width` — “shu kenglikdan boshlab”.',
    ),
  ]),
  computercode: lessonQuiz([
    why(
      match('q1', 'Tegni vazifasi bilan moslang.', [
        ['<code>', 'Kod bo‘lagi'],
        ['<kbd>', 'Klaviatura tugmasi'],
        ['<samp>', 'Dastur natijasi'],
        ['<var>', 'O‘zgaruvchi'],
      ]),
      'Brauzer ularni odatda bir xil kenglikdagi (monospace) shriftda ko‘rsatadi.',
    ),
    why(
      q(
        'q2',
        'Bir necha qatorli kod bloki qanday yoziladi?',
        [
          '<pre><code>…</code></pre>',
          '<code><br>…</code>',
          '<p><kbd>…</kbd></p>',
          '<samp>…</samp>',
        ],
        [0],
      ),
      '`<pre>` bo‘sh joy va qatorlarni saqlaydi, `<code>` esa uning kod ekanini bildiradi.',
    ),
    why(
      codeFill(
        'q3',
        'Kod ichida `<h1>` tegini matn sifatida yozing.',
        '<code>{{1}}h1{{2}}</code>',
        ['&lt;', '&gt;'],
      ),
      'Aks holda brauzer `<h1>` ni haqiqiy teg deb o‘qiydi.',
    ),
    why(
      tf(
        'q4',
        '“Ctrl + S ni bosing” jumlasidagi tugmalarni `<kbd>` bilan belgilash to‘g‘ri.',
        true,
      ),
      '`<kbd>Ctrl</kbd> + <kbd>S</kbd>` — klaviatura kiritishi.',
    ),
  ]),
  semantics: lessonQuiz([
    why(
      sortInto('q1', 'Teglarni ajrating.', {
        Semantik: ['<nav>', '<article>', '<footer>', '<time>'],
        'Ma’nosiz konteyner': ['<div>', '<span>'],
      }),
      'Semantik element nomining o‘zi mazmunini bildiradi.',
    ),
    why(
      q(
        'q2',
        'Blog post yoki yangilik kabi o‘zi alohida tura oladigan mazmun uchun qaysi teg?',
        ['<article>', '<section>', '<aside>', '<div>'],
        [0],
      ),
      '`<section>` — kattaroq butunning mavzuli qismi (“Narxlar”, “Savollar”).',
    ),
    why(
      codeFill(
        'q3',
        'JavaScript’siz ochiladigan blok yasang.',
        '<details>\n  <{{1}}>Kurs qancha davom etadi?</{{2}}>\n  <p>O‘rtacha 6 hafta.</p>\n</details>',
        ['summary', 'summary'],
      ),
      '`<details>` va `<summary>` — ochiladigan-yopiladigan blok.',
    ),
    why(
      q(
        'q4',
        'Semantik teglarning foydasi qaysi? (bir nechta javob)',
        [
          'Ekran o‘qiydigan dasturlar qismlarga sakrab o‘tadi',
          'Qidiruv tizimlari mazmunni aniqroq tushunadi',
          'Kod o‘qiluvchan bo‘ladi',
          'Sahifa avtomatik ravishda rangli bo‘ladi',
        ],
        [0, 1, 2],
      ),
      'Semantika ko‘rinishni o‘zgartirmaydi — u ma’no beradi.',
    ),
  ]),

  // ---- 8. Belgilar va kodlash ---------------------------------------------------
  entities: lessonQuiz([
    why(
      match('q1', 'Belgini uning entity’si bilan moslang.', [
        ['<', '&lt;'],
        ['>', '&gt;'],
        ['&', '&amp;'],
        ['©', '&copy;'],
      ]),
      'Bu belgilar HTML’da band yoki klaviaturada yo‘q.',
    ),
    why(
      q(
        'q2',
        '“10 km” ikki qatorga bo‘linib ketmasligi uchun nima ishlatiladi?',
        ['&nbsp;', '&amp;', '<br>', '&space;'],
        [0],
      ),
      '`&nbsp;` — uzilmaydigan bo‘sh joy: raqam va birlik orasida qulay.',
    ),
    why(
      tf('q3', 'UTF-8 sahifada o‘, g‘, é kabi harflarni ham entity bilan yozish shart.', false),
      'UTF-8 bilan ular to‘g‘ridan-to‘g‘ri yoziladi; entity faqat maxsus va klaviaturada yo‘q belgilar uchun.',
    ),
    why(
      fill(
        'q4',
        'Bo‘sh joyni to‘ldiring.',
        'Entity har doim & belgisi bilan boshlanib, {{1}} belgisi bilan tugaydi.',
        [[';', 'nuqta-vergul']],
      ),
      'Masalan: `&lt;`, `&#60;`, `&#x3C;`.',
    ),
  ]),
  symbols: lessonQuiz([
    why(
      match('q1', 'Entity’ni belgisi bilan moslang.', [
        ['&ne;', '≠'],
        ['&le;', '≤'],
        ['&infin;', '∞'],
        ['&pi;', 'π'],
        ['&rarr;', '→'],
      ]),
      'Matematik belgilar, yunon harflari va strelkalar uchun tayyor nomlar bor.',
    ),
    why(
      fill('q2', 'Haroratni yozing.', 'Bugun +25{{1}}C', [['&deg;', '°']]),
      '`&deg;` — daraja belgisi.',
    ),
    why(
      tf('q3', 'O‘zbek so‘mining alohida Unicode belgisi bor.', false),
      'Alohida belgi yo‘q, shuning uchun odatda “so‘m” deb yoziladi.',
    ),
    why(
      q(
        'q4',
        'Belgini nom o‘rniga raqamli kod bilan yozish mumkinmi?',
        [
          'Ha, masalan `&#960;` (π)',
          'Yo‘q, faqat nom bilan',
          'Faqat emoji uchun',
          'Faqat CSS ichida',
        ],
        [0],
      ),
      'Har bir belgi nom (`&pi;`) yoki kod (`&#960;`) bilan yoziladi.',
    ),
  ]),
  emojis: lessonQuiz([
    why(
      tf('q1', 'Emoji — bu rasm fayli.', false),
      'Emoji Unicode belgisi: u matn kabi yoziladi, nusxalanadi va `font-size` bilan kattalashadi.',
    ),
    why(
      q(
        'q2',
        'Emoji o‘lchami qanday kattalashtiriladi?',
        ['font-size bilan', 'width atributi bilan', 'zoom tegi bilan', 'Kattalashtirib bo‘lmaydi'],
        [0],
      ),
      'Emoji matn bo‘lgani uchun shrift o‘lchamiga bo‘ysunadi.',
    ),
    why(
      q(
        'q3',
        'Qaysi yozuv qulaylik (accessibility) uchun yaxshiroq?',
        ['✅ Bajarildi', '✅', '✅✅✅', '👍🎉✅🔥'],
        [0],
      ),
      'Muhim ma’lumotni faqat emoji bilan bermang — ekran o‘qiydigan dastur uni so‘z bilan o‘qiydi.',
    ),
    why(
      codeFill(
        'q4',
        'Bezak emoji’sini ekran o‘qiydigan dasturdan yashiring.',
        '<span aria-hidden="{{1}}">🎉</span> Tabriklaymiz!',
        ['true'],
      ),
      '`aria-hidden="true"` elementni yordamchi texnologiyalardan yashiradi.',
    ),
  ]),
  charsets: lessonQuiz([
    why(
      q(
        'q1',
        'Bugun vebda eng ko‘p ishlatiladigan kodirovka qaysi?',
        ['UTF-8', 'ASCII', 'Windows-1251', 'ISO-8859-1'],
        [0],
      ),
      'Sahifalarning 98 foizdan ortig‘i UTF-8 da; u deyarli barcha yozuvlar va emoji’ni qo‘llaydi.',
    ),
    why(
      tf('q2', '`<meta charset="utf-8">` `<head>` ning boshida bo‘lishi kerak.', true),
      'U birinchi 1024 bayt ichida bo‘lishi kerak.',
    ),
    why(
      match('q3', 'Kodirovkani tavsifi bilan moslang.', [
        ['ASCII', '128 belgi: lotin harflari va raqamlar'],
        ['Windows-1251', 'Kirill uchun eski standart'],
        ['UTF-8', 'Deyarli barcha yozuvlar va emoji'],
      ]),
      'Eski kodirovkalar bitta tilga moslangan; UTF-8 hammasini birlashtiradi.',
    ),
    why(
      q(
        'q4',
        'Brauzer kodirovkani noto‘g‘ri tushunsa nima bo‘ladi?',
        [
          'Harflar tushunarsiz belgilarga aylanadi',
          'Sahifa ochilmaydi',
          'Rasmlar yo‘qoladi',
          'Hech narsa o‘zgarmaydi',
        ],
        [0],
      ),
      'Matn “krakozyabra”ga aylanadi — shuning uchun kodirovka e’lon qilinadi va fayl UTF-8 da saqlanadi.',
    ),
  ]),
  'url-encode': lessonQuiz([
    why(
      order('q1', 'URL qismlarini tartib bilan joylang.', [
        'https',
        'www.example.uz',
        '/kurslar/html.html',
        '?dars=3',
        '#mashq',
      ]),
      'Sxema, domen, yo‘l, so‘rov (`?`) va fragment (`#`).',
    ),
    why(
      fill('q2', 'URL’da bo‘sh joy qanday kodlanadi?', 'qidiruv{{1}}natijalari', ['%20']),
      'Ruxsat etilmagan belgilar `%` va ikki o‘n oltilik raqam bilan yoziladi; formalarda bo‘sh joy `+` bo‘lishi ham mumkin.',
    ),
    why(
      q(
        'q3',
        'JavaScript’da matnni URL uchun kodlaydigan funksiya qaysi?',
        ['encodeURIComponent', 'decodeURIComponent', 'escapeHTML', 'toURL'],
        [0],
      ),
      '`decodeURIComponent` esa teskarisini bajaradi.',
    ),
    why(
      tf('q4', 'Formadan yuborilgan ma’lumotni brauzer avtomatik kodlaydi.', true),
      'Shuning uchun ko‘p hollarda qo‘lda kodlash shart emas; lekin havolada bo‘sh joyli fayl nomlaridan qoching.',
    ),
  ]),

  // ---- 9. Formalar --------------------------------------------------------------
  forms: lessonQuiz([
    why(
      tf('q1', '`name` atributi bo‘lmagan maydon serverga yuborilmaydi.', true),
      'Ma’lumot `name=qiymat` juftliklari ko‘rinishida yuboriladi.',
    ),
    why(
      codeFill(
        'q2',
        'Yorliqni maydon bilan bog‘lang.',
        '<label for="email">Email</label>\n<input type="email" {{1}}="email" name="email">',
        ['id'],
      ),
      '`label for` va `input id` bir xil bo‘lsa, yorliq bosilganda maydon faollashadi va ekran o‘qiydigan dastur maydon nomini aytadi.',
    ),
    why(
      q(
        'q3',
        'Bir guruhdagi `radio` tugmalaridan faqat bittasini tanlash uchun nima bir xil bo‘lishi kerak?',
        ['name', 'id', 'value', 'class'],
        [0],
      ),
      '`id` lar har xil bo‘ladi, `name` esa guruh uchun bitta.',
    ),
    why(
      order('q4', 'Forma yuborilganda nima sodir bo‘lishini tartiblang.', [
        'Foydalanuvchi maydonlarni to‘ldiradi',
        'Yuborish tugmasi bosiladi',
        'Brauzer ma’lumotni `action` manziliga jo‘natadi',
        'Server dasturi ma’lumotni qayta ishlaydi',
      ]),
      'HTML faqat formaning “yuzi”; ma’lumotni server tomonidagi dastur qabul qiladi.',
    ),
  ]),
  'form-attributes': lessonQuiz([
    why(
      sortInto('q1', 'Qaysi holatda qaysi usul to‘g‘ri?', {
        get: ['Qidiruv', 'Mahsulotlar filtri'],
        post: ['Ro‘yxatdan o‘tish', 'Parol yuborish', 'Fayl yuklash'],
      }),
      '`get` ma’lumotni URL’ga qo‘shadi (xatcho‘pga saqlasa bo‘ladi); maxfiy yoki katta ma’lumot uchun `post`.',
    ),
    why(
      tf('q2', 'Parolni `get` bilan yuborish xavfsiz.', false),
      'U brauzer tarixida va server loglarida qolib ketadi.',
    ),
    why(
      codeFill(
        'q3',
        'Fayl yuklaydigan formani to‘ldiring.',
        '<form action="/yuklash" method="post" enctype="{{1}}">',
        ['multipart/form-data'],
      ),
      'Fayl yuborish uchun `post` va `multipart/form-data` kodlashi kerak.',
    ),
    why(
      match('q4', 'Atributni vazifasi bilan moslang.', [
        ['action', 'Ma’lumot yuboriladigan manzil'],
        ['method', 'Yuborish usuli'],
        ['novalidate', 'Brauzer tekshiruvini o‘chirish'],
        ['autocomplete', 'Avval kiritilgan qiymatlarni taklif qilish'],
      ]),
      '`target` esa natija qayerda ochilishini belgilaydi.',
    ),
  ]),
  'form-elements': lessonQuiz([
    why(
      match('q1', 'Elementni vazifasi bilan moslang.', [
        ['<select>', 'Ochiladigan ro‘yxat'],
        ['<textarea>', 'Ko‘p qatorli matn'],
        ['<fieldset>', 'Bog‘liq maydonlarni guruhlash'],
        ['<datalist>', 'Erkin yozishga ruxsat beruvchi takliflar'],
        ['<output>', 'Hisoblash natijasi'],
      ]),
      '`<legend>` `<fieldset>` guruhining nomi bo‘ladi.',
    ),
    why(
      codeFill(
        'q2',
        '“Samarqand” standart tanlangan bo‘lsin.',
        '<option value="samarqand" {{1}}>Samarqand</option>',
        ['selected'],
      ),
      '`selected` — standart tanlangan variant; `multiple` esa bir nechtasini tanlashga ruxsat beradi.',
    ),
    why(
      q(
        'q3',
        '`<select>` variantlarini “Frontend”, “Dizayn” kabi guruhlarga qaysi teg ajratadi?',
        ['<optgroup label="…">', '<fieldset>', '<legend>', '<group>'],
        [0],
      ),
      '`<optgroup>` ro‘yxat ichidagi variantlarni guruhlaydi.',
    ),
    why(
      tf('q4', '`<option>` ning `value` qiymati serverga yuboriladi.', true),
      'Ko‘rinadigan matn foydalanuvchi uchun, `value` — server uchun.',
    ),
  ]),
  'input-types': lessonQuiz([
    why(
      match('q1', 'Vazifaga mos `type` ni tanlang.', [
        ['Telefon raqami (raqamli klaviatura)', 'tel'],
        ['Yashirin matn', 'password'],
        ['Surgich', 'range'],
        ['Rang tanlash', 'color'],
        ['Tug‘ilgan sana', 'date'],
      ]),
      'To‘g‘ri tur telefonda mos klaviatura va avtomatik tekshiruv beradi.',
    ),
    why(
      tf('q2', '`type="email"` brauzer tekshiruvi serverdagi tekshiruv o‘rnini bosadi.', false),
      'Brauzer tekshiruvi faqat qulaylik uchun — uni chetlab o‘tish oson; haqiqiy tekshiruv serverda.',
    ),
    why(
      codeFill('q3', 'Faqat rasm tanlansin.', '<input type="file" name="rasm" {{1}}="image/*">', [
        'accept',
      ]),
      '`accept` tanlanadigan fayl turlarini cheklaydi.',
    ),
    why(
      q(
        'q4',
        'Foydalanuvchi ko‘rmaydigan, lekin yuboriladigan maydon turi qaysi?',
        ['hidden', 'password', 'search', 'reset'],
        [0],
      ),
      '`type="hidden"` — ko‘rinmas maydon.',
    ),
  ]),
  'input-attributes': lessonQuiz([
    why(
      tf('q1', '`placeholder` `<label>` o‘rnini bosa oladi.', false),
      '`placeholder` yozish boshlanganda yo‘qoladi va yuborilmaydi; yorliq har doim kerak.',
    ),
    why(
      match('q2', '`readonly` va `disabled` farqini moslang.', [
        ['readonly', 'O‘zgartirib bo‘lmaydi, lekin yuboriladi'],
        ['disabled', 'O‘zgartirib bo‘lmaydi va yuborilmaydi'],
      ]),
      '`readonly` maydon fokus oladi, `disabled` esa olmaydi.',
    ),
    why(
      codeFill('q3', 'Maydon bo‘sh qolmasin.', '<input type="email" name="email" {{1}}>', [
        'required',
      ]),
      'Bo‘sh bo‘lsa brauzer formani yubormaydi va ogohlantiradi.',
    ),
    why(
      q(
        'q4',
        'Qiymat 9 ta raqamdan iborat bo‘lishini qaysi atribut tekshiradi?',
        ['pattern="[0-9]{9}"', 'maxlength="9"', 'size="9"', 'min="9"'],
        [0],
      ),
      '`pattern` qiymatni muntazam ifodaga solishtiradi; `maxlength` faqat uzunlikni cheklaydi.',
    ),
  ]),

  // ---- 10. Grafika ---------------------------------------------------------------
  canvas: lessonQuiz([
    why(
      codeFill('q1', '2D chizish kontekstini oling.', "const ctx = mato.getContext('{{1}}');", [
        '2d',
      ]),
      '`ctx` — “mo‘yqalam”: barcha chizish buyruqlari u orqali beriladi.',
    ),
    why(
      match('q2', 'Buyruqni natijasi bilan moslang.', [
        ['fillRect', 'To‘ldirilgan to‘rtburchak'],
        ['strokeRect', 'Faqat chegarali to‘rtburchak'],
        ['arc', 'Aylana yoki yoy'],
        ['fillText', 'Matn'],
      ]),
      'Chiziq uchun `beginPath`, `moveTo`, `lineTo` va `stroke`.',
    ),
    why(
      q(
        'q3',
        'Canvas koordinatalari qayerdan boshlanadi?',
        ['Chap yuqori burchakdan', 'Markazdan', 'Chap pastki burchakdan', 'O‘ng yuqori burchakdan'],
        [0],
      ),
      '`x` o‘ngga, `y` pastga qarab oshadi.',
    ),
    why(
      tf('q4', 'Canvas’dagi chizmani ekran o‘qiydigan dasturlar ko‘ra oladi.', false),
      'Muhim ma’lumotni (masalan, diagramma qiymatlarini) matn yoki jadval sifatida ham bering.',
    ),
  ]),

  // ---- 11. Media ------------------------------------------------------------------
  media: lessonQuiz([
    why(
      sortInto('q1', 'Formatlarni turiga ajrating.', {
        Video: ['MP4', 'WebM'],
        Audio: ['MP3', 'AAC', 'WAV'],
      }),
      'Video uchun MP4, audio uchun MP3 deyarli barcha qurilmalarda ishlaydi; Ogg ham audio, ham video bo‘lishi mumkin.',
    ),
    why(
      match('q2', 'Faylni MIME turi bilan moslang.', [
        ['.mp4', 'video/mp4'],
        ['.mp3', 'audio/mpeg'],
        ['.webm', 'video/webm'],
        ['.wav', 'audio/wav'],
      ]),
      'MIME turi `type` atributida yozilib, brauzerga fayl turini aniq aytadi.',
    ),
    why(
      tf('q3', 'HTML5’da video ko‘rsatish uchun brauzerga plagin o‘rnatish kerak.', false),
      '`<video>` va `<audio>` plaginsiz ishlaydi.',
    ),
    why(
      q(
        'q4',
        'Media bilan ishlashda qaysi tavsiyalar to‘g‘ri? (bir nechta javob)',
        [
          'Videoga subtitr qo‘shish',
          'Media fayllarni siqib, mos o‘lchamda tayyorlash',
          'Ovozni sahifa ochilishi bilan avtomatik boshlash',
          'Iloji boricha eng katta WAV fayllarni ishlatish',
        ],
        [0, 1],
      ),
      'Avtomatik ovoz foydalanuvchini bezovta qiladi; katta fayllar sahifani sekinlashtiradi.',
    ),
  ]),
  video: lessonQuiz([
    why(
      codeFill('q1', 'Pleer tugmalari ko‘rinsin.', '<video {{1}} width="640" height="360">', [
        'controls',
      ]),
      '`controls` ijro, pauza, ovoz va to‘liq ekran tugmalarini ko‘rsatadi.',
    ),
    why(
      q(
        'q2',
        '`autoplay` ishlashi uchun brauzerlar odatda yana qaysi atributni talab qiladi?',
        ['muted', 'loop', 'poster', 'preload'],
        [0],
      ),
      'Brauzerlar ovozli videoni avtomatik boshlashga ruxsat bermaydi.',
    ),
    why(
      match('q3', 'Atributni vazifasi bilan moslang.', [
        ['poster', 'Video boshlanguncha ko‘rsatiladigan rasm'],
        ['loop', 'Tugagach qaytadan boshlash'],
        ['playsinline', 'Telefonda to‘liq ekranga o‘tmasdan o‘ynash'],
        ['preload', 'Oldindan nimani yuklash'],
      ]),
      'Bir nechta `<source>` bo‘lsa, brauzer birinchi tushunganini tanlaydi.',
    ),
    why(
      fill(
        'q4',
        'Bo‘sh joyni to‘ldiring.',
        'Subtitrlar <{{1}}> elementi bilan qo‘shiladi va .vtt formatida bo‘ladi.',
        ['track'],
      ),
      '`<track>` — WebVTT subtitr fayli.',
    ),
  ]),
  audio: lessonQuiz([
    why(
      tf('q1', '`controls` atributi bo‘lmasa, audio pleer sahifada ko‘rinmaydi.', true),
      'Pleer faqat `controls` bilan ko‘rinadi.',
    ),
    why(
      codeFill(
        'q2',
        'MP3 manbaning MIME turini yozing.',
        '<audio controls>\n  <source src="podkast.mp3" type="{{1}}">\n</audio>',
        ['audio/mpeg'],
      ),
      'MP3 fayllar uchun MIME turi `audio/mpeg`.',
    ),
    why(
      q(
        'q3',
        'Podkast uchun qulaylik bo‘yicha nima qo‘shish kerak?',
        [
          'Matnli variant (transkript)',
          'Avtomatik ijro',
          'loop atributi',
          'Faqat yuklab olish havolasi',
        ],
        [0],
      ),
      'Nutqli audio uchun transkript eshitish imkoniyati cheklanganlar va qidiruv uchun foydali.',
    ),
    why(
      tf('q4', 'Ovozni sahifa ochilishi bilan avtomatik boshlash yaxshi amaliyot.', false),
      'Bu bezovta qiladi va ko‘p brauzerlar uni bloklaydi.',
    ),
  ]),
  plugins: lessonQuiz([
    why(
      q(
        'q1',
        'Nega brauzerlar plaginlarni (Flash, Java) qo‘llab-quvvatlashni to‘xtatdi? (bir nechta javob)',
        [
          'Xavfsizlik teshiklari ko‘p edi',
          'Telefonlarda deyarli ishlamasdi',
          'Har foydalanuvchi alohida o‘rnatishi kerak edi',
          'Ular juda yangi texnologiya edi',
        ],
        [0, 1, 2],
      ),
      'Flash 2020-yil oxirida butunlay yopildi; o‘rnini HTML5 elementlari egalladi.',
    ),
    why(
      match('q2', 'Vazifaga bugungi tavsiyani moslang.', [
        ['Video', '<video>'],
        ['Boshqa sahifa yoki vidjet', '<iframe>'],
        ['Grafika', 'SVG yoki <canvas>'],
        ['PDF', 'Havola yoki <object>'],
      ]),
      'Yangi loyihada `<embed>` deyarli kerak bo‘lmaydi.',
    ),
    why(
      tf(
        'q3',
        '`<object>` teglari orasidagi kontent resurs ochilmasa ko‘rsatiladigan zaxira bo‘ladi.',
        true,
      ),
      '`<embed>` da esa zaxira kontent yo‘q.',
    ),
    why(
      fill('q4', 'Bo‘sh joyni to‘ldiring.', 'Flash plagini {{1}}-yil oxirida butunlay yopildi.', [
        '2020',
      ]),
      'Bugun uning o‘rnini `<video>`, `<audio>`, `<canvas>` va SVG egallagan.',
    ),
  ]),

  // ---- 12. Web API ----------------------------------------------------------------
  'web-apis': lessonQuiz([
    why(
      match('q1', 'API’ni vazifasi bilan moslang.', [
        ['DOM', 'Sahifa elementlarini topish va o‘zgartirish'],
        ['Web Storage', 'Brauzerda ma’lumot saqlash'],
        ['Fetch', 'Serverdan ma’lumot olish'],
        ['Web Workers', 'Og‘ir hisobni fonda bajarish'],
      ]),
      'Brauzer JavaScript’ga ko‘plab imkoniyatlarni API ko‘rinishida beradi.',
    ),
    why(
      tf('q2', 'Tashqi xizmatning API kalitini brauzer kodiga yozish xavfsiz.', false),
      'Sahifa kodini istalgan foydalanuvchi ko‘ra oladi — kalitlar faqat serverda saqlanadi.',
    ),
    why(
      q(
        'q3',
        'Joylashuv, kamera, mikrofon kabi API’lar ishlatilishidan oldin brauzer nima qiladi?',
        [
          'Foydalanuvchidan ruxsat so‘raydi',
          'Sahifani qayta yuklaydi',
          'Hech narsa qilmaydi',
          'Serverga xabar beradi',
        ],
        [0],
      ),
      'Ular shaxsiy ma’lumotga tegadi va faqat xavfsiz (https) sahifalarda ishlaydi.',
    ),
    why(
      fill(
        'q4',
        'Bo‘sh joyni to‘ldiring.',
        'Restorandagi ofitsiant kabi, API — tayyor imkoniyatlardan foydalanish uchun {{1}}.',
        [['interfeys', 'vositachi']],
      ),
      'API (Application Programming Interface) — dasturlar bir-birining imkoniyatlaridan foydalanadigan interfeys.',
    ),
  ]),
  geolocation: lessonQuiz([
    why(
      codeFill('q1', 'Joylashuvni bir marta oling.', 'navigator.geolocation.{{1}}(ok, xato);', [
        'getCurrentPosition',
      ]),
      '`watchPosition()` esa joylashuvni kuzatadi, `clearWatch()` to‘xtatadi.',
    ),
    why(
      match('q2', 'Xato kodini ma’nosi bilan moslang.', [
        ['1', 'Foydalanuvchi ruxsat bermadi'],
        ['2', 'Joylashuvni aniqlab bo‘lmadi'],
        ['3', 'Vaqt tugadi'],
      ]),
      'Ruxsat berilmasa ham sahifa ishlashi kerak (masalan, shaharni qo‘lda tanlash).',
    ),
    why(
      q(
        'q3',
        'Joylashuv ruxsatini qachon so‘rash to‘g‘ri?',
        [
          'Foydalanuvchi tegishli tugmani bosganda',
          'Sahifa ochilishi bilan darhol',
          'Har 5 soniyada',
          'Hech qachon — ruxsatsiz olish mumkin',
        ],
        [0],
      ),
      'Avval nima uchun kerakligini tushuntiring va harakat paytida so‘rang.',
    ),
    why(
      tf('q4', 'Geolocation API faqat `https://` yoki `localhost` da ishlaydi.', true),
      'Shaxsiy ma’lumot API’lari xavfsiz kontekst talab qiladi.',
    ),
  ]),
  'web-storage': lessonQuiz([
    why(
      match('q1', 'Obyektni saqlanish muddati bilan moslang.', [
        ['localStorage', 'O‘chirilmaguncha (brauzer yopilsa ham)'],
        ['sessionStorage', 'Faqat shu tab yopilguncha'],
      ]),
      'Hajmi odatda sayt uchun taxminan 5 MB.',
    ),
    why(
      codeFill('q2', 'Obyektni saqlang.', "localStorage.setItem('sozlama', JSON.{{1}}(sozlama));", [
        'stringify',
      ]),
      'Web Storage faqat satr saqlaydi; o‘qishda `JSON.parse` ishlatiladi.',
    ),
    why(
      q(
        'q3',
        'Kalit topilmasa `getItem()` nima qaytaradi?',
        ['null', 'undefined', "'' (bo‘sh satr)", 'Xato beradi'],
        [0],
      ),
      'Shuning uchun natijani ishlatishdan oldin `null` ekanini tekshiring.',
    ),
    why(
      sortInto('q4', 'Nimani `localStorage` da saqlash mumkin?', {
        Mumkin: ['Tanlangan til', 'Tungi rejim', 'Xat qoralamasi'],
        'Mumkin emas': ['Parol', 'Kirish tokeni'],
      }),
      'Sahifadagi istalgan skript `localStorage` ni o‘qiy oladi.',
    ),
  ]),
  'web-workers': lessonQuiz([
    why(
      tf('q1', 'Web Worker `document` orqali sahifa elementlarini o‘zgartira oladi.', false),
      'Worker DOM’ga kira olmaydi; sahifa bilan faqat xabarlar orqali gaplashadi.',
    ),
    why(
      match('q2', 'Kodni vazifasi bilan moslang.', [
        ["new Worker('hisob.js')", 'Worker yaratish'],
        ['worker.postMessage(x)', 'Workerga ma’lumot yuborish'],
        ['worker.onmessage', 'Workerdan javob olish'],
        ['worker.terminate()', 'Workerni to‘xtatish'],
      ]),
      'Worker ichida `postMessage(x)` sahifaga javob yuboradi.',
    ),
    why(
      q(
        'q3',
        'Worker qachon kerak?',
        [
          'Og‘ir hisob sahifani qotirib qo‘yganda',
          'Tugma rangini o‘zgartirish uchun',
          'Har bir oddiy sahifada',
          'Rasm ko‘rsatish uchun',
        ],
        [0],
      ),
      'JavaScript bitta oqimda ishlaydi; og‘ir hisob paytida sahifa javob bermay qoladi.',
    ),
    why(
      fill(
        'q4',
        'Bo‘sh joyni to‘ldiring.',
        'Worker kodi sahifadan alohida {{1}} faylda yoziladi.',
        [['JS', 'JavaScript', '.js']],
      ),
      'Masalan, `hisob.js` va uni chaqiradigan `index.html`.',
    ),
  ]),

  'drag-drop': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Elementni sudraladigan qiling.',
        '<div id="vazifa1" draggable="{{1}}">Hisobot yozish</div>',
        ['true'],
      ),
      'Keyin `dragstart` da `dataTransfer.setData()` bilan nimani sudrayotganingiz saqlanadi.',
    ),
    why(
      order('q2', 'Hodisalarni sodir bo‘lish tartibida joylang.', [
        'dragstart',
        'dragover',
        'drop',
        'dragend',
      ]),
      '`dragend` sudrash muvaffaqiyatli yoki yo‘qligidan qat’i nazar oxirida keladi.',
    ),
    why(
      q(
        'q3',
        '`drop` hodisasi umuman ishlamayapti. Eng ehtimoliy sabab?',
        [
          '`dragover` da `preventDefault()` chaqirilmagan',
          '`draggable` atributi `false`',
          'Element juda katta',
          '`dragend` yozilmagan',
        ],
        [0],
      ),
      '`preventDefault()` chaqirilmasa, brauzer tashlashga ruxsat bermaydi.',
    ),
    why(
      tf(
        'q4',
        'Sudrab tashlash bor joyda klaviatura foydalanuvchilari uchun muqobil yo‘l (masalan, “Ko‘chirish” tugmasi) kerak.',
        true,
      ),
      'Sudrash faqat sichqoncha bilan qulay.',
    ),
  ]),
  popover: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tugma `yordam` popover’ini ochsin.',
        '<button {{1}}="yordam">Yordam</button>\n<div id="yordam" popover>Matn</div>',
        ['popovertarget'],
      ),
      'JavaScript kerak emas: tugma shu `id` li popover’ni ochadi va yopadi.',
    ),
    why(
      match('q2', 'Popover turini xususiyati bilan moslang.', [
        ['popover (auto)', 'Tashqariga bosilsa yoki Esc da yopiladi'],
        ['popover="manual"', 'Faqat tugma yoki JavaScript bilan yopiladi'],
      ]),
      'Bir vaqtda faqat bitta `auto` popover ochiq bo‘ladi; `manual` lar bir nechta bo‘lishi mumkin.',
    ),
    why(
      q(
        'q3',
        'Ochiq popover qaysi psevdoklass bilan bezaladi?',
        [':popover-open', ':open', ':active', '::backdrop'],
        [0],
      ),
      '`::backdrop` esa popover ortidagi fonni bezaydi.',
    ),
    why(
      tf('q4', '`popover` atributli element odatiy holda yashirin bo‘ladi.', true),
      'U ochilganda sahifaning eng ustki qatlamida ko‘rinadi.',
    ),
  ]),
};
