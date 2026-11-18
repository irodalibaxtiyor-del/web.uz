import { codeFill, lessonQuiz, match, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Per-lesson tests of the Bootstrap 4 course (lessons that close a module keep their module quiz). */
export const BS4_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. Tanishuv ----------------------------------------------------------------
  home: lessonQuiz([
    why(
      sortInto('q1', 'Bootstrap 3 dan 4 ga nima o‘zgardi?', {
        'Yangi (BS4)': [
          'Flexbox asosidagi setka',
          '.card komponenti',
          'd-flex, p-3 kabi utilitalar',
        ],
        'Olib tashlangan': ['Glyphicons', '.panel va .well', 'Pager'],
      }),
      'BS4 Flexbox’ga o‘tdi va ko‘plab utilita klasslar qo‘shdi.',
    ),
    why(
      codeFill(
        'q2',
        'Elementlarni flex qatorga joylang.',
        '<div class="{{1}} justify-content-between">',
        ['d-flex'],
      ),
      '`d-flex` — `display: flex` utilitasi.',
    ),
    why(
      tf('q3', 'Bootstrap 4 ning JS plaginlari hali ham jQuery’ga tayanadi.', true),
      'jQuery’dan butunlay voz kechish Bootstrap 5 da bo‘ldi.',
    ),
    why(
      q(
        'q4',
        '`p-3` klassi nima beradi?',
        [
          'Ichki bo‘shliq (padding) — 3-daraja',
          'Paragraf uslubi',
          '3 ta ustun',
          'Shrift o‘lchami 3',
        ],
        [0],
      ),
      'Utilita klasslar bitta CSS xususiyatini beradi.',
    ),
  ]),
  'get-started': lessonQuiz([
    why(
      order('q1', 'Skriptlarni ulanish tartibida joylang.', [
        'jquery.slim.min.js',
        'bootstrap.bundle.min.js',
      ]),
      'Avval jQuery, keyin Bootstrap.',
    ),
    why(
      q(
        'q2',
        '`bootstrap.bundle.min.js` ichida nima bor?',
        ['Bootstrap plaginlari va Popper', 'Faqat CSS', 'jQuery', 'Ikonkalar'],
        [0],
      ),
      'Popper — dropdown, tooltip va popover joylashuvi uchun. Bundle bo‘lsa Popper alohida ulanmaydi.',
    ),
    why(
      sortInto('q3', 'Reboot nima qiladi?', {
        Qiladi: [
          'Barcha elementlarga box-sizing: border-box',
          'body margin’ini olib tashlaydi',
          'Tizim shrifti va 16px o‘lcham',
        ],
        Qilmaydi: ['Sahifaga setka chizadi'],
      }),
      'Reboot brauzerlar orasidagi farqlarni tekislaydi.',
    ),
    why(
      tf('q4', '`bootstrap.min.js` va `bootstrap.bundle.min.js` ni birga ulash kerak.', false),
      'Bittasini tanlang — ikkalasi birga ziddiyat beradi.',
    ),
  ]),
  containers: lessonQuiz([
    why(
      match('q1', 'Ekran kengligini `.container` maksimal kengligi bilan moslang.', [
        ['< 576px', '100%'],
        ['≥ 576px (sm)', '540px'],
        ['≥ 768px (md)', '720px'],
        ['≥ 1200px (xl)', '1140px'],
      ]),
      'lg (≥ 992px) — 960px.',
    ),
    why(
      codeFill('q2', 'lg gacha to‘liq kenglikda, keyin qat’iy konteyner.', '<div class="{{1}}">', [
        'container-lg',
      ]),
      'Moslashuvchan konteynerlar: `.container-sm`, `-md`, `-lg`, `-xl`.',
    ),
    why(
      q(
        'q3',
        'Butun ekran kengligidagi konteyner?',
        ['.container-fluid', '.container-full', '.container-xl', '.row'],
        [0],
      ),
      'Fon bo‘ylab cho‘zilgan bo‘limlar uchun.',
    ),
    why(
      tf('q4', 'Konteynerga `bg-dark`, `text-white`, `p-3` kabi utilitalar qo‘shish mumkin.', true),
      'Lekin ko‘pincha rang ichki o‘ramga beriladi.',
    ),
  ]),

  // ---- 2. Matn, ranglar va jadvallar ------------------------------------------------
  typography: lessonQuiz([
    why(
      order('q1', 'Display sarlavhalarni eng kattasidan tartiblang.', [
        'display-1',
        'display-2',
        'display-3',
        'display-4',
      ]),
      'BS4 da display sarlavhalar 1–4.',
    ),
    why(
      codeFill(
        'q2',
        'Iqtibos manbasini yozing.',
        '<blockquote class="blockquote">\n  <p>Ilm — nur.</p>\n  <footer class="{{1}}">Xalq maqoli</footer>\n</blockquote>',
        ['blockquote-footer'],
      ),
      'BS4 da iqtibosga `.blockquote` klassi kerak.',
    ),
    why(
      match('q3', 'Klassni vazifasi bilan moslang.', [
        ['.lead', 'Kirish paragrafi'],
        ['.text-muted', 'Och kulrang ikkilamchi matn'],
        ['.initialism', 'Qisqartmani kichikroq bosh harflar bilan'],
        ['.list-inline-item', 'Bir qatordagi ro‘yxat bandi'],
      ]),
      'BS4 da `.list-inline` bandlariga ham klass beriladi.',
    ),
    why(
      tf('q4', 'Bootstrap 4 da matnni o‘ngga tekislash klassi — `.text-right`.', true),
      'BS5 da `.text-end` ga o‘zgargan.',
    ),
  ]),
  colors: lessonQuiz([
    why(
      match('q1', 'Klassni vazifasi bilan moslang.', [
        ['.text-danger', 'Qizil matn'],
        ['.bg-warning', 'Sariq fon'],
        ['.text-white-50', 'Yarim shaffof oq matn'],
        ['.text-muted', 'Ikkilamchi kulrang matn'],
      ]),
      'Ranglar ma’noga ega: primary, success, danger, warning, info…',
    ),
    why(
      q(
        'q2',
        '`bg-warning` (sariq) fonda qaysi matn rangi o‘qiladi?',
        ['text-dark', 'text-white', 'text-warning', 'text-light'],
        [0],
      ),
      'Och fonda to‘q matn — kontrast yetarli bo‘lishi kerak.',
    ),
    why(
      tf('q3', 'Xato holatini faqat `text-danger` rangi bilan ko‘rsatish yetarli.', false),
      'Rang yagona belgi bo‘lmasin: matn yoki ikonka ham kerak.',
    ),
    why(
      codeFill('q4', 'Ko‘k fon va oq matn.', '<div class="{{1}} text-white p-3">', ['bg-primary']),
      '`bg-*` klasslari fon rangini beradi.',
    ),
  ]),
  tables: lessonQuiz([
    why(
      match('q1', 'Klassni natijasi bilan moslang.', [
        ['.table-dark', 'Qorong‘i jadval'],
        ['.thead-light', 'Och rangli sarlavha qatori'],
        ['.table-success', 'Yashil qator yoki katak'],
        ['.table-hover', 'Sichqoncha ustidagi qator ajraladi'],
      ]),
      'BS3 dagi `.success` o‘rniga BS4 da `.table-success`.',
    ),
    why(
      codeFill(
        'q2',
        'Kichik ekranda aylantiriladigan jadval.',
        '<div class="{{1}}">\n  <table class="table">…</table>\n</div>',
        ['table-responsive'],
      ),
      'O‘ram jadvalni gorizontal aylantiradi.',
    ),
    why(
      q(
        'q3',
        'Jadval nomi qaysi teg bilan yoziladi?',
        ['<caption>', '<thead>', '<th>', '<title>'],
        [0],
      ),
      'Ekran o‘qiydigan dastur jadval nomini e’lon qiladi.',
    ),
    why(
      tf('q4', 'Qo‘shimcha klasslar (`table-striped`) asosiy `.table` siz ham ishlaydi.', false),
      'Avval `.table`, keyin qo‘shimchalar.',
    ),
  ]),
  images: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Moslashuvchan rasm (BS4).',
        '<img src="rasm.jpg" class="{{1}}" alt="Registon">',
        ['img-fluid'],
      ),
      'BS3 dagi `.img-responsive` o‘rniga.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.rounded', 'Yumaloq burchaklar'],
        ['.rounded-circle', 'Doira'],
        ['.img-thumbnail', 'Ramkali rasm'],
        ['.float-right', 'O‘ngga suzadi'],
      ]),
      'BS5 da `.float-end`.',
    ),
    why(
      q(
        'q3',
        'Rasmni markazga qo‘yishning BS4 usuli?',
        ['.d-block .mx-auto', '.center-block', '.text-justify', '.float-center'],
        [0],
      ),
      'Yoki ota elementga `.text-center` (rasm inline bo‘lsa).',
    ),
    why(
      order('q4', '`<figure>` tuzilmasini tartiblang.', [
        'figure.figure',
        'img.figure-img',
        'figcaption.figure-caption',
      ]),
      'Rasm va uning izohi.',
    ),
  ]),

  // ---- 3. Xabarlar, tugmalar va belgilar -------------------------------------------
  alerts: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Yopiladigan alert yasang.',
        '<div class="alert alert-warning {{1}} fade show">\n  Diqqat!\n  <button type="button" class="close" data-dismiss="alert">&times;</button>\n</div>',
        ['alert-dismissible'],
      ),
      'BS5 da yopish tugmasi `.btn-close` va `data-bs-dismiss`.',
    ),
    why(
      match('q2', 'Alert ichidagi klassni vazifasi bilan moslang.', [
        ['.alert-heading', 'Alert sarlavhasi'],
        ['.alert-link', 'Alert rangiga mos havola'],
      ]),
      'Alert ichidagi havola matn rangiga moslashadi.',
    ),
    why(
      q(
        'q3',
        'Saqlash muvaffaqiyatli bo‘lgani haqida xabar uchun?',
        ['.alert-success', '.alert-danger', '.alert-dark', '.alert-link'],
        [0],
      ),
      'Rang ma’noga mos bo‘lsin.',
    ),
    why(
      tf(
        'q4',
        'Alert’ga `role="alert"` berish ekran o‘qiydigan dasturga xabarni darhol e’lon qildiradi.',
        true,
      ),
      'Muhim xabarlar uchun.',
    ),
  ]),
  buttons: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Chegarali (outline) qizil tugma.',
        '<button class="btn {{1}}">O‘chirish</button>',
        ['btn-outline-danger'],
      ),
      'Outline — fon shaffof, faqat chegara va matn rangli.',
    ),
    why(
      sortInto('q2', 'Klass qaysi versiyada bor?', {
        'Bootstrap 4': ['btn-secondary', 'btn-outline-primary', 'btn-block'],
        'Faqat Bootstrap 3': ['btn-default', 'btn-xs'],
      }),
      'BS4 da `btn-default` o‘rniga `btn-secondary`/`btn-light`.',
    ),
    why(
      q(
        'q3',
        'Tugma ichidagi kichik aylanuvchi yuklanish belgisi?',
        ['.spinner-border-sm', '.loader', '.glyphicon-refresh', '.progress'],
        [0],
      ),
      'Yuklanayotgan tugmani `disabled` ham qiling.',
    ),
    why(
      tf('q4', '`data-toggle="button"` bosilganda tugmaga `active` klassini qo‘shib-oladi.', true),
      'Almashtiriladigan (toggle) tugma.',
    ),
  ]),
  'button-groups': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Radio tugmalarni tugma ko‘rinishida guruhlang.',
        '<div class="btn-group btn-group-toggle" data-toggle="{{1}}">',
        ['buttons'],
      ),
      'Ichida `<label class="btn"><input type="radio">…</label>`.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.btn-group-vertical', 'Tugmalar ustma-ust'],
        ['.btn-toolbar', 'Bir nechta guruh bir qatorda'],
        ['.btn-group-sm', 'Guruhdagi tugmalar kichik'],
      ]),
      'O‘lcham guruhga beriladi.',
    ),
    why(
      tf('q3', 'Guruh ichida dropdown bo‘lishi uchun ichki `.btn-group` kerak.', true),
      'Ichki guruh dropdown uchun ota bo‘ladi.',
    ),
    why(
      q(
        'q4',
        'Guruhga ekran o‘qiydigan dastur uchun nima beriladi?',
        ['role="group" va aria-label', 'tabindex="-1"', 'title', 'alt'],
        [0],
      ),
      'Toolbar uchun `role="toolbar"`.',
    ),
  ]),
  badges: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tabletka shaklidagi yashil badge (BS4).',
        '<span class="badge {{1}} badge-success">Yangi</span>',
        ['badge-pill'],
      ),
      'BS5 da `rounded-pill` va `bg-success`.',
    ),
    why(
      tf('q2', 'Bootstrap 4 da `.label` olib tashlanib, uning o‘rnini `.badge` egallagan.', true),
      'BS3 dagi `label label-success` → BS4 da `badge badge-success`.',
    ),
    why(
      q(
        'q3',
        'Ro‘yxat bandida sonni o‘ng chetga qo‘yish uchun bandga?',
        [
          'd-flex justify-content-between align-items-center',
          'float-left',
          'text-center',
          'badge-right',
        ],
        [0],
      ),
      'Flex utilitalari bilan.',
    ),
    why(
      q(
        'q4',
        'Bosiladigan badge qanday yoziladi?',
        [
          '<a href="#" class="badge badge-primary">',
          '<button class="badge-link">',
          '<span class="badge" onclick>',
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Havola badge hover holatiga ega.',
    ),
  ]),
  'progress-bars': lessonQuiz([
    why(
      codeFill(
        'q1',
        '70% to‘lgan progress.',
        '<div class="progress">\n  <div class="progress-bar" style="{{1}}: 70%">70%</div>\n</div>',
        ['width'],
      ),
      'Kenglik `style` bilan beriladi.',
    ),
    why(
      match('q2', 'Klassni natijasi bilan moslang.', [
        ['.progress-bar-striped', 'Chiziqli'],
        ['.progress-bar-animated', 'Chiziqlar harakatlanadi'],
        ['.bg-success', 'Yashil chiziq'],
      ]),
      'Animatsiya faqat striped bilan birga.',
    ),
    why(
      tf(
        'q3',
        'Bitta `.progress` ichiga bir nechta `.progress-bar` qo‘yib, qismlarga bo‘lish mumkin.',
        true,
      ),
      'Masalan: o‘tdi / qisman / o‘tmadi.',
    ),
    why(
      q(
        'q4',
        'Progress qiymatini ekran o‘qiydigan dastur uchun qaysi atributlar beradi?',
        [
          'role="progressbar" aria-valuenow aria-valuemin aria-valuemax',
          'alt',
          'title',
          'data-value',
        ],
        [0],
      ),
      'Ko‘rinadigan foiz matni ham foydali.',
    ),
  ]),

  // ---- 4. Navigatsiya va kartalar -------------------------------------------------
  pagination: lessonQuiz([
    why(
      order('q1', 'BS4 sahifalash tuzilmasini tashqaridan ichkariga tartiblang.', [
        'ul.pagination',
        'li.page-item',
        'a.page-link',
      ]),
      'BS4 da band va havolaga alohida klass beriladi.',
    ),
    why(
      codeFill('q2', 'Sahifalashni markazga qo‘ying.', '<ul class="pagination {{1}}">', [
        'justify-content-center',
      ]),
      'Pagination flex konteyner — flex utilitalari ishlaydi.',
    ),
    why(
      tf('q3', 'Bootstrap 4 da alohida Pager komponenti yo‘q.', true),
      'Oldingi/keyingi uchun ham pagination ishlatiladi.',
    ),
    why(
      codeFill('q4', 'Breadcrumb bandi.', '<li class="{{1}} active">HTML</li>', [
        'breadcrumb-item',
      ]),
      'BS4 da breadcrumb bandlariga klass kerak.',
    ),
  ]),
  'list-groups': lessonQuiz([
    why(
      match('q1', 'Klassni natijasi bilan moslang.', [
        ['.list-group-flush', 'Tashqi ramka va burchaklarsiz'],
        ['.list-group-horizontal', 'Bandlar gorizontal'],
        ['.list-group-item-action', 'Bosiladigan band (hover bilan)'],
        ['.list-group-item-danger', 'Qizil band'],
      ]),
      'Flush ko‘pincha card ichida ishlatiladi.',
    ),
    why(
      codeFill('q2', 'Havolali band.', '<a href="#" class="list-group-item {{1}}">Darslar</a>', [
        'list-group-item-action',
      ]),
      'Hover va fokus holatlari qo‘shiladi.',
    ),
    why(
      tf('q3', 'Tanlangan bandga `active`, bosib bo‘lmaydiganiga `disabled` beriladi.', true),
      'Faol bandni `aria-current` bilan ham bildiring.',
    ),
    why(
      q(
        'q4',
        'Bandga badge’ni o‘ng chetga qo‘yish uchun?',
        ['d-flex justify-content-between', 'float-left', 'ml-0', 'badge-end'],
        [0],
      ),
      'Flex utilitalari.',
    ),
  ]),
  cards: lessonQuiz([
    why(
      order('q1', 'Card qismlarini yuqoridan pastga tartiblang.', [
        '.card-img-top',
        '.card-body',
        '.card-footer',
      ]),
      '`.card-header` ham bo‘lishi mumkin (rasmdan oldin yoki o‘rnida).',
    ),
    why(
      match('q2', 'Klassni vazifasi bilan moslang.', [
        ['.card-title', 'Card sarlavhasi'],
        ['.card-text', 'Card matni'],
        ['.card-img-overlay', 'Rasm ustidagi matn'],
        ['.card-link', 'Card ichidagi havola'],
      ]),
      'Card — panel, well va thumbnail o‘rnini bosadi.',
    ),
    why(
      codeFill(
        'q3',
        'Qatordagi kartalar bir xil balandlikda bo‘lsin.',
        '<div class="card {{1}}">',
        ['h-100'],
      ),
      'Ustunlar teng balandlikda bo‘lgani uchun card ham to‘liq balandlikni oladi.',
    ),
    why(
      tf('q4', '`.card` Bootstrap 3 dagi `.panel` o‘rnini bosadi.', true),
      'BS3 → BS4 ko‘chishda panellar card’ga aylantiriladi.',
    ),
  ]),
  dropdowns: lessonQuiz([
    why(
      codeFill('q1', 'Menyu bandi (BS4).', '<a class="{{1}}" href="#">Profil</a>', [
        'dropdown-item',
      ]),
      'BS3 da bandlar `<li>` edi, BS4 da `.dropdown-item`.',
    ),
    why(
      match('q2', 'Klassni yo‘nalishi bilan moslang.', [
        ['.dropup', 'Yuqoriga'],
        ['.dropright', 'O‘ngga'],
        ['.dropleft', 'Chapga'],
      ]),
      'BS5 da `.dropend` va `.dropstart`.',
    ),
    why(
      q(
        'q3',
        'Split button’ning strelka qismiga qaysi klass beriladi?',
        ['.dropdown-toggle-split', '.dropdown-split', '.caret', '.btn-arrow'],
        [0],
      ),
      'Tugmaning o‘zi alohida amal bajaradi.',
    ),
    why(
      match('q4', 'Klassni vazifasi bilan moslang.', [
        ['.dropdown-divider', 'Ajratuvchi chiziq'],
        ['.dropdown-header', 'Bo‘lim sarlavhasi'],
        ['.dropdown-item-text', 'Bosilmaydigan matn'],
      ]),
      'BS3 dagi `.divider` → `.dropdown-divider`.',
    ),
  ]),
  collapse: lessonQuiz([
    why(
      q(
        'q1',
        'BS4 da ochiq turgan collapse bloki qaysi klassga ega?',
        ['show', 'in', 'open', 'active'],
        [0],
      ),
      'BS3 da `in` edi.',
    ),
    why(
      codeFill(
        'q2',
        'Bitta tugma `qoshimcha` klassli barcha bloklarni ochsin.',
        '<button data-toggle="collapse" data-target="{{1}}">Ko‘proq</button>',
        ['.qoshimcha'],
      ),
      '`data-target` istalgan CSS selektori bo‘lishi mumkin.',
    ),
    why(
      q(
        'q3',
        'Akkordeonda bittasi ochilsa boshqalari yopilishi uchun har blokka?',
        ['data-parent="#faq"', 'data-close', 'class="single"', 'aria-hidden'],
        [0],
      ),
      'Ota element odatda `.accordion` klassli.',
    ),
    why(
      tf('q4', 'Yopiq blokni ochadigan tugmaga Bootstrap `collapsed` klassini qo‘yadi.', true),
      'Strelkani aylantirishda shu klassdan foydalanish mumkin.',
    ),
  ]),
  navs: lessonQuiz([
    why(
      order('q1', 'BS4 nav tuzilmasini tartiblang.', ['ul.nav', 'li.nav-item', 'a.nav-link']),
      'BS4 da nav bandlari va havolalari klass bilan belgilanadi.',
    ),
    why(
      match('q2', 'Klassni ko‘rinishi bilan moslang.', [
        ['.nav-tabs', 'Yorliqlar'],
        ['.nav-pills', 'Tabletka tugmalar'],
        ['.flex-column', 'Vertikal'],
      ]),
      'BS3 dagi `.nav-stacked` o‘rniga `.flex-column`.',
    ),
    why(
      codeFill(
        'q3',
        'Yorliq paneli boshida ko‘rinsin.',
        '<div class="tab-pane fade {{1}} active" id="html">…</div>',
        ['show'],
      ),
      'BS3 da `in`, BS4 da `show`.',
    ),
    why(
      tf('q4', 'Havolaga `.disabled` berilsa, u bosilmaydigan ko‘rinishga keladi.', true),
      'Kontekstga qarab `aria-disabled="true"` ham qo‘shing.',
    ),
  ]),

  // ---- 5. Formalar ----------------------------------------------------------------
  forms: lessonQuiz([
    why(
      match('q1', 'Klassni vazifasi bilan moslang.', [
        ['.form-group', 'Yorliq va maydon guruhi'],
        ['.form-text', 'Maydon ostidagi yordamchi matn'],
        ['.invalid-feedback', 'Xato xabari'],
        ['.form-row', 'Zichroq setkali qator'],
      ]),
      'BS3 dagi `.help-block` → `.form-text`.',
    ),
    why(
      codeFill(
        'q2',
        'Gorizontal formadagi yorliq.',
        '<label for="email" class="col-sm-2 {{1}}">Email</label>',
        ['col-form-label'],
      ),
      'BS3 dagi `.control-label` o‘rniga.',
    ),
    why(
      q(
        'q3',
        'Yuborishdan keyin xato maydonlarni ko‘rsatish uchun formaga qaysi klass qo‘shiladi?',
        ['.was-validated', '.has-error', '.invalid', '.needs-check'],
        [0],
      ),
      'Boshida forma `.needs-validation` va `novalidate` bilan.',
    ),
    why(
      tf('q4', 'Brauzerdagi tekshiruv serverdagi tekshiruv o‘rnini bosmaydi.', true),
      'Frontend tekshiruvi — qulaylik, xavfsizlik emas.',
    ),
  ]),
  inputs: lessonQuiz([
    why(
      match('q1', 'Klassni vazifasi bilan moslang.', [
        ['.form-control-lg', 'Katta maydon'],
        ['.form-control-plaintext', 'Maydonni oddiy matndek ko‘rsatish'],
        ['.form-control-file', 'Fayl tanlash maydoni'],
        ['.form-control-range', 'Surgich (range)'],
      ]),
      'Matnli maydonlar `.form-control`.',
    ),
    why(
      order('q2', 'Checkbox tuzilmasini tartiblang.', [
        'div.form-check',
        'input.form-check-input',
        'label.form-check-label',
      ]),
      'BS3 dagi `.checkbox` o‘rniga.',
    ),
    why(
      codeFill('q3', 'Checkboxlar bir qatorda.', '<div class="form-check {{1}}">', [
        'form-check-inline',
      ]),
      'Radio uchun ham xuddi shu.',
    ),
    why(
      tf('q4', '`readonly` maydon yuboriladi, lekin o‘zgartirib bo‘lmaydi.', true),
      '`disabled` esa yuborilmaydi.',
    ),
  ]),
  'input-groups': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Maydon oldiga “@” belgisini qo‘ying (BS4).',
        '<div class="input-group">\n  <div class="{{1}}">\n    <span class="input-group-text">@</span>\n  </div>\n  <input class="form-control">\n</div>',
        ['input-group-prepend'],
      ),
      'Orqaga — `.input-group-append`. BS5 da bu o‘ramlar kerak emas.',
    ),
    why(
      q(
        'q2',
        'Qidiruv maydoni yonidagi tugma uchun qaysi o‘ram?',
        ['.input-group-append', '.input-group-prepend', '.btn-group', '.form-row'],
        [0],
      ),
      'Tugma maydondan keyin keladi.',
    ),
    why(
      tf(
        'q3',
        'Input group ichidagi maydonga ham `<label>` (kerak bo‘lsa `.sr-only`) beriladi.',
        true,
      ),
      '“@” belgisi yorliq o‘rnini bosmaydi.',
    ),
    why(
      q(
        'q4',
        'Butun guruhni kattalashtirish uchun?',
        [
          '.input-group-lg — .input-group ga',
          '.form-control-lg — har bir qismga',
          '.btn-lg',
          'font-size: 2em',
        ],
        [0],
      ),
      'O‘lcham guruhga beriladi.',
    ),
  ]),

  // ---- 6. JavaScript komponentlari -------------------------------------------------
  carousel: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Slayd klassi (BS4).',
        '<div class="{{1}} active">\n  <img class="d-block w-100" src="1.jpg" alt="…">\n</div>',
        ['carousel-item'],
      ),
      'BS3 dagi `.item` o‘rniga.',
    ),
    why(
      tf('q2', 'Faqat bitta slayd `.active` bo‘lishi kerak.', true),
      'Bir nechta faol slayd karuselni buzadi.',
    ),
    why(
      q(
        'q3',
        'Slaydlar surilmay, xiralashib almashishi uchun?',
        ['.carousel-fade', '.fade-slide', 'data-effect="fade"', '.carousel-blur'],
        [0],
      ),
      'Asosiy `.carousel.slide` bilan birga.',
    ),
    why(
      q(
        'q4',
        'Izoh faqat md va kattaroq ekranda ko‘rinsin.',
        [
          '.carousel-caption .d-none .d-md-block',
          '.carousel-caption .hidden-xs',
          '.caption-md',
          '.d-md-none',
        ],
        [0],
      ),
      'Display utilitalari bilan.',
    ),
  ]),
  modal: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Fon bosilganda modal yopilmasin.',
        '<div class="modal" data-backdrop="{{1}}" data-keyboard="false">',
        ['static'],
      ),
      '`data-keyboard="false"` — Esc ham yopmaydi.',
    ),
    why(
      q(
        'q2',
        'Modalni ekran o‘rtasiga vertikal joylash uchun `.modal-dialog` ga?',
        ['.modal-dialog-centered', '.modal-middle', '.mx-auto', '.align-center'],
        [0],
      ),
      'Uzun kontent uchun `.modal-dialog-scrollable`.',
    ),
    why(
      tf(
        'q3',
        'Bitta modal turli tugmalar uchun turli kontent ko‘rsatishi mumkin (`data-*` va `show.bs.modal` hodisasi bilan).',
        true,
      ),
      'Tugmaning `data-nomi` qiymati modalga yoziladi.',
    ),
    why(
      q(
        'q4',
        'Modal sarlavhasini ekran o‘qiydigan dasturga bog‘laydigan atribut?',
        ['aria-labelledby', 'aria-hidden', 'title', 'data-target'],
        [0],
      ),
      'Modalga `role="dialog"` ham.',
    ),
  ]),
  tooltip: lessonQuiz([
    why(
      codeFill('q1', 'Tooltiplarni yoqing (BS4).', '$(\'[data-toggle="tooltip"]\').{{1}}();', [
        'tooltip',
      ]),
      'Tooltip o‘zi yoqilmaydi.',
    ),
    why(
      q(
        'q2',
        'O‘chirilgan (`disabled`) tugmada tooltip qanday ko‘rsatiladi?',
        [
          'Tugmani o‘ramga (masalan, span.d-inline-block) joylab, tooltipni o‘ramga berish',
          'Tugmaga to‘g‘ridan-to‘g‘ri',
          'Imkoni yo‘q',
          'title ni ikki marta yozish',
        ],
        [0],
      ),
      'O‘chirilgan element sichqoncha hodisalarini qabul qilmaydi.',
    ),
    why(
      tf(
        'q3',
        '`data-html="true"` tooltip ichida HTML ko‘rsatishga ruxsat beradi — begona matn bilan xavfli.',
        true,
      ),
      'Foydalanuvchi matnini HTML sifatida chiqarmang.',
    ),
    why(
      q(
        'q4',
        'Tooltip joylashuvini qaysi kutubxona hisoblaydi?',
        ['Popper', 'jQuery UI', 'Reboot', 'Lodash'],
        [0],
      ),
      'Shuning uchun `bootstrap.bundle` yoki alohida Popper kerak.',
    ),
  ]),
  popover: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Keyingi bosishda yopilsin.',
        '<a tabindex="0" data-toggle="popover" data-trigger="{{1}}" data-content="…">Izoh</a>',
        ['focus'],
      ),
      '`tabindex="0"` havolani fokuslanadigan qiladi.',
    ),
    why(
      sortInto('q2', 'Tooltip yoki popover?', {
        Tooltip: ['Hover’da qisqa nom'],
        Popover: ['Sarlavha va matnli izoh', 'Bosilganda ochiladi'],
      }),
      'Popover kattaroq kontent uchun.',
    ),
    why(
      q(
        'q3',
        'Barcha ochiq popoverlarni bir yo‘la yopish?',
        [
          "$('[data-toggle=\"popover\"]').popover('hide')",
          'location.reload()',
          "$('.popover').remove(true)",
          'Imkoni yo‘q',
        ],
        [0],
      ),
      'Metodga buyruq nomi beriladi.',
    ),
    why(tf('q4', 'Popover ham Popper’ga tayanadi.', true), 'Joylashuvni Popper hisoblaydi.'),
  ]),
  toast: lessonQuiz([
    why(
      tf('q1', 'Toast sahifaga qo‘yilishi bilan avtomatik ko‘rinadi.', false),
      "Ko‘rsatish faqat JS bilan: `$('#id').toast('show')`.",
    ),
    why(
      order('q2', 'Toast qismlarini tartiblang.', ['.toast', '.toast-header', '.toast-body']),
      'Sarlavhada yopish tugmasi (`data-dismiss="toast"`).',
    ),
    why(
      codeFill(
        'q3',
        'Toast 5 soniyadan keyin yopilsin.',
        '<div class="toast" data-delay="{{1}}">',
        ['5000'],
      ),
      'Millisoniyalarda; `data-autohide="false"` — yopilmaydi.',
    ),
    why(
      q(
        'q4',
        'Toast ekran o‘qiydigan dasturga e’lon qilinishi uchun?',
        [
          'role="status" aria-live="polite" (muhimi uchun role="alert")',
          'title',
          'tabindex',
          'alt',
        ],
        [0],
      ),
      '`aria-atomic="true"` — butun matn o‘qiladi.',
    ),
  ]),

  // ---- 7. Utilitalar, Flex va ikonkalar --------------------------------------------
  utilities: lessonQuiz([
    why(
      match('q1', 'Utilitani ma’nosi bilan moslang.', [
        ['mt-3', 'Yuqori tashqi bo‘shliq'],
        ['px-4', 'Chap va o‘ng ichki bo‘shliq'],
        ['mx-auto', 'Gorizontal markazlash'],
        ['mb-0', 'Pastki margin yo‘q'],
      ]),
      'm/p + t,b,l,r,x,y + 0–5 (yoki auto).',
    ),
    why(
      codeFill('q2', 'Telefonda yashirin, md dan ko‘rinadi.', '<div class="d-none {{1}}">', [
        'd-md-block',
      ]),
      'BS3 dagi `hidden-xs` o‘rniga.',
    ),
    why(
      q(
        'q3',
        '16:9 nisbatli video uchun BS4 o‘rami?',
        ['.embed-responsive .embed-responsive-16by9', '.ratio-16x9', '.video-fluid', '.img-fluid'],
        [0],
      ),
      'BS5 da `.ratio .ratio-16x9`.',
    ),
    why(
      tf(
        'q4',
        'Bitta joyda takrorlanadigan murakkab uslub uchun utilitalar o‘rniga o‘z klassingizni yozish yaxshiroq.',
        true,
      ),
      'Utilita — tez sozlash uchun; komponent uslubi CSS’da.',
    ),
  ]),
  flex: lessonQuiz([
    why(
      match('q1', 'Utilitani CSS bilan moslang.', [
        ['d-flex', 'display: flex'],
        ['justify-content-between', 'Asosiy o‘qda chetlarga taqsimlash'],
        ['align-items-center', 'Kesuvchi o‘qda markaz'],
        ['flex-wrap', 'Keyingi qatorga o‘tish'],
      ]),
      'Flex utilitalari CSS Flexbox’ning qisqa yozuvi.',
    ),
    why(
      codeFill(
        'q2',
        'Oxirgi tugmani o‘ng chetga suring (BS4).',
        '<button class="btn btn-primary {{1}}">Chiqish</button>',
        ['ml-auto'],
      ),
      'BS5 da `ms-auto`.',
    ),
    why(
      q(
        'q3',
        'Qidiruv maydoni bo‘sh joyning hammasini egallashi uchun?',
        ['.flex-grow-1', '.flex-shrink-0', '.w-auto', '.order-1'],
        [0],
      ),
      '`flex-grow: 1`.',
    ),
    why(
      tf(
        'q4',
        '`order-*` klasslari faqat vizual tartibni o‘zgartiradi, HTML tartibini emas.',
        true,
      ),
      'Klaviatura HTML tartibida yuradi.',
    ),
  ]),
  icons: lessonQuiz([
    why(
      codeFill('q1', 'Bootstrap Icons’dan uy ikonkasi.', '<i class="bi {{1}}"></i>', ['bi-house']),
      'Bootstrap Icons alohida kutubxona — alohida ulanadi.',
    ),
    why(
      tf('q2', 'Bootstrap 4 o‘z tarkibida ikonkalar (Glyphicons) bilan keladi.', false),
      'Glyphicons BS4 da olib tashlangan.',
    ),
    why(
      q(
        'q3',
        'Faqat ikonkali tugma uchun nima qo‘shiladi?',
        [
          'aria-label (yoki .sr-only matn)',
          'title har doim yetarli',
          'Ikonkani kattalashtirish',
          'Hech narsa',
        ],
        [0],
      ),
      'Ikonkaga `aria-hidden="true"`.',
    ),
    why(
      q(
        'q4',
        'Ikonka rangini qanday o‘zgartirasiz?',
        [
          'text-success kabi matn rangi bilan',
          'background-image bilan',
          'fill-red klassi bilan',
          'O‘zgartirib bo‘lmaydi',
        ],
        [0],
      ),
      'Shrift ikonka matn rangini oladi.',
    ),
  ]),
  'media-objects': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Media obyekt (BS4).',
        '<div class="media">\n  <img src="a.jpg" class="mr-3" alt="…">\n  <div class="{{1}}">Izoh matni</div>\n</div>',
        ['media-body'],
      ),
      'BS4 da `.media` flex asosida ishlaydi.',
    ),
    why(
      q(
        'q2',
        'Rasmni vertikal markazga qo‘yish (BS4)?',
        ['img ga .align-self-center', '.media-middle', '.v-center', '.mt-auto'],
        [0],
      ),
      'BS3 dagi `.media-middle` o‘rniga flex utilitasi.',
    ),
    why(
      tf('q3', 'Bootstrap 5 da `.media` komponenti olib tashlangan.', true),
      'BS5 da xuddi shu natija `d-flex` va utilitalar bilan olinadi.',
    ),
    why(
      q(
        'q4',
        'Rasmni o‘ng tomonga qo‘yish uchun?',
        [
          'Rasmni .media-body dan keyin yozib, ml-3 berish',
          '.media-right',
          '.float-right',
          'order: -1',
        ],
        [0],
      ),
      'Flex’da elementlar HTML tartibida joylashadi.',
    ),
  ]),

  // ---- 8. Setka tizimi ----------------------------------------------------------------
  'grid-system': lessonQuiz([
    why(
      match('q1', 'BS4 sinfini boshlanish kengligi bilan moslang.', [
        ['.col-', '< 576px (hamma ekran)'],
        ['.col-sm-', '≥ 576px'],
        ['.col-md-', '≥ 768px'],
        ['.col-lg-', '≥ 992px'],
        ['.col-xl-', '≥ 1200px'],
      ]),
      'BS3 dagi `xs` prefiksi BS4 da yozilmaydi: `.col-6`.',
    ),
    why(
      codeFill('q2', 'Ustunni 3 ga surish (BS4).', '<div class="col-md-6 {{1}}">', ['offset-md-3']),
      'BS3: `col-md-offset-3`.',
    ),
    why(
      q(
        'q3',
        'Ustunlar orasidagi bo‘shliqni olib tashlash uchun `.row` ga?',
        ['.no-gutters', '.g-0', '.gap-0', '.row-tight'],
        [0],
      ),
      'BS5 da `.g-0`.',
    ),
    why(
      q(
        'q4',
        'Qatorni majburan uzib, keyingi ustunlarni yangi qatordan boshlash?',
        ['<div class="w-100"></div>', '<br>', '.clearfix', '.row-break'],
        [0],
      ),
      'Flex setkada to‘liq kenglikdagi bo‘sh element yangi qator ochadi.',
    ),
  ]),
  'grid-stacked': lessonQuiz([
    why(
      q(
        'q1',
        '`col-sm-4` uch ustun 500px ekranda qanday?',
        ['Ustma-ust, har biri 100%', 'Yonma-yon', 'Yashirin', 'Ikki qatorda ikkitadan'],
        [0],
      ),
      'sm 576px dan boshlanadi.',
    ),
    why(
      tf(
        'q2',
        'BS4 setkasi Flexbox’da bo‘lgani uchun qatordagi ustunlar avtomatik bir xil balandlikda.',
        true,
      ),
      'Card’ga `h-100` bersangiz, kartalar ham teng bo‘ladi.',
    ),
    why(
      q(
        'q3',
        'Kichik ekranda ustun nega 100% bo‘ladi?',
        [
          'Sinf faqat o‘z kengligidan boshlab ishlaydi',
          'Brauzer xatosi',
          'Rasm katta',
          'container-fluid sababli',
        ],
        [0],
      ),
      'Undan torroqda ustun standart 100%.',
    ),
    why(
      sortInto('q4', 'BS3 → BS4 farqlari.', {
        BS3: ['col-xs-6', 'float asosida'],
        BS4: ['col-6', 'Flexbox asosida'],
      }),
      'Ko‘chishda `xs` prefiksi olib tashlanadi.',
    ),
  ]),
  'grid-xsmall': lessonQuiz([
    why(
      q(
        'q1',
        'Qatordagi uchta `.col` ustun qanday kenglikda?',
        ['Teng — har biri uchdan bir', 'Har biri 100%', 'Kontent kengligida', 'Har biri 12 ustun'],
        [0],
      ),
      '`.col` — avtomatik teng taqsimlash.',
    ),
    why(
      codeFill('q2', 'Ustun kontent kengligida bo‘lsin.', '<div class="{{1}}">Logo</div>', [
        'col-auto',
      ]),
      'Qolgan joyni `.col` lar oladi.',
    ),
    why(
      codeFill('q3', 'Har qatorda 2 tadan ustun.', '<div class="row {{1}}">', ['row-cols-2']),
      'Ustunlar `.col` bo‘lsa, ularning soni qatorda belgilanadi.',
    ),
    why(
      tf('q4', '`.col-6` telefonda ham yarim kenglikda bo‘ladi.', true),
      'Prefikssiz sinf eng kichik ekrandan boshlab ishlaydi.',
    ),
  ]),
  'grid-small': lessonQuiz([
    why(
      q(
        'q1',
        '`.col-sm` (raqamsiz) qanday ishlaydi?',
        [
          'sm dan boshlab teng taqsimlanadi, undan torroqda 100%',
          'Har doim teng',
          'Har doim 100%',
          'Kontent kengligida',
        ],
        [0],
      ),
      'Avtomatik kenglik, lekin sm dan.',
    ),
    why(
      codeFill(
        'q2',
        'Telefonda 1, sm dan 2 ustun surilsin.',
        '<div class="col-10 offset-1 col-sm-8 {{1}}">',
        ['offset-sm-2'],
      ),
      'Offset ham sinfga bog‘liq.',
    ),
    why(
      tf(
        'q3',
        'Yig‘indini har sinf uchun alohida hisoblash kerak (masalan, sm da 3 + 8 + … ≤ 12).',
        true,
      ),
      'Har ekran sinfida qator 12 dan oshmasligi kerak.',
    ),
    why(
      q(
        'q4',
        '`col-sm-3` va `col-sm-8` yig‘indisi 11 bo‘lsa?',
        [
          'O‘ngda 1 ustunlik bo‘sh joy qoladi',
          'Xato',
          'Ikkinchisi tushib ketadi',
          'Avtomatik 12 ga cho‘ziladi',
        ],
        [0],
      ),
      'Yig‘indi 12 dan kam bo‘lishi mumkin.',
    ),
  ]),
  'grid-medium': lessonQuiz([
    why(
      codeFill(
        'q1',
        'md dan yon panel (4) va asosiy qism.',
        '<div class="col-md-4">Yon</div>\n<div class="{{1}}">Asosiy</div>',
        ['col-md-8'],
      ),
      '4 + 8 = 12.',
    ),
    why(
      q(
        'q2',
        'Yon panel telefonda yashirin, md dan ko‘rinsin.',
        ['d-none d-md-block', 'hidden-xs', 'd-md-none', 'visible-md'],
        [0],
      ),
      'Display utilitalari ekran sinflari bilan.',
    ),
    why(
      match('q3', 'BS3 kodini BS4 ga ko‘chiring.', [
        ['col-xs-12', 'col-12'],
        ['col-md-offset-2', 'offset-md-2'],
        ['hidden-xs', 'd-none d-sm-block'],
      ]),
      'Ko‘chishda prefiks va utilitalar o‘zgaradi.',
    ),
    why(
      tf('q4', 'Ustunlar orasidagi standart bo‘shliq (gutter) padding bilan hosil qilinadi.', true),
      'BS4 da har ustunning chap/o‘ng padding’i 15px.',
    ),
  ]),
  'grid-large': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Maqola katta ekranda tor va markazda.',
        '<div class="row {{1}}">\n  <div class="col-lg-8">…</div>\n</div>',
        ['justify-content-center'],
      ),
      'Qatorni flex utilitasi bilan markazlash.',
    ),
    why(
      q(
        'q2',
        'Faqat `col-lg-6` yozilgan ustun planshetda (768px)?',
        ['100% kenglikda', 'Yarim', 'Yashirin', 'Chorak'],
        [0],
      ),
      'lg 992px dan boshlanadi.',
    ),
    why(
      codeFill('q3', 'Katta ekranda bu ustun birinchi chiqsin.', '<div class="col-lg-4 {{1}}">', [
        'order-lg-1',
      ]),
      'Kichik ekranda HTML tartibi saqlanadi.',
    ),
    why(
      tf(
        'q4',
        'Navbar’ning `navbar-expand-lg` klassi ham setkaning lg chegarasiga mos keladi.',
        true,
      ),
      'Bir xil tanaffus nuqtalari maketni izchil qiladi.',
    ),
  ]),
  'grid-xlarge': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Telefonda 1, sm da 2, lg da 3, xl da 4 ta karta.',
        '<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 {{1}}">',
        ['row-cols-xl-4'],
      ),
      '`row-cols` bilan har ustunga sinf yozish shart emas.',
    ),
    why(
      q(
        'q2',
        'xl sinfi qaysi kenglikdan boshlanadi (BS4)?',
        ['≥ 1200px', '≥ 1400px', '≥ 992px', '≥ 1600px'],
        [0],
      ),
      'BS5 da yana `xxl` (≥ 1400px) qo‘shilgan.',
    ),
    why(
      tf(
        'q3',
        'Bitta elementga beshta sinfni birga yozish mumkin: `col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2`.',
        true,
      ),
      'Har ekran uchun alohida nisbat.',
    ),
    why(
      q(
        'q4',
        'Juda keng ekranda kontent haddan tashqari cho‘zilmasligi uchun?',
        [
          '.container (qat’iy maksimal kenglik) ishlatish',
          '.container-fluid',
          'width: 100vw',
          'Hech narsa',
        ],
        [0],
      ),
      'Uzun qatorlarni o‘qish qiyin.',
    ),
  ]),
};
