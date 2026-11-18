import { codeFill, lessonQuiz, match, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Per-lesson tests of the Bootstrap 5 course (lessons that close a module keep their module quiz). */
export const BS5_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Tanishuv ----------------------------------------------------------------
  home: lessonQuiz([
    why(
      tf('q1', 'Bootstrap 5 jQuery’siz ishlaydi.', true),
      'Plaginlar oddiy JavaScript bilan yozilgan.',
    ),
    why(
      q(
        'q2',
        'BS5 da data-atributlar qanday nomlanadi?',
        [
          'data-bs-toggle, data-bs-target',
          'data-toggle, data-target',
          'bs-toggle',
          'data-bootstrap',
        ],
        [0],
      ),
      '`bs-` prefiksi boshqa kutubxonalar bilan to‘qnashuvdan saqlaydi.',
    ),
    why(
      codeFill(
        'q3',
        'Blokni qorong‘i rejimga o‘tkazing.',
        '<div class="p-3" data-bs-theme="{{1}}">',
        ['dark'],
      ),
      'BS 5.3 da rang rejimlari qo‘shilgan.',
    ),
    why(
      sortInto('q4', 'Bootstrap 4 → 5 nomlari.', {
        BS4: ['ml-auto', 'text-right', 'sr-only'],
        BS5: ['ms-auto', 'text-end', 'visually-hidden'],
      }),
      'Chap/o‘ng o‘rniga start/end — yozuv yo‘nalishiga moslashadi.',
    ),
  ]),
  'get-started': lessonQuiz([
    why(
      q(
        'q1',
        'Bootstrap 5 uchun qaysi fayllar kerak?',
        [
          'bootstrap.min.css va bootstrap.bundle.min.js',
          'jQuery, Popper va Bootstrap',
          'Faqat jQuery',
          'Uchta CSS fayl',
        ],
        [0],
      ),
      'jQuery endi kerak emas.',
    ),
    why(
      tf(
        'q2',
        'Popper alohida ulansa, `bootstrap.min.js` (bundle emas) ishlatiladi va Popper undan oldin ulanadi.',
        true,
      ),
      'Odatda bundle qulayroq.',
    ),
    why(
      codeFill(
        'q3',
        'Skriptni `<head>` da sahifani to‘xtatmasdan ulang.',
        '<script src="bootstrap.bundle.min.js" {{1}}></script>',
        ['defer'],
      ),
      '`defer` — HTML o‘qilib bo‘lgach bajariladi.',
    ),
    why(
      q(
        'q4',
        'CDN fayliga `integrity` (SRI) atributi nima uchun?',
        ['Fayl o‘zgartirilmaganini tekshirish', 'Tezroq yuklash', 'Siqish', 'Keshlash'],
        [0],
      ),
      'Fayl buzilgan bo‘lsa, brauzer uni bajarmaydi.',
    ),
  ]),
  containers: lessonQuiz([
    why(
      match('q1', 'Konteynerni xususiyati bilan moslang.', [
        ['.container', 'Har tanaffus nuqtasida qat’iy maksimal kenglik'],
        ['.container-fluid', 'Har doim 100%'],
        ['.container-md', 'md gacha 100%, keyin qat’iy'],
      ]),
      'BS5 da `.container-xxl` ham bor.',
    ),
    why(
      q(
        'q2',
        'xxl (≥ 1400px) da `.container` maksimal kengligi?',
        ['1320px', '1140px', '1400px', '100%'],
        [0],
      ),
      'xxl — BS5 dagi yangi oltinchi sinf.',
    ),
    why(
      codeFill(
        'q3',
        'Fon va matn tema rangiga moslashsin.',
        '<div class="container {{1}} text-body">',
        ['bg-body'],
      ),
      'Rang rejimi almashganda bu ranglar ham almashadi.',
    ),
    why(
      tf(
        'q4',
        'Konteynerga `data-bs-theme="dark"` berib, faqat shu qismni qorong‘i qilish mumkin.',
        true,
      ),
      'Atribut ichidagi barcha komponentlarga ta’sir qiladi.',
    ),
  ]),

  // ---- 2. Matn, ranglar va jadvallar ------------------------------------------------
  typography: lessonQuiz([
    why(
      q(
        'q1',
        'BS5 da display sarlavhalar nechta?',
        ['6 ta (display-1 … display-6)', '4 ta', '3 ta', '9 ta'],
        [0],
      ),
      'BS4 da 4 ta edi.',
    ),
    why(
      match('q2', 'Klassni vazifasi bilan moslang.', [
        ['.fw-bold', 'Qalin shrift'],
        ['.text-body-secondary', 'Ikkilamchi matn rangi'],
        ['.h2 (paragrafga)', 'Sarlavha ko‘rinishi'],
        ['.list-unstyled', 'Belgisiz ro‘yxat'],
      ]),
      'BS4 dagi `.font-weight-bold` → `.fw-bold`.',
    ),
    why(
      codeFill(
        'q3',
        'Iqtibos manbasi.',
        '<figure>\n  <blockquote class="blockquote"><p>…</p></blockquote>\n  <figcaption class="{{1}}">Muallif</figcaption>\n</figure>',
        ['blockquote-footer'],
      ),
      'BS5 da manba `<figcaption>` da.',
    ),
    why(
      tf('q4', 'BS5 da matnni o‘ngga tekislash klassi `.text-end`.', true),
      '`.text-start` — chapga (yozuv yo‘nalishi boshiga).',
    ),
  ]),
  colors: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Fon rangi va unga mos kontrastli matn bir klassda.',
        '<span class="badge {{1}}">Ogohlantirish</span>',
        ['text-bg-warning'],
      ),
      '`text-bg-*` matn rangini fonga avtomatik moslaydi.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.bg-success-subtle', 'Och yashil fon'],
        ['.bg-opacity-25', 'Fon 25% shaffof'],
        ['.link-danger', 'Qizil havola'],
        ['.bg-body-tertiary', 'Tema bo‘yicha och kulrang fon'],
      ]),
      '`-subtle` ranglar qorong‘i rejimga ham moslashadi.',
    ),
    why(
      tf('q3', 'Rang ma’noni yetkazishning yagona vositasi bo‘lmasligi kerak.', true),
      'Matn yoki ikonka ham qo‘shing.',
    ),
    why(
      q(
        'q4',
        'Havola tagchizig‘ini xira qilish?',
        ['.link-underline-opacity-25', '.text-decoration-light', '.underline-25', '.link-muted'],
        [0],
      ),
      'BS 5.3 havola utilitalari.',
    ),
  ]),
  tables: lessonQuiz([
    why(
      match('q1', 'Klassni natijasi bilan moslang.', [
        ['.table-group-divider', 'Guruhlar orasida qalinroq chiziq'],
        ['.caption-top', 'Jadval nomi tepada'],
        ['.align-middle', 'Kataklar vertikal markazda'],
        ['.border-primary', 'Ko‘k chegara'],
      ]),
      'Barchasi `.table` bilan birga.',
    ),
    why(
      codeFill('q2', 'Qorong‘i jadval.', '<table class="table {{1}}">', ['table-dark']),
      'Qator yoki katakka ham `table-success` kabi rang.',
    ),
    why(
      q(
        'q3',
        'Kichik ekranda jadval sahifani buzmasligi uchun?',
        ['<div class="table-responsive"> o‘rami', '.table-sm', '.table-fluid', 'width: 100vw'],
        [0],
      ),
      '`table-responsive-md` — faqat md dan torroqda.',
    ),
    why(
      tf('q4', 'BS5 da `thead-dark` o‘rniga `<thead class="table-dark">` ishlatiladi.', true),
      'Rang klasslari bitta tizimga keltirilgan.',
    ),
  ]),
  images: lessonQuiz([
    why(
      codeFill(
        'q1',
        '16:9 nisbatli o‘ram.',
        '<div class="ratio {{1}}">\n  <iframe src="…" title="Video"></iframe>\n</div>',
        ['ratio-16x9'],
      ),
      'BS4 dagi `.embed-responsive` o‘rniga.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.img-fluid', 'Moslashuvchan rasm'],
        ['.float-end', 'O‘ngga suzadi'],
        ['.object-fit-cover', 'Kesib to‘ldiradi'],
        ['.rounded-circle', 'Doira'],
      ]),
      'BS4 dagi `float-right` → `float-end`.',
    ),
    why(
      q(
        'q3',
        'Rasmni markazlash (BS5)?',
        ['.d-block .mx-auto', '.center-block', '.mx-center', '.float-center'],
        [0],
      ),
      'Blok element + gorizontal auto margin.',
    ),
    why(
      tf('q4', 'Bootstrap klassi bo‘lsa ham rasmga mazmunli `alt` kerak.', true),
      'Klass — ko‘rinish, `alt` — ma’no.',
    ),
  ]),

  // ---- 3. Xabarlar, tugmalar va belgilar -------------------------------------------
  alerts: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Yopish tugmasi (BS5).',
        '<div class="alert alert-warning alert-dismissible fade show">\n  Diqqat!\n  <button type="button" class="{{1}}" data-bs-dismiss="alert" aria-label="Yopish"></button>\n</div>',
        ['btn-close'],
      ),
      'BS4 dagi `.close` va `&times;` o‘rniga.',
    ),
    why(
      q(
        'q2',
        'Ikonkali alert uchun ichki tekislash?',
        ['.d-flex .align-items-center', '.alert-icon', '.media', '.float-start'],
        [0],
      ),
      'Ikonka va matn flex qatorda.',
    ),
    why(
      match('q3', 'Klassni vazifasi bilan moslang.', [
        ['.alert-heading', 'Sarlavha'],
        ['.alert-link', 'Alert rangiga mos havola'],
        ['.alert-dismissible', 'Yopish tugmasi uchun joy'],
      ]),
      '`fade show` — yopilishda animatsiya.',
    ),
    why(
      tf('q4', 'Faqat ikonkali yopish tugmasiga `aria-label` berish shart.', true),
      'Aks holda ekran o‘qiydigan dastur tugma nima ekanini aytolmaydi.',
    ),
  ]),
  buttons: lessonQuiz([
    why(
      tf('q1', 'Bootstrap 5 da `.btn-block` klassi bor.', false),
      'Olib tashlangan — o‘rniga `d-grid` o‘rami.',
    ),
    why(
      codeFill(
        'q2',
        'Tugma(lar) to‘liq kenglikda.',
        '<div class="{{1}} gap-2">\n  <button class="btn btn-primary">Kirish</button>\n</div>',
        ['d-grid'],
      ),
      '`d-md-flex` bilan katta ekranda yonma-yon qilish mumkin.',
    ),
    why(
      q(
        'q3',
        'Tugma rangini o‘z brendingizga moslashning BS5 usuli?',
        [
          'CSS o‘zgaruvchilari (--bs-btn-bg kabi)',
          'bootstrap.css ni tahrirlash',
          '!important bilan har xususiyatni yozish',
          'Inline style',
        ],
        [0],
      ),
      'Komponentlar CSS o‘zgaruvchilari bilan sozlanadi.',
    ),
    why(
      codeFill(
        'q4',
        'Almashtiriladigan tugma.',
        '<button class="btn btn-primary" data-bs-toggle="{{1}}">Kuzatish</button>',
        ['button'],
      ),
      'Bosilganda `active` qo‘shiladi va `aria-pressed` yangilanadi.',
    ),
  ]),
  'button-groups': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Radio’ni tugma ko‘rinishida (BS5).',
        '<input type="radio" class="{{1}}" name="daraja" id="d1">\n<label class="btn btn-outline-primary" for="d1">Boshlang‘ich</label>',
        ['btn-check'],
      ),
      'BS4 dagi `btn-group-toggle` + `data-toggle="buttons"` o‘rniga.',
    ),
    why(
      tf('q2', '`.btn-check` bilan input yashirin, yorliq esa tugmaga aylanadi.', true),
      'Klaviatura va forma qiymati saqlanadi.',
    ),
    why(
      match('q3', 'Klassni vazifasi bilan moslang.', [
        ['.btn-group', 'Tugmalar guruhi'],
        ['.btn-toolbar', 'Guruhlar qatori'],
        ['.btn-group-vertical', 'Ustma-ust guruh'],
      ]),
      'Guruhga `role="group"` va `aria-label`.',
    ),
    why(
      q(
        'q4',
        'Guruh ichidagi dropdown uchun?',
        [
          'Ichki .btn-group va data-bs-toggle="dropdown"',
          'data-toggle="dropdown"',
          '.dropdown-group',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'BS5 atributlari `bs-` prefiksli.',
    ),
  ]),
  badges: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tabletka shaklidagi yashil badge (BS5).',
        '<span class="badge {{1}} text-bg-success">Yangi</span>',
        ['rounded-pill'],
      ),
      'BS4: `badge-pill badge-success`.',
    ),
    why(
      sortInto('q2', 'Versiyalar.', {
        BS4: ['badge-primary', 'badge-pill'],
        BS5: ['text-bg-primary', 'rounded-pill'],
      }),
      'BS5 da badge rangi umumiy fon utilitalari bilan.',
    ),
    why(
      q(
        'q3',
        'Tugma burchagidagi bildirishnoma nuqtasi uchun tugmaga?',
        ['.position-relative', '.position-absolute', '.float-end', '.d-flex'],
        [0],
      ),
      'Badge esa `position-absolute top-0 start-100 translate-middle`.',
    ),
    why(
      tf(
        'q4',
        'Bildirishnoma nuqtasiga `.visually-hidden` matn (masalan, “Yangi xabarlar”) qo‘shish kerak.',
        true,
      ),
      'Nuqtaning ma’nosi ko‘rmaydigan foydalanuvchiga ham yetadi.',
    ),
  ]),
  'progress-bars': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Bir nechta qismli progress (BS 5.3).',
        '<div class="{{1}}">\n  <div class="progress" style="width: 30%">…</div>\n  <div class="progress" style="width: 20%">…</div>\n</div>',
        ['progress-stacked'],
      ),
      'Har qism alohida `.progress`, kengligi o‘ramda.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.progress-bar-striped', 'Chiziqli'],
        ['.progress-bar-animated', 'Harakatlanuvchi'],
        ['.text-bg-warning', 'Sariq fon va o‘qiladigan matn'],
      ]),
      'Rang `bg-*` yoki `text-bg-*` bilan.',
    ),
    why(
      tf(
        'q3',
        'BS 5.3 da `role="progressbar"` va `aria-value*` tashqi `.progress` elementiga beriladi.',
        true,
      ),
      'Ekran o‘qiydigan dastur qiymatni shundan o‘qiydi.',
    ),
    why(
      q(
        'q4',
        'Progress balandligini qanday o‘zgartirasiz?',
        ['.progress ga style="height: 8px"', '.progress-sm', '.h-8', 'font-size'],
        [0],
      ),
      'Ichki chiziq balandlikni o‘ramdan oladi.',
    ),
  ]),

  // ---- 4. Navigatsiya va kartalar -------------------------------------------------
  pagination: lessonQuiz([
    why(
      order('q1', 'Sahifalash tuzilmasini tartiblang.', [
        'nav[aria-label]',
        'ul.pagination',
        'li.page-item',
        'a.page-link',
      ]),
      '`nav` ekran o‘qiydigan dasturga navigatsiya ekanini bildiradi.',
    ),
    why(
      codeFill('q2', 'O‘ngga tekislang.', '<ul class="pagination {{1}}">', ['justify-content-end']),
      'Flex utilitalari ishlaydi.',
    ),
    why(
      q(
        'q3',
        'Sahifalash rangini o‘zgartirishning BS5 usuli?',
        [
          'CSS o‘zgaruvchilari (--bs-pagination-…)',
          'bootstrap.css ni tahrirlash',
          'Har havolaga style',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Komponent o‘zgaruvchilari bitta joydan boshqariladi.',
    ),
    why(
      tf('q4', 'Joriy sahifaga `active` va `aria-current="page"` beriladi.', true),
      'Ko‘rinish va ma’no birga.',
    ),
  ]),
  'list-groups': lessonQuiz([
    why(
      match('q1', 'Klassni natijasi bilan moslang.', [
        ['.list-group-numbered', 'Raqamlangan ro‘yxat'],
        ['.list-group-flush', 'Ramkasiz'],
        ['.list-group-item-action', 'Bosiladigan band'],
        ['.list-group-horizontal', 'Gorizontal'],
      ]),
      '`-numbered` BS5 da qo‘shilgan.',
    ),
    why(
      codeFill(
        'q2',
        'Ro‘yxat bandlari yorliqlardek panel almashtirsin.',
        '<a class="list-group-item list-group-item-action" data-bs-toggle="{{1}}" href="#p1">',
        ['list'],
      ),
      'Mazmun `.tab-content` ichida.',
    ),
    why(
      q(
        'q3',
        'Checkbox’li bandda yorliqni butun bandga bog‘lash uchun?',
        ['label ichiga input va matn yoki for/id', 'onclick', 'title', 'data-check'],
        [0],
      ),
      'Bandning istalgan joyini bosish checkboxni belgilaydi.',
    ),
    why(
      tf('q4', 'Faol bandni `active` bilan ajratish va `aria-current` berish mumkin.', true),
      'Rangni ko‘rmaydiganlar uchun.',
    ),
  ]),
  cards: lessonQuiz([
    why(
      q(
        'q1',
        'Butun kartani bosiladigan qilish (BS5)?',
        [
          'Havolaga .stretched-link',
          'Kartaga onclick',
          'Kartani <a> ichiga o‘rash har doim',
          '.card-link-all',
        ],
        [0],
      ),
      'Havolaning bosish maydoni ota kartagacha cho‘ziladi.',
    ),
    why(
      codeFill(
        'q2',
        'Kartalar orasidagi bo‘shliq (BS5).',
        '<div class="row row-cols-1 row-cols-md-3 {{1}}">',
        ['g-4'],
      ),
      '`g-*` — gutter (gorizontal va vertikal).',
    ),
    why(
      q(
        'q3',
        'Yuklanayotgan kartaning kulrang “skelet” matni?',
        ['.placeholder (+ .placeholder-glow)', '.skeleton', '.loading-text', '.spinner-border'],
        [0],
      ),
      'Ma’lumot kelguncha shakl ko‘rinib turadi.',
    ),
    why(
      tf(
        'q4',
        'Gorizontal kartada rasm va matn setka (`row g-0`) bilan yonma-yon qo‘yiladi.',
        true,
      ),
      'Masalan, `col-md-4` rasm, `col-md-8` matn.',
    ),
  ]),
  dropdowns: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Dropdown tugmasi (BS5).',
        '<button class="btn btn-secondary dropdown-toggle" data-bs-toggle="{{1}}">Menyu</button>',
        ['dropdown'],
      ),
      'Menyu `.dropdown-menu`, bandlar `.dropdown-item`.',
    ),
    why(
      match('q2', 'Klassni yo‘nalishi bilan moslang.', [
        ['.dropup', 'Yuqoriga'],
        ['.dropend', 'O‘ngga (yozuv oxiriga)'],
        ['.dropstart', 'Chapga (yozuv boshiga)'],
      ]),
      'BS4 dagi `dropright`/`dropleft` o‘rniga.',
    ),
    why(
      q(
        'q3',
        'Menyu ichida forma bo‘lsa, ichkariga bosilganda yopilmasligi uchun?',
        [
          'data-bs-auto-close="outside"',
          'data-bs-close="false"',
          'tabindex="-1"',
          '.dropdown-static',
        ],
        [0],
      ),
      '`outside` — faqat tashqariga bosilganda yopiladi.',
    ),
    why(
      tf('q4', 'Qorong‘i menyu uchun `data-bs-theme="dark"` ishlatish mumkin.', true),
      'BS 5.3 da `.dropdown-menu-dark` o‘rniga tavsiya etiladi.',
    ),
  ]),
  collapse: lessonQuiz([
    why(
      order('q1', 'Accordion tuzilmasini tashqaridan ichkariga tartiblang.', [
        '.accordion',
        '.accordion-item',
        '.accordion-header > .accordion-button',
        '.accordion-collapse > .accordion-body',
      ]),
      'Har bo‘lim — sarlavha tugmasi va yig‘iladigan tana.',
    ),
    why(
      codeFill(
        'q2',
        'Bittasi ochilganda boshqalari yopilsin.',
        '<div class="accordion-collapse collapse" data-bs-parent="{{1}}">',
        ['#faq'],
      ),
      'Accordion o‘ramining `id` si.',
    ),
    why(
      q(
        'q3',
        'Kenglik bo‘yicha ochiladigan collapse?',
        ['.collapse-horizontal', '.collapse-width', '.slide-x', 'Imkoni yo‘q'],
        [0],
      ),
      'Ichki elementga kenglik beriladi.',
    ),
    why(
      tf('q4', 'Accordion BS5 da alohida tayyor komponent sifatida mavjud.', true),
      'BS4 da u card’lar bilan qurilardi.',
    ),
  ]),
  navs: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Yorliqni panelga bog‘lang (BS5).',
        '<button class="nav-link active" data-bs-toggle="tab" data-bs-target="{{1}}">Tavsif</button>',
        ['#tavsif'],
      ),
      'Yorliq `<button>` bo‘lishi mumkin.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.nav-tabs', 'Yorliqlar'],
        ['.nav-pills', 'Tabletka tugmalar'],
        ['.nav-underline', 'Tagiga chizilgan (BS 5.3)'],
        ['.flex-column', 'Vertikal'],
      ]),
      '`.nav-fill`/`.nav-justified` — to‘liq kenglik.',
    ),
    why(
      q(
        'q3',
        'Vertikal pills chapda, mazmun o‘ngda — o‘ram?',
        ['.d-flex .align-items-start', '.row-cols-2', '.float-start', '.nav-vertical'],
        [0],
      ),
      'Pills `flex-column`, mazmun `.tab-content`.',
    ),
    why(
      tf(
        'q4',
        'Yorliqlarni JavaScript bilan `bootstrap.Tab.getOrCreateInstance(el).show()` orqali ochish mumkin.',
        true,
      ),
      'jQuery kerak emas.',
    ),
  ]),

  // ---- 5. JavaScript komponentlari --------------------------------------------------
  carousel: lessonQuiz([
    why(
      match('q1', '`data-bs-ride` qiymatini xatti-harakati bilan moslang.', [
        ['carousel', 'Sahifa ochilishi bilan aylanadi'],
        ['true', 'Foydalanuvchi birinchi marta bosgandan keyin aylanadi'],
        ['(yozilmasa)', 'Avtomatik aylanmaydi'],
      ]),
      'Interval `data-bs-interval` bilan.',
    ),
    why(
      codeFill(
        'q2',
        'Keyingi slayd tugmasi.',
        '<button class="carousel-control-next" data-bs-target="#slayder" data-bs-slide="{{1}}">',
        ['next'],
      ),
      'Oldingisi — `prev`.',
    ),
    why(
      q(
        'q3',
        'Qorong‘i boshqaruv tugmalari va indikatorlar uchun (BS 5.3)?',
        ['data-bs-theme="dark"', '.carousel-dark har doim', '.btn-dark', '.bg-dark'],
        [0],
      ),
      'Och rasmlar ustida ko‘rinishi uchun.',
    ),
    why(
      tf(
        'q4',
        'Avtomatik aylanadigan karuselni to‘xtatish imkoni bo‘lishi foydalanish qulayligi uchun muhim.',
        true,
      ),
      'Foydalanuvchi o‘qib ulgurishi kerak.',
    ),
  ]),
  modal: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Modalni ochadigan tugma (BS5).',
        '<button data-bs-toggle="modal" data-bs-target="{{1}}">Ochish</button>',
        ['#oyna'],
      ),
      'Yopish — `data-bs-dismiss="modal"`.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.modal-dialog-centered', 'Vertikal markazda'],
        ['.modal-dialog-scrollable', 'Uzun kontent ichida aylantiriladi'],
        ['.modal-fullscreen', 'To‘liq ekran'],
        ['.modal-lg', 'Katta'],
      ]),
      'O‘lcham klasslari `.modal-dialog` ga beriladi.',
    ),
    why(
      q(
        'q3',
        'Fon bosilganda va Esc da yopilmasin.',
        [
          'data-bs-backdrop="static" data-bs-keyboard="false"',
          'data-bs-close="none"',
          '.modal-static',
          'tabindex="0"',
        ],
        [0],
      ),
      'Muhim tasdiqlash oynalari uchun.',
    ),
    why(
      tf(
        'q4',
        'Bitta modaldan ikkinchisiga o‘tish uchun ikkinchi modalni ochuvchi tugmaga `data-bs-target` beriladi va birinchisi yopiladi.',
        true,
      ),
      'Ikkita modal ketma-ket ochiladi, bir vaqtda emas.',
    ),
  ]),
  tooltip: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Barcha tooltiplarni yoqing (jQuery’siz).',
        'document.querySelectorAll(\'[data-bs-toggle="tooltip"]\').forEach((el) => new bootstrap.{{1}}(el));',
        ['Tooltip'],
      ),
      'BS5 plaginlari — oddiy JS klasslar.',
    ),
    why(
      q(
        'q2',
        'Tooltip matni qaysi atributda (BS5)?',
        ['data-bs-title (yoki title)', 'data-content', 'alt', 'aria-hidden'],
        [0],
      ),
      'Joylashuv — `data-bs-placement`.',
    ),
    why(
      tf(
        'q3',
        '`data-bs-html="true"` bilan foydalanuvchi matnini tooltipga qo‘yish xavfsiz.',
        false,
      ),
      'HTML sifatida chiqarilgan begona matn XSS ga olib keladi.',
    ),
    why(
      q(
        'q4',
        'Rangli tooltip uchun?',
        [
          'data-bs-custom-class bilan o‘z klassingiz',
          '.tooltip-danger',
          'style="color: red" tugmaga',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Klassni CSS o‘zgaruvchilari bilan bezaysiz.',
    ),
  ]),
  popover: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Boshqa joyga bosilganda yopilsin.',
        '<a tabindex="0" data-bs-toggle="popover" data-bs-trigger="{{1}}" data-bs-content="…">Izoh</a>',
        ['focus'],
      ),
      '`tabindex="0"` havolani fokuslanadigan qiladi.',
    ),
    why(
      q(
        'q2',
        'Popover ota elementning `overflow: hidden` i ichida kesilib qolmasligi uchun?',
        ["container: 'body' sozlamasi", 'z-index: 0', '.popover-fluid', 'Imkoni yo‘q'],
        [0],
      ),
      'Popover `body` ga joylanadi.',
    ),
    why(
      tf('q3', 'Popover ham tooltip kabi JS bilan yoqiladi: `new bootstrap.Popover(el)`.', true),
      'U o‘zi yoqilmaydi.',
    ),
    why(
      sortInto('q4', 'Tooltip yoki popover?', {
        Tooltip: ['Ikonka tugmasidagi qisqa nom'],
        Popover: ['Sarlavhali tushuntirish', 'Bosish bilan ochiladigan izoh'],
      }),
      'Uzun kontent uchun esa modal.',
    ),
  ]),
  toast: lessonQuiz([
    why(
      codeFill('q1', 'Toastni ko‘rsating.', 'bootstrap.Toast.{{1}}(xabar).show();', [
        'getOrCreateInstance',
      ]),
      'Toast o‘zi ko‘rinmaydi — JS bilan ko‘rsatiladi.',
    ),
    why(
      q(
        'q2',
        'Toastlarni o‘ng pastki burchakka joylash?',
        ['position-fixed bottom-0 end-0 p-3', 'float-end', 'fixed-bottom', 'ms-auto'],
        [0],
      ),
      'Bir nechta toast uchun `.toast-container`.',
    ),
    why(
      match('q3', 'Atributni vazifasi bilan moslang.', [
        ['data-bs-delay="5000"', '5 soniyadan keyin yopiladi'],
        ['data-bs-autohide="false"', 'O‘zi yopilmaydi'],
        ['data-bs-dismiss="toast"', 'Yopish tugmasi'],
      ]),
      'Rangli toast: `text-bg-success`.',
    ),
    why(
      tf(
        'q4',
        'Toastga `role="status"` va `aria-live` berish e’lon qilinishini ta’minlaydi.',
        true,
      ),
      'Muhim xato uchun `role="alert"`.',
    ),
  ]),
  scrollspy: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Body’ni kuzatuvchi qiling (BS5).',
        '<body data-bs-spy="{{1}}" data-bs-target="#mundarija">',
        ['scroll'],
      ),
      'Menyu havolalari `#bolim` ko‘rinishida.',
    ),
    why(
      q(
        'q2',
        'Havola bosilganda bo‘limga silliq aylantirish?',
        ['data-bs-smooth-scroll="true"', 'data-bs-animate', 'scroll-behavior: fast', '.smooth'],
        [0],
      ),
      'Yoki CSS’da `scroll-behavior: smooth`.',
    ),
    why(
      tf(
        'q3',
        'Ichki aylantiriladigan blokda scrollspy uchun blokka balandlik va `overflow-y: scroll` kerak.',
        true,
      ),
      'Aks holda blok aylanmaydi va kuzatish ishlamaydi.',
    ),
    why(
      q(
        'q4',
        'Dinamik qo‘shilgan bo‘limlardan keyin scrollspy’ni yangilash?',
        [
          'bootstrap.ScrollSpy.getInstance(el).refresh()',
          'location.reload()',
          'data-bs-update',
          'Hech narsa',
        ],
        [0],
      ),
      'Bo‘limlar joylashuvi qayta o‘lchanadi.',
    ),
  ]),

  // ---- 6. Utilitalar, qorong‘i rejim va Flex ----------------------------------------
  utilities: lessonQuiz([
    why(
      match('q1', 'BS4 klassini BS5 dagisi bilan moslang.', [
        ['.ml-3', '.ms-3'],
        ['.text-right', '.text-end'],
        ['.font-weight-bold', '.fw-bold'],
        ['.sr-only', '.visually-hidden'],
        ['.no-gutters', '.g-0'],
      ]),
      'start/end yozuv yo‘nalishiga moslashadi.',
    ),
    why(
      codeFill('q2', 'Flex elementlar orasida 0.5rem bo‘shliq.', '<div class="d-flex {{1}}">', [
        'gap-2',
      ]),
      '`gap` — BS5 utilitasi.',
    ),
    why(
      q(
        'q3',
        'Chegara yarim shaffof bo‘lsin.',
        ['.border-opacity-50', '.border-50', '.opacity-50 (butun element)', '.border-light'],
        [0],
      ),
      '`.opacity-50` butun elementni shaffof qiladi.',
    ),
    why(
      tf('q4', '`d-none d-md-block` — telefonda yashirin, md dan ko‘rinadi.', true),
      'Display utilitalari ekran sinflari bilan.',
    ),
  ]),
  'dark-mode': lessonQuiz([
    why(
      codeFill('q1', 'Butun sahifani qorong‘i qiling.', '<html lang="uz" data-bs-theme="{{1}}">', [
        'dark',
      ]),
      'Komponentlar CSS o‘zgaruvchilari orqali moslashadi.',
    ),
    why(
      q(
        'q2',
        'Tizim sozlamasiga qarab rejim tanlash uchun JS nimani tekshiradi?',
        [
          "matchMedia('(prefers-color-scheme: dark)')",
          'navigator.dark',
          'screen.theme',
          'document.mode',
        ],
        [0],
      ),
      'Natija `.matches` true bo‘lsa — qorong‘i.',
    ),
    why(
      tf(
        'q3',
        'Qorong‘i rejimda ham ishlashi uchun qat’iy `bg-white`/`text-dark` o‘rniga `bg-body`/`text-body` ishlatgan ma’qul.',
        true,
      ),
      'Tema o‘zgaruvchilari rejimga qarab almashadi.',
    ),
    why(
      q(
        'q4',
        'Foydalanuvchi tanlagan rejimni sahifalar orasida eslab qolish?',
        ['localStorage’da saqlash', 'Cookie shart', 'URL’da', 'Imkoni yo‘q'],
        [0],
      ),
      'Sahifa ochilishi bilan saqlangan qiymat qo‘llanadi.',
    ),
  ]),
  flex: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Oxirgi elementni o‘ngga suring (BS5).',
        '<button class="btn btn-primary {{1}}">Chiqish</button>',
        ['ms-auto'],
      ),
      'BS4: `ml-auto`.',
    ),
    why(
      match('q2', 'Utilitani vazifasi bilan moslang.', [
        ['flex-grow-1', 'Bo‘sh joyni egallaydi'],
        ['flex-shrink-0', 'Siqilmaydi'],
        ['justify-content-between', 'Chetlarga taqsimlaydi'],
        ['align-items-center', 'Vertikal markaz'],
      ]),
      'Media object o‘rnida ham shu utilitalar ishlatiladi.',
    ),
    why(
      q(
        'q3',
        'BS5 da `.media` o‘rniga nima ishlatiladi?',
        ['.d-flex + .flex-shrink-0 + .flex-grow-1', '.media-v5', '.card-media', '.row-media'],
        [0],
      ),
      'Rasm siqilmaydi, matn qolgan joyni oladi.',
    ),
    why(
      tf('q4', '`order-*` faqat vizual tartibni o‘zgartiradi.', true),
      'Klaviatura HTML tartibida yuradi.',
    ),
  ]),

  // ---- 7. Formalar ----------------------------------------------------------------
  forms: lessonQuiz([
    why(
      tf('q1', 'Bootstrap 5 da `.form-group` va `.form-row` klasslari yo‘q.', true),
      'O‘rniga `mb-3` kabi utilitalar va setka (`row g-3`).',
    ),
    why(
      codeFill('q2', 'Yorliq klassi (BS5).', '<label for="email" class="{{1}}">Email</label>', [
        'form-label',
      ]),
      'Gorizontal formada `.col-form-label`.',
    ),
    why(
      match('q3', 'Klassni vazifasi bilan moslang.', [
        ['.form-control-lg', 'Katta maydon'],
        ['.form-control-color', 'Rang tanlagich'],
        ['.form-control-plaintext', 'Oddiy matn ko‘rinishi'],
        ['.form-text', 'Yordamchi matn'],
      ]),
      'Fayl maydoni ham `.form-control`.',
    ),
    why(
      q(
        'q4',
        'Qatorli forma qanday quriladi (BS5)?',
        [
          '.row .row-cols-lg-auto .g-3 .align-items-center',
          '.form-inline',
          '.form-row',
          '.d-inline-form',
        ],
        [0],
      ),
      'BS4 dagi `.form-inline` olib tashlangan.',
    ),
  ]),
  select: lessonQuiz([
    why(
      codeFill('q1', 'Select’ni bezang (BS5).', '<select class="{{1}}" id="viloyat">', [
        'form-select',
      ]),
      '`.form-control` emas — selectning o‘z klassi.',
    ),
    why(
      q(
        'q2',
        'Bir nechtasini tanlash va 4 ta qatorni ko‘rsatish?',
        ['multiple size="4"', 'multi="4"', '.form-select-4', 'rows="4"'],
        [0],
      ),
      'HTML atributlari.',
    ),
    why(
      codeFill(
        'q3',
        'Tanlangan qiymatni o‘qing.',
        "const v = document.getElementById('viloyat').{{1}};",
        ['value'],
      ),
      '`multiple` bo‘lsa — `selectedOptions`.',
    ),
    why(
      tf(
        'q4',
        'Select’ga ham `<label>` kerak; birinchi “Tanlang…” varianti yorliq o‘rnini bosmaydi.',
        true,
      ),
      'Ekran o‘qiydigan dastur maydon nomini o‘qiydi.',
    ),
  ]),
  'checks-radios': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Checkboxni kalit (switch) ko‘rinishida.',
        '<div class="form-check {{1}}">\n  <input class="form-check-input" type="checkbox" role="switch" id="s1">\n</div>',
        ['form-switch'],
      ),
      'Bu baribir checkbox — qiymati true/false.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.form-check-inline', 'Bir qatorda'],
        ['.form-check-reverse', 'Belgi o‘ng tomonda'],
        ['.btn-check', 'Tugma ko‘rinishida'],
      ]),
      'Tuzilma: `.form-check` > `.form-check-input` + `.form-check-label`.',
    ),
    why(
      q(
        'q3',
        'Radio guruhiga sarlavha?',
        ['<fieldset> va <legend>', '<div title>', '<h6> faqat', 'placeholder'],
        [0],
      ),
      'Ekran o‘qiydigan dastur guruh nomini aytadi.',
    ),
    why(
      tf('q4', 'Bir guruhdagi radio’larning `name` atributi bir xil bo‘lishi kerak.', true),
      'Faqat bittasi tanlanadi.',
    ),
  ]),
  range: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Diapazonni bezang.',
        '<input type="range" class="{{1}}" min="0" max="10" step="1">',
        ['form-range'],
      ),
      'Chegaralar va qadam HTML atributlari bilan.',
    ),
    why(
      q(
        'q2',
        'Surgich qiymatini ekranda jonli ko‘rsatish uchun qaysi hodisa?',
        ['input', 'change (faqat qo‘yib yuborilganda)', 'click', 'submit'],
        [0],
      ),
      '`input` har harakatda ishlaydi.',
    ),
    why(
      tf('q3', 'Range klaviatura strelkalari bilan ham boshqariladi.', true),
      'Brauzerning o‘z elementi — qulaylik saqlanadi.',
    ),
    why(
      q(
        'q4',
        'Surgich rangini o‘zgartirish?',
        [
          'accent-color yoki CSS o‘zgaruvchilari',
          '.range-red',
          'bg-danger har doim',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      '`accent-color` brauzer elementini bo‘yaydi.',
    ),
  ]),
  'input-groups': lessonQuiz([
    why(
      tf(
        'q1',
        'Bootstrap 5 da `.input-group-prepend` / `.input-group-append` o‘ramlari kerak emas.',
        true,
      ),
      '`.input-group-text` va tugmalar to‘g‘ridan-to‘g‘ri guruh ichida.',
    ),
    why(
      codeFill(
        'q2',
        'Maydon oldiga “@”.',
        '<div class="input-group">\n  <span class="{{1}}">@</span>\n  <input class="form-control">\n</div>',
        ['input-group-text'],
      ),
      'Ikonka ham `.input-group-text` ichida bo‘lishi mumkin.',
    ),
    why(
      q(
        'q3',
        'Guruh tor ekranda qatorga bo‘linib ketmasligi uchun?',
        ['.flex-nowrap', '.text-nowrap', '.no-wrap', '.d-inline'],
        [0],
      ),
      'Input group — flex konteyner.',
    ),
    why(
      q(
        'q4',
        'Butun guruhni kichraytirish?',
        ['.input-group-sm — guruhga', '.form-control-sm — faqat maydonga', '.btn-sm', 'font-size'],
        [0],
      ),
      'O‘lcham guruhga beriladi.',
    ),
  ]),
  'floating-labels': lessonQuiz([
    why(
      order('q1', 'Suzuvchi yorliq tuzilmasini tartiblang.', [
        '.form-floating',
        'input.form-control (placeholder bilan)',
        'label',
      ]),
      'Input birinchi, label keyin — `input ~ label` selektori shunga tayanadi.',
    ),
    why(
      tf('q2', 'Suzuvchi yorliq uchun inputda `placeholder` bo‘lishi shart.', true),
      'Bootstrap `:placeholder-shown` holatiga qarab yorliqni joylashtiradi.',
    ),
    why(
      q(
        'q3',
        'Suzuvchi yorliq qaysi elementlar bilan ishlaydi?',
        ['input, textarea va select', 'Faqat input', 'Faqat checkbox', 'button'],
        [0],
      ),
      'Textarea uchun balandlikni `style` bilan bering.',
    ),
    why(
      q(
        'q4',
        'Suzuvchi yorliqning foydasi?',
        [
          'Yorliq doim ko‘rinadi va joy tejaladi',
          'Maydon yuborilmaydi',
          'Tekshiruv shart emas',
          'Shrift kattalashadi',
        ],
        [0],
      ),
      'Placeholder’dan farqli, yozganda yorliq yo‘qolmaydi.',
    ),
  ]),

  // ---- 8. Setka tizimi ----------------------------------------------------------------
  'grid-system': lessonQuiz([
    why(
      q(
        'q1',
        'BS5 da nechta ekran sinfi bor?',
        ['6 ta (xs, sm, md, lg, xl, xxl)', '5 ta', '4 ta', '3 ta'],
        [0],
      ),
      'xxl ≥ 1400px — yangi.',
    ),
    why(
      match('q2', 'Gutter klassini vazifasi bilan moslang.', [
        ['g-0', 'Bo‘shliqsiz'],
        ['gx-5', 'Faqat gorizontal bo‘shliq katta'],
        ['gy-3', 'Faqat vertikal bo‘shliq'],
      ]),
      'BS4 dagi `no-gutters` → `g-0`.',
    ),
    why(
      codeFill('q3', 'Ustunni 3 ga surish.', '<div class="col-md-6 {{1}}">', ['offset-md-3']),
      'Yoki `ms-auto` bilan o‘ng chetga.',
    ),
    why(tf('q4', 'BS5 setkasi ham 12 ustunli.', true), 'Tajribaviy CSS Grid varianti ham bor.'),
  ]),
  'grid-stacked': lessonQuiz([
    why(
      q(
        'q1',
        '`col-sm-6` ikki ustun 500px ekranda?',
        ['Ustma-ust, har biri 100%', 'Yonma-yon', 'Yashirin', 'Chorak'],
        [0],
      ),
      'sm 576px dan boshlanadi.',
    ),
    why(
      codeFill(
        'q2',
        'Ustma-ust tushgan ustunlar orasida vertikal bo‘shliq.',
        '<div class="row {{1}}">',
        ['gy-3'],
      ),
      'BS5 gutter utilitalari vertikal oraliqni ham beradi.',
    ),
    why(
      tf(
        'q3',
        'Telefonda ustunlarning 100% bo‘lishi sinfning faqat o‘z kengligidan boshlab ishlashi bilan bog‘liq.',
        true,
      ),
      'Undan torroqda ustun standart 100%.',
    ),
    why(
      q(
        'q4',
        'Ikkala ustun telefonda ham yonma-yon bo‘lishi uchun?',
        ['col-6', 'col-sm-6', 'col-md-6', 'col-auto-sm'],
        [0],
      ),
      'Prefikssiz sinf eng kichik ekrandan ishlaydi.',
    ),
  ]),
  'grid-xsmall': lessonQuiz([
    why(
      codeFill('q1', 'Har qatorda 3 ta ustun.', '<div class="row {{1}} g-2">', ['row-cols-3']),
      'Ichidagi ustunlar `.col`.',
    ),
    why(
      q(
        'q2',
        '`.col-auto` nima beradi?',
        ['Kontent kengligidagi ustun', 'Teng ustun', '100%', 'Yashirin ustun'],
        [0],
      ),
      'Masalan, tugma yoki logo uchun.',
    ),
    why(
      tf('q3', 'Telefonda juda ko‘p ustun (masalan, 6 ta) o‘qishni qiyinlashtiradi.', true),
      'Telefonda 1–2 ustun yetarli.',
    ),
    why(
      q(
        'q4',
        'Uchta `.col` qatorda qanday taqsimlanadi?',
        ['Teng', 'Birinchisi kattaroq', 'Har biri 100%', 'Kontentga qarab'],
        [0],
      ),
      '`.col` — avtomatik teng.',
    ),
  ]),
  'grid-small': lessonQuiz([
    why(
      codeFill('q1', 'Telefonda 2, sm dan 4 ta ustun.', '<div class="row row-cols-2 {{1}}">', [
        'row-cols-sm-4',
      ]),
      '`row-cols` bilan qisqaroq.',
    ),
    why(
      q(
        'q2',
        'sm dan boshlab bu ustun oxirida chiqsin.',
        ['.order-sm-last', '.order-last-sm', '.sm-order-end', '.float-sm-end'],
        [0],
      ),
      'Tartib ham sinfga bog‘liq.',
    ),
    why(
      match('q3', 'Klassni natijasi bilan moslang.', [
        ['d-none d-sm-block', 'Telefonda yashirin, sm dan ko‘rinadi'],
        ['d-sm-none', 'sm dan boshlab yashirin'],
      ]),
      'Display va setka birga ishlatiladi.',
    ),
    why(
      tf('q4', '`offset-sm-2` telefonda (< 576px) ta’sir qilmaydi.', true),
      'Offset sm dan boshlab ishlaydi.',
    ),
  ]),
  'grid-medium': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Planshetdan yon panel (3) va asosiy (9).',
        '<div class="col-md-3">Yon</div>\n<div class="{{1}}">Asosiy</div>',
        ['col-md-9'],
      ),
      '3 + 9 = 12.',
    ),
    why(
      q(
        'q2',
        'Yon panel telefonda yashirin.',
        ['d-none d-md-block', 'd-md-none', 'hidden-xs', 'visually-hidden'],
        [0],
      ),
      '`visually-hidden` faqat ko‘zdan yashiradi.',
    ),
    why(
      tf(
        'q3',
        'Planshetda navbar ham yig‘ilgan bo‘lishi mumkin, shuning uchun maketni navbar tanaffus nuqtasi bilan birga rejalashtiring.',
        true,
      ),
      'Masalan, `navbar-expand-lg`.',
    ),
    why(
      q(
        'q4',
        'Ekranlarni sinashning eng qulay usuli?',
        [
          'DevTools qurilma rejimi va oyna kengligini o‘zgartirish',
          'Faqat telefonda',
          'Chop etish',
          'Kodni o‘qish',
        ],
        [0],
      ),
      'Har tanaffus nuqtasini tekshiring.',
    ),
  ]),
  'grid-large': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Yon panel lg dan yuqorida yopishib tursin.',
        '<aside class="col-lg-3 {{1}}">',
        ['sticky-lg-top'],
      ),
      'Kichik ekranda oddiy oqimda.',
    ),
    why(
      q(
        'q2',
        'O‘qish uchun qulay markaziy ustun?',
        [
          '.row .justify-content-center + .col-lg-8',
          '.col-12 har doim',
          '.container-fluid',
          '.col-lg-12',
        ],
        [0],
      ),
      'Juda uzun qatorlarni o‘qish qiyin.',
    ),
    why(
      tf('q3', 'Faqat `col-lg-*` yozilgan ustunlar lg dan torroqda ustma-ust turadi.', true),
      'lg 992px dan.',
    ),
    why(
      q(
        'q4',
        'lg qaysi kenglikdan boshlanadi?',
        ['≥ 992px', '≥ 1200px', '≥ 768px', '≥ 1400px'],
        [0],
      ),
      'xl — 1200, xxl — 1400.',
    ),
  ]),
  'grid-xlarge': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Dashboard: xl da yon menyu 2, kontent 10.',
        '<div class="col-xl-2">Menyu</div>\n<div class="{{1}}">Kontent</div>',
        ['col-xl-10'],
      ),
      'Katta ekranda menyu torroq bo‘lishi mumkin.',
    ),
    why(
      q(
        'q2',
        'Kontent xl dan kengaymasligi uchun konteyner?',
        ['.container-xl yoki .container', '.container-fluid', 'width: 100vw', '.row'],
        [0],
      ),
      'Juda keng ekranda chegaralash.',
    ),
    why(
      tf('q3', '`row-cols-xl-4` xl ekranda har qatorga 4 ta ustun qo‘yadi.', true),
      'Statistika kartalari uchun qulay.',
    ),
    why(
      q('q4', 'xl qaysi kenglikdan?', ['≥ 1200px', '≥ 1400px', '≥ 992px', '≥ 1600px'], [0]),
      'BS4 bilan bir xil.',
    ),
  ]),
  'grid-xxl': lessonQuiz([
    why(
      q(
        'q1',
        'xxl sinfi qaysi kenglikdan boshlanadi?',
        ['≥ 1400px', '≥ 1200px', '≥ 1600px', '≥ 1920px'],
        [0],
      ),
      'Faqat Bootstrap 5 da.',
    ),
    why(
      sortInto('q2', '`xxl` bilan ishlaydigan klasslar?', {
        Bor: ['container-xxl', 'navbar-expand-xxl', 'd-xxl-block', 'text-xxl-center'],
        "Yo'q": ['col-xxxl-1'],
      }),
      'Ko‘p utilitalar xxl variantiga ega.',
    ),
    why(
      codeFill('q3', 'Juda katta ekranda 6 ta ustun.', '<div class="row {{1}}">', [
        'row-cols-xxl-6',
      ]),
      'Kichikroq ekranlar uchun boshqa `row-cols` lar.',
    ),
    why(
      tf('q4', 'Ko‘pchilik saytlar uchun xxl sinfini albatta ishlatish kerak.', false),
      'Faqat juda keng ekranda maket o‘zgarishi kerak bo‘lsa.',
    ),
  ]),
};
