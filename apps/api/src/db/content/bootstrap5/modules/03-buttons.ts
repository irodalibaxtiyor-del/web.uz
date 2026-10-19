import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs5,
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

const BUTTONS = `<div class="container">
  <h2>Kurs sahifasi</h2>
  <button type="button" id="saqlash"{{save}}>Kursga yozilish</button>
  <button type="button" id="batafsil"{{more}}>Batafsil</button>
  <button type="button" class="btn btn-outline-warning" id="sevimli"{{toggle}}>Sevimlilarga</button>
  <hr>
  <div id="tugmalar"{{grid}}>
    <button type="submit" class="btn btn-success" id="yuborish">Ariza yuborish</button>
    <button type="button" class="btn btn-outline-secondary">Bekor qilish</button>
  </div>
</div>`;

const radio = (id: string, label: string, checked: boolean, on: boolean) =>
  on
    ? `<input type="radio" class="btn-check" name="daraja" id="${id}" autocomplete="off"${checked ? ' checked' : ''}>
    <label class="btn btn-outline-primary" for="${id}">${label}</label>`
    : `<label><input type="radio" name="daraja" id="${id}"${checked ? ' checked' : ''}> ${label}</label>`;

const RADIOS = (on: boolean) =>
  [
    radio('d1', 'Boshlang‘ich', true, on),
    radio('d2', 'O‘rta', false, on),
    radio('d3', 'Yuqori', false, on),
  ].join('\n    ');

const GROUPS = `<div class="container">
  <h2>Ko‘rinish</h2>
  <div id="korinish"{{group}}>
    <button type="button" class="btn btn-secondary">Ro‘yxat</button>
    <button type="button" class="btn btn-secondary">Jadval</button>
    <button type="button" class="btn btn-secondary">Kartalar</button>
  </div>
  <h2>Darajangiz</h2>
  <div id="daraja"{{toggleGroup}}>
    {{radios}}
  </div>
</div>`;

const BADGES = `<div class="container">
  <h3 id="kurs">Bootstrap 5 kursi{{new}}</h3>
  <button type="button" class="btn btn-primary{{rel}}" id="xabar">
    Xabarlar{{dot}}
  </button>
</div>`;

const DOT = `
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
      99+
      <span class="visually-hidden">o‘qilmagan xabar</span>
    </span>`;

const PROGRESS = `<div class="container">
  <h2>Kurs progressi</h2>
  <p>HTML</p>
  <div id="html"{{p1}}>
    <div{{b1}}>75%</div>
  </div>
  <p>CSS (hozir o‘rganilmoqda)</p>
  <div id="css"{{p2}}>
    <div{{b2}}></div>
  </div>
</div>`;

const outer = (label: string, value: number) =>
  `${cls('progress')} role="progressbar" aria-label="${label}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"`;

