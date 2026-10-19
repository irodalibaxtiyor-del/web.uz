import type { ProjectFile } from '@webdizayn/shared';
import {
  at,
  bs3,
  cls,
  md,
  pic,
  q,
  quiz,
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const BOX =
  'style="background: #f5faff; border: 1px solid #c6dbf5; padding-top: 10px; padding-bottom: 10px;"';

const SYSTEM = `<div class="container">
  <div class="row">
    <div id="forma"{{forma}} ${BOX}>Kirish formasi (markazda)</div>
  </div>
  <div class="row">
    <div id="asosiy"{{asosiy}} ${BOX}>Asosiy kontent — HTML’da birinchi</div>
    <div id="yon"{{yon}} ${BOX}>Yon panel — ekranda chapda</div>
  </div>
</div>`;

const STACKED = `<div class="container">
  <div class="row">
    <div id="a"{{half}} ${BOX}>Chap yarmi</div>
    <div id="b"{{half}} ${BOX}>O‘ng yarmi</div>
  </div>
  <div class="row">
    <div id="c"{{third}} ${BOX}>1</div>
    <div id="d"{{third}} ${BOX}>2</div>
    <div id="e"{{third}} ${BOX}>3</div>
  </div>
</div>`;

const SMALL = `<div class="container">
  <h2>Ikonkalar paneli</h2>
  <div class="row">
    <div id="i1"{{c}} ${BOX}>Profil</div>
    <div id="i2"{{c}} ${BOX}>Kurslar</div>
    <div id="i3"{{c}} ${BOX}>Xabarlar</div>
    <div id="i4"{{c}} ${BOX}>Sozlamalar</div>
  </div>
</div>`;

const card = (n: number, slot: string) => `<div id="k${n}"{{${slot}}} ${BOX}>Kurs ${n}</div>`;

const MEDIUM = `<div class="container">
  <div id="banner"{{banner}} style="background: #fcf8e3; padding: 15px;">Kuzgi chegirma: barcha kurslar -20%</div>
  <div class="row">
    ${card(1, 'c')}
    ${card(2, 'c')}
    ${card(3, 'c')}
    ${card(4, 'c')}
  </div>
</div>`;

const LARGE = `<div class="container">
  <div class="row">
    ${card(1, 'c')}
    ${card(2, 'c')}
    ${card(3, 'c')}
    ${card(4, 'c')}
  </div>
  <div class="row">
    <article id="maqola"{{art}} ${BOX}>
      <h2>Qator uzunligi</h2>
      <p>Qulay o‘qish uchun bir qatorda 60–80 belgi bo‘lgani ma’qul.</p>
    </article>
  </div>
</div>`;

const thumb = (n: number, name: string, color: string) => `<div id="t${n}"{{col}}>
      <div{{thumb}}>
        <img src="${pic(name, 300, 180, color)}" alt="${name} kursi">
        <div class="caption"><h3>${name}</h3></div>
      </div>
    </div>`;

const EXAMPLES = `<div class="container">
  <p id="telefon"{{phone}}>Telefon versiyasi: kurslarni pastga aylantiring.</p>
  <p id="kompyuter"{{desktop}}>Barcha kurslar bir qarashda.</p>
  <div class="row">
    ${thumb(1, 'HTML', '#e34c26')}
    ${thumb(2, 'CSS', '#264de4')}
    ${thumb(3, 'JavaScript', '#f0ad4e')}
    ${thumb(4, 'Bootstrap', '#563d7c')}
  </div>
</div>`;

export const m07: ModuleDef = {
  title: 'Setka tizimi',
  lessons: [
    {
      slug: 'grid-system',
      title: 'Setka tizimi chuqurroq',
      exercise: {
        title: 'Offset va push/pull',
        description: 'Ustunni markazga olish va tartibni almashtirish.',
        instructions: md(
          '- `#forma` noutbukda (`md`) 6 ustun kenglikda va **markazda** bo‘lsin (offset bilan).',
          '- `#asosiy` — `col-md-9`, `#yon` — `col-md-3`; HTML tartibi o‘zgarmasin, lekin ekranda yon panel **chapda** tursin',
          '  (`col-md-push-3` va `col-md-pull-9`).',
        ),
        expectedBehavior:
          'Noutbukda forma o‘rtada; pastda chapda yon panel, o‘ngda asosiy kontent.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(SYSTEM), { title: 'Setka' }),
        checks: [
          at(
            1000,
            800,
            style('offset', 'Forma markazda (offset 3)', '#forma', 'margin-left', '242.5px'),
          ),
          at(1000, 800, style('width', 'Forma 6 ustun', '#forma', 'width', '485px')),
          at(
            1000,
            800,
            style('push', 'Asosiy kontent o‘ngga surilgan', '#asosiy', 'left', '242.5px'),
          ),
          at(1000, 800, style('pull', 'Yon panel chapga tortilgan', '#yon', 'right', '727.5px')),
        ],
      },
    },
    {
      slug: 'grid-stacked',
      title: 'Ustma-ust va yonma-yon',
      exercise: {
        title: 'Planshetdan yonma-yon',
        description: 'Bitta sinf bilan moslashuvchan setka.',
        instructions: md(
          '- Birinchi qatordagi ikki blok planshetdan boshlab teng yarim bo‘lsin.',
          '- Ikkinchi qatordagi uch blok planshetdan boshlab teng uchdan bir bo‘lsin.',
          '- Telefonda hammasi ustma-ust.',
        ),
        expectedBehavior: '768px dan kengda 2 + 3 blok yonma-yon, torroqda bitta ustun.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(STACKED), { title: 'Setka' }),
        checks: [
          at(800, 600, style('half', 'Yarim kenglik (planshet)', '#b', 'width', '375px')),
          at(800, 600, style('third', 'Uchdan bir (planshet)', '#e', 'width', '250px')),
          at(375, 700, style('stack', 'Telefonda ustma-ust', '#d', 'float', 'none')),
        ],
      },
    },
    {
      slug: 'grid-small',
      title: 'xs va sm birga',
      exercise: {
        title: 'Ikonkalar paneli',
        description: 'Telefonda 2, planshetda 4 ustun.',
        instructions: md(
          'To‘rtta blok telefonda **ikkitadan** (yarim kenglik), planshet va undan katta ekranda **to‘rttadan** bir qatorda tursin.',
        ),
        expectedBehavior: 'Telefonda 2×2 to‘r, planshetda bir qator.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(SMALL), { title: 'Panel' }),
        checks: [
          at(400, 700, style('xs', 'Telefonda yarim kenglik', '#i3', 'width', '200px')),
          at(800, 600, style('sm', 'Planshetda chorak kenglik', '#i3', 'width', '187.5px')),
          at(
            400,
            700,
            style('float', 'Telefonda ham yonma-yon', '#i1', 'float', 'left', { hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'grid-medium',
      title: 'Noutbuk uchun setka',
      exercise: {
        title: 'Kurslar va banner',
        description: '`sm` + `md` va ko‘rinish klasslari.',
        instructions: md(
          '- To‘rtta kurs bloki planshetda ikkitadan, noutbukda (`md`) to‘rttadan bir qatorda bo‘lsin.',
          '- `#banner` faqat noutbuk va undan katta ekranda ko‘rinsin (`hidden-xs hidden-sm`).',
        ),
        expectedBehavior:
          'Planshetda 2×2 kurs va bannersiz; noutbukda banner va bir qatorda 4 kurs.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(MEDIUM), { title: 'Kurslar' }),
        checks: [
          at(800, 600, style('sm', 'Planshetda yarim kenglik', '#k2', 'width', '375px')),
          at(1000, 800, style('md', 'Noutbukda chorak kenglik', '#k2', 'width', '242.5px')),
          at(800, 600, style('hide', 'Planshetda banner yashirin', '#banner', 'display', 'none')),
          at(
            1000,
            800,
            style('show', 'Noutbukda banner ko‘rinadi', '#banner', 'display', 'block', {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'grid-large',
      title: 'Katta ekran uchun setka',
      exercise: {
        title: 'Keng monitor maketi',
        description: '`md` + `lg` va o‘qish uchun qulay ustun.',
        instructions: md(
          '- Kurs bloklari noutbukda ikkitadan (`col-md-6`), katta monitorda to‘rttadan (`col-lg-3`) bo‘lsin.',
          '- `#maqola` katta monitorda 8 ustun kenglikda va markazda bo‘lsin (`col-lg-8 col-lg-offset-2`).',
        ),
        expectedBehavior:
          'Noutbukda kurslar 2 ustunda, monitorda 4 ustunda; maqola monitorda o‘rtada, tor ustunda.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(LARGE), { title: 'Monitor' }),
        checks: [
          at(1000, 800, style('md', 'Noutbukda yarim kenglik', '#k3', 'width', '485px')),
          at(1280, 800, style('lg', 'Monitorda chorak kenglik', '#k3', 'width', '292.5px')),
          at(1280, 800, style('article', 'Maqola 8 ustun', '#maqola', 'width', '780px')),
          at(1280, 800, style('center', 'Maqola markazda', '#maqola', 'margin-left', '195px')),
        ],
      },
    },
    {
      slug: 'grid-examples',
      title: 'Setka namunalari',
      exercise: {
        title: 'Kurslar katalogi',
        description: 'Kartochkalar, thumbnail va ko‘rinish klasslari.',
        instructions: md(
          '- Har bir kurs ustuni: `col-xs-12 col-sm-6 col-md-3`; ichki blok — `thumbnail`.',
          '- `#telefon` faqat telefonda ko‘rinsin (`visible-xs-block`), `#kompyuter` telefonda yashirinsin (`hidden-xs`).',
        ),
        expectedBehavior:
          'Telefonda bitta ustun va “Telefon versiyasi” matni; noutbukda 4 ta ramkali kartochka.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(EXAMPLES), { title: 'Katalog' }),
        checks: [
          at(1000, 800, style('md', 'Noutbukda 4 ustun', '#t4', 'width', '242.5px')),
          style('thumb', 'Kartochka ramkali', '#t1 > div', 'padding-top', '4px'),
          at(375, 700, style('phone', 'Telefonda telefon matni', '#telefon', 'display', 'block')),
          at(
            375,
            700,
            style('desktop', 'Telefonda kompyuter matni yashirin', '#kompyuter', 'display', 'none'),
          ),
          at(
            1000,
            800,
            style('phone-hide', 'Noutbukda telefon matni yashirin', '#telefon', 'display', 'none', {
              hidden: true,
            }),
          ),
        ],
      },
      quiz: quiz('7-modul testi: setka tizimi', [
        q(
          'm7-float',
          'Bootstrap 3 setkasi qaysi CSS mexanizmiga asoslangan?',
          ['`float`', 'Flexbox', 'CSS Grid', '`position: absolute`'],
          [0],
        ),
        q(
          'm7-mobile',
          '`col-sm-6` klassli blok qaysi ekranlarda yarim kenglikda bo‘ladi?',
          [
            '768px va undan keng barcha ekranlarda',
            'Faqat 768–991px oralig‘ida',
            'Faqat telefonda',
            'Faqat 1200px dan keng ekranda',
          ],
          [0],
        ),
        q(
          'm7-center',
          '`md` ekranda 6 ustunli blokni markazga olish uchun qaysi klass qo‘shiladi?',
          ['`col-md-offset-3`', '`col-md-offset-6`', '`col-md-push-6`', '`center-block`'],
          [0],
        ),
        q(
          'm7-lgonly',
          'Faqat `col-lg-6` yozilgan bloklar 1000px kenglikdagi noutbukda qanday ko‘rinadi?',
          [
            'Ustma-ust, har biri 100% kenglikda',
            'Yonma-yon, 50% dan',
            'Ko‘rinmaydi',
            'Yonma-yon, 25% dan',
          ],
          [0],
        ),
        q(
          'm7-hidden',
          'Faqat telefonda ko‘rinadigan blok uchun qaysi klass?',
          ['`.visible-xs-block`', '`.hidden-xs`', '`.col-xs-12`', '`.visible-lg-block`'],
          [0],
        ),
      ]),
    },
  ],
};

export const s07: Record<string, ProjectFile[]> = {
  'grid-system': bs3(
    slots(SYSTEM, {
      forma: cls('col-md-6 col-md-offset-3'),
      asosiy: cls('col-md-9 col-md-push-3'),
      yon: cls('col-md-3 col-md-pull-9'),
    }),
    { title: 'Setka' },
  ),
  'grid-stacked': bs3(slots(STACKED, { half: cls('col-sm-6'), third: cls('col-sm-4') }), {
    title: 'Setka',
  }),
  'grid-small': bs3(slots(SMALL, { c: cls('col-xs-6 col-sm-3') }), { title: 'Panel' }),
  'grid-medium': bs3(
    slots(MEDIUM, { c: cls('col-sm-6 col-md-3'), banner: cls('hidden-xs hidden-sm') }),
    {
      title: 'Kurslar',
    },
  ),
  'grid-large': bs3(
    slots(LARGE, { c: cls('col-md-6 col-lg-3'), art: cls('col-lg-8 col-lg-offset-2') }),
    {
      title: 'Monitor',
    },
  ),
  'grid-examples': bs3(
    slots(EXAMPLES, {
      col: cls('col-xs-12 col-sm-6 col-md-3'),
      thumb: cls('thumbnail'),
      phone: cls('visible-xs-block'),
      desktop: cls('hidden-xs'),
    }),
    { title: 'Katalog' },
  ),
};
