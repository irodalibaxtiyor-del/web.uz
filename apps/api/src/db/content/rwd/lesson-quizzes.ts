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

/** Per-lesson tests of the "Moslashuvchan dizayn" course (module-closing lessons keep their quiz). */
export const RWD_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Asoslar ---------------------------------------------------------------
  nima: lessonQuiz([
    why(
      match('q1', 'Yondashuvni muammosi bilan moslang.', [
        ['Qotgan (960px)', 'Telefonda yon tomonga aylantirish kerak'],
        ['Suyuq (foizlar)', 'Juda keng ekranda qatorlar haddan tashqari uzun'],
        ['Moslashuvchan', 'Rejalashtirishni talab qiladi'],
      ]),
      'Moslashuvchan = suyuq asos + chegaralar + media so‘rovlar.',
    ),
    why(
      sortInto('q2', 'Moslashuvchan dizayn nega muhim?', {
        Sabab: [
          'Internetga kirishning katta qismi telefondan',
          'Qidiruv tizimlari mobilga mos sahifani yuqoriroq ko‘rsatadi',
          'Bitta kod ikki saytdan arzon',
        ],
        'Sabab emas': ['Kompyuterda sahifa sekinroq ochiladi'],
      }),
      'Bitta sayt barcha ekranlarga xizmat qiladi.',
    ),
    why(
      tf(
        'q3',
        'Telefon va kompyuter uchun ikki alohida sayt yasash moslashuvchan dizaynning asosiy usuli.',
        false,
      ),
      'Moslashuvchan dizayn — bitta kod har xil ekranga moslashadi.',
    ),
    why(
      q(
        'q4',
        'Moslashuvchan sahifada eng ko‘p uchraydigan xato?',
        ['Gorizontal aylantirish paydo bo‘lishi', 'Rangli fon', 'Ko‘p sarlavha', 'Qisqa matn'],
        [0],
      ),
      'Odatda qat’iy kenglikli element sabab bo‘ladi.',
    ),
  ]),
  viewport: lessonQuiz([
    why(
      codeFill(
        'q1',
        'To‘g‘ri meta tegni yozing.',
        '<meta name="viewport" content="{{1}}, initial-scale=1">',
        ['width=device-width'],
      ),
      'Viewport kengligi qurilma kengligiga teng bo‘ladi.',
    ),
    why(
      tf(
        'q2',
        '`user-scalable=no` qo‘shib, foydalanuvchiga sahifani kattalashtirishni taqiqlash to‘g‘ri.',
        false,
      ),
      'Ko‘rish qobiliyati past foydalanuvchilar kattalashtira olishi kerak.',
    ),
    why(
      q(
        'q3',
        'Zamonaviy telefonning CSS kengligi taxminan qancha?',
        ['360–430 px', '1080–1440 px', '200 px', '960 px'],
        [0],
      ),
      'Qurilma piksellari ko‘proq, lekin DPR 2–3 bo‘lgani uchun CSS piksel kamroq.',
    ),
    why(
      q(
        'q4',
        'Barmoq uchun qulay bosish maydoni kamida?',
        ['44 × 44 px', '10 × 10 px', '20 × 20 px', '100 × 100 px'],
        [0],
      ),
      'Kichik tugmalarni telefonda bosish qiyin.',
    ),
  ]),
  'avval-mobil': lessonQuiz([
    why(
      match('q1', 'Yondashuvni so‘rov turi bilan moslang.', [
        ['Avval mobil', 'min-width so‘rovlari bilan qo‘shiladi'],
        ['Avval kompyuter', 'max-width so‘rovlari bilan qirqiladi'],
      ]),
      'Avval mobilda standart uslub eng kichik ekran uchun.',
    ),
    why(
      codeFill(
        'q2',
        'Planshetdan boshlab ustunlarni yonma-yon qiling.',
        '@media ({{1}}: 48em) {\n  .ustunlar { display: flex; }\n}',
        ['min-width'],
      ),
      'Kattaroq ekran uchun uslub qo‘shiladi.',
    ),
    why(
      tf(
        'q3',
        'Avval mobil yondashuvda telefon keraksiz murakkab uslublarni qayta ishlamaydi.',
        true,
      ),
      'Telefon uchun uslub sodda bo‘ladi.',
    ),
    why(
      order('q4', 'Avval mobil ish tartibini joylang.', [
        'Bir ustunli telefon maketi',
        'Oyna kengligini oshirib, buzilgan joyni topish',
        'Shu kenglikka min-width so‘rovi qo‘shish',
      ]),
      'Tanaffus nuqtasini kontent ko‘rsatadi.',
    ),
  ]),
  birliklar: lessonQuiz([
    why(
      match('q1', 'Birlikni nimaga nisbatan ekanligi bilan moslang.', [
        ['rem', 'html elementining shrift o‘lchami'],
        ['em', 'O‘sha elementning (otasining) shrift o‘lchami'],
        ['%', 'Ota element'],
        ['dvh', 'Dinamik viewport balandligi'],
      ]),
      '`vw`/`vh` — viewport kengligi/balandligining 1%.',
    ),
    why(fill('q2', 'Hisoblang (asos 16px).', '2rem = {{1}}px', ['32']), '2 × 16 = 32.'),
    why(
      sortInto('q3', 'Vazifaga tavsiya etilgan birlik.', {
        rem: ['Shrift o‘lchami'],
        px: ['Ingichka chegara'],
        dvh: ['To‘liq ekranli bo‘lim'],
      }),
      'Maket kengliklari — `%`, `fr`, `min()`.',
    ),
    why(
      tf(
        'q4',
        '`100dvh` mobil brauzerda manzil paneli yashirinsa yoki ko‘rinsa, shunga moslashadi.',
        true,
      ),
      'Oddiy `100vh` esa ba’zan ekrandan oshib ketadi.',
    ),
  ]),

  // ---- 2. Media so‘rovlar -----------------------------------------------------------
  'sorov-sintaksisi': lessonQuiz([
    why(
      match('q1', 'Klassik yozuvni diapazon yozuvi bilan moslang.', [
        ['(min-width: 768px)', '(width >= 768px)'],
        ['(max-width: 767px)', '(width < 768px)'],
        ['(min-width: 768px) and (max-width: 1023px)', '(768px <= width < 1024px)'],
      ]),
      'Diapazon yozuvi o‘qishga osonroq.',
    ),
    why(
      tf(
        'q2',
        'Bir xil kuchdagi qoidalardan keyinroq yozilgani ustun keladi — media so‘rovlar odatda asosiy uslubdan keyin yoziladi.',
        true,
      ),
      'Kaskad tartibi media so‘rovlarga ham tegishli.',
    ),
    why(
      codeFill(
        'q3',
        'Ikki shartni birlashtiring.',
        '@media (min-width: 768px) {{1}} (orientation: landscape) { … }',
        ['and'],
      ),
      'Vergul — “yoki”, `and` — “va”.',
    ),
    why(
      q(
        'q4',
        'Media so‘rovni HTML’da qayerda berish mumkin?',
        ['<link media="…"> va <source media="…">', '<meta media>', '<div media>', 'Faqat CSS’da'],
        [0],
      ),
      'Masalan, faqat chop etish uchun uslub fayli.',
    ),
  ]),
  'tanaffus-nuqtalari': lessonQuiz([
    why(
      q(
        'q1',
        'Tanaffus nuqtasini nima belgilashi kerak?',
        [
          'Kontent (maket qayerda buzilsa)',
          'Mashhur telefon modeli',
          'Har doim 768px',
          'Brauzer turi',
        ],
        [0],
      ),
      'Qurilmaga emas, kontentga qarab.',
    ),
    why(fill('q2', 'Hisoblang.', 'Asos 16px bo‘lsa, 48em = {{1}}px', ['768']), '48 × 16 = 768.'),
    why(
      tf(
        'q3',
        'Tanaffus nuqtalarini `em` da yozish foydalanuvchi shriftni kattalashtirganda maketni ham moslashtiradi.',
        true,
      ),
      'Matn kattalashsa, maket kechroq kengayadi.',
    ),
    why(
      tf('q4', 'Juda ko‘p tanaffus nuqtasi — yaxshi moslashuvchanlik belgisi.', false),
      'Bu odatda maket suyuq emasligini bildiradi.',
    ),
  ]),
  'media-xususiyatlari': lessonQuiz([
    why(
      match('q1', 'So‘rovni ma’nosi bilan moslang.', [
        ['(hover: hover)', 'Sichqoncha bor'],
        ['(pointer: coarse)', 'Aniqligi past — barmoq'],
        ['(prefers-reduced-motion: reduce)', 'Harakatni kamaytirish so‘ralgan'],
        ['(prefers-color-scheme: dark)', 'Tizimda qorong‘i mavzu'],
      ]),
      'Kenglikdan boshqa foydali shartlar.',
    ),
    why(
      codeFill(
        'q2',
        'Chop etishda menyuni yashiring.',
        '@media {{1}} {\n  nav { display: none; }\n}',
        ['print'],
      ),
      'Chop etilgan sahifada menyu va tugmalar kerak emas.',
    ),
    why(
      q(
        'q3',
        'Telefonda bosish maydonini kattalashtirish uchun qaysi shart?',
        ['(pointer: coarse)', '(hover: hover)', '(orientation: portrait)', 'print'],
        [0],
      ),
      'Barmoq sichqonchadan noaniqroq.',
    ),
    why(
      tf('q4', '`(orientation: landscape)` ekran eniga keng ekanini bildiradi.', true),
      'Telefonni yotqizganda.',
    ),
  ]),
  yashirish: lessonQuiz([
    why(
      match('q1', 'Usulni natijasi bilan moslang.', [
        ['display: none', 'Ko‘rinmaydi, joy egallamaydi, o‘qilmaydi'],
        ['visibility: hidden', 'Ko‘rinmaydi, joy egallaydi'],
        ['opacity: 0', 'Ko‘rinmaydi, lekin bosish mumkin'],
        ['.sr-only', 'Ko‘rinmaydi, ekran o‘quvchi o‘qiydi'],
      ]),
      'Vazifaga qarab to‘g‘ri usulni tanlang.',
    ),
    why(
      sortInto('q2', 'Telefonda kontentni yashirish o‘rniga nima qilish mumkin?', {
        Yaxshi: ['Matnni qisqartirish', '<details> ichiga joylash', 'Sahifa pastiga ko‘chirish'],
        Yomon: ['Muhim ma’lumotni butunlay olib tashlash'],
      }),
      'Telefon foydalanuvchisiga ham o‘sha ma’lumot kerak.',
    ),
    why(
      tf('q3', 'HTML’dagi `hidden` atributi elementni `display: none` kabi yashiradi.', true),
      'CSS yozmasdan yashirish.',
    ),
    why(
      q(
        'q4',
        '“Menyu” ikonka tugmasiga ko‘zga ko‘rinmas matn qo‘shish uchun?',
        ['.sr-only klassli span', 'display: none span', 'opacity: 0 span', 'title'],
        [0],
      ),
      '`display: none` matnni ekran o‘quvchi ham o‘qimaydi.',
    ),
  ]),

  // ---- 3. Maketlar -----------------------------------------------------------------
  ustunlar: lessonQuiz([
    why(
      match('q1', '12 ustunli to‘rda ustunlar sonini foiz bilan moslang.', [
        ['6 / 12', '50%'],
        ['3 / 12', '25%'],
        ['9 / 12', '75%'],
        ['4 / 12', '33.33%'],
      ]),
      '12 soni 2, 3, 4, 6 ga bo‘linadi.',
    ),
    why(
      codeFill('q2', 'Padding kenglikni oshirmasin.', '* {\n  box-sizing: {{1}};\n}', [
        'border-box',
      ]),
      'Aks holda ustunlar yig‘indisi 100% dan oshib, qatorga sig‘maydi.',
    ),
    why(
      tf('q3', 'Bugun ustunli maket uchun `float` emas, Flexbox yoki Grid ishlatiladi.', true),
      '`float` — eski usul.',
    ),
    why(
      q(
        'q4',
        'Avval mobil ustunli maketda telefonda ustunlar qanday?',
        ['Ustma-ust, 100%', 'Yonma-yon', 'Yashirin', '50% dan'],
        [0],
      ),
      'Kenglik media so‘rovda beriladi.',
    ),
  ]),
  'flex-orash': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Bloklar sig‘masa keyingi qatorga tushsin.',
        '.qator {\n  display: flex;\n  flex-wrap: {{1}};\n}',
        ['wrap'],
      ),
      'Media so‘rovsiz moslashuv.',
    ),
    why(
      order('q2', '`flex: 1 1 220px` qismlarini tartiblang.', [
        'flex-grow',
        'flex-shrink',
        'flex-basis',
      ]),
      'O‘sish, qisqarish, boshlang‘ich o‘lcham.',
    ),
    why(
      q(
        'q3',
        '`flex: 1 1 220px` va `flex-wrap: wrap` bilan 375px ekranda nechta blok bir qatorda?',
        ['1 ta', '2 ta', '4 ta', '3 ta'],
        [0],
      ),
      'Ikkita 220px blok 375px ga sig‘maydi.',
    ),
    why(
      tf(
        'q4',
        'Flex o‘rashda oxirgi qatordagi yolg‘iz blok butun kenglikka cho‘zilib ketishi mumkin.',
        true,
      ),
      'Bir xil kartalar uchun Grid `auto-fit` qulayroq.',
    ),
  ]),
  'grid-auto-fit': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Kamida 250px li moslashuvchan to‘r.',
        'grid-template-columns: repeat(auto-fit, {{1}}(250px, 1fr));',
        ['minmax'],
      ),
      'Ustunlar sonini brauzer o‘zi hisoblaydi.',
    ),
    why(
      match('q2', 'Elementlar kam bo‘lganda natijasi.', [
        ['auto-fill', 'Bo‘sh ustunlar qoladi, elementlar 250px atrofida'],
        ['auto-fit', 'Bo‘sh ustunlar yig‘iladi, elementlar cho‘ziladi'],
      ]),
      'Farq faqat elementlar kam bo‘lganda ko‘rinadi.',
    ),
    why(
      q(
        'q3',
        'Juda tor ekranda (250px dan tor) element toshib ketmasligi uchun?',
        ['minmax(min(250px, 100%), 1fr)', 'minmax(250px, 2fr)', 'auto-fill', 'overflow: hidden'],
        [0],
      ),
      '`min()` minimal kenglikni ekrandan oshirmaydi.',
    ),
    why(
      tf(
        'q4',
        'Ba’zi hollarda (masalan, butun maket o‘zgarsa) baribir media so‘rov kerak bo‘ladi.',
        true,
      ),
      'auto-fit faqat ustunlar sonini moslaydi.',
    ),
  ]),
  'maket-hududlari': lessonQuiz([
    why(
      tf('q1', '`grid-template-areas` da hudud “L” shaklida bo‘lishi mumkin.', false),
      'Hudud doim to‘rtburchak.',
    ),
    why(
      q(
        'q2',
        'Qaysi yozuv to‘g‘ri?',
        ['grid-area: main;', 'grid-area: "main";', 'grid-area = main;', 'area: main;'],
        [0],
      ),
      'Nom tirnoqsiz yoziladi.',
    ),
    why(
      fill('q3', 'Bo‘sh katak qanday belgilanadi?', 'grid-template-areas: "header {{1}}";', ['.']),
      'Nuqta — bo‘sh katak.',
    ),
    why(
      tf(
        'q4',
        'Hududlar bilan elementlar tartibini ekranda o‘zgartirish klaviatura tartibini ham o‘zgartiradi.',
        false,
      ),
      'Klaviatura va ekran o‘quvchi HTML tartibida yuradi — vizual tartib juda farq qilmasin.',
    ),
  ]),

  // ---- 4. Moslashuvchan kontent ----------------------------------------------------
  rasmlar: lessonQuiz([
    why(
      sortInto('q1', 'Rasm qoidalarini vazifasiga ajrating.', {
        'Konteynerdan chiqmaydi': ['max-width: 100%'],
        'Nisbat saqlanadi': ['height: auto'],
        'Ostidagi bo‘shliq yo‘qoladi': ['display: block'],
      }),
      'Uchalasi birga asosiy qoida.',
    ),
    why(
      tf(
        'q2',
        'HTML’dagi `width` va `height` atributlari yuklanish paytida sahifa “sakrashining” oldini oladi.',
        true,
      ),
      'Brauzer nisbatni oldindan biladi.',
    ),
    why(
      match('q3', '`object-fit` qiymatini natijasi bilan moslang.', [
        ['fill', 'Cho‘ziladi, nisbat buziladi'],
        ['cover', 'To‘ldiradi, ortiqchasi qirqiladi'],
        ['contain', 'To‘liq ko‘rinadi, chetda bo‘sh joy'],
      ]),
      'Avatar uchun `cover`.',
    ),
    why(
      codeFill('q4', 'Kvadrat rasm.', 'img {\n  {{1}}: 1 / 1;\n  object-fit: cover;\n}', [
        'aspect-ratio',
      ]),
      'Nisbat CSS bilan beriladi.',
    ),
  ]),
  srcset: lessonQuiz([
    why(
      match('q1', 'Qismni ma’nosi bilan moslang.', [
        ['400w', 'Bu fayl 400 piksel kenglikda'],
        ['sizes', 'Rasm sahifada qancha joy egallaydi'],
        ['src', 'srcset ni tushunmaydigan brauzer uchun zaxira'],
        ['2x', 'Ikki baravar zich ekran uchun'],
      ]),
      'Brauzer mos faylni o‘zi tanlaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Pastdagi rasm kechiktirib yuklansin.',
        '<img src="a.jpg" alt="…" loading="{{1}}">',
        ['lazy'],
      ),
      'Bosh ekrandagi rasmga `lazy` yozilmaydi.',
    ),
    why(
      match('q3', 'Formatni qo‘llanishi bilan moslang.', [
        ['JPEG', 'Fotosuratlar'],
        ['PNG', 'Shaffoflik, skrinshot'],
        ['WebP / AVIF', 'Zamonaviy, 25–50% yengilroq'],
        ['SVG', 'Logotip, ikonka'],
      ]),
      'SVG har o‘lchamda tiniq.',
    ),
    why(
      tf('q4', 'Brauzer telefonda kichik faylni yuklab, trafikni tejaydi.', true),
      'Bu `srcset` ning asosiy foydasi.',
    ),
  ]),
  picture: lessonQuiz([
    why(
      tf('q1', '`<picture>` ichida `<img>` majburiy — aynan u ko‘rsatiladi.', true),
      '`alt`, `width`, `height`, `loading` ham `<img>` ga yoziladi.',
    ),
    why(
      sortInto('q2', 'Vazifaga mos vosita.', {
        'img + srcset + sizes': ['Bir rasm, turli o‘lchamlar'],
        'picture + source media': ['Telefonda boshqacha kesilgan rasm'],
        'picture + source type': ['AVIF/WebP va zaxira JPEG'],
      }),
      'Art direction — kompozitsiya ekranga qarab o‘zgaradi.',
    ),
    why(
      q(
        'q3',
        'Brauzer `<source>` larni qanday tanlaydi?',
        ['Yuqoridan pastga, birinchi moslarini', 'Eng kattasini', 'Tasodifiy', 'Oxirgisini'],
        [0],
      ),
      'Hech biri mos kelmasa — `<img src>`.',
    ),
    why(
      q(
        'q4',
        'CSS (masalan, border-radius) qaysi elementga beriladi?',
        ['<img>', '<picture>', '<source>', 'Hammasiga'],
        [0],
      ),
      '`<picture>` faqat o‘ram.',
    ),
  ]),
  'video-iframe': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Iframe videoning zamonaviy moslashuvi.',
        'iframe {\n  width: 100%;\n  height: auto;\n  {{1}}: 16 / 9;\n}',
        ['aspect-ratio'],
      ),
      'Eski usul — padding hiylasi.',
    ),
    why(
      match('q2', 'Atributni vazifasi bilan moslang.', [
        ['preload="none"', 'Bosmaguncha yuklanmaydi (trafik tejaladi)'],
        ['poster', 'Ijrodan oldingi rasm'],
        ['playsinline', 'iPhone’da to‘liq ekranga o‘tmaydi'],
        ['<track>', 'Subtitrlar'],
      ]),
      '`controls` — boshqaruv tugmalari.',
    ),
    why(
      tf('q3', 'Avtomatik ijro faqat ovozsiz (`muted`) video uchun brauzerlarda ishlaydi.', true),
      'Ovozli avtomatik ijro bloklanadi.',
    ),
    why(
      q(
        'q4',
        'Begona iframe imkoniyatlarini cheklash uchun?',
        ['sandbox va allow atributlari', 'style="border: 0"', 'loading', 'title'],
        [0],
      ),
      'Faqat kerakli ruxsatlarni bering.',
    ),
  ]),

  // ---- 5. Moslashuvchan komponentlar -------------------------------------------------
  navigatsiya: lessonQuiz([
    why(
      tf('q1', 'Menyu ochadigan “burger” `<a href="#">` bo‘lishi kerak.', false),
      'U sahifa ochmaydi, amal bajaradi — `<button>`.',
    ),
    why(
      match('q2', 'Atributni vazifasi bilan moslang.', [
        ['aria-expanded', 'Menyu ochiq yoki yopiqligi'],
        ['aria-controls', 'Tugma qaysi elementni boshqarishi'],
        ['aria-label', 'Ikonkali tugma nomi'],
      ]),
      'Ekran o‘quvchi “Menyu, yopiq tugma” deb e’lon qiladi.',
    ),
    why(
      sortInto('q3', 'Mobil menyu uchun qo‘shimcha qulayliklar?', {
        Kerak: [
          'Esc yopadi va fokusni burgerga qaytaradi',
          'Tashqariga bosish yopadi',
          'Havola bosilgach yopiladi',
        ],
        'Kerak emas': ['Menyu ochilganda sahifa avtomatik yangilanadi'],
      }),
      'Klaviatura foydalanuvchisini ham o‘ylang.',
    ),
    why(
      codeFill(
        'q4',
        'JS: holatni almashtiring.',
        "const ochiq = tugma.getAttribute('aria-expanded') === 'true';\ntugma.setAttribute('aria-expanded', String({{1}}ochiq));",
        ['!'],
      ),
      'Ochiq bo‘lsa yopiladi, yopiq bo‘lsa ochiladi.',
    ),
  ]),
  jadvallar: lessonQuiz([
    why(
      sortInto('q1', 'Holatga mos usul.', {
        'O‘ramda aylantirish': ['Raqamlarni ustun bo‘yicha solishtirish'],
        Kartochka: ['Har qator — alohida yozuv'],
        'Ustunlarni kamaytirish': ['Juda ko‘p kam muhim ustun'],
      }),
      'Jadval mazmuniga qarab tanlang.',
    ),
    why(
      codeFill(
        'q2',
        'Birinchi ustun aylantirganda qotib tursin.',
        'th:first-child {\n  position: {{1}};\n  left: 0;\n}',
        ['sticky'],
      ),
      'Qaysi qator ekani ko‘rinib turadi.',
    ),
    why(
      q(
        'q3',
        'Raqamlar bir xil kenglikda bo‘lishi uchun?',
        [
          'font-variant-numeric: tabular-nums',
          'letter-spacing: 1px',
          'font-family: serif',
          'text-align: center',
        ],
        [0],
      ),
      'Raqamli ustunlarni o‘ngga ham tekislang.',
    ),
    why(
      tf(
        'q4',
        'Jadvalni o‘ram ichida aylantirish butun sahifaning gorizontal aylanishiga yo‘l qo‘ymaydi.',
        true,
      ),
      'O‘ramga `overflow-x: auto`.',
    ),
  ]),
  formalar: lessonQuiz([
    why(
      q(
        'q1',
        'iPhone maydonni bosganda sahifani kattalashtirmasligi uchun shrift kamida?',
        ['16px', '12px', '10px', '20px'],
        [0],
      ),
      '16px dan kichik bo‘lsa, iPhone avtomatik kattalashtiradi.',
    ),
    why(
      match('q2', 'Maydonni klaviatura bilan moslang.', [
        ['type="email"', '@ va . bor'],
        ['type="tel"', 'Raqamlar'],
        ['inputmode="numeric"', 'Raqamlar (son uchun)'],
        ['type="search"', '“Qidirish” tugmasi'],
      ]),
      'To‘g‘ri tur telefonda mos klaviatura beradi.',
    ),
    why(
      codeFill(
        'q3',
        'Brauzer emailni avtomatik to‘ldirsin.',
        '<input type="email" name="email" autocomplete="{{1}}">',
        ['email'],
      ),
      '`autocomplete` qiymatlari forma to‘ldirishni tezlashtiradi.',
    ),
    why(
      tf('q4', 'Telefonda yorliq maydonning ustida turgani yon tomonidagidan qulayroq.', true),
      'Tor ekranda maydon to‘liq kenglikni oladi.',
    ),
  ]),
  kartalar: lessonQuiz([
    why(
      q(
        'q1',
        'Kartalarda matn uzunligi har xil — tugmalarni pastga tekislash uchun karta ichi?',
        [
          'display: flex; flex-direction: column; tugmaga margin-top: auto',
          'height: 300px',
          'float: bottom',
          'position: absolute har doim',
        ],
        [0],
      ),
      'Bo‘sh joy tugma ustida to‘planadi.',
    ),
    why(
      codeFill(
        'q2',
        'Karta rasmi bir xil nisbatda.',
        '.karta img {\n  aspect-ratio: 16 / 9;\n  object-fit: {{1}};\n}',
        ['cover'],
      ),
      'Rasm cho‘zilmaydi.',
    ),
    why(
      tf(
        'q3',
        'Butun kartani bosiladigan qilishda ichida faqat bitta asosiy havola bo‘lgani ma’qul.',
        true,
      ),
      'Bir nechta havola ichma-ich bosish maydonlarini chalkashtiradi.',
    ),
    why(
      q(
        'q4',
        'Karta o‘z konteyneri kengligiga qarab ko‘rinishini o‘zgartirishi uchun?',
        ['@container so‘rovlari', '@media print', 'float', 'z-index'],
        [0],
      ),
      'Konteyner so‘rovlari karta qayerga qo‘yilishiga qarab ishlaydi.',
    ),
  ]),

  // ---- 6. Amaliy loyiha: lending ---------------------------------------------------
  'lending-bosh': lessonQuiz([
    why(
      q(
        'q1',
        'Bosh ekran (hero) ning asosiy vazifasi?',
        [
          'Sayt nima taklif qilishini darhol aytish va harakatga chaqirish',
          'Barcha ma’lumotni joylash',
          'Faqat rasm ko‘rsatish',
          'Menyu bo‘lish',
        ],
        [0],
      ),
      'Sarlavha va asosiy tugma birinchi ekranda ko‘rinsin.',
    ),
    why(
      codeFill(
        'q2',
        'Bo‘lim ekranni to‘ldirsin, lekin 720px dan oshmasin.',
        '.hero {\n  min-height: {{1}}(100dvh, 720px);\n}',
        ['min'],
      ),
      'Katta monitorda bo‘sh “cho‘l” bo‘lib qolmaydi.',
    ),
    why(
      tf('q3', 'Bosh ekrandagi asosiy rasmga `loading="lazy"` yozish kerak.', false),
      'U darhol kerak; aksincha, `fetchpriority="high"` qo‘shish mumkin.',
    ),
    why(
      q(
        'q4',
        'Telefonda matn va rasm tartibi?',
        [
          'Matn tepada, rasm pastda (HTML tartibi)',
          'Rasm tepada har doim',
          'Rasm yashirin',
          'Yonma-yon',
        ],
        [0],
      ),
      'Asosiy xabar birinchi.',
    ),
  ]),
  'lending-narxlar': lessonQuiz([
    why(
      q(
        'q1',
        'Narx qaysi yozuvda to‘g‘ri?',
        ['99 000 so‘m / oy', '99000so‘m', '99,000,00', '$99000'],
        [0],
      ),
      'Ming xonalari bo‘sh joy bilan; qator uzilmasligi uchun `&nbsp;`.',
    ),
    why(
      sortInto('q2', 'Telefonda tariflarni solishtirish usullari?', {
        Yaxshi: [
          'Har kartada 3–4 asosiy imkoniyat',
          'Pastda aylanadigan to‘liq jadval',
          'Gorizontal aylanadigan qator (scroll-snap)',
        ],
        Yomon: ['Barcha 30 imkoniyatni har kartaga yozish'],
      }),
      'Telefonda ekran tor — asosiysini ko‘rsating.',
    ),
    why(
      codeFill(
        'q3',
        'Kartalar aylantirishda chetga “yopishsin”.',
        '.tariflar {\n  overflow-x: auto;\n  scroll-snap-type: x {{1}};\n}',
        ['mandatory'],
      ),
      'Har karta ekranga to‘liq tushadi.',
    ),
    why(
      tf(
        'q4',
        'Tavsiya etilgan tarifni faqat rang bilan emas, yorliq (masalan, “Tavsiya”) bilan ham ajratish kerak.',
        true,
      ),
      'Rangni ko‘rmaydigan foydalanuvchi uchun.',
    ),
  ]),
};
