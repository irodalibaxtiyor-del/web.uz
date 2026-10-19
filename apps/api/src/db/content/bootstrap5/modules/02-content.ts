import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs5,
  cls,
  has,
  md,
  pic,
  q,
  quiz,
  RGB,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const TYPO = `<div class="container">
  <h1 id="sarlavha"{{display}}>Shahar kutubxonasi</h1>
  <h2>Bo‘limlar{{small}}</h2>
  <p id="izoh"{{italic}}>Kitoblar 14 kun muddatga beriladi.</p>
  <figure id="iqtibos">
    <blockquote{{quote}}>
      <p>Kitob — eng yaxshi do‘st.</p>
    </blockquote>
    {{caption}}
  </figure>
  <p id="vaqt"{{end}}>Ish vaqti: 9:00–18:00</p>
</div>`;

const COLORS = `<div class="container">
  <h2>Buyurtma holati</h2>
  <p id="ok"{{ok}}><strong>Tayyor:</strong> buyurtmangiz yuborildi.</p>
  <div id="diqqat"{{warn}}><strong>Diqqat:</strong> yetkazib berish 3 kun.</div>
  <div id="xato"{{err}}><strong>Xato:</strong> karta raqami noto‘g‘ri.</div>
  <a href="#" id="havola"{{link}}>Buyurtmani bekor qilish</a>
</div>`;

const TABLE = `<div class="container">
  <h2>Imtihon natijalari</h2>
  <table id="jadval"{{table}}>
    <thead{{thead}}>
      <tr><th scope="col">Talaba</th><th scope="col">Fan</th><th scope="col">Natija</th></tr>
    </thead>
    <tbody{{tbody}}>
      <tr><td>Aziza</td><td>HTML</td><td>O‘tdi</td></tr>
      <tr{{fail}}><td>Sardor</td><td>CSS</td><td>O‘tmadi</td></tr>
      <tr><td>Madina</td><td>Bootstrap</td><td>O‘tdi</td></tr>
    </tbody>
  </table>
</div>`;

const IMAGES = `<div class="container">
  <img id="banner" src="${pic('Toshkent', 1600, 400)}" alt="Toshkent manzarasi"{{banner}}>
  <h3>Muallif haqida</h3>
  <img id="avatar" src="${pic('AK', 120, 120, '#198754')}" alt="Aziza Karimova" width="120" height="120"{{avatar}}>
  <p>Aziza Karimova — sayohatchi va fotograf. U O‘zbekistonning 50 dan ortiq shahrini suratga olgan.</p>
  <div id="video" style="max-width: 640px;"{{ratio}}>
    <div class="bg-dark text-white d-flex align-items-center justify-content-center">Video joyi (16:9)</div>
  </div>
</div>`;

const HERO = `<div class="container">
  <div id="banner"{{box}}>
    <h1{{h1}}>Veb-dizayn maktabi</h1>
    <p id="tavsif"{{lead}}>Uch oyda Bootstrap 5 bilan birinchi saytingizni yarating.</p>
    <div id="tugmalar"{{buttons}}>
      <button class="btn btn-primary btn-lg px-4" type="button">Kursga yozilish</button>
      <button class="btn btn-outline-secondary btn-lg px-4" type="button">Batafsil</button>
    </div>
  </div>
</div>`;

