import { codeFill, lessonQuiz, match, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Per-lesson tests of the Bootstrap 3 course (lessons that close a module keep their module quiz). */
export const BS3_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Tanishuv ----------------------------------------------------------------
  home: lessonQuiz([
    why(
      q(
        'q1',
        'Bootstrap nima?',
        [
          'Tayyor CSS klasslari va JS komponentlari to‘plami (freymvork)',
          'Yangi dasturlash tili',
          'Brauzer',
          'Ma’lumotlar bazasi',
        ],
        [0],
      ),
      'Klass yozasiz — tayyor uslub va xatti-harakat olasiz.',
    ),
    why(
      codeFill('q2', 'Ko‘k asosiy tugma yasang.', '<button class="btn {{1}}">Saqlash</button>', [
        'btn-primary',
      ]),
      'Avval asosiy `btn`, keyin rang klassi.',
    ),
    why(
      tf('q3', 'Bootstrap 3 ning JavaScript plaginlari jQuery’ga tayanadi.', true),
      'Bootstrap 5 da jQuery talab qilinmaydi.',
    ),
    why(
      sortInto('q4', 'Bootstrap 3 tarkibini ajrating.', {
        CSS: ['Setka tizimi', 'Tipografiya', 'Tugma uslublari'],
        'JavaScript plaginlari': ['Modal', 'Karusel', 'Tooltip'],
      }),
      'CSS qismi JS’siz ham ishlaydi.',
    ),
  ]),
  'get-started': lessonQuiz([
    why(
      order('q1', '`</body>` dan oldin skriptlar ulanish tartibini joylang.', [
        'jQuery',
        'bootstrap.min.js',
      ]),
      'jQuery birinchi bo‘lmasa: “Bootstrap’s JavaScript requires jQuery” xatosi.',
    ),
    why(
      codeFill(
        'q2',
        'Viewport tegini to‘ldiring.',
        '<meta name="viewport" content="width={{1}}, initial-scale=1">',
        ['device-width'],
      ),
      'Busiz telefonda setka ishlamaydi.',
    ),
    why(
      match('q3', 'Konteynerni xususiyati bilan moslang.', [
        ['.container', 'Markazda, qat’iy maksimal kenglikda'],
        ['.container-fluid', 'Ekran kengligi bo‘ylab to‘liq'],
      ]),
      'Kontent har doim konteyner ichiga qo‘yiladi.',
    ),
    why(
      q(
        'q4',
        'Bootstrap CSS ulanganini qanday bilish mumkin?',
        [
          'btn btn-primary tugma ko‘k va bezatilgan ko‘rinadi',
          'Sahifa sarlavhasi o‘zgaradi',
          'Brauzer ogohlantirish beradi',
          'Hech qanday farq bo‘lmaydi',
        ],
        [0],
      ),
      'Shrift va chekkalar ham Bootstrap standartiga o‘zgaradi.',
    ),
  ]),

  // ---- 2. Matn, jadval va xabarlar -------------------------------------------------
  typography: lessonQuiz([
    why(
      match('q1', 'Klassni vazifasi bilan moslang.', [
        ['.lead', 'Kirish paragrafini ajratib ko‘rsatadi'],
        ['.list-unstyled', 'Ro‘yxat belgilarini olib tashlaydi'],
        ['.list-inline', 'Ro‘yxat bandlarini bir qatorga qo‘yadi'],
        ['.dl-horizontal', 'Atama va izohni yonma-yon qo‘yadi'],
      ]),
      'Tipografiya klasslari matnni tez bezaydi.',
    ),
    why(
      codeFill('q2', 'Sarlavhadagi ikkilamchi matn.', '<h1>Kurslar <{{1}}>2026-yil</{{2}}></h1>', [
        'small',
        'small',
      ]),
      '`<small>` sarlavha ichida och rangda chiqadi.',
    ),
    why(
      tf(
        'q3',
        '`<p class="h3">` paragrafni `<h3>` ko‘rinishida bezaydi, lekin u sarlavha bo‘lib qolmaydi.',
        true,
      ),
      'Ko‘rinish va ma’no ajratiladi.',
    ),
    why(
      q(
        'q4',
        'Iqtibosni o‘ngga tekislaydigan BS3 klassi?',
        ['.blockquote-reverse', '.blockquote-right', '.text-right-quote', '.quote-end'],
        [0],
      ),
      'Bootstrap 3 da `<blockquote>` uchun.',
    ),
  ]),
  tables: lessonQuiz([
    why(
      match('q1', 'Klassni natijasi bilan moslang.', [
        ['.table-striped', 'Yo‘l-yo‘l qatorlar'],
        ['.table-bordered', 'Hamma kataklarda chegara'],
        ['.table-hover', 'Sichqoncha ustidagi qator ajraladi'],
        ['.table-responsive (o‘ram)', 'Kichik ekranda gorizontal aylantirish'],
      ]),
      'Barchasi asosiy `.table` bilan birga yoziladi.',
    ),
    why(
      codeFill('q2', 'Asosiy jadval klassi.', '<table class="{{1}} table-striped">', ['table']),
      '`.table` siz qo‘shimcha klasslar ishlamaydi.',
    ),
    why(
      q(
        'q3',
        'BS3 da qatorni yashil (muvaffaqiyat) qiladigan klass?',
        ['.success', '.table-success', '.green', '.bg-ok'],
        [0],
      ),
      'BS3 kontekstli qatorlari: `.active`, `.success`, `.info`, `.warning`, `.danger`.',
    ),
    why(
      tf(
        'q4',
        '`.table-responsive` klassi `<table>` ning o‘ziga emas, uni o‘rab turgan `<div>` ga beriladi.',
        true,
      ),
      'O‘ram kichik ekranda gorizontal aylantirishni beradi.',
    ),
  ]),
  images: lessonQuiz([
    why(
      match('q1', 'Klassni rasm shakli bilan moslang.', [
        ['.img-rounded', 'Yumaloq burchaklar'],
        ['.img-circle', 'Doira'],
        ['.img-thumbnail', 'Ramkali kichik rasm'],
      ]),
      'Bootstrap 4/5 da `.rounded`, `.rounded-circle`, `.img-thumbnail`.',
    ),
    why(
      codeFill(
        'q2',
        'Rasm konteynerga moslashsin (BS3).',
        '<img src="manzara.jpg" class="{{1}}" alt="Chorvoq">',
        ['img-responsive'],
      ),
      'BS4/5 da bu `.img-fluid` deb ataladi.',
    ),
    why(
      q(
        'q3',
        'BS3 da moslashuvchan rasmni markazga qo‘yadigan klass?',
        ['.center-block', '.text-center', '.mx-auto', '.img-center'],
        [0],
      ),
      '`display: block` va `margin: auto` beradi.',
    ),
    why(
      tf('q4', 'Bootstrap klassi bo‘lsa ham rasmga mazmunli `alt` kerak.', true),
      'Klass ko‘rinish beradi, `alt` — ma’no.',
    ),
  ]),
  jumbotron: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Katta e’lon bloki yasang.',
        '<div class="{{1}}">\n  <h1>Yozgi kurslar</h1>\n</div>',
        ['jumbotron'],
      ),
      'Jumbotron bosh sahifadagi asosiy xabar uchun.',
    ),
    why(
      q(
        'q2',
        'Jumbotron ekran bo‘ylab to‘liq kenglikda, matni esa markazda bo‘lishi uchun?',
        [
          'Jumbotronni konteynerdan tashqariga, ichiga .container qo‘yish',
          '.jumbotron-full klassi',
          'width: 200%',
          'Faqat .container-fluid ichiga',
        ],
        [0],
      ),
      'Fon to‘liq kenglikda, matn esa konteynerda tekislanadi.',
    ),
    why(
      q(
        'q3',
        'Sahifa sarlavhasini pastki chiziq bilan ajratadigan klass?',
        ['.page-header', '.header-line', '.jumbotron-sm', '.title-border'],
        [0],
      ),
      'Ichida odatda `<h1>` bo‘ladi.',
    ),
    why(
      tf('q4', 'Har bir sahifada bir nechta jumbotron ishlatish tavsiya etiladi.', false),
      'Jumbotron — eng asosiy bitta xabar uchun.',
    ),
  ]),
  wells: lessonQuiz([
    why(
      codeFill('q1', 'Kichik well yasang.', '<div class="well {{1}}">Eslatma</div>', ['well-sm']),
      'O‘lchamlar: `.well-sm`, `.well-lg`.',
    ),
    why(
      sortInto('q2', 'Qaysi komponent mos?', {
        Well: ['Yon paneldagi oddiy eslatma'],
        Alert: ['Saqlandi! — natija haqida xabar', 'Xato yuz berdi'],
        Panel: ['Sarlavhali va pastki qismli blok'],
      }),
      'Well — eng oddiy, kul rang fonli ichkariga botgan blok.',
    ),
    why(
      tf('q3', 'Well Bootstrap 4 da ham saqlanib qolgan.', false),
      'BS4 da well va panel o‘rniga `.card` keldi.',
    ),
    why(
      q(
        'q4',
        'Well qanday ko‘rinadi?',
        ['Kulrang fon va ichkariga botgan soya', 'Yorqin ko‘k fon', 'Qizil chegara', 'Doira'],
        [0],
      ),
      'Ichki soya “botiq” ko‘rinish beradi.',
    ),
  ]),

  // ---- 3. Tugmalar va belgilar -----------------------------------------------------
  buttons: lessonQuiz([
    why(
      match('q1', 'Rang klassini ma’nosi bilan moslang.', [
        ['btn-success', 'Muvaffaqiyat (yashil)'],
        ['btn-danger', 'Xavfli amal (qizil)'],
        ['btn-default', 'Oddiy oq tugma (BS3)'],
        ['btn-link', 'Havola ko‘rinishida'],
      ]),
      'BS4 da `btn-default` o‘rniga `btn-secondary`/`btn-light`.',
    ),
    why(
      order('q2', 'BS3 tugma o‘lchamlarini kichikdan kattaga tartiblang.', [
        'btn-xs',
        'btn-sm',
        '(standart)',
        'btn-lg',
      ]),
      '`btn-xs` faqat Bootstrap 3 da bor.',
    ),
    why(
      codeFill(
        'q3',
        'Tugma butun kenglikni egallasin (BS3).',
        '<button class="btn btn-primary {{1}}">Kirish</button>',
        ['btn-block'],
      ),
      'BS5 da buning o‘rniga `d-grid` o‘rami ishlatiladi.',
    ),
    why(
      sortInto('q4', '`btn` klassi qaysi teglarga beriladi?', {
        Mumkin: ['<button>', '<a>', '<input type="submit">'],
        'Ma’nosiz': ['<p>', '<li>'],
      }),
      '`<a>` ga berilsa `role="button"` ma’noni aniqlaydi.',
    ),
  ]),
  'button-groups': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tugmalarni guruhlang.',
        '<div class="{{1}}">\n  <button class="btn btn-default">Chap</button>\n  <button class="btn btn-default">O‘ng</button>\n</div>',
        ['btn-group'],
      ),
      'Guruh tugmalarni yopishtirib bitta blok qiladi.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.btn-group-vertical', 'Tugmalar ustma-ust'],
        ['.btn-group-justified', 'Guruh butun kenglikda, teng bo‘lingan'],
        ['.btn-toolbar', 'Bir nechta guruh bitta qatorda'],
        ['.btn-group-lg', 'Guruhdagi barcha tugmalar katta'],
      ]),
      'O‘lchamni har tugmaga emas, guruhga berish qulay.',
    ),
    why(
      tf(
        'q3',
        'Guruhga `role="group"` va `aria-label` berish ekran o‘qiydigan dasturga yordam beradi.',
        true,
      ),
      'Guruh nima uchunligi e’lon qilinadi.',
    ),
    why(
      q(
        'q4',
        'Matn muharriridagi “Qalin | Kursiv | Tagiga chizish” tugmalari uchun mos komponent?',
        ['Tugmalar guruhi', 'Jumbotron', 'Well', 'Pager'],
        [0],
      ),
      'Bog‘liq amallar bitta guruhda.',
    ),
  ]),
  glyphicons: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Qidiruv ikonkasini qo‘ying.',
        '<span class="glyphicon {{1}}" aria-hidden="true"></span>',
        ['glyphicon-search'],
      ),
      'Har doim ikki klass: `glyphicon` va `glyphicon-NOMI`.',
    ),
    why(
      tf('q2', 'Glyphicons Bootstrap 4 va 5 tarkibida ham bor.', false),
      'BS4 dan boshlab olib tashlangan — o‘rniga Bootstrap Icons yoki boshqa to‘plamlar.',
    ),
    why(
      q(
        'q3',
        'Faqat ikonkadan iborat tugma ekran o‘qiydigan dastur uchun qanday tushunarli bo‘ladi?',
        [
          'aria-label yoki .sr-only matn qo‘shib',
          'Ikonkani kattalashtirib',
          'Rangini o‘zgartirib',
          'title qo‘ymasdan',
        ],
        [0],
      ),
      'Ikonkaga esa `aria-hidden="true"`.',
    ),
    why(
      tf(
        'q4',
        'Glyphicon `<span>` ichiga matn yozilmaydi va boshqa klasslar bilan aralashtirilmaydi.',
        true,
      ),
      'Ikonka elementini bo‘sh qoldiring, kerak bo‘lsa uni boshqa element ichiga qo‘ying.',
    ),
  ]),
  'badges-labels': lessonQuiz([
    why(
      match('q1', 'Komponentni vazifasi bilan moslang.', [
        ['.badge', 'Son ko‘rsatkichi (masalan, 4 ta xabar)'],
        ['.label', 'Matnli yorliq (Yangi, Chegirma)'],
      ]),
      'BS4 da `.label` olib tashlanib, hammasi `.badge` bo‘ldi.',
    ),
    why(
      codeFill('q2', 'Yashil yorliq yasang (BS3).', '<span class="label {{1}}">Yangi</span>', [
        'label-success',
      ]),
      'Ranglar: default, primary, success, info, warning, danger.',
    ),
    why(
      q(
        'q3',
        '“Xabarlar 4” tugmasida 4 nima ekanini ekran o‘qiydigan dasturga qanday aytamiz?',
        [
          '<span class="sr-only">ta o‘qilmagan</span> qo‘shib',
          'Badge rangini o‘zgartirib',
          'Sonni katta qilib',
          'Hech narsa kerak emas',
        ],
        [0],
      ),
      '`.sr-only` matn ko‘zga ko‘rinmaydi, lekin o‘qiladi.',
    ),
    why(
      tf('q4', 'Badge’ni `.nav-pills` ichidagi havolaga ham qo‘yish mumkin.', true),
      'Masalan, “Kiruvchi 12”.',
    ),
  ]),

  // ---- 4. Navigatsiya komponentlari ------------------------------------------------
  pagination: lessonQuiz([
    why(
      match('q1', 'Klassni vazifasi bilan moslang.', [
        ['.pagination', 'Sahifa raqamlari ro‘yxati'],
        ['.active', 'Joriy sahifa'],
        ['.disabled', 'Bosib bo‘lmaydigan band'],
        ['.breadcrumb', 'Yo‘l ko‘rsatkichi (Bosh sahifa / Kurslar / HTML)'],
      ]),
      'O‘lchamlar: `.pagination-lg`, `.pagination-sm`.',
    ),
    why(
      codeFill('q2', 'Sahifalashni katta qiling.', '<ul class="pagination {{1}}">', [
        'pagination-lg',
      ]),
      'O‘lcham klassi `<ul>` ga beriladi.',
    ),
    why(
      tf(
        'q3',
        'Sahifalashni `<nav aria-label="…">` ichiga o‘rash foydalanish qulayligini oshiradi.',
        true,
      ),
      'Ekran o‘qiydigan dastur uni navigatsiya sifatida e’lon qiladi.',
    ),
    why(
      q(
        'q4',
        'Breadcrumb’ning oxirgi bandi odatda nima?',
        ['Joriy sahifa (havolasiz)', 'Bosh sahifa havolasi', 'Keyingi sahifa', 'Qidiruv'],
        [0],
      ),
      'Joriy sahifaga havola kerak emas.',
    ),
  ]),
  pager: lessonQuiz([
    why(
      codeFill(
        'q1',
        '“Oldingi” chapga, “Keyingi” o‘ngga tekislansin.',
        '<ul class="pager">\n  <li class="{{1}}"><a href="#">Oldingi</a></li>\n  <li class="{{2}}"><a href="#">Keyingi</a></li>\n</ul>',
        ['previous', 'next'],
      ),
      'Bu klasslar bandlarni chetlarga suradi.',
    ),
    why(
      sortInto('q2', 'Qaysi komponent mos?', {
        Pager: ['Blogdagi oldingi/keyingi maqola', 'Ikki tugmali oddiy o‘tish'],
        Pagination: ['50 sahifali qidiruv natijalari'],
      }),
      'Pager — faqat ikki yo‘nalish, pagination — raqamli sahifalar.',
    ),
    why(
      tf('q3', 'Pager bandini `.disabled` qilib o‘chirish mumkin.', true),
      'Masalan, birinchi sahifada “Oldingi”.',
    ),
    why(
      tf('q4', 'Pager Bootstrap 4 da ham alohida komponent sifatida bor.', false),
      'BS4 da pager olib tashlangan — pagination yoki tugmalar ishlatiladi.',
    ),
  ]),
  'list-groups': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Ro‘yxat guruhini yozing.',
        '<ul class="{{1}}">\n  <li class="list-group-item">HTML</li>\n</ul>',
        ['list-group'],
      ),
      'Har band — `.list-group-item`.',
    ),
    why(
      match('q2', 'Klassni vazifasi bilan moslang.', [
        ['.active', 'Tanlangan band'],
        ['.list-group-item-success', 'Yashil band'],
        ['.list-group-item-heading', 'Band ichidagi sarlavha'],
        ['.badge', 'Bandning o‘ng tomonidagi son'],
      ]),
      'Bandlar havola (`<a>`) yoki tugma ham bo‘lishi mumkin.',
    ),
    why(
      q(
        'q3',
        'Bosiladigan bandlar uchun qaysi tuzilma to‘g‘ri?',
        [
          '<div class="list-group"> ichida <a class="list-group-item">',
          '<ul> ichida <button> siz',
          '<table>',
          '<span class="list-group">',
        ],
        [0],
      ),
      'Havolali bandlar uchun `<a>` lar `<div>` ichida.',
    ),
    why(
      tf(
        'q4',
        'Faol bandni faqat rang bilan emas, `aria-current` bilan ham bildirish yaxshi.',
        true,
      ),
      'Rangni ko‘rmaydigan foydalanuvchi uchun.',
    ),
  ]),
  panels: lessonQuiz([
    why(
      order('q1', 'Panel qismlarini yuqoridan pastga tartiblang.', [
        '.panel-heading',
        '.panel-body',
        '.panel-footer',
      ]),
      'Hammasi `.panel .panel-default` ichida.',
    ),
    why(
      codeFill('q2', 'Ko‘k panel yasang.', '<div class="panel {{1}}">', ['panel-primary']),
      'Ranglar: default, primary, success, info, warning, danger.',
    ),
    why(
      q(
        'q3',
        'Bir nechta panelni (akkordeon uchun) birlashtiradigan klass?',
        ['.panel-group', '.panel-list', '.panel-stack', '.panels'],
        [0],
      ),
      'Guruhdagi panellar orasidagi masofa kichrayadi.',
    ),
    why(
      tf('q4', 'Bootstrap 4 da panel o‘rnini `.card` egalladi.', true),
      'Card — panel, well va thumbnail’ning o‘rnini bosuvchi universal komponent.',
    ),
  ]),
  dropdowns: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Menyuni ochadigan atributni yozing.',
        '<button class="btn btn-default dropdown-toggle" data-toggle="{{1}}">Kurslar <span class="caret"></span></button>',
        ['dropdown'],
      ),
      'Ota elementda `.dropdown`, ichida `.dropdown-menu`.',
    ),
    why(
      match('q2', 'Klassni vazifasi bilan moslang.', [
        ['.dropdown-header', 'Menyu ichidagi sarlavha'],
        ['.divider', 'Ajratuvchi chiziq'],
        ['.dropup', 'Menyu yuqoriga ochiladi'],
        ['.dropdown-menu-right', 'Menyu o‘ng chetga tekislanadi'],
      ]),
      '`.caret` — tugmadagi kichik uchburchak.',
    ),
    why(
      tf(
        'q3',
        'Dropdown ishlashi uchun Bootstrap JS (va BS3 da jQuery) ulangan bo‘lishi kerak.',
        true,
      ),
      'CSS faqat ko‘rinishni beradi.',
    ),
    why(
      q(
        'q4',
        'Dropdown’ni tugmalar guruhiga qanday qo‘shasiz?',
        [
          'Ichki .btn-group ichiga joylab',
          'Alohida sahifaga',
          'Faqat navbar’da mumkin',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Ichma-ich `.btn-group` dropdown uchun ota bo‘ladi.',
    ),
  ]),
  collapse: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tugma `#batafsil` blokini ochib-yopsin.',
        '<button class="btn btn-info" data-toggle="{{1}}" data-target="#batafsil">Batafsil</button>',
        ['collapse'],
      ),
      'Havola bilan bo‘lsa `href="#batafsil"`.',
    ),
    why(
      q(
        'q2',
        'BS3 da sahifa ochilganda blok ochiq turishi uchun unga qaysi klass qo‘shiladi?',
        ['in', 'show', 'open', 'active'],
        [0],
      ),
      'BS4/5 da bu `show`.',
    ),
    why(
      q(
        'q3',
        'Akkordeonda bittasi ochilganda boshqalari yopilishi uchun?',
        ['data-parent="#guruh-id"', 'data-close="all"', 'data-single', 'class="accordion-one"'],
        [0],
      ),
      'Barcha bo‘limlar bitta ota guruhga bog‘lanadi.',
    ),
    why(
      tf(
        'q4',
        'Tugmaga `aria-expanded` va `aria-controls` berish ochiq/yopiq holatni ekran o‘qiydigan dasturga bildiradi.',
        true,
      ),
      'Bootstrap `aria-expanded` ni o‘zi yangilaydi.',
    ),
  ]),
  'tabs-pills': lessonQuiz([
    why(
      match('q1', 'Klassni ko‘rinishi bilan moslang.', [
        ['.nav-tabs', 'Yorliqlar (tab)'],
        ['.nav-pills', 'Tabletka shaklidagi tugmalar'],
        ['.nav-stacked', 'Vertikal joylashuv'],
      ]),
      'Hammasi asosiy `.nav` bilan birga.',
    ),
    why(
      codeFill(
        'q2',
        'Yorliq bosilganda mos panel chiqsin.',
        '<a href="#html" data-toggle="{{1}}">HTML</a>\n…\n<div class="tab-content">\n  <div id="html" class="tab-pane fade in active">…</div>\n</div>',
        ['tab'],
      ),
      'Pills uchun `data-toggle="pill"`.',
    ),
    why(
      q(
        'q3',
        'Dinamik yorliqlarning mazmun qismlari qaysi o‘ramda turadi?',
        ['.tab-content ichida .tab-pane', '.nav ichida', '.panel-body', '.well'],
        [0],
      ),
      'Har pane `id` si havolaning `href` iga teng.',
    ),
    why(
      tf('q4', 'Sahifa ochilganda ko‘rinadigan yorliq va panelga `active` klassi beriladi.', true),
      'Panelga yana `in` (fade bilan).',
    ),
  ]),

  // ---- 5. Formalar ----------------------------------------------------------------
  forms: lessonQuiz([
    why(
      match('q1', 'Forma turini klassi bilan moslang.', [
        ['Vertikal (standart)', 'Qo‘shimcha klass shart emas'],
        ['Qatorli', '.form-inline'],
        ['Gorizontal', '.form-horizontal'],
      ]),
      'Har maydon `.form-group` ichida.',
    ),
    why(
      codeFill('q2', 'Maydonni bezang.', '<input type="email" class="{{1}}" id="email">', [
        'form-control',
      ]),
      '`.form-control` maydonni to‘liq kenglikda va chiroyli qiladi.',
    ),
    why(
      q(
        'q3',
        'Gorizontal formada yorliqqa nima beriladi?',
        ['.control-label va setka klassi (col-sm-2)', '.form-control', '.lead', '.btn'],
        [0],
      ),
      'Maydon esa qolgan ustunlarni oladi (`col-sm-10`).',
    ),
    why(
      tf(
        'q4',
        'Qatorli formada yorliqni `.sr-only` bilan yashirish mumkin, lekin `<label>` baribir bo‘lishi kerak.',
        true,
      ),
      'Ekran o‘qiydigan dastur maydon nomini o‘qiydi.',
    ),
  ]),
  inputs: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Checkboxlar bir qatorda tursin (BS3).',
        '<label class="{{1}}"><input type="checkbox"> HTML</label>',
        ['checkbox-inline'],
      ),
      'Radio uchun `.radio-inline`.',
    ),
    why(
      sortInto('q2', 'Qaysi elementga `.form-control` beriladi?', {
        Beriladi: ['<input type="text">', '<textarea>', '<select>'],
        Berilmaydi: ['<input type="checkbox">', '<input type="radio">'],
      }),
      'Checkbox va radio `.checkbox`/`.radio` o‘ramida.',
    ),
    why(
      q(
        'q3',
        'Bir guruhdagi radio tugmalardan faqat bittasini tanlash uchun nima bir xil bo‘ladi?',
        ['name', 'id', 'class', 'value'],
        [0],
      ),
      'Bu HTML qoidasi — Bootstrap faqat bezaydi.',
    ),
    why(
      tf('q4', 'Checkbox guruhini `<fieldset>` va `<legend>` bilan sarlavhalash mumkin.', true),
      'Guruh nima haqidaligi ekran o‘qiydigan dasturga aytiladi.',
    ),
  ]),
  'inputs-2': lessonQuiz([
    why(
      match('q1', 'Klassni vazifasi bilan moslang.', [
        ['.has-error', 'Maydon xato holatida (qizil)'],
        ['.has-success', 'Maydon to‘g‘ri (yashil)'],
        ['.help-block', 'Maydon ostidagi yordamchi matn'],
        ['.form-control-static', 'Tahrirlanmaydigan statik matn'],
      ]),
      'Holat klasslari `.form-group` ga beriladi.',
    ),
    why(
      codeFill(
        'q2',
        'Maydon ichida ikonka chiqsin.',
        '<div class="form-group has-success {{1}}">',
        ['has-feedback'],
      ),
      'Ikonka esa `.form-control-feedback` klassli `<span>`.',
    ),
    why(
      tf('q3', 'Xato holatini faqat qizil rang bilan bildirish yetarli.', false),
      'Matnli xabar (help-block) va `aria-describedby` ham bo‘lsin.',
    ),
    why(
      q(
        'q4',
        'Faolsiz maydon qanday qilinadi?',
        ['disabled atributi bilan', '.form-off klassi', 'readonly="no"', 'style="gray"'],
        [0],
      ),
      '`disabled` maydon yuborilmaydi va bosib bo‘lmaydi.',
    ),
  ]),

  // ---- 6. JavaScript komponentlari --------------------------------------------------
  'media-objects': lessonQuiz([
    why(
      order('q1', 'Media obyekt tuzilmasini tartiblang.', [
        '.media',
        '.media-left (rasm)',
        '.media-body (matn)',
      ]),
      'Izohlar va sharhlar uchun klassik naqsh.',
    ),
    why(
      codeFill('q2', 'Media ichidagi sarlavha.', '<h4 class="{{1}}">Aziza</h4>', ['media-heading']),
      'Sarlavha `.media-body` ichida.',
    ),
    why(
      q(
        'q3',
        'Rasmni matn o‘rtasiga vertikal tekislash uchun?',
        ['.media-middle', '.media-center', '.text-middle', '.v-center'],
        [0],
      ),
      '`.media-top` (standart), `.media-middle`, `.media-bottom`.',
    ),
    why(
      tf(
        'q4',
        'Javoblar uchun media obyektni boshqa media’ning `.media-body` si ichiga joylash mumkin.',
        true,
      ),
      'Ichma-ich media — izohlarga javoblar.',
    ),
  ]),
  carousel: lessonQuiz([
    why(
      match('q1', 'Qismni vazifasi bilan moslang.', [
        ['.carousel-inner', 'Slaydlar o‘rami'],
        ['.item', 'Bitta slayd (BS3)'],
        ['.carousel-indicators', 'Pastdagi nuqtalar'],
        ['.carousel-control', 'Oldingi/keyingi strelkalar'],
      ]),
      'BS4/5 da slayd klassi `.carousel-item`.',
    ),
    why(
      codeFill(
        'q2',
        'Karusel avtomatik boshlansin.',
        '<div id="slayder" class="carousel slide" data-ride="{{1}}">',
        ['carousel'],
      ),
      'To‘xtatish: `data-interval="false"`.',
    ),
    why(
      tf('q3', 'Slaydlardan biri albatta `active` klassiga ega bo‘lishi kerak.', true),
      'Aks holda karusel ko‘rinmaydi.',
    ),
    why(
      q(
        'q4',
        'Avtomatik aylanadigan karuselning foydalanish qulayligi muammosi?',
        [
          'Foydalanuvchi o‘qib ulgurmaydi — to‘xtatish imkoni kerak',
          'Rasmlar katta bo‘ladi',
          'Strelkalar ko‘rinmaydi',
          'Muammo yo‘q',
        ],
        [0],
      ),
      'Muhim ma’lumotni faqat karuselga qo‘ymang.',
    ),
  ]),
  modal: lessonQuiz([
    why(
      order('q1', 'Modal tuzilmasini tashqaridan ichkariga tartiblang.', [
        '.modal',
        '.modal-dialog',
        '.modal-content',
        '.modal-body',
      ]),
      '`.modal-header` va `.modal-footer` ham `.modal-content` ichida.',
    ),
    why(
      codeFill(
        'q2',
        'Tugma `#oyna` modalini ochsin.',
        '<button data-toggle="{{1}}" data-target="#oyna">Ochish</button>',
        ['modal'],
      ),
      'Yopish tugmasida `data-dismiss="modal"`.',
    ),
    why(
      q(
        'q3',
        'Katta modal uchun qaysi klass qayerga beriladi?',
        [
          '.modal-lg — .modal-dialog ga',
          '.modal-lg — .modal ga',
          '.big — .modal-body ga',
          'width: 900px — tugmaga',
        ],
        [0],
      ),
      'Kichik — `.modal-sm`.',
    ),
    why(
      tf(
        'q4',
        'Modalga `role="dialog"`, `aria-labelledby` (sarlavha id si) berish tavsiya etiladi.',
        true,
      ),
      'Ekran o‘qiydigan dastur oyna nomini e’lon qiladi.',
    ),
  ]),
  tooltip: lessonQuiz([
    why(
      tf('q1', 'Bootstrap tooltip’i `data-toggle="tooltip"` yozilgani bilan o‘zi yoqiladi.', false),
      'Ishlash uchun JS bilan yoqish kerak: `$(\'[data-toggle="tooltip"]\').tooltip()`.',
    ),
    why(
      codeFill(
        'q2',
        'Tooltip pastda chiqsin.',
        '<button data-toggle="tooltip" data-placement="{{1}}" title="Tahrirlash">…</button>',
        ['bottom'],
      ),
      'top, bottom, left, right.',
    ),
    why(
      q(
        'q3',
        'Tooltip matni qaysi atributdan olinadi?',
        ['title', 'data-content', 'alt', 'aria-hidden'],
        [0],
      ),
      'Popover’da esa `data-content` ham bor.',
    ),
    why(
      tf(
        'q4',
        'Telefonlarda hover yo‘qligi uchun muhim ma’lumotni faqat tooltipga yozmaslik kerak.',
        true,
      ),
      'Tooltip — qo‘shimcha izoh.',
    ),
  ]),
  popover: lessonQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['title', 'Popover sarlavhasi'],
        ['data-content', 'Popover matni'],
        ['data-placement', 'Joylashuvi'],
        ['data-trigger="focus"', 'Keyingi bosishda (fokus yo‘qolganda) yopiladi'],
      ]),
      'Popover ham JS bilan yoqiladi: `.popover()`.',
    ),
    why(
      sortInto('q2', 'Tooltip yoki popover?', {
        Tooltip: ['Ikonka tugmasidagi qisqa nom'],
        Popover: ['Sarlavhali uzunroq tushuntirish', 'Bosilganda ochiladigan izoh'],
      }),
      'Tooltip — hover’da qisqa; popover — bosish bilan kattaroq.',
    ),
    why(
      codeFill('q3', 'Popover’larni yoqing.', '$(\'[data-toggle="popover"]\').{{1}}();', [
        'popover',
      ]),
      'Sahifa yuklangandan keyin chaqiriladi.',
    ),
    why(
      tf('q4', 'Popover’ga juda uzun matn yoki forma joylash tavsiya etiladi.', false),
      'Bunday mazmun uchun modal yaxshiroq.',
    ),
  ]),
  scrollspy: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Body’ni kuzatuvchi qiling.',
        '<body data-spy="{{1}}" data-target="#menyu" data-offset="50">',
        ['scroll'],
      ),
      'Aylantirishga qarab menyuning tegishli bandi `active` bo‘ladi.',
    ),
    why(
      sortInto('q2', 'Scrollspy ishlashi uchun shartlar?', {
        Kerak: [
          'Kuzatiladigan element position: relative',
          'Menyu havolalari #bolim-id ko‘rinishida',
          'Bo‘limlarning id lari',
        ],
        'Kerak emas': ['Har bo‘limga alohida modal'],
      }),
      'Ichki aylantiriladigan blokda balandlik va `overflow-y` ham kerak.',
    ),
    why(
      q(
        'q3',
        '`data-offset="50"` nima uchun?',
        [
          'Mahkamlangan navbar balandligini hisobga olish',
          'Animatsiya tezligi',
          'Menyu kengligi',
          'Bandlar soni',
        ],
        [0],
      ),
      'Bo‘lim 50px oldinroq “faol” hisoblanadi.',
    ),
    why(
      tf('q4', 'Faol band almashganda `activate.bs.scrollspy` hodisasi sodir bo‘ladi.', true),
      'Uni JS bilan tinglash mumkin.',
    ),
  ]),
  affix: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Navbar 197px aylantirilgandan keyin yopishsin.',
        '<nav class="navbar" data-spy="affix" data-offset-top="{{1}}">',
        ['197'],
      ),
      'Shu nuqtadan keyin `.affix` klassi qo‘shiladi.',
    ),
    why(
      order('q2', 'Affix holatlarini aylantirish bo‘yicha tartiblang.', [
        '.affix-top',
        '.affix',
        '.affix-bottom',
      ]),
      'Boshida oddiy, keyin mahkamlangan, oxirida pastda to‘xtaydi.',
    ),
    why(
      q(
        'q3',
        'Affix’ning zamonaviy CSS alternativasi?',
        ['position: sticky', 'float: top', 'display: fixed', 'z-index: affix'],
        [0],
      ),
      'Affix Bootstrap 4 da olib tashlangan.',
    ),
    why(
      tf('q4', 'Affix ham Bootstrap’ning JavaScript plagini.', true),
      'Shuning uchun BS3 da jQuery bilan ishlaydi.',
    ),
  ]),

  // ---- 7. Setka tizimi ------------------------------------------------------------
  'grid-system': lessonQuiz([
    why(
      match('q1', 'BS3 ekran sinfini kengligi bilan moslang.', [
        ['xs', '< 768px (telefon)'],
        ['sm', '≥ 768px (planshet)'],
        ['md', '≥ 992px (noutbuk)'],
        ['lg', '≥ 1200px (katta ekran)'],
      ]),
      'BS4 da `xs` prefiksi yo‘q va `xl` qo‘shildi.',
    ),
    why(
      codeFill('q2', 'Ustunni 3 ustunga surib qo‘ying.', '<div class="col-md-6 {{1}}">', [
        'col-md-offset-3',
      ]),
      'BS4 da: `offset-md-3`.',
    ),
    why(
      tf('q3', 'Bir qatordagi ustunlar yig‘indisi 12 bo‘lishi kerak.', true),
      'Ko‘p bo‘lsa, ortiqchasi keyingi qatorga tushadi.',
    ),
    why(
      q(
        'q4',
        '`col-md-push-3` nima qiladi?',
        [
          'Ustunni vizual ravishda 3 ustun o‘ngga suradi (tartib almashadi)',
          'Ustunni yashiradi',
          'Kengligini 3 qiladi',
          'Ustunni yuqoriga suradi',
        ],
        [0],
      ),
      '`pull` bilan birga HTML tartibini o‘zgartirmasdan joylarni almashtiradi.',
    ),
  ]),
  'grid-stacked': lessonQuiz([
    why(
      q(
        'q1',
        '`col-sm-6` ikki ustun telefonda (< 768px) qanday ko‘rinadi?',
        [
          'Ustma-ust, har biri to‘liq kenglikda',
          'Yonma-yon',
          'Yashirinadi',
          'Bitta ustunga birlashadi',
        ],
        [0],
      ),
      'Sinf o‘z kengligidan boshlab ishlaydi, undan torroqda ustunlar ustma-ust.',
    ),
    why(
      order('q2', 'Setka elementlarini tashqaridan ichkariga tartiblang.', [
        '.container',
        '.row',
        '.col-sm-6',
      ]),
      'Ustunlar faqat `.row` ichida.',
    ),
    why(
      tf('q3', '`sm` sinfi yozilgan ustun `md` va `lg` ekranlarda ham shu nisbatda qoladi.', true),
      'Kattaroq sinf yozilmasa, kichigi kattaroq ekranlarga ham amal qiladi.',
    ),
    why(
      q(
        'q4',
        'Brauzerda setkani sinab ko‘rishning eng oson yo‘li?',
        [
          'Oyna kengligini o‘zgartirish yoki DevTools qurilma rejimi',
          'Sahifani chop etish',
          'Kodni nusxalash',
          'Rasm qo‘shish',
        ],
        [0],
      ),
      'Ustunlar qaysi kenglikda ustma-ust tushishini kuzating.',
    ),
  ]),
  'grid-small': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Telefonda ham ikki ustun yonma-yon bo‘lsin.',
        '<div class="{{1}}">Chap</div>\n<div class="col-xs-6">O‘ng</div>',
        ['col-xs-6'],
      ),
      '`xs` — eng kichik ekrandan boshlab amal qiladi.',
    ),
    why(
      q(
        'q2',
        '`col-xs-9` va `col-xs-6` bir qatorda bo‘lsa?',
        [
          'Ikkinchisi keyingi qatorga tushadi (9 + 6 > 12)',
          'Ikkalasi siqiladi',
          'Xato beradi',
          'Birinchisi yashirinadi',
        ],
        [0],
      ),
      'Yig‘indi 12 dan oshsa — qatorga o‘tish.',
    ),
    why(
      tf('q3', 'Faqat `col-sm-*` yozilsa, telefonda ustunlar ustma-ust turadi.', true),
      'Telefon uchun `xs` sinfi kerak.',
    ),
    why(
      q(
        'q4',
        'Faqat telefonda ko‘rinadigan blok klassi (BS3)?',
        ['.visible-xs-block', '.hidden-xs', '.d-xs-block', '.show-mobile'],
        [0],
      ),
      '`.hidden-xs` — aksincha, telefonda yashiradi.',
    ),
  ]),
  'grid-medium': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Telefonda to‘liq, planshetda yarim, noutbukda uchdan bir.',
        '<div class="col-xs-12 col-sm-6 {{1}}">',
        ['col-md-4'],
      ),
      'Uch sinfni birga yozish har ekran uchun alohida nisbat beradi.',
    ),
    why(
      q(
        'q2',
        'Yon panel (3) va asosiy qism (9) maketi uchun?',
        [
          'col-md-3 va col-md-9',
          'col-md-4 va col-md-4',
          'col-md-6 va col-md-12',
          'col-md-1 va col-md-1',
        ],
        [0],
      ),
      '3 + 9 = 12.',
    ),
    why(
      tf(
        'q3',
        '`col-sm-offset-3` noutbukda ham ishlaydi; uni bekor qilish uchun `col-md-offset-0` yoziladi.',
        true,
      ),
      'Offset ham kattaroq ekranlarga meros bo‘ladi.',
    ),
    why(
      match('q4', 'Klassni natijasi bilan moslang.', [
        ['.hidden-xs', 'Telefonda yashirin'],
        ['.hidden-sm', 'Planshetda yashirin'],
        ['.visible-xs-block', 'Faqat telefonda ko‘rinadi'],
      ]),
      'BS4 da bular `d-none d-sm-block` kabi utilitalar bilan almashgan.',
    ),
  ]),
  'grid-large': lessonQuiz([
    why(
      q(
        'q1',
        'Faqat `col-lg-6` yozilgan ustun noutbukda (992px) qanday?',
        ['To‘liq kenglikda (ustma-ust)', 'Yarim kenglikda', 'Yashirin', 'Chorak kenglikda'],
        [0],
      ),
      '`lg` faqat 1200px dan boshlab ishlaydi.',
    ),
    why(
      codeFill('q2', 'Katta ekranda markazlash (8 ustun).', '<div class="col-lg-8 {{1}}">', [
        'col-lg-offset-2',
      ]),
      '2 + 8 + 2 = 12.',
    ),
    why(
      tf(
        'q3',
        'Juda keng ekranda matn qatorlari haddan tashqari uzun bo‘lmasligi uchun kontentni toraytirish (offset) foydali.',
        true,
      ),
      'Uzun qatorni o‘qish qiyin.',
    ),
    why(
      q(
        'q4',
        'Bir xil sinf (`col-md-6 col-lg-6`) takrorlansa?',
        [
          'Ortiqcha — md allaqachon lg ga amal qiladi',
          'Xato beradi',
          'Ustun ikki baravar kengayadi',
          'lg bekor bo‘ladi',
        ],
        [0],
      ),
      'Faqat nisbat o‘zgaradigan sinflarni yozing.',
    ),
  ]),

  // ---- 8. Amaliy loyihalar --------------------------------------------------------
  templates: lessonQuiz([
    why(
      tf(
        'q1',
        'Bootstrap uslubini o‘zgartirish uchun `bootstrap.min.css` faylining o‘zini tahrirlash kerak.',
        false,
      ),
      'O‘z CSS faylingizni Bootstrap’dan **keyin** ulab, qoidalarni ustidan yozing.',
    ),
    why(
      order('q2', 'Sahifani rejalashtirish bosqichlarini tartiblang.', [
        'Bo‘limlarni qog‘ozda chizish',
        'Bootstrap komponentlarini tanlash',
        'HTML tuzilmani yozish',
        'O‘z CSS bilan bezash',
      ]),
      'Avval reja, keyin kod.',
    ),
    why(
      q(
        'q3',
        'Bir sahifali (one-page) saytda menyu havolalari qayerga olib boradi?',
        [
          'Shu sahifadagi bo‘limlarga (#id)',
          'Boshqa sahifalarga',
          'Tashqi saytlarga',
          'Hech qayerga',
        ],
        [0],
      ),
      'Scrollspy bilan faol bo‘lim ajratiladi.',
    ),
    why(
      codeFill(
        'q4',
        'O‘z uslubingizni ulang (Bootstrap’dan keyin).',
        '<link rel="stylesheet" href="css/bootstrap.min.css">\n<link rel="stylesheet" href="css/{{1}}">',
        ['style.css'],
      ),
      'Keyinroq ulangan qoida teng maxsuslikda ustun keladi.',
    ),
  ]),
  'theme-personal': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Portret rasmini doira qiling.',
        '<img src="men.jpg" class="{{1}}" alt="Mening portretim">',
        ['img-circle'],
      ),
      'Bosh qismdagi rangli fon bilan chiroyli chiqadi.',
    ),
    why(
      q(
        'q2',
        'Ko‘nikmalar bo‘limidagi uchta kartochka uchun setka?',
        [
          'Har biri col-sm-4',
          'Har biri col-sm-12',
          'col-sm-6, col-sm-6, col-sm-6',
          'Setka shart emas',
        ],
        [0],
      ),
      '3 × 4 = 12.',
    ),
    why(
      tf('q3', 'Sahifani telefon kengligida tekshirib ko‘rish loyihaning bir qismi.', true),
      'Moslashuvchanlik — Bootstrap’ning asosiy afzalligi.',
    ),
    why(
      q(
        'q4',
        'Bo‘limlar orasidagi “ritm” uchun nima muhim?',
        [
          'Bir xil vertikal bo‘shliqlar va cheklangan ranglar',
          'Har bo‘limda yangi shrift',
          'Iloji boricha ko‘p rang',
          'Bo‘shliqsiz joylash',
        ],
        [0],
      ),
      'Izchillik sahifani professional qiladi.',
    ),
  ]),
  'theme-company': lessonQuiz([
    why(
      codeFill('q1', 'Navbar yuqoriga mahkamlansin.', '<nav class="navbar navbar-default {{1}}">', [
        'navbar-fixed-top',
      ]),
      'Body’ga yuqoridan padding bering — kontent navbar ostida qolmasin.',
    ),
    why(
      q(
        'q2',
        'Telefonda menyuni yig‘ib, “☰” tugmasi bilan ochadigan qism?',
        [
          '.navbar-collapse + data-toggle="collapse" tugma',
          '.navbar-brand',
          '.jumbotron',
          '.panel',
        ],
        [0],
      ),
      'Tugmadagi uchta chiziq — `.icon-bar`.',
    ),
    why(
      sortInto('q3', 'Kompaniya sayti bo‘limlarini komponentga moslang.', {
        Jumbotron: ['Asosiy shior va harakatga chaqiruv'],
        Panel: ['Narxlar jadvali kartochkalari'],
        'Forma (form-group)': ['Aloqa: ism, email, xabar'],
      }),
      'Har bo‘lim uchun mos komponent.',
    ),
    why(
      tf('q4', 'Aloqa formasidagi har maydonga `<label>` kerak.', true),
      'Placeholder yorliq o‘rnini bosmaydi.',
    ),
  ]),
};
