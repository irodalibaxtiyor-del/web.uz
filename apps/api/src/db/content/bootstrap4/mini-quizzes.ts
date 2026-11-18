import { codeFill, match, miniQuiz, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the Bootstrap 4 course: three self-check questions per exercise. */
export const BS4_MINI_QUIZZES: Record<string, QuizDef> = {
  'get-started': miniQuiz([
    why(
      order('q1', 'Skriptlar tartibi.', ['jquery.slim.min.js', 'bootstrap.bundle.min.js']),
      'Avval jQuery, keyin Bootstrap.',
    ),
    why(
      q(
        'q2',
        '`bundle` faylda nima bor?',
        ['Bootstrap JS va Popper', 'Faqat CSS', 'jQuery', 'Ikonkalar'],
        [0],
      ),
      'Popper alohida ulanmaydi.',
    ),
    why(
      tf('q3', 'Bootstrap 4.6.2 CSS havolasi `<head>` ga qo‘yiladi.', true),
      'Uslub sahifadan oldin kerak.',
    ),
  ]),
  containers: miniQuiz([
    why(
      codeFill(
        'q1',
        'To‘liq kenglikdagi konteyner.',
        '<div id="banner" class="{{1}} bg-dark text-white">',
        ['container-fluid'],
      ),
      'Ekran bo‘ylab.',
    ),
    why(
      q('q2', 'Oddiy konteyner?', ['container', 'container-full', 'wrapper', 'row'], [0]),
      'Har tanaffusda qat’iy maksimal kenglik.',
    ),
    why(
      tf('q3', '`container-lg` lg gacha 100%, keyin qat’iy kenglikda.', true),
      'Moslashuvchan konteyner.',
    ),
  ]),
  'grid-basic': miniQuiz([
    why(
      q(
        'q1',
        'Uchta avtomatik teng ustun?',
        ['Har biri col', 'Har biri col-4 shart', 'col-auto', 'col-12'],
        [0],
      ),
      '`.col` teng taqsimlanadi.',
    ),
    why(
      codeFill(
        'q2',
        'Menyu 3, kontent qolgan joy.',
        '<div class="col-3">Menyu</div>\n<div class="{{1}}">Kontent</div>',
        ['col'],
      ),
      '`.col` qolgan 9 ustunni oladi.',
    ),
    why(
      tf('q3', 'BS4 da `col-6` telefonda ham yarim kenglikda.', true),
      'Prefikssiz sinf hamma ekranda.',
    ),
  ]),
  typography: miniQuiz([
    why(
      codeFill('q1', 'Katta display sarlavha.', '<h1 id="sarlavha" class="{{1}}">Kutubxona</h1>', [
        'display-4',
      ]),
      'BS4 da 1–4.',
    ),
    why(
      codeFill(
        'q2',
        'Ikkilamchi matn.',
        '<h2>Kurslar <small class="{{1}}">uchta yo‘nalish</small></h2>',
        ['text-muted'],
      ),
      'Och kulrang.',
    ),
    why(
      q(
        'q3',
        'Iqtibos manbasi?',
        ['<footer class="blockquote-footer">', '<small>', '<cite class="lead">', 'title'],
        [0],
      ),
      '`.blockquote` ichida.',
    ),
  ]),
  colors: miniQuiz([
    why(
      codeFill('q1', 'Yashil matn.', '<p id="ok" class="{{1}}">Buyurtma qabul qilindi</p>', [
        'text-success',
      ]),
      'Ma’noli rang.',
    ),
    why(
      q(
        'q2',
        'Sariq fonda qaysi matn rangi?',
        ['text-dark', 'text-white', 'text-warning', 'text-light'],
        [0],
      ),
      'Kontrast yetarli bo‘lsin.',
    ),
    why(tf('q3', 'Holatni faqat rang bilan bildirish yetarli emas.', true), 'Matn ham kerak.'),
  ]),
  tables: miniQuiz([
    why(
      codeFill('q1', 'Qorong‘i sarlavha qatori.', '<thead class="{{1}}">', ['thead-dark']),
      'BS5 da `table-dark`.',
    ),
    why(
      q('q2', '“O‘tmadi” qatori?', ['table-danger', 'danger', 'bg-red', 'text-danger-row'], [0]),
      'BS4 kontekstli klass.',
    ),
    why(
      sortInto('q3', 'Jadvalga beriladigan klasslar.', {
        Kerak: ['table', 'table-striped', 'table-hover'],
        'Kerak emas': ['table-dark-row'],
      }),
      'Mashq talablari.',
    ),
  ]),
  images: miniQuiz([
    why(
      codeFill(
        'q1',
        'Logo markazda.',
        '<img id="logo" class="mx-auto {{1}}" src="…" alt="Klub logosi">',
        ['d-block'],
      ),
      'Blok + auto margin.',
    ),
    why(
      codeFill('q2', 'Banner moslashsin.', '<img id="banner" class="{{1}}" src="…" alt="…">', [
        'img-fluid',
      ]),
      'BS3 dagi img-responsive.',
    ),
    why(
      q('q3', 'Avatar doira?', ['rounded-circle', 'img-circle', 'rounded', 'circle'], [0]),
      'BS4 klassi.',
    ),
  ]),
  jumbotron: miniQuiz([
    why(
      codeFill(
        'q1',
        'Burchaksiz, to‘liq kenglikdagi jumbotron.',
        '<div id="banner" class="jumbotron {{1}}">',
        ['jumbotron-fluid'],
      ),
      'Ichiga `.container`.',
    ),
    why(
      q('q2', 'Kirish paragrafi?', ['lead', 'display-4', 'small', 'text-muted'], [0]),
      'Kattaroq matn.',
    ),
    why(
      tf('q3', 'Jumbotron BS5 da alohida komponent sifatida olib tashlangan.', true),
      'BS5 da utilitalar bilan quriladi.',
    ),
  ]),
  alerts: miniQuiz([
    why(
      codeFill('q1', 'Alert sarlavhasi.', '<h4 class="{{1}}">Xato!</h4>', ['alert-heading']),
      'Alert ichida.',
    ),
    why(
      match('q2', 'Xabarni klass bilan moslang.', [
        ['Saqlandi', 'alert-success'],
        ['Xato', 'alert-danger'],
      ]),
      'Rang ma’noga mos.',
    ),
    why(
      tf('q3', 'Yopish tugmasi `data-dismiss="alert"` bilan ishlaydi.', true),
      'BS5 da `data-bs-dismiss`.',
    ),
  ]),
  buttons: miniQuiz([
    why(
      codeFill('q1', 'Chegarali ko‘k tugma.', '<a id="batafsil" class="btn {{1}}">Batafsil</a>', [
        'btn-outline-primary',
      ]),
      'Fon shaffof.',
    ),
    why(
      q(
        'q2',
        'Katta asosiy tugma?',
        ['btn btn-primary btn-lg', 'btn-large', 'btn btn-primary-lg', 'btn btn-xl'],
        [0],
      ),
      'O‘lcham klassi.',
    ),
    why(
      tf('q3', 'BS4 da `btn-block` tugmani to‘liq kenglikka cho‘zadi.', true),
      'BS5 da `d-grid`.',
    ),
  ]),
  'button-groups': miniQuiz([
    why(
      codeFill(
        'q1',
        'Guruh.',
        '<div id="korinish" class="btn-group" role="group" aria-label="{{1}}">',
        ['Ko‘rinish'],
      ),
      'Guruh nomi.',
    ),
    why(
      q(
        'q2',
        'Radio’larni tugma ko‘rinishida (BS4)?',
        ['btn-group-toggle + data-toggle="buttons"', 'btn-check', 'form-check', 'Imkoni yo‘q'],
        [0],
      ),
      'BS5 da `btn-check`.',
    ),
    why(
      tf('q3', 'Bir guruhdagi radio’lar `name` atributi bir xil bo‘ladi.', true),
      'Faqat bittasi tanlanadi.',
    ),
  ]),
  badges: miniQuiz([
    why(
      codeFill('q1', 'Yashil badge.', '<span class="badge {{1}}">Yangi</span>', ['badge-success']),
      'BS4 rang klassi.',
    ),
    why(
      q('q2', 'Tabletka shakli?', ['badge-pill', 'rounded-pill', 'pill', 'badge-round'], [0]),
      'BS5 da `rounded-pill`.',
    ),
    why(
      tf('q3', 'Tugma ichidagi badge sonini `sr-only` matn bilan izohlash yaxshi.', true),
      'Ekran o‘quvchi uchun.',
    ),
  ]),
  'progress-bars': miniQuiz([
    why(
      codeFill(
        'q1',
        'Yashil bar.',
        '<div class="progress-bar {{1}}" style="width: 60%">60%</div>',
        ['bg-success'],
      ),
      'BS4 da rang `bg-*` bilan.',
    ),
    why(
      q(
        'q2',
        'Chiziqli va harakatlanuvchi?',
        ['progress-bar-striped progress-bar-animated', 'striped active', 'animated', 'bar-move'],
        [0],
      ),
      'Ikkalasi birga.',
    ),
    why(tf('q3', 'Kenglik `style="width: …"` bilan beriladi.', true), 'Inline uslub.'),
  ]),
  spinners: miniQuiz([
    why(
      codeFill('q1', 'Ko‘k halqa.', '<div id="yuklash" class="{{1}} text-primary" role="status">', [
        'spinner-border',
      ]),
      'Aylanuvchi halqa.',
    ),
    why(
      q(
        'q2',
        '“Nafas oluvchi” spinner?',
        ['spinner-grow', 'spinner-pulse', 'spinner-dot', 'loader'],
        [0],
      ),
      'Kattalashib-kichrayadi.',
    ),
    why(
      tf('q3', 'Spinnerga `role="status"` va yashirin “Yuklanmoqda…” matni beriladi.', true),
      'Ekran o‘quvchi holatni biladi.',
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
      'BS4 da band va havola klasslari.',
    ),
    why(
      tf('q3', 'Breadcrumb bandlariga BS4 da `breadcrumb-item` klassi kerak.', true),
      'BS3 da shart emas edi.',
    ),
  ]),
  'list-groups': miniQuiz([
    why(
      codeFill('q1', 'Bosiladigan band.', '<a href="#" class="list-group-item {{1}}">Kurslar</a>', [
        'list-group-item-action',
      ]),
      'Hover va fokus.',
    ),
    why(
      q('q2', 'Tanlangan band?', ['active', 'selected', 'current', 'on'], [0]),
      'Kabinetda “Profil” bandi faol.',
    ),
    why(tf('q3', 'Bandni o‘chirib qo‘yish uchun `disabled`.', true), 'Bosib bo‘lmaydi.'),
  ]),
  cards: miniQuiz([
    why(
      codeFill('q1', 'Karta rasmi.', '<img class="{{1}}" src="…" alt="…">', ['card-img-top']),
      'Yuqori burchaklar yumaloq.',
    ),
    why(
      q(
        'q2',
        'Qatordagi kartalar bir xil balandlikda?',
        ['card h-100', 'card same-height', 'card-deck har doim', 'height: auto'],
        [0],
      ),
      'Ustun balandligini to‘liq oladi.',
    ),
    why(
      match('q3', 'Qismni klass bilan moslang.', [
        ['Tana', 'card-body'],
        ['Sarlavha', 'card-title'],
        ['Matn', 'card-text'],
      ]),
      'Card tuzilmasi.',
    ),
  ]),
  dropdowns: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ochuvchi atribut.',
        '<button class="btn btn-secondary dropdown-toggle" data-toggle="{{1}}">',
        ['dropdown'],
      ),
      'Popper joylashtiradi.',
    ),
    why(
      q('q2', 'Menyu bandi (BS4)?', ['dropdown-item', 'li', 'dropdown-link', 'menu-item'], [0]),
      '`<a class="dropdown-item">`.',
    ),
    why(tf('q3', 'Ajratuvchi chiziq `dropdown-divider`.', true), 'BS3 da `divider`.'),
  ]),
  collapse: miniQuiz([
    why(
      codeFill(
        'q1',
        'Javobni ochadigan tugma.',
        '<button data-toggle="collapse" data-target="{{1}}" aria-controls="javob1">',
        ['#javob1'],
      ),
      '`data-target` — CSS selektori (#id).',
    ),
    why(
      q(
        'q2',
        'Birinchi javob ochiq turishi uchun?',
        ['collapse show', 'collapse in', 'collapse open', 'active'],
        [0],
      ),
      'BS4 da `show`.',
    ),
    why(
      tf('q3', 'Akkordeon uchun har javobga `data-parent` beriladi.', true),
      'Bittasi ochilsa boshqalari yopiladi.',
    ),
  ]),
  navs: miniQuiz([
    why(order('q1', 'Nav tuzilmasi.', ['nav nav-pills', 'nav-item', 'nav-link']), 'BS4 klasslari.'),
    why(
      codeFill(
        'q2',
        'Pill havolasi.',
        '<a class="nav-link active" data-toggle="{{1}}" href="#tavsif">Tavsif</a>',
        ['pill'],
      ),
      'Yorliqlar uchun `tab`.',
    ),
    why(
      tf('q3', 'Panellar `tab-content` ichida `tab-pane` bo‘ladi.', true),
      'Birinchisi `show active`.',
    ),
  ]),
  navbar: miniQuiz([
    why(
      codeFill(
        'q1',
        'md dan yoyiladigan qorong‘i navbar.',
        '<nav id="panel" class="navbar {{1}} navbar-dark bg-dark">',
        ['navbar-expand-md'],
      ),
      'Undan torroqda ☰.',
    ),
    why(
      q(
        'q2',
        '☰ tugmasi klassi?',
        ['navbar-toggler', 'navbar-toggle', 'menu-btn', 'hamburger'],
        [0],
      ),
      'BS3 da `navbar-toggle`.',
    ),
    why(tf('q3', 'Yig‘iladigan qism `collapse navbar-collapse`.', true), 'Tugma uni ochadi.'),
  ]),
  forms: miniQuiz([
    why(
      codeFill(
        'q1',
        'Zich qator.',
        '<div class="{{1}}">\n  <div class="form-group col-md-6">…</div>\n  <div class="form-group col-md-6">…</div>\n</div>',
        ['form-row'],
      ),
      'Ism va login yonma-yon.',
    ),
    why(
      order('q2', 'Checkbox tuzilmasi.', ['form-check', 'form-check-input', 'form-check-label']),
      'BS4 checkbox.',
    ),
    why(
      tf('q3', 'BS5 da `form-row` yo‘q — setka (`row g-3`) ishlatiladi.', true),
      'Versiya farqi.',
    ),
  ]),
  inputs: miniQuiz([
    why(
      codeFill('q1', 'Katta maydon.', '<input id="qidiruv" class="form-control {{1}}">', [
        'form-control-lg',
      ]),
      'BS3 dagi input-lg.',
    ),
    why(
      q(
        'q2',
        'Statik matn ko‘rinishidagi maydon?',
        ['form-control-plaintext + readonly', 'form-control-static', 'disabled', 'text-muted'],
        [0],
      ),
      'BS4 klassi.',
    ),
    why(tf('q3', 'Fayl maydoni BS4 da `form-control-file`.', true), 'BS5 da `form-control`.'),
  ]),
  'input-groups': miniQuiz([
    why(
      codeFill(
        'q1',
        'Oldidagi o‘ram.',
        '<div class="{{1}}"><span class="input-group-text">@</span></div>',
        ['input-group-prepend'],
      ),
      'Orqasi — `input-group-append`.',
    ),
    why(
      q(
        'q2',
        'Narx oxiridagi “so‘m” uchun?',
        ['input-group-append', 'input-group-prepend', 'form-text', 'badge'],
        [0],
      ),
      'Maydondan keyin.',
    ),
    why(tf('q3', 'BS5 da prepend/append o‘ramlari kerak emas.', true), 'Versiya farqi.'),
  ]),
  'custom-forms': miniQuiz([
    why(
      match('q1', 'Elementni klass bilan moslang.', [
        ['Maxsus checkbox', 'custom-control custom-checkbox'],
        ['Kalit (switch)', 'custom-control custom-switch'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      q(
        'q2',
        'Ichidagi input va yorliq klasslari?',
        [
          'custom-control-input va custom-control-label',
          'form-check-input va form-check-label',
          'input va label',
          'switch-input',
        ],
        [0],
      ),
      'BS4 custom forms.',
    ),
    why(
      tf(
        'q3',
        'Yorliqning `for` i inputning `id` siga teng bo‘lishi shart — aks holda bosish ishlamaydi.',
        true,
      ),
      'Custom checkbox yorliq orqali bosiladi.',
    ),
  ]),
  carousel: miniQuiz([
    why(
      codeFill('q1', 'Slayd (BS4).', '<div class="{{1}} active">', ['carousel-item']),
      'BS3 da `item`.',
    ),
    why(
      q(
        'q2',
        'Avtomatik boshlash?',
        ['data-ride="carousel"', 'data-auto', 'autoplay', 'data-bs-ride'],
        [0],
      ),
      'BS5 da `data-bs-ride`.',
    ),
    why(tf('q3', 'Slayd rasmlariga `d-block w-100` beriladi.', true), 'To‘liq kenglik.'),
  ]),
  modal: miniQuiz([
    why(
      codeFill('q1', 'Markazdagi modal.', '<div class="modal-dialog {{1}}">', [
        'modal-dialog-centered',
      ]),
      'Vertikal markaz.',
    ),
    why(
      order('q2', 'Modal qatlamlari.', ['modal', 'modal-dialog', 'modal-content']),
      'Tashqaridan ichkariga.',
    ),
    why(tf('q3', '`modal fade` animatsiya bilan ochiladi.', true), 'Xiralashib chiqadi.'),
  ]),
  tooltip: miniQuiz([
    why(
      codeFill('q1', 'Tooltiplarni yoqing.', '$(\'[data-toggle="tooltip"]\').{{1}}();', [
        'tooltip',
      ]),
      'Yoqish shart.',
    ),
    why(
      q(
        'q2',
        'Joylashuv atributi?',
        ['data-placement', 'data-position', 'placement', 'data-side'],
        [0],
      ),
      'top/bottom/left/right.',
    ),
    why(
      tf('q3', 'Tooltip uchun Popper kerak (bundle ichida bor).', true),
      'Joylashuvni hisoblaydi.',
    ),
  ]),
  popover: miniQuiz([
    why(
      codeFill(
        'q1',
        'Popover matni.',
        '<button data-toggle="popover" title="Sertifikat" {{1}}="Yakuniy loyihani topshirgandan keyin beriladi.">',
        ['data-content'],
      ),
      'Sarlavha — `title`.',
    ),
    why(
      codeFill('q2', 'Yoqing.', '$(\'[data-toggle="popover"]\').{{1}}();', ['popover']),
      'O‘zi yoqilmaydi.',
    ),
    why(tf('q3', 'Popover ham Popper bilan joylashadi.', true), 'Bundle yetarli.'),
  ]),
  toast: miniQuiz([
    why(
      codeFill('q1', 'Toastni ko‘rsating.', "$('#xabar').toast('{{1}}');", ['show']),
      'O‘zi ko‘rinmaydi.',
    ),
    why(
      q(
        'q2',
        '5 soniyadan keyin yopilsin?',
        ['data-delay="5000"', 'data-time="5"', 'data-hide="5000"', 'timeout="5"'],
        [0],
      ),
      'Millisoniyalarda.',
    ),
    why(
      order('q3', 'Toast qismlari.', ['toast', 'toast-header', 'toast-body']),
      'Sarlavha va matn.',
    ),
  ]),
  scrollspy: miniQuiz([
    why(
      codeFill(
        'q1',
        'Kontentni kuzating.',
        '<div id="kontent" data-spy="{{1}}" data-target="#mundarija">',
        ['scroll'],
      ),
      'BS5 da `data-bs-spy`.',
    ),
    why(
      tf(
        'q2',
        'Menyu havolalari `nav-link` bo‘lishi kerak — Scrollspy ularni faollashtiradi.',
        true,
      ),
      'BS4 tuzilmasi.',
    ),
    why(
      q(
        'q3',
        'Kuzatiladigan blok uchun CSS?',
        [
          'position: relative; height; overflow-y: scroll',
          'float: left',
          'display: none',
          'z-index: 9',
        ],
        [0],
      ),
      'Ichki aylantirish.',
    ),
  ]),
  utilities: miniQuiz([
    why(
      match('q1', 'Utilitani vazifasi bilan moslang.', [
        ['border', 'Chegara'],
        ['rounded', 'Yumaloq burchak'],
        ['shadow', 'Soya'],
        ['p-3', 'Ichki bo‘shliq'],
      ]),
      'O‘z CSS’siz bezash.',
    ),
    why(
      codeFill('q2', 'Telefonda yashirin, md dan ko‘rinadi.', '<div class="d-none {{1}}">', [
        'd-md-block',
      ]),
      'Display utilitasi.',
    ),
    why(tf('q3', '`mt-3` — yuqori margin.', true), 'm + t + daraja.'),
  ]),
  flex: miniQuiz([
    why(
      codeFill(
        'q1',
        'Sarlavha qatori.',
        '<div id="sarlavha" class="d-flex {{1}} align-items-center">',
        ['justify-content-between'],
      ),
      'Chetlarga taqsimlash.',
    ),
    why(
      q(
        'q2',
        'Telefonda ustun, md dan qator?',
        ['flex-column flex-md-row', 'flex-row flex-md-column', 'd-block', 'flex-wrap'],
        [0],
      ),
      'Moslashuvchan yo‘nalish.',
    ),
    why(tf('q3', '`ml-auto` elementni o‘ng chetga suradi (BS4).', true), 'BS5 da `ms-auto`.'),
  ]),
  icons: miniQuiz([
    why(
      tf('q1', 'Bootstrap Icons alohida kutubxona — `<head>` ga alohida ulanadi.', true),
      'BS4 tarkibida ikonka yo‘q.',
    ),
    why(
      codeFill('q2', 'Qidiruv ikonkasi.', '<i class="bi {{1}}" aria-hidden="true"></i>', [
        'bi-search',
      ]),
      'bi + bi-NOMI.',
    ),
    why(
      q(
        'q3',
        'Faqat ikonkali tugma uchun?',
        ['aria-label', 'title faqat', 'alt', 'Hech narsa'],
        [0],
      ),
      'Tugma nomi kerak.',
    ),
  ]),
  'media-objects': miniQuiz([
    why(
      codeFill(
        'q1',
        'Matn o‘rami.',
        '<div class="media">\n  <img class="mr-3 rounded-circle" src="…" alt="…">\n  <div class="{{1}}">…</div>\n</div>',
        ['media-body'],
      ),
      'BS4 dagi media obyekt tuzilmasi.',
    ),
    why(
      q('q2', 'Rasm va matn orasidagi bo‘shliq?', ['mr-3', 'ml-3', 'p-3', 'gap-3'], [0]),
      'Rasmning o‘ng margini.',
    ),
    why(
      tf('q3', 'Javob uchun ichki `media` `media-body` ichiga joylanadi.', true),
      'Ichma-ich sharh.',
    ),
  ]),
  filters: miniQuiz([
    why(
      codeFill('q1', 'Har yozilganda filtrlang.', "$('#qidiruv').on('{{1}}', function () { … });", [
        'input',
      ]),
      'Har belgi kiritilganda ishlaydi.',
    ),
    why(
      q(
        'q2',
        'Matnni qidirish (registrsiz)?',
        [
          'indexOf(soz.toLowerCase()) > -1 (ikkalasi kichik harfda)',
          '=== soz',
          'startsWith faqat',
          'match(soz) har doim',
        ],
        [0],
      ),
      'Ichida bor-yo‘qligi.',
    ),
    why(tf('q3', 'Mos kelmagan bandlar yashiriladi.', true), 'Filtr natijasi.'),
  ]),
  'grid-system': miniQuiz([
    why(
      codeFill('q1', '6 ustun markazda.', '<div id="forma" class="col-md-6 {{1}}">', [
        'offset-md-3',
      ]),
      'BS3 dagi col-md-offset-3.',
    ),
    why(
      q(
        'q2',
        'md dan ikkinchi chiqsin?',
        ['order-md-2', 'push-md-2', 'col-md-order-2', 'order-2-md'],
        [0],
      ),
      'Tartib utilitasi.',
    ),
    why(
      tf('q3', '`no-gutters` ustunlar orasidagi bo‘shliqni olib tashlaydi.', true),
      'BS5 da `g-0`.',
    ),
  ]),
  'grid-stacked': miniQuiz([
    why(codeFill('q1', 'sm dan teng yarim.', '<div class="{{1}}">', ['col-sm-6']), 'sm ≥ 576px.'),
    why(
      q('q2', 'sm dan uchdan bir?', ['col-sm-4', 'col-sm-3', 'col-4-sm', 'col-sm-33'], [0]),
      '12 / 3 = 4.',
    ),
    why(tf('q3', '576px dan torroqda bloklar ustma-ust.', true), 'Har biri 100%.'),
  ]),
  'grid-xsmall': miniQuiz([
    why(
      codeFill('q1', 'Logo kontent kengligida.', '<div id="logo" class="{{1}}">', ['col-auto']),
      'Qolgan joy — `col`.',
    ),
    why(
      q('q2', 'Telefonda ikkitadan ikonka?', ['col-6', 'col-sm-6', 'col-2', 'col-12'], [0]),
      'Prefikssiz — telefonda ham.',
    ),
    why(tf('q3', '`col` va `col-auto` bir qatorda birga ishlaydi.', true), 'Avto + qolgan joy.'),
  ]),
  'grid-small': miniQuiz([
    why(
      codeFill('q1', 'Telefonda 2, 576px dan 4.', '<div class="col-6 {{1}}">', ['col-sm-3']),
      '2 × 6 va 4 × 3.',
    ),
    why(
      q('q2', 'BS4 da sm qaysi kenglikdan?', ['576px', '768px', '992px', '480px'], [0]),
      'BS3 da sm 768px edi.',
    ),
    why(
      tf('q3', 'Bu natijani `row-cols-2 row-cols-sm-4` bilan ham olish mumkin.', true),
      'Ustunlar `col` bo‘lsa.',
    ),
  ]),
  'grid-medium': miniQuiz([
    why(
      codeFill('q1', 'sm da ikki, md da uch.', '<div class="col-sm-6 {{1}}">', ['col-md-4']),
      'md ≥ 768px.',
    ),
    why(
      q(
        'q2',
        'Banner faqat md va kattada?',
        ['d-none d-md-block', 'hidden-sm', 'd-md-none', 'visible-md'],
        [0],
      ),
      'Display utilitalari.',
    ),
    why(
      tf('q3', '`d-md-none` md dan boshlab yashiradi.', true),
      '`d-none d-md-block` ning teskarisi.',
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
        ['row justify-content-center', 'row text-center', 'mx-auto har ustunga', 'row center'],
        [0],
      ),
      'Flex utilitasi.',
    ),
    why(tf('q3', 'BS4 da lg 992px dan boshlanadi.', true), 'xl — 1200px.'),
  ]),
  'grid-xlarge': miniQuiz([
    why(
      codeFill(
        'q1',
        'xl da 4 tadan.',
        '<div id="katalog" class="row row-cols-1 row-cols-lg-3 {{1}}">',
        ['row-cols-xl-4'],
      ),
      'Ustunlar oddiy `col`.',
    ),
    why(
      q('q2', '`row-cols` bilan har kurs bloki qanday?', ['col', 'col-3', 'col-xl-3', 'card'], [0]),
      'Soni qatorda beriladi.',
    ),
    why(tf('q3', 'xl BS4 da 1200px dan.', true), 'Eng katta sinf.'),
  ]),
  'grid-examples': miniQuiz([
    why(
      codeFill('q1', 'Statistika bloki.', '<div class="col-6 {{1}} mb-3">', ['col-lg-3']),
      'Telefonda 2, noutbukda 4.',
    ),
    why(
      q('q2', 'Bloklar ostidagi bo‘shliq?', ['mb-3', 'pb-0', 'mt-0', 'gutter'], [0]),
      'Pastki margin.',
    ),
    why(
      tf('q3', 'Dashboard maketi ham 12 ustunli setka bilan quriladi.', true),
      'Barcha sinflar birga.',
    ),
  ]),
};
