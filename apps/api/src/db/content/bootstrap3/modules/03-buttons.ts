import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  attr,
  bs3,
  cls,
  has,
  md,
  q,
  quiz,
  RGB,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const BUTTONS = `<div class="container">
  <h2>Ro‘yxatdan o‘tish</h2>
  <p>Ma’lumotlaringizni tekshiring va tasdiqlang.</p>
  <button type="button" id="tasdiq"{{ok}}>Tasdiqlash</button>
  <a href="#" id="ortga"{{back}}>Ortga</a>
  <button type="button" id="kutish"{{wait}}>Yuborilmoqda…</button>
  <hr>
  <button type="submit" id="yuborish"{{submit}}>Ro‘yxatdan o‘tish</button>
</div>`;

const GROUPS = `<div class="container">
  <h2>Matn muharriri</h2>
  <div id="tekislash"{{row}}>
    <button type="button" class="btn btn-default">Chap</button>
    <button type="button" class="btn btn-default">Markaz</button>
    <button type="button" class="btn btn-default">O‘ng</button>
  </div>
  <h3>Bo‘limlar</h3>
  <div id="bolimlar"{{col}}>
    <button type="button" class="btn btn-primary">Profil</button>
    <button type="button" class="btn btn-primary">Kurslar</button>
    <button type="button" class="btn btn-primary">Sozlamalar</button>
  </div>
</div>`;

const ICONS = `<div class="container">
  <h2>Vazifalar</h2>
  <p>Hisobotni tayyorlash</p>
  <button type="button" class="btn btn-default" id="tahrir">{{pencil}}Tahrirlash</button>
  <button type="button" class="btn btn-danger" id="ochir">{{trash}}O‘chirish</button>
  <button type="button" class="btn btn-default" id="qidir"{{label}}>{{search}}</button>
</div>`;

const BADGES = `<div class="container">
  <h2>Bootstrap kursi{{label}}</h2>
  <p>Mavsumiy chegirma: <span id="chegirma"{{sale}}>-20%</span></p>
  <button type="button" class="btn btn-primary" id="xabar">Xabarlar{{badge}}</button>
</div>`;

const PROGRESS = `<div class="container">
  <h2>Kurs progressi</h2>
  <p>HTML</p>
  <div id="html"{{p1}}>
    <div{{b1}}>70%</div>
  </div>
  <p>CSS</p>
  <div id="css"{{p2}}>
    <div{{b2}}>45%</div>
  </div>
</div>`;

const bar = (value: number, extra: string) =>
  `${cls(`progress-bar ${extra}`)} role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" style="width: ${value}%"`;

