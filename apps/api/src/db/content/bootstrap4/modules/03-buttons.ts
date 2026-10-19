import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs4,
  click,
  cls,
  has,
  md,
  q,
  quiz,
  RGB,
  slots,
  style,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const ALERTS = `<div class="container">
  <h2>Xabarlar</h2>
  <div id="saqlandi" role="alert"{{ok}}><strong>Tayyor!</strong> Profilingiz saqlandi.</div>
  <div id="xato" role="alert"{{err}}>
    {{heading}}
    <p class="mb-0">Parol kamida 8 ta belgidan iborat bo‘lishi kerak.</p>
  </div>
  <div id="eslatma" role="alert"{{warn}}>
    <strong>Diqqat!</strong> Profilingiz to‘liq emas.{{close}}
  </div>
</div>`;

const CLOSE = `
    <button type="button" class="close" data-dismiss="alert" aria-label="Yopish">
      <span aria-hidden="true">&times;</span>
    </button>`;

const BUTTONS = `<div class="container">
  <h2>Kurs sahifasi</h2>
  <button type="button" id="saqlash"{{save}}>Kursga yozilish</button>
  <button type="button" id="batafsil"{{more}}>Batafsil</button>
  <button type="button" id="ochir"{{del}}>Ro‘yxatdan chiqish</button>
  <hr>
  <button type="submit" id="yuborish"{{block}}>Ariza yuborish</button>
</div>`;

const GROUPS = `<div class="container">
  <h2>Ko‘rinish</h2>
  <div id="korinish"{{group}}>
    <button type="button" class="btn btn-secondary">Ro‘yxat</button>
    <button type="button" class="btn btn-secondary">Jadval</button>
    <button type="button" class="btn btn-secondary">Kartalar</button>
  </div>
  <h2>Darajangiz</h2>
  <div id="daraja"{{toggle}}>
    <label{{l1}}><input type="radio" name="daraja" id="d1" checked> Boshlang‘ich</label>
    <label{{l}}><input type="radio" name="daraja" id="d2"> O‘rta</label>
    <label{{l}}><input type="radio" name="daraja" id="d3"> Yuqori</label>
  </div>
</div>`;

const BADGES = `<div class="container">
  <h3 id="kurs">Bootstrap 4 kursi{{new}}</h3>
  <button type="button" class="btn btn-primary" id="xabar">Xabarlar{{count}}</button>
  <ul class="list-group mt-3">
    <li id="kiruvchi"{{li}}>
      Kiruvchi xabarlar
      {{pill}}
    </li>
  </ul>
</div>`;

const bar = (value: number, extra: string) =>
  `${cls(`progress-bar ${extra}`)} role="progressbar" style="width: ${value}%" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"`;

const PROGRESS = `<div class="container">
  <h2>Kurs progressi</h2>
  <p>HTML</p>
  <div id="html"{{p}}>
    <div{{b1}}>60%</div>
  </div>
  <p>CSS (hozir o‘rganilmoqda)</p>
  <div id="css"{{p}}>
    <div{{b2}}></div>
  </div>
</div>`;

const SPINNERS = `<div class="container">
  <h2>Yuklanmoqda</h2>
  <div id="yuklash"{{border}} role="status"><span class="sr-only">Yuklanmoqda…</span></div>
  <div id="nafas"{{grow}} role="status"><span class="sr-only">Yuklanmoqda…</span></div>
  <hr>
  <button class="btn btn-primary" type="button" id="saqlash"{{disabled}}>
    {{btnSpinner}}Saqlanmoqda…
  </button>
</div>`;

