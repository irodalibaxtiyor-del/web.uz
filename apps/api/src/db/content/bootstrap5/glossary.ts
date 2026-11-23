import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** Bootstrap 5 course glossary. Each term points to the lesson that introduces it. */
export const BS5_GLOSSARY: GlossaryDef[] = [
  t(
    'Bootstrap 5',
    'jQuery’siz ishlaydigan, CSS o‘zgaruvchilari va `data-bs-*` atributlaridan foydalanadigan Bootstrap versiyasi.',
    'home',
  ),
  t(
    'data-bs',
    'Bootstrap 5 plaginlarini HTML’dan ulaydigan atributlar prefiksi: `data-bs-toggle`, `data-bs-target`.',
    'home',
    '<button data-bs-toggle="modal" data-bs-target="#oyna">',
  ),
  t(
    'defer',
    '`<script>` atributi: skript HTML o‘qilgandan keyin, tartib bilan bajariladi.',
    'get-started',
  ),
  t(
    'SRI',
    'Subresource Integrity — `integrity` atributidagi xesh CDN faylining o‘zgartirilmaganini tekshiradi.',
    'get-started',
  ),
  t(
    'Ekran sinfi',
    'Bootstrap 5 dagi olti oraliq: xs, sm (≥ 576), md (≥ 768), lg (≥ 992), xl (≥ 1200), xxl (≥ 1400).',
    'grid-basic',
  ),
  t('xxl', 'Bootstrap 5 da qo‘shilgan eng katta ekran sinfi (≥ 1400px).', 'grid-xxl'),
  t(
    'Gutter',
    'Ustunlar orasidagi bo‘shliq; `g-*`, `gx-*`, `gy-*` klasslari bilan boshqariladi.',
    'grid-basic',
  ),
  t(
    'g-0',
    'Ustunlar orasidagi bo‘shliqni butunlay olib tashlaydigan klass (Bootstrap 4 dagi `no-gutters`).',
    'grid-system',
  ),
  t(
    'row-cols',
    'Bir qatordagi ustunlar sonini ota `row` dan beruvchi klass.',
    'grid-xsmall',
    '<div class="row row-cols-2 row-cols-md-4">',
  ),
  t('.col-auto', 'Kengligi kontentiga teng ustun.', 'grid-xsmall'),
  t('Offset', 'Ustunni chapdan surish: `offset-md-2`; ekran sinfiga bog‘liq.', 'grid-small'),
  t(
    'sticky-top',
    'Elementni aylantirilganda yuqorida yopishib turadigan qiladi (`position: sticky; top: 0`).',
    'grid-large',
  ),
  t(
    'Konteyner',
    '`container` — cheklangan, `container-fluid` — 100%, `container-{sinf}` — shu sinfgacha 100%.',
    'containers',
  ),
  t(
    'data-bs-theme',
    'Rang rejimini (`light`/`dark`) butun sahifa yoki bitta blok uchun belgilaydigan atribut.',
    'dark-mode',
    '<html data-bs-theme="dark">',
  ),
  t(
    'Qorong‘i rejim',
    'Bootstrap 5.3 dagi rang rejimi: CSS o‘zgaruvchilari `data-bs-theme` ga qarab almashadi.',
    'dark-mode',
  ),
  t(
    'CSS o‘zgaruvchisi',
    'Bootstrap 5 komponentlari `--bs-*` o‘zgaruvchilaridan rang oladi; ularni qayta e’lon qilib uslubni o‘zgartirish mumkin.',
    'buttons',
    '.btn { --bs-btn-bg: #8e44ad; }',
  ),
  t(
    'text-bg',
    'Fon rangini va unga mos kontrastli matn rangini birga beradigan klass: `text-bg-warning`.',
    'colors',
  ),
  t('fw-bold', 'Qalin matn utilitasi; `fw-*` — qalinlik, `fs-*` — o‘lcham.', 'typography'),
  t('.table-dark', 'Jadval yoki uning qismini qora qiluvchi klass.', 'tables'),
  t(
    'table-group-divider',
    'Jadval qismlari (thead, tbody) orasiga qalinroq ajratuvchi chiziq qo‘yadi.',
    'tables',
  ),
  t('.ratio', 'Video yoki iframe nisbatini saqlovchi o‘ram: `ratio ratio-16x9`.', 'images'),
  t('.img-fluid', 'Rasmni konteyner kengligiga moslashtiradi.', 'images'),
  t('btn-close', 'Bootstrap 5 dagi yopish tugmasi (×) klassi.', 'alerts'),
  t(
    'd-grid',
    'To‘liq kenglikdagi tugmalar uchun ota elementga beriladigan utilita (`btn-block` o‘rnida).',
    'buttons',
  ),
  t(
    'btn-check',
    'Checkbox yoki radio’ni yashirib, unga bog‘langan `label` ni tugma ko‘rinishida chiqaradi.',
    'button-groups',
  ),
  t(
    'rounded-pill',
    'Elementni tabletka shakliga keltiruvchi utilita (Bootstrap 4 dagi `badge-pill` o‘rnida).',
    'badges',
  ),
  t(
    'visually-hidden',
    'Matnni ko‘zdan yashirib, ekran o‘quvchiga qoldiradigan klass (Bootstrap 4 dagi `sr-only`).',
    'spinners',
  ),
  t(
    'progress-stacked',
    'Bir nechta qismli progress barlarni birlashtiradigan o‘ram (Bootstrap 5.3).',
    'progress-bars',
  ),
  t('Spinner', 'Yuklanish belgisi: `spinner-border` yoki `spinner-grow`.', 'spinners'),
  t('Pagination', 'Sahifa raqamlari bilan navigatsiya: `page-item` va `page-link`.', 'pagination'),
  t(
    'list-group-item-action',
    'List group bandini bosiladigan (hover va fokus uslubli) qiladi.',
    'list-groups',
  ),
  t('Card', 'Sarlavha, rasm, matn va tugmalardan iborat moslashuvchan quti.', 'cards'),
  t('stretched-link', 'Havolaning bosish maydonini butun kartaga kengaytiradigan klass.', 'cards'),
  t('Placeholder', 'Kontent yuklanayotganda ko‘rsatiladigan kulrang “skelet” chiziqlar.', 'cards'),
  t(
    'Accordion',
    'Bir vaqtda bitta bo‘limi ochiq turadigan tayyor komponent; `data-bs-parent` bilan bog‘lanadi.',
    'collapse',
  ),
  t(
    'Dropdown',
    'Tugma bosilganda ochiladigan menyu; `dropdown-menu-dark` — qorong‘i variant.',
    'dropdowns',
  ),
  t('Navs', 'Yorliqlar va tabletka shaklidagi navigatsiya: `nav-tabs`, `nav-pills`.', 'navs'),
  t(
    'Navbar',
    'Sayt yuqorisidagi navigatsiya; `navbar-expand-*` qaysi ekrandan yoyilishini belgilaydi.',
    'navbar',
  ),
  t(
    'ms-auto',
    'Chap tomondan avtomatik margin (start); flex ichida elementni o‘ng chetga suradi.',
    'navbar',
  ),
  t('Offcanvas', 'Ekran chetidan chiqadigan yashirin panel (masalan, mobil menyu).', 'offcanvas'),
  t('form-label', 'Forma yorlig‘i klassi (Bootstrap 5).', 'forms'),
  t('form-select', 'Select menyuni Bootstrap uslubida bezaydigan klass.', 'select'),
  t('form-range', 'Diapazon (`type="range"`) maydoni klassi.', 'range'),
  t('form-switch', 'Checkbox’ni kalit ko‘rinishida chiqaradigan klass.', 'checks-radios'),
  t(
    'Floating label',
    'Maydon ichida turib, yozish boshlanganda yuqoriga suriladigan yorliq: `form-floating`.',
    'floating-labels',
  ),
  t(
    'was-validated',
    'Formaga qo‘shilganda barcha maydonlarning tekshiruv xabarlari ko‘rinadigan klass.',
    'validation',
  ),
  t(
    'is-invalid',
    'Bitta maydonni xato holatida ko‘rsatadi; xabar `invalid-feedback` da.',
    'validation',
  ),
  t(
    'Input group',
    'Maydon oldiga yoki ortiga matn, tugma yoki select qo‘shish; `input-group-text` to‘g‘ridan-to‘g‘ri yoziladi.',
    'input-groups',
  ),
  t(
    'Karusel',
    'Slaydlar almashinadigan komponent; `data-bs-ride` avtomatik aylanishni boshqaradi.',
    'carousel',
  ),
  t('Modal', 'Sahifa ustidagi dialog oyna; JavaScript’da `new bootstrap.Modal(el)`.', 'modal'),
  t(
    'Tooltip',
    'Ustiga olib kelinganda chiqadigan izoh; har element uchun `new bootstrap.Tooltip(el)`.',
    'tooltip',
  ),
  t('Popover', 'Sarlavha va matnli qalqib chiquvchi oyna; `new bootstrap.Popover(el)`.', 'popover'),
  t('Toast', 'Qisqa bildirishnoma; `bootstrap.Toast.getOrCreateInstance(el).show()`.', 'toast'),
  t(
    'Scrollspy',
    'Aylantirilganda menyudagi mos bandni belgilaydi: `data-bs-spy="scroll"`.',
    'scrollspy',
  ),
  t(
    'Utilita klass',
    'Bitta CSS xususiyatini beruvchi klass: `p-3`, `d-flex`, `gap-2`, `shadow-sm`.',
    'utilities',
  ),
  t('gap', 'Flex yoki grid elementlari orasidagi masofa utilitasi: `gap-3`.', 'utilities'),
  t('d-flex', 'Elementni flex konteynerga aylantiruvchi utilita.', 'flex'),
  t(
    'Bootstrap Icons',
    'Bootstrap jamoasining ikonka to‘plami: shrift (`<i class="bi bi-search">`) yoki SVG sifatida.',
    'icons',
  ),
  t(
    'Hero',
    'Sahifa yuqorisidagi katta banner; Bootstrap 5 da jumbotron o‘rniga utilitalar bilan yig‘iladi.',
    'jumbotron',
  ),
];
