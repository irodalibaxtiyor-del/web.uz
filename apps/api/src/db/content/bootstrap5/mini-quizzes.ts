import { codeFill, match, miniQuiz, order, q, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the Bootstrap 5 course: three self-check questions per exercise. */
export const BS5_MINI_QUIZZES: Record<string, QuizDef> = {
  'get-started': miniQuiz([
    why(
      tf('q1', 'Bootstrap 5 uchun jQuery ulash shart emas.', true),
      'Plaginlar oddiy JavaScript’da yozilgan.',
    ),
    why(
      q(
        'q2',
        'Bitta JS fayl?',
        ['bootstrap.bundle.min.js', 'jquery.min.js', 'popper.js', 'bootstrap.css'],
        [0],
      ),
      'Ichida Popper ham bor.',
    ),
    why(
      tf('q3', 'CSS havolasi `<head>` da, JS esa `</body>` dan oldin (yoki `defer` bilan).', true),
      'Odatiy joylashuv.',
    ),
  ]),
  containers: miniQuiz([
    why(
      codeFill(
        'q1',
        'To‘liq kenglikdagi blok.',
        '<div id="banner" class="{{1}} p-5 my-3 bg-dark text-white">',
        ['container-fluid'],
      ),
      'Ekran bo‘ylab.',
    ),
    why(
      q(
        'q2',
        'BS5 dagi eng katta konteyner sinfi?',
        ['container-xxl', 'container-xl har doim', 'container-max', 'container-2xl'],
        [0],
      ),
      'xxl ≥ 1400px.',
    ),
    why(tf('q3', '`my-3` — yuqori va pastki margin.', true), 'y — vertikal o‘q.'),
  ]),
  'grid-basic': miniQuiz([
    why(
      codeFill('q1', 'Ustunlar orasida bo‘shliq.', '<div id="kurslar" class="row {{1}}">', ['g-3']),
      'Gutter — ikki o‘qda.',
    ),
    why(
      q(
        'q2',
        'Uchta teng avtomatik ustun?',
        ['col, col, col', 'col-4 shart', 'col-auto', 'row-cols-4'],
        [0],
      ),
      '`.col` teng taqsimlanadi.',
    ),
    why(
      tf('q3', '`gx-*` faqat gorizontal, `gy-*` faqat vertikal bo‘shliq.', true),
      'BS5 gutter utilitalari.',
    ),
  ]),
  typography: miniQuiz([
    why(
      codeFill('q1', 'Qalin display sarlavha.', '<h1 id="sarlavha" class="display-5 {{1}}">', [
        'fw-bold',
      ]),
      'BS4 dagi font-weight-bold.',
    ),
    why(
      q(
        'q2',
        'Ikkilamchi matn rangi (BS 5.3)?',
        ['text-body-secondary', 'text-muted-2', 'text-secondary-light', 'text-gray'],
        [0],
      ),
      'Rang rejimiga moslashadi.',
    ),
    why(tf('q3', 'BS5 da display sarlavhalar 1 dan 6 gacha.', true), 'BS4 da 4 ta edi.'),
  ]),
  colors: miniQuiz([
    why(
      codeFill('q1', 'Sariq fon va mos matn bitta klassda.', '<p id="diqqat" class="{{1}} p-2">', [
        'text-bg-warning',
      ]),
      'Kontrastli matn avtomatik.',
    ),
    why(
      q('q2', 'Yashil matn?', ['text-success', 'text-green', 'color-success', 'fg-success'], [0]),
      'Ma’noli rang.',
    ),
    why(
      tf('q3', '`text-bg-*` ham fonni, ham matn rangini beradi.', true),
      'BS 5.2+ dagi qulaylik.',
    ),
  ]),
  tables: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kataklar vertikal markazda.',
        '<table class="table table-striped table-hover {{1}}">',
        ['align-middle'],
      ),
      'Vertikal tekislash.',
    ),
    why(
      q(
        'q2',
        'Qorong‘i sarlavha qatori (BS5)?',
        [
          '<thead class="table-dark">',
          '<thead class="thead-dark">',
          '<thead class="dark">',
          '<thead class="bg-dark-row">',
        ],
        [0],
      ),
      'BS4 dagi thead-dark o‘rniga.',
    ),
    why(
      tf('q3', '`table-group-divider` guruhlar orasida qalinroq chiziq chizadi.', true),
      'thead va tbody orasida.',
    ),
  ]),
  images: miniQuiz([
    why(
      codeFill(
        'q1',
        'Avatar o‘ngda, matn oqib o‘tsin.',
        '<img id="avatar" class="rounded-circle {{1}} ms-3" src="…" alt="…">',
        ['float-end'],
      ),
      'BS4 dagi float-right.',
    ),
    why(
      q('q2', 'Chap margin (BS5)?', ['ms-3', 'ml-3', 'mstart-3', 'mx-3'], [0]),
      '`ms` — margin-start (chap tomon).',
    ),
    why(tf('q3', '`img-fluid` rasmni konteynerga moslaydi.', true), 'max-width: 100%.'),
  ]),
  jumbotron: miniQuiz([
    why(
      tf('q1', 'BS5 da `.jumbotron` klassi yo‘q — banner utilitalar bilan quriladi.', true),
      'Masalan, `p-5 bg-body-tertiary rounded-3`.',
    ),
    why(
      codeFill('q2', 'Katta tavsif matni.', '<p id="tavsif" class="{{1}}">', ['fs-4']),
      'Shrift o‘lchami utilitasi.',
    ),
    why(
      q(
        'q3',
        'Tema bo‘yicha och fon?',
        ['bg-body-tertiary', 'bg-light-2', 'bg-gray', 'bg-muted'],
        [0],
      ),
      'Qorong‘i rejimga moslashadi.',
    ),
  ]),
  alerts: miniQuiz([
    why(
      codeFill(
        'q1',
        'Yopish tugmasi.',
        '<button type="button" class="btn-close" data-bs-dismiss="{{1}}" aria-label="Yopish"></button>',
        ['alert'],
      ),
      'BS5 atributi.',
    ),
    why(
      q('q2', 'Yopish tugmasi klassi (BS5)?', ['btn-close', 'close', 'alert-close', 'x'], [0]),
      'BS4 dagi close o‘rniga.',
    ),
    why(tf('q3', 'Ikonkasiz yopish tugmasiga `aria-label` kerak.', true), 'Tugma nomi.'),
  ]),
  buttons: miniQuiz([
    why(
      codeFill(
        'q1',
        'Har bosishda holat almashsin.',
        '<button id="sevimli" class="btn btn-outline-danger" data-bs-toggle="{{1}}">Sevimli</button>',
        ['button'],
      ),
      'active va aria-pressed yangilanadi.',
    ),
    why(
      q(
        'q2',
        'To‘liq kenglikdagi tugma (BS5)?',
        ['<div class="d-grid"> o‘rami', 'btn-block', 'w-full', 'btn-wide'],
        [0],
      ),
      'btn-block olib tashlangan.',
    ),
    why(tf('q3', '`btn-outline-primary` — chegarali ko‘k tugma.', true), 'Fon shaffof.'),
  ]),
  'button-groups': miniQuiz([
    why(
      codeFill(
        'q1',
        'Radio tugma ko‘rinishida.',
        '<input type="radio" class="{{1}}" name="daraja" id="d1">\n<label class="btn btn-outline-primary" for="d1">Boshlang‘ich</label>',
        ['btn-check'],
      ),
      'BS5 dagi `btn-check` usuli.',
    ),
    why(
      q(
        'q2',
        'Yorliq va input qanday bog‘lanadi?',
        ['label for = input id', 'Ichma-ich', 'name orqali', 'class orqali'],
        [0],
      ),
      'Bosish yorliq orqali.',
    ),
    why(
      tf('q3', 'Guruhga `role="group"` va `aria-label`.', true),
      'Ekran o‘quvchi guruhni taniydi.',
    ),
  ]),
  badges: miniQuiz([
    why(
      codeFill('q1', 'Yashil badge (BS5).', '<span class="badge {{1}}">Yangi</span>', [
        'bg-success',
      ]),
      'BS4 dagi badge-success.',
    ),
    why(
      q(
        'q2',
        'Burchakdagi badge uchun tugmaga?',
        ['position-relative', 'position-absolute', 'float-end', 'd-flex'],
        [0],
      ),
      'Badge — position-absolute.',
    ),
    why(
      tf('q3', 'Badge’ni burchakka `top-0 start-100 translate-middle` qo‘yadi.', true),
      'Joylashuv utilitalari.',
    ),
  ]),
  'progress-bars': miniQuiz([
    why(
      q(
        'q1',
        'BS 5.3 da `role="progressbar"` qayerga beriladi?',
        ['Tashqi .progress ga', 'Ichki .progress-bar ga', 'body ga', 'Kerak emas'],
        [0],
      ),
      '5.3 tuzilmasi.',
    ),
    why(
      codeFill(
        'q2',
        'Qiymat atributi.',
        '<div id="html" class="progress" role="progressbar" aria-label="HTML" {{1}}="75">',
        ['aria-valuenow'],
      ),
      'Ekran o‘quvchi qiymatni biladi.',
    ),
    why(
      tf('q3', 'Kenglik ichki `.progress-bar` ga `style="width: 75%"` bilan beriladi.', true),
      'Ko‘rinadigan chiziq.',
    ),
  ]),
  spinners: miniQuiz([
    why(
      match('q1', 'Spinnerni klass bilan moslang.', [
        ['Aylanuvchi halqa', 'spinner-border'],
        ['Nafas oluvchi doira', 'spinner-grow'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      q('q2', 'Kichik spinner?', ['spinner-grow-sm', 'spinner-small', 'sm', 'spinner-xs'], [0]),
      'Tugma ichida qulay.',
    ),
    why(
      tf('q3', 'Yashirin “Yuklanmoqda…” matni `visually-hidden` bilan beriladi.', true),
      'BS4 dagi sr-only.',
    ),
  ]),
  pagination: miniQuiz([
    why(
      codeFill(
        'q1',
        'Breadcrumb joriy bandi.',
        '<li class="breadcrumb-item active" aria-current="{{1}}">HTML</li>',
        ['page'],
      ),
      'Joriy sahifa.',
    ),
    why(
      order('q2', 'Sahifalash tuzilmasi.', ['pagination', 'page-item', 'page-link']),
      'BS4 bilan bir xil.',
    ),
    why(
      tf('q3', 'Breadcrumb’ga `bg-body-tertiary p-2 rounded` utilitalarini qo‘shish mumkin.', true),
      'Fon va burchaklar.',
    ),
  ]),
  'list-groups': miniQuiz([
    why(
      codeFill('q1', 'Raqamlangan qadamlar.', '<ol class="list-group {{1}}">', [
        'list-group-numbered',
      ]),
      'BS5 da yangi.',
    ),
    why(
      q(
        'q2',
        'Bosiladigan band?',
        [
          'list-group-item list-group-item-action',
          'list-group-link',
          'list-item-click',
          'list-group-btn',
        ],
        [0],
      ),
      'Hover va fokus.',
    ),
    why(tf('q3', 'Joriy bandga `active` va `aria-current="true"`.', true), 'Ko‘rinish va ma’no.'),
  ]),
  cards: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kartalar to‘ri.',
        '<div id="katalog" class="row row-cols-1 row-cols-md-3 {{1}}">',
        ['g-4'],
      ),
      'Ustunlar orasida bo‘shliq.',
    ),
    why(
      q(
        'q2',
        'Butun kartani bosiladigan qilish?',
        ['Havolaga stretched-link', 'Kartaga onclick', 'card-link-all', 'Imkoni yo‘q'],
        [0],
      ),
      'Bosish maydoni kartagacha.',
    ),
    why(
      tf('q3', '`card h-100` qatordagi kartalarni teng balandlikka keltiradi.', true),
      'Ustun balandligi.',
    ),
  ]),
  dropdowns: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ochuvchi atribut (BS5).',
        '<button class="btn btn-secondary dropdown-toggle" data-bs-toggle="{{1}}" aria-expanded="false">',
        ['dropdown'],
      ),
      '`bs-` prefiksi.',
    ),
    why(
      q('q2', 'Menyu bandi?', ['dropdown-item', 'dropdown-link', 'li', 'menu-item'], [0]),
      '`<a class="dropdown-item">`.',
    ),
    why(
      tf('q3', 'Bootstrap `aria-expanded` ni ochilganda `true` ga o‘zgartiradi.', true),
      'Holat ekran o‘quvchiga yetadi.',
    ),
  ]),
  collapse: miniQuiz([
    why(
      order('q1', 'Accordion tuzilmasi.', [
        'accordion',
        'accordion-item',
        'accordion-header',
        'accordion-collapse',
        'accordion-body',
      ]),
      'BS5 tayyor komponent.',
    ),
    why(
      codeFill(
        'q2',
        'Bittasi ochilsa boshqalari yopilsin.',
        '<div class="accordion-collapse collapse" data-bs-parent="{{1}}">',
        ['#faq'],
      ),
      'Accordion o‘rami.',
    ),
    why(tf('q3', 'Ochiq bo‘limga `show` beriladi.', true), 'Boshida ochiq.'),
  ]),
  navs: miniQuiz([
    why(
      codeFill(
        'q1',
        'Yorliq tugmasi.',
        '<button class="nav-link active" data-bs-toggle="{{1}}" data-bs-target="#tavsif">Tavsif</button>',
        ['tab'],
      ),
      'Yorliq `<button>` bo‘lishi mumkin.',
    ),
    why(
      q('q2', 'Panellar o‘rami?', ['tab-content', 'nav-content', 'tab-panels', 'card-body'], [0]),
      'Ichida tab-pane lar.',
    ),
    why(tf('q3', 'Birinchi panel `show active` bilan ochiq.', true), 'fade bilan.'),
  ]),
  navbar: miniQuiz([
    why(
      codeFill(
        'q1',
        'Qorong‘i navbar (BS 5.3).',
        '<nav id="panel" class="navbar navbar-expand-lg bg-dark" data-bs-theme="{{1}}">',
        ['dark'],
      ),
      'navbar-dark o‘rniga.',
    ),
    why(
      q(
        'q2',
        '`navbar-expand-lg` nimani bildiradi?',
        [
          'lg dan boshlab menyu yoyiladi, undan torroqda ☰',
          'Har doim yoyiq',
          'Faqat lg da yashirin',
          'Navbar katta',
        ],
        [0],
      ),
      'Tanaffus nuqtasi.',
    ),
    why(
      tf('q3', '☰ tugmasi `data-bs-toggle="collapse"` bilan menyuni ochadi.', true),
      'navbar-toggler.',
    ),
  ]),
  carousel: miniQuiz([
    why(
      codeFill(
        'q1',
        'Avtomatik aylansin.',
        '<div id="slayder" class="carousel slide" data-bs-ride="{{1}}">',
        ['carousel'],
      ),
      'Sahifa ochilishi bilan.',
    ),
    why(
      q(
        'q2',
        'Keyingi slayd tugmasi atributi?',
        ['data-bs-slide="next"', 'data-slide="next"', 'data-next', 'href="#next"'],
        [0],
      ),
      'BS5 prefiksi.',
    ),
    why(tf('q3', 'Slaydlar `carousel-item`, birinchisi `active`.', true), 'Karusel tuzilmasi.'),
  ]),
  modal: miniQuiz([
    why(
      codeFill(
        'q1',
        'Modalni ochuvchi tugma.',
        '<button data-bs-toggle="modal" data-bs-target="{{1}}">Yozilish</button>',
        ['#oyna'],
      ),
      'Modal id si.',
    ),
    why(
      q(
        'q2',
        'Vertikal markaz?',
        ['modal-dialog-centered', 'modal-center', 'align-middle', 'mx-auto'],
        [0],
      ),
      '`.modal-dialog` ga.',
    ),
    why(tf('q3', 'Yopish tugmasi `data-bs-dismiss="modal"`.', true), 'BS5 atributi.'),
  ]),
  tooltip: miniQuiz([
    why(
      codeFill(
        'q1',
        'Tooltip matni (BS5).',
        '<button id="tahrir" data-bs-toggle="tooltip" {{1}}="Profilni tahrirlash">',
        ['data-bs-title'],
      ),
      'Yoki `title`.',
    ),
    why(
      codeFill(
        'q2',
        'Yoqing (jQuery’siz).',
        'document.querySelectorAll(\'[data-bs-toggle="tooltip"]\').forEach((el) => new bootstrap.{{1}}(el));',
        ['Tooltip'],
      ),
      'Oddiy JS klass.',
    ),
    why(tf('q3', 'Tooltip o‘zi yoqilmaydi.', true), 'Ishlash uchun JS kodi kerak.'),
  ]),
  popover: miniQuiz([
    why(
      codeFill(
        'q1',
        'Popover matni.',
        '<button data-bs-toggle="popover" data-bs-title="Sertifikat" {{1}}="Yakuniy loyihadan keyin.">',
        ['data-bs-content'],
      ),
      'Sarlavha va matn.',
    ),
    why(
      q(
        'q2',
        'Yoqish kodi?',
        ['new bootstrap.Popover(el)', '$(el).popover()', 'el.popover = true', 'Kerak emas'],
        [0],
      ),
      'jQuery’siz.',
    ),
    why(
      tf('q3', '`data-bs-placement="right"` popoverni o‘ngda ochadi.', true),
      'Joylashuv atributi — placement.',
    ),
  ]),
  toast: miniQuiz([
    why(
      codeFill('q1', 'Toastni ko‘rsating.', 'bootstrap.Toast.getOrCreateInstance(xabar).{{1}}();', [
        'show',
      ]),
      'O‘zi ko‘rinmaydi.',
    ),
    why(
      q(
        'q2',
        'O‘ng pastki burchak?',
        [
          'toast-container position-fixed bottom-0 end-0 p-3',
          'fixed-bottom',
          'float-end',
          'ms-auto',
        ],
        [0],
      ),
      'Joylashuv utilitalari.',
    ),
    why(
      tf('q3', '`end-0` o‘ng chetni bildiradi (chapdan o‘ngga yozuvda).', true),
      'start/end — yo‘nalishga moslashadi.',
    ),
  ]),
  scrollspy: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kontentni kuzating.',
        '<div id="kontent" data-bs-spy="{{1}}" data-bs-target="#mundarija">',
        ['scroll'],
      ),
      'BS5 atributi.',
    ),
    why(
      q(
        'q2',
        'Havola bosilganda silliq aylantirish?',
        ['data-bs-smooth-scroll="true"', 'data-smooth', 'scroll-behavior: fast', 'Imkoni yo‘q'],
        [0],
      ),
      'Scrollspy sozlamasi.',
    ),
    why(
      tf('q3', 'Kuzatiladigan blokka balandlik va `overflow-y-scroll` kerak.', true),
      'Ichki aylantirish.',
    ),
  ]),
  offcanvas: miniQuiz([
    why(
      codeFill('q1', 'Chapdan chiqadigan panel.', '<div id="filtr" class="offcanvas {{1}}">', [
        'offcanvas-start',
      ]),
      'end — o‘ngdan.',
    ),
    why(
      q(
        'q2',
        'Panelni ochuvchi tugma?',
        [
          'data-bs-toggle="offcanvas" data-bs-target="#filtr"',
          'data-bs-toggle="modal"',
          'data-open="#filtr"',
          'href="#filtr" faqat',
        ],
        [0],
      ),
      'Offcanvas plagini.',
    ),
    why(
      order('q3', 'Panel qismlari.', ['offcanvas-header', 'offcanvas-title', 'offcanvas-body']),
      'Sarlavha va tana.',
    ),
  ]),
  utilities: miniQuiz([
    why(
      match('q1', 'Utilitani vazifasi bilan moslang.', [
        ['border-2', 'Chegara qalinligi'],
        ['rounded-3', 'Burchak radiusi'],
        ['shadow', 'Soya'],
        ['gap-2', 'Elementlar orasi'],
      ]),
      'O‘z CSS’siz.',
    ),
    why(
      q(
        'q2',
        'BS4 dagi `sr-only` ning BS5 dagi nomi?',
        ['visually-hidden', 'sr-hidden', 'screen-only', 'hidden-sr'],
        [0],
      ),
      'Ekran o‘quvchi uchun matn.',
    ),
    why(tf('q3', '`border-primary` chegarani ko‘k qiladi.', true), 'Rang utilitasi.'),
  ]),
  'dark-mode': miniQuiz([
    why(
      codeFill(
        'q1',
        'Kartochka doim qorong‘i.',
        '<div id="kartochka" data-bs-theme="{{1}}" class="bg-body text-body p-4">',
        ['dark'],
      ),
      'Faqat shu blok.',
    ),
    why(
      q(
        'q2',
        'Butun sahifa rejimini almashtirish?',
        [
          "document.documentElement.setAttribute('data-bs-theme', 'dark')",
          "body.className = 'dark'",
          'location.reload()',
          'CSS faylni almashtirish',
        ],
        [0],
      ),
      '`<html>` atributi.',
    ),
    why(
      tf('q3', '`bg-body` va `text-body` rejimga qarab rangini o‘zgartiradi.', true),
      'Tema o‘zgaruvchilari.',
    ),
  ]),
  flex: miniQuiz([
    why(
      codeFill(
        'q1',
        'Sarlavha qatori.',
        '<div id="sarlavha" class="d-flex justify-content-between {{1}} mb-3">',
        ['align-items-center'],
      ),
      'Vertikal markaz.',
    ),
    why(
      q(
        'q2',
        'Telefonda ustun, md dan qator?',
        ['flex-column flex-md-row', 'flex-row flex-md-column', 'd-md-flex', 'flex-wrap'],
        [0],
      ),
      'Moslashuvchan yo‘nalish.',
    ),
    why(tf('q3', 'Oxirgi elementni o‘ngga surish — `ms-auto`.', true), 'BS4 dagi ml-auto.'),
  ]),
  icons: miniQuiz([
    why(
      codeFill('q1', 'Uy ikonkasi.', '<i class="bi {{1}}" aria-hidden="true"></i>', ['bi-house']),
      'bi + bi-NOMI.',
    ),
    why(tf('q2', 'Bootstrap Icons `<head>` ga alohida ulanadi.', true), 'Alohida kutubxona.'),
    why(
      q(
        'q3',
        'Ikonka va matn orasidagi bo‘shliq?',
        ['me-1 (ikonkaga)', 'ml-1', 'padding: 1', 'space-1'],
        [0],
      ),
      '`me` — margin-end (o‘ng tomon).',
    ),
  ]),
  forms: miniQuiz([
    why(
      codeFill('q1', 'Forma setkasi.', '<form class="row {{1}}">', ['g-3']),
      'BS5 da form-row o‘rniga.',
    ),
    why(
      codeFill('q2', 'Yorliq klassi.', '<label for="ism" class="{{1}}">Ism</label>', [
        'form-label',
      ]),
      'BS5 klassi.',
    ),
    why(
      q('q3', 'Tugma butun qatorda?', ['col-12 o‘ramida', 'col-md-6', 'btn-block', 'w-50'], [0]),
      'Setka ustuni.',
    ),
  ]),
  select: miniQuiz([
    why(
      codeFill('q1', 'Select bezagi.', '<select id="shahar" class="{{1}}" required>', [
        'form-select',
      ]),
      'form-control emas.',
    ),
    why(
      q(
        'q2',
        'Katta select?',
        ['form-select form-select-lg', 'form-select-xl', 'select-lg', 'form-control-lg'],
        [0],
      ),
      'O‘lcham klassi.',
    ),
    why(tf('q3', 'Bir nechta tanlov uchun `multiple` atributi.', true), 'Qiziqishlar ro‘yxati.'),
  ]),
  'checks-radios': miniQuiz([
    why(
      codeFill(
        'q1',
        'Kalit (switch).',
        '<div class="form-check {{1}}">\n  <input class="form-check-input" type="checkbox" role="switch" id="s1">\n</div>',
        ['form-switch'],
      ),
      'Checkbox ko‘rinishi kalit.',
    ),
    why(
      order('q2', 'Tuzilma.', ['form-check', 'form-check-input', 'form-check-label']),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      tf('q3', 'Bir qatordagi checkboxlar — `form-check-inline`.', true),
      'Checkboxlar yonma-yon turadi.',
    ),
  ]),
  range: miniQuiz([
    why(
      codeFill(
        'q1',
        'Diapazon bezagi.',
        '<input type="range" id="baho" class="{{1}}" min="1" max="10" step="1">',
        ['form-range'],
      ),
      'BS5 klassi.',
    ),
    why(
      q(
        'q2',
        'Har harakatda qiymatni ko‘rsatish?',
        ['input hodisasi', 'change', 'click', 'submit'],
        [0],
      ),
      '`change` faqat qo‘yib yuborganda.',
    ),
    why(tf('q3', 'Range klaviatura strelkalari bilan boshqariladi.', true), 'Brauzer elementi.'),
  ]),
  'input-groups': miniQuiz([
    why(
      codeFill(
        'q1',
        'Maydon oldidagi “@”.',
        '<div class="input-group">\n  <span class="{{1}}">@</span>\n  <input id="login" class="form-control">\n</div>',
        ['input-group-text'],
      ),
      'BS5 da prepend kerak emas.',
    ),
    why(
      tf('q2', 'Narxdan keyingi “so‘m” `input-group-text` maydondan keyin yoziladi.', true),
      'Tartib HTML bo‘yicha.',
    ),
    why(
      q(
        'q3',
        'Guruhni kichraytirish?',
        ['input-group-sm', 'form-control-sm har qismga', 'btn-sm', 'small'],
        [0],
      ),
      'Guruhga beriladi.',
    ),
  ]),
  'floating-labels': miniQuiz([
    why(
      order('q1', 'Suzuvchi yorliq tuzilmasi.', [
        'form-floating',
        'input (placeholder bilan)',
        'label',
      ]),
      'Input birinchi.',
    ),
    why(
      tf('q2', 'Inputda `placeholder` bo‘lmasa yorliq to‘g‘ri ishlamaydi.', true),
      '`:placeholder-shown` holatiga tayanadi.',
    ),
    why(
      q(
        'q3',
        'O‘ram klassi?',
        ['form-floating', 'form-label-float', 'floating', 'input-floating'],
        [0],
      ),
      'BS5 klassi.',
    ),
  ]),
  validation: miniQuiz([
    why(
      codeFill(
        'q1',
        'Brauzer ogohlantirishini o‘chiring.',
        '<form class="row g-3 needs-validation" {{1}}>',
        ['novalidate'],
      ),
      'Bootstrap uslubi ishlatiladi.',
    ),
    why(
      q(
        'q2',
        'Yuborishda xatolarni ko‘rsatish uchun formaga?',
        ['was-validated klassi', 'has-error', 'invalid', 'validated'],
        [0],
      ),
      'JS bilan qo‘shiladi.',
    ),
    why(tf('q3', 'Xato matni `invalid-feedback` ichida.', true), 'Maydondan keyin.'),
  ]),
  'grid-system': miniQuiz([
    why(
      codeFill('q1', '6 ustun markazda.', '<div id="forma" class="col-md-6 {{1}}">', [
        'offset-md-3',
      ]),
      'Offset 3 + ustun 6 + 3 = 12.',
    ),
    why(
      q(
        'q2',
        'md dan birinchi chiqsin?',
        ['order-md-1', 'order-1-md', 'push-md-1', 'first-md'],
        [0],
      ),
      'Tartib utilitasi.',
    ),
    why(
      tf('q3', '`g-0` ustunlar orasidagi bo‘shliqni olib tashlaydi.', true),
      'BS4 dagi no-gutters.',
    ),
  ]),
  'grid-stacked': miniQuiz([
    why(
      codeFill('q1', 'Ustma-ust bloklar orasida masofa.', '<div id="qator1" class="row {{1}}">', [
        'gy-3',
      ]),
      'Vertikal gutter.',
    ),
    why(
      q('q2', 'sm dan teng yarim?', ['col-sm-6', 'col-6', 'col-md-6', 'col-sm-12'], [0]),
      'sm ≥ 576px.',
    ),
    why(tf('q3', 'Telefonda bloklar 100% kenglikda.', true), 'sm dan torroq.'),
  ]),
  'grid-xsmall': miniQuiz([
    why(
      codeFill('q1', 'Logo kontent kengligida.', '<div id="logo" class="{{1}}">', ['col-auto']),
      'Qolgan joy — col.',
    ),
    why(
      q('q2', 'Telefonda ikkitadan?', ['col-6', 'col-sm-6', 'col-3', 'col-12'], [0]),
      'Prefikssiz.',
    ),
    why(tf('q3', '`col` qolgan joyni egallaydi.', true), 'Avtomatik kenglik.'),
  ]),
  'grid-small': miniQuiz([
    why(
      codeFill('q1', 'Telefonda 2, 576px dan 4.', '<div class="col-6 {{1}}">', ['col-sm-3']),
      '2 × 6 va 4 × 3.',
    ),
    why(
      q('q2', 'sm qaysi kenglikdan?', ['576px', '768px', '480px', '992px'], [0]),
      'BS4 va BS5 da bir xil.',
    ),
    why(
      tf('q3', '`row-cols-2 row-cols-sm-4` bilan ham shu natija olinadi.', true),
      'Ustunlar `col` bo‘lsa.',
    ),
  ]),
  'grid-medium': miniQuiz([
    why(
      codeFill('q1', 'sm da 2, md da 4.', '<div class="col-sm-6 {{1}}">', ['col-md-3']),
      'md ≥ 768px.',
    ),
    why(
      q(
        'q2',
        'Banner faqat md va kattada?',
        ['d-none d-md-block', 'd-md-none', 'visible-md', 'hidden-sm'],
        [0],
      ),
      'Display utilitalari.',
    ),
    why(
      tf('q3', 'Ustunlar orasidagi bo‘shliq `g-*` bilan beriladi.', true),
      '`g-*` — gutter (ustunlar orasi).',
    ),
  ]),
  'grid-large': miniQuiz([
    why(
      codeFill('q1', 'Planshetda 2, noutbukda 4.', '<div class="col-md-6 {{1}}">', ['col-lg-3']),
      'lg ≥ 992px.',
    ),
    why(
      q(
        'q2',
        'Qatordagi ustunlarni markazlash?',
        ['row justify-content-center', 'row text-center', 'mx-auto', 'row-center'],
        [0],
      ),
      'Flex utilitasi.',
    ),
    why(
      tf('q3', 'Yon panel lg dan yopishqoq bo‘lishi uchun `sticky-lg-top`.', true),
      'Sticky utilitasi.',
    ),
  ]),
  'grid-xlarge': miniQuiz([
    why(
      codeFill('q1', 'Noutbukda 2, 1200px dan 4.', '<div class="col-lg-6 {{1}}">', ['col-xl-3']),
      'xl ≥ 1200px.',
    ),
    why(
      q('q2', 'xl qaysi kenglikdan?', ['1200px', '1400px', '992px', '1600px'], [0]),
      'xxl — 1400px.',
    ),
    why(tf('q3', '4 ta `col-xl-3` bir qatorga sig‘adi.', true), '4 × 3 = 12.'),
  ]),
  'grid-xxl': miniQuiz([
    why(
      codeFill('q1', 'xl da 2, xxl da 4.', '<div class="col-xl-6 {{1}}">', ['col-xxl-3']),
      'xxl ≥ 1400px.',
    ),
    why(tf('q2', 'xxl sinfi faqat Bootstrap 5 da bor.', true), 'BS4 da eng katta — xl.'),
    why(
      q('q3', 'xxl da konteyner maksimal kengligi?', ['1320px', '1140px', '1400px', '100%'], [0]),
      'container uchun.',
    ),
  ]),
  'grid-examples': miniQuiz([
    why(
      codeFill('q1', 'Statistika bloki.', '<div class="{{1}} col-lg-3">', ['col-6']),
      'Telefonda 2, noutbukda 4.',
    ),
    why(
      q(
        'q2',
        'Statistika qatoridagi bo‘shliqlar?',
        ['row g-3 mb-4', 'row no-gutters', 'row-gap', 'container-fluid'],
        [0],
      ),
      'Gutter va pastki margin.',
    ),
    why(tf('q3', 'Katalog `row-cols` bilan, ustunlari oddiy `col`.', true), 'Qisqa yozuv.'),
  ]),
};
