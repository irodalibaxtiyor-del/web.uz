import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  attr,
  bs3,
  click,
  cls,
  fill,
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

const MEDIA = `<div class="container">
  <h2>Sharhlar</h2>
  <div id="sharh"{{media}}>
    <div{{left}}>
      <img src="${pic('AK', 64, 64, '#5cb85c')}" alt="Aziza" width="64" height="64"{{img}}>
    </div>
    <div{{body}}>
      <h4{{heading}}>Aziza Karimova</h4>
      <p>Setka darsi juda tushunarli bo‘ldi, rahmat!</p>
      {{reply}}
    </div>
  </div>
</div>`;

const REPLY = `<div class="media" id="javob">
        <div class="media-left">
          <img src="${pic('O', 48, 48, '#337ab7')}" alt="O‘qituvchi" width="48" height="48" class="media-object">
        </div>
        <div class="media-body">
          <h4 class="media-heading">O‘qituvchi</h4>
          <p>Rahmat! Keyingi darsda offset’ni ko‘ramiz.</p>
        </div>
      </div>`;

const CAROUSEL = `<div class="container">
  <h2>Shaharlar</h2>
  <div id="slayder"{{carousel}}>
    <div{{inner}} role="listbox">
      <div{{item1}}>
        <img src="${pic('Toshkent', 1140, 400)}" alt="Toshkent">
      </div>
      <div{{item}}>
        <img src="${pic('Samarqand', 1140, 400, '#5cb85c')}" alt="Samarqand">
      </div>
      <div{{item}}>
        <img src="${pic('Buxoro', 1140, 400, '#f0ad4e')}" alt="Buxoro">
      </div>
    </div>
    <a href="#slayder" role="button"{{prev}}>
      <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
      <span class="sr-only">Oldingi</span>
    </a>
    <a href="#slayder" role="button"{{next}}>
      <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      <span class="sr-only">Keyingi</span>
    </a>
  </div>
</div>`;

const MODAL = `<div class="container">
  <h2>Bootstrap 3 kursi</h2>
  <button type="button" class="btn btn-primary" id="ochish"{{trigger}}>Kursga yozilish</button>
</div>

<div id="oyna" tabindex="-1" role="dialog" aria-labelledby="oynaSarlavha"{{modal}}>
  <div{{dialog}} role="document">
    <div{{content}}>
      <div{{header}}>
        <h4 class="modal-title" id="oynaSarlavha">Kursga yozilish</h4>
      </div>
      <div{{body}}>
        <p>Kurs 1-noyabrdan boshlanadi. Yozilasizmi?</p>
      </div>
      <div{{footer}}>
        <button type="button" class="btn btn-default" id="bekor"{{dismiss}}>Bekor qilish</button>
        <button type="button" class="btn btn-primary">Tasdiqlash</button>
      </div>
    </div>
  </div>
</div>`;

const TOOLTIP = `<div class="container">
  <h2>Profil</h2>
  <button type="button" class="btn btn-default" id="tahrir" title="Profilni tahrirlash"{{tip}}>
    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    <span class="sr-only">Profilni tahrirlash</span>
  </button>
</div>`;

const POPOVER = `<div class="container">
  <h2>Kurs haqida</h2>
  <button type="button" class="btn btn-info" id="sertifikat"{{pop}}>Sertifikat haqida</button>
</div>`;

const SECTION = (id: string, title: string, color: string) =>
  `<section id="${id}" style="height: 400px; background: ${color};"><h3>${title}</h3></section>`;

const SCROLLSPY = `<div class="container">
  <nav id="mundarija">
    <ul{{nav}}>
      <li><a href="#kirish">Kirish</a></li>
      <li><a href="#dastur">Dastur</a></li>
      <li><a href="#narx">Narx</a></li>
    </ul>
  </nav>
  <div id="kontent" style="height: 300px; overflow-y: scroll; position: relative;"{{spy}}>
    ${SECTION('kirish', 'Kirish', '#f5faff')}
    ${SECTION('dastur', 'Dastur', '#fffbe6')}
    ${SECTION('narx', 'Narx', '#f0fff4')}
  </div>
</div>`;

