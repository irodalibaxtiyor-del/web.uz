import { codeFill, fill, miniQuiz, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the "Moslashuvchan dizayn" course: three questions per exercise. */
export const RWD_MINI_QUIZZES: Record<string, QuizDef> = {
  nima: miniQuiz([
    why(
      codeFill('q1', 'Qotgan kenglikni suyuq qiling.', '.sahifa {\n  {{1}}: 960px;\n}', [
        'max-width',
      ]),
      'Tor ekranda qisqaradi.',
    ),
    why(
      codeFill('q2', 'Markazlash (mantiqiy xususiyat).', '.sahifa {\n  {{1}}: auto;\n}', [
        'margin-inline',
      ]),
      'Chap va o‘ng marginlar.',
    ),
    why(
      tf('q3', '`width: 960px` telefonda gorizontal aylantirishga sabab bo‘ladi.', true),
      'Qat’iy kenglik qisqarmaydi.',
    ),
  ]),
  viewport: miniQuiz([
    why(
      codeFill(
        'q1',
        'To‘g‘ri viewport.',
        '<meta name="viewport" content="width=device-width, {{1}}=1">',
        ['initial-scale'],
      ),
      'Boshqa qismlar kerak emas.',
    ),
    why(
      codeFill(
        'q2',
        'Rasm konteynerdan chiqmasin.',
        '.rasm {\n  {{1}}: 100%;\n  height: auto;\n}',
        ['max-width'],
      ),
      'Proporsiya saqlanadi.',
    ),
    why(tf('q3', 'Bosish maydoni kamida 44px bo‘lishi telefonda qulay.', true), 'Barmoq uchun.'),
  ]),
  'avval-mobil': miniQuiz([
    why(tf('q1', 'Standart holda (media so‘rovsiz) kartalar bitta ustunda.', true), 'Avval mobil.'),
    why(
      codeFill(
        'q2',
        'Kattaroq ekranda 2 ustun.',
        '@media ({{1}}: 40em) {\n  .kartalar { grid-template-columns: 1fr 1fr; }\n}',
        ['min-width'],
      ),
      'Qo‘shimcha uslub.',
    ),
    why(order('q3', 'Ustunlar soni.', ['1 (standart)', '2', '3']), 'Kenglik oshgani sari.'),
  ]),
  birliklar: miniQuiz([
    why(
      fill('q1', 'Hisoblang (asos 16px).', 'h1: 2rem = {{1}}px', ['32']),
      'rem — ildiz shriftiga nisbatan.',
    ),
    why(
      q(
        'q2',
        '`font-size: 0.875em` nimaga nisbatan?',
        ['Ota elementning shrifti', 'html shrifti', 'Ekran kengligi', 'Piksel'],
        [0],
      ),
      'em — ota matnga.',
    ),
    why(tf('q3', '`.yon { width: 25% }` ota kengligining choragi.', true), 'Foiz — ota elementga.'),
  ]),
  'suyuq-olchamlar': miniQuiz([
    why(
      codeFill(
        'q1',
        'Konteyner chetlari va maksimal kenglik.',
        '.konteyner {\n  width: {{1}}(100% - 2rem, 70rem);\n}',
        ['min'],
      ),
      'Kichigi olinadi.',
    ),
    why(
      codeFill(
        'q2',
        'Suyuq sarlavha.',
        'h1 {\n  font-size: {{1}}(1.5rem, 1rem + 2.5vw, 3rem);\n}',
        ['clamp'],
      ),
      'Min, ideal, max.',
    ),
    why(
      tf('q3', '`min()` va `clamp()` ko‘p hollarda media so‘rovni almashtiradi.', true),
      'Silliq moslashuv.',
    ),
  ]),
  'sorov-sintaksisi': miniQuiz([
    why(
      codeFill('q1', 'Diapazon yozuvi: 768px va kengroq.', '@media (width {{1}} 768px) { … }', [
        '>=',
      ]),
      'Klassik `min-width: 768px` bilan bir xil.',
    ),
    why(
      q(
        'q2',
        'Faqat 768 dan 1024 gacha?',
        ['(768px <= width < 1024px)', '(width = 768px)', '(min-width: 1024px)', '(width > 1024px)'],
        [0],
      ),
      'Ikki shartli oraliq yozuvi.',
    ),
    why(
      tf('q3', 'Vergul bilan ajratilgan so‘rovlar “yoki” ma’nosini beradi.', true),
      '`and` — “va”.',
    ),
  ]),
  'tanaffus-nuqtalari': miniQuiz([
    why(fill('q1', 'Hisoblang.', '40em = {{1}}px (asos 16px)', ['640']), '40 × 16 = 640 piksel.'),
    why(
      tf(
        'q2',
        '`em` dagi tanaffus nuqtasi foydalanuvchi shriftni kattalashtirsa, maketni ham moslaydi.',
        true,
      ),
      'Matn kattalashsa, kechroq kengayadi.',
    ),
    why(
      q(
        'q3',
        'Tanaffus nuqtasini nima belgilaydi?',
        ['Kontent qayerda buzilishi', 'Telefon modeli', 'Har doim 768px', 'Brauzer'],
        [0],
      ),
      'Kontentga qarab.',
    ),
  ]),
  'media-xususiyatlari': miniQuiz([
    why(
      codeFill(
        'q1',
        'Ekran yotqizilganda.',
        '@media ({{1}}: landscape) {\n  .ekran { flex-direction: row; }\n}',
        ['orientation'],
      ),
      'Telefon yon tomonga burilsa.',
    ),
    why(
      q(
        'q2',
        'Barmoq bilan boshqariladigan qurilma?',
        ['(pointer: coarse)', '(hover: hover)', '(pointer: fine)', 'print'],
        [0],
      ),
      'Aniqligi past.',
    ),
    why(
      tf('q3', 'Ikki shartni `and` bilan birlashtirish mumkin.', true),
      'Masalan, landscape and max-height.',
    ),
  ]),
  yashirish: miniQuiz([
    why(
      codeFill(
        'q1',
        'Faqat kompyuterda ko‘rinsin.',
        '.faqat-kompyuter { display: none; }\n@media (min-width: 768px) {\n  .faqat-kompyuter { display: {{1}}; }\n}',
        ['flex'],
      ),
      'Standart yashirin, keyin ko‘rinadi.',
    ),
    why(
      q(
        'q2',
        'Ko‘zga ko‘rinmas, ekran o‘quvchi o‘qiydigan matn?',
        ['.sr-only', 'display: none', 'visibility: hidden', 'opacity: 0'],
        [0],
      ),
      'Faqat ekran o‘quvchi uchun.',
    ),
    why(
      tf(
        'q3',
        'Telefonda muhim kontentni butunlay yashirish o‘rniga qayta joylashtirish yaxshiroq.',
        true,
      ),
      'Telefon foydalanuvchisiga ham kerak.',
    ),
  ]),
  'konteyner-sorovlari': miniQuiz([
    why(
      codeFill('q1', 'Konteynerni kuzatiladigan qiling.', '.joy {\n  container-type: {{1}};\n}', [
        'inline-size',
      ]),
      'Kenglik bo‘yicha.',
    ),
    why(
      codeFill(
        'q2',
        'Konteyner keng bo‘lsa.',
        '@{{1}} (min-width: 500px) {\n  .karta { display: flex; }\n}',
        ['container'],
      ),
      'Ekran emas, konteyner.',
    ),
    why(
      tf('q3', 'Bir xil karta tor ustunda va keng joyda turlicha ko‘rinishi mumkin.', true),
      'Konteyner so‘rovlarining afzalligi.',
    ),
  ]),
  ustunlar: miniQuiz([
    why(
      codeFill('q1', 'Qator.', '.qator {\n  display: flex;\n  flex-wrap: {{1}};\n}', ['wrap']),
      'Float o‘rniga Flexbox.',
    ),
    why(
      tf('q2', 'Avval mobil: ustunlar standart 100%, media so‘rovda 75% / 25%.', true),
      '9/12 va 3/12.',
    ),
    why(
      q('q3', '9 / 12 ustun necha foiz?', ['75%', '90%', '66.67%', '50%'], [0]),
      '9 ÷ 12 = 0.75.',
    ),
  ]),
  'flex-orash': miniQuiz([
    why(
      codeFill('q1', 'Bloklar o‘zi qatorga tushsin.', '.xususiyat {\n  flex: 1 1 {{1}};\n}', [
        '220px',
      ]),
      'Boshlang‘ich o‘lcham.',
    ),
    why(
      tf('q2', '`flex-wrap: wrap` bo‘lmasa bloklar siqilib bitta qatorda qoladi.', true),
      'Standart `nowrap`.',
    ),
    why(
      q(
        'q3',
        '`flex: 1 1 220px` da birinchi `1`?',
        ['flex-grow', 'flex-shrink', 'flex-basis', 'order'],
        [0],
      ),
      'Birinchi qiymat — o‘sish (flex-grow).',
    ),
  ]),
  'grid-auto-fit': miniQuiz([
    why(
      codeFill(
        'q1',
        'Media so‘rovsiz galereya.',
        'grid-template-columns: repeat({{1}}, minmax(min(100%, 250px), 1fr));',
        ['auto-fit'],
      ),
      'Ustunlar soni o‘zi.',
    ),
    why(
      q(
        'q2',
        'Nega `min(100%, 250px)`?',
        [
          'Juda tor ekranda element toshib ketmasligi uchun',
          'Rang uchun',
          'Tezlik uchun',
          'Kerak emas',
        ],
        [0],
      ),
      'Minimal kenglik ekrandan oshmaydi.',
    ),
    why(
      tf('q3', '1100px kenglikda 250px li ustunlardan 4 tasi sig‘adi.', true),
      '4 × 250 = 1000 (gap bilan ham).',
    ),
  ]),
  'maket-hududlari': miniQuiz([
    why(
      codeFill('q1', 'Elementni hududga.', 'main {\n  {{1}}: main;\n}', ['grid-area']),
      'Nom tirnoqsiz.',
    ),
    why(
      tf('q2', 'Media so‘rovda faqat `grid-template-areas` xaritasini o‘zgartirish kifoya.', true),
      'Elementlar nomi o‘zgarmaydi.',
    ),
    why(
      q('q3', 'Bo‘sh katak?', ['.', 'none', '0', '_'], [0]),
      'Bo‘sh katak nuqta bilan belgilanadi.',
    ),
  ]),
  'muqaddas-grail': miniQuiz([
    why(
      codeFill(
        'q1',
        'Asosiy qator cho‘zilsin, footer pastda.',
        '.sahifa {\n  display: grid;\n  min-height: 100dvh;\n  grid-template-rows: auto {{1}} auto;\n}',
        ['1fr'],
      ),
      'O‘rta qator qolgan joyni oladi.',
    ),
    why(
      q(
        'q2',
        '“Muqaddas grail” maketi?',
        [
          'Sarlavha, uch ustun (nav, asosiy, yon), footer',
          'Faqat bitta ustun',
          'Karusel',
          'Jadval',
        ],
        [0],
      ),
      'Klassik veb maketi.',
    ),
    why(tf('q3', 'Telefonda uch ustun ustma-ust tushadi.', true), 'Avval mobil.'),
  ]),
  rasmlar: miniQuiz([
    why(
      codeFill(
        'q1',
        'Muqova nisbati.',
        '.muqova {\n  aspect-ratio: 16 / 9;\n  object-fit: {{1}};\n}',
        ['cover'],
      ),
      'Cho‘zilmay to‘ldiradi.',
    ),
    why(
      sortInto('q2', 'Rasm qoidalari.', {
        Kerak: ['width: 100%', 'height: auto', 'display: block'],
        'Kerak emas': ['height: 300px qat’iy'],
      }),
      'Moslashuvchan rasm.',
    ),
    why(
      tf('q3', 'Avatar doira: `border-radius: 50%` va `object-fit: cover`.', true),
      'Kvadrat o‘lcham bilan.',
    ),
  ]),
  srcset: miniQuiz([
    why(
      codeFill(
        'q1',
        'Fayl kengligi.',
        '<img srcset="kichik.jpg 400w, katta.jpg {{1}}" sizes="…" src="kichik.jpg" alt="…">',
        ['1200w'],
      ),
      '`w` — haqiqiy kenglik.',
    ),
    why(
      q(
        'q2',
        '`sizes` nimani aytadi?',
        ['Rasm sahifada qancha joy egallashini', 'Fayl hajmini', 'Format turini', 'Sifatni'],
        [0],
      ),
      'Brauzer mos faylni tanlaydi.',
    ),
    why(
      tf('q3', '`src` — `srcset` ni tushunmaydigan brauzer uchun zaxira.', true),
      'Har doim yoziladi.',
    ),
  ]),
  picture: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kompyuterda keng banner.',
        '<picture>\n  <source {{1}}="(min-width: 800px)" srcset="keng.jpg">\n  <img src="kvadrat.jpg" alt="…">\n</picture>',
        ['media'],
      ),
      'Art direction.',
    ),
    why(tf('q2', '`<picture>` ichida `<img>` majburiy.', true), 'Aynan u ko‘rsatiladi.'),
    why(
      q(
        'q3',
        '`alt` qaysi elementga yoziladi?',
        ['<img>', '<picture>', '<source>', 'Hammasiga'],
        [0],
      ),
      '`<picture>` faqat o‘ram.',
    ),
  ]),
  'video-iframe': miniQuiz([
    why(
      codeFill(
        'q1',
        'Iframe 16:9.',
        '.video iframe {\n  width: 100%;\n  height: auto;\n  {{1}}: 16 / 9;\n}',
        ['aspect-ratio'],
      ),
      'Padding hiylasi shart emas.',
    ),
    why(
      tf('q2', '`border: 0` iframe atrofidagi standart chegarani olib tashlaydi.', true),
      'Toza ko‘rinish.',
    ),
    why(
      q(
        'q3',
        '`<video>` ga trafikni tejash uchun?',
        ['preload="none"', 'autoplay', 'loop', 'muted'],
        [0],
      ),
      'Bosmaguncha yuklanmaydi.',
    ),
  ]),
  tipografiya: miniQuiz([
    why(
      codeFill('q1', 'Qulay qator balandligi.', 'body {\n  line-height: {{1}};\n}', ['1.6']),
      'Birliksiz qiymat shriftga moslashadi.',
    ),
    why(
      q(
        'q2',
        'Matn qatori juda uzun bo‘lmasligi uchun?',
        ['max-width: 65ch', 'width: 100vw', 'font-size: 5vw', 'letter-spacing'],
        [0],
      ),
      'Taxminan 65 belgili qator qulay.',
    ),
    why(
      tf(
        'q3',
        'Shriftni faqat `vw` bilan berish zoomga javob bermaydi — `clamp(rem, vw + rem, rem)` yaxshi.',
        true,
      ),
      'Foydalanuvchi kattalashtira olishi kerak.',
    ),
  ]),
  navigatsiya: miniQuiz([
    why(
      codeFill(
        'q1',
        'Holatni almashtiring.',
        "burger.setAttribute('aria-expanded', String({{1}}ochiq));",
        ['!'],
      ),
      'Ochiq ↔ yopiq.',
    ),
    why(
      codeFill('q2', 'Menyuga klass.', "menyu.classList.{{1}}('ochiq');", ['toggle']),
      'CSS menyuni ko‘rsatadi.',
    ),
    why(tf('q3', 'Burger `<button>` bo‘lishi kerak.', true), 'U amal bajaradi.'),
  ]),
  jadvallar: miniQuiz([
    why(
      codeFill(
        'q1',
        'Telefonda sarlavha qatorini yashiring.',
        '@media (max-width: 599px) {\n  .jadval thead { display: {{1}}; }\n}',
        ['none'],
      ),
      'Har katak o‘z yorlig‘ini ko‘rsatadi.',
    ),
    why(
      q(
        'q2',
        'Katak yorlig‘ini CSS bilan qanday ko‘rsatish mumkin?',
        [
          'td::before { content: attr(data-label) }',
          'td::after { content: thead }',
          'title',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'data-label atributidan.',
    ),
    why(
      tf(
        'q3',
        'Qatorlar (`tr`) va kataklar (`td`) `display: block` bo‘lib kartochkaga aylanadi.',
        true,
      ),
      'Har qator alohida karta.',
    ),
  ]),
  formalar: miniQuiz([
    why(
      codeFill(
        'q1',
        '640px dan ikki ustun.',
        '@media (min-width: 640px) {\n  .forma { grid-template-columns: 1fr {{1}}; }\n}',
        ['1fr'],
      ),
      'Teng ustunlar.',
    ),
    why(
      codeFill('q2', 'To‘liq qatorli maydon.', '.toliq {\n  grid-column: 1 / {{1}};\n}', ['-1']),
      'Ikkala ustun bo‘ylab.',
    ),
    why(tf('q3', 'Telefonda maydonlar bitta ustunda.', true), 'Standart grid — bitta ustun.'),
  ]),
  kartalar: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kartalar to‘ri.',
        '.kartalar {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, {{1}}(min(100%, 280px), 1fr));\n}',
        ['minmax'],
      ),
      'Moslashuvchan.',
    ),
    why(
      codeFill('q2', 'Tugma pastda.', '.karta .tugma {\n  margin-top: {{1}};\n}', ['auto']),
      'Karta ichi flex ustun.',
    ),
    why(
      tf('q3', 'Grid qatordagi kartalarni avtomatik bir xil balandlikda qiladi.', true),
      'Katak qator balandligiga cho‘ziladi.',
    ),
  ]),
  dialog: miniQuiz([
    why(
      codeFill('q1', 'Oyna kengligi.', '.oyna {\n  width: {{1}}(100% - 2rem, 32rem);\n}', ['min']),
      'Telefonda chetlar qoladi.',
    ),
    why(
      tf('q2', 'Telefonda modal ekran pastidan chiqadigan panelga aylanishi mumkin.', true),
      'Media so‘rov bilan.',
    ),
    why(
      q(
        'q3',
        '`<dialog>` ni modal sifatida ochish?',
        ['showModal()', 'open()', 'show() har doim', 'display()'],
        [0],
      ),
      'Fon bloklanadi.',
    ),
  ]),
  'lending-bosh': miniQuiz([
    why(
      codeFill('q1', 'Hero balandligi.', '.hero {\n  min-height: {{1}}(100dvh, 720px);\n}', [
        'min',
      ]),
      'Katta monitorda cho‘lga aylanmaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Kontent vertikal markazda.',
        '.hero {\n  display: grid;\n  {{1}}: center;\n}',
        ['align-content'],
      ),
      'Grid kontenti.',
    ),
    why(tf('q3', 'Hero rasmiga `loading="lazy"` yozilmaydi.', true), 'U darhol kerak.'),
  ]),
  'lending-narxlar': miniQuiz([
    why(
      codeFill(
        'q1',
        'Tariflar to‘ri.',
        '.tariflar {\n  grid-template-columns: repeat({{1}}, minmax(min(100%, 260px), 1fr));\n}',
        ['auto-fit'],
      ),
      'Media so‘rovsiz.',
    ),
    why(
      tf(
        'q2',
        'Tavsiya etilgan tarifni faqat rang bilan emas, yorliq bilan ham ajratish kerak.',
        true,
      ),
      'Masalan, “Tavsiya”.',
    ),
    why(
      q(
        'q3',
        'Narxdagi bo‘sh joy qatorda uzilmasligi uchun?',
        ['&nbsp;', '<br>', '&amp;', 'white-space: normal'],
        [0],
      ),
      '`99&nbsp;000`.',
    ),
  ]),
  sinov: miniQuiz([
    why(
      codeFill('q1', 'Banner tuzatish.', '.banner {\n  {{1}}: 500px;\n}', ['max-width']),
      'Telefonda qisqaradi.',
    ),
    why(
      q(
        'q2',
        'Sahifani qaysi kenglikda tekshirasiz?',
        ['375px (telefon)', '1920px faqat', '100px', 'Farqi yo‘q'],
        [0],
      ),
      'Eng ko‘p uchraydigan telefon kengligi.',
    ),
    why(
      tf(
        'q3',
        'Gorizontal aylantirish paydo bo‘lsa, sababi odatda qat’iy kenglikli element.',
        true,
      ),
      'Uni topib, max-width ga almashtiring.',
    ),
  ]),
};
