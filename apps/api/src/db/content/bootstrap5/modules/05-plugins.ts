import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  attr,
  bs5,
  click,
  cls,
  has,
  hover,
  md,
  pic,
  q,
  quiz,
  slots,
  style,
  text,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const CAROUSEL = `<div class="container">
  <h2>Shaharlar</h2>
  <div id="slayder"{{carousel}}>
    <div{{inner}}>
      <div{{item1}}><img src="${pic('Toshkent', 1116, 400)}" alt="Toshkent"{{img}}></div>
      <div{{item}}><img src="${pic('Samarqand', 1116, 400, '#198754')}" alt="Samarqand"{{img}}></div>
      <div{{item}}><img src="${pic('Buxoro', 1116, 400, '#ffc107')}" alt="Buxoro"{{img}}></div>
    </div>
    <button type="button"{{prev}}>
      {{prevIcon}}<span class="visually-hidden">Oldingi</span>
    </button>
    <button type="button"{{next}}>
      {{nextIcon}}<span class="visually-hidden">Keyingi</span>
    </button>
  </div>
</div>`;

const MODAL = `<div class="container">
  <h2>Bootstrap 5 kursi</h2>
  <button type="button" class="btn btn-primary" id="ochish"{{trigger}}>Kursga yozilish</button>
</div>

<div id="oyna" tabindex="-1" aria-labelledby="oynaSarlavha" aria-hidden="true"{{modal}}>
  <div{{dialog}}>
    <div{{content}}>
      <div{{header}}>
        <h1 class="modal-title fs-5" id="oynaSarlavha">Kursga yozilish</h1>{{close}}
      </div>
      <div{{body}}>Kurs 1-noyabrdan boshlanadi. Yozilasizmi?</div>
      <div{{footer}}>
        <button type="button" class="btn btn-secondary" id="bekor"{{dismiss}}>Bekor qilish</button>
        <button type="button" class="btn btn-primary">Tasdiqlash</button>
      </div>
    </div>
  </div>
</div>`;

const TOOLTIP = `<div class="container py-5">
  <h2>Profil</h2>
  <button type="button" class="btn btn-secondary" id="tahrir"{{tip}}>Tahrirlash</button>
</div>`;

const TOOLTIP_JS = `document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
  new bootstrap.Tooltip(el);
});`;

const POPOVER = `<div class="container py-5">
  <h2>Kurs haqida</h2>
  <button type="button" class="btn btn-info" id="sertifikat"{{pop}}>Sertifikat haqida</button>
</div>`;

const POPOVER_JS = `document.querySelectorAll('[data-bs-toggle="popover"]').forEach((el) => {
  new bootstrap.Popover(el);
});`;

const TOAST = `<div class="container">
  <h2>Topshiriq</h2>
  <button type="button" class="btn btn-primary" id="yuborish">Topshirish</button>
</div>
<div{{container}}>
  <div id="xabar" role="status" aria-live="polite" aria-atomic="true"{{toast}}>
    <div{{header}}>
      <strong class="me-auto">WEBDIZAYN</strong>
      <small class="text-body-secondary">hozir</small>
    </div>
    <div{{body}}>Topshirig‘ingiz qabul qilindi.</div>
  </div>
</div>`;

const TOAST_JS = `const xabar = document.getElementById('xabar');
document.getElementById('yuborish').addEventListener('click', () => {
  bootstrap.Toast.getOrCreateInstance(xabar).show();
});`;

const SECTION = (id: string, title: string, color: string) =>
  `<section id="${id}" style="height: 400px; background: ${color};"><h3>${title}</h3></section>`;

