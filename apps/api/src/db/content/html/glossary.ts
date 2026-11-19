import type { GlossaryDef } from '../helpers';

/** HTML course glossary. Each term points to the lesson that introduces it. */
export const HTML_GLOSSARY: GlossaryDef[] = [
  // Introduction and basics
  {
    term: 'HTML',
    definition:
      'HyperText Markup Language — veb-sahifaning tuzilmasi va mazmunini teglar bilan belgilaydigan til. Dasturlash tili emas, belgilash tili.',
    lesson: 'introduction',
  },
  {
    term: 'Belgilash tili',
    definition:
      'Matnning qaysi qismi nima ekanini (sarlavha, paragraf, havola…) maxsus belgilar bilan ko‘rsatadigan til. Hisob-kitob va mantiq yozilmaydi.',
    lesson: 'introduction',
  },
  {
    term: 'Brauzer',
    definition:
      'HTML, CSS va JavaScript’ni o‘qib, sahifani ekranda chizadigan dastur (Chrome, Firefox, Edge, Safari).',
    lesson: 'introduction',
  },
  {
    term: 'DOM',
    definition:
      'Document Object Model — brauzer HTML’dan quradigan elementlar daraxti. JavaScript sahifani shu daraxt orqali o‘zgartiradi.',
    lesson: 'introduction',
  },
  {
    term: 'DOCTYPE',
    definition:
      'Hujjatning birinchi qatori: brauzerga zamonaviy HTML hujjat ekanini bildiradi va sahifa standart rejimda chiziladi.',
    example: '<!DOCTYPE html>',
    lesson: 'introduction',
  },
  {
    term: 'Kod muharriri',
    definition:
      'Kod yozish uchun dastur: rangli belgilash, avtoto‘ldirish va xatolarni ko‘rsatish imkoniyatlari bor (masalan, VS Code).',
    lesson: 'editors',
  },
  {
    term: 'index.html',
    definition:
      'Sayt papkasining bosh sahifasi. Server papka so‘ralganda avtomatik shu faylni qaytaradi.',
    lesson: 'editors',
  },
  {
    term: 'Teg',
    definition:
      'Burchakli qavslar ichidagi nom: elementning boshlanishi va oxirini belgilaydi. Ochuvchi `<p>` va yopuvchi `</p>` teg bo‘ladi.',
    example: '<p>Matn</p>',
    lesson: 'basic',
  },
  {
    term: 'Element',
    definition:
      'Ochuvchi teg, mazmun va yopuvchi tegdan iborat butun bir qism. Elementlar bir-birining ichiga joylashishi mumkin.',
    example: '<h1>Sarlavha</h1>',
    lesson: 'elements',
  },
  {
    term: 'Bo‘sh element',
    definition:
      'Ichida mazmun bo‘lmaydigan va yopuvchi tegsiz yoziladigan element: `<br>`, `<img>`, `<hr>`, `<input>`, `<meta>`.',
    example: '<br>\n<img src="logo.png" alt="Logo">',
    lesson: 'elements',
  },
  {
    term: 'Ichma-ich joylashish',
    definition:
      'Bir elementning boshqasi ichida bo‘lishi. Ichkaridagi element tashqaridagidan oldin yopilishi kerak.',
    example: '<p>Bu <strong>muhim</strong> gap.</p>',
    lesson: 'elements',
  },
  {
    term: 'Atribut',
    definition:
      'Elementga qo‘shimcha ma’lumot beradigan `nom="qiymat"` juftligi. Har doim ochuvchi tegga yoziladi.',
    example: '<a href="https://example.com" title="Misol">Havola</a>',
    lesson: 'attributes',
  },
  {
    term: 'lang',
    definition:
      'Sahifa yoki element tilini ko‘rsatadigan atribut. Ekran o‘quvchilar va qidiruv tizimlari uchun muhim.',
    example: '<html lang="uz">',
    lesson: 'attributes',
  },
  {
    term: 'title (atribut)',
    definition: 'Sichqoncha element ustiga olib kelinganda chiqadigan qo‘shimcha izoh matni.',
    example: '<p title="Qo‘shimcha ma’lumot">Matn</p>',
    lesson: 'attributes',
  },
  // Text
  {
    term: 'Sarlavha',
    definition:
      '`<h1>`–`<h6>` elementlari. Sahifaning mundarijasini tashkil qiladi; `<h1>` odatda bitta bo‘ladi.',
    example: '<h1>Asosiy sarlavha</h1>\n<h2>Bo‘lim</h2>',
    lesson: 'headings',
  },
  {
    term: 'Paragraf',
    definition:
      '`<p>` elementi — matn bo‘lagi. Brauzer ketma-ket bo‘sh joylar va yangi qatorlarni bitta bo‘sh joyga aylantiradi.',
    lesson: 'paragraphs',
  },
  {
    term: '<br>',
    definition: 'Qatorni paragraf ichida yangi qatordan davom ettiradigan bo‘sh element.',
    example: 'Birinchi qator<br>Ikkinchi qator',
    lesson: 'paragraphs',
  },
  {
    term: '<pre>',
    definition: 'Matnni bo‘sh joy va qatorlari bilan aynan yozilganidek ko‘rsatadigan element.',
    lesson: 'paragraphs',
  },
  {
    term: '<hr>',
    definition: 'Mavzu almashganini bildiruvchi gorizontal chiziq (bo‘sh element).',
    lesson: 'headings',
  },
  {
    term: 'style (atribut)',
    definition:
      'Bitta elementga to‘g‘ridan-to‘g‘ri CSS yozish uchun atribut. Xususiyatlar nuqtali vergul bilan ajratiladi.',
    example: '<p style="color: teal; font-size: 20px">Matn</p>',
    lesson: 'styles',
  },
  {
    term: '<strong>',
    definition:
      'Matnning muhimligini bildiradi (odatda qalin ko‘rinadi). `<b>` esa faqat ko‘rinishni qalin qiladi, ma’no bermaydi.',
    lesson: 'formatting',
  },
  {
    term: '<em>',
    definition:
      'Urg‘uli matn (odatda kursiv). Ekran o‘quvchilar uni ohang bilan o‘qiydi; `<i>` faqat ko‘rinish uchun.',
    lesson: 'formatting',
  },
  {
    term: '<blockquote>',
    definition: 'Boshqa manbadan olingan uzun iqtibos uchun blok element; `cite` atributida manba.',
    lesson: 'quotations',
  },
  {
    term: '<abbr>',
    definition: 'Qisqartma; to‘liq nomi `title` atributida beriladi.',
    example: '<abbr title="Cascading Style Sheets">CSS</abbr>',
    lesson: 'quotations',
  },
  {
    term: 'Izoh (HTML)',
    definition:
      '`<!--` va `-->` orasidagi matn: brauzer ko‘rsatmaydi, lekin sahifa kodida hammaga ko‘rinadi.',
    example: '<!-- Bu izoh -->',
    lesson: 'comments',
  },
  // Colours and CSS
  {
    term: 'HEX rang',
    definition:
      '`#` va olti (yoki uch) o‘n oltilik raqam bilan yoziladigan rang: qizil, yashil, ko‘k ulushlari.',
    example: '#ff0000 /* qizil */',
    lesson: 'colors',
  },
  {
    term: 'RGB',
    definition: 'Rangni qizil, yashil va ko‘k ulushlari (0–255) bilan beradigan yozuv.',
    example: 'rgb(0, 128, 128)',
    lesson: 'colors',
  },
  {
    term: 'HSL',
    definition: 'Rangni ton (0–360°), to‘yinganlik va yorug‘lik (%) bilan beradigan yozuv.',
    example: 'hsl(220, 80%, 50%)',
    lesson: 'colors',
  },
  {
    term: 'Kontrast',
    definition:
      'Matn va fon ranglari orasidagi farq. Yetarli kontrast matnni hamma uchun o‘qiladigan qiladi.',
    lesson: 'colors',
  },
  {
    term: 'CSS',
    definition:
      'Cascading Style Sheets — sahifaning ko‘rinishini (rang, shrift, joylashuv) belgilaydigan til.',
    lesson: 'css',
  },
  {
    term: 'Selektor',
    definition: 'CSS qoidasi qaysi elementlarga tegishli ekanini ko‘rsatadigan qism.',
    example: 'h1 { color: navy; }\n.izoh { color: gray; }',
    lesson: 'css',
  },
  {
    term: 'Kaskad',
    definition:
      'Bir elementga bir nechta uslub tushganda qaysi biri ustun bo‘lishini aniqlaydigan qoidalar tizimi.',
    lesson: 'css',
  },
  // Links and media
  {
    term: 'Havola',
    definition: '`<a>` elementi: boshqa sahifa, fayl yoki sahifa ichidagi joyga o‘tkazadi.',
    example: '<a href="about.html">Biz haqimizda</a>',
    lesson: 'links',
  },
  {
    term: 'href',
    definition: 'Havola qayerga olib borishini ko‘rsatadigan atribut.',
    lesson: 'links',
  },
  {
    term: 'target="_blank"',
    definition: 'Havolani yangi tab yoki oynada ochadi.',
    lesson: 'links',
  },
  {
    term: 'Mutlaq URL',
    definition: 'Protokol va domen bilan to‘liq yozilgan manzil.',
    example: 'https://example.com/rasm.png',
    lesson: 'file-paths',
  },
  {
    term: 'Nisbiy yo‘l',
    definition:
      'Joriy fayl joylashgan papkaga nisbatan yozilgan yo‘l. `..` bir papka yuqoriga chiqadi.',
    example: '../images/logo.png',
    lesson: 'file-paths',
  },
  {
    term: 'alt',
    definition:
      'Rasmning matnli muqobili: rasm yuklanmasa yoki ekran o‘quvchi ishlatilsa o‘qiladi. Qulaylik uchun majburiy.',
    example: '<img src="tog.jpg" alt="Qorli tog‘ cho‘qqisi">',
    lesson: 'images',
  },
  {
    term: '<figure>',
    definition:
      'Rasm yoki diagramma va unga izoh (`<figcaption>`) ni birga o‘rab turuvchi element.',
    lesson: 'images',
  },
  {
    term: 'Favicon',
    definition: 'Brauzer tabida sahifa nomi yonida chiqadigan kichik belgi.',
    example: '<link rel="icon" href="/favicon.ico">',
    lesson: 'favicon',
  },
  {
    term: '<title>',
    definition:
      'Brauzer tabida va qidiruv natijalarida ko‘rinadigan sahifa nomi; `<head>` ichida bo‘ladi.',
    lesson: 'page-title',
  },
  // Structure
  {
    term: 'Jadval',
    definition:
      '`<table>` — ma’lumotlarni qator (`<tr>`), sarlavha katagi (`<th>`) va katak (`<td>`) larda ko‘rsatadi.',
    lesson: 'tables',
  },
  {
    term: 'colspan',
    definition: 'Katakni bir nechta ustunga cho‘zadi; `rowspan` esa qatorlarga.',
    example: '<td colspan="2">Jami</td>',
    lesson: 'tables',
  },
  {
    term: 'Ro‘yxat',
    definition:
      '`<ul>` — belgili, `<ol>` — raqamli, `<dl>` — ta’riflar ro‘yxati. Bandlar `<li>` bilan yoziladi.',
    lesson: 'lists',
  },
  {
    term: 'Blok element',
    definition:
      'Yangi qatordan boshlanib, butun kenglikni egallaydigan element: `<div>`, `<p>`, `<h1>`.',
    lesson: 'block-inline',
  },
  {
    term: 'Inline element',
    definition: 'Matn ichida qatorni uzmasdan joylashadigan element: `<span>`, `<a>`, `<strong>`.',
    lesson: 'block-inline',
  },
  {
    term: '<div>',
    definition: 'Ma’nosi yo‘q umumiy blok konteyner: guruhlash va bezash uchun.',
    lesson: 'div',
  },
  {
    term: 'class',
    definition:
      'Elementlarni guruhga kiritadigan atribut; bitta klass ko‘p elementda, bir elementda bir nechta klass bo‘lishi mumkin.',
    example: '<p class="karta katta">…</p>',
    lesson: 'classes',
  },
  {
    term: 'id',
    definition:
      'Elementning sahifadagi yagona nomi: sahifa ichidagi havola, JavaScript va `<label for>` uchun ishlatiladi.',
    example: '<section id="aloqa">…</section>\n<a href="#aloqa">Aloqa</a>',
    lesson: 'id',
  },
  {
    term: '<button>',
    definition:
      'Tugma. Forma ichida standart turi `submit`; oddiy tugma uchun `type="button"` yoziladi.',
    lesson: 'buttons',
  },
  {
    term: 'iframe',
    definition: 'Sahifa ichida boshqa sahifani ko‘rsatadigan element; `sandbox` bilan cheklanadi.',
    lesson: 'iframes',
  },
  {
    term: '<script>',
    definition: 'JavaScript kodini sahifaga qo‘shadi yoki `src` orqali tashqi faylni ulaydi.',
    example: '<script src="app.js" defer></script>',
    lesson: 'javascript',
  },
  {
    term: '<head>',
    definition:
      'Sahifa haqidagi ma’lumotlar: kodirovka, `<title>`, `<meta>`, CSS va skript ulanishlari. Ekranda ko‘rinmaydi.',
    lesson: 'head',
  },
  {
    term: '<meta>',
    definition:
      'Sahifa haqidagi qo‘shimcha ma’lumot (kodirovka, tavsif, viewport) beradigan bo‘sh element.',
    lesson: 'head',
  },
  {
    term: 'Viewport',
    definition:
      'Brauzerning sahifa ko‘rinadigan qismi. Telefonda to‘g‘ri masshtab uchun maxsus `<meta>` yoziladi.',
    example: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    lesson: 'responsive',
  },
  {
    term: 'Maket',
    definition:
      'Sahifaning umumiy joylashuvi: sarlavha, menyu, asosiy qism, yon panel va pastki qism.',
    lesson: 'layout',
  },
  {
    term: 'Moslashuvchan dizayn',
    definition: 'Sahifaning har xil ekran o‘lchamiga (telefon, planshet, kompyuter) moslashishi.',
    lesson: 'responsive',
  },
  {
    term: 'Media so‘rov',
    definition: 'Ekran kengligi kabi shartga qarab qo‘llanadigan CSS qoidalari.',
    example: '@media (max-width: 600px) { … }',
    lesson: 'responsive',
  },
  {
    term: '<code>',
    definition: 'Matn ichidagi kod bo‘lagi; kod bloki uchun `<pre><code>` ishlatiladi.',
    lesson: 'computercode',
  },
  {
    term: 'Semantik element',
    definition:
      'Nomi mazmunini bildiradigan element: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`. Qidiruv tizimlari va ekran o‘quvchilarga yordam beradi.',
    lesson: 'semantics',
  },
  {
    term: '<article>',
    definition: 'O‘z-o‘zidan tushunarli, alohida tarqatish mumkin bo‘lgan mazmun (maqola, post).',
    lesson: 'semantics',
  },
  {
    term: '<nav>',
    definition: 'Asosiy navigatsiya havolalari guruhi.',
    lesson: 'layout',
  },
  // Characters
  {
    term: 'Entity',
    definition:
      'Maxsus belgini `&nom;` yoki `&#raqam;` ko‘rinishida yozish: `&lt;` — `<`, `&amp;` — `&`.',
    example: '&lt;p&gt; &copy; &nbsp;',
    lesson: 'entities',
  },
  {
    term: '&nbsp;',
    definition: 'Uzilmaydigan bo‘sh joy: ikki so‘zni qator oxirida ajralib qolishdan saqlaydi.',
    lesson: 'entities',
  },
  {
    term: 'Kodirovka',
    definition:
      'Belgilarni baytlarga aylantirish qoidasi. Vebda UTF-8 ishlatiladi — u barcha tillar va emojilarni qo‘llaydi.',
    example: '<meta charset="utf-8">',
    lesson: 'charsets',
  },
  {
    term: 'URL kodlash',
    definition:
      'URL’da ruxsat etilmagan belgilarni `%` va o‘n oltilik kod bilan yozish (bo‘sh joy — `%20`).',
    lesson: 'url-encode',
  },
  {
    term: 'XHTML',
    definition:
      'XML qoidalariga bo‘ysunadigan qat’iy HTML: hamma element yopiladi, teglar kichik harfda, atributlar tirnoqda.',
    lesson: 'html-vs-xhtml',
  },
  // Forms
  {
    term: 'Forma',
    definition: '`<form>` — foydalanuvchidan ma’lumot yig‘ib, serverga yuboradigan element.',
    lesson: 'forms',
  },
  {
    term: '<label>',
    definition:
      'Forma maydonining nomi; `for` atributi maydon `id` siga bog‘lanadi va bosilganda maydon faollashadi.',
    example: '<label for="ism">Ism</label>\n<input id="ism" name="ism">',
    lesson: 'forms',
  },
  {
    term: 'name (atribut)',
    definition: 'Maydon qiymati serverga shu nom bilan yuboriladi; `name` siz maydon yuborilmaydi.',
    lesson: 'forms',
  },
  {
    term: 'action',
    definition: 'Forma ma’lumotlari yuboriladigan manzil.',
    lesson: 'form-attributes',
  },
  {
    term: 'method',
    definition:
      'Yuborish usuli: `GET` — ma’lumot URL’da, `POST` — so‘rov tanasida (parol va fayllar uchun).',
    lesson: 'form-attributes',
  },
  {
    term: '<fieldset>',
    definition: 'Forma maydonlarini guruhlaydi; guruh nomi `<legend>` bilan beriladi.',
    lesson: 'form-elements',
  },
  {
    term: '<select>',
    definition: 'Ochiladigan ro‘yxat; variantlar `<option>` bilan yoziladi.',
    lesson: 'form-elements',
  },
  {
    term: 'input type',
    definition:
      'Maydon turi: `text`, `email`, `number`, `date`, `checkbox`, `radio`, `file` va boshqalar.',
    lesson: 'input-types',
  },
  {
    term: 'required',
    definition: 'Maydon to‘ldirilmasa forma yuborilmaydi; brauzer ogohlantiradi.',
    lesson: 'input-attributes',
  },
  {
    term: 'pattern',
    definition: 'Maydon qiymati mos kelishi kerak bo‘lgan muntazam ifoda.',
    example: '<input pattern="[0-9]{4}">',
    lesson: 'input-attributes',
  },
  {
    term: 'placeholder',
    definition: 'Bo‘sh maydonda ko‘rinadigan namuna matn. `<label>` o‘rnini bosmaydi.',
    lesson: 'input-attributes',
  },
  // Media and APIs
  {
    term: 'MIME turi',
    definition: 'Fayl turini bildiruvchi yozuv, masalan `video/mp4`, `image/png`.',
    lesson: 'media',
  },
  {
    term: '<video>',
    definition:
      'Video o‘ynatuvchi element; `controls` tugmalarni ko‘rsatadi, `<track>` subtitr qo‘shadi.',
    lesson: 'video',
  },
  {
    term: '<audio>',
    definition: 'Audio o‘ynatuvchi element; `controls` bo‘lmasa ko‘rinmaydi.',
    lesson: 'audio',
  },
  {
    term: 'Web API',
    definition:
      'Brauzer beradigan tayyor imkoniyatlar to‘plami (joylashuv, xotira, chizish va h.k.), JavaScript orqali ishlatiladi.',
    lesson: 'web-apis',
  },
  {
    term: 'Geolocation',
    definition: 'Foydalanuvchi ruxsati bilan uning joylashuvini beradigan API (faqat HTTPS’da).',
    lesson: 'geolocation',
  },
  {
    term: 'localStorage',
    definition:
      'Brauzerda kalit–qiymat ko‘rinishida matn saqlaydigan xotira; brauzer yopilsa ham saqlanadi.',
    example: "localStorage.setItem('mavzu', 'qorong‘i');",
    lesson: 'web-storage',
  },
  {
    term: 'sessionStorage',
    definition: 'localStorage kabi, lekin tab yopilganda o‘chadi.',
    lesson: 'web-storage',
  },
  {
    term: 'Web Worker',
    definition: 'Og‘ir hisoblarni sahifani qotirmasdan alohida oqimda bajaradigan skript.',
    lesson: 'web-workers',
  },
  {
    term: 'SSE',
    definition: 'Server-Sent Events — serverdan brauzerga uzluksiz xabar oqimi (bir tomonlama).',
    lesson: 'sse',
  },
  {
    term: 'Canvas',
    definition: '`<canvas>` — JavaScript bilan piksellarda chizish maydoni.',
    lesson: 'canvas',
  },
  {
    term: 'SVG',
    definition: 'Vektor grafika: shakllar DOM elementlari, kattalashtirilganda xiralashmaydi.',
    example: '<svg width="100" height="100"><circle cx="50" cy="50" r="40" /></svg>',
    lesson: 'svg',
  },
  {
    term: 'Drag and Drop',
    definition:
      'Elementni sichqoncha bilan sudrab, boshqa joyga tashlash imkoniyati (`draggable`).',
    lesson: 'drag-drop',
  },
  {
    term: 'Popover',
    definition:
      '`popover` atributli element: `popovertarget` tugmasi bilan JavaScript’siz ochiladi.',
    lesson: 'popover',
  },
];
