import { codeFill, match, miniQuiz, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the Bootstrap 3 course: three self-check questions per exercise. */
export const BS3_MINI_QUIZZES: Record<string, QuizDef> = {
  'get-started': miniQuiz([
    why(
      q(
        'q1',
        'Bootstrap CSS havolasi qayerga qo‘yiladi?',
        ['<head> ichiga', '<body> oxiriga', '<footer> ga', 'CSS fayl ichiga'],
        [0],
      ),
      'Uslub sahifa chizilishidan oldin kerak.',
    ),
    why(
      order('q2', '`</body>` dan oldin skriptlar tartibi.', ['jQuery', 'bootstrap.min.js']),
      'BS3 plaginlari jQuery’ga tayanadi.',
    ),
    why(
      tf('q3', 'Viewport meta tegi bo‘lmasa, telefonda setka to‘g‘ri ishlamaydi.', true),
      'Telefon sahifani kichraytirib ko‘rsatadi.',
    ),
  ]),
  'grid-basic': miniQuiz([
    why(
      codeFill('q1', 'Planshetdan uch teng ustun.', '<div class="{{1}}">…</div>', ['col-sm-4']),
      '3 × 4 = 12.',
    ),
    why(
      order('q2', 'Setka tuzilmasi.', ['.container', '.row', '.col-sm-4']),
      'Ustunlar faqat qator ichida.',
    ),
    why(
      tf('q3', 'Telefonda `col-sm-4` bloklar ustma-ust turadi.', true),
      'sm 768px dan boshlanadi.',
    ),
  ]),
  typography: miniQuiz([
    why(
      codeFill('q1', 'Sarlavhani markazga.', '<h1 class="{{1}}">Kutubxona</h1>', ['text-center']),
      'Matn tekislash klassi.',
    ),
    why(
      q(
        'q2',
        'Sarlavhadagi ikkilamchi matn?',
        ['<small>', '<sub>', '<span class="lead">', '<i>'],
        [0],
      ),
      'Och rangda chiqadi.',
    ),
    why(
      match('q3', 'Klassni vazifasi bilan moslang.', [
        ['.lead', 'Kirish paragrafi'],
        ['.list-unstyled', 'Belgisiz ro‘yxat'],
      ]),
      'Tipografiya klasslari.',
    ),
  ]),
  tables: miniQuiz([
    why(
      sortInto('q1', 'Mashqdagi jadval klasslari.', {
        Kerak: ['table', 'table-striped', 'table-bordered', 'table-hover'],
        'Kerak emas': ['table-dark'],
      }),
      '`table-dark` — BS4 klassi.',
    ),
    why(
      q(
        'q2',
        '“O‘tmadi” qatorini qizil qilish (BS3)?',
        ['class="danger"', 'class="table-danger"', 'class="red"', 'class="bg-danger-row"'],
        [0],
      ),
      'BS3 kontekstli qatorlari.',
    ),
    why(tf('q3', 'Qo‘shimcha klasslar asosiy `table` siz ishlamaydi.', true), 'Avval `table`.'),
  ]),
  images: miniQuiz([
    why(
      codeFill(
        'q1',
        'Rasm konteynerdan chiqmasin (BS3).',
        '<img id="banner" class="{{1}}" src="…" alt="…">',
        ['img-responsive'],
      ),
      'BS4 da `img-fluid`.',
    ),
    why(
      match('q2', 'Talabni klass bilan moslang.', [
        ['Avatar doira', 'img-circle'],
        ['Ramkali rasm', 'img-thumbnail'],
        ['Yumaloq burchak', 'img-rounded'],
      ]),
      'Rasm shakllari.',
    ),
    why(
      tf('q3', 'Klassdan qat’i nazar rasmga `alt` kerak.', true),
      'Klass — ko‘rinish, alt — ma’no.',
    ),
  ]),
  jumbotron: miniQuiz([
    why(
      codeFill('q1', 'Banner.', '<div id="banner" class="{{1}}">…</div>', ['jumbotron']),
      'Katta e’lon bloki.',
    ),
    why(
      codeFill('q2', 'Sarlavha bloki.', '<div id="sarlavha" class="{{1}}">', ['page-header']),
      'Pastki chiziq bilan ajratadi.',
    ),
    why(tf('q3', 'Jumbotron sahifadagi eng asosiy xabar uchun.', true), 'Bitta bo‘lgani ma’qul.'),
  ]),
  wells: miniQuiz([
    why(
      match('q1', 'Talabni klass bilan moslang.', [
        ['Katta well', 'well well-lg'],
        ['Kichik well', 'well well-sm'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(tf('q2', 'Well BS4 da olib tashlangan.', true), 'O‘rniga `.card`.'),
    why(
      q(
        'q3',
        'Well qanday ko‘rinadi?',
        ['Kulrang fonli botiq blok', 'Yashil xabar', 'Doira', 'Tugma'],
        [0],
      ),
      'Ichki soya bilan.',
    ),
  ]),
  alerts: miniQuiz([
    why(
      match('q1', 'Xabarni klass bilan moslang.', [
        ['Saqlandi', 'alert alert-success'],
        ['Xato', 'alert alert-danger'],
        ['Yangilik', 'alert alert-info'],
      ]),
      'Rang ma’noga mos.',
    ),
    why(
      codeFill(
        'q2',
        'Yopish tugmasi.',
        '<button type="button" class="close" data-dismiss="{{1}}">&times;</button>',
        ['alert'],
      ),
      'jQuery plagini yopadi.',
    ),
    why(
      tf('q3', 'Yopiladigan alertga `alert-dismissible` klassi qo‘shiladi.', true),
      'Tugma uchun joy.',
    ),
  ]),
  buttons: miniQuiz([
    why(
      codeFill(
        'q1',
        'Yashil katta tugma.',
        '<button id="tasdiq" class="btn btn-success {{1}}">Tasdiqlash</button>',
        ['btn-lg'],
      ),
      'O‘lcham klassi.',
    ),
    why(
      q(
        'q2',
        'Havolani oddiy tugma ko‘rinishiga (BS3)?',
        ['btn btn-default', 'btn btn-secondary', 'btn-link', 'button'],
        [0],
      ),
      'BS3 dagi oddiy tugma.',
    ),
    why(
      tf('q3', '`btn` klassi `<a>` ga ham berilishi mumkin.', true),
      '`role="button"` qo‘shish yaxshi.',
    ),
  ]),
  'button-groups': miniQuiz([
    why(
      codeFill(
        'q1',
        'Gorizontal guruh.',
        '<div id="tekislash" class="btn-group" role="{{1}}" aria-label="Tekislash">',
        ['group'],
      ),
      'Ekran o‘quvchi guruhni tanidi.',
    ),
    why(
      codeFill('q2', 'Vertikal guruh.', '<div id="bolimlar" class="{{1}}">', [
        'btn-group-vertical',
      ]),
      'Tugmalar ustma-ust.',
    ),
    why(
      tf('q3', 'Bir nechta guruhni bir qatorga `btn-toolbar` yig‘adi.', true),
      'Panel ko‘rinishi.',
    ),
  ]),
  glyphicons: miniQuiz([
    why(
      codeFill(
        'q1',
        'Ikonka ekran o‘quvchidan yashirin.',
        '<span class="glyphicon glyphicon-pencil" aria-hidden="{{1}}"></span>',
        ['true'],
      ),
      'Ma’no tugma matnida.',
    ),
    why(
      q(
        'q2',
        'Ikonka qayerga qo‘yiladi?',
        [
          'Tugma matnidan oldin, alohida span’da',
          'Matn ichiga',
          'class ni tugmaning o‘ziga',
          'title ga',
        ],
        [0],
      ),
      'Ikonka elementini aralashtirmang.',
    ),
    why(
      tf('q3', 'Har doim ikki klass yoziladi: `glyphicon` va `glyphicon-NOMI`.', true),
      'Masalan, `glyphicon glyphicon-trash`.',
    ),
  ]),
  'badges-labels': miniQuiz([
    why(
      match('q1', 'Komponentni ishlatilishi bilan moslang.', [
        ['label label-success', '“Yangi” yorlig‘i'],
        ['badge', 'Son ko‘rsatkichi'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(tf('q2', 'BS4 da `.label` o‘rnini `.badge` egalladi.', true), 'BS3 → BS4 ko‘chishda.'),
    why(
      q(
        'q3',
        'Badge sonining ma’nosini ekran o‘quvchiga aytish?',
        ['<span class="sr-only">ta xabar</span>', 'title', 'Rang', 'Kerak emas'],
        [0],
      ),
      'Yashirin matn.',
    ),
  ]),
  'progress-bars': miniQuiz([
    why(
      codeFill(
        'q1',
        'Yashil bar.',
        '<div class="progress">\n  <div class="progress-bar {{1}}" style="width: 80%">80%</div>\n</div>',
        ['progress-bar-success'],
      ),
      'BS3 rang klassi.',
    ),
    why(
      q(
        'q2',
        'Bar kengligi qanday beriladi?',
        ['style="width: 80%"', 'class="w-80"', 'data-width', 'value="80"'],
        [0],
      ),
      'Inline uslub.',
    ),
    why(tf('q3', 'Chiziqli bar uchun `progress-bar-striped`.', true), 'Harakat uchun `active`.'),
  ]),
  pagination: miniQuiz([
    why(
      codeFill('q1', 'Joriy sahifa.', '<li class="{{1}}"><a href="#">2</a></li>', ['active']),
      '`<li>` ga beriladi.',
    ),
    why(
      q(
        'q2',
        'Bosib bo‘lmaydigan “«”?',
        ['class="disabled"', 'class="off"', 'hidden', 'class="inactive"'],
        [0],
      ),
      'Birinchi sahifada.',
    ),
    why(tf('q3', 'Sahifalash `<ul class="pagination">` ro‘yxati.', true), 'Bandlar `<li>`.'),
  ]),
  pager: miniQuiz([
    why(
      match('q1', 'Bandni klass bilan moslang.', [
        ['Oldingi dars (chapda)', 'previous'],
        ['Keyingi dars (o‘ngda)', 'next'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      codeFill('q2', 'Ro‘yxat klassi.', '<ul id="darslar" class="{{1}}">', ['pager']),
      'Ikki tugmali o‘tish.',
    ),
    why(tf('q3', 'Pager BS4 da yo‘q.', true), 'Pagination ishlatiladi.'),
  ]),
  'list-groups': miniQuiz([
    why(
      codeFill('q1', 'Havolali band.', '<a href="#" class="{{1}} active">Profil</a>', [
        'list-group-item',
      ]),
      '`<div class="list-group">` ichida.',
    ),
    why(
      q(
        'q2',
        'Bandga son?',
        ['<span class="badge">3</span>', 'class="count"', 'data-badge', 'title'],
        [0],
      ),
      'Badge o‘ngga suriladi.',
    ),
    why(tf('q3', 'Joriy bandga `active` beriladi.', true), 'Kabinet menyusi.'),
  ]),
  panels: miniQuiz([
    why(
      order('q1', 'Panel qismlari.', ['panel-heading', 'panel-body', 'panel-footer']),
      'Yuqoridan pastga.',
    ),
    why(
      codeFill('q2', 'Ko‘k panel.', '<div id="kurs" class="panel {{1}}">', ['panel-primary']),
      'Rang klassi.',
    ),
    why(
      q('q3', 'Sarlavhadagi `h3` ga?', ['panel-title', 'card-title', 'page-header', 'lead'], [0]),
      'Panel sarlavhasi uslubi.',
    ),
  ]),
  dropdowns: miniQuiz([
    why(
      codeFill(
        'q1',
        'Menyuni ochuvchi atribut.',
        '<button class="btn btn-default dropdown-toggle" data-toggle="{{1}}">',
        ['dropdown'],
      ),
      'jQuery plagini.',
    ),
    why(
      tf('q2', '`aria-haspopup="true"` tugma menyu ochishini bildiradi.', true),
      'Ekran o‘quvchi uchun.',
    ),
    why(
      q('q3', 'Menyu ro‘yxati klassi?', ['dropdown-menu', 'dropdown-list', 'menu', 'nav'], [0]),
      '`<ul class="dropdown-menu">`.',
    ),
  ]),
  collapse: miniQuiz([
    why(
      codeFill('q1', 'Blok boshida yashirin.', '<div id="batafsil" class="{{1}}">', ['collapse']),
      'Ochilganda `in` qo‘shiladi.',
    ),
    why(
      codeFill(
        'q2',
        'Tugma blokni ochsin.',
        '<button data-toggle="collapse" data-target="{{1}}">Batafsil</button>',
        ['#batafsil'],
      ),
      'Selektor `#` bilan.',
    ),
    why(
      tf('q3', '`aria-expanded` ochiq/yopiq holatni bildiradi.', true),
      'Bootstrap uni yangilaydi.',
    ),
  ]),
  'tabs-pills': miniQuiz([
    why(
      codeFill('q1', 'Yorliq havolasi.', '<a href="#tavsif" data-toggle="{{1}}">Tavsif</a>', [
        'tab',
      ]),
      'Pills uchun `pill`.',
    ),
    why(
      q(
        'q2',
        'Kontent panellari o‘rami?',
        ['tab-content ichida tab-pane', 'nav ichida', 'panel-body', 'well'],
        [0],
      ),
      'Har pane id li.',
    ),
    why(
      tf('q3', 'Birinchi yorliq va paneli `active` bo‘ladi.', true),
      'Sahifa ochilganda ko‘rinadi.',
    ),
  ]),
  navbar: miniQuiz([
    why(
      codeFill('q1', 'Qorong‘i navbar.', '<nav id="panel" class="navbar {{1}}">', [
        'navbar-inverse',
      ]),
      'Och — `navbar-default`.',
    ),
    why(
      match('q2', 'Qismni klass bilan moslang.', [
        ['Logo havolasi', 'navbar-brand'],
        ['Menyu ro‘yxati', 'nav navbar-nav'],
        ['Yig‘iladigan qism', 'collapse navbar-collapse'],
      ]),
      'Navbar tuzilmasi.',
    ),
    why(
      tf('q3', 'Telefondagi “☰” tugmasi `data-toggle="collapse"` bilan menyuni ochadi.', true),
      '`navbar-toggle` tugmasi.',
    ),
  ]),
  forms: miniQuiz([
    why(
      codeFill('q1', 'Gorizontal forma.', '<form class="{{1}}">', ['form-horizontal']),
      'Yorliq va maydon yonma-yon.',
    ),
    why(
      codeFill('q2', 'Yorliq.', '<label class="{{1}} col-sm-2" for="ism">Ism</label>', [
        'control-label',
      ]),
      'Maydon `col-sm-10` ichida.',
    ),
    why(tf('q3', 'Har guruh `form-group` ichida.', true), 'Qatorlar oralig‘i.'),
  ]),
  inputs: miniQuiz([
    why(
      codeFill('q1', 'Email maydoni.', '<input type="email" class="{{1}}" id="email">', [
        'form-control',
      ]),
      'To‘liq kenglik va uslub.',
    ),
    why(
      q(
        'q2',
        'Textarea balandligi 3 qator?',
        ['rows="3"', 'height="3"', 'size="3"', 'lines="3"'],
        [0],
      ),
      'HTML atributi.',
    ),
    why(
      tf('q3', '`select` ga ham `form-control` beriladi.', true),
      'Matn maydonlari bilan bir xil.',
    ),
  ]),
  'inputs-2': miniQuiz([
    why(
      codeFill('q1', 'Faqat o‘qish uchun.', '<input id="raqam" class="form-control" {{1}}>', [
        'readonly',
      ]),
      'Yuboriladi, lekin o‘zgarmaydi.',
    ),
    why(
      codeFill('q2', 'Xato holati.', '<div id="emailGuruh" class="form-group {{1}}">', [
        'has-error',
      ]),
      'Yorliq va maydon qizil.',
    ),
    why(
      q(
        'q3',
        'Maydon ostidagi tushuntirish?',
        ['<span class="help-block">', '<small class="form-text">', '<p class="lead">', 'title'],
        [0],
      ),
      'BS3 yordamchi matni.',
    ),
  ]),
  'input-sizing': miniQuiz([
    why(
      codeFill('q1', 'Katta maydon.', '<input id="qidiruv" class="form-control {{1}}">', [
        'input-lg',
      ]),
      'BS4 da `form-control-lg`.',
    ),
    why(
      codeFill(
        'q2',
        'Qo‘shimcha belgi.',
        '<div class="input-group">\n  <span class="{{1}}">@</span>\n  <input id="login" class="form-control">\n</div>',
        ['input-group-addon'],
      ),
      'BS3 dagi qo‘shimcha.',
    ),
    why(
      tf('q3', 'Maydon kengligini setka ustuni (`col-*`) bilan cheklash mumkin.', true),
      'Ustun ichiga joylanadi.',
    ),
  ]),
  'media-objects': miniQuiz([
    why(
      order('q1', 'Media tuzilmasi.', ['media', 'media-left', 'media-body']),
      'Rasm chapda, matn o‘ngda.',
    ),
    why(
      codeFill('q2', 'Sarlavha.', '<h4 class="{{1}}">Dilnoza</h4>', ['media-heading']),
      '`media-body` ichida.',
    ),
    why(
      tf('q3', 'Javobni boshqa `media` ning `media-body` siga joylash mumkin.', true),
      'Ichma-ich sharhlar.',
    ),
  ]),
  carousel: miniQuiz([
    why(
      codeFill(
        'q1',
        'Karusel avtomatik boshlansin.',
        '<div id="slayder" class="carousel slide" data-ride="{{1}}">',
        ['carousel'],
      ),
      'jQuery plagini.',
    ),
    why(
      q('q2', 'BS3 da bitta slayd klassi?', ['item', 'carousel-item', 'slide', 'frame'], [0]),
      'BS4 da `carousel-item`.',
    ),
    why(tf('q3', 'Bitta slayd `active` bo‘lishi kerak.', true), 'Aks holda karusel ko‘rinmaydi.'),
  ]),
  modal: miniQuiz([
    why(
      order('q1', 'Modal bloklari tartibi.', [
        'modal-dialog',
        'modal-content',
        'modal-header',
        'modal-body',
        'modal-footer',
      ]),
      'Tashqaridan ichkariga va yuqoridan pastga.',
    ),
    why(
      codeFill(
        'q2',
        'Yopish tugmasi.',
        '<button type="button" data-dismiss="{{1}}">Yopish</button>',
        ['modal'],
      ),
      'jQuery plagini yopadi.',
    ),
    why(
      tf('q3', '`modal fade` ochilish animatsiyasini beradi.', true),
      '`fade` — xiralashib chiqish.',
    ),
  ]),
  tooltip: miniQuiz([
    why(
      codeFill(
        'q1',
        'Tooltip pastda.',
        '<button id="tahrir" data-toggle="tooltip" data-placement="{{1}}" title="Tahrirlash">',
        ['bottom'],
      ),
      'Joylashuv atributi.',
    ),
    why(
      codeFill('q2', 'Tooltiplarni yoqing.', '$(\'[data-toggle="tooltip"]\').{{1}}();', [
        'tooltip',
      ]),
      'O‘zi yoqilmaydi.',
    ),
    why(tf('q3', 'Tooltip matni `title` atributidan olinadi.', true), 'Qisqa izoh.'),
  ]),
  popover: miniQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['title', 'Popover sarlavhasi'],
        ['data-content', 'Popover matni'],
        ['data-toggle="popover"', 'Element popover ochadi'],
      ]),
      'Har biri o‘z vazifasiga mos keladi.',
    ),
    why(
      codeFill('q2', 'Popoverlarni yoqing.', '$(\'[data-toggle="popover"]\').{{1}}();', [
        'popover',
      ]),
      'Yoqish shart.',
    ),
    why(
      tf('q3', 'Popover tooltipdan kattaroq (sarlavha va matn bilan).', true),
      'Bosish bilan ochiladi.',
    ),
  ]),
  scrollspy: miniQuiz([
    why(
      codeFill(
        'q1',
        'Blokni kuzating.',
        '<div id="kontent" data-spy="{{1}}" data-target="#mundarija">',
        ['scroll'],
      ),
      'Menyu bandi avtomatik faol bo‘ladi.',
    ),
    why(
      tf('q2', 'Kuzatiladigan ichki blokka balandlik va `overflow-y: scroll` kerak.', true),
      'Aks holda u aylanmaydi.',
    ),
    why(
      q(
        'q3',
        'Menyu havolalari qanday ko‘rinishda?',
        ['#bolim-id', 'bolim.html', '/bolim', 'javascript:'],
        [0],
      ),
      'Bo‘limlar id ga bog‘lanadi.',
    ),
  ]),
  affix: miniQuiz([
    why(
      codeFill(
        'q1',
        '150px dan keyin yopishsin.',
        '<nav id="menyu" data-spy="affix" data-offset-top="{{1}}">',
        ['150'],
      ),
      'Shu nuqtadan `.affix` qo‘shiladi.',
    ),
    why(
      q(
        'q2',
        '`.affix` uchun CSS?',
        ['top: 0; width: 100%; z-index', 'float: top', 'position: static', 'display: none'],
        [0],
      ),
      'Plagin `position: fixed` beradi.',
    ),
    why(
      tf('q3', 'Bugun bunday effekt `position: sticky` bilan JS’siz qilinadi.', true),
      'Affix BS4 da olib tashlangan.',
    ),
  ]),
  filters: miniQuiz([
    why(
      codeFill('q1', 'Har yozilganda.', "$('#qidiruv').on('{{1}}', function () { … });", ['input']),
      'Har belgi kiritilganda.',
    ),
    why(
      q(
        'q2',
        'Katta-kichik harfsiz qidiruv?',
        [
          'Ikkala matnni toLowerCase() qilib solishtirish',
          'toUpperCase faqat qidiruvga',
          '=== bilan',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Bir xil registr.',
    ),
    why(
      tf('q3', 'Mos kelmagan qatorlar yashiriladi, mos kelganlar ko‘rinadi.', true),
      'jQuery `.toggle(bool)`.',
    ),
  ]),
  'grid-system': miniQuiz([
    why(
      codeFill('q1', '6 ustun va markazda.', '<div id="forma" class="col-md-6 {{1}}">', [
        'col-md-offset-3',
      ]),
      '3 + 6 + 3 = 12.',
    ),
    why(
      q(
        'q2',
        '`col-md-push-3` nima qiladi?',
        [
          'Ustunni vizual 3 ustun o‘ngga suradi',
          'Kengligini 3 qiladi',
          'Yashiradi',
          'Pastga suradi',
        ],
        [0],
      ),
      '`pull` bilan joy almashadi.',
    ),
    why(
      tf('q3', 'push/pull HTML tartibini o‘zgartirmasdan ko‘rinish tartibini almashtiradi.', true),
      'Masalan, asosiy kontent HTML’da birinchi.',
    ),
  ]),
  'grid-stacked': miniQuiz([
    why(
      codeFill('q1', 'Planshetdan teng yarim.', '<div class="{{1}}">…</div>', ['col-sm-6']),
      '6 + 6 = 12.',
    ),
    why(
      q('q2', 'Uch blok planshetdan teng?', ['col-sm-4', 'col-sm-3', 'col-xs-4', 'col-md-6'], [0]),
      'Uch ustun: 3 × 4 = 12.',
    ),
    why(tf('q3', 'Telefonda bu bloklar ustma-ust.', true), 'sm dan torroq ekranda 100%.'),
  ]),
  'grid-small': miniQuiz([
    why(
      codeFill(
        'q1',
        'Telefonda ikkitadan, planshetdan to‘rttadan.',
        '<div class="col-xs-6 {{1}}">',
        ['col-sm-3'],
      ),
      '2 × 6 va 4 × 3.',
    ),
    why(
      q('q2', 'Telefon sinfi (BS3)?', ['xs', 'sm', 'md', 'lg'], [0]),
      'xs — 768px dan tor ekran.',
    ),
    why(
      tf('q3', 'Ikki sinf birga yozilsa, har ekranda o‘zinikisi ishlaydi.', true),
      'Kattaroq sinf kichigini bekor qiladi.',
    ),
  ]),
  'grid-medium': miniQuiz([
    why(
      codeFill('q1', 'Planshetda ikki, noutbukda to‘rt.', '<div class="col-sm-6 {{1}}">', [
        'col-md-3',
      ]),
      'md ≥ 992px.',
    ),
    why(
      q(
        'q2',
        'Banner faqat noutbuk va kattada ko‘rinsin (BS3)?',
        ['hidden-xs hidden-sm', 'visible-xs', 'd-none d-md-block', 'hidden-md'],
        [0],
      ),
      'BS3 ko‘rinish klasslari.',
    ),
    why(tf('q3', '`hidden-xs` telefonda yashiradi.', true), 'xs — telefon.'),
  ]),
  'grid-large': miniQuiz([
    why(
      codeFill('q1', 'Katta monitorda to‘rttadan.', '<div class="col-md-6 {{1}}">', ['col-lg-3']),
      'lg ≥ 1200px.',
    ),
    why(
      q(
        'q2',
        'Maqola juda keng bo‘lmasligi uchun katta ekranda?',
        ['col-lg-8 col-lg-offset-2', 'col-lg-12', 'container-fluid', 'width: 100%'],
        [0],
      ),
      'O‘qishga qulay kenglik.',
    ),
    why(
      tf('q3', 'Faqat `col-lg-*` yozilsa, noutbukda (992px) ustun to‘liq kenglikda.', true),
      'lg 1200px dan.',
    ),
  ]),
  'grid-examples': miniQuiz([
    why(
      codeFill('q1', 'Kurs ustuni.', '<div class="col-xs-12 col-sm-6 {{1}}">', ['col-md-3']),
      'Telefonda 1, planshetda 2, noutbukda 4.',
    ),
    why(
      q('q2', 'Ichki kartochka (BS3)?', ['thumbnail', 'card', 'panel-body', 'well-sm'], [0]),
      'Rasm va matnli blok.',
    ),
    why(
      tf('q3', '`visible-xs-block` faqat telefonda ko‘rinadi.', true),
      'Telefon uchun maxsus blok.',
    ),
  ]),
  templates: miniQuiz([
    why(
      q(
        'q1',
        'O‘z uslubingiz Bootstrap’ni yengishi uchun `style.css` qayerda ulanadi?',
        ['Bootstrap’dan keyin', 'Bootstrap’dan oldin', 'body oxirida', 'Farqi yo‘q'],
        [0],
      ),
      'Teng maxsuslikda keyingi qoida ustun.',
    ),
    why(
      tf('q2', '`bootstrap.min.css` faylini to‘g‘ridan-to‘g‘ri tahrirlash yaxshi.', false),
      'Yangilanganda o‘zgarishlar yo‘qoladi.',
    ),
    why(
      codeFill('q3', 'Navbar fonini o‘zgartiring.', '.navbar-inverse {\n  {{1}}: #0e1133;\n}', [
        'background-color',
      ]),
      'O‘z CSS faylingizda.',
    ),
  ]),
  'theme-personal': miniQuiz([
    why(
      codeFill('q1', 'Portret doira.', '<img class="{{1}}" src="men.jpg" alt="Portretim">', [
        'img-circle',
      ]),
      'BS3 rasm klassi.',
    ),
    why(
      q('q2', 'Kasb paragrafini ajratish?', ['lead', 'h1', 'small', 'badge'], [0]),
      'Kirish matni.',
    ),
    why(tf('q3', 'Bosh blok matni `text-center` bilan markazlanadi.', true), 'Rezyume sarlavhasi.'),
  ]),
  'theme-company': miniQuiz([
    why(
      codeFill(
        'q1',
        'Navbar yuqoriga mahkamlansin.',
        '<nav id="menyu" class="navbar navbar-default {{1}}">',
        ['navbar-fixed-top'],
      ),
      'Aylantirganda doim ko‘rinadi.',
    ),
    why(
      q(
        'q2',
        'Nega `body { padding-top: 50px; }`?',
        [
          'Kontent mahkamlangan navbar ostida qolmasligi uchun',
          'Rang uchun',
          'Shrift uchun',
          'Kerak emas',
        ],
        [0],
      ),
      'Navbar oqimdan chiqadi.',
    ),
    why(tf('q3', 'Navbar balandligi taxminan 50px.', true), 'Shuning uchun 50px padding.'),
  ]),
  'theme-band': miniQuiz([
    why(
      codeFill('q1', 'Karusel.', '<div id="slayder" class="carousel slide" data-ride="{{1}}">', [
        'carousel',
      ]),
      'Avtomatik aylanadi.',
    ),
    why(
      q('q2', 'Birinchi slayd?', ['item active', 'item first', 'carousel-item', 'slide-1'], [0]),
      'BS3 da `item`.',
    ),
    why(tf('q3', 'Slaydlar `carousel-inner` o‘ramida.', true), 'Karusel tuzilmasi.'),
  ]),
};