const SPINNERS = `<div class="container">
  <h2>Yuklanmoqda</h2>
  <div id="yuklash"{{border}} role="status"><span class="visually-hidden">Yuklanmoqda…</span></div>
  <div id="nafas"{{grow}} role="status"><span class="visually-hidden">Yuklanmoqda…</span></div>
  <hr>
  <button class="btn btn-primary" type="button" id="saqlash"{{disabled}}>
    {{btnSpinner}}<span role="status">Saqlanmoqda…</span>
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
        description: 'Rangli, sarlavhali va `.btn-close` bilan yopiladigan alert.',
        instructions: md(
          '- `#saqlandi` — `alert alert-success`.',
          '- `#xato` — `alert alert-danger`; ichiga birinchi bo‘lib `<h4 class="alert-heading">Xato!</h4>`.',
          '- `#eslatma` — `alert alert-warning alert-dismissible fade show`; matndan keyin',
          '  `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>`.',
        ),
        expectedBehavior:
          'Yashil, qizil (sarlavhali) va sariq xabar; sariq xabardagi × bosilsa, u yo‘qoladi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(ALERTS), { title: 'Xabarlar' }),
        checks: [
          style('success', 'Yashil xabar', '#saqlandi', 'background-color', 'rgb(209, 231, 221)'),
          style('danger', 'Qizil xabar', '#xato', 'background-color', 'rgb(248, 215, 218)'),
          has('heading', 'Xabar sarlavhasi', '#xato > .alert-heading:first-child'),
          attr('label', 'Yopish tugmasi nomli', '#eslatma .btn-close', 'aria-label'),
          after(
            [click('#eslatma .btn-close'), wait(500)],
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
        description: 'Outline, `d-grid` va almashtiriladigan tugma.',
        instructions: md(
          '- `#saqlash` — `btn btn-primary btn-lg`; `#batafsil` — `btn btn-outline-primary`.',
          '- `#sevimli` — har bosishda holati almashsin: `data-bs-toggle="button"` va `aria-pressed="false"`.',
          '- `#tugmalar` — tugmalar to‘liq kenglikda va orasida masofa: `d-grid gap-2`.',
        ),
        expectedBehavior:
          'Katta ko‘k va chegarali tugmalar; “Sevimlilarga” bosilganda to‘ladi; pastda to‘liq kenglikdagi ikki tugma.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(BUTTONS), { title: 'Tugmalar' }),
        checks: [
          style('primary', 'Katta ko‘k tugma', '#saqlash', 'background-color', RGB.bs5.primary),
          style('outline', 'Chegarali tugma', '#batafsil', 'border-top-color', RGB.bs5.primary),
          at(1280, 800, style('grid', 'To‘liq kenglikdagi tugma', '#yuborish', 'width', '1116px')),
          style('gap', 'Tugmalar orasida masofa', '#tugmalar', 'row-gap', '8px'),
          after(
            [click('#sevimli'), wait(100)],
            has('toggle', 'Bosilganda faollashadi', '#sevimli.active[aria-pressed="true"]'),
          ),
        ],
      },
    },
    {
      slug: 'button-groups',
      title: 'Tugmalar guruhi',
      exercise: {
        title: 'Ko‘rinish va daraja tanlash',
        description: 'Tugmalar guruhi va `.btn-check`.',
        instructions: md(
          '- `#korinish` — `btn-group`, `role="group"`, `aria-label="Ko‘rinish"`.',
          '- `#daraja` — `btn-group` (`role="group"`, `aria-label="Darajangiz"`).',
          '- Har bir variant: `<input type="radio" class="btn-check" name="daraja" id="…" autocomplete="off">` va undan keyin',
          '  `<label class="btn btn-outline-primary" for="…">…</label>` (birinchi input `checked`).',
        ),
        expectedBehavior: 'Uchta yopishgan tugma; daraja variantlaridan tanlangani ko‘k bo‘ladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(GROUPS, { radios: RADIOS(false) }), { title: 'Guruhlar' }),
        checks: [
          style(
            'group',
            'O‘rtadagi tugma burchaksiz',
            '#korinish > .btn:nth-child(2)',
            'border-top-left-radius',
            '0px',
          ),
          style('hidden', 'Radio input yashirin', '#daraja .btn-check', 'position', 'absolute'),
          style(
            'checked',
            'Tanlangan variant to‘lgan',
            '#d1 + label',
            'background-color',
            RGB.bs5.primary,
          ),
          after(
            [click('label[for="d2"]'), wait(100)],
            has('click', 'Boshqa variant tanlanadi', '#d2:checked + label.btn'),
          ),
        ],
      },
    },
    {
      slug: 'badges',
      title: 'Badge',
      exercise: {
        title: 'Kurs va xabarlar belgilari',
        description: '`bg-*` badge va burchakdagi bildirishnoma.',
        instructions: md(
          '- Sarlavhaga ` <span class="badge bg-success">Yangi</span>` qo‘shing.',
          '- `#xabar` tugmasiga `position-relative` klassini qo‘shing va ichiga burchak belgisini joylang:',
          '  `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">99+ <span class="visually-hidden">o‘qilmagan xabar</span></span>`.',
        ),
        expectedBehavior: 'Yashil “Yangi”; tugmaning yuqori o‘ng burchagida qizil “99+”.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(BADGES), { title: 'Badge' }),
        checks: [
          style('new', 'Yashil badge', '#kurs .badge', 'background-color', RGB.bs5.success),
          style('rel', 'Tugma tayanch', '#xabar', 'position', 'relative'),
          style('abs', 'Belgi burchakda', '#xabar .badge', 'position', 'absolute'),
          style('pill', 'Belgi yumaloq', '#xabar .badge', 'border-top-left-radius', '800px'),
          has('sr', 'Ekran o‘quvchi uchun izoh', '#xabar .badge .visually-hidden'),
        ],
      },
    },
    {
      slug: 'progress-bars',
      title: 'Progress bar',
      exercise: {
        title: 'Kurs progressi (5.3 tuzilmasi)',
        description: '`role` va `aria-*` tashqi `.progress` da.',
        instructions: md(
          '- `#html` — `progress`, `role="progressbar"`, `aria-label="HTML"`, `aria-valuenow="75"`, `aria-valuemin="0"`, `aria-valuemax="100"`;',
          '  ichki bar — `progress-bar bg-success`, `style="width: 75%"`.',
          '- `#css` — xuddi shunday (`aria-label="CSS"`, qiymat 25); ichki bar — `progress-bar progress-bar-striped progress-bar-animated`, `25%`.',
        ),
        expectedBehavior: '75% yashil va 25% chiziqli harakatlanuvchi ko‘k bar.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(PROGRESS), { title: 'Progress' }),
        checks: [
          at(1280, 800, style('width', 'HTML bar 75%', '#html > .progress-bar', 'width', '837px')),
          style(
            'green',
            'HTML bar yashil',
            '#html > .progress-bar',
            'background-color',
            RGB.bs5.success,
          ),
          attr('role', 'Tashqi blok `progressbar`', '#html', 'role', 'progressbar'),
          attr('aria', 'CSS qiymati 25', '#css', 'aria-valuenow', '25'),
          style(
            'animated',
            'CSS bar harakatlanadi',
            '#css > .progress-bar',
            'animation-name',
            'progress-bar-stripes',
          ),
        ],
      },
    },
    {
      slug: 'spinners',
      title: 'Spinner',
      exercise: {
        title: 'Yuklanish belgilari',
        description: 'Spinner turlari va `.visually-hidden`.',
        instructions: md(
          '- `#yuklash` — ko‘k halqa: `spinner-border text-primary`.',
          '- `#nafas` — kichik yashil doira: `spinner-grow spinner-grow-sm text-success`.',
          '- `#saqlash` — `disabled`, matndan oldin `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> `.',
        ),
        expectedBehavior:
          'Aylanuvchi ko‘k halqa, kichik yashil doira va spinnerli o‘chirilgan tugma.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(SPINNERS), { title: 'Spinner' }),
        checks: [
          style('border', 'Ko‘k halqa aylanadi', '#yuklash', 'animation-name', 'spinner-border'),
          style('color', 'Halqa ko‘k', '#yuklash', 'color', RGB.bs5.primary),
          style('grow', 'Kichik doira', '#nafas', 'width', '16px'),
          has(
            'btn',
            'Tugma ichida spinner',
            '#saqlash[disabled] > .spinner-border-sm[aria-hidden="true"]',
          ),
        ],
      },
      quiz: quiz('3-modul testi: xabarlar, tugmalar va belgilar', [
        q(
          'm3-close',
          'Bootstrap 5 da alertni yopish tugmasi qanday yoziladi?',
          [
            '`<button class="btn-close" data-bs-dismiss="alert" aria-label="Yopish">`',
            '`<button class="close" data-dismiss="alert">&times;</button>`',
            '`<a class="alert-close">`',
            '`<button data-bs-close>`',
          ],
          [0],
        ),
        q(
          'm3-block',
          'Bootstrap 5 da `.btn-block` o‘rniga nima ishlatiladi?',
          [
            'O‘rovchi `<div class="d-grid">`',
            '`.btn-full`',
            '`.w-block`',
            '`.btn-block` o‘zgarmagan',
          ],
          [0],
        ),
        q(
          'm3-check',
          'JavaScript’siz radio tugmalar guruhi uchun Bootstrap 5 tuzilmasi?',
          [
            '`input.btn-check` + `label.btn[for]`',
            '`.btn-group-toggle` + `data-toggle="buttons"`',
            '`.form-check-inline`',
            '`.custom-radio`',
          ],
          [0],
        ),
        q(
          'm3-badge',
          'Bootstrap 5 da yashil badge qanday yoziladi? (bir nechta javob)',
          [
            '`badge bg-success`',
            '`badge text-bg-success`',
            '`badge badge-success`',
            '`label label-success`',
          ],
          [0, 1],
        ),
        q(
          'm3-hidden',
          'Bootstrap 4 dagi `.sr-only` ning Bootstrap 5 dagi nomi?',
          ['`.visually-hidden`', '`.screen-only`', '`.d-none`', '`.invisible`'],
          [0],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  alerts: bs5(
    slots(ALERTS, {
      ok: cls('alert alert-success'),
      err: cls('alert alert-danger'),
      heading: '<h4 class="alert-heading">Xato!</h4>',
      warn: cls('alert alert-warning alert-dismissible fade show'),
      close:
        '\n    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Yopish"></button>',
    }),
    { title: 'Xabarlar' },
  ),
  buttons: bs5(
    slots(BUTTONS, {
      save: cls('btn btn-primary btn-lg'),
      more: cls('btn btn-outline-primary'),
      toggle: ' data-bs-toggle="button" aria-pressed="false"',
      grid: cls('d-grid gap-2'),
    }),
    { title: 'Tugmalar' },
  ),
  'button-groups': bs5(
    slots(GROUPS, {
      group: `${cls('btn-group')} role="group" aria-label="Ko‘rinish"`,
      toggleGroup: `${cls('btn-group')} role="group" aria-label="Darajangiz"`,
      radios: RADIOS(true),
    }),
    { title: 'Guruhlar' },
  ),
  badges: bs5(
    slots(BADGES, {
      new: ' <span class="badge bg-success">Yangi</span>',
      rel: ' position-relative',
      dot: DOT,
    }),
    { title: 'Badge' },
  ),
  'progress-bars': bs5(
    slots(PROGRESS, {
      p1: outer('HTML', 75),
      b1: `${cls('progress-bar bg-success')} style="width: 75%"`,
      p2: outer('CSS', 25),
      b2: `${cls('progress-bar progress-bar-striped progress-bar-animated')} style="width: 25%"`,
    }),
    { title: 'Progress' },
  ),
  spinners: bs5(
    slots(SPINNERS, {
      border: cls('spinner-border text-primary'),
      grow: cls('spinner-grow spinner-grow-sm text-success'),
      disabled: ' disabled',
      btnSpinner: '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>\n    ',
    }),
    { title: 'Spinner' },
  ),
};