const AFFIX = `<div class="container" style="height: 150px;">
  <h1>Bir sahifali sayt</h1>
  <p><a href="#pastki">Pastga o‘tish</a></p>
</div>
<nav id="menyu" class="navbar navbar-inverse"{{affix}}>
  <div class="container-fluid">
    <a class="navbar-brand" href="#">WEBDIZAYN</a>
  </div>
</nav>
<div class="container">
  <div style="height: 1500px;">Uzun kontent…</div>
  <h2 id="pastki">Sahifa oxiri</h2>
</div>`;

const AFFIX_CSS = `.affix {
  top: 0;
  width: 100%;
  z-index: 1000;
}`;

const FILTER = `<div class="container">
  <h2>Talabalar</h2>
  <input class="form-control" id="qidiruv" type="text" placeholder="Qidirish…" aria-label="Jadvalda qidirish">
  <table class="table table-bordered">
    <thead>
      <tr><th>Ism</th><th>Shahar</th></tr>
    </thead>
    <tbody id="jadval">
      <tr><td>Aziza</td><td>Toshkent</td></tr>
      <tr><td>Bekzod</td><td>Buxoro</td></tr>
      <tr><td>Madina</td><td>Samarqand</td></tr>
      <tr><td>Sardor</td><td>Toshkent</td></tr>
    </tbody>
  </table>
</div>`;

const FILTER_JS = `$(function () {
  $('#qidiruv').on('input', function () {
    var soz = $(this).val().toLowerCase();
    $('#jadval tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(soz) > -1);
    });
  });
});`;

