import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** Bootstrap 4 course glossary. Each term points to the lesson that introduces it. */
export const BS4_GLOSSARY: GlossaryDef[] = [
  t(
    'Bootstrap 4',
    'Flexbox asosidagi Bootstrap versiyasi: `card`, utilita klasslari, beshta ekran sinfi; plaginlar hali jQuery’ga tayanadi.',
    'home',
  ),
  t(
    'Reboot',
    'Brauzerlar orasidagi standart uslub farqlarini tekislaydigan asosiy CSS qatlami.',
    'get-started',
  ),
  t(
    'bootstrap.bundle.min.js',
    'Bootstrap JS va Popper birga jamlangan fayl; dropdown, tooltip va popover uchun Popper kerak.',
    'get-started',
  ),
  t('Popper', 'Dropdown, tooltip va popover joylashuvini hisoblaydigan kutubxona.', 'dropdowns'),
  t('.container-fluid', 'Har doim 100% kenglikdagi konteyner.', 'containers'),
  t(
    'Moslashuvchan konteyner',
    '`container-sm`, `-md`, `-lg`, `-xl` — shu sinfgacha 100%, keyin cheklangan kenglik.',
    'containers',
  ),
  t(
    'Ekran sinfi',
    'Bootstrap 4 dagi besh oraliq: xs (< 576), sm (≥ 576), md (≥ 768), lg (≥ 992), xl (≥ 1200).',
    'grid-basic',
  ),
  t('.col', 'Qolgan joyni teng bo‘lishib oladigan avtomatik kenglikdagi ustun.', 'grid-basic'),
  t('.col-auto', 'Kengligi kontentiga teng ustun.', 'grid-xsmall'),
  t(
    'row-cols',
    'Ota `row` dan bir qatordagi ustunlar sonini boshqaruvchi klass: `row-cols-2 row-cols-md-3`.',
    'grid-xlarge',
  ),
  t('Offset', 'Ustunni chapdan surish: `offset-md-2`.', 'grid-system'),
  t(
    'order',
    'Flex tartib klasslari (`order-1`, `order-lg-first`) — push/pull o‘rniga.',
    'grid-large',
  ),
  t('no-gutters', 'Ustunlar orasidagi bo‘shliqni olib tashlaydigan `row` klassi.', 'grid-system'),
  t(
    'Teng balandlik',
    'Flex qatordagi ustunlar standart holda bir xil balandlikda bo‘ladi (`align-items: stretch`).',
    'grid-stacked',
  ),
  t(
    '.display-4',
    'Oddiy sarlavhalardan kattaroq e’lon sarlavhasi (`display-1`…`display-4`).',
    'typography',
  ),
  t('.blockquote', 'Iqtibosni bezaydigan klass; muallif `blockquote-footer` da.', 'typography'),
  t(
    'Ma’noli ranglar',
    '`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark` — har biri vazifani bildiradi.',
    'colors',
  ),
  t('.thead-dark', 'Jadval sarlavha qatorini qora qiluvchi klass (Bootstrap 4).', 'tables'),
  t(
    '.img-fluid',
    'Rasmni konteyner kengligiga moslashtiradi; Bootstrap 3 dagi `img-responsive` o‘rnida.',
    'images',
  ),
  t(
    'Jumbotron',
    'Katta e’lon bloki; `jumbotron-fluid` — burchaksiz, to‘liq kenglikda.',
    'jumbotron',
  ),
  t('.alert-link', 'Alert ichidagi havolani mos rangda va qalin ko‘rsatadi.', 'alerts'),
  t('Outline tugma', 'Faqat chegarasi rangli tugma: `btn-outline-primary`.', 'buttons'),
  t(
    'Spinner',
    'Yuklanish jarayonini ko‘rsatuvchi aylanuvchi belgi: `spinner-border`, `spinner-grow`.',
    'spinners',
  ),
  t('.badge-pill', 'Yumaloq (tabletka) shaklidagi badge.', 'badges'),
  t(
    'progress-bar-animated',
    'Chiziqli progress barni harakatlantiruvchi klass (`progress-bar-striped` bilan).',
    'progress-bars',
  ),
  t('.page-item', 'Pagination bandi; ichidagi havola `page-link`.', 'pagination'),
  t(
    'list-group-flush',
    'Chetidagi chegara va burchaklarsiz list group — karta ichida ishlatiladi.',
    'list-groups',
  ),
  t(
    'Card',
    'Sarlavha, rasm, matn va tugmalardan iborat moslashuvchan quti; `panel`, `well` va `thumbnail` o‘rnida keldi.',
    'cards',
    '<div class="card"><div class="card-body">…</div></div>',
  ),
  t('Dropdown', 'Tugma bosilganda ochiladigan menyu; bandlari `dropdown-item`.', 'dropdowns'),
  t(
    'Collapse',
    'Blokni yashirib-ochish; dastlab ochiq bo‘lishi uchun `collapse show`.',
    'collapse',
  ),
  t(
    'Navs',
    '`nav`, `nav-item`, `nav-link` asosidagi navigatsiya; `nav-tabs` va `nav-pills` ko‘rinishlari.',
    'navs',
  ),
  t(
    'navbar-expand',
    '`navbar-expand-md` kabi klass: navbar shu ekran sinfidan boshlab to‘liq yoyiladi.',
    'navbar',
  ),
  t('navbar-toggler', 'Kichik ekranda menyuni ochib-yopadigan gamburger tugma.', 'navbar'),
  t(
    '.form-group',
    'Yorliq, maydon va yordamchi matnni guruhlaydigan o‘ram (Bootstrap 4).',
    'forms',
  ),
  t(
    'is-invalid',
    'Maydonni xato holatida ko‘rsatadigan klass; xabar `invalid-feedback` da.',
    'forms',
  ),
  t('form-control-lg', 'Kattaroq kiritish maydoni klassi; `form-control-sm` — kichigi.', 'inputs'),
  t(
    'form-control-plaintext',
    'Faqat o‘qiladigan qiymatni oddiy matn ko‘rinishida chiqaradigan maydon.',
    'inputs',
  ),
  t(
    'input-group-prepend',
    'Maydon oldidagi qo‘shimchani o‘raydigan blok; `input-group-append` — ortidagi.',
    'input-groups',
  ),
  t(
    'Custom forms',
    'Brauzerning standart ko‘rinishi o‘rniga Bootstrap uslubidagi checkbox, switch, select va range.',
    'custom-forms',
  ),
  t('custom-switch', 'Checkbox’ni kalit (switch) ko‘rinishida chiqaradigan klass.', 'custom-forms'),
  t(
    'Media object',
    'Flexbox asosidagi rasm + matn bloki: `media` va `media-body`.',
    'media-objects',
  ),
  t('carousel-item', 'Karuselning bitta slaydi; faqat bittasi `active`.', 'carousel'),
  t('Modal', 'Sahifa ustida ochiladigan dialog oyna; `modal-dialog-centered` — markazda.', 'modal'),
  t('data-backdrop', '`static` qiymati bilan modal fonga bosilganda yopilmaydi.', 'modal'),
  t('Tooltip', 'Ustiga olib kelinganda chiqadigan izoh; JavaScript bilan yoqiladi.', 'tooltip'),
  t('Popover', 'Sarlavha va matnli qalqib chiquvchi oyna.', 'popover'),
  t('Toast', 'Ekran burchagida qisqa vaqt ko‘rinadigan bildirishnoma.', 'toast'),
  t('Scrollspy', 'Aylantirilganda menyudagi mos bandni belgilaydigan plagin.', 'scrollspy'),
  t(
    'Utilita klass',
    'Bitta CSS xususiyatini beruvchi kichik klass: `mt-3`, `d-flex`, `text-center`.',
    'utilities',
  ),
  t(
    'Spacing',
    'Bo‘shliq utilitalari: `m`/`p` + tomon (`t`, `b`, `l`, `r`, `x`, `y`) + o‘lcham (0–5, `auto`).',
    'utilities',
    '<div class="mt-3 px-2">…</div>',
  ),
  t('d-flex', 'Elementni flex konteynerga aylantiruvchi utilita.', 'flex'),
  t(
    'justify-content',
    'Flex asosiy o‘q bo‘ylab tekislash utilitalari: `justify-content-between`, `-center` …',
    'flex',
  ),
  t(
    'Bootstrap Icons',
    'Bootstrap jamoasining SVG ikonka to‘plami; Bootstrap 4 ga kiritilmagan, alohida ulanadi.',
    'icons',
  ),
  t(
    'jQuery slim',
    'AJAX va animatsiya metodlarisiz yengil jQuery; Bootstrap 4 plaginlari uchun yetarli.',
    'filters',
  ),
];
