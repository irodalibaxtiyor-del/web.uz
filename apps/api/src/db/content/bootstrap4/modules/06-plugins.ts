import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  attr,
  bs4,
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
      <div{{item1}}><img src="${pic('Toshkent', 1110, 400)}" alt="Toshkent"{{img}}></div>
      <div{{item}}><img src="${pic('Samarqand', 1110, 400, '#28a745')}" alt="Samarqand"{{img}}></div>
      <div{{item}}><img src="${pic('Buxoro', 1110, 400, '#ffc107')}" alt="Buxoro"{{img}}></div>
    </div>
    <a href="#slayder" role="button"{{prev}}>
      {{prevIcon}}<span class="sr-only">Oldingi</span>
    </a>
    <a href="#slayder" role="button"{{next}}>
      {{nextIcon}}<span class="sr-only">Keyingi</span>
    </a>
  </div>
</div>`;

const MODAL = `<div class="container">
  <h2>Bootstrap 4 kursi</h2>
  <button type="button" class="btn btn-primary" id="ochish"{{trigger}}>Kursga yozilish</button>
</div>

<div id="oyna" tabindex="-1" aria-labelledby="oynaSarlavha" aria-hidden="true"{{modal}}>
  <div{{dialog}}>
    <div{{content}}>
      <div{{header}}>
        <h5 class="modal-title" id="oynaSarlavha">Kursga yozilish</h5>
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
  <button type="button" class="btn btn-secondary" id="tahrir" title="Profilni tahrirlash"{{tip}}>Tahrirlash</button>
</div>`;

const POPOVER = `<div class="container py-5">
  <h2>Kurs haqida</h2>
  <button type="button" class="btn btn-info" id="sertifikat"{{pop}}>Sertifikat haqida</button>
</div>`;

const TOAST = `<div class="container">
  <h2>Topshiriq</h2>
  <button type="button" class="btn btn-primary" id="yuborish">Topshirish</button>
  <div id="xabar" role="status" aria-live="polite" aria-atomic="true"{{toast}}>
    <div{{header}}>
      <strong class="mr-auto">WEBDIZAYN</strong>
      <small class="text-muted">hozir</small>
    </div>
    <div{{body}}>Topshirig‘ingiz qabul qilindi.</div>
  </div>
</div>`;

const TOAST_JS = `$(function () {
  $('#yuborish').on('click', function () {
    $('#xabar').toast('show');
  });
});`;

const SECTION = (id: string, title: string, color: string) =>
  `<section id="${id}" style="height: 400px; background: ${color};"><h3>${title}</h3></section>`;

const SCROLLSPY = `<div class="container">
  <nav id="mundarija">
    <ul{{nav}}>
      <li{{li}}><a href="#kirish"{{link}}>Kirish</a></li>
      <li{{li}}><a href="#dastur"{{link}}>Dastur</a></li>
      <li{{li}}><a href="#narx"{{link}}>Narx</a></li>
    </ul>
  </nav>
  <div id="kontent" style="height: 300px; overflow-y: scroll; position: relative;"{{spy}}>
    ${SECTION('kirish', 'Kirish', '#f8f9fa')}
    ${SECTION('dastur', 'Dastur', '#fff3cd')}
    ${SECTION('narx', 'Narx', '#d4edda')}
  </div>
