import { codeFill, miniQuiz, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the Portfolio course: three questions per exercise. */
export const PORTFOLIO_MINI_QUIZZES: Record<string, QuizDef> = {
  'portfolio-nima': miniQuiz([
    why(
      codeFill('q1', 'Navigatsiyaga nom bering.', '<nav {{1}}="Asosiy">…</nav>', ['aria-label']),
      'Bir nechta nav bo‘lsa ajratiladi.',
    ),
    why(order('q2', 'Sahifa skeleti.', ['<header>', '<main>', '<footer>']), 'Semantik tuzilma.'),
    why(
      tf('q3', 'Menyu havolalari `#haqimda`, `#ishlar` kabi bo‘lim `id` lariga olib boradi.', true),
      'Bir sahifali sayt.',
    ),
  ]),
  tuzilma: miniQuiz([
    why(
      codeFill(
        'q1',
        'O‘tish havolasi.',
        '<a class="otish" href="{{1}}">Asosiy kontentga o‘tish</a>',
        ['#asosiy'],
      ),
      '`<main id="asosiy">`.',
    ),
    why(
      codeFill('q2', 'Silliq aylantirish.', 'html {\n  scroll-behavior: {{1}};\n}', ['smooth']),
      'Harakatni kamaytirishda o‘chiriladi.',
    ),
    why(
      tf('q3', 'O‘tish havolasi odatda yashirin, klaviatura fokusida ko‘rinadi.', true),
      'Klaviatura foydalanuvchilari uchun.',
    ),
  ]),
  'portfolio-tokenlar': miniQuiz([
    why(
      codeFill('q1', 'Urg‘u rangini ishlating.', '.tugma {\n  background: var({{1}});\n}', [
        '--urg',
      ]),
      'Token orqali.',
    ),
    why(
      sortInto('q2', 'Tokenlarni turiga ajrating.', {
        Rang: ['--fon', '--matn', '--urg'],
        'O‘lcham': ['--r-karta'],
      }),
      'Rang va o‘lcham tokenlari.',
    ),
    why(tf('q3', 'Tokenlar `:root` da e’lon qilinadi.', true), 'Butun sahifada ishlaydi.'),
  ]),
  hero: miniQuiz([
    why(
      codeFill('q1', 'Header uchun joy.', '.bosh {\n  min-height: calc(100dvh - {{1}});\n}', [
        '64px',
      ]),
      'Bosh ekran birinchi ekranni to‘ldiradi.',
    ),
    why(
      q(
        'q2',
        'Ism uchun suyuq o‘lcham?',
        ['clamp(2.25rem, …, …)', 'font-size: 5vw', 'font-size: 12px', 'zoom'],
        [0],
      ),
      'Min va max bilan.',
    ),
    why(
      tf('q3', '`align-content: center` kontentni vertikal markazga qo‘yadi.', true),
      'Grid kontenti.',
    ),
  ]),
  'sticky-nav': miniQuiz([
    why(
      codeFill(
        'q1',
        'Yopishqoq header.',
        '.sarlavha {\n  position: sticky;\n  {{1}}: 0;\n  z-index: 10;\n}',
        ['top'],
      ),
      '`top` shart.',
    ),
    why(
      q(
        'q2',
        'Orqadagi kontent xira ko‘rinsin?',
        ['backdrop-filter: blur(8px)', 'filter: blur(8px)', 'opacity: 0.5', 'text-shadow'],
        [0],
      ),
      'Yarim shaffof fon bilan.',
    ),
    why(
      tf('q3', 'Ota elementda `overflow: hidden` bo‘lsa, sticky sahifada ishlamaydi.', true),
      'Sticky o‘sha element ichida qoladi.',
    ),
  ]),
  'mobil-menyu': miniQuiz([
    why(
      codeFill('q1', 'Menyu holati.', "menyu.classList.{{1}}('ochiq');", ['toggle']),
      'Ochiq ↔ yopiq.',
    ),
    why(
      q(
        'q2',
        'Havola bosilganda menyu yopilishi uchun?',
        [
          'Menyuga bitta click ishlovchisi (delegatsiya)',
          'Har havolaga alohida',
          'setInterval',
          'Sahifani yangilash',
        ],
        [0],
      ),
      "event.target.closest('a').",
    ),
    why(
      tf('q3', '`aria-expanded` menyu holati bilan birga yangilanadi.', true),
      'Ekran o‘quvchi uchun.',
    ),
  ]),
  'aktiv-bolim': miniQuiz([
    why(
      codeFill('q1', 'Faol havola.', "havola.setAttribute('{{1}}', 'true');", ['aria-current']),
      'Qolganlaridan olib tashlanadi.',
    ),
    why(
      q(
        'q2',
        'CSS’da faol havolani bezash?',
        ['a[aria-current="true"]', 'a.active har doim', 'a:visited', 'a:current'],
        [0],
      ),
      'Atribut selektori.',
    ),
    why(
      tf(
        'q3',
        'Faol bo‘limni faqat rang bilan emas, `aria-current` bilan ham bildirish kerak.',
        true,
      ),
      'Ma’no ekran o‘quvchiga ham.',
    ),
  ]),
  profil: miniQuiz([
    why(
      codeFill(
        'q1',
        'Planshetdan surat va matn yonma-yon.',
        '@media (min-width: 768px) {\n  .haqimda { grid-template-columns: 240px {{1}}; }\n}',
        ['1fr'],
      ),
      'Surat 240px, matn qolgan joy.',
    ),
    why(
      q(
        'q2',
        'Portret `alt` i?',
        ['“Aziza Karimova portreti”', '“rasm”', 'Bo‘sh', '“photo.jpg”'],
        [0],
      ),
      'Mazmunli rasm.',
    ),
    why(tf('q3', 'Telefonda surat va matn ustma-ust turadi.', true), 'Standart — bitta ustun.'),
  ]),
  konikmalar: miniQuiz([
    why(
      codeFill(
        'q1',
        'Chiziq roli.',
        '<div class="chiziq" role="{{1}}" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">',
        ['progressbar'],
      ),
      'Ekran o‘quvchi “90 foiz” deydi.',
    ),
    why(
      q(
        'q2',
        'Kenglikni CSS o‘zgaruvchisidan olish?',
        ['width: var(--daraja)', 'width: attr(daraja)', 'width: 90', 'data-width'],
        [0],
      ),
      'Bitta qoida hammasiga.',
    ),
    why(
      tf('q3', 'Har chiziqqa ko‘nikma nomi bilan `aria-label` beriladi.', true),
      'Qaysi ko‘nikma ekani.',
    ),
  ]),
  'vaqt-chizigi': miniQuiz([
    why(
      codeFill(
        'q1',
        'Vertikal chiziq.',
        '.vaqt::before {\n  content: "";\n  position: {{1}};\n  left: 6px;\n}',
        ['absolute'],
      ),
      'Ota `.vaqt` relative.',
    ),
    why(
      q(
        'q2',
        'Ota `.vaqt` ga nima kerak?',
        ['position: relative', 'position: fixed', 'float: left', 'display: none'],
        [0],
      ),
      'Chiziq unga nisbatan.',
    ),
    why(
      tf('q3', 'Chap padding (28px) chiziq va nuqtalar uchun joy beradi.', true),
      'Matn chiziqqa yopishmaydi.',
    ),
  ]),
  ijtimoiy: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ikonkali havola nomi.',
        '<a href="https://github.com/…" {{1}}="GitHub">…</a>',
        ['aria-label'],
      ),
      'Ikonka o‘zi nom bermaydi.',
    ),
    why(
      q(
        'q2',
        'Yangi tabda ochiladigan tashqi havolaga yana nima?',
        ['rel="noopener"', 'title', 'download', 'role="link"'],
        [0],
      ),
      'Xavfsizlik.',
    ),
    why(tf('q3', 'Email havolasi `mailto:` bilan boshlanadi.', true), 'Pochta dasturini ochadi.'),
  ]),
  'loyiha-kartalari': miniQuiz([
    why(
      codeFill(
        'q1',
        'Moslashuvchan to‘r.',
        '.tor {\n  grid-template-columns: repeat(auto-fill, {{1}}(min(100%, 300px), 1fr));\n}',
        ['minmax'],
      ),
      'Kamida 300px.',
    ),
    why(
      q(
        'q2',
        'Butun karta bosiladigan bo‘lishi uchun?',
        [
          'Havolaning ::after ini kartani qoplaydigan qilish',
          'Butun kartani <a> ga o‘rash har doim',
          'onclick',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Ekran o‘quvchi qisqa nomni o‘qiydi.',
    ),
    why(
      tf('q3', 'Kartaning ota elementiga `position: relative` kerak.', true),
      'Kengaytirilgan havola unga nisbatan.',
    ),
  ]),
  filtr: miniQuiz([
    why(
      codeFill('q1', 'Bosilgan tugma holati.', "tugma.setAttribute('{{1}}', 'true');", [
        'aria-pressed',
      ]),
      'Qolganlariga false.',
    ),
    why(
      q(
        'q2',
        '“hammasi” tanlansa?',
        [
          'Barcha .ish ko‘rinadi',
          'Hech biri ko‘rinmaydi',
          'Faqat birinchisi',
          'Sahifa yangilanadi',
        ],
        [0],
      ),
      'Filtrsiz holat.',
    ),
    why(tf('q3', 'Mos kelmagan ishlarga `hidden` beriladi.', true), 'Ko‘rinmaydi va o‘qilmaydi.'),
  ]),
  lightbox: miniQuiz([
    why(
      codeFill('q1', 'Katta rasm manzili.', 'rasm.src = tugma.dataset.{{1}};', ['katta']),
      '`data-katta` atributidan.',
    ),
    why(
      codeFill('q2', 'Oynani oching.', 'oyna.{{1}}();', ['showModal']),
      'Fokus oyna ichida qoladi.',
    ),
    why(
      tf('q3', 'Katta rasm `alt` i kichik rasmning `alt` idan olinadi.', true),
      'Qulaylik saqlanadi.',
    ),
  ]),
  'loyiha-sahifasi': miniQuiz([
    why(
      codeFill(
        'q1',
        'Panel yopishishi uchun.',
        '.malumot {\n  position: sticky;\n  top: 96px;\n  {{1}}: start;\n}',
        ['align-self'],
      ),
      'Cho‘zilgan katakda sticky ishlamaydi.',
    ),
    why(
      q(
        'q2',
        'Katta ekranda hikoya va panel?',
        ['grid-template-columns: 1fr 300px kabi', 'float', 'table', 'position: absolute'],
        [0],
      ),
      'Ikki ustun.',
    ),
    why(
      tf('q3', '`top: 96px` panel yopishqoq header ostida qolmasligi uchun.', true),
      'Header balandligi + joy.',
    ),
  ]),
  karusel: miniQuiz([
    why(
      codeFill(
        'q1',
        'Slaydlar chetga yopishsin.',
        '.lenta {\n  overflow-x: auto;\n  scroll-snap-type: x {{1}};\n}',
        ['mandatory'],
      ),
      'Har slayd to‘liq ko‘rinadi.',
    ),
    why(
      q(
        'q2',
        'Slayd qayerga yopishadi?',
        ['scroll-snap-align: start', 'snap: left', 'align: snap', 'float: start'],
        [0],
      ),
      'Slayd boshi.',
    ),
    why(
      tf(
        'q3',
        '`flex: 0 0 80%` keyingi slaydning bir qismini ko‘rsatib, aylantirish mumkinligini bildiradi.',
        true,
      ),
      'Vizual ishora.',
    ),
  ]),
  'aloqa-forma': miniQuiz([
    why(
      sortInto('q1', 'Maydonga mos atributlar.', {
        ism: ['required', 'autocomplete="name"'],
        email: ['type="email"', 'autocomplete="email"'],
      }),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      q(
        'q2',
        'Xabar kamida 10 belgi?',
        ['minlength="10"', 'min="10"', 'size="10"', 'pattern="10"'],
        [0],
      ),
      'Matn uzunligi.',
    ),
    why(
      tf('q3', 'Brauzer tekshiruvidan tashqari server ham tekshirishi kerak.', true),
      'Frontend — qulaylik.',
    ),
  ]),
  fikrlar: miniQuiz([
    why(
      order('q1', 'Fikr tuzilmasi.', [
        '<figure class="fikr">',
        '<blockquote><p>…</p></blockquote>',
        '<figcaption>Ism, <cite>Tashkilot</cite></figcaption>',
      ]),
      'Iqtibos va manba.',
    ),
    why(
      codeFill('q2', 'Tashkilot nomi.', '<figcaption>Dilshod, <{{1}}>Non uyi</cite></figcaption>', [
        'cite',
      ]),
      'Manba nomi.',
    ),
    why(tf('q3', 'Bezak qo‘shtirnoqlar CSS bilan qo‘shiladi.', true), 'HTML matni toza.'),
  ]),
  yuqoriga: miniQuiz([
    why(
      codeFill('q1', 'Ekran burchagida.', '.yuqoriga {\n  position: {{1}};\n  right: 24px;\n}', [
        'fixed',
      ]),
      'Doim qo‘l ostida.',
    ),
    why(
      q('q2', 'Ikonkaga nima?', ['aria-hidden="true"', 'aria-label', 'alt', 'title'], [0]),
      'Nom havolada.',
    ),
    why(
      tf('q3', 'Havolaga `aria-label="Sahifa boshiga qaytish"` beriladi.', true),
      'Faqat ikonkali havola.',
    ),
  ]),
  'mavzu-rejimi': miniQuiz([
    why(
      codeFill(
        'q1',
        'Qorong‘i mavzu.',
        '[data-theme="dark"] {\n  {{1}}: dark;\n  --fon: #1c1917;\n}',
        ['color-scheme'],
      ),
      'Forma elementlari ham qorong‘i.',
    ),
    why(
      q(
        'q2',
        'Tanlovni saqlash?',
        ["localStorage.setItem('mavzu', 'dark')", 'cookie shart', 'URL', 'Saqlab bo‘lmaydi'],
        [0],
      ),
      'Keyingi tashrifda ham.',
    ),
    why(
      tf(
        'q3',
        'Saqlangan tanlov yo‘q bo‘lsa, tizim sozlamasi (`prefers-color-scheme`) ishlatiladi.',
        true,
      ),
      'Standart xulq.',
    ),
  ]),
  'seo-meta': miniQuiz([
    why(codeFill('q1', 'Sahifa tili.', '<html {{1}}="uz">', ['lang']), 'Talaffuz va qidiruv.'),
    why(
      q(
        'q2',
        'Qidiruv natijasidagi qisqa matn?',
        ['<meta name="description">', '<title>', 'og:image', 'canonical'],
        [0],
      ),
      '120–160 belgi.',
    ),
    why(tf('q3', '`og:image` Telegram’da ulashilganda chiqadigan rasm.', true), 'Open Graph.'),
  ]),
  'tezlik-a11y': miniQuiz([
    why(
      codeFill(
        'q1',
        'Pastdagi rasm kechiktirilsin.',
        '<img src="loyiha.webp" width="800" height="500" loading="{{1}}" alt="…">',
        ['lazy'],
      ),
      'Ekranga yaqinlashganda.',
    ),
    why(
      q(
        'q2',
        'Sahifa “sakramasligi” (CLS) uchun?',
        ['width va height atributlari', 'loading="lazy"', 'alt', 'title'],
        [0],
      ),
      'Joy oldindan ajratiladi.',
    ),
    why(
      tf('q3', 'Lighthouse topgan xatolarni tuzatgach qayta o‘lchash kerak.', true),
      'Natijani tekshirish.',
    ),
  ]),
  'yakuniy-loyiha': miniQuiz([
    why(
      codeFill('q1', 'Bo‘lim header ostida qolmasin.', 'section {\n  {{1}}: 80px;\n}', [
        'scroll-margin-top',
      ]),
      'Havola bosilganda.',
    ),
    why(
      sortInto('q2', 'Yakuniy portfolio talablari.', {
        Kerak: ['Yopishqoq header', 'Moslashuvchan loyihalar to‘ri', 'Semantik bo‘limlar'],
        'Kerak emas': ['Jadval bilan maket'],
      }),
      'Kursdagi hamma narsa birga.',
    ),
    why(
      tf('q3', 'Yakuniy loyihani telefon kengligida ham tekshirish kerak.', true),
      'Moslashuvchanlik.',
    ),
  ]),
};