export const m03: ModuleDef = {
  title: 'Xabarlar, tugmalar va belgilar',
  lessons: [
    {
      slug: 'alerts',
      title: 'Alert',
      exercise: {
        title: 'Uchta xabar',
        description: 'Rangli, sarlavhali va yopiladigan alert.',
        instructions: md(
          '- `#saqlandi` — `alert alert-success`.',
          '- `#xato` — `alert alert-danger`; ichiga birinchi bo‘lib `<h4 class="alert-heading">Xato!</h4>` qo‘shing.',
          '- `#eslatma` — `alert alert-warning alert-dismissible fade show`; matndan keyin',
          '  `<button type="button" class="close" data-dismiss="alert" aria-label="Yopish">…&times;…</button>`.',
        ),
        expectedBehavior:
          'Yashil, qizil (sarlavhali) va sariq xabar; sariq xabardagi × bosilsa, u yo‘qoladi.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(ALERTS), { title: 'Xabarlar' }),
        checks: [
          style('success', 'Yashil xabar', '#saqlandi', 'background-color', 'rgb(212, 237, 218)'),
          style('danger', 'Qizil xabar', '#xato', 'background-color', 'rgb(248, 215, 218)'),
          has('heading', 'Xabar sarlavhasi', '#xato > .alert-heading:first-child'),
          style('warning', 'Sariq xabar', '#eslatma', 'background-color', 'rgb(255, 243, 205)'),
          after(
            [click('#eslatma .close'), wait(500)],
            has('dismiss', '× bosilganda xabar yopiladi', '#eslatma', { min: 0, max: 0 }),
          ),
        ],
      },
    },
    {
      slug: 'buttons',
      title: 'Tugmalar',
      exercise: {
        title: 'Kurs sahifasi tugmalari',
        description: 'Rangli, outline, o‘lcham va blok tugmalar.',
        instructions: md(
          '- `#saqlash` — `btn btn-primary btn-lg`.',
          '- `#batafsil` — chegarali ko‘k: `btn btn-outline-primary`.',
          '- `#ochir` — kichik chegarali qizil: `btn btn-outline-danger btn-sm`.',
          '- `#yuborish` — to‘liq kenglikdagi yashil: `btn btn-success btn-block`.',
        ),
        expectedBehavior:
          'Katta ko‘k, chegarali ko‘k, kichik chegarali qizil va to‘liq kenglikdagi yashil tugma.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(BUTTONS), { title: 'Tugmalar' }),
        checks: [
          style('primary', 'Katta ko‘k tugma', '#saqlash', 'background-color', RGB.bs4.primary),
          style(
            'outline',
            'Chegarali tugma foni shaffof',
            '#batafsil',
            'background-color',
            'rgba(0, 0, 0, 0)',
          ),
          style(
            'outline-color',
            'Chegarali tugma ko‘k',
            '#batafsil',
            'border-top-color',
            RGB.bs4.primary,
          ),
          style('sm', 'Kichik qizil tugma', '#ochir', 'font-size', '14px'),
          at(1280, 800, style('block', 'To‘liq kenglikdagi tugma', '#yuborish', 'width', '1110px')),
        ],
      },
    },
    {
      slug: 'button-groups',
      title: 'Tugmalar guruhi',
      exercise: {
        title: 'Ko‘rinish va daraja tanlash',
        description: 'Tugmalar guruhi va radio tugmalar guruhi.',
        instructions: md(
          '- `#korinish` — `btn-group`, `role="group"`, `aria-label="Ko‘rinish"`.',
          '- `#daraja` — `btn-group btn-group-toggle` va `data-toggle="buttons"`.',
          '- Har bir `<label>` — `btn btn-outline-primary`, birinchisi qo‘shimcha `active`.',
        ),
        expectedBehavior: 'Uchta yopishgan tugma; daraja tugmalaridan bosilgani ko‘k bo‘ladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(GROUPS), { title: 'Guruhlar' }),
        checks: [
          style(
            'group',
            'O‘rtadagi tugma burchaksiz',
            '#korinish > .btn:nth-child(2)',
            'border-top-left-radius',
            '0px',
          ),
          attr('role', 'Guruhda `role="group"`', '#korinish', 'role', 'group'),
          style('radio', 'Radio tugmalar yashirin', '#daraja input', 'position', 'absolute'),
          after(
            [click('#daraja label:nth-child(2)'), wait(200)],
            has('toggle', 'Bosilgan tanlov faollashadi', '#daraja label:nth-child(2).active'),
          ),
        ],
      },
    },
    {
      slug: 'badges',
      title: 'Badge',
      exercise: {
        title: 'Kurs va xabarlar belgilari',
        description: 'Rangli, pill va tugma ichidagi badge.',
        instructions: md(
          '- Sarlavhaga ` <span class="badge badge-success">Yangi</span>` qo‘shing.',
          '- “Xabarlar” tugmasiga ` <span class="badge badge-light">4</span>`.',
          '- `#kiruvchi` — `list-group-item d-flex justify-content-between align-items-center`,',
          '  oxiriga `<span class="badge badge-primary badge-pill">14</span>`.',
        ),
        expectedBehavior:
          'Yashil “Yangi”, tugmada oq badge, ro‘yxat bandida o‘ng chetda ko‘k yumaloq son.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(BADGES), { title: 'Badge' }),
        checks: [
          style('new', 'Yashil badge', '#kurs .badge', 'background-color', RGB.bs4.success),
          style('light', 'Tugmada och badge', '#xabar .badge', 'background-color', RGB.bs4.light),
          style('flex', 'Band flex konteyner', '#kiruvchi', 'justify-content', 'space-between'),
          style('pill', 'Pill badge', '#kiruvchi .badge', 'border-top-left-radius', '160px'),
        ],
      },
    },
    {
      slug: 'progress-bars',
      title: 'Progress bar',
      exercise: {
        title: 'Kurs progressi',
        description: 'Rangli va animatsiyali progress bar.',
        instructions: md(
          '- `#html` va `#css` — `progress`.',
          '- HTML: yashil bar (`progress-bar bg-success`), kengligi `60%`.',
          '- CSS: chiziqli, harakatlanuvchi moviy bar (`progress-bar progress-bar-striped progress-bar-animated bg-info`), `45%`.',
          '- Ikkala bar’da `role="progressbar"` va `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.',
        ),
        expectedBehavior: '60% yashil va 45% chiziqli harakatlanuvchi moviy bar.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(PROGRESS), { title: 'Progress' }),
        checks: [
          at(1280, 800, style('width', 'HTML bar 60%', '#html > .progress-bar', 'width', '666px')),
          style(
            'green',
            'HTML bar yashil',
            '#html > .progress-bar',
            'background-color',
            RGB.bs4.success,
          ),
          style(
            'animated',
            'CSS bar harakatlanadi',
            '#css > .progress-bar',
            'animation-name',
            'progress-bar-stripes',
          ),
          attr('aria', 'CSS bar qiymati 45', '#css > .progress-bar', 'aria-valuenow', '45'),
          style('info', 'CSS bar moviy', '#css > .progress-bar', 'background-color', RGB.bs4.info, {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'spinners',
      title: 'Spinner',
      exercise: {
        title: 'Yuklanish belgilari',
        description: 'Spinner turlari, rang va tugma ichida.',
        instructions: md(
          '- `#yuklash` — ko‘k halqa: `spinner-border text-primary`.',
          '- `#nafas` — kichik yashil “nafas oluvchi”: `spinner-grow spinner-grow-sm text-success`.',
          '- `#saqlash` tugmasi `disabled` bo‘lsin va matndan oldin',
          '  `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ` qo‘ying.',
        ),
        expectedBehavior:
          'Aylanuvchi ko‘k halqa, kichik yashil doira va ichida spinner bor o‘chirilgan tugma.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(SPINNERS), { title: 'Spinner' }),
        checks: [
          style('border', 'Ko‘k halqa aylanadi', '#yuklash', 'animation-name', 'spinner-border'),
          style('color', 'Halqa ko‘k', '#yuklash', 'color', RGB.bs4.primary),
          style('grow', 'Kichik yashil doira', '#nafas', 'width', '16px'),
          has(
            'btn',
            'Tugma ichida spinner',
            '#saqlash[disabled] > .spinner-border-sm[aria-hidden="true"]',
          ),
        ],
      },
      quiz: quiz('3-modul testi: xabarlar, tugmalar va belgilar', [
        q(
          'm3-show',
          'Bootstrap 4 da yopiladigan alertning boshlang‘ich ko‘rinish klasslari?',
          ['`.fade.show`', '`.fade.in`', '`.show.in`', '`.visible`'],
          [0],
        ),
        q(
          'm3-default',
          'Bootstrap 3 dagi `.btn-default` o‘rniga Bootstrap 4 da nima ishlatiladi?',
          [
            '`.btn-secondary` yoki `.btn-light`',
            '`.btn-default` o‘zi',
            '`.btn-plain`',
            '`.btn-white`',
          ],
          [0],
        ),
        q(
          'm3-label',
          'Bootstrap 3 dagi `.label label-success` ning Bootstrap 4 dagi muqobili?',
          [
            '`.badge badge-success`',
            '`.tag tag-success`',
            '`.label-success` o‘zgarmagan',
            '`.pill-success`',
          ],
          [0],
        ),
        q(
          'm3-progress',
          'Bootstrap 4 da progress bar rangi qanday beriladi?',
          [
            '`.bg-success` kabi fon utilitasi bilan',
            '`.progress-bar-success`',
            '`color` atributi bilan',
            '`.text-success`',
          ],
          [0],
        ),
        q(
          'm3-spinner',
          'Spinner ekran o‘quvchiga to‘g‘ri e’lon qilinishi uchun nima kerak? (bir nechta javob)',
          [
            '`role="status"`',
            '`.sr-only` ichida “Yuklanmoqda…” matni',
            'Tugma ichida o‘z matni bo‘lsa, spinnerga `aria-hidden="true"`',
            'Spinner rasm sifatida `alt` bilan',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  alerts: bs4(
    slots(ALERTS, {
      ok: cls('alert alert-success'),
      err: cls('alert alert-danger'),
      heading: '<h4 class="alert-heading">Xato!</h4>',
      warn: cls('alert alert-warning alert-dismissible fade show'),
      close: CLOSE,
    }),
    { title: 'Xabarlar' },
  ),
  buttons: bs4(
    slots(BUTTONS, {
      save: cls('btn btn-primary btn-lg'),
      more: cls('btn btn-outline-primary'),
      del: cls('btn btn-outline-danger btn-sm'),
      block: cls('btn btn-success btn-block'),
    }),
    { title: 'Tugmalar' },
  ),
  'button-groups': bs4(
    slots(GROUPS, {
      group: `${cls('btn-group')} role="group" aria-label="Ko‘rinish"`,
      toggle: `${cls('btn-group btn-group-toggle')} data-toggle="buttons"`,
      l1: cls('btn btn-outline-primary active'),
      l: cls('btn btn-outline-primary'),
    }),
    { title: 'Guruhlar' },
  ),
  badges: bs4(
    slots(BADGES, {
      new: ' <span class="badge badge-success">Yangi</span>',
      count: ' <span class="badge badge-light">4</span>',
      li: cls('list-group-item d-flex justify-content-between align-items-center'),
      pill: '<span class="badge badge-primary badge-pill">14</span>',
    }),
    { title: 'Badge' },
  ),
  'progress-bars': bs4(
    slots(PROGRESS, {
      p: cls('progress'),
      b1: bar(60, 'bg-success'),
      b2: bar(45, 'progress-bar-striped progress-bar-animated bg-info'),
    }),
    { title: 'Progress' },
  ),
  spinners: bs4(
    slots(SPINNERS, {
      border: cls('spinner-border text-primary'),
      grow: cls('spinner-grow spinner-grow-sm text-success'),
      disabled: ' disabled',
      btnSpinner:
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>\n    ',
    }),
    { title: 'Spinner' },
  ),
};