export const m03: ModuleDef = {
  title: 'Tugmalar va belgilar',
  lessons: [
    {
      slug: 'buttons',
      title: 'Tugmalar',
      exercise: {
        title: 'Forma tugmalari',
        description: 'Rang, o‘lcham, holat va blok tugma.',
        instructions: md(
          '- `#tasdiq` — yashil va katta tugma: `btn btn-success btn-lg`.',
          '- `#ortga` havolasi oddiy tugma ko‘rinishida: `btn btn-default` (va `role="button"`).',
          '- `#kutish` — ko‘k, **o‘chirilgan** tugma (`btn btn-primary` + `disabled` atributi).',
          '- `#yuborish` — to‘liq kenglikdagi ko‘k tugma: `btn btn-primary btn-block`.',
        ),
        expectedBehavior:
          'Katta yashil tugma, oq “Ortga”, xira o‘chirilgan tugma va pastda to‘liq kenglikdagi ko‘k tugma.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(BUTTONS), { title: 'Tugmalar' }),
        checks: [
          style('success', '`#tasdiq` yashil', '#tasdiq', 'background-color', RGB.bs3.success),
          style('lg', '`#tasdiq` katta', '#tasdiq', 'font-size', '18px'),
          style(
            'default',
            '“Ortga” — oq tugma',
            '#ortga',
            'border-top-color',
            'rgb(204, 204, 204)',
          ),
          has('disabled', '`#kutish` o‘chirilgan', '#kutish.btn.btn-primary[disabled]'),
          at(
            1280,
            800,
            style('block', '`#yuborish` to‘liq kenglikda', '#yuborish', 'width', '1140px'),
          ),
        ],
      },
    },
    {
      slug: 'button-groups',
      title: 'Tugmalar guruhi',
      exercise: {
        title: 'Muharrir paneli',
        description: 'Gorizontal va vertikal tugmalar guruhi.',
        instructions: md(
          '- `#tekislash` — gorizontal guruh: `btn-group`, `role="group"` va `aria-label="Tekislash"`.',
          '- `#bolimlar` — vertikal guruh: `btn-group-vertical`.',
        ),
        expectedBehavior:
          'Uchta tekislash tugmasi bir-biriga yopishgan, bo‘limlar tugmalari ustma-ust yopishgan.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(GROUPS), { title: 'Muharrir' }),
        checks: [
          style(
            'row',
            'O‘rtadagi tugma burchaksiz',
            '#tekislash > .btn:nth-child(2)',
            'border-top-left-radius',
            '0px',
            {
              hint: '`#tekislash` ga `btn-group` klassini bering.',
            },
          ),
          attr('a11y', 'Guruhda `role="group"`', '#tekislash', 'role', 'group'),
          attr('label', 'Guruh nomi (`aria-label`)', '#tekislash', 'aria-label', undefined, {
            hidden: true,
          }),
          style('col', 'Bo‘limlar ustma-ust', '#bolimlar > .btn', 'display', 'block', {
            hint: '`btn-group-vertical` klassi.',
          }),
        ],
      },
    },
    {
      slug: 'glyphicons',
      title: 'Glyphicons ikonkalari',
      exercise: {
        title: 'Ikonkali tugmalar',
        description: 'Glyphicons va accessibility.',
        instructions: md(
          'Har bir tugma matnidan **oldin** ikonka qo‘ying (`<span class="glyphicon …" aria-hidden="true"></span>`):',
          '',
          '- `#tahrir` — `glyphicon-pencil`;',
          '- `#ochir` — `glyphicon-trash`;',
          '- `#qidir` — faqat `glyphicon-search` ikonkasi, tugmaning o‘ziga `aria-label="Qidirish"` bering.',
        ),
        expectedBehavior:
          'Uchta tugmada qalam, savat va lupa ikonkalari; qidirish tugmasini ekran o‘quvchi “Qidirish” deb o‘qiydi.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(ICONS), { title: 'Vazifalar' }),
        checks: [
          has('pencil', 'Qalam ikonkasi', '#tahrir > .glyphicon.glyphicon-pencil'),
          has('trash', 'Savat ikonkasi', '#ochir > .glyphicon.glyphicon-trash'),
          style(
            'font',
            'Ikonka shrifti yuklangan',
            '#qidir .glyphicon-search',
            'font-family',
            '"Glyphicons Halflings"',
          ),
          attr('aria', 'Qidirish tugmasi nomli', '#qidir', 'aria-label', 'Qidirish'),
          has('hidden', 'Ikonkalar ekran o‘quvchidan yashirin', '.glyphicon[aria-hidden="true"]', {
            min: 3,
          }),
        ],
      },
    },
    {
      slug: 'badges-labels',
      title: 'Badge va label',
      exercise: {
        title: 'Kurs kartochkasi belgilar',
        description: 'Label va badge.',
        instructions: md(
          '- Sarlavhaga yashil yorliq qo‘shing: ` <span class="label label-success">Yangi</span>`.',
          '- `#chegirma` qizil yorliq bo‘lsin: `label label-danger`.',
          '- “Xabarlar” tugmasiga ` <span class="badge">3</span>` qo‘shing.',
        ),
        expectedBehavior:
          'Sarlavha yonida yashil “Yangi”, qizil “-20%” va tugma ichida oq badge’da 3.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(BADGES), { title: 'Kurs' }),
        checks: [
          style(
            'new',
            'Yashil “Yangi” yorlig‘i',
            'h2 .label-success',
            'background-color',
            RGB.bs3.success,
          ),
          style('sale', 'Chegirma qizil yorliqda', '#chegirma', 'background-color', RGB.bs3.danger),
          style(
            'badge',
            'Tugmada badge (oq fon)',
            '#xabar .badge',
            'background-color',
            'rgb(255, 255, 255)',
          ),
        ],
      },
    },
    {
      slug: 'progress-bars',
      title: 'Progress bar',
      exercise: {
        title: 'Kurs progressi',
        description: 'Rangli va chiziqli progress bar.',
        instructions: md(
          '- `#html` va `#css` bloklariga `progress` klassini bering.',
          '- HTML progressi: yashil bar (`progress-bar progress-bar-success`), kengligi `70%`.',
          '- CSS progressi: chiziqli harakatlanuvchi bar (`progress-bar progress-bar-striped active`), kengligi `45%`.',
          '- Har bir bar’da `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` bo‘lsin.',
        ),
        expectedBehavior:
          'Ikkita kulrang yo‘lak: birida 70% yashil, ikkinchisida 45% chiziqli harakatlanuvchi ko‘k bar.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(PROGRESS), { title: 'Progress' }),
        checks: [
          at(1280, 800, style('width', 'HTML bar 70%', '#html > .progress-bar', 'width', '798px')),
          style(
            'color',
            'HTML bar yashil',
            '#html > .progress-bar',
            'background-color',
            RGB.bs3.success,
          ),
          has(
            'striped',
            'CSS bar chiziqli va harakatlanadi',
            '#css > .progress-bar.progress-bar-striped.active',
          ),
          attr(
            'role',
            'Bar’larda `role="progressbar"`',
            '#css > .progress-bar',
            'role',
            'progressbar',
          ),
          attr('aria', 'CSS bar qiymati 45', '#css > .progress-bar', 'aria-valuenow', '45', {
            hidden: true,
          }),
        ],
      },
      quiz: quiz('3-modul testi: tugmalar va belgilar', [
        q(
          'm3-block',
          'Tugmani ota elementning to‘liq kengligiga cho‘zadigan klass?',
          ['`.btn-block`', '`.btn-full`', '`.btn-lg`', '`.btn-wide`'],
          [0],
        ),
        q(
          'm3-link',
          'Boshqa sahifaga o‘tadigan “tugma” uchun qaysi teg to‘g‘ri?',
          [
            '`<a href="…" class="btn btn-default" role="button">`',
            '`<button onclick="location=…">`',
            '`<div class="btn">`',
            '`<span class="btn">`',
          ],
          [0],
        ),
        q(
          'm3-vertical',
          'Tugmalarni ustma-ust guruhlaydigan klass?',
          [
            '`.btn-group-vertical`',
            '`.btn-group-stacked`',
            '`.btn-toolbar`',
            '`.btn-group-justified`',
          ],
          [0],
        ),
        q(
          'm3-glyph',
          'Glyphicons haqida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            'Ikonka elementi bo‘sh bo‘ladi',
            'Matn yonidagi ikonkaga `aria-hidden="true"` beriladi',
            'Ikonka shrift bo‘lgani uchun rangi `color` bilan o‘zgaradi',
            'Bootstrap 5 da ham Glyphicons bor',
          ],
          [0, 1, 2],
        ),
        q(
          'm3-progress',
          'Progress bar kengligi qanday beriladi?',
          [
            '`.progress-bar` ga `style="width: 70%"`',
            '`.progress` ga `data-value="70"`',
            '`.progress-70` klassi',
            '`aria-valuenow` avtomatik kenglik beradi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s03: Record<string, ProjectFile[]> = {
  buttons: bs3(
    slots(BUTTONS, {
      ok: cls('btn btn-success btn-lg'),
      back: `${cls('btn btn-default')} role="button"`,
      wait: `${cls('btn btn-primary')} disabled`,
      submit: cls('btn btn-primary btn-block'),
    }),
    { title: 'Tugmalar' },
  ),
  'button-groups': bs3(
    slots(GROUPS, {
      row: `${cls('btn-group')} role="group" aria-label="Tekislash"`,
      col: `${cls('btn-group-vertical')} role="group" aria-label="Bo‘limlar"`,
    }),
    { title: 'Muharrir' },
  ),
  glyphicons: bs3(
    slots(ICONS, {
      pencil: '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> ',
      trash: '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> ',
      search: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
      label: ' aria-label="Qidirish"',
    }),
    { title: 'Vazifalar' },
  ),
  'badges-labels': bs3(
    slots(BADGES, {
      label: ' <span class="label label-success">Yangi</span>',
      sale: cls('label label-danger'),
      badge: ' <span class="badge">3</span>',
    }),
    { title: 'Kurs' },
  ),
  'progress-bars': bs3(
    slots(PROGRESS, {
      p1: cls('progress'),
      p2: cls('progress'),
      b1: bar(70, 'progress-bar-success'),
      b2: bar(45, 'progress-bar-striped active'),
    }),
    { title: 'Progress' },
  ),
};
