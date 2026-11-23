import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** Bootstrap 3 course glossary. Each term points to the lesson that introduces it. */
export const BS3_GLOSSARY: GlossaryDef[] = [
  t(
    'Bootstrap',
    'Tayyor CSS klasslari va JavaScript komponentlaridan iborat front-end freymvork: setka, tugmalar, formalar, navbar va boshqalar.',
    'home',
  ),
  t(
    'Freymvork',
    'Tayyor qoidalar va qismlar to‘plami: ishni noldan emas, sinalgan asosdan boshlash imkonini beradi.',
    'home',
  ),
  t(
    'CDN',
    'Fayllarni (masalan, Bootstrap CSS va JS) tez yetkazib beradigan tarqatilgan serverlar tarmog‘i.',
    'get-started',
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">',
  ),
  t(
    'jQuery',
    'JavaScript kutubxonasi. Bootstrap 3 plaginlari unga tayanadi, shuning uchun u `bootstrap.min.js` dan oldin ulanadi.',
    'get-started',
  ),
  t(
    'viewport meta',
    'Mobil qurilmada sahifa to‘g‘ri o‘lchamda ko‘rinishi uchun `<head>` dagi teg; Bootstrap shabloni uni talab qiladi.',
    'get-started',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
  ),
  t(
    '.container',
    'Kengligi ekran sinfiga qarab cheklangan va markazlangan o‘ram; `.container-fluid` — har doim 100%.',
    'grid-basic',
  ),
  t(
    'Setka',
    'Sahifani 12 ustunli qatorlarga bo‘luvchi tizim (grid): `.container` → `.row` → `.col-*`.',
    'grid-system',
  ),
  t(
    '.row',
    'Ustunlar qatori; ustunlarning ichki bo‘shlig‘ini manfiy margin bilan muvozanatlaydi.',
    'grid-basic',
  ),
  t(
    'Ustun klassi',
    '`col-{sinf}-{son}` ko‘rinishidagi klass: sinf — ekran o‘lchami, son — 12 dan nechta ustun.',
    'grid-basic',
    '<div class="col-sm-4">…</div>',
  ),
  t(
    'Ekran sinfi',
    'Bootstrap 3 dagi to‘rt kenglik oralig‘i: `xs` (< 768px), `sm` (≥ 768), `md` (≥ 992), `lg` (≥ 1200).',
    'grid-system',
  ),
  t('Offset', 'Ustunni chapdan bo‘sh ustunlar bilan surish: `col-md-offset-3`.', 'grid-system'),
  t(
    'Push va pull',
    'Ustunlarning ko‘rinish tartibini almashtirish: `col-md-push-4`, `col-md-pull-8`.',
    'grid-system',
  ),
  t(
    'Ichma-ich setka',
    'Ustun ichida yangi `.row` ochib, uni yana 12 qismga bo‘lish (nesting).',
    'grid-system',
  ),
  t(
    'Ustma-ust holat',
    'Ekran sinfidan kichik ekranda ustunlar 100% kenglikka o‘tib, birin-ketin joylashadi (stacked).',
    'grid-stacked',
  ),
  t(
    'hidden-xs',
    'Elementni faqat telefon (`xs`) kengligida yashiruvchi ko‘rinish klassi; `visible-*-*` aksincha.',
    'grid-examples',
  ),
  t('.lead', 'Kirish paragrafini kattaroq va ingichkaroq ko‘rsatuvchi klass.', 'typography'),
  t('.text-muted', 'Ikkilamchi, kulrang matn uchun klass.', 'typography'),
  t(
    '.table-striped',
    'Jadval qatorlarini navbatma-navbat rangli qiladi; `table-hover` — ustiga olib kelinganda.',
    'tables',
  ),
  t(
    '.table-responsive',
    'Keng jadvalni kichik ekranda gorizontal aylantiriladigan o‘ram.',
    'tables',
  ),
  t(
    '.img-responsive',
    'Rasmni konteyner kengligiga moslashtiradi (`max-width: 100%; height: auto`).',
    'images',
  ),
  t(
    '.img-circle',
    'Rasmni doira shaklida ko‘rsatadi; `img-rounded` — yumaloq burchak, `img-thumbnail` — ramka.',
    'images',
  ),
  t('Jumbotron', 'Sahifaning eng muhim xabari uchun katta, e’tiborni tortuvchi blok.', 'jumbotron'),
  t('Well', 'Matnni kulrang fonli, ichki soyali qutiga soluvchi oddiy komponent.', 'wells'),
  t(
    'Alert',
    'Foydalanuvchiga holat haqida xabar beruvchi rangli blok: `alert-success`, `alert-danger` …',
    'alerts',
  ),
  t(
    '.btn',
    'Tugma asosiy klassi; rangi `btn-primary` kabi, o‘lchami `btn-lg`/`btn-sm`/`btn-xs` bilan beriladi.',
    'buttons',
  ),
  t('.btn-group', 'Tugmalarni bir-biriga yopishtirib guruhlaydigan o‘ram.', 'button-groups'),
  t(
    'Glyphicons',
    'Bootstrap 3 ga kiritilgan ikonka shrifti: `<span class="glyphicon glyphicon-search">`.',
    'glyphicons',
  ),
  t(
    'Badge',
    'Son ko‘rsatkichi (masalan, xabarlar soni) uchun kichik yumaloq belgi.',
    'badges-labels',
  ),
  t('Label', 'Matnli kichik rangli yorliq (“Yangi”, “Sotuvda”).', 'badges-labels'),
  t(
    'Progress bar',
    'Jarayonning bajarilgan qismini ko‘rsatuvchi chiziq; kengligi `width` bilan beriladi.',
    'progress-bars',
  ),
  t('Pagination', 'Ko‘p sahifali ro‘yxatda sahifa raqamlari bilan navigatsiya.', 'pagination'),
  t(
    'Breadcrumb',
    'Foydalanuvchi sayt tuzilmasida qayerda ekanini ko‘rsatuvchi yo‘l: Bosh / Kurslar / CSS.',
    'pagination',
  ),
  t('Pager', 'Faqat “Oldingi” va “Keyingi” havolalaridan iborat sodda navigatsiya.', 'pager'),
  t('List group', 'Bandlari chiroyli ajratilgan ro‘yxat komponenti.', 'list-groups'),
  t(
    'Panel',
    'Sarlavha, tana va footerga ega quti: `panel-heading`, `panel-body`, `panel-footer`.',
    'panels',
  ),
  t('Dropdown', 'Tugma bosilganda ochiladigan menyu: `data-toggle="dropdown"`.', 'dropdowns'),
  t(
    'Collapse',
    'Blokni yashirib-ochish plagini; dastlab ochiq bo‘lishi uchun `collapse in`.',
    'collapse',
  ),
  t('Akkordeon', 'Bir vaqtda faqat bitta bo‘limi ochiq turadigan collapse’lar guruhi.', 'collapse'),
  t(
    'Tabs',
    'Yorliqlar ko‘rinishidagi navigatsiya: `nav nav-tabs`; `nav-pills` — tabletka shakli.',
    'tabs-pills',
  ),
  t(
    'Navbar',
    'Sayt yuqorisidagi navigatsiya paneli; kichik ekranda gamburger tugmaga yig‘iladi.',
    'navbar',
  ),
  t('navbar-fixed-top', 'Navbarni ekran yuqorisiga mahkamlaydigan klass.', 'theme-company'),
  t(
    '.form-control',
    'Matn maydoni, textarea va select’ni Bootstrap uslubida bezaydigan klass.',
    'inputs',
  ),
  t('.form-horizontal', 'Yorliq chapda, maydon o‘ngda turadigan, setka asosidagi forma.', 'forms'),
  t('.form-inline', 'Barcha maydonlari bir qatorda turadigan forma.', 'forms'),
  t(
    'has-error',
    'Maydon guruhini xato holatida ko‘rsatuvchi klass; `has-success`, `has-warning` ham bor.',
    'inputs-2',
  ),
  t(
    'Input group',
    'Maydon oldiga yoki ortiga qo‘shimcha (masalan, `@`) qo‘yish: `input-group-addon`.',
    'input-sizing',
  ),
  t(
    'Media object',
    'Rasm va yonidagi matndan iborat blok (izohlar, sharhlar): `media-left` + `media-body`.',
    'media-objects',
  ),
  t('Karusel', 'Slaydlarni navbat bilan almashtiruvchi komponent (carousel).', 'carousel'),
  t('Modal', 'Sahifa ustida ochiladigan dialog oyna.', 'modal'),
  t(
    'data-toggle',
    'Bootstrap 3 plaginini HTML’dan JavaScript yozmasdan ulaydigan atribut.',
    'modal',
    '<button data-toggle="modal" data-target="#oyna">',
  ),
  t(
    'Tooltip',
    'Element ustiga olib kelinganda chiqadigan kichik izoh; JavaScript bilan yoqiladi.',
    'tooltip',
  ),
  t(
    'Popover',
    'Sarlavha va kattaroq matnli qalqib chiquvchi oyna; odatda bosilganda ochiladi.',
    'popover',
  ),
  t(
    'Scrollspy',
    'Sahifa aylantirilganda menyudagi mos bandni avtomatik belgilaydigan plagin.',
    'scrollspy',
  ),
  t(
    'Affix',
    'Elementni ma’lum joydan keyin mahkamlab qo‘yuvchi eski plagin; bugun `position: sticky`.',
    'affix',
  ),
  t('sr-only', 'Matnni ko‘zdan yashirib, ekran o‘quvchilarga qoldiradigan klass.', 'glyphicons'),
];
