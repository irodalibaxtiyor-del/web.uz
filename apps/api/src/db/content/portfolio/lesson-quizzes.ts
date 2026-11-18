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

/** Per-lesson tests of the Portfolio course (module-closing lessons keep their quiz). */
export const PORTFOLIO_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Rejalashtirish -----------------------------------------------------------
  'portfolio-nima': lessonQuiz([
    why(
      match('q1', 'Bo‘limni mazmuni bilan moslang.', [
        ['Bosh ekran', 'Ism, kimligingiz (bir jumla), asosiy tugma'],
        ['Ishlarim', '3–6 ta eng yaxshi loyiha'],
        ['Men haqimda', 'Qisqa hikoya, ko‘nikmalar, tajriba'],
        ['Aloqa', 'Email, Telegram, GitHub, forma'],
      ]),
      'Portfolio — ish beruvchi uchun yozilgan sahifa.',
    ),
    why(
      sortInto('q2', 'Ish beruvchi uchun nima muhim?', {
        Muhim: [
          'Eng muhim narsa birinchi ekranda',
          'Har loyihada jonli va kod havolasi',
          'Tez yuklanadigan sahifa',
        ],
        'Muhim emas': ['Ko‘p animatsiya va bezak'],
      }),
      'Ish beruvchi vaqtini tejang.',
    ),
    why(
      q(
        'q3',
        'Portfolio sahifasida nechta `<h1>` bo‘lishi kerak?',
        ['Bitta', 'Har bo‘limda bittadan', 'Hech qancha', 'Ikkita'],
        [0],
      ),
      'Bo‘limlar — `h2`.',
    ),
    why(
      tf(
        'q4',
        '`header`, `nav`, `main`, `footer` ekran o‘quvchiga sahifa qismlari orasida tez sakrash imkonini beradi.',
        true,
      ),
      'Semantik tuzilma — qulaylik asosi.',
    ),
  ]),
  tuzilma: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Klaviatura uchun asosiy mazmunga o‘tish havolasi.',
        '<a class="otish" href="{{1}}">Asosiy mazmunga o‘tish</a>',
        ['#asosiy'],
      ),
      'Skip link sahifaning birinchi fokuslanadigan elementi bo‘ladi; `main` ga `id="asosiy"`.',
    ),
    why(
      codeFill('q2', 'Bo‘lim yopishqoq header ostida qolmasin.', 'section {\n  {{1}}: 80px;\n}', [
        'scroll-margin-top',
      ]),
      'Header balandligi + biroz joy.',
    ),
    why(
      tf(
        'q3',
        'Harakatni kamaytirishni so‘ragan foydalanuvchilar uchun `scroll-behavior: smooth` o‘chiriladi.',
        true,
      ),
      '`@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`.',
    ),
    why(
      q(
        'q4',
        'Bir sahifali saytda menyu havolasi bosilganda manzil satrida nima o‘zgaradi?',
        [
          '#bolim qismi (masalan, #ishlarim)',
          'Butun domen',
          'Hech narsa',
          'Sahifa qayta yuklanadi',
        ],
        [0],
      ),
      'Shu havolani boshqalarga yuborish ham mumkin.',
    ),
  ]),

  // ---- 2. Bosh ekran va navigatsiya ------------------------------------------------
  hero: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Bosh ekran birinchi ekranni to‘ldirsin (header 64px).',
        '.bosh {\n  min-height: calc(100{{1}} - 64px);\n}',
        ['dvh'],
      ),
      '`dvh` telefonda manzil panelini hisobga oladi.',
    ),
    why(
      q(
        'q2',
        'Bosh ekrandagi eng katta matn odatda nima?',
        ['Ismingiz', '“Salom” so‘zi', 'Tugma matni', 'Sana'],
        [0],
      ),
      'Ismi — `h1`.',
    ),
    why(
      tf(
        'q3',
        'Bosh ekranda ikkita tugma bo‘lsa, ulardan biri asosiy, ikkinchisi ikkinchi darajali ko‘rinishda bo‘ladi.',
        true,
      ),
      'Masalan, “Ishlarim” va “Aloqa”.',
    ),
    why(
      q(
        'q4',
        'Mehmon bosh ekran haqida qaror qabul qilishi uchun taxminan qancha vaqt sarflaydi?',
        ['5 soniya', '5 daqiqa', '1 soat', '30 daqiqa'],
        [0],
      ),
      'Shuning uchun xabar aniq va qisqa bo‘lsin.',
    ),
  ]),
  'sticky-nav': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Header yuqoriga yopishsin.',
        'header {\n  position: sticky;\n  {{1}}: 0;\n  z-index: 10;\n}',
        ['top'],
      ),
      '`top` shart — usiz sticky ishlamaydi.',
    ),
    why(
      sortInto('q2', 'Sticky ishlamasligining sabablari?', {
        Sabab: [
          'Ota elementda overflow: hidden',
          'top berilmagan',
          'Ota balandligi header bilan teng',
        ],
        'Sabab emas': ['Headerda logo borligi'],
      }),
      'Sticky eng yaqin aylanuvchi ota ichida ishlaydi.',
    ),
    why(
      q(
        'q3',
        'Header ortidagi kontentni xira ko‘rsatish uchun?',
        ['backdrop-filter: blur()', 'filter: blur()', 'opacity: 0.5', 'text-shadow'],
        [0],
      ),
      'Yarim shaffof fon bilan birga.',
    ),
    why(
      tf(
        'q4',
        '`z-index` aylantirilgan kontent header ustidan o‘tib ketmasligi uchun kerak.',
        true,
      ),
      'Header boshqa qatlamlardan yuqorida bo‘ladi.',
    ),
  ]),
  'mobil-menyu': lessonQuiz([
    why(
      q(
        'q1',
        'Menyu ichidagi har bir havola uchun ishlovchi qo‘shish o‘rniga nima qulay?',
        [
          'Menyuga bitta ishlovchi (hodisa delegatsiyasi)',
          'Har havolaga onclick',
          'setInterval',
          'iframe',
        ],
        [0],
      ),
      "`event.target.closest('a')` bilan bosilgan havolani aniqlash.",
    ),
    why(
      tf(
        'q2',
        'Menyu holatini (ochiq/yopiq) bitta funksiya o‘zgartirsa, kod sodda va xatosiz bo‘ladi.',
        true,
      ),
      'Bitta funksiya — bitta holat.',
    ),
    why(
      codeFill('q3', 'Holatni tugmaga yozing.', "tugma.setAttribute('{{1}}', String(ochiq));", [
        'aria-expanded',
      ]),
      'CSS ham shu atributga qarab menyuni ko‘rsatadi.',
    ),
    why(
      q(
        'q4',
        'Kompyuterda (keng ekranda) mobil menyu tugmasi bilan nima qilinadi?',
        [
          'Media so‘rov bilan yashiriladi, menyu doim ko‘rinadi',
          'Doim ko‘rsatiladi',
          'Sahifa pastiga ko‘chiriladi',
          'O‘chirib tashlanadi',
        ],
        [0],
      ),
      'Burger faqat tor ekranda kerak.',
    ),
  ]),

  // ---- 3. Men haqimda -------------------------------------------------------------
  profil: lessonQuiz([
    why(
      q(
        'q1',
        'Qaysi jumla “Men haqimda” uchun yaxshiroq?',
        [
          'Kichik bizneslar uchun tez saytlar yasayman',
          'Men ishtiyoqli va mas’uliyatli dasturchiman',
          'Men hamma narsani bilaman',
          'Salom',
        ],
        [0],
      ),
      'Aniq va natijaga yo‘naltirilgan.',
    ),
    why(
      fill(
        'q2',
        'Bo‘sh joyni to‘ldiring.',
        '“Men haqimda” matni qisqa bo‘lsin: taxminan 60–{{1}} so‘z.',
        ['120'],
      ),
      'Uzun hikoyani hech kim o‘qimaydi.',
    ),
    why(
      tf('q3', '“Men haqimda” matni birinchi shaxsda va oddiy tilda yoziladi.', true),
      'Masalan, “yasayman”, “o‘rganyapman”.',
    ),
    why(
      q(
        'q4',
        'Portret rasmining `alt` i?',
        [
          'Ismingiz bilan qisqa tavsif (masalan, “Aziza Karimova portreti”)',
          '“rasm”',
          'Bo‘sh',
          'Fayl nomi',
        ],
        [0],
      ),
      'Portret — mazmunli rasm.',
    ),
  ]),
  konikmalar: lessonQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['role="progressbar"', 'Element progress ekanini bildiradi'],
        ['aria-valuenow="90"', 'Joriy qiymat'],
        ['style="--daraja: 90%"', 'CSS uchun qiymat (o‘zgaruvchi)'],
      ]),
      'Ekran o‘quvchi “HTML, 90 foiz” deydi.',
    ),
    why(
      codeFill(
        'q2',
        'Chiziq kengligini o‘zgaruvchidan oling.',
        '.chiziq::after {\n  width: {{1}}(--daraja);\n}',
        ['var'],
      ),
      'Bitta CSS qoidasi hamma chiziqqa xizmat qiladi.',
    ),
    why(
      tf(
        'q3',
        'Ko‘nikmalarni foizli chiziq o‘rniga teglar ro‘yxati sifatida ko‘rsatish ham to‘g‘ri muqobil.',
        true,
      ),
      '“HTML 90%” ning aniq ma’nosi yo‘q — teglar halolroq bo‘lishi mumkin.',
    ),
    why(
      q(
        'q4',
        'Chiziqlarning animatsiyasi uchun nima hisobga olinadi?',
        ['prefers-reduced-motion', 'print', 'orientation', 'hover'],
        [0],
      ),
      'Animatsiya ixtiyoriy va o‘chirilishi mumkin bo‘lsin.',
    ),
  ]),
  'vaqt-chizigi': lessonQuiz([
    why(
      q(
        'q1',
        'Vaqt chizig‘i uchun qaysi ro‘yxat to‘g‘ri?',
        ['<ol> — tartiblangan', '<ul>', '<dl>', '<table>'],
        [0],
      ),
      'Voqealar vaqt bo‘yicha tartiblangan.',
    ),
    why(
      codeFill(
        'q2',
        'Sanani mashina o‘qiy oladigan qiling.',
        '<{{1}} datetime="2024-09">2024-yil sentabr</{{2}}>',
        ['time', 'time'],
      ),
      'Qidiruv tizimlari va ekran o‘quvchilar uchun.',
    ),
    why(
      q(
        'q3',
        'Vertikal chiziq va nuqtalar qanday chiziladi?',
        ['::before psevdoelementlari bilan', 'Rasm bilan', '<hr> bilan', 'Jadval bilan'],
        [0],
      ),
      'Ro‘yxatda chiziq, har bandda nuqta.',
    ),
    why(
      tf('q4', '`::before` dagi bezak (chiziq, nuqta) muhim ma’lumot bermasligi kerak.', true),
      'Psevdoelement matnini ekran o‘quvchi har doim ham o‘qimaydi.',
    ),
  ]),

  // ---- 4. Loyihalar --------------------------------------------------------------
  'loyiha-kartalari': lessonQuiz([
    why(
      order('q1', 'Loyiha kartasi qismlarini tartiblang.', [
        'Muqova (skrinshot)',
        'Nom',
        'Bir jumlali tavsif',
        'Havolalar',
      ]),
      'Texnologiyalar teglari ixtiyoriy.',
    ),
    why(
      sortInto(
        'q2',
        'Butun karta bosiladigan bo‘lishi (bitta havola + kengaytirilgan maydon) nima beradi?',
        {
          Foyda: [
            'Ekran o‘quvchi havolani qisqa nom bilan o‘qiydi',
            'Tab bilan bittadan qadam',
            'Istalgan joyi bosiladi',
          ],
          'Foyda emas': ['Sahifa tezroq yuklanadi'],
        },
      ),
      'Butun kartani `<a>` ga o‘rash ekran o‘quvchiga juda uzun nom beradi.',
    ),
    why(
      codeFill(
        'q3',
        'Muqovalar bir xil nisbatda.',
        '.karta img {\n  aspect-ratio: 16 / 10;\n  object-fit: {{1}};\n}',
        ['cover'],
      ),
      'Turli o‘lchamli skrinshotlar bir xil ko‘rinadi.',
    ),
    why(
      q(
        'q4',
        'Skrinshot qanday tayyorlanadi?',
        [
          '1280 × 800 oynada olinib, WebP ga o‘giriladi',
          'Telefon kamerasida ekrandan',
          'Eng katta PNG sifatida',
          'Ekran rasmisiz',
        ],
        [0],
      ),
      'Sifatli va yengil.',
    ),
  ]),
  filtr: lessonQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['data-filtr / data-toifa', 'JavaScript uchun ma’lumot'],
        ['aria-pressed', 'Tugma bosilgan yoki yo‘qligi'],
        ['role="group" + aria-label', 'Tugmalar bitta guruh ekani'],
      ]),
      'Ekran o‘quvchi “CSS, bosilgan tugma” deydi.',
    ),
    why(
      codeFill(
        'q2',
        'Mos kelmagan kartani yashiring.',
        'karta.{{1}} = karta.dataset.toifa !== tanlangan;',
        ['hidden'],
      ),
      '`hidden` xususiyati elementni yashiradi.',
    ),
    why(
      q(
        'q3',
        'Filtrdan keyin “5 ta loyiha ko‘rsatilmoqda” xabari ekran o‘quvchiga qanday yetadi?',
        ['aria-live="polite" li element orqali', 'alert()', 'console.log', 'title'],
        [0],
      ),
      'Natija o‘zgarganini ko‘rmaydigan foydalanuvchi ham bilishi kerak.',
    ),
    why(
      tf(
        'q4',
        'CSS’da `[hidden] { display: none !important; }` yozish `display: grid` berilgan kartalarda `hidden` ishlashini kafolatlaydi.',
        true,
      ),
      'Aks holda klass uslubi `hidden` ni bosib ketishi mumkin.',
    ),
  ]),
  lightbox: lessonQuiz([
    why(
      codeFill('q1', 'Lightbox oynasini modal sifatida oching.', 'oyna.{{1}}();', ['showModal']),
      '`<dialog>` ishning katta qismini o‘zi bajaradi.',
    ),
    why(
      sortInto('q2', '`<dialog>` + `showModal()` o‘zi nimani ta’minlaydi?', {
        'O‘zi qiladi': [
          'Esc bilan yopish',
          'Orqadagi sahifani bosib bo‘lmasligi',
          'Fokusni oyna ichida ushlash',
        ],
        'O‘zi qilmaydi': ['Katta rasmni avtomatik topish'],
      }),
      'Yopilganda fokus bosilgan tugmaga qaytadi.',
    ),
    why(
      q(
        'q3',
        'Fon (backdrop) qaysi psevdoelement bilan bezaladi?',
        ['::backdrop', '::before', '::overlay', ':modal-bg'],
        [0],
      ),
      'Fonni bosib yopishni JS bilan qo‘shish mumkin.',
    ),
    why(
      tf(
        'q4',
        'Katta rasm sahifa ochilishi bilan emas, faqat lightbox ochilganda yuklanishi kerak.',
        true,
      ),
      'Trafik va tezlik tejaladi.',
    ),
  ]),
  'loyiha-sahifasi': lessonQuiz([
    why(
      q(
        'q1',
        'Case study sahifasi nima?',
        ['Loyiha hikoyasi: muammo, yechim, natija', 'Kod fayli', 'Rezyume', 'Aloqa formasi'],
        [0],
      ),
      'Ish beruvchi sizning fikrlash jarayoningizni ko‘radi.',
    ),
    why(
      codeFill('q2', 'Hikoya qulay o‘qish kengligida.', '.hikoya {\n  max-width: 65{{1}};\n}', [
        'ch',
      ]),
      'Taxminan 65 belgi.',
    ),
    why(
      q(
        'q3',
        'Grid ichidagi ma’lumot paneli sticky bo‘lishi uchun nima muhim?',
        ['align-self: start', 'height: 100%', 'overflow: hidden', 'float: right'],
        [0],
      ),
      'Cho‘zilgan grid katagida sticky ishlamaydi.',
    ),
    why(
      codeFill(
        'q4',
        'Rol, muddat, texnologiyalar uchun tavsif ro‘yxati.',
        '<{{1}}>\n  <dt>Rol</dt>\n  <dd>Frontend</dd>\n</dl>',
        ['dl'],
      ),
      '`<dl>` — atama va qiymat juftliklari.',
    ),
  ]),

  // ---- 5. Aloqa va qo‘shimchalar -------------------------------------------------
  'aloqa-forma': lessonQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['required', 'Bo‘sh qoldirib bo‘lmaydi'],
        ['type="email"', '@ va domen tekshiriladi'],
        ['minlength', 'Kamida N belgi'],
        ['autocomplete', 'Saqlangan ma’lumotni taklif qiladi'],
      ]),
      'Brauzer tekshiruvi — qulaylik.',
    ),
    why(
      q(
        'q2',
        '“Honeypot” nima?',
        [
          'Odam ko‘rmaydigan, bot to‘ldiradigan yashirin maydon',
          'CAPTCHA turi',
          'Parol',
          'Shifrlash',
        ],
        [0],
      ),
      'To‘ldirilgan bo‘lsa, server xabarni tashlaydi.',
    ),
    why(
      tf('q3', 'CAPTCHA spamdan himoyaning birinchi va eng qulay chorasi.', false),
      'U oxirgi chora — foydalanuvchiga noqulay.',
    ),
    why(
      q(
        'q4',
        'Yuborilgandan keyingi natija xabari ekran o‘quvchiga qanday yetadi?',
        ['role="status" (aria-live) li element', 'console.log', 'Sahifani yangilash', 'title'],
        [0],
      ),
      'Xato bo‘lsa — `role="alert"`.',
    ),
  ]),
  fikrlar: lessonQuiz([
    why(
      match('q1', 'Elementni vazifasi bilan moslang.', [
        ['blockquote', 'Boshqa odamdan olingan iqtibos'],
        ['figure + figcaption', 'Iqtibos va manbani bog‘laydi'],
        ['cite', 'Manba nomi (tashkilot)'],
      ]),
      'Fikrlar — ijtimoiy isbot.',
    ),
    why(
      codeFill(
        'q2',
        'Iqtibos va muallifini bog‘lang.',
        '<figure>\n  <blockquote><p>Sayt bir haftada tayyor bo‘ldi!</p></blockquote>\n  <{{1}}>Dilshod, “Non uyi”</figcaption>\n</figure>',
        ['figcaption'],
      ),
      'Muallif `figcaption` ichida.',
    ),
    why(
      tf('q3', 'Bezak qo‘shtirnoqlarni CSS (`::before`) bilan qo‘shish mumkin.', true),
      'HTML matni toza qoladi.',
    ),
    why(
      q(
        'q4',
        'Fikrlar uchun qaysi biri ishonchliroq?',
        [
          'Ism, kasb va tashkilot bilan aniq fikr',
          'Ismsiz “Zo‘r!”',
          'O‘zingiz yozgan fikr',
          '5 yulduz rasmi',
        ],
        [0],
      ),
      'Aniq manba ishonch uyg‘otadi.',
    ),
  ]),
  yuqoriga: lessonQuiz([
    why(
      q(
        'q1',
        '“Yuqoriga” tugmasi uchun qaysi element to‘g‘ri?',
        ['<a href="#bosh">', '<button onclick="scroll()">', '<div>', '<span>'],
        [0],
      ),
      'Bu sahifaning boshqa joyiga o‘tish — JavaScript’siz ishlaydi, fokus ham to‘g‘ri joyga o‘tadi.',
    ),
    why(
      codeFill(
        'q2',
        'iPhone’ning pastki xavfsiz hududini hisobga oling.',
        '.yuqoriga {\n  bottom: max(24px, env({{1}}));\n}',
        ['safe-area-inset-bottom'],
      ),
      'Tugma uy indikatori ostida qolmaydi.',
    ),
    why(
      tf('q3', 'Faqat ikonkali “yuqoriga” havolasiga `aria-label` kerak.', true),
      'Masalan, “Sahifa boshiga qaytish”.',
    ),
    why(
      q(
        'q4',
        'Tugma qachon ko‘rsatiladi?',
        [
          'Sahifa biroz pastga aylantirilgandan keyin',
          'Har doim, birinchi ekranda ham',
          'Hech qachon',
          'Faqat kompyuterda',
        ],
        [0],
      ),
      'Va u kontentni to‘sib qo‘ymasin.',
    ),
  ]),

  // ---- 6. Nashr va sifat ---------------------------------------------------------
  'seo-meta': lessonQuiz([
    why(
      match('q1', 'Tegni vazifasi bilan moslang.', [
        ['lang="uz"', 'Ekran o‘quvchi talaffuzi va qidiruv tili'],
        ['<title>', 'Tab va qidiruv natijasi sarlavhasi'],
        ['description', 'Qidiruvdagi qisqa matn (120–160 belgi)'],
        ['canonical', 'Sahifaning asosiy manzili'],
      ]),
      'Har sahifada o‘ziga xos sarlavha va tavsif.',
    ),
    why(
      codeFill(
        'q2',
        'Ulashilganda chiqadigan rasm.',
        '<meta property="{{1}}" content="https://aziza.example.uz/og.png">',
        ['og:image'],
      ),
      'Open Graph — Telegram va ijtimoiy tarmoqlardagi kartochka.',
    ),
    why(
      q(
        'q3',
        'Ulashish kartochkasini qanday tekshirasiz?',
        ['Telegram’da o‘zingizga havola yuborib', 'Ctrl+U', 'Console', 'Chop etib'],
        [0],
      ),
      'Indekslanishni Google Search Console ko‘rsatadi.',
    ),
    why(
      tf('q4', 'Barcha sahifalarda bir xil `<title>` bo‘lishi SEO uchun yaxshi.', false),
      'Har sahifa (case study ham) o‘z sarlavhasiga ega bo‘lsin.',
    ),
  ]),
  'tezlik-a11y': lessonQuiz([
    why(
      match('q1', 'Muammoni tuzatish bilan moslang.', [
        ['Rasmda alt yo‘q', 'Mazmunli alt yoki bezak uchun alt=""'],
        ['Sahifa “sakraydi” (CLS)', 'width va height atributlari'],
        ['Pastdagi rasmlar darhol yuklanadi', 'loading="lazy"'],
        ['<html> da lang yo‘q', 'lang="uz"'],
      ]),
      'Lighthouse shu muammolarni sanab beradi.',
    ),
    why(
      tf('q2', 'Sarlavha darajalarini o‘tkazib yuborish (`h1` → `h3`) qulaylik muammosi.', true),
      'Darajalar ketma-ket bo‘lsin.',
    ),
    why(
      q(
        'q3',
        'Sahifa yukining eng katta qismi odatda nima?',
        ['Rasmlar', 'HTML', 'CSS', 'Favicon'],
        [0],
      ),
      'Har rasm kerakli o‘lchamda va zamonaviy formatda bo‘lsin.',
    ),
    why(
      codeFill(
        'q4',
        'Shrift yuklanguncha matn darhol ko‘rinsin.',
        '@font-face {\n  font-family: Inter;\n  src: url(inter.woff2);\n  font-display: {{1}};\n}',
        ['swap'],
      ),
      'Faqat kerakli qalinliklarni ulang.',
    ),
  ]),
};