const SCROLLSPY = `<div class="container">
  <nav id="mundarija" class="mb-3">
    <ul{{nav}}>
      <li{{li}}><a href="#kirish"{{link}}>Kirish</a></li>
      <li{{li}}><a href="#dastur"{{link}}>Dastur</a></li>
      <li{{li}}><a href="#narx"{{link}}>Narx</a></li>
    </ul>
  </nav>
  <div id="kontent" class="overflow-y-scroll" style="height: 300px;"{{spy}}>
    ${SECTION('kirish', 'Kirish', '#f8f9fa')}
    ${SECTION('dastur', 'Dastur', '#fff3cd')}
    ${SECTION('narx', 'Narx', '#d1e7dd')}
  </div>
</div>`;

const OFFCANVAS = `<div class="container">
  <h2>Kurslar katalogi</h2>
  <button class="btn btn-primary" type="button" id="ochish"{{trigger}}>Filtrlar</button>
</div>
<div id="filtr" tabindex="-1" aria-labelledby="filtrSarlavha"{{panel}}>
  <div{{header}}>
    <h5{{title}} id="filtrSarlavha">Filtrlar</h5>
    <button type="button" id="yopish" aria-label="Yopish"{{close}}></button>
  </div>
  <div{{body}}>
    <p>Kurs darajasi, narxi va davomiyligi bo‘yicha saralang.</p>
  </div>
</div>`;

