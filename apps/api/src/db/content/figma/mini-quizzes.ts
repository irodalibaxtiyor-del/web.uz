import { codeFill, fill, match, miniQuiz, q, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the "Figma'dan kodga" course: three questions per exercise. */
export const FIGMA_MINI_QUIZZES: Record<string, QuizDef> = {
  'figma-interfeysi': miniQuiz([
    why(
      codeFill('q1', 'Fill #F8FAFC ni CSS’ga.', '.sahifa {\n  {{1}}: #f8fafc;\n}', [
        'background-color',
      ]),
      'Konteyner foni.',
    ),
    why(
      q(
        'q2',
        'Padding: tepa 48, chap/o‘ng 24, past 32?',
        [
          'padding: 48px 24px 32px',
          'padding: 24px 48px 32px',
          'padding: 48px 32px 24px',
          'padding: 32px',
        ],
        [0],
      ),
      'Uch qiymat: tepa, yonlar, past.',
    ),
    why(
      tf(
        'q3',
        '375 kenglikdagi freymni kodda `max-width: 375px` bilan cheklash shart emas — sahifa ekranga moslashadi.',
        true,
      ),
      'Freym — namuna ekran.',
    ),
  ]),
  inspect: miniQuiz([
    why(
      match('q1', 'Inspect qiymatini CSS bilan moslang.', [
        ['W 327 (Fixed)', 'max-width: 327px'],
        ['Gap 4', 'gap: 4px'],
        ['Stroke 1 Inside', 'border: 1px solid + border-box'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(tf('q2', '“H Hug” uchun balandlik yozilmaydi.', true), 'Kontentga qarab.'),
    why(
      codeFill('q3', 'Radius 12.', '.karta {\n  {{1}}: 12px;\n}', ['border-radius']),
      'Burchak radiusi.',
    ),
  ]),
  'px-rem': miniQuiz([
    why(fill('q1', 'Hisoblang.', '28px = {{1}}rem', ['1.75']), 'rem = px ÷ 16 → 28 ÷ 16.'),
    why(fill('q2', 'Hisoblang.', '14px = {{1}}rem', ['0.875']), 'rem = px ÷ 16 → 14 ÷ 16.'),
    why(
      tf('q3', 'O‘lchamlarni `:root` tokenlariga yig‘ish maketni kodga izchil ko‘chiradi.', true),
      'Bitta joydan.',
    ),
  ]),
  'rang-stillari': miniQuiz([
    why(
      codeFill('q1', 'Figma o‘zgaruvchisi → CSS.', ':root {\n  {{1}}primary-600: #0071dc;\n}', [
        '--',
      ]),
      'CSS o‘zgaruvchisi.',
    ),
    why(
      q(
        'q2',
        '`Primary/600` ni CSS’da qanday nomlash qulay?',
        ['--primary-600', '--Primary/600', 'primary600 (o‘zgaruvchisiz)', '$primary'],
        [0],
      ),
      '`/` CSS nomida ishlamaydi.',
    ),
    why(
      tf(
        'q3',
        'Komponentlar HEX emas, `var(--primary-600)` ishlatsa, rang bitta joydan o‘zgaradi.',
        true,
      ),
      'Rang tokenlari bitta joyda saqlanadi.',
    ),
  ]),
  'auto-layout': miniQuiz([
    why(
      codeFill('q1', 'Horizontal Auto Layout.', '.tugma {\n  display: {{1}};\n  gap: 8px;\n}', [
        'inline-flex',
      ]),
      'Tugma matn oqimida.',
    ),
    why(
      q(
        'q2',
        'Padding 10 (tepa/past) 16 (chap/o‘ng)?',
        ['padding: 10px 16px', 'padding: 16px 10px', 'padding: 10px', 'padding: 26px'],
        [0],
      ),
      'Vertikal, gorizontal.',
    ),
    why(
      tf(
        'q3',
        'Align: Center ikki o‘qda markazlash — `align-items` va `justify-content: center`.',
        true,
      ),
      'Matn tugma o‘rtasida.',
    ),
  ]),
  'hug-fill-fixed': miniQuiz([
    why(
      match('q1', 'Rejimni CSS bilan moslang.', [
        ['Fixed 120 (logo)', 'width: 120px; flex-shrink: 0'],
        ['Fill (qidiruv)', 'flex: 1; min-width: 0'],
        ['Hug (tugma)', 'Kenglik berilmaydi'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      tf('q2', 'Fill elementga `min-width: 0` bermasa, uzun kontent toshib ketishi mumkin.', true),
      'Flex elementning standart min-width i.',
    ),
    why(
      q(
        'q3',
        'Logo siqilmasligi uchun?',
        ['flex-shrink: 0', 'flex-grow: 1', 'min-width: 0', 'width: auto'],
        [0],
      ),
      'Fixed o‘lcham saqlanadi.',
    ),
  ]),
  'al-tekislash': miniQuiz([
    why(
      codeFill(
        'q1',
        'Header: Space between.',
        '.sarlavha {\n  display: flex;\n  justify-content: {{1}};\n}',
        ['space-between'],
      ),
      'Chetlarga taqsimlash.',
    ),
    why(
      codeFill(
        'q2',
        'Vertikal stek.',
        '.karta {\n  display: flex;\n  flex-direction: {{1}};\n  gap: 12px;\n}',
        ['column'],
      ),
      'Vertical ↓.',
    ),
    why(
      tf('q3', 'Vertikal yo‘nalishda gorizontal tekislash `align-items` bilan.', true),
      'O‘qlar almashadi.',
    ),
  ]),
  'al-wrap': miniQuiz([
    why(
      codeFill('q1', 'Teglar o‘ralsin.', '.teglar {\n  display: flex;\n  flex-wrap: {{1}};\n}', [
        'wrap',
      ]),
      'Wrap rejimi.',
    ),
    why(
      q(
        'q2',
        'Gorizontal gap 8, qatorlar orasi 12?',
        ['gap: 12px 8px', 'gap: 8px 12px', 'gap: 8px', 'margin: 12px 8px'],
        [0],
      ),
      '`gap: qator ustun` — avval row-gap.',
    ),
    why(
      tf('q3', '`row-gap` va `column-gap` ni alohida ham yozish mumkin.', true),
      'Alohida yozuv aniqroq o‘qiladi.',
    ),
  ]),
  absolyut: miniQuiz([
    why(
      codeFill('q1', 'Avatar o‘rami.', '.avatar {\n  position: {{1}};\n}', ['relative']),
      'Nishon unga nisbatan.',
    ),
    why(
      q(
        'q2',
        'Constraints Top + Right, X/Y −4?',
        ['top: -4px; right: -4px', 'top: 4px; left: 4px', 'bottom: -4px', 'margin: -4px'],
        [0],
      ),
      'Burchakdan biroz tashqarida.',
    ),
    why(
      tf('q3', 'Absolute nishon oqimdan chiqadi va boshqa elementlarni surmaydi.', true),
      'Ustma-ust turadi.',
    ),
  ]),
  constraints: miniQuiz([
    why(
      q(
        'q1',
        'Left & Right (chetlardan 24) banner kodda?',
        ['Kenglik yo‘q, margin-inline: 24px', 'width: 327px', 'width: 100vw', 'position: absolute'],
        [0],
      ),
      'Freym bilan cho‘ziladi.',
    ),
    why(
      tf('q2', 'Maketdagi aniq kenglikni (327) nusxalash boshqa ekranda buziladi.', true),
      'Constraint ma’nosini yozing.',
    ),
    why(
      codeFill(
        'q3',
        'Center constraint.',
        '.tugma {\n  width: 200px;\n  margin-inline: {{1}};\n}',
        ['auto'],
      ),
      'Markazda qoladi.',
    ),
  ]),
  'min-max': miniQuiz([
    why(
      codeFill('q1', 'Karta 280–480.', '.karta {\n  min-width: 280px;\n  {{1}}: 480px;\n}', [
        'max-width',
      ]),
      'Fill + cheklov.',
    ),
    why(
      codeFill(
        'q2',
        'Bir qatorli sarlavha.',
        '.sarlavha {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: {{1}};\n}',
        ['ellipsis'],
      ),
      'Truncate text.',
    ),
    why(
      tf(
        'q3',
        'Qisqartirilgan matnning to‘liq varianti (masalan, `title`) foydalanuvchiga mavjud bo‘lishi kerak.',
        true,
      ),
      'Ma’lumot yo‘qolmasin.',
    ),
  ]),
  'layout-grid': miniQuiz([
    why(
      codeFill(
        'q1',
        'Desktop 12 ustun.',
        '.tor {\n  grid-template-columns: repeat({{1}}, 1fr);\n  column-gap: 24px;\n}',
        ['12'],
      ),
      'Columns 12.',
    ),
    why(
      q(
        'q2',
        'Mobile: Columns 4, Gutter 16, Margin 16?',
        [
          'repeat(4, 1fr), gap 16px, padding-inline 16px',
          'repeat(16, 1fr)',
          '4 ta div',
          'columns: 4',
        ],
        [0],
      ),
      'Uch qiymat.',
    ),
    why(
      tf('q3', 'Margin — freym chetidan masofa — kodda `padding-inline`.', true),
      'Konteyner ichki bo‘shlig‘i.',
    ),
  ]),
  'breakpoint-freymlar': miniQuiz([
    why(
      q(
        'q1',
        'Ikki freymdan (360 va 1440) bitta sahifa qanday quriladi?',
        [
          'Mobil uslub standart, desktop farqlari media so‘rovda',
          'Ikki alohida HTML',
          'Faqat 1440 kodlanadi',
          'iframe',
        ],
        [0],
      ),
      'Avval mobil.',
    ),
    why(
      codeFill(
        'q2',
        'Desktopda menyu ko‘rinsin.',
        '.menyu { display: none; }\n@media (min-width: 64em) {\n  .menyu { display: {{1}}; }\n}',
        ['flex'],
      ),
      'Mobilda yashirin.',
    ),
    why(
      tf('q3', 'Sarlavha 24 dan 40 ga `clamp()` bilan silliq o‘sishi mumkin.', true),
      'Oraliq ekranlar ham.',
    ),
  ]),
  'text-styles': miniQuiz([
    why(fill('q1', 'Line height 120%.', 'line-height: {{1}}', ['1.2']), '120% → birliksiz 1.2.'),
    why(
      fill('q2', 'Letter spacing −2%.', 'letter-spacing: {{1}}em', ['-0.02']),
      'Foiz em ga aylanadi: −2% → −0.02em.',
    ),
    why(
      q(
        'q3',
        'Bold?',
        ['font-weight: 700', 'font-weight: 500', 'font-style: bold', 'font: bold-face'],
        [0],
      ),
      'Semi Bold — 600.',
    ),
  ]),
  soyalar: miniQuiz([
    why(
      tf('q1', 'Ikki Drop shadow kodda vergul bilan ajratilgan bitta `box-shadow`.', true),
      'Ko‘p qatlamli soya.',
    ),
    why(
      codeFill(
        'q2',
        'Inner shadow.',
        '.input {\n  box-shadow: {{1}} 0 1px 2px rgb(15 23 42 / 0.06);\n}',
        ['inset'],
      ),
      'Ichki soya.',
    ),
    why(fill('q3', '#0F172A 6% → alfa.', 'rgb(15 23 42 / {{1}})', ['0.06']), 'Foiz alfaga.'),
  ]),
  'radius-stroke': miniQuiz([
    why(
      codeFill('q1', 'Faqat tepa burchaklar.', '.muqova {\n  border-radius: 16px 16px {{1}};\n}', [
        '0 0',
      ]),
      'Chap-yuqoridan soat mili bo‘yicha.',
    ),
    why(
      q(
        'q2',
        'Stroke 2 Inside?',
        [
          'border: 2px solid + box-sizing: border-box',
          'outline: 2px',
          'box-shadow: 0 0 0 2px',
          'border: 4px',
        ],
        [0],
      ),
      'O‘lcham o‘zgarmaydi.',
    ),
    why(
      tf('q3', 'Outside stroke `box-shadow: 0 0 0 Npx` yoki `outline` bilan beriladi.', true),
      'Element tashqarisida.',
    ),
  ]),
  'fill-gradient': miniQuiz([
    why(
      codeFill(
        'q1',
        'Linear gradient 90°.',
        '.banner {\n  background: linear-gradient({{1}}, #0071dc, #005bb5);\n}',
        ['90deg'],
      ),
      'Chapdan o‘ngga.',
    ),
    why(
      match('q2', 'Shaffoflik turini CSS bilan moslang.', [
        ['Layer opacity 60%', 'opacity: 0.6 (butun element)'],
        ['Fill opacity 60%', 'rgb(… / 0.6) faqat fon'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(tf('q3', 'Layer opacity matnni ham xiralashtiradi.', true), 'Fill opacity esa yo‘q.'),
  ]),
  'komponent-klass': miniQuiz([
    why(
      codeFill('q1', 'Radius 999 (Full).', '.chip {\n  border-radius: {{1}};\n}', ['999px']),
      'Tabletka shakli.',
    ),
    why(
      q(
        'q2',
        'Padding 4/12?',
        ['padding: 4px 12px', 'padding: 12px 4px', 'padding: 4px', 'padding: 16px'],
        [0],
      ),
      'Vertikal 4, gorizontal 12.',
    ),
    why(
      tf('q3', 'Figma’dagi Main component kodda bitta CSS klass (`.chip`) bo‘ladi.', true),
      'Instance — shu klassli element.',
    ),
  ]),
  variantlar: miniQuiz([
    why(
      codeFill('q1', 'Katta variant.', '<button class="tugma {{1}}">Saqlash</button>', [
        'tugma--katta',
      ]),
      'Asos + modifikator.',
    ),
    why(
      q(
        'q2',
        'Size va Type variantlari kodda?',
        [
          'Modifikator klasslar (yoki data-atributlar)',
          'Har biriga alohida HTML element',
          'Inline style',
          'Rasm',
        ],
        [0],
      ),
      'Figma xususiyati = klass.',
    ),
    why(
      tf('q3', 'Modifikatorda faqat farq qiladigan xususiyatlar yoziladi.', true),
      'Asos takrorlanmaydi.',
    ),
  ]),
  interaktiv: miniQuiz([
    why(
      match('q1', 'State variantini psevdoklass bilan moslang.', [
        ['Hover', ':hover'],
        ['Focused', ':focus-visible'],
        ['Pressed', ':active'],
        ['Disabled', ':disabled'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      tf('q2', 'Focused holatida fon o‘zgarmasa ham aniq fokus halqasi bo‘lishi kerak.', true),
      'Klaviatura foydalanuvchisi uchun.',
    ),
    why(
      codeFill('q3', 'Hover fon.', '.tugma:{{1}} {\n  background: #005bb5;\n}', ['hover']),
      'Maketdagi Hover.',
    ),
  ]),
  eksport: miniQuiz([
    why(
      codeFill(
        'q1',
        'Retina ekran uchun logo.',
        '<img class="logo" src="logo.png" {{1}}="logo.png 1x, logo@2x.png 2x" alt="…">',
        ['srcset'],
      ),
      'Zichlik deskriptori.',
    ),
    why(
      q('q2', 'Ikonka qaysi formatda eksport qilinadi?', ['SVG', 'JPEG', 'GIF', 'BMP'], [0]),
      'Har o‘lchamda tiniq.',
    ),
    why(
      tf('q3', 'Logo 1x: 120 × 40, 2x: 240 × 80 — ekranda baribir 120 × 40 ko‘rinadi.', true),
      '2x tiniqlik uchun.',
    ),
  ]),
  'loyiha-header': miniQuiz([
    why(
      codeFill('q1', 'Header balandligi.', '.header {\n  {{1}}: 64px;\n}', ['min-height']),
      'height emas — kontent kesilmasin.',
    ),
    why(
      q(
        'q2',
        'Mobil: Space between, Align center?',
        [
          'display: flex; justify-content: space-between; align-items: center',
          'display: block',
          'text-align: center',
          'float',
        ],
        [0],
      ),
      'Auto layout → flex.',
    ),
    why(
      tf('q3', 'Mobil padding 0 16, desktop padding media so‘rovda kattalashadi.', true),
      'Ikki freym — bitta kod.',
    ),
  ]),
  'loyiha-hero': miniQuiz([
    why(
      q(
        'q1',
        'H1 Bold 48/56?',
        [
          'font-size: 48px; line-height: 56px',
          'font-size: 56px',
          'line-height: 48',
          'font-weight: 48',
        ],
        [0],
      ),
      'O‘lcham / qator.',
    ),
    why(
      codeFill(
        'q2',
        'Uch karta, gap 24.',
        '.kartalar {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  {{1}}: 24px;\n}',
        ['gap'],
      ),
      'Desktop maketidagi uch karta.',
    ),
    why(tf('q3', 'Mobilda kartalar bitta ustunda bo‘ladi.', true), 'Avval mobil.'),
  ]),
  'loyiha-footer': miniQuiz([
    why(
      codeFill(
        'q1',
        'To‘rt ustun 2:1:1:1.',
        '.footer-tor {\n  grid-template-columns: {{1}} 1fr 1fr 1fr;\n}',
        ['2fr'],
      ),
      'Birinchi ustun keng.',
    ),
    why(
      q(
        'q2',
        'Footer matni `#CBD5E1` qorong‘i `#0F172A` fonda — nima tekshiriladi?',
        ['Kontrast', 'Shrift nomi', 'Fayl hajmi', 'Z-index'],
        [0],
      ),
      'Matn o‘qilishi uchun kontrast muhim.',
    ),
    why(tf('q3', 'Mobilda footer ustunlari ustma-ust tushadi.', true), 'Bitta ustun.'),
  ]),
};