export const m06: ModuleDef = {
  title: 'JavaScript komponentlari',
  lessons: [
    {
      slug: 'media-objects',
      title: 'Media object',
      exercise: {
        title: 'Sharh va javob',
        description: 'Rasm va matnli media blok, ichma-ich javob.',
        instructions: md(
          '- `#sharh` — `media`; rasm o‘rami — `media-left`; rasm — `media-object`.',
          '- Matn o‘rami — `media-body`, sarlavha — `media-heading`.',
          '- `media-body` ichiga, paragrafdan keyin, o‘qituvchining javobini yana bitta `media` qilib joylang',
          '  (`id="javob"`, rasm, sarlavha “O‘qituvchi” va matn).',
        ),
        expectedBehavior:
          'Chapda avatar, o‘ngda sharh; uning ostida biroz ichkaridan o‘qituvchi javobi.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(MEDIA), { title: 'Sharhlar' }),
        checks: [
          style('left', 'Rasm chap katakda', '#sharh > div:first-child', 'display', 'table-cell'),
          style('body', 'Matn yonida', '#sharh > div:last-child', 'display', 'table-cell'),
          style('heading', 'Sarlavha `media-heading`', '#sharh h4', 'margin-top', '0px'),
          has('reply', 'Ichma-ich javob', '#sharh .media-body > .media#javob .media-body'),
        ],
      },
    },
    {
      slug: 'carousel',
      title: 'Karusel',
      exercise: {
        title: 'Shaharlar karuseli',
        description: 'Slaydlar va boshqaruv tugmalari.',
        instructions: md(
          '- `#slayder` — `carousel slide` va `data-ride="carousel"`.',
          '- Slaydlar o‘rami — `carousel-inner`; har bir slayd — `item`, birinchisi `item active`.',
          '- Chap havola — `left carousel-control` + `data-slide="prev"`, o‘ng havola — `right carousel-control` + `data-slide="next"`.',
        ),
        expectedBehavior: 'Bitta slayd ko‘rinadi; o‘ng tugma bosilganda keyingi shahar chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(CAROUSEL), { title: 'Karusel' }),
        checks: [
          style(
            'one',
            'Faqat bitta slayd ko‘rinadi',
            '#slayder [role="listbox"] > div:nth-child(2)',
            'display',
            'none',
          ),
          after(
            [click('#slayder .right'), wait(1000)],
            has('next', 'O‘ng tugma keyingi slaydni ochadi', '#slayder .item:nth-child(2).active'),
          ),
          has('prev', 'Chap tugma bor', '#slayder a.left.carousel-control[data-slide="prev"]'),
        ],
      },
    },
    {
      slug: 'modal',
      title: 'Modal oyna',
      exercise: {
        title: 'Kursga yozilish oynasi',
        description: 'Modal tuzilmasi, ochish va yopish.',
        instructions: md(
          '- `#oyna` — `modal fade`; ichidagi bloklar: `modal-dialog`, `modal-content`, `modal-header`, `modal-body`, `modal-footer`.',
          '- `#ochish` tugmasi modalni ochsin: `data-toggle="modal"` va `data-target="#oyna"`.',
          '- `#bekor` tugmasi uni yopsin: `data-dismiss="modal"`.',
        ),
        expectedBehavior:
          'Sahifada faqat tugma; bosilganda qorong‘i fon ustida oyna ochiladi, “Bekor qilish” uni yopadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(MODAL), { title: 'Modal' }),
        checks: [
          style('hidden', 'Oyna boshida yashirin', '#oyna', 'display', 'none'),
          after(
            [click('#ochish'), wait(600)],
            has('open', 'Tugma oynani ochadi', '#oyna.in .modal-content .modal-body'),
          ),
          after(
            [click('#ochish'), wait(600), click('#bekor'), wait(600)],
            style('close', '“Bekor qilish” oynani yopadi', '#oyna', 'display', 'none'),
          ),
        ],
      },
    },
    {
      slug: 'tooltip',
      title: 'Tooltip',
      exercise: {
        title: 'Tahrirlash tugmasi izohi',
        description: 'Tooltip’ni yoqish va joylashuvi.',
        instructions: md(
          '- `#tahrir` tugmasiga `data-toggle="tooltip"` va `data-placement="bottom"` bering.',
          '- `script.js` da barcha tooltiplarni yoqing: `$(\'[data-toggle="tooltip"]\').tooltip();`',
          '  (DOM tayyor bo‘lgach — `$(function () { … })`).',
        ),
        expectedBehavior:
          'Sichqoncha tugma ustiga borganda ostida qora “Profilni tahrirlash” izohi chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(TOOLTIP), {
          title: 'Tooltip',
          js: '// Tooltiplarni shu yerda yoqing',
        }),
        checks: [
          after(
            [hover('#tahrir'), wait(400)],
            has('shown', 'Hover’da tooltip chiqadi', '.tooltip'),
          ),
          after(
            [hover('#tahrir'), wait(400)],
            text('text', 'Izoh matni `title` dan', '.tooltip-inner', 'Profilni tahrirlash'),
          ),
          after([hover('#tahrir'), wait(400)], has('bottom', 'Tooltip pastda', '.tooltip.bottom')),
        ],
      },
    },
    {
      slug: 'popover',
      title: 'Popover',
      exercise: {
        title: 'Sertifikat haqida popover',
        description: 'Sarlavhali popover.',
        instructions: md(
          '- `#sertifikat` tugmasiga `data-toggle="popover"`, `title="Sertifikat"` va',
          '  `data-content="Yakuniy loyihani topshirgandan keyin beriladi."` bering.',
          '- `script.js` da popoverlarni yoqing.',
        ),
        expectedBehavior: 'Tugma bosilganda yonida sarlavhali oq quti chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(POPOVER), {
          title: 'Popover',
          js: '// Popoverlarni shu yerda yoqing',
        }),
        checks: [
          after(
            [click('#sertifikat'), wait(400)],
            text('title', 'Popover sarlavhasi', '.popover .popover-title', 'Sertifikat'),
          ),
          after(
            [click('#sertifikat'), wait(400)],
            text('content', 'Popover matni', '.popover .popover-content', 'Yakuniy loyihani'),
          ),
        ],
      },
    },
    {
      slug: 'scrollspy',
      title: 'Scrollspy',
      exercise: {
        title: 'Mundarija kuzatuvchisi',
        description: 'Blok ichidagi scrollspy.',
        instructions: md(
          '- Menyu ro‘yxati — `nav nav-pills`.',
          '- `#kontent` blokiga `data-spy="scroll"` va `data-target="#mundarija"` bering',
          '  (u allaqachon `position: relative` va aylanadigan).',
        ),
        expectedBehavior: 'Blok aylantirilganda menyudagi tegishli band ko‘k bo‘ladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(SCROLLSPY), { title: 'Scrollspy' }),
        checks: [
          has('nav', 'Menyu `.nav`', '#mundarija > ul.nav.nav-pills'),
          after(
            [click('a[href="#narx"]'), wait(500)],
            has(
              'active',
              'Bo‘limga o‘tilganda menyu bandi faollashadi',
              '#mundarija li.active > a[href="#narx"]',
            ),
          ),
          attr(
            'target',
            '`data-target` menyuga ishora qiladi',
            '#kontent',
            'data-target',
            '#mundarija',
            {
              hidden: true,
            },
          ),
        ],
      },
    },
    {
      slug: 'affix',
      title: 'Affix',
      exercise: {
        title: 'Yopishqoq navbar',
        description: 'Aylantirganda tepaga mahkamlanadigan navbar.',
        instructions: md(
          '- `#menyu` ga `data-spy="affix"` va `data-offset-top="150"` bering.',
          '- `style.css` da `.affix` uchun `top: 0; width: 100%; z-index: 1000;` yozing.',
        ),
        expectedBehavior:
          'Sahifa 150px dan ko‘proq pastga aylanganda navbar ekran tepasiga yopishadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(AFFIX), {
          title: 'Affix',
          css: '/* .affix uslubini shu yerga yozing */',
        }),
        checks: [
          after(
            [click('a[href="#pastki"]'), wait(400)],
            has('affix', 'Aylantirilganda `.affix` qo‘shiladi', '#menyu.affix'),
          ),
          after(
            [click('a[href="#pastki"]'), wait(400)],
            style('top', 'Mahkamlangan navbar tepada', '#menyu', 'top', '0px'),
          ),
          after(
            [click('a[href="#pastki"]'), wait(400)],
            style('width', 'Mahkamlangan navbar to‘liq kenglikda', '#menyu', 'width', '1280px', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'filters',
      title: 'Filtrlar',
      exercise: {
        title: 'Talabalar jadvalida qidiruv',
        description: 'jQuery bilan jadvalni filtrlash.',
        instructions: md(
          '`script.js` da: `#qidiruv` ga har safar matn kiritilganda (`input` hodisasi) `#jadval` dagi',
          'qatorlardan faqat shu matnni o‘z ichiga olganlari ko‘rinib qolsin. Katta-kichik harf farq qilmasin.',
        ),
        expectedBehavior:
          '“buxoro” yozilsa faqat Bekzod qatori qoladi; maydon tozalansa hamma qator qaytadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(FILTER, { title: 'Filtr', js: '// Filtr kodini shu yerga yozing' }),
        checks: [
          after(
            [fill('#qidiruv', 'buxoro'), wait(200)],
            style(
              'hide',
              'Mos kelmagan qator yashirinadi',
              '#jadval tr:nth-child(1)',
              'display',
              'none',
            ),
          ),
          after(
            [fill('#qidiruv', 'buxoro'), wait(200)],
            style('show', 'Mos qator qoladi', '#jadval tr:nth-child(2)', 'display', 'table-row'),
          ),
          after(
            [fill('#qidiruv', 'TOSH'), wait(200)],
            style(
              'case',
              'Registrga qaramaydi',
              '#jadval tr:nth-child(4)',
              'display',
              'table-row',
              { hidden: true },
            ),
          ),
          after(
            [fill('#qidiruv', 'TOSH'), wait(200)],
            style(
              'case2',
              'Boshqa so‘z bilan ham ishlaydi',
              '#jadval tr:nth-child(3)',
              'display',
              'none',
              {
                hidden: true,
              },
            ),
          ),
        ],
      },
      quiz: quiz('6-modul testi: JavaScript komponentlari', [
        q(
          'm6-active',
          'Karusel ko‘rinmayapti. Eng ko‘p uchraydigan sabab nima?',
          [
            'Birorta `.item` ga `.active` berilmagan',
            '`data-interval` yozilmagan',
            'Indikatorlar yo‘q',
            '`.carousel-caption` yo‘q',
          ],
          [0],
        ),
        q(
          'm6-modal',
          'Modalni tugma bilan ochish uchun qaysi atributlar kerak?',
          [
            '`data-toggle="modal"` va `data-target="#id"`',
            '`data-dismiss="modal"`',
            '`data-spy="modal"`',
            '`href="#modal"` yetarli',
          ],
          [0],
        ),
        q(
          'm6-init',
          'Qaysi plaginlar `data-` atributlari bilan o‘zi yoqilmaydi va JavaScript bilan yoqilishi kerak? (bir nechta javob)',
          ['Tooltip', 'Popover', 'Collapse', 'Modal'],
          [0, 1],
        ),
        q(
          'm6-spy',
          'Scrollspy ishlashi uchun nima shart? (bir nechta javob)',
          [
            'Aylanadigan element `position: relative`',
            'Menyu havolalari bo‘lim `id` lariga ishora qiladi',
            'Menyu ro‘yxati `.nav` klassli',
            'Har bir bo‘lim `.active` klassli',
          ],
          [0, 1, 2],
        ),
        q(
          'm6-affix',
          'Bootstrap 4/5 da affix o‘rniga nima ishlatiladi?',
          [
            '`position: sticky` (`.sticky-top`)',
            '`.affix-top`',
            '`position: absolute`',
            'Scrollspy',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s06: Record<string, ProjectFile[]> = {
  'media-objects': bs3(
    slots(MEDIA, {
      media: cls('media'),
      left: cls('media-left'),
      img: cls('media-object'),
      body: cls('media-body'),
      heading: cls('media-heading'),
      reply: REPLY,
    }),
    { title: 'Sharhlar' },
  ),
  carousel: bs3(
    slots(CAROUSEL, {
      carousel: `${cls('carousel slide')} data-ride="carousel"`,
      inner: cls('carousel-inner'),
      item1: cls('item active'),
      item: cls('item'),
      prev: `${cls('left carousel-control')} data-slide="prev"`,
      next: `${cls('right carousel-control')} data-slide="next"`,
    }),
    { title: 'Karusel' },
  ),
  modal: bs3(
    slots(MODAL, {
      trigger: ' data-toggle="modal" data-target="#oyna"',
      modal: cls('modal fade'),
      dialog: cls('modal-dialog'),
      content: cls('modal-content'),
      header: cls('modal-header'),
      body: cls('modal-body'),
      footer: cls('modal-footer'),
      dismiss: ' data-dismiss="modal"',
    }),
    { title: 'Modal' },
  ),
  tooltip: bs3(slots(TOOLTIP, { tip: ' data-toggle="tooltip" data-placement="bottom"' }), {
    title: 'Tooltip',
    js: `$(function () {\n  $('[data-toggle="tooltip"]').tooltip();\n});`,
  }),
  popover: bs3(
    slots(POPOVER, {
      pop: ' data-toggle="popover" title="Sertifikat" data-content="Yakuniy loyihani topshirgandan keyin beriladi."',
    }),
    { title: 'Popover', js: `$(function () {\n  $('[data-toggle="popover"]').popover();\n});` },
  ),
  scrollspy: bs3(
    slots(SCROLLSPY, {
      nav: cls('nav nav-pills'),
      spy: ' data-spy="scroll" data-target="#mundarija"',
    }),
    { title: 'Scrollspy' },
  ),
  affix: bs3(slots(AFFIX, { affix: ' data-spy="affix" data-offset-top="150"' }), {
    title: 'Affix',
    css: AFFIX_CSS,
  }),
  filters: bs3(FILTER, { title: 'Filtr', js: FILTER_JS }),
};