export const m05: ModuleDef = {
  title: 'JavaScript komponentlari',
  lessons: [
    {
      slug: 'carousel',
      title: 'Karusel',
      exercise: {
        title: 'Shaharlar karuseli',
        description: 'Tugmali boshqaruv va `data-bs-*`.',
        instructions: md(
          '- `#slayder` — `carousel slide` + `data-bs-ride="carousel"`; o‘ram — `carousel-inner`.',
          '- Slaydlar — `carousel-item` (birinchisi `active`); rasmlar — `d-block w-100`.',
          '- Chap tugma — `carousel-control-prev`, `data-bs-target="#slayder"`, `data-bs-slide="prev"`; ichida `<span class="carousel-control-prev-icon" aria-hidden="true"></span>`.',
          '- O‘ng tugma — `carousel-control-next`, `data-bs-slide="next"`, ichida `carousel-control-next-icon`.',
        ),
        expectedBehavior: 'Bitta slayd ko‘rinadi; o‘ng strelka bosilganda keyingi shahar chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(CAROUSEL), { title: 'Karusel' }),
        checks: [
          style(
            'one',
            'Faqat bitta slayd ko‘rinadi',
            '#slayder > div > div:nth-child(2)',
            'display',
            'none',
          ),
          after(
            [click('#slayder .carousel-control-next'), wait(1000)],
            has(
              'next',
              'O‘ng tugma keyingi slaydni ochadi',
              '#slayder .carousel-item:nth-child(2).active',
            ),
          ),
          has(
            'btn',
            'Boshqaruv — tugma',
            'button.carousel-control-prev[data-bs-slide="prev"] > .carousel-control-prev-icon',
          ),
          style('img', 'Rasm blok', '#slayder img', 'display', 'block'),
        ],
      },
    },
    {
      slug: 'modal',
      title: 'Modal',
      exercise: {
        title: 'Markazdagi modal oyna',
        description: '`data-bs-toggle="modal"` va `.btn-close`.',
        instructions: md(
          '- `#oyna` — `modal fade`; bloklar: `modal-dialog modal-dialog-centered`, `modal-content`, `modal-header`, `modal-body`, `modal-footer`.',
          '- Sarlavhadan keyin `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Yopish"></button>`.',
          '- `#ochish` — `data-bs-toggle="modal"` va `data-bs-target="#oyna"`; `#bekor` — `data-bs-dismiss="modal"`.',
        ),
        expectedBehavior:
          'Tugma bosilganda markazda oyna ochiladi, “Bekor qilish” yoki × uni yopadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(MODAL), { title: 'Modal' }),
        checks: [
          style('hidden', 'Oyna boshida yashirin', '#oyna', 'display', 'none'),
          after(
            [click('#ochish'), wait(600)],
            has('open', 'Tugma oynani ochadi', '#oyna.show .modal-content'),
          ),
          after(
            [click('#ochish'), wait(600)],
            style('centered', 'Oyna markazda', '#oyna .modal-dialog', 'align-items', 'center'),
          ),
          after(
            [click('#ochish'), wait(600), click('#oyna .btn-close'), wait(600)],
            style('close', '× oynani yopadi', '#oyna', 'display', 'none'),
          ),
        ],
      },
    },
    {
      slug: 'tooltip',
      title: 'Tooltip',
      exercise: {
        title: 'Tahrirlash tugmasi izohi',
        description: 'jQuery’siz tooltip yoqish.',
        instructions: md(
          '- `#tahrir` ga `data-bs-toggle="tooltip"`, `data-bs-placement="bottom"` va `data-bs-title="Profilni tahrirlash"`.',
          '- `script.js` da barcha `[data-bs-toggle="tooltip"]` elementlar uchun `new bootstrap.Tooltip(el)`.',
        ),
        expectedBehavior: 'Sichqoncha borganda tugma ostida “Profilni tahrirlash” izohi chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(TOOLTIP), {
          title: 'Tooltip',
          js: '// Tooltiplarni shu yerda yoqing',
        }),
        checks: [
          after(
            [hover('#tahrir'), wait(400)],
            has('shown', 'Hover’da tooltip chiqadi', '.tooltip.show'),
          ),
          after(
            [hover('#tahrir'), wait(400)],
            text('text', 'Izoh matni', '.tooltip .tooltip-inner', 'Profilni tahrirlash'),
          ),
          after(
            [hover('#tahrir'), wait(400)],
            has('bottom', 'Tooltip pastda', '.tooltip[data-popper-placement="bottom"]'),
          ),
        ],
      },
    },
    {
      slug: 'popover',
      title: 'Popover',
      exercise: {
        title: 'Sertifikat haqida popover',
        description: '`data-bs-title`, `data-bs-content` va `new bootstrap.Popover`.',
        instructions: md(
          '- `#sertifikat` ga `data-bs-toggle="popover"`, `data-bs-placement="right"`, `data-bs-title="Sertifikat"` va',
          '  `data-bs-content="Yakuniy loyihani topshirgandan keyin beriladi."`.',
          '- `script.js` da popoverlarni yoqing.',
        ),
        expectedBehavior: 'Tugma bosilganda o‘ng tomonda sarlavhali quti chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(POPOVER), {
          title: 'Popover',
          js: '// Popoverlarni shu yerda yoqing',
        }),
        checks: [
          after(
            [click('#sertifikat'), wait(400)],
            text('header', 'Popover sarlavhasi', '.popover .popover-header', 'Sertifikat'),
          ),
          after(
            [click('#sertifikat'), wait(400)],
            text('body', 'Popover matni', '.popover .popover-body', 'Yakuniy loyihani'),
          ),
          after(
            [click('#sertifikat'), wait(400)],
            has('right', 'O‘ng tomonda', '.popover[data-popper-placement="right"]'),
          ),
        ],
      },
    },
    {
      slug: 'toast',
      title: 'Toast',
      exercise: {
        title: '“Qabul qilindi” bildirishnomasi',
        description: 'Toast va `bootstrap.Toast`.',
        instructions: md(
          '- Tashqi `<div>` — `toast-container position-fixed bottom-0 end-0 p-3`.',
          '- `#xabar` — `toast`; ichki bloklar — `toast-header` va `toast-body`.',
          '- `script.js`: `#yuborish` bosilganda `bootstrap.Toast.getOrCreateInstance(xabar).show()`.',
        ),
        expectedBehavior:
          'O‘ng pastki burchakda bildirishnoma faqat “Topshirish” bosilganda chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(TOAST), { title: 'Toast', js: '// Toastni shu yerda ko‘rsating' }),
        checks: [
          style('hidden', 'Boshida yashirin', '#xabar', 'display', 'none'),
          after(
            [click('#yuborish'), wait(600)],
            has('show', 'Tugma bosilganda chiqadi', '#xabar.toast.show'),
          ),
          style('corner', 'O‘ng pastki burchakda', '.toast-container', 'position', 'fixed'),
          attr('live', '`aria-live` bor', '#xabar', 'aria-live', 'polite', { hidden: true }),
        ],
      },
    },
    {
      slug: 'scrollspy',
      title: 'Scrollspy',
      exercise: {
        title: 'Mundarija kuzatuvchisi',
        description: 'IntersectionObserver asosidagi scrollspy.',
        instructions: md(
          '- Ro‘yxat — `nav nav-pills`; `<li>` — `nav-item`; havolalar — `nav-link`.',
          '- `#kontent` ga `data-bs-spy="scroll"`, `data-bs-target="#mundarija"` va `tabindex="0"`.',
        ),
        expectedBehavior: 'Blok aylantirilganda menyudagi mos havola ko‘k bo‘ladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(SCROLLSPY), { title: 'Scrollspy' }),
        checks: [
          has('nav', 'Menyu `.nav-link` lardan', '#mundarija .nav-pills .nav-link', { min: 3 }),
          after(
            [click('a[href="#narx"]'), wait(800)],
            has(
              'active',
              'Bo‘limga o‘tilganda havola faollashadi',
              '#mundarija a.nav-link.active[href="#narx"]',
            ),
          ),
          attr('tab', 'Blok klaviatura bilan fokuslanadi', '#kontent', 'tabindex', '0', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'offcanvas',
      title: 'Offcanvas',
      exercise: {
        title: 'Filtrlar paneli',
        description: 'Chap tomondan chiqadigan offcanvas.',
        instructions: md(
          '- `#filtr` — `offcanvas offcanvas-start`; qismlar — `offcanvas-header`, `offcanvas-title`, `offcanvas-body`.',
          '- `#yopish` — `btn-close` va `data-bs-dismiss="offcanvas"`.',
          '- `#ochish` — `data-bs-toggle="offcanvas"`, `data-bs-target="#filtr"`, `aria-controls="filtr"`.',
        ),
        expectedBehavior: '“Filtrlar” bosilganda chapdan panel siljib chiqadi, × uni yopadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(OFFCANVAS), { title: 'Offcanvas' }),
        checks: [
          style('hidden', 'Panel boshida ko‘rinmaydi', '#filtr', 'visibility', 'hidden'),
          after(
            [click('#ochish'), wait(600)],
            has('open', 'Tugma panelni ochadi', '#filtr.offcanvas.show'),
          ),
          after(
            [click('#ochish'), wait(600), click('#yopish'), wait(600)],
            has('close', '× panelni yopadi', '#filtr.show', { min: 0, max: 0 }),
          ),
          style('start', 'Panel chap chetda', '#filtr', 'left', '0px'),
        ],
      },
      quiz: quiz('5-modul testi: JavaScript komponentlari', [
        q(
          'm5-tooltip',
          'Bootstrap 5 da sahifadagi barcha tooltiplarni yoqish kodi?',
          [
            '`document.querySelectorAll(\'[data-bs-toggle="tooltip"]\').forEach(el => new bootstrap.Tooltip(el))`',
            '`$(\'[data-toggle="tooltip"]\').tooltip()`',
            'Kod kerak emas, o‘zi yoqiladi',
            '`bootstrap.tooltips.enableAll()`',
          ],
          [0],
        ),
        q(
          'm5-toast',
          'Toast’ni JavaScript bilan ko‘rsatish?',
          [
            '`bootstrap.Toast.getOrCreateInstance(el).show()`',
            "`$(el).toast('show')`",
            '`el.show()`',
            "`el.classList.add('toast')`",
          ],
          [0],
        ),
        q(
          'm5-offcanvas',
          'Ekranning chap chetidan chiqadigan panel klasslari?',
          [
            '`offcanvas offcanvas-start`',
            '`offcanvas offcanvas-left`',
            '`sidebar-left`',
            '`modal modal-left`',
          ],
          [0],
        ),
        q(
          'm5-carousel',
          'Bootstrap 5 karuselidagi boshqaruv elementlari haqida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            'Ular `<button>` bo‘lib, `data-bs-target` bilan karuselga bog‘lanadi',
            '`data-bs-slide="prev|next"` atributi bor',
            'Yashirin matn `.visually-hidden` bilan yoziladi',
            'Ular faqat `<a href>` bo‘lishi mumkin',
          ],
          [0, 1, 2],
        ),
        q(
          'm5-fullscreen',
          'Telefonda modalni to‘liq ekranga aylantiradigan klass?',
          [
            '`.modal-fullscreen-sm-down`',
            '`.modal-xl`',
            '`.modal-dialog-scrollable`',
            '`.modal-full`',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  carousel: bs5(
    slots(CAROUSEL, {
      carousel: `${cls('carousel slide')} data-bs-ride="carousel"`,
      inner: cls('carousel-inner'),
      item1: cls('carousel-item active'),
      item: cls('carousel-item'),
      img: cls('d-block w-100'),
      prev: `${cls('carousel-control-prev')} data-bs-target="#slayder" data-bs-slide="prev"`,
      next: `${cls('carousel-control-next')} data-bs-target="#slayder" data-bs-slide="next"`,
      prevIcon: '<span class="carousel-control-prev-icon" aria-hidden="true"></span>\n      ',
      nextIcon: '<span class="carousel-control-next-icon" aria-hidden="true"></span>\n      ',
    }),
    { title: 'Karusel' },
  ),
  modal: bs5(
    slots(MODAL, {
      trigger: ' data-bs-toggle="modal" data-bs-target="#oyna"',
      modal: cls('modal fade'),
      dialog: cls('modal-dialog modal-dialog-centered'),
      content: cls('modal-content'),
      header: cls('modal-header'),
      close:
        '\n        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Yopish"></button>',
      body: cls('modal-body'),
      footer: cls('modal-footer'),
      dismiss: ' data-bs-dismiss="modal"',
    }),
    { title: 'Modal' },
  ),
  tooltip: bs5(
    slots(TOOLTIP, {
      tip: ' data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Profilni tahrirlash"',
    }),
    { title: 'Tooltip', js: TOOLTIP_JS },
  ),
  popover: bs5(
    slots(POPOVER, {
      pop: ' data-bs-toggle="popover" data-bs-placement="right" data-bs-title="Sertifikat" data-bs-content="Yakuniy loyihani topshirgandan keyin beriladi."',
    }),
    { title: 'Popover', js: POPOVER_JS },
  ),
  toast: bs5(
    slots(TOAST, {
      container: cls('toast-container position-fixed bottom-0 end-0 p-3'),
      toast: cls('toast'),
      header: cls('toast-header'),
      body: cls('toast-body'),
    }),
    { title: 'Toast', js: TOAST_JS },
  ),
  scrollspy: bs5(
    slots(SCROLLSPY, {
      nav: cls('nav nav-pills'),
      li: cls('nav-item'),
      link: cls('nav-link'),
      spy: ' data-bs-spy="scroll" data-bs-target="#mundarija" tabindex="0"',
    }),
    { title: 'Scrollspy' },
  ),
  offcanvas: bs5(
    slots(OFFCANVAS, {
      trigger: ' data-bs-toggle="offcanvas" data-bs-target="#filtr" aria-controls="filtr"',
      panel: cls('offcanvas offcanvas-start'),
      header: cls('offcanvas-header'),
      title: cls('offcanvas-title'),
      close: `${cls('btn-close')} data-bs-dismiss="offcanvas"`,
      body: cls('offcanvas-body'),
    }),
    { title: 'Offcanvas' },
  ),
};
