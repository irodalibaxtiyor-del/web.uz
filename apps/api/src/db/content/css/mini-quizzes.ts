import {
  codeFill,
  fill,
  match,
  miniQuiz,
  order,
  q,
  sortInto,
  tf,
  why,
  type QuizDef,
} from '../helpers';

/** Exercise mini-tests of the CSS course: three self-check questions on what the exercise asks. */
export const CSS_MINI_QUIZZES: Record<string, QuizDef> = {
  introduction: miniQuiz([
    why(
      codeFill('q1', 'Sarlavhani markazga qo‘ying.', 'h1 {\n  {{1}}: center;\n}', ['text-align']),
      'Matnni gorizontal tekislaydi.',
    ),
    why(
      match('q2', 'Talabni xususiyat bilan moslang.', [
        ['body foni', 'background-color'],
        ['h1 rangi', 'color'],
      ]),
      '`color` — matn, `background-color` — fon.',
    ),
    why(
      tf('q3', 'Uslublar `style.css` faylida yozilib, HTML’ga ulanadi.', true),
      'Ko‘rinish alohida faylda saqlanadi.',
    ),
  ]),
  syntax: miniQuiz([
    why(
      q(
        'q1',
        'Qaysi e’lon to‘g‘ri?',
        ['font-size: 40px;', 'font-size = 40px;', 'font-size 40px', 'font-size: 40 px;'],
        [0],
      ),
      '`xususiyat: qiymat;` — son va birlik orasida bo‘sh joy yo‘q.',
    ),
    why(
      codeFill('q2', 'Qoidani tuzating.', 'p {\n  color{{1}} #333333{{2}}\n}', [':', ';']),
      'Ikki nuqta va nuqta-vergul.',
    ),
    why(
      tf('q3', 'Bitta e’londagi xato faqat shu e’lonni ishlatmaydi, qolganlari ishlaydi.', true),
      'Brauzer xato e’lonni o‘tkazib yuboradi.',
    ),
  ]),
  selectors: miniQuiz([
    why(
      match('q1', 'Talabni selektor bilan moslang.', [
        ['Barcha paragraflar', 'p'],
        ['eslatma klassi', '.eslatma'],
        ['asosiy id li sarlavha', '#asosiy'],
      ]),
      'Klass — nuqta, id — panjara.',
    ),
    why(
      codeFill('q2', 'h2 va h3 ga bitta qoida.', 'h2{{1}} h3 {\n  color: #0071dc;\n}', [',']),
      'Selektorlar vergul bilan guruhlanadi.',
    ),
    why(
      tf('q3', '`#asosiy` selektori bir nechta elementga mo‘ljallangan.', false),
      'id sahifada yagona.',
    ),
  ]),
  howto: miniQuiz([
    why(
      codeFill('q1', 'Tashqi CSS ni ulang.', '<link rel="{{1}}" href="style.css">', ['stylesheet']),
      '`<head>` ichida.',
    ),
    why(
      tf('q2', 'Mashqdan keyin sarlavhada `style` atributi qolmasligi kerak.', true),
      'Rang `style.css` ga ko‘chiriladi.',
    ),
    why(
      q(
        'q3',
        'Inline uslubning kamchiligi?',
        [
          'Qayta ishlatib bo‘lmaydi va o‘zgartirish qiyin',
          'Ishlamaydi',
          'Sekin yuklanadi',
          'Faqat rang beradi',
        ],
        [0],
      ),
      'Ustunligi yuqori, kodni chalkashtiradi.',
    ),
  ]),
  comments: miniQuiz([
    why(
      codeFill('q1', 'CSS izohini yozing.', '{{1}} Sarlavha uslubi */', ['/*']),
      'CSS’da faqat `/* … */`.',
    ),
    why(
      tf('q2', '`//` bilan yozilgan qator CSS’da izoh hisoblanadi.', false),
      'U keyingi qoidani buzadi.',
    ),
    why(
      q(
        'q3',
        'Qoidani o‘chirmasdan vaqtincha ishlatmaslik uchun?',
        ['Uni izoh ichiga olish', 'Faylni o‘chirish', '!important yozish', 'display: none'],
        [0],
      ),
      'Keyin osongina qaytarish mumkin.',
    ),
  ]),
  errors: miniQuiz([
    why(
      q(
        'q1',
        'CSS xatosini qayerda tez topasiz?',
        [
          'DevTools Styles panelida (chizilgan yoki ogohlantirish belgili e’lon)',
          'Console’da har doim',
          'Network’da',
          'HTML manbasida',
        ],
        [0],
      ),
      'Ishlamagan e’lon chizib ko‘rsatiladi.',
    ),
    why(
      sortInto('q2', 'Qaysi e’lonlar xato?', {
        Xato: ['width: 300 px;', 'colr: white;', 'padding 16px;'],
        "To'g'ri": ['background-color: #f5faff;'],
      }),
      'Birlik yopishgan, nom to‘g‘ri, ikki nuqta bor bo‘lishi kerak.',
    ),
    why(
      codeFill('q3', 'Tugma matni oq.', '.tugma {\n  {{1}}: white;\n}', ['color']),
      'Matn rangi — `color`.',
    ),
  ]),
  colors: miniQuiz([
    why(
      codeFill(
        'q1',
        'Chegara matn rangida.',
        '.tugma {\n  border: 2px solid {{1}};\n}',
        ['currentcolor'],
        false,
      ),
      '`currentcolor` — joriy matn rangi.',
    ),
    why(
      tf('q2', '`navy`, `whitesmoke`, `crimson` — CSS rang nomlari.', true),
      'Brauzer 140 dan ortiq nomni biladi.',
    ),
    why(
      q(
        'q3',
        '`.xato` chegarasi qaysi yozuvda?',
        ['border: 2px solid crimson;', 'border: crimson;', 'border-color: 2px;', 'border: solid;'],
        [0],
      ),
      'Qalinlik, tur, rang.',
    ),
  ]),
  rgb: miniQuiz([
    why(
      codeFill(
        'q1',
        'Yarim shaffof qora fon.',
        '.qoplama {\n  background-color: rgb(0 0 0 / {{1}});\n}',
        ['0.5'],
      ),
      'Alfa 0 dan 1 gacha.',
    ),
    why(
      q('q2', '`rgb(128, 128, 128)` qaysi rang?', ['Kulrang', 'Qora', 'Oq', 'Qizil'], [0]),
      'Uch qism teng — kulrang.',
    ),
    why(
      tf('q3', '`rgb(0 0 0 / 0.5)` va `rgba(0, 0, 0, 0.5)` bir xil rang.', true),
      'Zamonaviy va eski yozuv.',
    ),
  ]),
  hex: miniQuiz([
    why(
      q('q1', '`#fc0` ning to‘liq yozuvi?', ['#ffcc00', '#fc0000', '#ffc000', '#00ccff'], [0]),
      'Har belgi ikki marta.',
    ),
    why(
      tf('q2', '`#00000080` — yarim shaffof qora.', true),
      'Oxirgi `80` juftligi ≈ 50% shaffoflik.',
    ),
    why(
      codeFill('q3', 'Sarlavha rangi.', 'h1 {\n  color: {{1}}0e1133;\n}', ['#']),
      'HEX `#` bilan boshlanadi.',
    ),
  ]),
  hsl: miniQuiz([
    why(
      codeFill(
        'q1',
        'Asosiy ko‘k fon.',
        '.asosiy {\n  background-color: hsl(210, 100%, {{1}});\n}',
        ['43%'],
      ),
      'Yorqinlik — uchinchi qiymat.',
    ),
    why(
      match('q2', 'Klassni yorqinlik bilan moslang.', [
        ['.och', '95%'],
        ['.asosiy', '43%'],
        ['.toq', '20%'],
      ]),
      'Bitta tusdan butun palitra.',
    ),
    why(
      tf('q3', 'Mashqda uchala rangda tus (210) bir xil qoladi.', true),
      'Faqat yorqinlik o‘zgaradi.',
    ),
  ]),
  backgrounds: miniQuiz([
    why(
      q(
        'q1',
        'Matn xiralashmasin, faqat fon shaffof bo‘lsin.',
        ['rgb(0 113 220 / 0.2) fon', 'opacity: 0.2', 'filter: blur()', 'visibility: hidden'],
        [0],
      ),
      '`opacity` butun elementni xiralashtiradi.',
    ),
    why(
      codeFill(
        'q2',
        'h2 foni va oq matn.',
        'h2 {\n  background-color: #0071dc;\n  {{1}}: white;\n}',
        ['color'],
      ),
      'Fon to‘q bo‘lsa, matn och.',
    ),
    why(
      tf('q3', 'Mashqda `.qoplama` dagi `opacity` olib tashlanadi.', true),
      'O‘rniga alfa kanalli fon.',
    ),
  ]),
  'background-image': miniQuiz([
    why(
      codeFill('q1', 'Gradient fon.', '.hero {\n  background-image: {{1}}(#0071dc, #0e1133);\n}', [
        'linear-gradient',
      ]),
      'Gradient ham fon rasmi.',
    ),
    why(
      match('q2', 'Talabni xususiyat bilan moslang.', [
        ['Takrorlanmasin', 'background-repeat: no-repeat'],
        ['O‘ng yuqori burchakda', 'background-position: right top'],
        ['Maydonni qoplasin', 'background-size: cover'],
      ]),
      'Fonni sozlash uch xususiyat bilan.',
    ),
    why(
      tf('q3', 'Fon rasmi bilan birga zaxira `background-color` berish foydali.', true),
      'Rasm yuklanmasa ham matn o‘qiladi.',
    ),
  ]),
  'background-attachment': miniQuiz([
    why(
      match('q1', 'Talabni qiymat bilan moslang.', [
        ['Fon ekranga mahkamlansin', 'fixed'],
        ['Fon blok ichidagi kontent bilan siljisin', 'local'],
      ]),
      'Standart — `scroll`.',
    ),
    why(
      codeFill('q2', 'Ro‘yxat ichida aylantirish.', '.royxat {\n  {{1}}: auto;\n}', ['overflow']),
      '`local` faqat aylanadigan blokda ma’noli.',
    ),
    why(
      tf('q3', '`fixed` ko‘p mobil brauzerlarda ishlamasligi mumkin.', true),
      'Effektni qo‘shimcha deb qarang.',
    ),
  ]),
  borders: miniQuiz([
    why(
      codeFill('q1', 'Uzuq-uzuq chegara.', '.eslatma {\n  border: 2px {{1}} orange;\n}', [
        'dashed',
      ]),
      '`dotted` — nuqtali.',
    ),
    why(
      q(
        'q2',
        '`.xato` chegarasi matn rangini olishi uchun?',
        [
          'Rangni yozmaslik: border: 2px solid;',
          'border-color: auto',
          'border: crimson',
          'border: none',
        ],
        [0],
      ),
      'Standart chegara rangi — `currentcolor`.',
    ),
    why(tf('q3', '`border-style` siz chegara ko‘rinmaydi.', true), 'Standart qiymati `none`.'),
  ]),
  'border-sides': miniQuiz([
    why(
      codeFill('q1', 'Faqat chap chegara.', 'blockquote {\n  {{1}}: 4px solid #0071dc;\n}', [
        'border-left',
      ]),
      'Har tomon alohida xususiyat.',
    ),
    why(
      codeFill(
        'q2',
        'Pastki chegarani olib tashlang.',
        '.tab {\n  border: 1px solid #cccccc;\n  {{1}}: none;\n}',
        ['border-bottom'],
      ),
      'Avval umumiy, keyin istisno.',
    ),
    why(
      order('q3', '`border-width: 1px 2px 3px 4px` tartibi.', ['Yuqori', 'O‘ng', 'Past', 'Chap']),
      'Soat mili bo‘yicha.',
    ),
  ]),
  'rounded-borders': miniQuiz([
    why(
      codeFill('q1', 'Avatar doira bo‘lsin.', '.avatar {\n  border-radius: {{1}};\n}', ['50%']),
      'Kvadrat element doiraga aylanadi.',
    ),
    why(
      q(
        'q2',
        'Faqat yuqori burchaklar 12px?',
        ['12px 12px 0 0', '0 0 12px 12px', '12px 0', '12px'],
        [0],
      ),
      'Chap-yuqoridan soat mili bo‘yicha.',
    ),
    why(
      tf('q3', '`border-radius` chegarasiz elementda ham ishlaydi.', true),
      'Fon burchaklari yumaloqlanadi.',
    ),
  ]),
  margins: miniQuiz([
    why(
      codeFill(
        'q1',
        'Konteynerni markazlang.',
        '.konteyner {\n  max-width: 600px;\n  margin: 0 {{1}};\n}',
        ['auto'],
      ),
      '`auto` yon marginlarni teng qiladi.',
    ),
    why(
      q(
        'q2',
        '`body` ning standart marginini olib tashlash?',
        [
          'body { margin: 0; }',
          'body { padding: 0; }',
          'body { border: 0; }',
          'html { margin: auto; }',
        ],
        [0],
      ),
      'Brauzer body’ga 8px margin beradi.',
    ),
    why(tf('q3', 'Margin element fonining bir qismi.', false), 'Margin — shaffof tashqi bo‘shliq.'),
  ]),
  'margin-collapse': miniQuiz([
    why(
      codeFill('q1', 'Margin kartochkadan chiqib ketmasin.', '.karta {\n  display: {{1}};\n}', [
        'flow-root',
      ]),
      'Ota va bola marginlari qo‘shilishini to‘xtatadi.',
    ),
    why(
      q(
        'q2',
        '`margin-bottom: 30px` va keyingi `margin-top: 20px` orasidagi masofa?',
        ['30px', '50px', '20px', '10px'],
        [0],
      ),
      'Vertikal marginlar qo‘shilib kattasi qoladi.',
    ),
    why(
      tf(
        'q3',
        'Barcha `p` larda faqat pastki margin qoldirish collapse bilan bog‘liq chalkashlikni kamaytiradi.',
        true,
      ),
      'Bir yo‘nalishdagi margin — bashorat qilinadigan masofa.',
    ),
  ]),
  padding: miniQuiz([
    why(
      codeFill('q1', 'Tugma ichki bo‘shlig‘i.', '.tugma {\n  padding: 12px {{1}};\n}', ['24px']),
      'Vertikal 12, gorizontal 24.',
    ),
    why(
      codeFill(
        'q2',
        'Quti aynan 300px bo‘lsin.',
        '.quti {\n  width: 300px;\n  padding: 20px;\n  box-sizing: {{1}};\n}',
        ['border-box'],
      ),
      'Padding kenglik ichida hisoblanadi.',
    ),
    why(
      fill('q3', 'Hisoblang (content-box).', 'width: 300px; padding: 20px → ekranda {{1}}px', [
        '340',
      ]),
      '300 + 20 + 20.',
    ),
  ]),
  'height-width': miniQuiz([
    why(
      codeFill('q1', 'Maqola 720px dan oshmasin.', '.maqola {\n  {{1}}: 720px;\n}', ['max-width']),
      'Tor ekranda qisqara oladi.',
    ),
    why(
      codeFill(
        'q2',
        'Blok kamida 300px, matn ko‘paysa kattalashsin.',
        '.hero {\n  {{1}}: 300px;\n}',
        ['min-height'],
      ),
      'Qat’iy `height` matnni kesadi.',
    ),
    why(
      tf('q3', '`width: 720px` telefonda ekrandan chiqib ketadi.', true),
      'Qat’iy kenglik qisqarmaydi.',
    ),
  ]),
  'box-model': miniQuiz([
    why(
      codeFill('q1', 'Barcha elementlarga.', '{{1}} {\n  box-sizing: border-box;\n}', ['*']),
      'Universal selektor.',
    ),
    why(
      fill(
        'q2',
        'Hisoblang (border-box).',
        'width 300px, padding 20px, chegara 5px, margin 10px → egallagan joy {{1}}px',
        ['320'],
      ),
      'Ko‘rinadigan 300 + 10 + 10 margin.',
    ),
    why(
      order('q3', 'Quti qatlamlarini ichkaridan tartiblang.', [
        'content',
        'padding',
        'border',
        'margin',
      ]),
      'Margin — eng tashqi.',
    ),
  ]),
  outline: miniQuiz([
    why(
      tf('q1', '`outline: none` klaviatura foydalanuvchilarini qiynaydi.', true),
      'Ular fokus qayerda ekanini ko‘rmaydi.',
    ),
    why(
      codeFill('q2', 'Ko‘rinadigan fokus.', 'a:{{1}} {\n  outline: 3px solid #0071dc;\n}', [
        'focus-visible',
      ]),
      'Faqat klaviatura fokusida.',
    ),
    why(
      q(
        'q3',
        'Kontur elementdan biroz uzoqda bo‘lishi uchun?',
        ['outline-offset', 'outline-margin', 'padding', 'border-spacing'],
        [0],
      ),
      'Masalan, `outline-offset: 2px`.',
    ),
  ]),
  text: miniQuiz([
    why(
      codeFill('q1', 'Qator balandligi.', 'p {\n  {{1}}: 1.6;\n}', ['line-height']),
      'Birliksiz qiymat — eng qulay.',
    ),
    why(
      codeFill('q2', 'Harflar orasi 2px.', '.yorliq {\n  {{1}}: 2px;\n}', ['letter-spacing']),
      '`word-spacing` — so‘zlar orasi.',
    ),
    why(
      tf('q3', '`line-height: 1.6px` va `line-height: 1.6` bir xil.', false),
      'Birliksiz 1.6 — shrift o‘lchamiga ko‘paytiriladi.',
    ),
  ]),
  'text-decoration': miniQuiz([
    why(
      codeFill('q1', 'Menyu havolalari tagchiziqsiz.', 'nav a {\n  text-decoration: {{1}};\n}', [
        'none',
      ]),
      'Menyuda tagchiziq shart emas.',
    ),
    why(
      codeFill('q2', 'Tagchiziq 3px pastda.', '.maqola a {\n  {{1}}: 3px;\n}', [
        'text-underline-offset',
      ]),
      'Chiziq harflardan uzoqlashadi.',
    ),
    why(
      q(
        'q3',
        'Eski narxni ustidan chizish?',
        [
          'text-decoration: line-through',
          'text-decoration: overline',
          'text-decoration: underline',
          'font-style: italic',
        ],
        [0],
      ),
      'Yoki HTML’da `<del>`.',
    ),
  ]),
  'text-transform': miniQuiz([
    why(
      codeFill('q1', '“Yangi” → “YANGI”.', '.yorliq {\n  text-transform: {{1}};\n}', ['uppercase']),
      'HTML matni o‘zgarmaydi.',
    ),
    why(
      codeFill('q2', 'Narx ikki qatorga bo‘linmasin.', '.narx {\n  white-space: {{1}};\n}', [
        'nowrap',
      ]),
      'Qatorga ko‘chish o‘chiriladi.',
    ),
    why(
      q(
        'q3',
        'Uzun havola konteynerdan chiqmasligi uchun?',
        [
          'overflow-wrap: break-word',
          'white-space: nowrap',
          'text-transform: none',
          'letter-spacing: 0',
        ],
        [0],
      ),
      'Uzun so‘z bo‘linadi.',
    ),
  ]),
  'text-shadow': miniQuiz([
    why(
      codeFill('q1', 'Siljishsiz neon nur.', '.neon {\n  text-shadow: 0 0 {{1}} #00e5ff;\n}', [
        '8px',
      ]),
      'Faqat xiralik — nur effekti.',
    ),
    why(
      codeFill('q2', 'Paragraf soyasini olib tashlang.', 'p {\n  text-shadow: {{1}};\n}', ['none']),
      'Oddiy matnga soya kerak emas.',
    ),
    why(
      order('q3', '`text-shadow` qiymatlari tartibi.', ['x', 'y', 'xiralik', 'rang']),
      'Masalan, `0 2px 6px rgba(…)`.',
    ),
  ]),
  fonts: miniQuiz([
    why(
      match('q1', 'Elementni shrift ro‘yxati bilan moslang.', [
        ['body', 'Arial, sans-serif'],
        ['h1, h2', 'Georgia, serif'],
        ['code', 'Consolas, "Courier New", monospace'],
      ]),
      'Ro‘yxat umumiy oila bilan tugaydi.',
    ),
    why(
      codeFill('q2', 'Tugma sahifa shriftini olsin.', 'button {\n  font-family: {{1}};\n}', [
        'inherit',
      ]),
      'Forma elementlari shriftni meros olmaydi.',
    ),
    why(
      tf('q3', '`"Courier New"` qo‘shtirnoqda yoziladi, chunki nomida bo‘sh joy bor.', true),
      'Bo‘sh joyli nomlar qo‘shtirnoqda.',
    ),
  ]),
  'font-style': miniQuiz([
    why(
      match('q1', 'Talabni e’lon bilan moslang.', [
        ['.izoh kursiv', 'font-style: italic'],
        ['.narx qalin', 'font-weight: 700'],
        ['.kod em kursivsiz', 'font-style: normal'],
      ]),
      '`normal` kursivni bekor qiladi.',
    ),
    why(fill('q2', 'Hisoblang (html 16px).', '0.875rem = {{1}}px', ['14']), '0.875 × 16.'),
    why(
      tf('q3', '`h1 { font-size: 2rem; }` — 32px (asos 16px bo‘lsa).', true),
      'rem — ildiz shriftiga nisbatan.',
    ),
  ]),
  'web-fonts': miniQuiz([
    why(
      codeFill(
        'q1',
        'Kompyuterdagi shriftni manba qiling.',
        '@font-face {\n  font-family: Sarlavha;\n  src: {{1}}("Georgia");\n}',
        ['local'],
      ),
      'Sandbox tashqi fayllarni yuklamaydi.',
    ),
    why(
      codeFill('q2', 'Matn darhol ko‘rinsin.', '@font-face {\n  …\n  font-display: {{1}};\n}', [
        'swap',
      ]),
      'Yuklanguncha zaxira shrift.',
    ),
    why(
      q(
        'q3',
        '`h1` uchun to‘g‘ri ro‘yxat?',
        ['Sarlavha, Georgia, serif', 'Georgia', 'Sarlavha', 'serif, Sarlavha'],
        [0],
      ),
      'O‘z shriftimiz, zaxira, umumiy oila.',
    ),
  ]),
  'font-shorthand': miniQuiz([
    why(
      q(
        'q1',
        'Qaysi `font` qatori to‘g‘ri?',
        [
          'italic 1.125rem/1.6 Georgia, serif',
          'Georgia italic 1.125rem',
          '1.6/1.125rem italic Georgia',
          'serif Georgia 1.125rem',
        ],
        [0],
      ),
      'Uslub, o‘lcham/qator, oila.',
    ),
    why(
      codeFill('q2', 'Forma elementlari sahifa shriftida.', 'button,\ninput {\n  font: {{1}};\n}', [
        'inherit',
      ]),
      'O‘lcham va oila birga meros.',
    ),
    why(tf('q3', '`font` da oila oxirida yoziladi.', true), 'O‘lcham va oila majburiy.'),
  ]),
  icons: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ikonka matn rangida.',
        '.ikonka {\n  fill: {{1}};\n}',
        ['currentColor'],
        false,
      ),
      'Tugma rangi o‘zgarsa, ikonka ham.',
    ),
    why(
      q(
        'q2',
        'Ikonka o‘lchami qaysi birlikda qulay?',
        ['em (matnga moslashadi)', 'cm', 'vh', '%'],
        [0],
      ),
      'Mashqda `1.25em`.',
    ),
    why(tf('q3', 'Matnsiz qidiruv tugmasiga `aria-label` kerak.', true), 'Aks holda tugma nomsiz.'),
  ]),
  links: miniQuiz([
    why(
      order('q1', 'Havola holatlarini yozish tartibi.', [':link', ':visited', ':hover', ':active']),
      'LVHA tartibi.',
    ),
    why(
      codeFill('q2', 'Havola-tugma.', '.tugma {\n  display: {{1}};\n  padding: 10px 20px;\n}', [
        'inline-block',
      ]),
      'Padding to‘liq ishlaydi.',
    ),
    why(
      tf('q3', 'Hover uslubi bilan birga `:focus-visible` ham yozilishi kerak.', true),
      'Klaviatura foydalanuvchilari uchun.',
    ),
  ]),
  lists: miniQuiz([
    why(
      codeFill('q1', 'Menyu belgisiz.', 'nav ul {\n  list-style: {{1}};\n  padding-left: 0;\n}', [
        'none',
      ]),
      'Menyuda belgi kerak emas.',
    ),
    why(
      codeFill('q2', 'Belgi rangi.', '.afzalliklar li::{{1}} {\n  color: #0071dc;\n}', ['marker']),
      '`::marker` — ro‘yxat belgisi.',
    ),
    why(
      q('q3', 'Rim raqamlari?', ['upper-roman', 'roman', 'decimal', 'lower-alpha'], [0]),
      'I, II, III.',
    ),
  ]),
  tables: miniQuiz([
    why(
      codeFill('q1', 'Qo‘sh chegaralar bitta.', 'table {\n  border-collapse: {{1}};\n}', [
        'collapse',
      ]),
      'Kataklar orasida bitta chiziq.',
    ),
    why(
      codeFill('q2', 'Raqamli katak o‘ngga.', 'td.raqam {\n  text-align: {{1}};\n}', ['right']),
      'Xonalar bir ustunda turadi.',
    ),
    why(
      tf('q3', '`th` standart holda markazda tekislanadi, mashqda esa chapga.', true),
      'Chapga tekislash o‘qishni osonlashtiradi.',
    ),
  ]),
  display: miniQuiz([
    why(
      match('q1', 'Talabni qiymat bilan moslang.', [
        ['Havolalar ustma-ust', 'display: block'],
        ['li lar bir qatorda', 'display: inline'],
        ['Butunlay yashirin', 'display: none'],
        ['Ko‘rinmas, joyi qoladi', 'visibility: hidden'],
      ]),
      'Yashirishning ikki usuli farq qiladi.',
    ),
    why(
      tf('q2', '`display: none` element joyini ham olib tashlaydi.', true),
      'Qo‘shnilar uning o‘rnini egallaydi.',
    ),
    why(
      q(
        'q3',
        '`display` nimani o‘zgartiradi?',
        ['Faqat ko‘rinishni', 'HTML ma’nosini', 'Teg nomini', 'Matnni'],
        [0],
      ),
      'Ma’no HTML’da qoladi.',
    ),
  ]),
  'max-width': miniQuiz([
    why(
      codeFill(
        'q1',
        'Rasm konteynerdan chiqmasin.',
        'img {\n  max-width: 100%;\n  height: {{1}};\n}',
        ['auto'],
      ),
      'Nisbat saqlanadi.',
    ),
    why(
      q(
        'q2',
        'Konteyner chetlarida telefonda bo‘sh joy bo‘lishi uchun?',
        ['padding: 0 16px', 'margin: 0', 'width: 100vw', 'border: 16px'],
        [0],
      ),
      'Matn ekran chetiga yopishmaydi.',
    ),
    why(
      tf('q3', '`max-width` + `margin: 0 auto` — markazdagi konteyner naqshi.', true),
      'Eng ko‘p ishlatiladigan maket qatori.',
    ),
  ]),
  position: miniQuiz([
    why(
      codeFill('q1', 'Yorliq uchun tayanch.', '.karta {\n  position: {{1}};\n}', ['relative']),
      'Absolute bola shu kartaga nisbatan joylashadi.',
    ),
    why(
      match('q2', 'Elementni `position` bilan moslang.', [
        ['.yorliq (karta burchagida)', 'absolute'],
        ['.yuqoriga (ekran burchagida)', 'fixed'],
      ]),
      '`fixed` — oynaga nisbatan.',
    ),
    why(tf('q3', '`absolute` element oqimda o‘z joyini saqlaydi.', false), 'U oqimdan chiqadi.'),
  ]),
  'z-index': miniQuiz([
    why(
      codeFill(
        'q1',
        'Fon butun ekranni qoplasin.',
        '.modal-fon {\n  position: fixed;\n  {{1}}: 0;\n  z-index: 100;\n}',
        ['inset'],
      ),
      '`inset: 0` — to‘rt tomon 0.',
    ),
    why(
      q(
        'q2',
        '`.belgi` dagi `z-index: 5` ishlamayapti. Yechim?',
        ['position: relative qo‘shish', 'z-index: 999', '!important', 'display: block'],
        [0],
      ),
      '`z-index` joylashtirilgan elementda ishlaydi.',
    ),
    why(tf('q3', 'Katta `z-index` li element ustda turadi.', true), 'Bir qatlam konteksti ichida.'),
  ]),
  overflow: miniQuiz([
    why(
      codeFill('q1', 'Chat vertikal aylansin.', '.chat {\n  height: 120px;\n  {{1}}: auto;\n}', [
        'overflow-y',
      ]),
      'Kerak bo‘lsagina panel chiqadi.',
    ),
    why(
      sortInto('q2', '“…” bilan qisqartirish uchun qaysi qoidalar kerak?', {
        Kerak: ['white-space: nowrap', 'overflow: hidden', 'text-overflow: ellipsis'],
        'Kerak emas': ['overflow-y: auto'],
      }),
      'Uchalasi birga.',
    ),
    why(
      q(
        'q3',
        'Kod bloki gorizontal aylansin.',
        ['overflow-x: auto', 'overflow: visible', 'white-space: normal', 'overflow-y: hidden'],
        [0],
      ),
      'Uzun qator kesilmaydi.',
    ),
  ]),
  float: miniQuiz([
    why(
      codeFill(
        'q1',
        'Rasm chapga, matn atrofida.',
        '.maqola img {\n  float: {{1}};\n  margin-right: 16px;\n}',
        ['left'],
      ),
      'Matn o‘ng tomondan oqadi.',
    ),
    why(
      q(
        'q2',
        'Nega `margin-right`?',
        [
          'Matn rasmga yopishmasligi uchun',
          'Rasm kattalashadi',
          'Rasm o‘ngga suriladi',
          'Kerak emas',
        ],
        [0],
      ),
      'Ichki tomondan bo‘shliq.',
    ),
    why(
      tf(
        'q3',
        '`.iqtibos` ga `float: right` va `width: 40%` berilsa, matn uning chap tomonidan oqadi.',
        true,
      ),
      'Kenglik berilmasa iqtibos butun qatorni olishi mumkin.',
    ),
  ]),
  clear: miniQuiz([
    why(
      codeFill('q1', 'Quti suzayotgan rasmni o‘rasin.', '.quti {\n  display: {{1}};\n}', [
        'flow-root',
      ]),
      'Ota balandligi tiklanadi.',
    ),
    why(
      codeFill('q2', 'Sarlavha rasm ostidan boshlansin.', '.maqola h2 {\n  clear: {{1}};\n}', [
        'both',
      ]),
      'Ikkala tomondagi suzuvchilar ostidan.',
    ),
    why(
      tf('q3', 'Bugun sahifa maketi uchun float o‘rniga Flexbox yoki Grid ishlatiladi.', true),
      'Float faqat matnni rasm atrofidan oqizish uchun.',
    ),
  ]),
  'inline-block': miniQuiz([
    why(
      codeFill(
        'q1',
        'Teg “tabletka” shaklida.',
        '.teg {\n  display: inline-block;\n  border-radius: {{1}};\n}',
        ['999px'],
      ),
      'Katta radius — tabletka.',
    ),
    why(
      tf('q2', '`inline-block` elementda vertikal padding joy egallaydi.', true),
      '`inline` da esa yo‘q.',
    ),
    why(
      q(
        'q3',
        'Kartochkalar orasida kutilmagan kichik bo‘shliq sababi?',
        ['HTML’dagi bo‘sh joy/qator', 'margin: 4px', 'Brauzer xatosi', 'padding'],
        [0],
      ),
      'inline-block matn kabi oqimda turadi.',
    ),
  ]),
  align: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kontent markazda.',
        '.qahramon {\n  display: grid;\n  place-items: {{1}};\n  min-height: 200px;\n}',
        ['center'],
      ),
      'Grid bilan eng qisqa markazlash.',
    ),
    why(
      match('q2', 'Nimani qanday markazlash.', [
        ['Matn (h1)', 'text-align: center'],
        ['Blok konteyner', 'margin: 0 auto'],
        ['Ichidagi element (ikki o‘q)', 'display: grid; place-items: center'],
      ]),
      'Har holatga o‘z usuli.',
    ),
    why(
      tf('q3', '`text-align: center` blok elementning o‘zini markazga suradi.', false),
      'U faqat ichidagi matnni tekislaydi.',
    ),
  ]),
  combinators: miniQuiz([
    why(
      codeFill(
        'q1',
        'Faqat bevosita bandlar.',
        '.menyu {{1}} li {\n  border-bottom: 1px solid #dddddd;\n}',
        ['>'],
      ),
      'Ichki ro‘yxat bandlari tanlanmaydi.',
    ),
    why(
      match('q2', 'Kombinatorni ma’nosi bilan moslang.', [
        ['A B', 'Istalgan chuqurlikdagi avlod'],
        ['A + B', 'Darhol keyingi qo‘shni'],
        ['A ~ B', 'Keyingi barcha qo‘shnilar'],
      ]),
      'HTML’ni o‘zgartirmasdan tanlash.',
    ),
    why(
      tf('q3', 'Mashqda HTML’ga klass qo‘shish ruxsat etilgan.', false),
      'Faqat selektorlar bilan ishlanadi.',
    ),
  ]),
  'pseudo-classes': miniQuiz([
    why(
      codeFill(
        'q1',
        'Oxirgi bandda chegara bo‘lmasin.',
        '.royxat li:{{1}} {\n  border-bottom: none;\n}',
        ['last-child'],
      ),
      'Tuzilma psevdoklassi.',
    ),
    why(
      q('q2', 'Juft qatorlar?', [':nth-child(even)', ':nth-child(odd)', ':even', ':nth(2)'], [0]),
      '`odd` — toq.',
    ),
    why(
      tf('q3', '`:hover` va `:focus-visible` — holat psevdoklasslari.', true),
      'Foydalanuvchi harakatiga bog‘liq.',
    ),
  ]),
  'pseudo-elements': miniQuiz([
    why(
      codeFill(
        'q1',
        'Bo‘sh bezak chizig‘i.',
        '.sarlavha::after {\n  content: {{1}};\n  display: block;\n}',
        ['""'],
      ),
      '`content` bo‘lmasa psevdoelement yaratilmaydi.',
    ),
    why(
      q(
        'q2',
        'Element matnidan oldin qo‘shiladigan qism?',
        ['::before', '::after', '::first-line', '::marker'],
        [0],
      ),
      '`::after` — keyin.',
    ),
    why(
      tf('q3', 'Psevdoelementdagi matnni ekran o‘qiydigan dasturlar har doim o‘qiydi.', false),
      'Muhim matnni psevdoelementga yozmang.',
    ),
  ]),
  'attribute-selectors': miniQuiz([
    why(
      codeFill(
        'q1',
        'Email maydonlari.',
        'input[type{{1}}"email"] {\n  border: 2px solid #0071dc;\n}',
        ['='],
      ),
      'Aniq qiymat.',
    ),
    why(
      codeFill(
        'q2',
        '.pdf bilan tugaydigan havolalar.',
        'a[href{{1}}".pdf"]::after {\n  content: " (PDF)";\n}',
        ['$='],
      ),
      '`^=` — boshlanadi, `$=` — tugaydi.',
    ),
    why(
      q(
        'q3',
        'Manzilida “youtube” bor havolalar?',
        ['a[href*="youtube"]', 'a[href^="youtube"]', 'a[href="youtube"]', 'a.youtube'],
        [0],
      ),
      '`*=` — ichida bor.',
    ),
  ]),
  specificity: miniQuiz([
    why(
      codeFill('q1', 'ID maxsusligini nolga tushiring.', ':{{1}}(#asosiy) p {\n  color: #333;\n}', [
        'where',
      ]),
      '`:where()` maxsusligi doim 0.',
    ),
    why(order('q2', 'Kuchsizdan kuchliga.', ['p', '.matn', '#asosiy p']), 'Teg < klass < id.'),
    why(
      tf('q3', 'Mashqda `!important` ishlatish ruxsat etilgan.', false),
      'Maxsuslik selektorlar bilan tuzatiladi.',
    ),
  ]),
  important: miniQuiz([
    why(
      codeFill(
        'q1',
        'Yordamchi klass hamma narsani yengsin.',
        '.yashirin {\n  display: none {{1}};\n}',
        ['!important'],
      ),
      'Yordamchi klasslar uchun o‘rinli istisno.',
    ),
    why(
      q(
        'q2',
        '`@layer asos { … }` ichidagi qoidalar qatlamsiz qoidalarga nisbatan?',
        ['Kuchsizroq', 'Kuchliroq', 'Teng', 'Ishlamaydi'],
        [0],
      ),
      'Qatlamsiz uslub qatlamdagidan ustun keladi.',
    ),
    why(
      tf('q3', '`!important` ni hamma joyda ishlatish yaxshi odat.', false),
      'U keyingi o‘zgarishlarni qiyinlashtiradi.',
    ),
  ]),
  opacity: miniQuiz([
    why(
      codeFill(
        'q1',
        'Galereya rasmi hover’da to‘liq ko‘rinsin.',
        '.galereya img:hover {\n  opacity: {{1}};\n}',
        ['1'],
      ),
      'Standart holda `0.8`.',
    ),
    why(
      q(
        'q2',
        'Banner matni xira bo‘lmasin, fon shaffof qolsin.',
        [
          'background: rgba(0, 113, 220, 0.6)',
          'opacity: 0.6',
          'filter: opacity(0.6)',
          'color: transparent',
        ],
        [0],
      ),
      'Faqat rangning alfasi.',
    ),
    why(
      tf('q3', '`opacity` bolalar elementlarga ham ta’sir qiladi.', true),
      'Butun element shaffof bo‘ladi.',
    ),
  ]),
  'navbar-vertical': miniQuiz([
    why(
      codeFill(
        'q1',
        'Butun qator bosilsin.',
        '.yon-menyu a {\n  display: {{1}};\n  padding: 10px 16px;\n}',
        ['block'],
      ),
      'Havola butun kenglikni oladi.',
    ),
    why(
      codeFill(
        'q2',
        'Joriy sahifa havolasi.',
        '.yon-menyu a[aria-current="{{1}}"] {\n  background: #0071dc;\n}',
        ['page'],
      ),
      'Atribut selektori bilan.',
    ),
    why(
      sortInto('q3', 'Ro‘yxatni tozalash.', {
        Kerak: ['list-style: none', 'margin: 0', 'padding: 0'],
        'Kerak emas': ['float: left'],
      }),
      'Brauzer standart uslublari olib tashlanadi.',
    ),
  ]),
  'navbar-horizontal': miniQuiz([
    why(
      codeFill(
        'q1',
        'Logo chapda, menyu o‘ngda.',
        '.sarlavha {\n  display: flex;\n  justify-content: {{1}};\n}',
        ['space-between'],
      ),
      'Bo‘sh joy ular orasiga.',
    ),
    why(
      codeFill('q2', 'Vertikal markaz.', '.sarlavha {\n  {{1}}: center;\n}', ['align-items']),
      'Kesuvchi o‘q bo‘ylab.',
    ),
    why(
      tf('q3', 'Menyu bandlari orasidagi masofani `gap` bilan berish mumkin.', true),
      'Flex konteynerda.',
    ),
  ]),
  dropdowns: miniQuiz([
    why(
      codeFill(
        'q1',
        'Menyu tugma ostidan boshlansin.',
        '.dropdown-menyu {\n  position: absolute;\n  top: {{1}};\n}',
        ['100%'],
      ),
      'Ota balandligining 100%.',
    ),
    why(
      codeFill(
        'q2',
        'Klaviatura bilan ham ochilsin.',
        '.dropdown:hover .dropdown-menyu,\n.dropdown:{{1}} .dropdown-menyu {\n  display: block;\n}',
        ['focus-within'],
      ),
      'Ichidagi element fokusda bo‘lsa.',
    ),
    why(
      tf('q3', 'Ota `.dropdown` ga `position: relative` kerak.', true),
      'Menyu unga nisbatan joylashadi.',
    ),
  ]),

  'image-gallery': miniQuiz([
    why(
      codeFill(
        'q1',
        'Moslashuvchan galereya to‘ri.',
        '.galereya {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, {{1}}(180px, 1fr));\n}',
        ['minmax'],
      ),
      'Ustunlar soni ekranga qarab o‘zgaradi.',
    ),
    why(
      codeFill('q2', '`figure` ning standart chetini olib tashlang.', 'figure {\n  {{1}}: 0;\n}', [
        'margin',
      ]),
      'Brauzer `figure` ga margin beradi.',
    ),
    why(
      tf('q3', '`img { display: block }` rasm ostidagi kichik bo‘shliqni yo‘qotadi.', true),
      'Inline rasm matn chizig‘ida turadi.',
    ),
  ]),
  'image-sprites': miniQuiz([
    why(
      q(
        'q1',
        '96×32 spraytda ikkinchi (sariq) ikonka uchun `background-position`?',
        ['-32px 0', '32px 0', '0 -32px', '-64px 0'],
        [0],
      ),
      'Rasm 32px chapga suriladi.',
    ),
    why(
      codeFill(
        'q2',
        'Ikonka “oynasi”.',
        '.ikonka {\n  display: inline-block;\n  width: 32px;\n  {{1}}: 32px;\n}',
        ['height'],
      ),
      'Element o‘lchami ko‘rinadigan qism.',
    ),
    why(tf('q3', 'Spraytdagi uchinchi ikonka uchun `-64px 0`.', true), '2 × 32 = 64.'),
  ]),
  forms: miniQuiz([
    why(
      sortInto('q1', 'Maydon qoidalarini vazifasiga ajrating.', {
        'Kenglik ota’dan chiqmasin': ['width: 100%', 'box-sizing: border-box'],
        'Matn qulay': ['padding: 10px 12px', 'font: inherit'],
      }),
      'To‘rtta qoida birga.',
    ),
    why(
      codeFill('q2', 'Checkbox rangi.', 'input[type="checkbox"] {\n  {{1}}: #0071dc;\n}', [
        'accent-color',
      ]),
      'Brauzerning o‘z elementi bo‘yaladi.',
    ),
    why(
      q(
        'q3',
        '`textarea` faqat vertikal kattalashsin.',
        ['resize: vertical', 'resize: none', 'overflow: auto', 'height: auto'],
        [0],
      ),
      'Gorizontal kattalashish maketni buzadi.',
    ),
  ]),
  counters: miniQuiz([
    why(
      order('q1', 'Hisoblagich qadamlari.', [
        'counter-reset',
        'counter-increment',
        'content: counter()',
      ]),
      'Yaratish, oshirish, chiqarish.',
    ),
    why(
      codeFill(
        'q2',
        'Raqamni sarlavha oldiga chiqaring.',
        '.maqola h2::before {\n  content: {{1}}(bolim) ". ";\n}',
        ['counter'],
      ),
      'Hisoblagich nomi qavsda.',
    ),
    why(tf('q3', '`counter-reset` ota elementga beriladi.', true), 'Mashqda `.maqola` ga.'),
  ]),
  'website-layout': miniQuiz([
    why(
      codeFill('q1', 'Asosiy qism qolgan balandlikni olsin.', '.sahifa {\n  {{1}}: 1;\n}', [
        'flex',
      ]),
      'Footer pastga suriladi.',
    ),
    why(
      q(
        'q2',
        'Kontent va 280px yon panel?',
        [
          'grid-template-columns: 1fr 280px',
          'grid-template-columns: 280px',
          'width: 280px 1fr',
          'columns: 2',
        ],
        [0],
      ),
      '`1fr` qolgan joyni oladi.',
    ),
    why(
      tf('q3', '`body` ga `min-height: 100vh` va flex ustun — footer har doim pastda.', true),
      'Kontent kam bo‘lsa ham.',
    ),
  ]),
  units: miniQuiz([
    why(
      match('q1', 'Birlikni nimaga nisbatan ekanligi bilan moslang.', [
        ['1em', 'Elementning o‘z shrifti'],
        ['1rem', 'html shrifti'],
      ]),
      'Mashqda karta shrifti 20px → 1em = 20px.',
    ),
    why(
      tf('q2', 'Tugmaning `padding: 0.5em 1em` qiymati katta tugmada o‘zi kattalashadi.', true),
      'em shriftga moslashadi.',
    ),
    why(
      fill('q3', 'Hisoblang.', 'Shrift 20px bo‘lsa, 1em = {{1}}px', ['20']),
      'em — o‘sha elementning shrifti.',
    ),
  ]),
  'math-functions': miniQuiz([
    why(
      codeFill(
        'q1',
        'Yon paneldan qolgan kenglik.',
        '.asosiy {\n  width: {{1}}(100% - 280px);\n}',
        ['calc'],
      ),
      '`-` atrofida bo‘sh joy shart.',
    ),
    why(
      q(
        'q2',
        '`width: min(100% - 32px, 1100px)` nima qiladi?',
        [
          'Kichigini oladi: tor ekranda 100% − 32px, keng ekranda 1100px',
          'Kattasini oladi',
          'Har doim 1100px',
          'Xato',
        ],
        [0],
      ),
      '`min()` — yuqori chegara.',
    ),
    why(
      codeFill('q3', 'Suyuq sarlavha.', 'h1 {\n  font-size: {{1}}(1.75rem, 4vw + 1rem, 3rem);\n}', [
        'clamp',
      ]),
      'Min, ideal, max.',
    ),
  ]),
  variables: miniQuiz([
    why(
      codeFill('q1', 'Global o‘zgaruvchi.', ':{{1}} {\n  --rang-asosiy: #0071dc;\n}', ['root']),
      '`:root` — sahifa ildizi.',
    ),
    why(
      q(
        'q2',
        '`var(--tugma-fon, var(--rang-asosiy))` nimani bildiradi?',
        [
          '--tugma-fon bo‘lmasa, asosiy rang ishlatiladi',
          'Ikki rang aralashadi',
          'Xato',
          'Har doim asosiy rang',
        ],
        [0],
      ),
      'Ikkinchi argument — zaxira.',
    ),
    why(tf('q3', 'O‘zgaruvchi nomi `--` bilan boshlanadi.', true), 'Masalan, `--radius`.'),
  ]),
  'border-images': miniQuiz([
    why(
      codeFill(
        'q1',
        'Gradient chegara.',
        '.gradient-chegara {\n  border: 4px solid;\n  border-image: linear-gradient(90deg, #0071dc, #fec400) {{1}};\n}',
        ['1'],
      ),
      'Oxirgi `1` — slice.',
    ),
    why(
      tf('q2', '`border-image` `border-radius` bilan yumaloq bo‘lmaydi.', true),
      'Yumaloq uchun ikki qatlamli fon usuli.',
    ),
    why(
      q(
        'q3',
        'Yumaloq gradient chegara uchun chegara rangi?',
        ['transparent', 'black', 'currentColor', 'gradient'],
        [0],
      ),
      'Gradient fon chegara ostidan ko‘rinadi.',
    ),
  ]),
  'background-size': miniQuiz([
    why(
      match('q1', 'Talabni qiymat bilan moslang.', [
        ['Maydonni qoplasin', 'cover'],
        ['Logo to‘liq ko‘rinsin', 'contain'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      codeFill(
        'q2',
        'Rasm markazdan kesilsin.',
        '.qahramon {\n  background-size: cover;\n  background-position: {{1}};\n}',
        ['center'],
      ),
      'Muhim qism ko‘rinib qoladi.',
    ),
    why(tf('q3', '`contain` da maydonda bo‘sh joy qolishi mumkin.', true), 'Rasm kesilmaydi.'),
  ]),
  'color-keywords': miniQuiz([
    why(
      codeFill('q1', 'Tab chegarasi sakramasin.', '.tab {\n  border-bottom: 3px solid {{1}};\n}', [
        'transparent',
      ]),
      'Hover’da faqat rang o‘zgaradi.',
    ),
    why(
      q(
        'q2',
        'Chegara matn rangini olsin.',
        [
          'border-color: currentColor',
          'border-color: inherit',
          'border-color: auto',
          'border-color: text',
        ],
        [0],
      ),
      '`currentColor` — joriy `color`.',
    ),
    why(
      tf('q3', '`inherit` ota elementning qiymatini oladi.', true),
      'Istalgan xususiyatda ishlaydi.',
    ),
  ]),
  'linear-gradients': miniQuiz([
    why(
      codeFill(
        'q1',
        'Chapdan o‘ngga banner.',
        '.banner {\n  background-image: linear-gradient({{1}}, #0071dc, #00b4d8);\n}',
        ['90deg'],
      ),
      '`90deg` = `to right`.',
    ),
    why(
      tf('q2', 'Bayroqdagi keskin chiziqlar uchun ranglar bir xil nuqtada to‘xtaydi.', true),
      'Masalan, `33%` da tugab, `33%` da boshlanadi.',
    ),
    why(
      q(
        'q3',
        'Chiziqli naqsh uchun?',
        ['repeating-linear-gradient', 'radial-gradient', 'conic-gradient', 'linear-pattern'],
        [0],
      ),
      'Gradient takrorlanadi.',
    ),
  ]),
  'radial-gradients': miniQuiz([
    why(
      codeFill(
        'q1',
        'Nuqtali fon katagi.',
        '.nuqtalar {\n  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);\n  {{1}}: 16px 16px;\n}',
        ['background-size'],
      ),
      'Kichik katak takrorlanib, nuqtalar to‘ri.',
    ),
    why(
      q(
        'q2',
        'Doiraviy diagramma uchun gradient?',
        ['conic-gradient', 'linear-gradient', 'radial-gradient', 'repeating-linear-gradient'],
        [0],
      ),
      'Rang markaz atrofida aylanadi.',
    ),
    why(
      tf('q3', 'Diagramma doira bo‘lishi uchun `border-radius: 50%` beriladi.', true),
      'Kvadrat element doiraga aylanadi.',
    ),
  ]),
  'box-shadow': miniQuiz([
    why(
      codeFill(
        'q1',
        'Maydon ichki soyasi.',
        '.maydon {\n  box-shadow: {{1}} 0 2px 4px rgba(0, 0, 0, 0.08);\n}',
        ['inset'],
      ),
      'Ichki soya.',
    ),
    why(
      tf('q2', 'Hover’da kattaroq va xiraroq soya karta “ko‘tarilgandek” ko‘rinadi.', true),
      'Yorug‘lik tepadan tushgandek.',
    ),
    why(
      order('q3', 'Qiymatlar tartibi.', ['x', 'y', 'xiralik', 'rang']),
      'Yoyilish (spread) xiralikdan keyin, ixtiyoriy.',
    ),
  ]),
  'text-effects': miniQuiz([
    why(
      codeFill(
        'q1',
        'Gradientli matn.',
        '.gradient-matn {\n  background: linear-gradient(90deg, #0071dc, #fec400);\n  {{1}}: text;\n  color: transparent;\n}',
        ['background-clip'],
      ),
      'Fon faqat harflar ichida.',
    ),
    why(
      q(
        'q2',
        'Matnni vertikal yozish?',
        [
          'writing-mode: vertical-rl',
          'transform: rotate(90deg) har doim',
          'text-orientation: up',
          'direction: vertical',
        ],
        [0],
      ),
      'Yozuv rejimi o‘zgaradi.',
    ),
    why(
      tf(
        'q3',
        'Kontur matn uchun `color: transparent` va `-webkit-text-stroke` ishlatiladi.',
        true,
      ),
      'Faqat harf chizig‘i ko‘rinadi.',
    ),
  ]),
  'transforms-2d': miniQuiz([
    why(
      codeFill('q1', 'Belgini 5° qiyshaytiring.', '.belgi {\n  transform: {{1}}(-5deg);\n}', [
        'rotate',
      ]),
      'Manfiy — soat miliga teskari.',
    ),
    why(
      codeFill(
        'q2',
        'Hover’da 4px yuqoriga.',
        '.karta:hover {\n  transform: translateY({{1}});\n}',
        ['-4px'],
      ),
      'Manfiy Y — yuqoriga.',
    ),
    why(
      q(
        'q3',
        'Burilish nuqtasi chap yuqori burchak?',
        ['transform-origin: left top', 'transform: left top', 'origin: 0', 'rotate-origin: left'],
        [0],
      ),
      'Standart — markaz.',
    ),
  ]),
  'transforms-3d': miniQuiz([
    why(
      codeFill('q1', 'Sahnaga chuqurlik.', '.sahna {\n  {{1}}: 800px;\n}', ['perspective']),
      'Ota elementga beriladi.',
    ),
    why(
      codeFill(
        'q2',
        'Kartochka ag‘darilsin.',
        '.sahna:hover .karta {\n  transform: rotateY({{1}});\n}',
        ['180deg'],
      ),
      'Vertikal o‘q atrofida.',
    ),
    why(
      tf('q3', '`transform-style: preserve-3d` bolalarni 3D fazoda saqlaydi.', true),
      'Aks holda ular yassilanadi.',
    ),
  ]),
  transitions: miniQuiz([
    why(
      codeFill('q1', 'Fon silliq o‘zgarsin.', '.tugma {\n  transition: {{1}} 0.3s ease;\n}', [
        'background-color',
      ]),
      'Aniq xususiyatni ko‘rsating.',
    ),
    why(
      tf('q2', '`transition` boshlang‘ich holatga yoziladi, `:hover` ga emas.', true),
      'Shunda qaytishda ham silliq.',
    ),
    why(
      q(
        'q3',
        'Interfeys uchun eng tabiiy egri chiziq?',
        ['ease-out', 'linear', 'ease-in', 'steps(4)'],
        [0],
      ),
      'Sekin tugaydi.',
    ),
  ]),
  animations: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kadrlar.',
        '@{{1}} aylanish {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}',
        ['keyframes'],
      ),
      'Animatsiya nomi `aylanish`.',
    ),
    why(
      codeFill('q2', 'Cheksiz aylanish.', '.yuklash {\n  animation: aylanish 1s linear {{1}};\n}', [
        'infinite',
      ]),
      'To‘xtamay takrorlanadi.',
    ),
    why(
      tf('q3', '`prefers-reduced-motion` so‘ralganda animatsiyani kamaytirish kerak.', true),
      'Ba’zi foydalanuvchilar uchun harakat zararli.',
    ),
  ]),
  tooltips: miniQuiz([
    why(
      codeFill(
        'q1',
        'Tooltip tugma ustida 8px oraliq bilan.',
        '.maslahat-matn {\n  position: absolute;\n  bottom: {{1}}(100% + 8px);\n}',
        ['calc'],
      ),
      'Ota balandligi + 8px.',
    ),
    why(
      q(
        'q2',
        'Tooltip klaviatura fokusida ham chiqishi uchun?',
        [
          ':focus-visible (yoki :focus-within) qoidasi',
          'Faqat :hover',
          'title atributi',
          'onclick',
        ],
        [0],
      ),
      'Klaviatura foydalanuvchilari ham ko‘radi.',
    ),
    why(
      tf('q3', 'Ota `.maslahat` ga `position: relative` kerak.', true),
      'Tooltip unga nisbatan joylashadi.',
    ),
  ]),
  'image-styling': miniQuiz([
    why(
      codeFill('q1', 'Avatar.', '.avatar {\n  border-radius: 50%;\n  object-fit: {{1}};\n}', [
        'cover',
      ]),
      'Rasm doirani cho‘zilmay to‘ldiradi.',
    ),
    why(
      codeFill('q2', 'Kulrang logotip.', '.logo {\n  filter: {{1}}(1);\n}', ['grayscale']),
      'Hover’da `0` — rangli.',
    ),
    why(
      tf('q3', 'Barcha rasmlarga `max-width: 100%; height: auto` beriladi.', true),
      'Rasm konteynerdan chiqmaydi.',
    ),
  ]),
  'object-fit': miniQuiz([
    why(
      match('q1', 'Rasmni qiymat bilan moslang.', [
        ['Karta rasmi (to‘ldirsin)', 'cover'],
        ['Logo (to‘liq ko‘rinsin)', 'contain'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      codeFill(
        'q2',
        'Portretda yuz kesilmasin.',
        '.portret {\n  object-fit: cover;\n  {{1}}: top;\n}',
        ['object-position'],
      ),
      'Rasmning yuqori qismi ko‘rinadi.',
    ),
    why(
      tf('q3', '`object-fit` ishlashi uchun rasmga kenglik va balandlik beriladi.', true),
      'Quti o‘lchami bo‘lishi kerak.',
    ),
  ]),
  masking: miniQuiz([
    why(
      codeFill('q1', 'Doira shaklida kesing.', '.doira {\n  clip-path: {{1}}(50%);\n}', ['circle']),
      'Shakl bo‘yicha kesish.',
    ),
    why(
      q(
        'q2',
        'Qiya pastki chetli banner?',
        [
          'clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          'border-radius: 0 0 50% 0',
          'transform: skew()',
          'mask: none',
        ],
        [0],
      ),
      'Ko‘pburchak nuqtalari.',
    ),
    why(
      tf('q3', 'Silliq so‘nish uchun `mask-image` va gradient ishlatiladi.', true),
      '`clip-path` keskin chet beradi.',
    ),
  ]),
  buttons: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ikonka va matn tekis.',
        '.tugma {\n  display: {{1}};\n  align-items: center;\n}',
        ['inline-flex'],
      ),
      'Matn oqimida, ichi flex.',
    ),
    why(
      q('q2', 'Bosish maydoni kamida?', ['44px', '24px', '16px', '100px'], [0]),
      'Barmoq uchun qulay.',
    ),
    why(
      tf('q3', 'Shaffof chegara variantlarda o‘lcham sakramasligi uchun.', true),
      'Barcha variantlar bir xil o‘lchamda.',
    ),
  ]),
  pagination: miniQuiz([
    why(
      codeFill(
        'q1',
        'Raqam katak o‘rtasida.',
        '.sahifalash a {\n  display: grid;\n  {{1}}: center;\n}',
        ['place-items'],
      ),
      'Ikki o‘qda markaz.',
    ),
    why(
      q(
        'q2',
        'Bir va ikki xonali kataklar bir xil?',
        ['min-width: 40px', 'width: auto', 'padding: 0', 'flex: 1'],
        [0],
      ),
      'Eng kam kenglik.',
    ),
    why(
      tf('q3', 'Ro‘yxat `display: flex` va `gap` bilan qatorga tiziladi.', true),
      'Belgilari olib tashlanadi.',
    ),
  ]),
  'multi-columns': miniQuiz([
    why(
      codeFill('q1', 'Moslashuvchan ustunlar.', '.maqola {\n  {{1}}: 220px;\n}', ['column-width']),
      'Ustunlar soni ekranga qarab.',
    ),
    why(
      match('q2', 'Talabni xususiyat bilan moslang.', [
        ['Sarlavha barcha ustunlarda', 'column-span: all'],
        ['Rasm bo‘linmasin', 'break-inside: avoid'],
        ['Ustunlar orasida chiziq', 'column-rule'],
      ]),
      'Gazeta uslubi.',
    ),
    why(tf('q3', '`column-gap` ustunlar orasidagi masofani beradi.', true), 'Mashqda 32px.'),
  ]),
  'user-interface': miniQuiz([
    why(
      codeFill('q1', 'Bo‘lim sarlavhasi header ostida qolmasin.', 'h2 {\n  {{1}}: 80px;\n}', [
        'scroll-margin-top',
      ]),
      'Aylantirish biroz pastda to‘xtaydi.',
    ),
    why(
      match('q2', 'Talabni qiymat bilan moslang.', [
        ['textarea faqat vertikal', 'resize: vertical'],
        ['O‘chirilgan element', 'cursor: not-allowed'],
        ['Silliq aylantirish', 'scroll-behavior: smooth'],
      ]),
      'Kursor nima bo‘lishini ko‘rsatadi.',
    ),
    why(tf('q3', '`cursor: pointer` bosiladigan narsani bildiradi.', true), 'Qo‘l belgisi.'),
  ]),
  'box-sizing': miniQuiz([
    why(
      codeFill(
        'q1',
        'Hamma element va psevdoelementlar.',
        '*, *::before, *::{{1}} {\n  box-sizing: border-box;\n}',
        ['after'],
      ),
      'Psevdoelementlar ham hisobga olinadi.',
    ),
    why(
      tf('q2', '`border-box` da padding va chegara `width` ichida hisoblanadi.', true),
      'Ustunlar sig‘adi.',
    ),
    why(
      q(
        'q3',
        'Bu qoida fayl qayeriga yoziladi?',
        ['Boshiga', 'Oxiriga', 'Media so‘rov ichiga', 'Farqi yo‘q, lekin hech qachon'],
        [0],
      ),
      'Barcha qoidalarga asos.',
    ),
  ]),
  flexbox: miniQuiz([
    why(
      codeFill(
        'q1',
        'Sarlavha qatori.',
        '.sarlavha {\n  display: flex;\n  justify-content: space-between;\n  {{1}}: center;\n}',
        ['align-items'],
      ),
      'Vertikal markaz.',
    ),
    why(
      codeFill('q2', 'Menyu bandlari orasi.', '.menyu {\n  display: flex;\n  {{1}}: 16px;\n}', [
        'gap',
      ]),
      'Margin hisobisiz.',
    ),
    why(tf('q3', 'Flex faqat bevosita bolalarga ta’sir qiladi.', true), 'Nevaralar oddiy oqimda.'),
  ]),
  'flex-container': miniQuiz([
    why(
      codeFill(
        'q1',
        'Teglar keyingi qatorga o‘tsin.',
        '.teglar {\n  display: flex;\n  flex-wrap: {{1}};\n}',
        ['wrap'],
      ),
      'Sig‘masa yangi qator.',
    ),
    why(
      q(
        'q2',
        'Element ikki o‘qda markazda?',
        [
          'justify-content: center; align-items: center',
          'text-align: center',
          'margin: auto 0',
          'flex: center',
        ],
        [0],
      ),
      'Klassik markazlash.',
    ),
    why(
      codeFill(
        'q3',
        'Elementlar ustun bo‘lib.',
        '.ustun {\n  display: flex;\n  flex-direction: {{1}};\n}',
        ['column'],
      ),
      'Asosiy o‘q vertikal.',
    ),
  ]),
  'flex-items': miniQuiz([
    why(
      match('q1', 'Talabni xususiyat bilan moslang.', [
        ['Qidiruv bo‘sh joyni egallasin', 'flex-grow: 1'],
        ['Logo siqilmasin', 'flex-shrink: 0'],
        ['Ustunlar teng', 'flex: 1'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      tf('q2', '`flex: 1` — `flex-grow: 1; flex-shrink: 1; flex-basis: 0`.', true),
      'Teng ulushlar.',
    ),
    why(
      q(
        'q3',
        'Bitta elementni pastga tekislash?',
        ['align-self: flex-end', 'justify-self: end', 'order: -1', 'margin-top: 0'],
        [0],
      ),
      '`align-self` — bitta element uchun.',
    ),
  ]),
  'grid-intro': miniQuiz([
    why(
      codeFill(
        'q1',
        'Ikki ustun 2:1.',
        '.asosiy {\n  display: grid;\n  grid-template-columns: {{1}} 1fr;\n}',
        ['2fr'],
      ),
      'Birinchi ustun ikki ulush.',
    ),
    why(
      q('q2', 'Uchta teng ustun?', ['1fr 1fr 1fr', '33% 33%', 'auto', '3fr'], [0]),
      'Yoki `repeat(3, 1fr)`.',
    ),
    why(
      tf('q3', '`gap` grid kataklari orasidagi masofani beradi.', true),
      'Satr va ustunlar orasiga.',
    ),
  ]),
  'grid-container': miniQuiz([
    why(
      codeFill(
        'q1',
        'Qatorlar kamida 120px.',
        '.kartalar {\n  grid-auto-rows: {{1}}(120px, auto);\n}',
        ['minmax'],
      ),
      'Kontent ko‘paysa o‘sadi.',
    ),
    why(
      tf('q2', '`repeat(auto-fill, minmax(220px, 1fr))` media so‘rovsiz moslashadi.', true),
      'Ustunlar soni o‘zi tanlanadi.',
    ),
    why(
      q(
        'q3',
        'Kartalar bo‘sh ustunlarda cho‘zilsin.',
        ['auto-fit', 'auto-fill', 'auto-rows', 'span'],
        [0],
      ),
      '`auto-fit` bo‘sh ustunlarni yig‘adi.',
    ),
  ]),
  'grid-items': miniQuiz([
    why(
      codeFill('q1', 'Sarlavha butun kenglikda.', '.sarlavha {\n  grid-column: 1 / {{1}};\n}', [
        '-1',
      ]),
      'Oxirgi chiziqqacha.',
    ),
    why(
      codeFill('q2', 'Katta element ikki qator.', '.katta {\n  grid-row: {{1}} 2;\n}', ['span']),
      'Ikki yo‘l egallaydi.',
    ),
    why(tf('q3', 'Chiziqlar 1 dan raqamlanadi.', true), 'Uch ustunda 4 ta chiziq.'),
  ]),
  'grid-layout': miniQuiz([
    why(
      codeFill('q1', 'Header hududi.', 'header {\n  {{1}}: sarlavha;\n}', ['grid-area']),
      'Nom tirnoqsiz.',
    ),
    why(
      tf('q2', 'Telefonda bitta ustunli hududlar xaritasi, katta ekranda boshqa xarita.', true),
      'Media so‘rovda faqat xarita o‘zgaradi.',
    ),
    why(
      q(
        'q3',
        'Hudud qanday shaklda bo‘lishi kerak?',
        ['To‘rtburchak', 'L shakli ham mumkin', 'Istalgan', 'Doira'],
        [0],
      ),
      'Aks holda qoida ishlamaydi.',
    ),
  ]),
  supports: miniQuiz([
    why(
      codeFill(
        'q1',
        'Qo‘llab-quvvatlansa ishlatilsin.',
        '@{{1}} (backdrop-filter: blur(8px)) {\n  .panel { backdrop-filter: blur(8px); }\n}',
        ['supports'],
      ),
      'Progressiv yaxshilash.',
    ),
    why(
      tf('q2', 'Asosiy (zaxira) uslub `@supports` dan tashqarida qoladi.', true),
      'Eski brauzer ham o‘qiladigan panelni ko‘radi.',
    ),
    why(
      q(
        'q3',
        'Progressiv yaxshilash nima?',
        [
          'Hammaga ishlaydigan asos + imkoni borlarga qo‘shimcha',
          'Faqat yangi brauzerlar uchun sayt',
          'Eski brauzerni bloklash',
          'JS bilan almashtirish',
        ],
        [0],
      ),
      'Hech kim sayt’siz qolmaydi.',
    ),
  ]),
  'rwd-intro': miniQuiz([
    why(
      codeFill(
        'q1',
        'Konteyner media so‘rovsiz.',
        '.konteyner {\n  width: {{1}}(100% - 32px, 1100px);\n  margin-inline: auto;\n}',
        ['min'],
      ),
      'Tor ekranda chetlar qoladi.',
    ),
    why(tf('q2', '`clamp()` sarlavhani ekranga moslashtiradi.', true), 'Min va max orasida.'),
    why(
      q(
        'q3',
        '`margin-inline: auto` nimani beradi?',
        ['Gorizontal markazlash', 'Vertikal markazlash', 'Chap margin 0', 'Hech narsa'],
        [0],
      ),
      'Chap va o‘ng marginlar teng.',
    ),
  ]),
  'rwd-viewport': miniQuiz([
    why(
      codeFill(
        'q1',
        'Viewport.',
        '<meta name="viewport" content="width=device-width, initial-scale={{1}}">',
        ['1'],
      ),
      'Boshqa qismlar olib tashlanadi.',
    ),
    why(
      tf('q2', '`user-scalable=no` kattalashtirishni taqiqlaydi va uni olib tashlash kerak.', true),
      'Foydalanuvchi kattalashtira olishi kerak.',
    ),
    why(
      q(
        'q3',
        'Qat’iy kenglikli `.maqola` uchun yechim?',
        ['max-width', 'width: 900px', 'min-width', 'zoom'],
        [0],
      ),
      'Ekranga sig‘adi.',
    ),
  ]),
  'rwd-grid-view': miniQuiz([
    why(
      codeFill(
        'q1',
        '12 ustun.',
        '.tor {\n  display: grid;\n  grid-template-columns: repeat({{1}}, 1fr);\n}',
        ['12'],
      ),
      'Ko‘p bo‘luvchili son.',
    ),
    why(
      codeFill(
        'q2',
        'Telefonda hammasi to‘liq kenglik.',
        '.tor > * {\n  grid-column: span {{1}};\n}',
        ['12'],
      ),
      'Mobil birinchi.',
    ),
    why(
      tf('q3', 'Katta ekranda media so‘rov ichida `span 6` kabi qiymatlar beriladi.', true),
      'Yarim kenglik.',
    ),
  ]),
  'media-queries': miniQuiz([
    why(
      codeFill(
        'q1',
        '768px dan keng ekranda.',
        '@media ({{1}}: 768px) {\n  .maket { grid-template-columns: 2fr 1fr; }\n}',
        ['min-width'],
      ),
      'Mobil birinchi.',
    ),
    why(tf('q2', 'Standart holda maket bitta ustun.', true), 'Telefon uchun.'),
    why(
      q(
        'q3',
        'Faqat telefonda ko‘rinadigan element?',
        [
          'Standart ko‘rinadi, min-width so‘rovida display: none',
          'Standart yashirin',
          'visibility',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Mobil birinchi mantiq.',
    ),
  ]),
  'mq-examples': miniQuiz([
    why(
      order('q1', 'Ustunlar sonini ekranga qarab tartiblang.', [
        '1 (standart)',
        '2 (≥ 600px)',
        '4 (≥ 1024px)',
      ]),
      'Mobil birinchi: kenglik oshgani sari ustun qo‘shiladi.',
    ),
    why(
      codeFill(
        'q2',
        '600px dan ikki ustun.',
        '@media (min-width: 600px) {\n  .kartalar { grid-template-columns: repeat({{1}}, 1fr); }\n}',
        ['2'],
      ),
      'Kattaroq ekranga qo‘shiladi.',
    ),
    why(tf('q3', 'Keyingi media so‘rov oldingisini qayta yozadi.', true), 'Kaskad tartibi.'),
  ]),
  'rwd-images': miniQuiz([
    why(
      codeFill(
        'q1',
        'Rasm nisbati 16:9.',
        '.karta img {\n  width: 100%;\n  {{1}}: 16 / 9;\n  object-fit: cover;\n}',
        ['aspect-ratio'],
      ),
      'Barcha rasmlar bir xil.',
    ),
    why(
      tf('q2', 'HTML’da `width` va `height` atributlari sahifa sakrashining oldini oladi.', true),
      'Nisbat oldindan ma’lum.',
    ),
    why(
      q(
        'q3',
        'Pastdagi rasmlar uchun?',
        ['loading="lazy"', 'fetchpriority="high"', 'decoding="sync"', 'Hech narsa'],
        [0],
      ),
      'Kerak bo‘lganda yuklanadi.',
    ),
  ]),
  'rwd-videos': miniQuiz([
    why(
      codeFill(
        'q1',
        'Video 16:9.',
        '.video iframe {\n  width: 100%;\n  height: auto;\n  aspect-ratio: {{1}};\n}',
        ['16 / 9'],
      ),
      'Eski padding hiylasi kerak emas.',
    ),
    why(tf('q2', 'Iframe’ga `title` kerak.', true), 'Ekran o‘quvchi uni o‘qiydi.'),
    why(
      q(
        'q3',
        'Keng ekranda video chegaralansin.',
        ['max-width: 960px; margin-inline: auto', 'width: 100vw', 'height: 100vh', 'zoom: 0.5'],
        [0],
      ),
      'Markazda va cheklangan.',
    ),
  ]),
  'rwd-frameworks': miniQuiz([
    why(
      match('q1', 'Utility klassni qoidasi bilan moslang.', [
        ['.flex', 'display: flex'],
        ['.flex-col', 'flex-direction: column'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      tf('q2', 'Utility klass bitta xususiyatni beradi.', true),
      'Freymvorklar shunday ishlaydi.',
    ),
    why(
      q(
        'q3',
        'Utility klasslarning kamchiligi?',
        ['HTML ko‘p klass bilan to‘ladi', 'Ishlamaydi', 'Sekin', 'Rang yo‘q'],
        [0],
      ),
      'Murakkab uslub uchun o‘z klassingiz yaxshiroq.',
    ),
  ]),

  'background-shorthand': miniQuiz([
    why(
      tf('q1', '`background` qisqa yozuvi berilmagan qismlarni standart qiymatga qaytaradi.', true),
      'Shuning uchun keyin yozilgan `background: #0e1133` gradientni o‘chirib yuboradi.',
    ),
    why(
      codeFill(
        'q2',
        'Rang va gradientni bitta qatorda bering.',
        '.hero {\n  background: #0e1133 {{1}}(#0071dc, #0e1133) no-repeat;\n}',
        ['linear-gradient'],
      ),
      'Rang ham, rasm ham bitta `background` da.',
    ),
    why(
      q(
        'q3',
        'Ikki qatlamli fonda qaysi qatlam ustda?',
        ['Vergul bilan yozilganlardan birinchisi', 'Oxirgisi', 'Rangi to‘qrog‘i', 'Kattarog‘i'],
        [0],
      ),
      'Fon rangi doim eng pastda.',
    ),
  ]),
  'table-styling': miniQuiz([
    why(
      codeFill(
        'q1',
        'Juft qatorlar foni.',
        'tbody tr:nth-child({{1}}) {\n  background: #f5faff;\n}',
        ['even'],
      ),
      'Zebra jadval.',
    ),
    why(
      codeFill('q2', 'Jadval nomi pastda.', 'caption {\n  {{1}}: bottom;\n}', ['caption-side']),
      'Standart — tepada.',
    ),
    why(
      tf('q3', 'Jadval o‘rami `overflow-x: auto` bilan kichik ekranda aylanadi.', true),
      'Sahifa gorizontal aylanmaydi.',
    ),
  ]),
  'at-property': miniQuiz([
    why(
      codeFill(
        'q1',
        'Burchak turidagi o‘zgaruvchi.',
        '@property --burchak {\n  syntax: "{{1}}";\n  inherits: false;\n  initial-value: 0deg;\n}',
        ['<angle>'],
      ),
      'Tur berilgani uchun animatsiya qilsa bo‘ladi.',
    ),
    why(
      q(
        'q2',
        'Noto‘g‘ri qiymat (`--qadam: qizil`) berilsa nima bo‘ladi?',
        ['initial-value ishlatiladi', 'Sahifa buziladi', 'Qizil rang chiqadi', 'Xato oynasi'],
        [0],
      ),
      'Turi mos kelmasa — boshlang‘ich qiymat.',
    ),
    why(
      tf('q3', '`inherits: true` o‘zgaruvchi bolalarga meros o‘tishini bildiradi.', true),
      'Mashqda `--qadam` meros oladi.',
    ),
  ]),
  'flex-responsive': miniQuiz([
    why(
      codeFill(
        'q1',
        'Kartalar kamida 240px, sig‘masa qatorga.',
        '.karta {\n  flex: 1 1 {{1}};\n}',
        ['240px'],
      ),
      'flex-basis — boshlang‘ich o‘lcham.',
    ),
    why(
      codeFill('q2', 'Tugma kartaning pastiga.', '.tugma {\n  margin-top: {{1}};\n}', ['auto']),
      'Bo‘sh joy tugma ustida to‘planadi.',
    ),
    why(
      tf('q3', 'Bunday kartochkalar media so‘rovsiz moslashadi.', true),
      '`flex-wrap: wrap` va `flex-basis` yetarli.',
    ),
  ]),
};