</div>`;

export const m06: ModuleDef = {
  title: 'JavaScript komponentlari',
  lessons: [
    {
      slug: 'carousel',
      title: 'Karusel',
      exercise: {
        title: 'Shaharlar karuseli',
        description: '`.carousel-item` va yangi boshqaruv tugmalari.',
        instructions: md(
          '- `#slayder` — `carousel slide` + `data-ride="carousel"`; o‘ram — `carousel-inner`.',
          '- Slaydlar — `carousel-item` (birinchisi `carousel-item active`); rasmlar — `d-block w-100`.',
          '- Chap havola — `carousel-control-prev` + `data-slide="prev"`, ichida `<span class="carousel-control-prev-icon" aria-hidden="true"></span>`.',
          '- O‘ng havola — `carousel-control-next` + `data-slide="next"`, ichida `carousel-control-next-icon`.',
        ),
        expectedBehavior: 'Bitta slayd ko‘rinadi; o‘ng strelka bosilganda keyingi shahar chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(CAROUSEL), { title: 'Karusel' }),
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
          has('icon', 'Strelka ikonkalari', '.carousel-control-prev > .carousel-control-prev-icon'),
          style('img', 'Rasm to‘liq kenglikda', '#slayder img', 'display', 'block'),
        ],
      },
    },
    {
      slug: 'modal',
      title: 'Modal',
      exercise: {
        title: 'Markazdagi modal oyna',
        description: 'Modal tuzilmasi va `.modal-dialog-centered`.',
        instructions: md(
          '- `#oyna` — `modal fade`; ichki bloklar: `modal-dialog modal-dialog-centered`, `modal-content`, `modal-header`, `modal-body`, `modal-footer`.',
          '- `#ochish` — `data-toggle="modal"` va `data-target="#oyna"`.',
          '- `#bekor` — `data-dismiss="modal"`.',
        ),
        expectedBehavior:
          'Tugma bosilganda ekran markazida oyna ochiladi, “Bekor qilish” uni yopadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(MODAL), { title: 'Modal' }),
        checks: [
          style('hidden', 'Oyna boshida yashirin', '#oyna', 'display', 'none'),
          after(
            [click('#ochish'), wait(600)],
            has('open', 'Tugma oynani ochadi (`.show`)', '#oyna.show .modal-content'),
          ),
          after(
            [click('#ochish'), wait(600)],
            style('centered', 'Oyna markazda', '#oyna .modal-dialog', 'align-items', 'center'),
          ),
          after(
            [click('#ochish'), wait(600), click('#bekor'), wait(600)],
            style('close', '“Bekor qilish” yopadi', '#oyna', 'display', 'none'),
          ),
        ],
      },
    },
    {
      slug: 'tooltip',
      title: 'Tooltip',
      exercise: {
        title: 'Tahrirlash tugmasi izohi',
        description: 'Popper bilan joylashadigan tooltip.',
        instructions: md(
          '- `#tahrir` ga `data-toggle="tooltip"` va `data-placement="bottom"`.',
          '- `script.js` da tooltiplarni yoqing.',
        ),
        expectedBehavior: 'Sichqoncha borganda tugma ostida “Profilni tahrirlash” izohi chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(TOOLTIP), {
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
            has('bottom', 'Tooltip pastda', '.tooltip.bs-tooltip-bottom'),
          ),
        ],
      },
    },
    {
      slug: 'popover',
      title: 'Popover',
      exercise: {
        title: 'Sertifikat haqida popover',
        description: '`.popover-header` va `.popover-body`.',
        instructions: md(
          '- `#sertifikat` ga `data-toggle="popover"`, `title="Sertifikat"`,',
          '  `data-content="Yakuniy loyihani topshirgandan keyin beriladi."` va `data-placement="right"`.',
          '- `script.js` da popoverlarni yoqing.',
        ),
        expectedBehavior: 'Tugma bosilganda o‘ng tomonda sarlavhali quti chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(POPOVER), {
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
            has('right', 'O‘ng tomonda', '.popover.bs-popover-right'),
          ),
        ],
      },
    },
    {
      slug: 'toast',
      title: 'Toast',
      exercise: {
        title: '“Qabul qilindi” bildirishnomasi',
        description: 'Toast tuzilmasi va uni JavaScript bilan ko‘rsatish.',
        instructions: md(
          '- `#xabar` — `toast` va `data-delay="5000"`; ichki bloklar — `toast-header` va `toast-body`.',
          "- `script.js` da: `#yuborish` bosilganda `$('#xabar').toast('show')`.",
        ),
        expectedBehavior: 'Bildirishnoma boshida ko‘rinmaydi; “Topshirish” bosilganda chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(TOAST), { title: 'Toast', js: '// Toastni shu yerda ko‘rsating' }),
        checks: [
          style('hidden', 'Boshida ko‘rinmaydi', '#xabar', 'opacity', '0'),
          after(
            [click('#yuborish'), wait(600)],
            has('show', 'Tugma bosilganda chiqadi', '#xabar.toast.show'),
          ),
          after(
            [click('#yuborish'), wait(600)],
            style('visible', 'To‘liq ko‘rinadi', '#xabar', 'opacity', '1'),
          ),
          attr('delay', '5 soniya ko‘rinadi', '#xabar', 'data-delay', '5000', { hidden: true }),
        ],
      },
    },
    {
      slug: 'scrollspy',
      title: 'Scrollspy',
      exercise: {
        title: 'Mundarija kuzatuvchisi',
        description: 'Bootstrap 4 da `.nav-link` faollashadi.',
        instructions: md(
          '- Ro‘yxat — `nav nav-pills`; `<li>` — `nav-item`; havolalar — `nav-link`.',
          '- `#kontent` ga `data-spy="scroll"` va `data-target="#mundarija"`.',
        ),
        expectedBehavior: 'Blok aylantirilganda menyudagi mos havola ko‘k bo‘ladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(SCROLLSPY), { title: 'Scrollspy' }),
        checks: [
          has('nav', 'Menyu `.nav-link` lardan', '#mundarija .nav-pills .nav-link', { min: 3 }),
          after(
            [click('a[href="#narx"]'), wait(500)],
            has(
              'active',
              'Bo‘limga o‘tilganda havola faollashadi',
              '#mundarija a.nav-link.active[href="#narx"]',
            ),
          ),
          attr('target', '`data-target` menyuga', '#kontent', 'data-target', '#mundarija', {
            hidden: true,
          }),
        ],
      },
      quiz: quiz('6-modul testi: JavaScript komponentlari', [
        q(
          'm6-item',
          'Bootstrap 4 da karusel slaydining klassi?',
          ['`.carousel-item`', '`.item`', '`.slide-item`', '`.carousel-slide`'],
          [0],
        ),
        q(
          'm6-centered',
          'Modalni ekranning vertikal markazida ochish uchun qaysi klass?',
          ['`.modal-dialog-centered`', '`.modal-center`', '`.text-center`', '`.align-middle`'],
          [0],
        ),
        q(
          'm6-popper',
          'Tooltip va popover joylashuvini Bootstrap 4 da nima hisoblaydi?',
          ['Popper kutubxonasi', 'jQuery UI', 'CSS Grid', 'Brauzerning `title` atributi'],
          [0],
        ),
        q(
          'm6-toast',
          'Toast qanday ko‘rsatiladi?',
          [
            "JavaScript bilan: `$('#id').toast('show')`",
            '`data-toggle="toast"` tugma bilan o‘zi',
            'Sahifa ochilishi bilan o‘zi chiqadi',
            '`.toast-show` klassi bilan',
          ],
          [0],
        ),
        q(
          'm6-safe',
          '`data-html="true"` haqida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            'Faqat o‘zingiz yozgan, ishonchli matn bilan ishlatish kerak',
            'Foydalanuvchi kiritgan matnni HTML sifatida chiqarish XSS xavfini tug‘diradi',
            'Bootstrap 4.3.1 dan xavfli teglar sanitizer bilan tozalanadi',
            'U tooltipni tezroq ochadi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  carousel: bs4(
    slots(CAROUSEL, {
      carousel: `${cls('carousel slide')} data-ride="carousel"`,
      inner: cls('carousel-inner'),
      item1: cls('carousel-item active'),
      item: cls('carousel-item'),
      img: cls('d-block w-100'),
      prev: `${cls('carousel-control-prev')} data-slide="prev"`,
      next: `${cls('carousel-control-next')} data-slide="next"`,
      prevIcon: '<span class="carousel-control-prev-icon" aria-hidden="true"></span>\n      ',
      nextIcon: '<span class="carousel-control-next-icon" aria-hidden="true"></span>\n      ',
    }),
    { title: 'Karusel' },
  ),
  modal: bs4(
    slots(MODAL, {
      trigger: ' data-toggle="modal" data-target="#oyna"',
      modal: cls('modal fade'),
      dialog: cls('modal-dialog modal-dialog-centered'),
      content: cls('modal-content'),
      header: cls('modal-header'),
      body: cls('modal-body'),
      footer: cls('modal-footer'),
      dismiss: ' data-dismiss="modal"',
    }),
    { title: 'Modal' },
  ),
  tooltip: bs4(slots(TOOLTIP, { tip: ' data-toggle="tooltip" data-placement="bottom"' }), {
    title: 'Tooltip',
    js: `$(function () {\n  $('[data-toggle="tooltip"]').tooltip();\n});`,
  }),
  popover: bs4(
    slots(POPOVER, {
      pop: ' data-toggle="popover" data-placement="right" title="Sertifikat" data-content="Yakuniy loyihani topshirgandan keyin beriladi."',
    }),
    { title: 'Popover', js: `$(function () {\n  $('[data-toggle="popover"]').popover();\n});` },
  ),
  toast: bs4(
    slots(TOAST, {
      toast: `${cls('toast')} data-delay="5000"`,
      header: cls('toast-header'),
      body: cls('toast-body'),
    }),
    { title: 'Toast', js: TOAST_JS },
  ),
  scrollspy: bs4(
    slots(SCROLLSPY, {
      nav: cls('nav nav-pills'),
      li: cls('nav-item'),
      link: cls('nav-link'),
      spy: ' data-spy="scroll" data-target="#mundarija"',
    }),
    { title: 'Scrollspy' },
  ),
};
