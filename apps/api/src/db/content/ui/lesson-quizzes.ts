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

/** Per-lesson tests of the "UI asoslari" course (module-closing lessons keep their quiz). */
export const UI_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Rang ---------------------------------------------------------------------
  'rang-modellari': lessonQuiz([
    why(
      match('q1', 'HSL qismini ma’nosi bilan moslang.', [
        ['H — ton', 'Rang g‘ildiragidagi burchak (0–360°)'],
        ['S — to‘yinganlik', '0% kulrang — 100% to‘liq rang'],
        ['L — yorug‘lik', '0% qora — 50% sof rang — 100% oq'],
      ]),
      '0° qizil, 120° yashil, 240° ko‘k.',
    ),
    why(
      tf('q2', '`opacity: 0.5` faqat fonni shaffof qiladi, matn to‘liq ko‘rinadi.', false),
      '`opacity` butun elementni (matni bilan) shaffof qiladi; faqat fon uchun rangda alfa kanal.',
    ),
    why(
      codeFill(
        'q3',
        'Ikonka matn bilan bir xil rangda bo‘lsin.',
        '.ikonka {\n  fill: {{1}};\n}',
        ['currentColor'],
        false,
      ),
      '`currentColor` — elementning joriy `color` qiymati.',
    ),
    why(
      sortInto('q4', 'Yozuvlarni rang modeliga ajrating.', {
        HEX: ['#0071dc'],
        RGB: ['rgb(0 113 220)'],
        HSL: ['hsl(210 100% 43%)'],
      }),
      'Bitta rangning uch xil yozuvi.',
    ),
  ]),
  'hsl-soyalar': lessonQuiz([
    why(
      q(
        'q1',
        'HSL’da bitta rangning och va to‘q soyalari qanday olinadi?',
        [
          'Tonni saqlab, yorug‘likni (L) o‘zgartirib',
          'Tonni o‘zgartirib',
          'Faqat to‘yinganlikni nolga tushirib',
          'HEX ga o‘tkazib',
        ],
        [0],
      ),
      'Bitta ton — butun rang oilasi.',
    ),
    why(
      order('q2', 'Shkala soyalarini ochdan to‘qqa tartiblang.', [
        '50',
        '200',
        '500',
        '700',
        '900',
      ]),
      'Raqam qancha katta bo‘lsa, rang shuncha to‘q.',
    ),
    why(
      codeFill(
        'q3',
        'Asosiy rangni oq bilan 20% aralashtiring.',
        'background: {{1}}(in srgb, var(--asosiy), white 20%);',
        ['color-mix'],
      ),
      '`color-mix()` — zamonaviy CSS funksiyasi.',
    ),
    why(
      tf(
        'q4',
        'Yorug‘lik juda yuqori yoki past bo‘lganda to‘yinganlikni ham biroz o‘zgartirish soyani tabiiyroq qiladi.',
        true,
      ),
      'Bu HSL soyalaridagi nozikliklardan biri.',
    ),
  ]),
  uygunlik: lessonQuiz([
    why(
      match('q1', 'Sxemani qoidasi bilan moslang (asos 210°).', [
        ['Monoxrom', 'Bitta ton, turli yorug‘lik'],
        ['Analog', '±30° qo‘shni tonlar'],
        ['Komplementar', '+180° qarama-qarshi ton'],
        ['Triada', '+120° va +240°'],
      ]),
      'Komplementar — kuchli kontrast, kam ishlatiladi.',
    ),
    why(
      fill('q2', 'Hisoblang.', 'Asosiy ton 210° bo‘lsa, komplementar ton {{1}}°.', ['30']),
      '210 + 180 = 390 → 390 − 360 = 30.',
    ),
    why(
      sortInto('q3', 'Rangni interfeysdagi vazifasiga moslang.', {
        'Asosiy (brend)': ['Tugmalar', 'Havolalar'],
        Neytral: ['Matn', 'Fon', 'Chegaralar'],
        Holat: ['Xato — qizil', 'Muvaffaqiyat — yashil'],
      }),
      'Interfeysning katta qismi neytral ranglar.',
    ),
    why(
      tf('q4', 'Ma’noni faqat rang orqali yetkazish yetarli.', false),
      'Rangga tayanmang — matn yoki ikonka ham kerak.',
    ),
  ]),
  palitra: lessonQuiz([
    why(
      match('q1', '60-30-10 qoidasidagi ulushni vazifa bilan moslang.', [
        ['60%', 'Asosiy (dominant): sahifa foni'],
        ['30%', 'Ikkinchi darajali: kartalar, panellar'],
        ['10%', 'Urg‘u: tugmalar, havolalar'],
      ]),
      'Urg‘u rangi kam bo‘lgani uchun e’tiborni tortadi.',
    ),
    why(
      match('q2', 'Holatni rang bilan moslang.', [
        ['Muvaffaqiyat', 'Yashil'],
        ['Ogohlantirish', 'Sariq / to‘q sariq'],
        ['Xato', 'Qizil'],
        ['Ma’lumot', 'Ko‘k'],
      ]),
      'Holat ranglari ma’nosi bilan tanilgan.',
    ),
    why(
      sortInto('q3', 'Ko‘p uchraydigan xatolar?', {
        Xato: [
          'Har bo‘limga boshqa yorqin rang',
          'Urg‘u rangini hamma joyda ishlatish',
          'Juda och kulrang matn',
        ],
        "To'g'ri": ['Neytral fon va bitta urg‘u rangi'],
      }),
      'Aks holda sahifa “karnaval”ga aylanadi.',
    ),
    why(
      tf('q4', 'Interfeysda eng ko‘p ishlatiladigan ranglar — neytrallar (kulranglar).', true),
      'Matn, fon, chegaralar.',
    ),
  ]),
  kontrast: lessonQuiz([
    why(
      match('q1', 'Element uchun WCAG minimal kontrastini moslang.', [
        ['Oddiy matn', '4.5:1'],
        ['Katta matn (24px yoki 18.66px qalin)', '3:1'],
        ['Ikonka, forma maydoni chegarasi', '3:1'],
      ]),
      'O‘chirilgan elementlarga talab yo‘q.',
    ),
    why(
      q(
        'q2',
        'Rasm ustidagi matn o‘qilishi uchun?',
        [
          'Matn ostiga yarim shaffof qorong‘i qatlam',
          'Matnni och kulrang qilish',
          'Rasmni kattalashtirish',
          'Hech narsa',
        ],
        [0],
      ),
      'Rasm foni o‘zgaruvchan.',
    ),
    why(
      q(
        'q3',
        'Kontrastni qayerda tez tekshirasiz?',
        [
          'DevTools Styles panelidagi rang kvadrati (Contrast ratio)',
          'Ctrl+U',
          'Brauzer tarixi',
          'Console',
        ],
        [0],
      ),
      'Lighthouse ham past kontrastli elementlarni sanab beradi.',
    ),
    why(
      tf(
        'q4',
        'Placeholder matni ham o‘qilishi kerak — uni ham kontrast bo‘yicha tekshiring.',
        true,
      ),
      'Ko‘p dizaynlarda u juda och.',
    ),
  ]),

  // ---- 2. Tipografiya -----------------------------------------------------------
  'shrift-oilalari': lessonQuiz([
    why(
      match('q1', 'Oilani qo‘llanishi bilan moslang.', [
        ['sans-serif', 'Interfeys, ekran matni'],
        ['serif', 'Uzun maqolalar, nashrlar'],
        ['monospace', 'Kod, raqamli jadvallar'],
        ['system-ui', 'Ilovaga o‘xshash interfeys'],
      ]),
      '`system-ui` hech narsa yuklamaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Zaxira ro‘yxatini to‘g‘ri yozing.',
        'font-family: system-ui, "Segoe UI", Roboto, {{1}};',
        ['sans-serif'],
      ),
      'Oxirida doim umumiy oila; bo‘sh joyli nom qo‘shtirnoqda.',
    ),
    why(
      tf('q3', 'Kod, buyruqlar va fayl nomlari uchun monospace shrift ishlatiladi.', true),
      'Har belgi bir xil kenglikda.',
    ),
    why(
      q(
        'q4',
        'Shrift tanlashda o‘zbek matni uchun nimani tekshirish kerak?',
        [
          'O‘, g‘ dagi tutuq belgisi (‘) to‘g‘ri chiqishini',
          'Kirill harflari borligini',
          'Shrift narxini',
          'Hech narsa',
        ],
        [0],
      ),
      'Ba’zi shriftlarda kerakli belgi yo‘q yoki xunuk.',
    ),
  ]),
  shkala: lessonQuiz([
    why(
      q(
        'q1',
        'Modulli shkala nima?',
        [
          'Har o‘lcham oldingisini bir koeffitsientga ko‘paytirish',
          'Tasodifiy o‘lchamlar',
          'Barcha matn bir o‘lchamda',
          'Faqat px’da yozish',
        ],
        [0],
      ),
      'O‘lchamlar bir-biriga mutanosib bo‘ladi.',
    ),
    why(
      fill('q2', 'Hisoblang (1.25 koeffitsient).', '16 × 1.25 = {{1}}', ['20']),
      'Katta terts shkalasi: 16, 20, 25, 31, 39.',
    ),
    why(
      codeFill(
        'q3',
        'Sarlavha ekranga moslashsin.',
        'h1 {\n  font-size: {{1}}(1.75rem, 4vw + 1rem, 3rem);\n}',
        ['clamp'],
      ),
      'Moslashuvchan shkala.',
    ),
    why(
      tf('q4', 'Ierarxiya uchun faqat o‘lcham yetarli; qalinlik va rang kerak emas.', false),
      'O‘lcham — yagona vosita emas.',
    ),
  ]),
  'qator-oraligi': lessonQuiz([
    why(
      match('q1', 'Matn turini tavsiya etilgan `line-height` bilan moslang.', [
        ['Oddiy matn', '1.5–1.7'],
        ['Kichik sarlavha', '1.25–1.35'],
        ['Katta sarlavha', '1.05–1.2'],
      ]),
      'Katta matnga kamroq qator oralig‘i kerak.',
    ),
    why(
      sortInto('q2', '`letter-spacing` qachon o‘zgartiriladi?', {
        Zichlashtiriladi: ['Katta sarlavhalar (−0.01em)'],
        Siyraklashtiriladi: ['BOSH HARFLI kichik yorliqlar (0.05em)'],
        Tegilmaydi: ['Oddiy matn'],
      }),
      'Oddiy matnni shrift dizayneri allaqachon sozlagan.',
    ),
    why(
      tf('q3', 'Paragraflar orasidagi masofa qator oralig‘idan kattaroq bo‘lishi kerak.', true),
      'Aks holda paragraflar chegarasi ko‘rinmaydi.',
    ),
    why(
      q(
        'q4',
        'Uzun matnni butunlay BOSH HARFLARDA yozish nega yomon?',
        [
          'O‘qish qiyinlashadi',
          'Sahifa sekinlashadi',
          'Qidiruv ishlamaydi',
          'Hech qanday farqi yo‘q',
        ],
        [0],
      ),
      'Bosh harflar faqat qisqa yorliqlar uchun.',
    ),
  ]),
  'matn-ierarxiyasi': lessonQuiz([
    why(
      sortInto('q1', 'Ierarxiya vositalarini ajrating.', {
        Kuchliroq: ['20px', '600–700 qalinlik', 'To‘q rang (#0f172a)'],
        Kuchsizroq: ['14px', '400 qalinlik', 'Xira rang (#64748b)'],
      }),
      'Joy ham vosita: tepada va chapda turgan narsa kuchliroq.',
    ),
    why(
      match('q2', 'Qalinlikni qo‘llanishi bilan moslang.', [
        ['400', 'Oddiy matn'],
        ['600', 'Sarlavhalar, tugmalar'],
        ['700', 'Raqamlar, narx, kuchli urg‘u'],
      ]),
      'Cheklangan qalinliklar izchillik beradi.',
    ),
    why(
      tf(
        'q3',
        'Ikkilamchi ma’lumotni xira rang bilan ajratish uchun uni juda kichik ham qilish kerak.',
        false,
      ),
      'Xira rang yetarli — kichik va xira matn o‘qilmay qoladi.',
    ),
    why(
      q(
        'q4',
        'Karta ichida foydalanuvchi birinchi ko‘rishi kerak bo‘lgan narsa?',
        ['Eng muhim ma’lumot (masalan, narx yoki nom)', 'Sana', 'ID raqam', 'Kichik izoh'],
        [0],
      ),
      'Ierarxiya ko‘zni boshqaradi.',
    ),
  ]),

  // ---- 3. Oraliq va kompozitsiya ----------------------------------------------------
  'oraliq-tizimi': lessonQuiz([
    why(
      q(
        'q1',
        '8px qoidasi nima?',
        [
          'Oraliqlar 4 va 8 ning karralilaridan tanlanadi',
          'Har joyda 8px',
          'Shrift 8px',
          'Faqat 8 ta oraliq',
        ],
        [0],
      ),
      'Tasodifiy 13px, 17px o‘rniga tizim.',
    ),
    why(
      match('q2', 'Tokenni odatiy qo‘llanishi bilan moslang.', [
        ['4px', 'Ikonka va matn orasi'],
        ['16px', 'Karta ichidagi bloklar orasi'],
        ['32px', 'Kartalar, bo‘limlar orasi'],
        ['64px', 'Sahifa bo‘limlari'],
      ]),
      'Tokenlar CSS o‘zgaruvchilarida saqlanadi.',
    ),
    why(
      codeFill(
        'q3',
        'Elementlar orasidagi masofa (birinchi va oxirgisiz).',
        '.royxat {\n  display: flex;\n  {{1}}: var(--s-4);\n}',
        ['gap'],
      ),
      '`gap` — eng yaxshi do‘st: margin hisob-kitobisiz.',
    ),
    why(
      tf('q4', 'Element ichidagi oraliq tashqi oraliqdan kichik bo‘lishi kerak.', true),
      'Shunda element bir butun, qo‘shnilardan ajralgan ko‘rinadi.',
    ),
  ]),
  yaqinlik: lessonQuiz([
    why(
      match('q1', 'Gestalt qoidasini interfeysdagi ko‘rinishi bilan moslang.', [
        ['Yaqinlik', 'Oraliqlar'],
        ['O‘xshashlik', 'Hamma havolalar bir rangda'],
        ['Umumiy hudud', 'Karta, fon'],
        ['Uzluksizlik', 'Tekislash, ro‘yxatlar'],
      ]),
      'Ko‘z guruhlarni shu qoidalar bilan ko‘radi.',
    ),
    why(
      q(
        'q2',
        'Formada yorliq qaysi maydonga yaqin turishi kerak?',
        [
          'O‘zining maydoniga (yuqoridagisidan uzoqroq)',
          'Yuqoridagi maydonga',
          'Ikkalasidan teng',
          'Farqi yo‘q',
        ],
        [0],
      ),
      'Teng masofa yorliq qaysi maydonniki ekanini chalkashtiradi.',
    ),
    why(
      tf(
        'q3',
        'Sarlavha o‘zidan keyingi matnga oldingi bo‘limdan ko‘ra yaqinroq turishi kerak.',
        true,
      ),
      'Sarlavha o‘z bo‘limiga tegishli.',
    ),
    why(
      tf(
        'q4',
        'Bog‘liq elementlar orasidagi masofa bog‘liq bo‘lmaganlar orasidagidan kattaroq bo‘lishi kerak.',
        false,
      ),
      'Aksincha: yaqin — bir guruh.',
    ),
  ]),
  tekislash: lessonQuiz([
    why(
      sortInto('q1', 'Matn turini tekislash bilan moslang.', {
        Chapga: ['Ko‘p qatorli matn'],
        Markazga: ['Qisqa sarlavha', 'Tugma matni'],
        'O‘ngga': ['Raqamli ustunlar'],
      }),
      'Uch qatordan uzun markazlangan matn o‘qishni charchatadi.',
    ),
    why(
      tf(
        'q2',
        'Veb’da `text-align: justify` tor ustunlarda so‘zlar orasida “daryolar” hosil qiladi.',
        true,
      ),
      'Shuning uchun kamdan-kam ishlatiladi.',
    ),
    why(
      q(
        'q3',
        'Doira ichidagi “play” uchburchagi markazda bo‘lsa ham chapga siljigandek ko‘rinadi. Yechim?',
        [
          'Optik tekislash: 1–2px o‘ngga siljitish',
          'Uchburchakni kattalashtirish',
          'Doirani olib tashlash',
          'Hech narsa',
        ],
        [0],
      ),
      'Matematik markaz har doim ko‘zga markaz ko‘rinmaydi.',
    ),
    why(
      tf(
        'q4',
        'Sahifadagi elementlar bir nechta “ko‘rinmas chiziq” bo‘yicha tekislansa, sahifa tartibli ko‘rinadi.',
        true,
      ),
      'To‘r (grid) shu chiziqlarni beradi.',
    ),
  ]),
  'oq-joy': lessonQuiz([
    why(
      sortInto('q1', 'Bo‘sh joy turlarini ajrating.', {
        Mikro: ['Qatorlar orasi', 'Tugma ichidagi oraliq'],
        Makro: ['Bo‘limlar orasi', 'Sahifa chetidagi maydon'],
      }),
      'Ikkalasi ham dizayn elementi.',
    ),
    why(
      q(
        'q2',
        'Oraliq yetarlimi-yo‘qmi, shubha bo‘lsa?',
        [
          'Bir pog‘ona kattalashtiring (24 → 32)',
          'Kichraytiring',
          'Elementlarni qo‘shing',
          'Ramka chizing',
        ],
        [0],
      ),
      'Interfeyslar ko‘pincha tor bo‘ladi.',
    ),
    why(
      codeFill('q3', 'Matn qatori o‘qishga qulay kenglikda.', 'p {\n  max-width: 65{{1}};\n}', [
        'ch',
      ]),
      'Taxminan 60–75 belgi.',
    ),
    why(
      tf(
        'q4',
        'Har bir ekranda bitta asosiy narsa bo‘lsa, qolganlari unga joy berishi kerak.',
        true,
      ),
      'Bo‘sh joy e’tiborni asosiy narsaga qaratadi.',
    ),
  ]),

  // ---- 4. Ikonka va rasm -----------------------------------------------------------
  'svg-ikonkalar': lessonQuiz([
    why(
      sortInto('q1', 'Qaysi ikonka turi bu imkoniyatga ega?', {
        'Faqat SVG': [
          'Ko‘p rang va chiziq qalinligi',
          'Faqat kerakli ikonkalar yuklanadi va CSS bilan bo‘yaladi',
        ],
        'PNG da yo‘q': ['Har o‘lchamda tiniq'],
      }),
      'SVG — eng moslashuvchan tanlov.',
    ),
    why(
      codeFill(
        'q2',
        'Ikonka matn o‘lchamida bo‘lsin.',
        '.ikonka {\n  width: 1{{1}};\n  height: 1em;\n}',
        ['em'],
      ),
      '`em` ikonkani yonidagi matnga bog‘laydi.',
    ),
    why(
      tf(
        'q3',
        'Bir interfeysdagi ikonkalar bir xil uslubda (chiziq qalinligi, burchaklar) bo‘lishi kerak.',
        true,
      ),
      'Izchillik interfeysni yaxlit va professional qiladi.',
    ),
    why(
      q(
        'q4',
        'Ikonka rangini matn bilan birga o‘zgartirish uchun SVG’da?',
        ['fill/stroke = currentColor', 'fill="black"', 'opacity', 'filter'],
        [0],
      ),
      'Hover’da matn rangi o‘zgarsa, ikonka ham.',
    ),
  ]),
  'bootstrap-icons': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Bootstrap Icons’dan qidiruv ikonkasi.',
        '<i class="bi {{1}}" aria-hidden="true"></i>',
        ['bi-search'],
      ),
      'Ikonka shrifti `::before` dagi belgi orqali ishlaydi.',
    ),
    why(
      sortInto('q2', 'Ikonka shriftining kamchiliklari?', {
        Kamchilik: [
          'Butun shrift yuklanadi',
          'Shrift bloklansa — kvadratcha',
          'Ko‘p rangli ikonka bo‘lmaydi',
        ],
        'Kamchilik emas': ['Rangini CSS bilan o‘zgartirish mumkin'],
      }),
      'Kam ikonka bo‘lsa — SVG yaxshiroq.',
    ),
    why(
      tf(
        'q3',
        'CDN orqali ulaganda versiyani qotirib qo‘yish (masalan, @1.11.3) tavsiya etiladi.',
        true,
      ),
      'Kutilmagan yangilanish ikonkalarni buzmaydi.',
    ),
    why(
      q(
        'q4',
        'Shrift ikonkasiga nega `aria-hidden="true"`?',
        [
          'Ekran o‘quvchi maxsus belgini o‘qib yubormasligi uchun',
          'Ikonka tezroq yuklanadi',
          'Rang o‘zgaradi',
          'Kerak emas',
        ],
        [0],
      ),
      'Ma’no tugma matni yoki `aria-label` da bo‘ladi.',
    ),
  ]),
  'ikonka-a11y': lessonQuiz([
    why(
      sortInto('q1', 'Ikonka turiga qarab nima qilinadi?', {
        'aria-hidden="true"': ['Matnli tugmadagi bezak ikonka'],
        'aria-label tugmaga': ['Faqat ikonkadan iborat tugma'],
      }),
      'Ikonkali tugma nomsiz qolmasin.',
    ),
    why(
      codeFill(
        'q2',
        'Faqat ikonkali yopish tugmasi.',
        '<button type="button" {{1}}="Yopish">\n  <svg aria-hidden="true">…</svg>\n</button>',
        ['aria-label'],
      ),
      'Ekran o‘quvchi “Yopish, tugma” deydi.',
    ),
    why(
      q(
        'q3',
        'Tugmaning hisoblangan nomini qayerda ko‘rasiz?',
        ['DevTools Accessibility panelidagi Name', 'Console', 'Network', 'Ctrl+U'],
        [0],
      ),
      'Lighthouse “Buttons do not have an accessible name” deb ogohlantiradi.',
    ),
    why(
      tf(
        'q4',
        'Ikonka kichik bo‘lsa ham tugmaning bosish maydoni kattaroq (≈44px) bo‘lishi kerak.',
        true,
      ),
      'Padding bilan maydon kattalashtiriladi.',
    ),
  ]),

  // ---- 5. Komponentlar -------------------------------------------------------------
  tugmalar: lessonQuiz([
    why(
      match('q1', 'Elementni vazifasi bilan moslang.', [
        ['<button type="button">', 'Amal bajaradi: ochish, yuborish, o‘chirish'],
        ['<a href>', 'Boshqa sahifaga olib boradi'],
      ]),
      'Ko‘rinishidan qat’i nazar ma’noga qarab tanlang.',
    ),
    why(
      q(
        'q2',
        'Nega tugmaga `border: 1px solid transparent`?',
        [
          'Chegarali variantda o‘lcham sakramasligi uchun',
          'Rang uchun',
          'Soya uchun',
          'Kerak emas',
        ],
        [0],
      ),
      'Barcha variantlar bir xil o‘lchamda.',
    ),
    why(
      codeFill('q3', 'Tugma sahifa shriftida bo‘lsin.', '.tugma {\n  font: {{1}};\n}', ['inherit']),
      'Standart holda tugma tizim shriftida bo‘ladi.',
    ),
    why(
      q(
        'q4',
        'Qaysi tugma matni eng yaxshi?',
        ['Buyurtmani tasdiqlash', 'OK', 'Bosing', 'Yuborish…?'],
        [0],
      ),
      'Matn natijani aytsin.',
    ),
  ]),
  'tugma-holatlari': lessonQuiz([
    why(
      match('q1', 'Holatni psevdoklass yoki atribut bilan moslang.', [
        ['Ustiga olib borilgan', ':hover'],
        ['Klaviatura fokusi', ':focus-visible'],
        ['Bosilmoqda', ':active'],
        ['Yuklanmoqda', '[aria-busy="true"]'],
      ]),
      'O‘chirilgan — `:disabled`.',
    ),
    why(
      tf('q2', '`outline: none` yozib fokus halqasini butunlay olib tashlash mumkin.', false),
      'Klaviatura foydalanuvchisi qayerda ekanini ko‘rmay qoladi — aniq `:focus-visible` uslubi bering.',
    ),
    why(
      q(
        'q3',
        'Holat o‘zgarishi uchun o‘tish (transition) davomiyligi?',
        ['150–200ms', '1–2 s', '0ms har doim', '5 s'],
        [0],
      ),
      'Tez, lekin silliq.',
    ),
    why(
      q(
        'q4',
        'O‘chirilgan tugma ko‘rinishi?',
        ['Xira, kursor not-allowed', 'Yorqinroq', 'Qizil', 'Yashirin'],
        [0],
      ),
      'Nega o‘chirilganini yonida tushuntirish ham foydali.',
    ),
  ]),
  'forma-maydonlari': lessonQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['aria-invalid="true"', 'Ekran o‘quvchi “noto‘g‘ri qiymat” deydi'],
        ['aria-describedby', 'Fokusda xato matni ham o‘qiladi'],
      ]),
      'CSS ham shu atributga qarab bezaydi.',
    ),
    why(
      q(
        'q2',
        'Qaysi xato matni yaxshiroq?',
        ['@ dan keyin domen yozing (masalan, gmail.com)', 'Noto‘g‘ri email', 'Xato!', 'Error 422'],
        [0],
      ),
      'Xato matni nima qilish kerakligini aytsin.',
    ),
    why(
      q(
        'q3',
        'Xatoni qachon ko‘rsatish kerak?',
        [
          'Yozib bo‘lgach (blur) yoki yuborganda',
          'Birinchi harfdan',
          'Sahifa ochilishi bilan',
          'Hech qachon',
        ],
        [0],
      ),
      'Yozayotgan paytda xato ko‘rsatish asabiylashtiradi.',
    ),
    why(
      tf(
        'q4',
        'Yuborilganda birinchi xatoli maydonga fokusni o‘tkazish foydalanuvchiga yordam beradi.',
        true,
      ),
      'Ayniqsa uzun formalarda.',
    ),
  ]),
  'ui-kartalar': lessonQuiz([
    why(
      sortInto('q1', 'Yaxshi karta soyasi qanday?', {
        Yaxshi: [
          'Yumshoq (katta xiralik, kam shaffoflik)',
          'Pastga yo‘nalgan',
          'Manfiy spread bilan',
        ],
        Yomon: ['Qora va keskin'],
      }),
      'Yorug‘lik tepadan tushgandek.',
    ),
    why(
      tf('q2', 'Hover effekti faqat bosiladigan kartaga beriladi.', true),
      'Aks holda foydalanuvchi uni bosiladigan deb o‘ylaydi.',
    ),
    why(
      order('q3', 'Karta qismlarini tartiblang.', [
        'Media (rasm)',
        'Mazmun (sarlavha, matn)',
        'Amallar (tugmalar)',
      ]),
      'Uch qism: media, mazmun va amallar.',
    ),
    why(
      q(
        'q4',
        'Burchak radiuslari uchun tizim nima beradi?',
        [
          'Ichki element radiusi tashqisidan kichik bo‘lib, uyg‘un ko‘rinadi',
          'Hamma joyda 50%',
          'Radiussiz dizayn',
          'Tasodifiy radiuslar',
        ],
        [0],
      ),
      'Ichki radius = tashqi radius − padding.',
    ),
  ]),
  bildirishnoma: lessonQuiz([
    why(
      match('q1', 'Rolni qo‘llanishi bilan moslang.', [
        ['role="status"', 'Oddiy xabar (“Saqlandi”) — joriy o‘qishdan keyin'],
        ['role="alert"', 'Muhim xato — darhol, gapni bo‘lib'],
      ]),
      'Har xabarni `alert` qilmang — bezovta qiladi.',
    ),
    why(
      q(
        'q2',
        'Toast nima?',
        ['Qisqa vaqt ko‘rinib, o‘zi yopiladigan bildirishnoma', 'Modal oyna', 'Menyu', 'Jadval'],
        [0],
      ),
      'Muhim xato uchun o‘zi yopilmaydigan xabar yaxshiroq.',
    ),
    why(
      tf('q3', 'Bildirishnomada ma’no faqat rang bilan berilishi yetarli.', false),
      'Ikonka va matn ham bo‘lsin.',
    ),
    why(
      q(
        'q4',
        '“3 ta yangi xabar” kabi son ko‘rsatkichi?',
        ['Belgi (badge)', 'Toast', 'Modal', 'Tooltip'],
        [0],
      ),
      'Badge’ning ma’nosini ekran o‘quvchiga matn bilan bering.',
    ),
  ]),

  // ---- 6. Holatlar va dizayn tizimi ------------------------------------------------
  holatlar: lessonQuiz([
    why(
      match('q1', 'Holatni sababi bilan moslang.', [
        ['Yuklanmoqda', 'Ma’lumot serverdan kelmoqda'],
        ['Bo‘sh', 'Hali hech narsa yo‘q (yangi foydalanuvchi)'],
        ['Xato', 'Server javob bermadi'],
        ['Juda ko‘p', '10 000 qator yoki juda uzun nom'],
      ]),
      'Interfeys faqat “to‘liq” holatda emas.',
    ),
    why(
      sortInto('q2', 'Skelet (skeleton) yuklanishning foydalari?', {
        Foyda: [
          'Nima kelishi oldindan ko‘rinadi',
          'Kontent kelganda sahifa sakramaydi',
          'Yuklanish tezroq tuyuladi',
        ],
        'Foyda emas': ['Server tezroq javob beradi'],
      }),
      'Harakatni kamaytirishni so‘raganlar uchun animatsiyani o‘chiring.',
    ),
    why(
      sortInto('q3', 'Xato holatida nima qilish kerak?', {
        Kerak: [
          'Oddiy tilda tushuntirish',
          '“Qayta urinish” taklif qilish',
          'Kiritilgan ma’lumotni saqlash',
        ],
        'Kerak emas': ['Texnik xato kodini ko‘rsatish'],
      }),
      'Ekran o‘quvchiga `role="alert"` bilan.',
    ),
    why(
      tf(
        'q4',
        'Bo‘sh holat foydalanuvchiga keyingi qadamni (masalan, “Birinchi loyihangizni qo‘shing”) ko‘rsatishi kerak.',
        true,
      ),
      'Bo‘sh sahifa yo‘l-yo‘riq beradigan joyga aylanadi.',
    ),
  ]),
  'dizayn-tizimi': lessonQuiz([
    why(
      order('q1', 'Dizayn tizimi qatlamlarini pastdan yuqoriga tartiblang.', [
        'Palitra tokenlari (--kok-600)',
        'Semantik tokenlar (--rang-urg)',
        'Komponentlar (tugma, karta)',
      ]),
      'Komponentlar semantik tokenlarni ishlatadi.',
    ),
    why(
      match('q2', 'Token turini nomlash usuli bilan moslang.', [
        ['Palitra tokeni', 'Qiymati bo‘yicha: --kok-600'],
        ['Semantik token', 'Vazifasi bo‘yicha: --rang-xato'],
      ]),
      'Semantik nom rang o‘zgarsa ham to‘g‘ri qoladi.',
    ),
    why(
      tf(
        'q3',
        'Dizayn tizimini joriy qilishda koddagi qattiq qiymatlarni (#0071dc, 13px) topib tokenlarga almashtirish kerak.',
        true,
      ),
      'Shunda bitta joydan boshqariladi.',
    ),
    why(
      q(
        'q4',
        'Dizayn tizimi nima?',
        [
          'Tokenlar, komponentlar va qoidalarning hujjatlashtirilgan to‘plami',
          'Bitta rang',
          'Bitta shrift',
          'Faqat logotip',
        ],
        [0],
      ),
      'Tizim — cheklov emas, tezlik va izchillik vositasi.',
    ),
  ]),
};
