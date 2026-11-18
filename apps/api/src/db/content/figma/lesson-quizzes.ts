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

/** Per-lesson tests of the "Figma'dan kodga" course (module-closing lessons keep their quiz). */
export const FIGMA_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Maketni o‘qish ---------------------------------------------------------
  'figma-interfeysi': lessonQuiz([
    why(
      match('q1', 'Figma tushunchasini HTML/CSS dagi mosi bilan moslang.', [
        ['Frame', 'div, section, main kabi konteyner'],
        ['Text', 'h1, p, span'],
        ['Component', 'Qayta ishlatiladigan CSS klass'],
        ['Style / Variable', 'CSS o‘zgaruvchi (token)'],
      ]),
      'Group — shunchaki guruhlash, ko‘pincha alohida element kerak emas.',
    ),
    why(
      match('q2', 'Panelni vazifasi bilan moslang.', [
        ['Layers (chap)', 'Qatlamlar daraxti — deyarli HTML tuzilmasi'],
        ['Canvas (markaz)', 'Maketning o‘zi'],
        ['Design (o‘ng)', 'Tanlangan qatlam o‘lchami, rangi, shrifti'],
        ['Dev Mode / Inspect', 'Qiymatlar CSS ko‘rinishida'],
      ]),
      'Dasturchi asosan Layers va Inspect bilan ishlaydi.',
    ),
    why(
      tf('q3', 'Figma’dagi har bir Group uchun HTML’da alohida `div` yaratish shart.', false),
      'Group o‘z xususiyatiga ega emas — ko‘pincha keraksiz.',
    ),
    why(
      q(
        'q4',
        'Maketda bir ekran (masalan, “Bosh sahifa — mobil”) odatda nima bo‘ladi?',
        ['Eng yuqori darajadagi freym', 'Rectangle', 'Group', 'Text'],
        [0],
      ),
      'Freym — sahifa.',
    ),
  ]),
  inspect: lessonQuiz([
    why(
      match('q1', 'Figma qiymatini CSS bilan moslang.', [
        ['Gap 4 (Auto layout)', 'gap: 4px'],
        ['Radius 12', 'border-radius: 12px'],
        ['Stroke 1 Inside', 'border: 1px solid + box-sizing: border-box'],
        ['H Hug', 'Balandlik berilmaydi'],
      ]),
      'Fill — `background-color` (matnda `color`).',
    ),
    why(
      fill('q2', '`#0F172A` 8% ni CSS’da yozing.', 'rgb(15 23 42 / {{1}})', ['0.08']),
      'Foiz shaffoflik alfa qiymatiga aylanadi.',
    ),
    why(
      tf('q3', 'Inspect’dagi CSS kodini hech o‘ylamasdan to‘liq nusxalash eng yaxshi usul.', false),
      'U absolyut koordinatalar va qat’iy kengliklar beradi — ma’nosini tushunib yozing.',
    ),
    why(
      q(
        'q4',
        '“W 327 (Fixed)” ni kodda qanday yozish ko‘pincha yaxshiroq?',
        ['max-width: 327px', 'width: 327px har doim', 'min-width: 327px', 'Kenglikni yozmaslik'],
        [0],
      ),
      'Tor ekranda qisqara oladi.',
    ),
  ]),
  'px-rem': lessonQuiz([
    why(
      match('q1', 'Piksellarni rem bilan moslang (asos 16px).', [
        ['12px', '0.75rem'],
        ['20px', '1.25rem'],
        ['24px', '1.5rem'],
        ['40px', '2.5rem'],
      ]),
      'Formula: rem = px ÷ 16.',
    ),
    why(fill('q2', 'Hisoblang.', '28px = {{1}}rem', ['1.75']), '28 ÷ 16 = 1.75.'),
    why(
      tf(
        'q3',
        '`font-size` rem’da yozilsa, foydalanuvchi brauzer shriftini kattalashtirganda matn ham kattalashadi.',
        true,
      ),
      'Shuning uchun shrift odatda rem’da.',
    ),
    why(
      q(
        'q4',
        'Maketdagi o‘lchamlarni bir joyga yig‘ish uchun?',
        [
          'CSS o‘zgaruvchilari (tokenlar)',
          'Har elementga inline',
          'Rasmga aylantirish',
          'JavaScript',
        ],
        [0],
      ),
      'Masalan, `--s-4: 1rem`.',
    ),
  ]),

  // ---- 2. Auto Layout → Flexbox ----------------------------------------------------
  'auto-layout': lessonQuiz([
    why(
      match('q1', 'Auto Layout xususiyatini CSS bilan moslang.', [
        ['Direction: Horizontal', 'display: flex; flex-direction: row'],
        ['Direction: Vertical', 'flex-direction: column'],
        ['Gap between items 8', 'gap: 8px'],
        ['Space between', 'justify-content: space-between'],
      ]),
      'Auto Layout — Figma’dagi Flexbox.',
    ),
    why(
      codeFill('q2', 'Padding 10 / 16 ni yozing.', '.tugma {\n  padding: {{1}};\n}', ['10px 16px']),
      'Vertikal 10, gorizontal 16.',
    ),
    why(
      tf('q3', 'Ichma-ich Auto Layout kodda ichma-ich flex konteynerlarga aylanadi.', true),
      'Masalan, karta (vertikal) ichida tugmalar qatori (gorizontal).',
    ),
    why(
      q(
        'q4',
        'Auto Layout’li maket nega dasturchi uchun qulay?',
        [
          'Elementlar orasidagi munosabat (gap, padding) aniq beriladi',
          'Rasm sifatida eksport qilinadi',
          'Rang avtomatik tanlanadi',
          'Kod avtomatik yoziladi',
        ],
        [0],
      ),
      'Absolyut koordinatalar o‘rniga qoidalar.',
    ),
  ]),
  'hug-fill-fixed': lessonQuiz([
    why(
      match('q1', 'O‘lcham rejimini CSS (flex qatorida) bilan moslang.', [
        ['Fixed 120', 'width: 120px; flex-shrink: 0'],
        ['Hug contents', 'Kenglik berilmaydi; flex: none'],
        ['Fill container', 'flex: 1; min-width: 0'],
      ]),
      'Uch rejim — uch xil xatti-harakat.',
    ),
    why(
      q(
        'q2',
        'Fill elementda uzun matn toshib ketmasligi uchun nima kerak?',
        ['min-width: 0', 'flex-shrink: 0', 'width: 100vw', 'overflow: visible'],
        [0],
      ),
      'Flex elementning standart `min-width` i — kontent kengligi.',
    ),
    why(
      tf(
        'q3',
        'Fixed o‘lchamli ikonkaga `flex-shrink: 0` berilmasa, joy yetmaganda u siqilib ketishi mumkin.',
        true,
      ),
      'Ikonka shakli buziladi.',
    ),
    why(
      q(
        'q4',
        'Qidiruv maydoni qolgan joyni egallashi kerak. Figma rejimi?',
        ['Fill container', 'Hug contents', 'Fixed', 'Absolute'],
        [0],
      ),
      'Kodda — `flex: 1`.',
    ),
  ]),
  'al-tekislash': lessonQuiz([
    why(
      match('q1', 'Gorizontal Auto Layout’da tekislashni CSS bilan moslang.', [
        ['Chap / markaz / o‘ng', 'justify-content'],
        ['Tepa / markaz / past', 'align-items'],
      ]),
      'Vertikal (column) Auto Layout’da ular almashadi.',
    ),
    why(
      tf(
        'q2',
        'Vertikal (column) yo‘nalishda “tepa / markaz / past” `justify-content` bilan beriladi.',
        true,
      ),
      'Asosiy o‘q endi vertikal.',
    ),
    why(
      codeFill(
        'q3',
        'Elementlar kesuvchi o‘qda cho‘zilsin (“Stretch”).',
        '.qator {\n  align-items: {{1}};\n}',
        ['stretch'],
      ),
      'Flex’da bu standart qiymat.',
    ),
    why(
      q(
        'q4',
        'Space between bilan faqat bitta element bo‘lsa, u qayerda turadi?',
        ['Boshida', 'Markazda', 'Oxirida', 'Yashirinadi'],
        [0],
      ),
      'Taqsimlashga ikkinchi element yo‘q.',
    ),
  ]),
  'al-wrap': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Teglar qatorga sig‘masa keyingi qatorga tushsin.',
        '.teglar {\n  display: flex;\n  flex-wrap: {{1}};\n}',
        ['wrap'],
      ),
      'Figma’da “Wrap” yo‘nalishi.',
    ),
    why(
      match('q2', 'Wrap’dagi oraliqni CSS bilan moslang.', [
        ['Elementlar orasidagi gap', 'column-gap'],
        ['Qatorlar orasidagi gap', 'row-gap'],
      ]),
      'Ikkalasi teng bo‘lsa — bitta `gap`.',
    ),
    why(
      q(
        'q3',
        'Bir xil kenglikdagi kartalar to‘ri uchun Wrap o‘rniga nima yaxshiroq?',
        ['CSS Grid (repeat + minmax)', 'float', 'table', 'position: absolute'],
        [0],
      ),
      'Flex wrap’da oxirgi qator cho‘zilib ketishi mumkin.',
    ),
    why(
      tf('q4', 'Wrap maketini freym kengligini o‘zgartirib sinash kerak.', true),
      'Qatorlar qanday tushishini ko‘ring.',
    ),
  ]),

  // ---- 3. Constraints va moslashuv --------------------------------------------------
  constraints: lessonQuiz([
    why(
      match('q1', 'Gorizontal constraint’ni CSS bilan moslang.', [
        ['Left & Right', 'Kenglik yo‘q, margin-inline bilan cho‘ziladi'],
        ['Center', 'margin-inline: auto + o‘z kengligi'],
        ['Right', 'margin-left: auto'],
        ['Scale', 'Foizli kenglik'],
      ]),
      'Constraint freym kattalashganda xatti-harakatni bildiradi.',
    ),
    why(
      tf(
        'q2',
        'Maketdagi aniq kenglikni (masalan, 1440 freymdagi 1296px) kodga nusxalash to‘g‘ri.',
        false,
      ),
      'Bu boshqa ekranda buziladi — constraint ma’nosini yozing.',
    ),
    why(
      sortInto('q3', 'Constraints berilmagan bo‘lsa, odatiy tanlov?', {
        'Cho‘ziladi': ['Matn bloklari', 'Konteynerlar'],
        'O‘z o‘lchamida': ['Tugmalar', 'Ikonkalar'],
      }),
      'Rasmlar — konteynerga mutanosib.',
    ),
    why(
      q(
        'q4',
        'Constraints’ni Figma’da qanday sinaysiz?',
        ['Freymni cho‘zib-qisqartirib', 'Rangni o‘zgartirib', 'Eksport qilib', 'Prototip ishlatib'],
        [0],
      ),
      'Elementlar qanday harakatlanishini kuzating.',
    ),
  ]),
  'min-max': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Blok 480px dan oshmasin, tor ekranda to‘ldirsin.',
        '.blok {\n  width: 100%;\n  {{1}}: 480px;\n}',
        ['max-width'],
      ),
      '1000px ekranda — 480, 360px ekranda — 360.',
    ),
    why(
      tf('q2', '`min-width: 280px` 240px ekranda blokni ekrandan chiqarib yuborishi mumkin.', true),
      '`min-width` ehtiyotkorlik bilan.',
    ),
    why(
      codeFill(
        'q3',
        'Uzun nomni bir qatorda “…” bilan qisqartiring.',
        '.nom {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: {{1}};\n}',
        ['ellipsis'],
      ),
      'Uch qator birga kerak.',
    ),
    why(
      q(
        'q4',
        'Qisqartirilgan matnning to‘liq varianti qanday ko‘rinadi?',
        ['title yoki boshqa joyda to‘liq matn berib', 'Hech qanday', 'Rasmda', 'Console’da'],
        [0],
      ),
      'Qisqartirish ma’lumotni yo‘qotmasligi kerak.',
    ),
  ]),
  'layout-grid': lessonQuiz([
    why(
      match('q1', 'Layout Grid qiymatini CSS bilan moslang.', [
        ['Columns 12', 'grid-template-columns: repeat(12, 1fr)'],
        ['Gutter 24', 'column-gap: 24px'],
        ['Margin 72', 'padding-inline: 72px'],
      ]),
      'Type: Stretch — ustunlar `1fr` bilan cho‘ziladi.',
    ),
    why(
      fill(
        'q2',
        'Hisoblang.',
        '1440px freym, margin 72, gutter 24, 12 ustun: bitta ustun kengligi = (1440 − 2×72 − 11×24) ÷ 12 = {{1}}px',
        ['86'],
      ),
      '1440 − 144 − 264 = 1032; 1032 ÷ 12 = 86.',
    ),
    why(
      tf('q3', 'Har bir kichik element uchun ham alohida 12 ustunli to‘r yasash kerak.', false),
      'To‘r — sahifa maketi uchun; kichik bloklarda flex yetarli.',
    ),
    why(
      q('q4', 'Mobil maketda odatda nechta ustun?', ['4', '12', '16', '1 har doim'], [0]),
      'Telefonda kamroq va kengroq ustunlar.',
    ),
  ]),

  // ---- 4. Matn va effektlar ------------------------------------------------------
  'text-styles': lessonQuiz([
    why(
      match('q1', 'Figma qiymatini CSS bilan moslang.', [
        ['Semi Bold', 'font-weight: 600'],
        ['Line height 120%', 'line-height: 1.2'],
        ['Letter spacing −2%', 'letter-spacing: -0.02em'],
        ['Text case: Upper', 'text-transform: uppercase'],
      ]),
      'Foizlar em yoki birliksiz songa aylanadi.',
    ),
    why(
      fill('q2', 'Hisoblang.', '40px shriftda Line height 120% = {{1}}px', ['48']),
      '40 × 1.2 = 48.',
    ),
    why(
      codeFill('q3', 'Paragraph spacing 16.', 'p {{1}} p {\n  margin-top: 16px;\n}', ['+']),
      'Faqat ketma-ket paragraflar orasiga.',
    ),
    why(
      tf(
        'q4',
        '“Line height Auto” uchun aniq birliksiz son (masalan, 1.5) yozish `normal` dan yaxshiroq.',
        true,
      ),
      '`normal` shriftga qarab o‘zgaradi.',
    ),
  ]),
  soyalar: lessonQuiz([
    why(
      match('q1', 'Figma effektini CSS bilan moslang.', [
        ['Drop shadow', 'box-shadow'],
        ['Inner shadow', 'box-shadow: inset …'],
        ['Layer blur', 'filter: blur()'],
        ['Background blur', 'backdrop-filter: blur()'],
      ]),
      'Bir nechta soya vergul bilan.',
    ),
    why(
      codeFill(
        'q2',
        'Drop shadow X 0, Y 4, Blur 12, 10% qora.',
        'box-shadow: 0 4px {{1}} rgb(0 0 0 / 0.1);',
        ['12px'],
      ),
      'Tartib: X, Y, Blur, Spread, rang.',
    ),
    why(
      q(
        'q3',
        'Shaffof PNG ikonkaning shakli bo‘yicha soya uchun?',
        ['filter: drop-shadow()', 'box-shadow', 'text-shadow', 'outline'],
        [0],
      ),
      '`box-shadow` to‘rtburchak quti bo‘yicha chiziladi.',
    ),
    why(
      tf(
        'q4',
        'Figma va CSS soyasi orasida kichik farq bo‘lishi mumkin (masalan, blur hisoblanishi), shuning uchun natijani ko‘z bilan solishtirish kerak.',
        true,
      ),
      'Raqamni emas, ko‘rinishni moslang.',
    ),
  ]),
  'radius-stroke': lessonQuiz([
    why(
      match('q1', 'Stroke joylashuvini CSS bilan moslang.', [
        ['Inside', 'border + box-sizing: border-box'],
        ['Center', 'Ko‘pincha border (kichik farq)'],
        ['Outside', 'box-shadow: 0 0 0 2px yoki outline'],
      ]),
      'Outside chiziq o‘lchamni o‘zgartirmaydi.',
    ),
    why(
      codeFill('q2', 'Punktir chiziq.', '.quti {\n  border: 1px {{1}} #94a3b8;\n}', ['dashed']),
      'Nuqtali — `dotted`.',
    ),
    why(
      codeFill('q3', 'Faqat pastki chiziq.', '.sarlavha {\n  {{1}}: 1px solid #e2e8f0;\n}', [
        'border-bottom',
      ]),
      'Bir tomonli stroke.',
    ),
    why(
      q(
        'q4',
        'Radius 12 bo‘lgan kartaning ichidagi rasm ham yumaloq bo‘lishi uchun?',
        ['Kartaga overflow: hidden', 'Rasmga border', 'Kartaga outline', 'Rasmga z-index'],
        [0],
      ),
      'Yoki rasmga ham mos radius.',
    ),
  ]),

  // ---- 5. Komponentlar va variantlar ---------------------------------------------
  'komponent-klass': lessonQuiz([
    why(
      match('q1', 'Figma tushunchasini kod bilan moslang.', [
        ['Main component Chip', '.chip klassi'],
        ['Instance', '<span class="chip">'],
        ['Override (matn almashtirish)', 'HTML ichidagi matn'],
        ['Component property', 'Modifikator klass yoki atribut'],
      ]),
      'Komponent — qayta ishlatiladigan blok.',
    ),
    why(
      sortInto('q2', 'Component property turlarini ajrating.', {
        Boolean: ['Show icon: true/false'],
        Text: ['Tugma matni'],
        'Instance swap': ['Qaysi ikonka'],
      }),
      'Variant — o‘lcham, tur, holat.',
    ),
    why(
      tf(
        'q3',
        'Instance “detach” qilingan bo‘lsa, u asosiy komponent bilan bog‘lanishni yo‘qotgan — kodda ehtiyotkorlik bilan qarash kerak.',
        true,
      ),
      'U komponentga mos kelmasligi mumkin.',
    ),
    why(
      q(
        'q4',
        'Klass nomi qanday bo‘lishi kerak?',
        [
          'Vazifani bildiradi: .chip, .tugma',
          'Rangni bildiradi: .kok-blok',
          'Tasodifiy: .x1',
          'Figma qatlam nomi: .Frame-127',
        ],
        [0],
      ),
      'Ma’noli nom keyin ham to‘g‘ri qoladi.',
    ),
  ]),
  variantlar: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tugmaning katta o‘lchamli variantini yozing (asos + modifikator).',
        '<button class="tugma {{1}}">Saqlash</button>',
        ['tugma--katta'],
      ),
      'Asos klass umumiy uslubni, modifikator farqni beradi.',
    ),
    why(
      tf('q2', 'Har bir variant uchun hamma uslubni qaytadan yozgan ma’qul.', false),
      'Faqat farq qiladigan xususiyatlar modifikatorda.',
    ),
    why(
      q(
        'q3',
        'Variant ranglari qayerdan olinadi?',
        [
          'Tokenlardan (CSS o‘zgaruvchilari)',
          'Har safar HEX qiymatdan',
          'Rasmdan',
          'Brauzer standartidan',
        ],
        [0],
      ),
      'Token o‘zgarsa, barcha variantlar yangilanadi.',
    ),
    why(
      q(
        'q4',
        'Maketda yo‘q kombinatsiya (masalan, kichik + xavfli) kerak bo‘lsa?',
        [
          'Dizayner bilan kelishib, tizim qoidasi bo‘yicha qo‘shish',
          'O‘zingiz ixtiyoriy rang tanlash',
          'Imkoni yo‘q',
          'Rasm qo‘yish',
        ],
        [0],
      ),
      'Tizim izchilligi saqlansin.',
    ),
  ]),
  interaktiv: lessonQuiz([
    why(
      match('q1', 'Figma holatini CSS bilan moslang.', [
        ['Hover', ':hover'],
        ['Pressed', ':active'],
        ['Focused', ':focus-visible'],
        ['Disabled', ':disabled'],
      ]),
      'Selected — `[aria-selected="true"]`, `:checked`.',
    ),
    why(
      tf(
        'q2',
        'Maketda fokus holati chizilmagan bo‘lsa, kodda uni ham qoldirib ketish mumkin.',
        false,
      ),
      'Fokus holati har doim kerak — dizayner bilan kelishib qo‘shing.',
    ),
    why(
      codeFill(
        'q3',
        'Hover faqat sichqonchali qurilmada.',
        '@media ({{1}}: hover) {\n  .karta:hover { transform: translateY(-2px); }\n}',
        ['hover'],
      ),
      'Telefonda hover bosishdan keyin yopishib qoladi.',
    ),
    why(
      q(
        'q4',
        'Prototipdagi interaktivlik kodda nima bilan qilinadi?',
        [
          'HTML holatlar + CSS + kerak bo‘lsa JavaScript',
          'Faqat Figma eksporti',
          'Rasm almashtirish',
          'iframe',
        ],
        [0],
      ),
      'Prototip — xatti-harakat haqida kelishuv.',
    ),
  ]),

  // ---- 6. Amaliy loyiha -------------------------------------------------------------
  'loyiha-header': lessonQuiz([
    why(
      order('q1', 'Maketdan sahifa yasash tartibini joylang.', [
        'Maketni o‘rganib, tokenlarni yig‘ish',
        'HTML tuzilmasini yozish',
        'Bo‘limlarni CSS bilan yasash',
        'Maket bilan solishtirib tekshirish',
      ]),
      'Avval tushunish, keyin kod.',
    ),
    why(
      q(
        'q2',
        'Header balandligi uchun qaysi biri yaxshiroq?',
        ['min-height', 'height', 'max-height', 'Balandlik yozmaslik har doim'],
        [0],
      ),
      'Matn kattalashsa yoki qatorga o‘tsa, `height` kontentni kesadi.',
    ),
    why(
      tf(
        'q3',
        'Telefonda menyu ochadigan tugma `<button>` bo‘ladi va `aria-expanded` bilan holatini bildiradi.',
        true,
      ),
      'Burger — amal, havola emas.',
    ),
    why(
      q(
        'q4',
        'Logo bosh sahifaga havola bo‘lsa, `alt` nima bo‘lishi kerak?',
        ['Sayt nomi (masalan, “WEBDIZAYN.UZ — bosh sahifa”)', '“logo”', 'Bo‘sh', 'Fayl nomi'],
        [0],
      ),
      'Havolaning nomi rasm `alt` idan olinadi.',
    ),
  ]),
  'loyiha-hero': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Konteyner maketdagi 1200px dan oshmasin va markazda.',
        '.konteyner {\n  max-width: 1200px;\n  margin-inline: {{1}};\n  padding-inline: 1rem;\n}',
        ['auto'],
      ),
      'Padding tor ekranda chekka bo‘sh joy beradi.',
    ),
    why(
      q(
        'q2',
        'Hero ostidagi uchta karta uchun eng qulay to‘r?',
        ['grid + repeat(auto-fit, minmax(…, 1fr))', 'float: left', 'table', 'position: absolute'],
        [0],
      ),
      'Ekran torayganda ustunlar soni o‘zi kamayadi.',
    ),
    why(
      tf(
        'q3',
        'Kod va maket o‘rtasida mos kelmaslik bo‘lsa, avval sababini (o‘lcham, shrift, oraliq) aniqlash kerak.',
        true,
      ),
      'DevTools va maketni yonma-yon solishtiring.',
    ),
    why(
      q(
        'q4',
        'Hero’dagi asosiy rasmga nima qo‘shilmaydi?',
        ['loading="lazy"', 'alt', 'width va height', 'fetchpriority="high"'],
        [0],
      ),
      'Birinchi ekran rasmi darhol kerak.',
    ),
  ]),
};