export const m02: ModuleDef = {
  title: 'Matn, ranglar va jadvallar',
  lessons: [
    {
      slug: 'typography',
      title: 'Tipografiya',
      exercise: {
        title: 'Kutubxona sahifasi matni',
        description: 'Display sarlavha, `fw-*`, `fst-*`, iqtibos va `text-end`.',
        instructions: md(
          '- `#sarlavha` — `display-5 fw-bold`.',
          '- `h2` ga ` <small class="text-body-secondary">uchta yo‘nalish</small>` qo‘shing.',
          '- `#izoh` — kursiv (`fst-italic`).',
          '- `blockquote` — `blockquote`; undan keyin `<figcaption class="blockquote-footer">Xalq maqoli</figcaption>`.',
          '- `#vaqt` — o‘ngga tekislangan (`text-end`).',
        ),
        expectedBehavior:
          'Katta qalin sarlavha, kulrang izoh, kursiv paragraf, imzoli iqtibos va o‘ngdagi ish vaqti.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(TYPO), { title: 'Kutubxona' }),
        checks: [
          at(1280, 800, style('display', 'Display sarlavha', '#sarlavha', 'font-size', '48px')),
          style('bold', 'Qalin sarlavha', '#sarlavha', 'font-weight', '700'),
          style('italic', 'Kursiv izoh', '#izoh', 'font-style', 'italic'),
          has(
            'quote',
            'Iqtibos va imzo',
            '#iqtibos > blockquote.blockquote + figcaption.blockquote-footer',
          ),
          style('end', 'Ish vaqti o‘ngda', '#vaqt', 'text-align', 'right'),
        ],
      },
    },
    {
      slug: 'colors',
      title: 'Ranglar',
      exercise: {
        title: 'Buyurtma holati xabarlari',
        description: '`text-*`, `text-bg-*` va `-subtle`/`-emphasis`.',
        instructions: md(
          '- `#ok` — yashil matn (`text-success`).',
          '- `#diqqat` — sariq fon va unga mos matn bitta klass bilan: `text-bg-warning p-3`.',
          '- `#xato` — och qizil fon va to‘q qizil matn: `bg-danger-subtle text-danger-emphasis p-3`.',
          '- `#havola` — qizil havola (`link-danger`).',
        ),
        expectedBehavior:
          'Yashil xabar, sariq ogohlantirish, yumshoq qizil xato bloki va qizil havola.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(COLORS), { title: 'Buyurtma' }),
        checks: [
          style('ok', 'Yashil matn', '#ok', 'color', RGB.bs5.success),
          style('warn', 'Sariq fon', '#diqqat', 'background-color', RGB.bs5.warning),
          style('warn-text', 'Sariq fonda qora matn', '#diqqat', 'color', 'rgb(0, 0, 0)'),
          style('subtle', 'Och qizil fon', '#xato', 'background-color', 'rgb(248, 215, 218)'),
          style('link', 'Qizil havola', '#havola', 'color', RGB.bs5.danger),
        ],
      },
    },
    {
      slug: 'tables',
      title: 'Jadvallar',
      exercise: {
        title: 'Imtihon natijalari',
        description: 'Zebra jadval, to‘q sarlavha, rangli qator va `align-middle`.',
        instructions: md(
          '- Jadval — `table table-striped table-hover align-middle`.',
          '- `<thead>` — `table-dark`; `<tbody>` — `table-group-divider`.',
          '- “O‘tmadi” qatori — `table-danger`.',
        ),
        expectedBehavior: 'To‘q sarlavhali, zebra qatorli jadval; o‘tmagan talaba qatori qizg‘ish.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(TABLE), { title: 'Natijalar' }),
        checks: [
          style(
            'thead',
            'Sarlavha qatori to‘q',
            '#jadval thead th',
            'background-color',
            RGB.bs5.dark,
          ),
          style(
            'danger',
            '“O‘tmadi” qatori qizg‘ish',
            '#jadval tbody tr:nth-of-type(2) td',
            'background-color',
            'rgb(248, 215, 218)',
          ),
          style('middle', 'Kataklar vertikal markazda', '#jadval td', 'vertical-align', 'middle'),
          has('striped', 'Zebra va hover', '#jadval.table.table-striped.table-hover'),
          style('divider', 'Guruh ajratuvchi', '#jadval tbody', 'border-top-width', '2px', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'images',
      title: 'Rasmlar',
      exercise: {
        title: 'Muallif sahifasi',
        description: '`.img-fluid`, `float-end`, `rounded-circle` va `.ratio`.',
        instructions: md(
          '- `#banner` — `img-fluid rounded-3 mb-3`.',
          '- `#avatar` — matn o‘ngda oqib o‘tsin: `rounded-circle float-end ms-3`.',
          '- `#video` — 16:9 nisbatli blok: `ratio ratio-16x9`.',
        ),
        expectedBehavior:
          'Konteyner kengligidagi banner, o‘ng tomonda dumaloq avatar, pastda 16:9 video joyi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(IMAGES), { title: 'Muallif' }),
        checks: [
          at(
            1280,
            800,
            style('fluid', 'Banner konteyner kengligida', '#banner', 'width', '1116px'),
          ),
          style('float', 'Avatar o‘ngda', '#avatar', 'float', 'right'),
          style('ms', 'Avatar chapdan masofali', '#avatar', 'margin-left', '16px'),
          style('circle', 'Avatar doira', '#avatar', 'border-top-left-radius', '50%'),
          style('ratio', '16:9 nisbat', '#video', '--bs-aspect-ratio', '56.25%'),
        ],
      },
    },
    {
      slug: 'jumbotron',
      title: 'Banner (jumbotron o‘rniga)',
      exercise: {
        title: 'Utilitalardan banner',
        description: 'Bootstrap 5 da jumbotron o‘rnini bosuvchi blok.',
        instructions: md(
          '- `#banner` — `p-5 mb-4 bg-body-tertiary rounded-3`.',
          '- Sarlavha — `display-5 fw-bold`; `#tavsif` — `fs-4`.',
          '- `#tugmalar` — telefonda ustma-ust, `md` dan yonma-yon: `d-grid gap-2 d-md-flex`.',
        ),
        expectedBehavior:
          'Kulrang yumaloq banner, katta qalin sarlavha; tugmalar telefonda to‘liq kenglikda, kompyuterda yonma-yon.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(HERO), { title: 'Maktab' }),
        checks: [
          style('pad', 'Katta ichki bo‘shliq', '#banner', 'padding-top', '48px'),
          style('bg', 'Och kulrang fon', '#banner', 'background-color', RGB.bs5.light),
          style('radius', 'Yumaloq burchak', '#banner', 'border-top-left-radius', '8px'),
          at(
            375,
            700,
            style('grid', 'Telefonda tugmalar ustma-ust', '#tugmalar', 'display', 'grid'),
          ),
          at(800, 700, style('flex', 'Planshetda yonma-yon', '#tugmalar', 'display', 'flex')),
        ],
      },
      quiz: quiz('2-modul testi: matn, ranglar va jadvallar', [
        q(
          'm2-fw',
          'Bootstrap 4 dagi `font-weight-bold` Bootstrap 5 da qanday?',
          ['`fw-bold`', '`font-bold`', '`text-bold`', '`bold`'],
          [0],
        ),
        q(
          'm2-textbg',
          '`text-bg-warning` klassi nima qiladi?',
          [
            'Sariq fon va unga mos (kontrastli) matn rangini birga beradi',
            'Faqat matnni sariq qiladi',
            'Matn ortiga sariq soya beradi',
            'Ogohlantirish ikonkasini qo‘shadi',
          ],
          [0],
        ),
        q(
          'm2-thead',
          'Bootstrap 5 da jadval sarlavha qatorini to‘q qilish?',
          [
            '`<thead class="table-dark">`',
            '`<thead class="thead-dark">`',
            '`<thead class="bg-black">`',
            '`<th class="dark">`',
          ],
          [0],
        ),
        q(
          'm2-ratio',
          'Bootstrap 4 dagi `embed-responsive-16by9` ning Bootstrap 5 dagi muqobili?',
          ['`ratio ratio-16x9`', '`embed-16x9`', '`video-responsive`', '`aspect-16-9`'],
          [0],
        ),
        q(
          'm2-jumbo',
          'Bootstrap 5 da jumbotron haqida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            '`.jumbotron` komponenti olib tashlangan',
            'Banner `p-5 bg-body-tertiary rounded-3` kabi utilitalar bilan yig‘iladi',
            'Ichida `display-*` va `lead`/`fs-4` ishlatish mumkin',
            '`.jumbotron-fluid` ishlatiladi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  typography: bs5(
    slots(TYPO, {
      display: cls('display-5 fw-bold'),
      small: ' <small class="text-body-secondary">uchta yo‘nalish</small>',
      italic: cls('fst-italic'),
      quote: cls('blockquote'),
      caption: '<figcaption class="blockquote-footer">Xalq maqoli</figcaption>',
      end: cls('text-end'),
    }),
    { title: 'Kutubxona' },
  ),
  colors: bs5(
    slots(COLORS, {
      ok: cls('text-success'),
      warn: cls('text-bg-warning p-3'),
      err: cls('bg-danger-subtle text-danger-emphasis p-3'),
      link: cls('link-danger'),
    }),
    { title: 'Buyurtma' },
  ),
  tables: bs5(
    slots(TABLE, {
      table: cls('table table-striped table-hover align-middle'),
      thead: cls('table-dark'),
      tbody: cls('table-group-divider'),
      fail: cls('table-danger'),
    }),
    { title: 'Natijalar' },
  ),
  images: bs5(
    slots(IMAGES, {
      banner: cls('img-fluid rounded-3 mb-3'),
      avatar: cls('rounded-circle float-end ms-3'),
      ratio: cls('ratio ratio-16x9'),
    }),
    { title: 'Muallif' },
  ),
  jumbotron: bs5(
    slots(HERO, {
      box: cls('p-5 mb-4 bg-body-tertiary rounded-3'),
      h1: cls('display-5 fw-bold'),
      lead: cls('fs-4'),
      buttons: cls('d-grid gap-2 d-md-flex'),
    }),
    { title: 'Maktab' },
  ),
};
