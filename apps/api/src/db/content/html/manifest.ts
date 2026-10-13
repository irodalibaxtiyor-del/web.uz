import {
  after,
  at,
  attr,
  clean,
  files,
  has,
  html,
  page,
  q,
  quiz,
  style,
  text,
  type CourseMeta,
  type ModuleDef,
} from '../helpers';

/**
 * Original Uzbek HTML course. Only the topic order follows the usual HTML curriculum; every
 * lesson, exercise and question is written for WEBDIZAYN.UZ. Lesson bodies live in
 * `apps/api/content/html-course/<slug>.md`.
 */

export const HTML_COURSE: CourseMeta = {
  slug: 'html',
  contentDir: 'html-course',
  position: 20,
  title: 'HTML: to‘liq kurs',
  description:
    'HTML’ni noldan o‘rganing: matn, havolalar, rasmlar, jadvallar, formalar, semantika, ' +
    'media va brauzer API’lari. 12 modul, 60 dars, amaliy mashqlar va modul testlari.',
};

const md = (...lines: string[]) => lines.join('\n');
const TODO = '<!-- Shu yerga yozing -->';

export const HTML_MODULES: ModuleDef[] = [
  // ---------------------------------------------------------------- 1
  {
    title: 'HTML bilan tanishuv',
    lessons: [
      {
        slug: 'introduction',
        title: 'HTML nima?',
        exercise: {
          title: 'Birinchi sahifa',
          description: 'Sarlavha va paragrafdan iborat eng oddiy sahifa.',
          instructions: md(
            '1. `<body>` ichiga `<h1>` sarlavha qo‘shing, matnida **Salom** so‘zi bo‘lsin.',
            '2. Sarlavha ostiga o‘zingiz haqingizda bitta `<p>` paragraf yozing.',
            '3. “Ishga tushirish” tugmasini bosib natijani ko‘ring, keyin “Tekshirish”ni bosing.',
          ),
          expectedBehavior: 'Sahifada “Salom” so‘zi bor katta sarlavha va uning ostida paragraf.',
          difficulty: 'EASY',
          starterFiles: html(page(TODO, { title: 'Birinchi sahifam' })),
          checks: [
            has('h1', 'Sahifada `<h1>` sarlavha bor', 'h1', {
              hint: '`<h1>Salom, dunyo!</h1>` kabi yozing.',
            }),
            text('h1-text', 'Sarlavhada “Salom” so‘zi bor', 'h1', 'Salom'),
            has('p', 'Sahifada paragraf bor', 'body p', { hint: 'Matnni `<p>` tegiga oling.' }),
          ],
        },
      },
      { slug: 'editors', title: 'Kod muharrirlari' },
      {
        slug: 'basic',
        title: 'HTML asoslari',
        exercise: {
          title: 'Asosiy qurilish bloklari',
          description: 'Sarlavha, paragraf, havola, rasm va ro‘yxatni bitta sahifada ishlating.',
          instructions: md(
            '- `<h1>` sarlavha;',
            '- kamida bitta `<p>` paragraf;',
            '- `href` atributi bor havola (`<a>`);',
            '- `src` va `alt` atributlari bor rasm (`<img>`);',
            '- kamida 3 bandli `<ul>` ro‘yxat.',
          ),
          expectedBehavior:
            'Sahifada beshta asosiy element: sarlavha, paragraf, havola, rasm va ro‘yxat.',
          difficulty: 'EASY',
          starterFiles: html(page(`<h1>Mening sahifam</h1>\n${TODO}`)),
          checks: [
            has('p', 'Paragraf bor', 'body p'),
            has('link', 'Manzili bor havola bor', 'a[href]', {
              hint: 'Havolaning manzili `href` atributida yoziladi.',
            }),
            has('img', 'Rasmda `src` va `alt` bor', 'img[src][alt]', {
              hint: '`alt` — rasm ko‘rinmaganda o‘qiladigan matn.',
            }),
            has('list', 'Ro‘yxatda kamida 3 band bor', 'ul > li', { min: 3 }),
          ],
        },
      },
      {
        slug: 'elements',
        title: 'HTML elementlari',
        exercise: {
          title: 'Ichma-ich elementlar',
          description: 'Elementlarni bir-birining ichiga to‘g‘ri joylashtirish.',
          instructions: md(
            '1. Paragraf ichida bitta so‘zni `<strong>` bilan qalin qiling.',
            '2. Manzil yozilgan paragrafda qatorlarni `<br>` bilan ajrating (kamida 2 ta `<br>`).',
            '3. Har bir ochilgan tegni yopishni unutmang.',
          ),
          expectedBehavior: 'Bitta paragrafda qalin so‘z, boshqasida uch qatorli manzil.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Kafe “Bahor”</h1>
<p>Bizda eng mazali somsa.</p>
<p>Toshkent sh., Chilonzor t., 5-uy</p>`),
          ),
          checks: [
            has('strong', 'Paragraf ichida `<strong>` bor', 'p strong'),
            has('br', 'Paragrafda kamida 2 ta `<br>` bor', 'p br', {
              min: 2,
              hint: '`<br>` — bo‘sh element, yopuvchi tegi yo‘q.',
            }),
          ],
        },
      },
      {
        slug: 'attributes',
        title: 'Atributlar',
        exercise: {
          title: 'Atributlar bilan ishlash',
          description: 'Havola va rasmga kerakli atributlarni qo‘shing.',
          instructions: md(
            '1. Havolaga `href` va `title` atributlarini qo‘shing.',
            '2. Rasmga `alt`, `width` va `height` atributlarini qo‘shing.',
            '3. Paragrafga `title` atributi bilan izoh bering (sichqoncha ustiga kelganda ko‘rinadi).',
          ),
          expectedBehavior: 'Havola, rasm va paragrafda kerakli atributlar to‘ldirilgan.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<p>Bugungi ob-havo</p>
<a>Batafsil</a>
<img src="quyosh.png">`),
          ),
          checks: [
            has('a', 'Havolada `href` va `title` bor', 'a[href][title]'),
            has('img', 'Rasmda `alt`, `width` va `height` bor', 'img[alt][width][height]'),
            has('p', 'Paragrafda `title` atributi bor', 'p[title]'),
          ],
        },
        quiz: quiz('1-modul testi: HTML bilan tanishuv', [
          q(
            'q1',
            'HTML nima?',
            [
              'Dasturlash tili',
              'Sahifa tuzilmasini belgilash tili',
              'Ma’lumotlar bazasi',
              'Rasm formati',
            ],
            [1],
          ),
          q(
            'q2',
            'Qaysi qator HTML5 hujjat turini e’lon qiladi?',
            ['<!DOCTYPE html>', '<html5>', '<doctype version="5">', '<!-- html -->'],
            [0],
          ),
          q(
            'q3',
            'Qaysi elementlar bo‘sh (yopuvchi tegi yo‘q) elementlar?',
            ['<br>', '<img>', '<p>', '<h1>'],
            [0, 1],
          ),
          q(
            'q4',
            'Atributlar qayerda yoziladi?',
            ['Yopuvchi tegda', 'Ochuvchi tegda', 'Teglar orasidagi matnda', 'Alohida faylda'],
            [1],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 2
  {
    title: 'Matn bilan ishlash',
    lessons: [
      {
        slug: 'headings',
        title: 'Sarlavhalar',
        exercise: {
          title: 'Maqola mundarijasi',
          description: 'Sarlavhalar darajasini to‘g‘ri ishlatish.',
          instructions: md(
            '1. Sahifada faqat **bitta** `<h1>` qoldiring — bu maqola nomi.',
            '2. Bo‘limlar uchun kamida ikkita `<h2>` ishlating.',
            '3. Bo‘limlar orasini `<hr>` bilan ajrating.',
          ),
          expectedBehavior: 'Bitta asosiy sarlavha, ikkita bo‘lim sarlavhasi va ajratuvchi chiziq.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Toshkent haqida</h1>
<h1>Tarixi</h1>
<p>Shahar ikki ming yildan ortiq tarixga ega.</p>
<h1>Diqqatga sazovor joylar</h1>
<p>Amir Temur xiyoboni, Chorsu bozori va boshqalar.</p>`),
          ),
          checks: [
            has('one-h1', 'Sahifada aynan bitta `<h1>` bor', 'h1', {
              max: 1,
              hint: 'Sahifaning asosiy sarlavhasi bitta bo‘ladi, bo‘limlar uchun `<h2>` ishlating.',
            }),
            has('h2', 'Kamida ikkita `<h2>` bor', 'h2', { min: 2 }),
            has('hr', 'Ajratuvchi chiziq `<hr>` bor', 'hr'),
          ],
        },
      },
      {
        slug: 'paragraphs',
        title: 'Paragraflar',
        exercise: {
          title: 'She’r va kod',
          description: 'Qator tashlash va formatlangan matn.',
          instructions: md(
            '1. She’rni bitta `<p>` ichida yozing, qatorlarni `<br>` bilan ajrating (kamida 3 ta).',
            '2. Pastdagi “bo‘sh joyli rasm”ni `<pre>` ichiga oling — bo‘sh joylar saqlanib qolsin.',
          ),
          expectedBehavior: 'She’r qatorlari alohida-alohida, `<pre>` dagi chizma buzilmagan.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Bahor</h1>
<p>Kelding bahor, ochildi gul,
Qushlar sayrar bog‘ ichra,
Quyosh kulib boqadi,
Yashil dalalar ichra.</p>

<p>
   *
  ***
 *****
   |
</p>`),
          ),
          checks: [
            has('br', 'She’rda kamida 3 ta `<br>` bor', 'p br', { min: 3 }),
            has('pre', '`<pre>` elementi bor', 'pre', {
              hint: 'Bo‘sh joylar va qatorlarni saqlash uchun `<pre>` ishlatiladi.',
            }),
          ],
        },
      },
      {
        slug: 'styles',
        title: 'Uslublar (style)',
        exercise: {
          title: 'E’lon kartochkasi',
          description: '`style` atributi bilan rang, o‘lcham va tekislash.',
          instructions: md(
            '`style` atributidan foydalaning:',
            '',
            '- `<h2>` matn rangi: `#0071dc`;',
            '- `<p>` shrift o‘lchami: `18px`;',
            '- `div.karta` matni markazda (`text-align: center`) va fon rangi `#f5faff`.',
          ),
          expectedBehavior: 'Ko‘k sarlavhali, markazlashtirilgan, och ko‘k fonli kartochka.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<div class="karta">
  <h2>Ingliz tili kursi</h2>
  <p>Har dushanba va payshanba, soat 18:00 da.</p>
</div>`),
          ),
          checks: [
            style('h2-color', 'Sarlavha rangi ko‘k', '.karta h2', 'color', '#0071dc'),
            style('p-size', 'Paragraf shrifti 18px', '.karta p', 'font-size', '18px'),
            style('center', 'Kartochka matni markazda', '.karta', 'text-align', 'center'),
            style('bg', 'Kartochka foni och ko‘k', '.karta', 'background-color', '#f5faff'),
          ],
        },
      },
      {
        slug: 'formatting',
        title: 'Matnni formatlash',
        exercise: {
          title: 'Chegirma narxi',
          description: 'Matnni ma’nosiga qarab ajratib ko‘rsatish.',
          instructions: md(
            '1. Eski narxni `<del>` bilan o‘chirilgan qiling.',
            '2. Yangi narxni `<strong>` bilan ajrating.',
            '3. “Faqat bugun” so‘zlarini `<mark>` bilan belgilang.',
            '4. Kimyoviy formulada `H2O` dagi `2` ni `<sub>` bilan pastga tushiring.',
          ),
          expectedBehavior:
            'Eski narx chizilgan, yangisi qalin, “Faqat bugun” sariq fonda, H₂O to‘g‘ri yozilgan.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Mineral suv</h1>
<p>Narxi: 6 000 so‘m 4 500 so‘m</p>
<p>Faqat bugun!</p>
<p>Tarkibi: H2O va foydali minerallar.</p>`),
          ),
          checks: [
            has('del', 'Eski narx `<del>` ichida', 'del'),
            has('strong', 'Yangi narx `<strong>` ichida', 'strong'),
            has('mark', '`<mark>` bilan belgilangan matn bor', 'mark'),
            has('sub', 'Formulada `<sub>` bor', 'sub'),
          ],
        },
      },
      {
        slug: 'quotations',
        title: 'Iqtiboslar',
        exercise: {
          title: 'Iqtibos va qisqartmalar',
          description: 'Iqtibos, qisqartma va aloqa ma’lumotini to‘g‘ri belgilash.',
          instructions: md(
            '1. Uzun iqtibosni `<blockquote>` ga oling va `cite` atributida manba manzilini yozing.',
            '2. Gap ichidagi qisqa iqtibosni `<q>` bilan belgilang.',
            '3. “HTML” qisqartmasini `<abbr title="...">` bilan izohlang.',
            '4. Aloqa ma’lumotini `<address>` ga oling.',
          ),
          expectedBehavior: 'Iqtiboslar, qisqartma va manzil semantik teglar bilan belgilangan.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<h1>Kitobxonlik haqida</h1>
<p>Bilim — eng katta boylikdir. Kitob o‘qigan inson hech qachon yolg‘iz qolmaydi.</p>
<p>Ustozimiz aytganidek, Har kuni 20 bet o‘qing.</p>
<p>Bu sahifa HTML yordamida yaratilgan.</p>
<p>Muallif: Kutubxona jamoasi, kitob@example.uz</p>`),
          ),
          checks: [
            has('blockquote', '`<blockquote>` da `cite` atributi bor', 'blockquote[cite]'),
            has('q', 'Qisqa iqtibos `<q>` bilan belgilangan', 'q'),
            has('abbr', 'Qisqartmada `title` bor', 'abbr[title]'),
            has('address', 'Aloqa ma’lumoti `<address>` ichida', 'address'),
          ],
        },
      },
      {
        slug: 'comments',
        title: 'Izohlar',
        exercise: {
          title: 'Kodni vaqtincha o‘chirish',
          description: 'Izoh yordamida elementni sahifadan yashirish.',
          instructions: md(
            '1. `eski-aksiya` klassli paragrafni o‘chirmasdan, **izoh** ichiga oling (`<!-- ... -->`).',
            '2. Yangi aksiya paragrafi joyida qolsin.',
            '3. Kod tepasiga bu bo‘lim nima ekanini tushuntiradigan qisqa izoh yozing.',
          ),
          expectedBehavior:
            'Sahifada faqat yangi aksiya ko‘rinadi, eski aksiya kodi izoh ichida saqlanib qolgan.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Aksiyalar</h1>
<p class="eski-aksiya">Yozgi chegirma: 30%</p>
<p class="yangi-aksiya">Kuzgi chegirma: 20%</p>`),
          ),
          checks: [
            has('hidden-old', 'Eski aksiya sahifada ko‘rinmaydi', '.eski-aksiya', {
              min: 0,
              max: 0,
              hint: 'Elementni `<!--` va `-->` orasiga oling.',
            }),
            has('kept-new', 'Yangi aksiya joyida qolgan', '.yangi-aksiya'),
          ],
        },
        quiz: quiz('2-modul testi: Matn bilan ishlash', [
          q(
            'q1',
            'Sahifada nechta `<h1>` bo‘lishi tavsiya etiladi?',
            ['Bitta', 'Kamida uchta', 'Har bir paragraf uchun bittadan', 'Umuman kerak emas'],
            [0],
          ),
          q(
            'q2',
            'Qaysi element bo‘sh joy va qatorlarni o‘zgarishsiz ko‘rsatadi?',
            ['<p>', '<pre>', '<span>', '<br>'],
            [1],
          ),
          q(
            'q3',
            'Muhim matnni ma’no jihatdan ajratadigan teglar qaysilar?',
            ['<strong>', '<em>', '<b>', '<i>'],
            [0, 1],
          ),
          q(
            'q4',
            'HTML izohi qanday yoziladi?',
            ['// izoh', '/* izoh */', '<!-- izoh -->', '# izoh'],
            [2],
          ),
          q(
            'q5',
            'Qisqartmaning to‘liq shakli qaysi atributda beriladi?',
            ['<abbr title="...">', '<abbr alt="...">', '<abbr cite="...">', '<abbr name="...">'],
            [0],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 3
  {
    title: 'Ranglar va CSS',
    lessons: [
      {
        slug: 'colors',
        title: 'Ranglar',
        exercise: {
          title: 'Rang palitrasi',
          description: 'Ranglarni turli usullarda berish.',
          instructions: md(
            '`<style>` yoki `style` atributidan foydalaning:',
            '',
            '- sahifa (`body`) foni: `#f5faff`;',
            '- `<h1>` rangi: `rgb(0, 113, 220)`;',
            '- `.eslatma` foni: `hsl(48, 100%, 50%)`;',
            '- `.eslatma` chegarasi: `2px solid` (istalgan rang).',
          ),
          expectedBehavior: 'Och ko‘k fonli sahifa, ko‘k sarlavha va sariq eslatma bloki.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Ranglar bilan tanishuv</h1>
<p class="eslatma">Eslatma: kontrastli ranglar matnni o‘qishni osonlashtiradi.</p>`),
          ),
          checks: [
            style('body-bg', 'Sahifa foni `#f5faff`', 'body', 'background-color', '#f5faff'),
            style(
              'h1-color',
              'Sarlavha rangi `rgb(0, 113, 220)`',
              'h1',
              'color',
              'rgb(0, 113, 220)',
            ),
            style(
              'note-bg',
              'Eslatma foni sariq (HSL)',
              '.eslatma',
              'background-color',
              'hsl(48, 100%, 50%)',
            ),
            style('note-border', 'Eslatmada chegara bor', '.eslatma', 'border-top-style', 'solid'),
          ],
        },
      },
      {
        slug: 'css',
        title: 'CSS bilan tanishuv',
        exercise: {
          title: 'Tashqi CSS fayl',
          description: 'Uslublarni alohida `style.css` faylga chiqarish.',
          instructions: md(
            '1. `index.html` ning `<head>` qismida `style.css` faylini `<link rel="stylesheet">` bilan ulang.',
            '2. `style.css` da: `h1` rangi `#0071dc`, `p` rangi `#333333`.',
            '3. HTML’da `style` atributini ishlatmang — hamma uslub CSS faylda bo‘lsin.',
          ),
          expectedBehavior: 'Uslublar tashqi fayldan olinadi: ko‘k sarlavha, to‘q kulrang matn.',
          difficulty: 'EASY',
          starterFiles: files({
            'index.html': page(`<h1>Mening blogim</h1>
<p>Bugun CSS’ni o‘rganishni boshladim.</p>`),
            'style.css': '/* Uslublarni shu yerga yozing */\n',
          }),
          checks: [
            has(
              'link',
              'CSS fayl `<link>` bilan ulangan',
              'link[rel="stylesheet"][href="style.css"]',
            ),
            style('h1', 'Sarlavha rangi `#0071dc`', 'h1', 'color', '#0071dc'),
            style('p', 'Matn rangi `#333333`', 'p', 'color', '#333333'),
            has('no-inline', 'HTML’da `style` atributi ishlatilmagan', '[style]', {
              min: 0,
              max: 0,
              hidden: true,
            }),
          ],
        },
        quiz: quiz('3-modul testi: Ranglar va CSS', [
          q('q1', '`#ff0000` qaysi rang?', ['Qizil', 'Yashil', 'Ko‘k', 'Qora'], [0]),
          q(
            'q2',
            'Qaysi yozuvlar to‘g‘ri rang qiymati?',
            ['rgb(0, 113, 220)', 'hsl(48, 100%, 50%)', '#0071dc', 'rang(ko‘k)'],
            [0, 1, 2],
          ),
          q(
            'q3',
            'Tashqi CSS fayl qanday ulanadi?',
            [
              '<style src="style.css">',
              '<link rel="stylesheet" href="style.css">',
              '<css>style.css</css>',
              '<script href="style.css">',
            ],
            [1],
          ),
          q(
            'q4',
            'Uchala usulda bitta xususiyat berilsa, qaysi biri ustun keladi?',
            ['Tashqi fayl', '`<style>` bloki', '`style` atributi', 'Brauzer tasodifiy tanlaydi'],
            [2],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 4
  {
    title: 'Havolalar va rasmlar',
    lessons: [
      {
        slug: 'links',
        title: 'Havolalar',
        exercise: {
          title: 'Aloqa havolalari',
          description: 'Tashqi, ichki, email va xatcho‘p havolalar.',
          instructions: md(
            '1. `https://` bilan boshlanadigan tashqi havola qo‘shing va u **yangi oynada** ochilsin.',
            '2. `mailto:` havola qo‘shing.',
            '3. `tel:` havola qo‘shing.',
            '4. `#aloqa` ga olib boradigan havola qo‘shing va sahifa pastida `id="aloqa"` bo‘limini yarating.',
          ),
          expectedBehavior:
            'Barcha turdagi havolalar ishlaydi, “Aloqa” havolasi sahifa pastiga tushiradi.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<h1>Dizayn studiyasi</h1>
<nav>
  ${TODO}
</nav>
<p>Biz sayt va logotiplar yaratamiz.</p>`),
          ),
          checks: [
            has(
              'external',
              'Tashqi havola yangi oynada ochiladi',
              'a[href^="https://"][target="_blank"]',
              {
                hint: '`target="_blank"` atributini qo‘shing.',
              },
            ),
            has('mail', 'Email havola bor', 'a[href^="mailto:"]'),
            has('tel', 'Telefon havola bor', 'a[href^="tel:"]'),
            has('anchor', '`#aloqa` ga havola bor', 'a[href="#aloqa"]'),
            has('target', '`id="aloqa"` bo‘limi bor', '#aloqa', {
              hint: 'Havola ishlashi uchun shu `id` li element bo‘lishi kerak.',
            }),
          ],
        },
      },
      {
        slug: 'images',
        title: 'Rasmlar',
        exercise: {
          title: 'Izohli rasm',
          description: '`<figure>` va `<figcaption>` bilan rasm.',
          instructions: md(
            '1. Rasmni `<figure>` ichiga joylang.',
            '2. Rasmga mazmunli `alt`, `width` va `height` bering.',
            '3. Rasm ostiga `<figcaption>` izoh yozing.',
          ),
          expectedBehavior: 'Izohli rasm bloki: rasm va uning ostida izoh.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Samarqand</h1>
<img src="registon.jpg">
<p>Registon maydoni, Samarqand.</p>`),
          ),
          checks: [
            has('figure-img', 'Rasm `<figure>` ichida', 'figure img'),
            has('caption', '`<figcaption>` bor', 'figure figcaption'),
            has('alt', 'Rasmda bo‘sh bo‘lmagan `alt` bor', 'img[alt]:not([alt=""])'),
            has('size', 'Rasmda `width` va `height` bor', 'img[width][height]'),
          ],
        },
      },
      {
        slug: 'project',
        title: 'Kichik loyiha: vizitka',
        exercise: {
          title: 'Shaxsiy vizitka',
          description: 'HTML va alohida CSS fayldan iborat kichik loyiha.',
          instructions: md(
            'Loyiha tuzilmasi: `index.html` va `css/style.css`.',
            '',
            '1. `css/style.css` ni `<link>` bilan ulang.',
            '2. `<h1>` da ismingizni yozing; CSS’da uning rangi `#0071dc` bo‘lsin.',
            '3. `alt` li rasm qo‘shing.',
            '4. Ko‘nikmalaringizni kamida 3 bandli `<ul>` ro‘yxatda yozing.',
            '5. `mailto:` havola bilan aloqa qo‘shing.',
          ),
          expectedBehavior:
            'Ism, rasm, ko‘nikmalar ro‘yxati va email havolasi bor vizitka sahifasi.',
          difficulty: 'MEDIUM',
          starterFiles: files({
            'index.html': page(TODO, { title: 'Vizitka' }),
            'css/style.css': '/* Vizitka uslublari */\n',
          }),
          checks: [
            has('css', '`css/style.css` ulangan', 'link[rel="stylesheet"][href="css/style.css"]'),
            style('h1', 'Ism rangi `#0071dc` (CSS fayldan)', 'h1', 'color', '#0071dc'),
            has('img', 'Rasmda `alt` bor', 'img[alt]'),
            has('skills', 'Kamida 3 ta ko‘nikma', 'ul > li', { min: 3 }),
            has('mail', 'Email havola bor', 'a[href^="mailto:"]'),
          ],
        },
      },
      {
        slug: 'favicon',
        title: 'Favicon',
        exercise: {
          title: 'Sayt belgisi',
          description: 'Brauzer tabidagi kichik belgini ulash.',
          instructions: md(
            '`<head>` ichiga `rel="icon"` bo‘lgan `<link>` qo‘shing va `href` da `favicon.png` faylini ko‘rsating.',
          ),
          expectedBehavior: 'Sahifaning `<head>` qismida favicon ulangan.',
          difficulty: 'EASY',
          starterFiles: html(page('<h1>Kafe “Bahor”</h1>')),
          checks: [
            has('icon', '`<head>` da favicon havolasi bor', 'head link[rel="icon"]'),
            attr('href', 'Favicon fayli `favicon.png`', 'link[rel="icon"]', 'href', 'favicon.png'),
          ],
        },
      },
      {
        slug: 'page-title',
        title: 'Sahifa sarlavhasi',
        exercise: {
          title: 'Yaxshi sarlavha',
          description: '`<title>` va `<h1>` ni to‘g‘ri to‘ldirish.',
          instructions: md(
            '1. `<title>` ni `Bahor choyxonasi — Menyu` ga o‘zgartiring.',
            '2. `<h1>` matnida “Menyu” so‘zi bo‘lsin.',
          ),
          expectedBehavior:
            'Brauzer tabida “Bahor choyxonasi — Menyu”, sahifada “Menyu” sarlavhasi.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Sahifa</h1>
<ul>
  <li>Palov</li>
  <li>Lag‘mon</li>
  <li>Ko‘k choy</li>
</ul>`),
          ),
          checks: [
            text('title', 'Sahifa nomi to‘g‘ri', 'title', 'Bahor choyxonasi — Menyu', {
              equals: true,
              hint: 'Matnni aynan topshiriqdagidek yozing (uzun tire bilan).',
            }),
            text('h1', 'Sarlavhada “Menyu” bor', 'h1', 'Menyu'),
          ],
        },
        quiz: quiz('4-modul testi: Havolalar va rasmlar', [
          q(
            'q1',
            'Havolani yangi oynada ochish uchun qaysi atribut kerak?',
            ['target="_blank"', 'href="_new"', 'open="window"', 'rel="new"'],
            [0],
          ),
          q(
            'q2',
            '`alt` atributi nima uchun kerak?',
            [
              'Rasm ko‘rinmaganda o‘rniga matn ko‘rsatish',
              'Ekran o‘qiydigan dasturlar uchun',
              'Rasmni kattalashtirish uchun',
              'Rasmni tezroq yuklash uchun',
            ],
            [0, 1],
          ),
          q(
            'q3',
            'Sahifa ichidagi `id="narxlar"` bo‘limiga havola qanday yoziladi?',
            [
              '<a href="narxlar">',
              '<a href="#narxlar">',
              '<a id="narxlar">',
              '<a href=".narxlar">',
            ],
            [1],
          ),
          q(
            'q4',
            'Brauzer tabida ko‘rinadigan nom qaysi elementda yoziladi?',
            ['<h1>', '<title>', '<header>', '<meta name="title">'],
            [1],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 5
  {
    title: 'Jadvallar va ro‘yxatlar',
    lessons: [
      {
        slug: 'tables',
        title: 'Jadvallar',
        exercise: {
          title: 'Dars jadvali',
          description: 'Sarlavhali, qismlarga ajratilgan jadval.',
          instructions: md(
            '1. `<caption>` bilan jadval nomini yozing.',
            '2. `<thead>` ichida kamida 3 ta `<th>` ustun sarlavhasi bo‘lsin, ularga `scope="col"` bering.',
            '3. `<tbody>` ichida kamida 3 qator bo‘lsin.',
          ),
          expectedBehavior: 'Nomli jadval: sarlavha qatori va kamida uchta ma’lumot qatori.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<h1>Haftalik jadval</h1>
<table>
  <tr><td>Kun</td><td>Fan</td><td>Vaqt</td></tr>
  <tr><td>Dushanba</td><td>HTML</td><td>10:00</td></tr>
</table>`),
          ),
          checks: [
            has('caption', 'Jadvalda `<caption>` bor', 'table caption'),
            has('th', '`<thead>` da kamida 3 ta `<th>`', 'table thead th', { min: 3 }),
            has('scope', 'Ustun sarlavhalarida `scope="col"`', 'thead th[scope="col"]', { min: 3 }),
            has('rows', '`<tbody>` da kamida 3 qator', 'table tbody tr', { min: 3 }),
          ],
        },
      },
      {
        slug: 'lists',
        title: 'Ro‘yxatlar',
        exercise: {
          title: 'Retsept sahifasi',
          description: 'Tartibsiz, tartiblangan, ichma-ich va ta’riflar ro‘yxati.',
          instructions: md(
            '1. Masalliqlarni `<ul>` ro‘yxatga yozing (kamida 3 ta).',
            '2. Tayyorlash bosqichlarini `<ol>` ro‘yxatga yozing (kamida 3 ta).',
            '3. Masalliqlardan biri ichida yana bitta ichki `<ul>` bo‘lsin (masalan, ziravorlar).',
            '4. Atamalarni `<dl>`, `<dt>`, `<dd>` bilan izohlang.',
          ),
          expectedBehavior: 'Masalliqlar, bosqichlar va atamalar lug‘ati bor retsept.',
          difficulty: 'MEDIUM',
          starterFiles: html(page(`<h1>Palov</h1>\n${TODO}`)),
          checks: [
            has('ul', 'Masalliqlar ro‘yxatida kamida 3 band', 'ul > li', { min: 3 }),
            has('ol', 'Bosqichlar ro‘yxatida kamida 3 band', 'ol > li', { min: 3 }),
            has('nested', 'Ichma-ich ro‘yxat bor', 'li > ul, li > ol', {
              hint: 'Ichki ro‘yxat `<li>` ning ichida bo‘lishi kerak.',
            }),
            has('dl', 'Ta’riflar ro‘yxati bor', 'dl dt + dd'),
          ],
        },
        quiz: quiz('5-modul testi: Jadvallar va ro‘yxatlar', [
          q(
            'q1',
            'Jadval sarlavha katakchasi qaysi teg?',
            ['<td>', '<th>', '<tr>', '<thead>'],
            [1],
          ),
          q(
            'q2',
            'Ikki ustunni birlashtirish uchun qaysi atribut ishlatiladi?',
            ['rowspan="2"', 'colspan="2"', 'merge="2"', 'span="2"'],
            [1],
          ),
          q(
            'q3',
            'Tartiblangan (raqamli) ro‘yxat qaysi teg bilan yaratiladi?',
            ['<ul>', '<ol>', '<dl>', '<li>'],
            [1],
          ),
          q(
            'q4',
            'Ta’riflar ro‘yxatida qaysi teglar ishlatiladi?',
            ['<dl>', '<dt>', '<dd>', '<td>'],
            [0, 1, 2],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 6
  {
    title: 'Sahifa tuzilmasi',
    lessons: [
      {
        slug: 'block-inline',
        title: 'Blok va satr elementlari',
        exercise: {
          title: 'Menyu qatori',
          description: 'Blok va satr elementlarining farqi, `display` xususiyati.',
          instructions: md(
            '1. Paragraf ichidagi “yangi” so‘zini `<span class="belgi">` ga oling.',
            '2. CSS’da `nav li` elementlarini `display: inline-block` qiling — menyu bir qatorda tursin.',
          ),
          expectedBehavior:
            'Menyu bandlari yonma-yon, paragrafdagi “yangi” so‘zi alohida belgilangan.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(
              `<nav>
  <ul>
    <li>Bosh sahifa</li>
    <li>Kurslar</li>
    <li>Aloqa</li>
  </ul>
</nav>
<p>Bu oy yangi kurslar qo‘shildi.</p>`,
              { head: '<style>\n  .belgi { color: crimson; }\n</style>' },
            ),
          ),
          checks: [
            has('span', 'Paragraf ichida `span.belgi` bor', 'p span.belgi'),
            style('inline', 'Menyu bandlari `inline-block`', 'nav li', 'display', 'inline-block'),
          ],
        },
      },
      {
        slug: 'div',
        title: 'Div elementi',
        exercise: {
          title: 'Uchta kartochka',
          description: '`<div>` bilan guruhlash va yonma-yon joylash.',
          instructions: md(
            '1. Uchta kartochkani `<div class="qator">` ichiga oling.',
            '2. `.qator` ga `display: flex` bering — kartochkalar yonma-yon tursin.',
            '3. `.karta` larning maksimal kengligi `250px` bo‘lsin (`max-width`).',
          ),
          expectedBehavior: 'Uchta kartochka bir qatorda, har biri 250px dan kengmas.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<div class="karta"><h3>HTML</h3><p>Sahifa tuzilmasi</p></div>
<div class="karta"><h3>CSS</h3><p>Sahifa bezagi</p></div>
<div class="karta"><h3>JavaScript</h3><p>Sahifa harakati</p></div>`),
          ),
          checks: [
            has('row', '`.qator` ichida 3 ta kartochka', '.qator > .karta', { min: 3 }),
            style('flex', '`.qator` — flex konteyner', '.qator', 'display', 'flex'),
            style('width', 'Kartochka kengligi 250px dan oshmaydi', '.karta', 'max-width', '250px'),
          ],
        },
      },
      {
        slug: 'classes',
        title: 'Klasslar',
        exercise: {
          title: 'Umumiy klass',
          description:
            'Bitta klassni turli elementlarga va bir nechta klassni bitta elementga berish.',
          instructions: md(
            '1. Kamida uchta turli elementga `muhim` klassini bering.',
            '2. `.muhim` uchun CSS’da `color: crimson` yozing.',
            '3. Bitta elementga ikkita klass bering: `muhim katta`. `.katta` shrifti `24px` bo‘lsin.',
          ),
          expectedBehavior: 'Muhim joylar qizil rangda, ulardan biri kattaroq.',
          difficulty: 'EASY',
          starterFiles: html(
            page(
              `<h2>Imtihon haqida</h2>
<p>Imtihon 15-iyun kuni bo‘ladi.</p>
<p>O‘zingiz bilan <span>pasport</span> olib keling.</p>
<p>Kechikkanlar kiritilmaydi.</p>`,
              { head: '<style>\n  /* Uslublarni shu yerga yozing */\n</style>' },
            ),
          ),
          checks: [
            has('three', 'Kamida 3 ta element `muhim` klassida', '.muhim', { min: 3 }),
            style('color', '`.muhim` rangi crimson', '.muhim', 'color', 'crimson'),
            has('two-classes', 'Bitta elementda ikkita klass', '.muhim.katta'),
            style('size', '`.katta` shrifti 24px', '.muhim.katta', 'font-size', '24px'),
          ],
        },
      },
      {
        slug: 'id',
        title: 'Id atributi',
        exercise: {
          title: 'Xatcho‘p va yorliq',
          description: '`id` yordamida havola va forma yorlig‘ini bog‘lash.',
          instructions: md(
            '1. “Narxlar” bo‘limiga `id="narxlar"` bering.',
            '2. Sahifa tepasidagi havola shu bo‘limga olib borsin.',
            '3. Ism maydoniga `id="ism"` bering va `<label>` ni `for` atributi bilan unga bog‘lang.',
          ),
          expectedBehavior:
            'Havola “Narxlar” bo‘limiga tushiradi, “Ism” yozuviga bosilganda maydon faollashadi.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<a href="">Narxlarga o‘tish</a>
<h2>Biz haqimizda</h2>
<p>Biz 2015-yildan beri ishlaymiz.</p>
<h2>Narxlar</h2>
<p>Oylik obuna: 99 000 so‘m.</p>
<label>Ism</label>
<input type="text">`),
          ),
          checks: [
            has('section', '`id="narxlar"` elementi bor', '#narxlar'),
            has('link', 'Havola `#narxlar` ga olib boradi', 'a[href="#narxlar"]'),
            has('label', 'Yorliq `for="ism"` bilan bog‘langan', 'label[for="ism"]'),
            has('input', 'Maydonda `id="ism"`', 'input#ism'),
          ],
        },
      },
      {
        slug: 'buttons',
        title: 'Tugmalar',
        exercise: {
          title: 'Salomlashuvchi tugma',
          description: 'Bosilganda matnni o‘zgartiradigan tugma.',
          instructions: md(
            '1. `id="salom"` bo‘lgan `<button type="button">` yarating.',
            '2. Tugma bosilganda `#natija` paragrafiga **Salom!** matni yozilsin (`onclick` va `textContent`).',
            '3. Sahifaga yana bitta faolsiz (`disabled`) tugma qo‘shing.',
          ),
          expectedBehavior:
            'Tugma bosilganda paragrafda “Salom!” paydo bo‘ladi; ikkinchi tugma bosilmaydi.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<h1>Tugmalar</h1>
<p id="natija">Tugmani bosing</p>
${TODO}`),
          ),
          checks: [
            has('button', '`#salom` tugmasida `type="button"`', 'button#salom[type="button"]'),
            after(
              [{ type: 'click', selector: '#salom' }],
              text('click', 'Bosilganda “Salom!” chiqadi', '#natija', 'Salom!', {
                hint: '`onclick` ichida `#natija` elementining `textContent` ini o‘zgartiring.',
              }),
            ),
            has('disabled', 'Faolsiz tugma bor', 'button[disabled]'),
            clean(),
          ],
        },
      },
      {
        slug: 'iframes',
        title: 'Iframe',
        exercise: {
          title: 'Xavfsiz iframe',
          description: 'Iframe’ni qulay va xavfsiz joylash.',
          instructions: md(
            'Iframe’ga quyidagi atributlarni qo‘shing:',
            '',
            '- `title` — mazmun tavsifi;',
            '- `loading="lazy"`;',
            '- `sandbox` (bo‘sh qiymat bilan ham bo‘ladi).',
          ),
          expectedBehavior:
            'Iframe tavsiflangan, kechiktirib yuklanadi va imkoniyatlari cheklangan.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Ofisimiz</h1>
<iframe src="https://example.uz/xarita" width="600" height="400"></iframe>`),
          ),
          checks: [
            has('title', 'Iframe’da `title` bor', 'iframe[title]:not([title=""])'),
            attr('lazy', 'Iframe kechiktirib yuklanadi', 'iframe', 'loading', 'lazy'),
            has('sandbox', 'Iframe’da `sandbox` bor', 'iframe[sandbox]'),
          ],
        },
      },
      {
        slug: 'javascript',
        title: 'HTML va JavaScript',
        exercise: {
          title: 'Tashqi skript',
          description: 'JavaScript’ni alohida fayldan ulash.',
          instructions: md(
            '1. `app.js` faylini `index.html` ga `<script src="app.js">` bilan ulang.',
            '2. `app.js` da `#xabar` paragrafiga **JavaScript ishlayapti** matnini yozing.',
            '3. Skript elementni topa olishi uchun uni `<body>` oxirida ulang yoki `defer` ishlating.',
          ),
          expectedBehavior: 'Sahifa ochilganda paragrafda “JavaScript ishlayapti” yozuvi chiqadi.',
          difficulty: 'MEDIUM',
          starterFiles: files({
            'index.html': page(`<h1>Skriptlar</h1>
<p id="xabar">...</p>`),
            'app.js': '// Kodni shu yerga yozing\n',
          }),
          checks: [
            has('script', '`app.js` ulangan', 'script[src="app.js"]'),
            text(
              'message',
              'Paragrafda “JavaScript ishlayapti”',
              '#xabar',
              'JavaScript ishlayapti',
              {
                hint: 'Skript ishlaganda element sahifada bo‘lishi kerak — `defer` ni tekshiring.',
              },
            ),
            clean(),
          ],
        },
      },
      {
        slug: 'file-paths',
        title: 'Fayl yo‘llari',
        exercise: {
          title: 'Papkalardagi fayllar',
          description: 'Nisbiy yo‘llarni to‘g‘ri yozish.',
          instructions: md(
            'Loyihada: `index.html`, `css/style.css`, `sahifalar/aloqa.html`.',
            '',
            '1. `index.html` da CSS fayl noto‘g‘ri ulangan — yo‘lni tuzating.',
            '2. `index.html` dan `sahifalar/aloqa.html` ga havola qo‘shing.',
            '3. `aloqa.html` da bosh sahifaga qaytish havolasini (`../index.html`) yozing.',
          ),
          expectedBehavior:
            'Uslublar qo‘llanadi (sarlavha ko‘k), aloqa sahifasiga havola ishlaydi.',
          difficulty: 'MEDIUM',
          starterFiles: files({
            'index.html': page('<h1>Bosh sahifa</h1>\n<p>Xush kelibsiz!</p>', {
              head: '<link rel="stylesheet" href="style.css">',
            }),
            'css/style.css': 'h1 {\n  color: #0071dc;\n}\n',
            'sahifalar/aloqa.html': page('<h1>Aloqa</h1>\n<p>Telefon: +998 71 000 00 00</p>', {
              head: '<link rel="stylesheet" href="../css/style.css">',
            }),
          }),
          checks: [
            has(
              'css',
              'CSS to‘g‘ri yo‘l bilan ulangan',
              'link[rel="stylesheet"][href="css/style.css"]',
            ),
            style('applied', 'Uslub haqiqatan qo‘llandi', 'h1', 'color', '#0071dc', {
              hint: 'Yo‘l to‘g‘ri bo‘lsa, sarlavha ko‘k bo‘ladi.',
            }),
            has('link', 'Aloqa sahifasiga havola bor', 'a[href="sahifalar/aloqa.html"]'),
          ],
        },
      },
      {
        slug: 'head',
        title: 'Head elementi',
        exercise: {
          title: 'Sahifa ma’lumotlari',
          description: '`<head>` ichidagi muhim `<meta>` teglar.',
          instructions: md(
            '1. `viewport` meta tegini qo‘shing (`width=device-width, initial-scale=1`).',
            '2. `description` meta tegida sahifa haqida bir gap yozing.',
            '3. Ijtimoiy tarmoqlar uchun `og:title` meta tegini qo‘shing.',
          ),
          expectedBehavior:
            'Sahifa telefonda to‘g‘ri ko‘rinadi, qidiruv va ijtimoiy tarmoqlar uchun tavsifi bor.',
          difficulty: 'MEDIUM',
          starterFiles: html(`<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8">
    <title>Bahor choyxonasi</title>
  </head>
  <body>
    <h1>Bahor choyxonasi</h1>
  </body>
</html>
`),
          checks: [
            has(
              'viewport',
              '`viewport` meta tegi bor',
              'meta[name="viewport"][content*="width=device-width"]',
            ),
            has(
              'description',
              'Tavsif (`description`) bor',
              'meta[name="description"][content]:not([content=""])',
            ),
            has('og', '`og:title` bor', 'meta[property="og:title"][content]'),
          ],
        },
        quiz: quiz('6-modul testi: Sahifa tuzilmasi', [
          q(
            'q1',
            'Qaysi elementlar odatda blok elementlar?',
            ['<div>', '<p>', '<span>', '<a>'],
            [0, 1],
          ),
          q(
            'q2',
            '`class` va `id` ning asosiy farqi nima?',
            [
              '`id` sahifada bitta, `class` ko‘p elementda bo‘lishi mumkin',
              '`class` faqat bitta elementga beriladi',
              'Ular bir xil',
              '`id` faqat CSS’da ishlatiladi',
            ],
            [0],
          ),
          q(
            'q3',
            'Tugmaning standart turi (`type`) forma ichida qaysi?',
            ['button', 'submit', 'reset', 'click'],
            [1],
          ),
          q(
            'q4',
            '`css/style.css` dan bir papka yuqoridagi `index.html` ga yo‘l qanday yoziladi?',
            ['index.html', '../index.html', '/css/index.html', './css/index.html'],
            [1],
          ),
          q(
            'q5',
            'Qaysi teg `<head>` ichida yoziladi?',
            ['<meta>', '<title>', '<h1>', '<footer>'],
            [0, 1],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 7
  {
    title: 'Maket va semantika',
    lessons: [
      {
        slug: 'layout',
        title: 'Sahifa maketi',
        exercise: {
          title: 'Semantik maket',
          description: '`<div>` larni maket teglariga almashtirish.',
          instructions: md(
            'Boshlang‘ich kodda hamma qism `<div>` bilan yozilgan. Ularni mos teglarga almashtiring:',
            '',
            '- `div.header` → `<header>`;',
            '- `div.nav` → `<nav>`;',
            '- `div.main` → `<main>`;',
            '- `div.aside` → `<aside>`;',
            '- `div.footer` → `<footer>`.',
          ),
          expectedBehavior: 'Sahifa beshta semantik qismdan iborat; ko‘rinishi o‘zgarmaydi.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<div class="header"><h1>Yangiliklar</h1></div>
<div class="nav"><a href="#">Bosh sahifa</a> | <a href="#">Sport</a></div>
<div class="main">
  <h2>Bugungi asosiy yangilik</h2>
  <p>Toshkentda yangi bog‘ ochildi.</p>
</div>
<div class="aside"><p>Ob-havo: +24°C</p></div>
<div class="footer"><p>© 2026 Yangiliklar</p></div>`),
          ),
          checks: [
            has('header', '`<header>` bor', 'header'),
            has('nav', '`<nav>` bor', 'nav'),
            has('main', 'Bitta `<main>` bor', 'main', { max: 1 }),
            has('aside', '`<aside>` bor', 'aside'),
            has('footer', '`<footer>` bor', 'footer'),
          ],
        },
      },
      {
        slug: 'responsive',
        title: 'Moslashuvchan dizayn',
        exercise: {
          title: 'Telefon uchun maket',
          description: 'Media so‘rov bilan maketni kichik ekranga moslash.',
          instructions: md(
            '1. Rasmlar konteynerdan chiqib ketmasin: `img { max-width: 100%; }`.',
            '2. Media so‘rov yozing: ekran kengligi `600px` va undan kichik bo‘lsa, `.ustunlar` ning `flex-direction` qiymati `column` bo‘lsin.',
            '3. Katta ekranda ustunlar yonma-yon (`row`) qolsin.',
          ),
          expectedBehavior: 'Kompyuterda ustunlar yonma-yon, telefonda bir-birining ostida.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(
              `<div class="ustunlar">
  <section><h2>Kurslar</h2><p>60 dan ortiq dars.</p></section>
  <section><h2>Mashqlar</h2><p>Har darsda amaliyot.</p></section>
  <section><h2>Testlar</h2><p>Bilimingizni sinang.</p></section>
</div>
<img src="banner.png" alt="Kurs banneri" width="1200" height="300">`,
              { head: '<style>\n  .ustunlar { display: flex; gap: 16px; }\n</style>' },
            ),
          ),
          checks: [
            style('img', 'Rasmda `max-width: 100%`', 'img', 'max-width', '100%'),
            at(
              375,
              700,
              style(
                'mobile',
                'Telefonda ustunlar ustma-ust',
                '.ustunlar',
                'flex-direction',
                'column',
                {
                  hint: '`@media (max-width: 600px) { ... }` ichida yozing.',
                },
              ),
            ),
            at(
              1024,
              768,
              style(
                'desktop',
                'Kompyuterda ustunlar yonma-yon',
                '.ustunlar',
                'flex-direction',
                'row',
              ),
            ),
          ],
        },
      },
      {
        slug: 'computercode',
        title: 'Kod elementlari',
        exercise: {
          title: 'Qo‘llanma sahifasi',
          description: 'Kod, tugmalar va dastur natijasini to‘g‘ri belgilash.',
          instructions: md(
            '1. `Ctrl` va `S` tugmalarini alohida `<kbd>` ga oling.',
            '2. Kod blokini `<pre><code>` ichiga oling.',
            '3. Dastur chiqargan natijani `<samp>` bilan belgilang.',
          ),
          expectedBehavior: 'Tugmalar, kod bloki va natija o‘ziga xos ko‘rinishda.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Faylni saqlash</h1>
<p>Saqlash uchun Ctrl + S ni bosing.</p>
<p>console.log("Saqlandi");</p>
<p>Natija: Saqlandi</p>`),
          ),
          checks: [
            has('kbd', 'Kamida 2 ta `<kbd>`', 'kbd', { min: 2 }),
            has('pre-code', 'Kod bloki `<pre><code>` ichida', 'pre > code'),
            has('samp', 'Natija `<samp>` bilan belgilangan', 'samp'),
          ],
        },
      },
      {
        slug: 'semantics',
        title: 'Semantik elementlar',
        exercise: {
          title: 'Maqola va savol-javob',
          description: '`<article>`, `<section>` va `<details>` dan foydalanish.',
          instructions: md(
            '1. Blog postini `<article>` ga oling, sarlavhasi `<h2>` bo‘lsin.',
            '2. Postdagi qismlarni kamida ikkita `<section>` ga ajrating.',
            '3. “Ko‘p so‘raladigan savollar”ni `<details>` + `<summary>` bilan yozing.',
          ),
          expectedBehavior:
            'Post semantik qismlarga ajratilgan, savolga bosilganda javob ochiladi.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<div>
  <h2>HTML’ni qanday o‘rgandim</h2>
  <p>Avval teglar bilan tanishdim.</p>
  <p>Keyin kichik loyihalar qildim.</p>
</div>
<h3>Ko‘p so‘raladigan savollar</h3>
<p>Kurs qancha davom etadi? — Taxminan 2 oy.</p>`),
          ),
          checks: [
            has('article', '`<article>` ichida `<h2>`', 'article h2'),
            has('sections', 'Kamida 2 ta `<section>`', 'article section', { min: 2 }),
            has('details', '`<details>` ichida `<summary>`', 'details > summary'),
            after(
              [{ type: 'click', selector: 'details > summary' }],
              has('open', 'Savolga bosilganda javob ochiladi', 'details[open]'),
            ),
          ],
        },
      },
      {
        slug: 'style-guide',
        title: 'Kod yozish uslubi',
        exercise: {
          title: 'Kodni tartibga keltirish',
          description: 'Qoidalarga mos, toza HTML.',
          instructions: md(
            'Boshlang‘ich kod ishlaydi, lekin qoidalarga mos emas. Tuzating:',
            '',
            '1. `<html>` ga `lang="uz"` qo‘shing.',
            '2. `<meta charset="UTF-8">` qo‘shing.',
            '3. Rasmga `alt`, `width` va `height` bering.',
            '4. Teglarni kichik harflarda yozing va chekinishlarni to‘g‘rilang.',
          ),
          expectedBehavior:
            'Til va kodirovka e’lon qilingan, rasm to‘liq tavsiflangan, kod o‘qilishi oson.',
          difficulty: 'EASY',
          starterFiles: html(`<!DOCTYPE html>
<HTML>
<HEAD>
<TITLE>Galereya</TITLE>
</HEAD>
<BODY>
<H1>Galereya</H1>
<IMG SRC=tog.jpg>
<P>Chimyon tog‘lari, qishda.</P>
</BODY>
</HTML>
`),
          checks: [
            attr('lang', '`<html>` da `lang="uz"`', 'html', 'lang', 'uz'),
            has('charset', 'Kodirovka e’lon qilingan', 'meta[charset]'),
            has('img', 'Rasmda `alt`, `width`, `height`', 'img[alt]:not([alt=""])[width][height]'),
          ],
        },
        quiz: quiz('7-modul testi: Maket va semantika', [
          q(
            'q1',
            'Sahifaning asosiy, takrorlanmaydigan mazmuni qaysi tegda bo‘ladi?',
            ['<main>', '<section>', '<aside>', '<body>'],
            [0],
          ),
          q(
            'q2',
            'Moslashuvchan sahifa uchun `<head>` da nima bo‘lishi shart?',
            [
              '<meta name="viewport" content="width=device-width, initial-scale=1">',
              '<meta name="mobile" content="yes">',
              '<meta charset="mobile">',
              '<link rel="responsive">',
            ],
            [0],
          ),
          q(
            'q3',
            'Klaviatura tugmasini belgilash uchun qaysi teg?',
            ['<kbd>', '<code>', '<key>', '<samp>'],
            [0],
          ),
          q(
            'q4',
            'Semantik teglar nima uchun foydali?',
            [
              'Ekran o‘qiydigan dasturlar sahifani yaxshiroq tushunadi',
              'Qidiruv tizimlari mazmunni yaxshiroq tushunadi',
              'Sahifa avtomatik chiroyli bo‘ladi',
              'Kodni o‘qish osonlashadi',
            ],
            [0, 1, 3],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 8
  {
    title: 'Belgilar va kodlash',
    lessons: [
      {
        slug: 'entities',
        title: 'Maxsus belgilar (entity)',
        exercise: {
          title: 'Tegni matn sifatida ko‘rsatish',
          description: 'HTML entity’lar bilan maxsus belgilarni yozish.',
          instructions: md(
            '1. `#teg` paragrafida `<h1>` yozuvi **matn sifatida** ko‘rinsin (`&lt;` va `&gt;`).',
            '2. `#taqqos` paragrafida `5 < 10` yozuvi ko‘rinsin.',
            '3. Footer’da mualliflik belgisi `©` bo‘lsin (`&copy;`).',
          ),
          expectedBehavior:
            'Sahifada “<h1>” va “5 < 10” matn sifatida ko‘rinadi, footer’da © belgisi.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<p id="teg">Sarlavha uchun ... tegi ishlatiladi.</p>
<p id="taqqos">Masalan: 5 ... 10</p>
<footer>2026 Webdizayn</footer>`),
          ),
          checks: [
            text('tag', '“<h1>” matn sifatida ko‘rinadi', '#teg', '<h1>', {
              hint: '`<` belgisini `&lt;`, `>` ni `&gt;` bilan yozing.',
            }),
            text('compare', '“5 < 10” ko‘rinadi', '#taqqos', '5 < 10'),
            text('copy', 'Footer’da © bor', 'footer', '©'),
          ],
        },
      },
      {
        slug: 'symbols',
        title: 'Belgilar',
        exercise: {
          title: 'Matematika va valyuta',
          description: 'Klaviaturada yo‘q belgilarni yozish.',
          instructions: md(
            '1. `#formula` da `π` va `∑` belgilari bo‘lsin (`&pi;`, `&sum;`).',
            '2. `#yonalish` da `→` strelkasi bo‘lsin (`&rarr;`).',
            '3. `#narx` da `€` belgisi bo‘lsin (`&euro;`).',
          ),
          expectedBehavior: 'Formulalar, strelka va valyuta belgisi to‘g‘ri ko‘rinadi.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<p id="formula">Aylana yuzi: ... · r²; yig‘indi belgisi: ...</p>
<p id="yonalish">Toshkent ... Samarqand</p>
<p id="narx">Narxi: 10 ...</p>`),
          ),
          checks: [
            text('pi', '`π` belgisi bor', '#formula', 'π'),
            text('sum', '`∑` belgisi bor', '#formula', '∑'),
            text('arrow', '`→` strelkasi bor', '#yonalish', '→'),
            text('euro', '`€` belgisi bor', '#narx', '€'),
          ],
        },
      },
      {
        slug: 'emojis',
        title: 'Emojilar',
        exercise: {
          title: 'Emoji va qulaylik',
          description: 'Emoji’ni kod bilan yozish va ekran o‘qiydigan dasturlar uchun izohlash.',
          instructions: md(
            '1. Sarlavhaga raketa emoji’sini qo‘shing: `&#128640;` (🚀).',
            '2. Paragrafdagi yurak emoji’sini `<span role="img" aria-label="yurak">` ichiga oling.',
          ),
          expectedBehavior:
            'Sarlavhada 🚀, yurak emoji’si ekran o‘qiydigan dastur uchun izohlangan.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Startap kuni</h1>
<p>Barcha ishtirokchilarga ❤ bilan rahmat!</p>`),
          ),
          checks: [
            text('rocket', 'Sarlavhada 🚀 bor', 'h1', '🚀'),
            has(
              'label',
              'Emoji `role="img"` va `aria-label` bilan',
              'span[role="img"][aria-label]',
            ),
          ],
        },
      },
      { slug: 'charsets', title: 'Kodirovka (charset)' },
      { slug: 'url-encode', title: 'URL kodlash' },
      {
        slug: 'html-vs-xhtml',
        title: 'HTML va XHTML',
        quiz: quiz('8-modul testi: Belgilar va kodlash', [
          q(
            'q1',
            '`<` belgisini matn sifatida ko‘rsatish uchun nima yoziladi?',
            ['&lt;', '&gt;', '&amp;', '&nbsp;'],
            [0],
          ),
          q(
            'q2',
            'Zamonaviy sahifalar uchun tavsiya etiladigan kodirovka?',
            ['UTF-8', 'ASCII', 'Windows-1251', 'ISO-8859-1'],
            [0],
          ),
          q('q3', 'Bo‘sh joy URL’da qanday kodlanadi?', ['%20', '&nbsp;', '_', '\\s'], [0]),
          q(
            'q4',
            'XHTML’ga xos qoidalar qaysilar?',
            [
              'Barcha teglar yopilishi shart',
              'Teglar kichik harflarda yoziladi',
              'Atribut qiymatlari tirnoqda bo‘lishi shart',
              'Rasmlar ishlatilmaydi',
            ],
            [0, 1, 2],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 9
  {
    title: 'Formalar',
    lessons: [
      {
        slug: 'forms',
        title: 'Formalar',
        exercise: {
          title: 'Ro‘yxatdan o‘tish formasi',
          description: 'Yorliqli maydonlar va yuborish tugmasi.',
          instructions: md(
            '1. `<form>` ichida `id="ism"` va `name="ism"` bo‘lgan matn maydoni yarating.',
            '2. Unga `<label for="ism">` yorlig‘ini bog‘lang.',
            '3. `type="email"` va `name` atributi bor maydon qo‘shing.',
            '4. Formani yuborish tugmasini qo‘shing (`type="submit"`).',
          ),
          expectedBehavior: 'Ikki maydonli forma: ism va email, pastida yuborish tugmasi.',
          difficulty: 'EASY',
          starterFiles: html(page(`<h1>Kursga yozilish</h1>\n${TODO}`)),
          checks: [
            has('field', 'Formada `#ism` maydoni `name` bilan', 'form input#ism[name]'),
            has('label', 'Yorliq maydonga bog‘langan', 'form label[for="ism"]'),
            has('email', 'Email maydoni bor', 'form input[type="email"][name]'),
            has(
              'submit',
              'Yuborish tugmasi bor',
              'form button[type="submit"], form input[type="submit"]',
            ),
          ],
        },
      },
      {
        slug: 'form-attributes',
        title: 'Forma atributlari',
        exercise: {
          title: 'Forma sozlamalari',
          description: '`action`, `method` va `autocomplete`.',
          instructions: md(
            '1. Forma `/royxat` manziliga yuborilsin (`action`).',
            '2. Ma’lumot `post` usulida yuborilsin (`method`).',
            '3. Brauzer avtomatik to‘ldirmasin: `autocomplete="off"`.',
          ),
          expectedBehavior: 'Forma `/royxat` ga POST usulida, avtomatik to‘ldirishsiz yuboriladi.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<form>
  <label for="kod">Promo-kod</label>
  <input id="kod" name="kod">
  <button type="submit">Yuborish</button>
</form>`),
          ),
          checks: [
            attr('action', 'Forma `/royxat` ga yuboriladi', 'form', 'action', '/royxat'),
            attr('method', 'Usul — `post`', 'form', 'method', 'post', {
              hint: 'Qiymatni kichik harflarda yozing: `method="post"`.',
            }),
            attr('autocomplete', 'Avtomatik to‘ldirish o‘chirilgan', 'form', 'autocomplete', 'off'),
          ],
        },
      },
      {
        slug: 'form-elements',
        title: 'Forma elementlari',
        exercise: {
          title: 'Buyurtma formasi',
          description: '`select`, `textarea`, `fieldset` va `datalist`.',
          instructions: md(
            '1. Kamida 3 variantli `<select>` (masalan, o‘lcham).',
            '2. Izoh uchun `<textarea>`.',
            '3. Yetkazish maydonlarini `<fieldset>` + `<legend>` bilan guruhlang.',
            '4. Shahar maydoni uchun `<datalist>` bilan takliflar bering (`list` atributi orqali bog‘lang).',
          ),
          expectedBehavior:
            'Tanlov ro‘yxati, izoh maydoni, guruhlangan manzil va shahar takliflari bor forma.',
          difficulty: 'MEDIUM',
          starterFiles: html(page(`<h1>Pitsa buyurtmasi</h1>\n<form>\n  ${TODO}\n</form>`)),
          checks: [
            has('select', '`<select>` da kamida 3 variant', 'form select option', { min: 3 }),
            has('textarea', '`<textarea>` bor', 'form textarea'),
            has('fieldset', '`<fieldset>` ichida `<legend>`', 'form fieldset > legend'),
            has('datalist', 'Maydon `datalist` ga bog‘langan', 'input[list]'),
            has('options', '`datalist` da takliflar bor', 'datalist option', { min: 2 }),
          ],
        },
      },
      {
        slug: 'input-types',
        title: 'Input turlari',
        exercise: {
          title: 'Anketa',
          description: 'Ma’lumotga mos `type` tanlash.',
          instructions: md(
            'Quyidagi turdagi maydonlarni yarating:',
            '',
            '- telefon — `tel`;',
            '- yosh — `number`;',
            '- tug‘ilgan sana — `date`;',
            '- sevimli rang — `color`;',
            '- jinsi — ikkita `radio` (bir xil `name` bilan);',
            '- obuna — `checkbox`.',
          ),
          expectedBehavior: 'Har bir maydon ma’lumotiga mos klaviatura yoki tanlagich ochadi.',
          difficulty: 'MEDIUM',
          starterFiles: html(page(`<h1>Anketa</h1>\n<form>\n  ${TODO}\n</form>`)),
          checks: [
            has('tel', 'Telefon maydoni `tel`', 'input[type="tel"]'),
            has('number', 'Yosh maydoni `number`', 'input[type="number"]'),
            has('date', 'Sana maydoni `date`', 'input[type="date"]'),
            has('color', 'Rang maydoni `color`', 'input[type="color"]'),
            has('radio', 'Kamida ikkita `radio`', 'input[type="radio"][name]', { min: 2 }),
            has('checkbox', '`checkbox` bor', 'input[type="checkbox"]'),
          ],
        },
      },
      {
        slug: 'input-attributes',
        title: 'Input atributlari',
        exercise: {
          title: 'Brauzer tekshiruvi',
          description: 'Maydonlarni HTML atributlari bilan cheklash.',
          instructions: md(
            '1. `#ism` majburiy (`required`), ko‘rsatmasi bor (`placeholder`), 30 belgidan oshmasin (`maxlength="30"`).',
            '2. `#yosh` — `number`, `min="7"`, `max="99"`.',
            '3. `#kod` faqat 4 ta raqam qabul qilsin: `pattern="[0-9]{4}"`.',
          ),
          expectedBehavior: 'Noto‘g‘ri qiymat kiritilsa, brauzer maydonni xato deb belgilaydi.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<form>
  <label for="ism">Ism</label>
  <input id="ism" name="ism">
  <label for="yosh">Yosh</label>
  <input id="yosh" name="yosh">
  <label for="kod">SMS kod</label>
  <input id="kod" name="kod">
  <button type="submit">Yuborish</button>
</form>`),
          ),
          checks: [
            has('required', '`#ism` majburiy, ko‘rsatmali', '#ism[required][placeholder]'),
            attr('maxlength', '`#ism` 30 belgigacha', '#ism', 'maxlength', '30'),
            after(
              [{ type: 'fill', selector: '#yosh', value: '5' }],
              has('min', '5 yosh qabul qilinmaydi', '#yosh:invalid', {
                hint: '`type="number"` va `min="7"` ni tekshiring.',
              }),
            ),
            after(
              [{ type: 'fill', selector: '#yosh', value: '120' }],
              has('max', '120 yosh qabul qilinmaydi', '#yosh:invalid'),
            ),
            after(
              [{ type: 'fill', selector: '#kod', value: '12a4' }],
              has('pattern', 'Harfli kod qabul qilinmaydi', '#kod:invalid'),
            ),
            after(
              [{ type: 'fill', selector: '#kod', value: '1234' }],
              has('pattern-ok', 'To‘g‘ri kod qabul qilinadi', '#kod:valid', { hidden: true }),
            ),
          ],
        },
      },
      {
        slug: 'input-form-attributes',
        title: 'Inputning forma atributlari',
        exercise: {
          title: 'Qoralama va yuborish',
          description: '`form`, `formaction` va `formnovalidate`.',
          instructions: md(
            '1. Formaga `id="anketa"` bering.',
            '2. Formadan tashqaridagi izoh maydonini `form="anketa"` bilan formaga bog‘lang.',
            '3. “Qoralama” tugmasi `/qoralama` ga yuborsin (`formaction`) va tekshiruvsiz ishlasin (`formnovalidate`).',
          ),
          expectedBehavior:
            'Izoh maydoni ham forma bilan yuboriladi; “Qoralama” tugmasi alohida manzilga yuboradi.',
          difficulty: 'HARD',
          starterFiles: html(
            page(`<form action="/yuborish" method="post">
  <label for="mavzu">Mavzu</label>
  <input id="mavzu" name="mavzu" required>
  <button type="submit">Yuborish</button>
  <button type="submit">Qoralama</button>
</form>

<label for="izoh">Izoh</label>
<textarea id="izoh" name="izoh"></textarea>`),
          ),
          checks: [
            has('form', 'Formada `id="anketa"`', 'form#anketa'),
            has('outside', 'Tashqi maydon formaga bog‘langan', '#izoh[form="anketa"]'),
            attr(
              'formaction',
              '“Qoralama” `/qoralama` ga yuboradi',
              'button[formaction]',
              'formaction',
              '/qoralama',
            ),
            has(
              'novalidate',
              '“Qoralama” tekshiruvsiz yuboradi',
              'button[formaction][formnovalidate]',
            ),
          ],
        },
        quiz: quiz('9-modul testi: Formalar', [
          q(
            'q1',
            'Forma ma’lumoti serverda qaysi atribut bo‘yicha nomlanadi?',
            ['name', 'id', 'class', 'label'],
            [0],
          ),
          q(
            'q2',
            'Parol kabi maxfiy ma’lumot qaysi usulda yuborilishi kerak?',
            ['post', 'get', 'put', 'Farqi yo‘q'],
            [0],
          ),
          q(
            'q3',
            'Maydonni majburiy qilish uchun qaysi atribut?',
            ['required', 'must', 'validate', 'needed'],
            [0],
          ),
          q(
            'q4',
            'Ro‘yxatdan bitta variant tanlash uchun qaysilar mos?',
            ['<select>', 'type="radio"', 'type="checkbox"', '<textarea>'],
            [0, 1],
          ),
          q(
            'q5',
            '`<label for="x">` qaysi elementga bog‘lanadi?',
            [
              '`id="x"` bo‘lgan maydonga',
              '`name="x"` bo‘lgan maydonga',
              '`class="x"` bo‘lgan maydonga',
              'Keyingi har qanday elementga',
            ],
            [0],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 10
  {
    title: 'Grafika',
    lessons: [
      {
        slug: 'canvas',
        title: 'Canvas',
        exercise: {
          title: 'Birinchi chizma',
          description: 'Canvas’da JavaScript bilan chizish.',
          instructions: md(
            '1. `id="mato"`, `width="300"`, `height="150"` bo‘lgan `<canvas>` yarating.',
            '2. Chizma nimani ko‘rsatishini `aria-label` da yozing.',
            "3. Skriptda `getContext('2d')` orqali kamida bitta to‘rtburchak (`fillRect`) va bitta aylana (`arc`) chizing.",
          ),
          expectedBehavior:
            'Canvas’da rangli to‘rtburchak va aylana chizilgan, konsolda xato yo‘q.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<h1>Chizma</h1>\n${TODO}\n<script>\n  // Chizish kodi\n</script>`),
          ),
          checks: [
            has('canvas', '`#mato` 300×150', 'canvas#mato[width="300"][height="150"]'),
            has('label', 'Canvas’da `aria-label` bor', 'canvas[aria-label]'),
            has('script', 'Chizish skripti bor', 'script'),
            clean(),
          ],
        },
      },
      {
        slug: 'svg',
        title: 'SVG',
        exercise: {
          title: 'SVG logotip',
          description: 'Oddiy shakllardan vektor rasm.',
          instructions: md(
            '1. Sahifaga `viewBox` atributi bor `<svg>` qo‘shing.',
            '2. Ichida kamida bitta `<rect>` va bitta `<circle>` bo‘lsin; aylanaga `fill` rang bering.',
            '3. Qulaylik uchun `<svg>` ga `role="img"` va `aria-label` qo‘shing.',
          ),
          expectedBehavior: 'To‘rtburchak va rangli aylanadan iborat logotip.',
          difficulty: 'MEDIUM',
          starterFiles: html(page(`<h1>Logotip</h1>\n${TODO}`)),
          checks: [
            has('svg', '`<svg>` da `viewBox` bor', 'svg[viewBox]'),
            has('rect', '`<rect>` bor', 'svg rect'),
            has('circle', 'Aylanada `fill` rang bor', 'svg circle[fill]'),
            has('a11y', 'SVG `role="img"` va `aria-label` bilan', 'svg[role="img"][aria-label]'),
          ],
        },
        quiz: quiz('10-modul testi: Grafika', [
          q(
            'q1',
            'Canvas’da chizish qaysi til yordamida bajariladi?',
            ['JavaScript', 'CSS', 'Faqat HTML', 'SQL'],
            [0],
          ),
          q(
            'q2',
            'Canvas koordinatalari qayerdan boshlanadi?',
            ['Chap yuqori burchak', 'Markaz', 'Chap pastki burchak', 'O‘ng yuqori burchak'],
            [0],
          ),
          q(
            'q3',
            'SVG’ning afzalliklari qaysilar?',
            [
              'Kattalashtirganda sifat yo‘qolmaydi',
              'Elementlariga CSS va hodisalar biriktirish mumkin',
              'Foto uchun eng yaxshi format',
              'Har doim canvas’dan tezroq',
            ],
            [0, 1],
          ),
          q(
            'q4',
            'SVG’da aylana qaysi teg bilan chiziladi?',
            ['<circle>', '<round>', '<arc>', '<oval>'],
            [0],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 11
  {
    title: 'Media',
    lessons: [
      { slug: 'media', title: 'Multimedia' },
      {
        slug: 'video',
        title: 'Video',
        exercise: {
          title: 'Video pleer',
          description: 'Bir nechta formatli, subtitrli video.',
          instructions: md(
            '1. `controls` va `poster` atributlari bor `<video>` yarating.',
            '2. Ichiga ikkita `<source>` qo‘shing: `video/mp4` va `video/webm`.',
            '3. `kind="subtitles"` va `srclang="uz"` bo‘lgan `<track>` qo‘shing.',
          ),
          expectedBehavior:
            'Boshqaruv tugmalari, muqova rasmi, ikki format va o‘zbekcha subtitrli video.',
          difficulty: 'MEDIUM',
          starterFiles: html(page(`<h1>Dars videosi</h1>\n${TODO}`)),
          checks: [
            has('video', 'Videoda `controls` va `poster`', 'video[controls][poster]'),
            has('mp4', 'MP4 manbasi bor', 'video source[type="video/mp4"]'),
            has('webm', 'WebM manbasi bor', 'video source[type="video/webm"]'),
            has('track', 'O‘zbekcha subtitr bor', 'video track[kind="subtitles"][srclang="uz"]'),
          ],
        },
      },
      {
        slug: 'audio',
        title: 'Audio',
        exercise: {
          title: 'Podkast qismi',
          description: 'Audio pleer va yuklab olish havolasi.',
          instructions: md(
            '1. `controls` va `preload="metadata"` bo‘lgan `<audio>` yarating.',
            '2. Ichiga `type="audio/mpeg"` bo‘lgan `<source>` qo‘shing.',
            '3. Audio faylni yuklab olish uchun `download` atributli havola qo‘shing.',
          ),
          expectedBehavior:
            'Pleer ko‘rinadi, fayl to‘liq oldindan yuklanmaydi, yuklab olish havolasi bor.',
          difficulty: 'EASY',
          starterFiles: html(page(`<h2>3-qism: Veb-dizayn tarixi</h2>\n${TODO}`)),
          checks: [
            has('audio', 'Pleerda `controls`', 'audio[controls]'),
            attr(
              'preload',
              'Faqat metama’lumot oldindan yuklanadi',
              'audio',
              'preload',
              'metadata',
            ),
            has('source', 'MP3 manbasi bor', 'audio source[type="audio/mpeg"]'),
            has('download', 'Yuklab olish havolasi bor', 'a[download]'),
          ],
        },
      },
      { slug: 'plugins', title: 'Plaginlar' },
      {
        slug: 'youtube',
        title: 'YouTube videolari',
        exercise: {
          title: 'Videoni joylashtirish',
          description: 'YouTube videoni iframe orqali qo‘shish.',
          instructions: md(
            '1. `src` manzili `https://www.youtube.com/embed/` bilan boshlanadigan `<iframe>` qo‘shing (istalgan video ID).',
            '2. `title` va `allowfullscreen` atributlarini qo‘shing.',
            '3. Video ovozsiz boshlansin: manzil oxiriga `?mute=1` qo‘shing.',
          ),
          expectedBehavior:
            'Sahifada ovozsiz boshlanadigan, to‘liq ekranga ruxsat berilgan YouTube pleeri.',
          difficulty: 'EASY',
          starterFiles: html(
            page(`<h1>Dars videosi</h1>
<iframe src="https://www.youtube.com/watch?v=abc123" width="560" height="315"></iframe>`),
          ),
          checks: [
            has(
              'embed',
              'Manzilda `embed/` ishlatilgan',
              'iframe[src^="https://www.youtube.com/embed/"]',
              {
                hint: '`watch?v=` emas, `embed/VIDEO_ID` bo‘lishi kerak.',
              },
            ),
            has('title', 'Iframe’da `title` bor', 'iframe[title]:not([title=""])'),
            has('fullscreen', 'To‘liq ekranga ruxsat bor', 'iframe[allowfullscreen]'),
            has('mute', 'Video ovozsiz boshlanadi', 'iframe[src*="mute=1"]'),
          ],
        },
        quiz: quiz('11-modul testi: Media', [
          q(
            'q1',
            'Eng ko‘p qo‘llab-quvvatlanadigan video formati?',
            ['MP4', 'AVI', 'FLV', 'MOV'],
            [0],
          ),
          q(
            'q2',
            'Brauzerlar `autoplay` ni odatda qaysi shart bilan ruxsat beradi?',
            [
              'Video ovozsiz (`muted`) bo‘lsa',
              'Video qisqa bo‘lsa',
              'Sahifada `<audio>` bo‘lmasa',
              'Hech qachon',
            ],
            [0],
          ),
          q(
            'q3',
            'Subtitr qaysi element bilan qo‘shiladi?',
            ['<track>', '<caption>', '<subtitle>', '<source>'],
            [0],
          ),
          q(
            'q4',
            'Nima uchun Flash kabi plaginlardan voz kechildi?',
            [
              'Xavfsizlik muammolari ko‘p edi',
              'Telefonlarda deyarli ishlamasdi',
              'HTML5 o‘zi video va grafikani qo‘llab-quvvatlaydi',
              'Ular bepul emas edi',
            ],
            [0, 1, 2],
          ),
        ]),
      },
    ],
  },

  // ---------------------------------------------------------------- 12
  {
    title: 'Web API',
    lessons: [
      { slug: 'web-apis', title: 'Web API bilan tanishuv' },
      { slug: 'geolocation', title: 'Geolocation API' },
      {
        slug: 'drag-drop',
        title: 'Drag and Drop',
        exercise: {
          title: 'Vazifalar taxtasi',
          description: 'Kartochkani boshqa ustunga sudrab o‘tkazish.',
          instructions: md(
            '1. `.vazifa` kartochkalariga `draggable="true"` bering.',
            '2. `dragstart` da kartochka `id` sini `dataTransfer` ga yozing.',
            '3. `#bajarildi` ustunida `dragover` (`preventDefault()`) va `drop` hodisalarini ishlang.',
          ),
          expectedBehavior:
            'Kartochkani “Bajarildi” ustuniga sudrab tashlash mumkin, konsolda xato yo‘q.',
          difficulty: 'HARD',
          starterFiles: html(
            page(
              `<div class="ustun" id="rejada">
  <h2>Rejada</h2>
  <p class="vazifa" id="v1">HTML darsini o‘qish</p>
  <p class="vazifa" id="v2">Mashqni bajarish</p>
</div>
<div class="ustun" id="bajarildi">
  <h2>Bajarildi</h2>
</div>
<script>
  // Kodni shu yerga yozing
</script>`,
              {
                head: '<style>\n  .ustun { min-height: 120px; border: 2px dashed #0071dc; padding: 8px; margin: 8px 0; }\n</style>',
              },
            ),
          ),
          checks: [
            has('draggable', 'Kartochkalar sudraladi', '.vazifa[draggable="true"]', { min: 2 }),
            has('zone', '“Bajarildi” ustuni joyida', '#bajarildi'),
            clean(),
          ],
        },
      },
      {
        slug: 'popover',
        title: 'Popover',
        exercise: {
          title: 'Yordam oynasi',
          description: 'JavaScript’siz ochiladigan popover.',
          instructions: md(
            '1. `id="yordam"` bo‘lgan elementga `popover` atributini qo‘shing.',
            '2. “Yordam” tugmasi uni ochsin: `popovertarget="yordam"`.',
            '3. Popover ichida uni yopadigan tugma bo‘lsin (`popovertargetaction="hide"`).',
          ),
          expectedBehavior:
            '“Yordam” tugmasi bosilganda yordam oynasi ochiladi, ichidagi tugma uni yopadi.',
          difficulty: 'MEDIUM',
          starterFiles: html(
            page(`<label for="parol">Parol</label>
<input id="parol" type="password">
<button type="button">Yordam</button>

<div id="yordam">
  <p>Parol kamida 8 belgidan iborat bo‘lsin.</p>
</div>`),
          ),
          checks: [
            has('popover', '`#yordam` popover', '#yordam[popover]'),
            has('target', 'Tugma popover’ni ochadi', 'button[popovertarget="yordam"]'),
            after(
              [
                {
                  type: 'click',
                  selector: 'button[popovertarget="yordam"]:not([popovertargetaction="hide"])',
                },
              ],
              has('opens', 'Bosilganda oyna ochiladi', '#yordam:popover-open'),
            ),
            has('close', 'Yopish tugmasi bor', '#yordam button[popovertargetaction="hide"]'),
          ],
        },
      },
      { slug: 'web-storage', title: 'Web Storage' },
      { slug: 'web-workers', title: 'Web Workers' },
      {
        slug: 'sse',
        title: 'Server-Sent Events',
        quiz: quiz('12-modul testi: Web API', [
          q(
            'q1',
            'Joylashuvni aniqlashdan oldin brauzer nima qiladi?',
            [
              'Foydalanuvchidan ruxsat so‘raydi',
              'Hech narsa',
              'Sahifani qayta yuklaydi',
              'Serverdan parol so‘raydi',
            ],
            [0],
          ),
          q(
            'q2',
            '`localStorage` va `sessionStorage` farqi?',
            [
              '`sessionStorage` tab yopilganda o‘chadi',
              '`localStorage` faqat raqam saqlaydi',
              '`sessionStorage` serverda saqlanadi',
              'Farqi yo‘q',
            ],
            [0],
          ),
          q(
            'q3',
            'Web Worker’da nima mavjud emas?',
            ['DOM (`document`)', '`postMessage`', 'Sikllar', 'Matematik hisob'],
            [0],
          ),
          q(
            'q4',
            '`drop` hodisasi ishlashi uchun `dragover` da nima chaqirilishi kerak?',
            ['preventDefault()', 'stopPropagation()', 'setData()', 'Hech narsa'],
            [0],
          ),
          q(
            'q5',
            'Server-Sent Events’ning xususiyatlari qaysilar?',
            [
              'Xabarlar serverdan brauzerga keladi',
              'Uzilganda brauzer avtomatik qayta ulanadi',
              'Brauzer `EventSource` orqali ulanadi',
              'Ikki tomonlama aloqa',
            ],
            [0, 1, 2],
          ),
        ]),
      },
    ],
  },
];
