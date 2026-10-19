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
  slots,
  style,
  type ModuleDef,
} from '../../bootstrap/shared';

const HORIZONTAL = `<div class="container">
  <h2>Profil sozlamalari</h2>
  <form id="forma"{{form}}>
    <div{{group}}>
      <label for="ism"{{label}}>Ism:</label>
      <div{{col}}>
        <input type="text" id="ism"{{input}}>
      </div>
    </div>
    <div{{group}}>
      <label for="email"{{label}}>Email:</label>
      <div{{col}}>
        <input type="email" id="email"{{input}}>
      </div>
    </div>
    <div{{group}}>
      <div{{offset}}>
        <button type="submit" class="btn btn-primary">Saqlash</button>
      </div>
    </div>
  </form>
</div>`;

const INPUTS = `<div class="container">
  <h2>Kursga yozilish</h2>
  <form>
    <div class="form-group">
      <label for="email">Email:</label>
      <input id="email"{{email}}>
    </div>
    <div class="form-group">
      <label for="shahar">Shahar:</label>
      <select id="shahar"{{select}}>
        <option>Toshkent</option>
        <option>Samarqand</option>
        <option>Buxoro</option>
      </select>
    </div>
    <div class="form-group">
      <label for="maqsad">Nima uchun o‘rganmoqchisiz?</label>
      <textarea id="maqsad"{{textarea}}></textarea>
    </div>
    <fieldset>
      <legend>Darajangiz</legend>
      {{radios}}
    </fieldset>
    <button type="submit" class="btn btn-primary">Yuborish</button>
  </form>
</div>`;

const RADIOS = `<label class="radio-inline"><input type="radio" name="daraja" value="boshlang" checked> Boshlang‘ich</label>
      <label class="radio-inline"><input type="radio" name="daraja" value="orta"> O‘rta</label>
      <label class="radio-inline"><input type="radio" name="daraja" value="yuqori"> Yuqori</label>`;

const RADIOS_START = `<input type="radio" value="boshlang" checked> Boshlang‘ich
      <input type="radio" value="orta"> O‘rta
      <input type="radio" value="yuqori"> Yuqori`;

const STATES = `<div class="container">
  <h2>Ro‘yxatdan o‘tish</h2>
  <form>
    <div class="form-group">
      <label for="raqam">Ariza raqami</label>
      <input type="text" class="form-control" id="raqam" value="WD-2026-0142"{{readonly}}>
    </div>
    <div id="emailGuruh"{{emailGroup}}>
      <label for="email"{{emailLabel}}>Email</label>
      <input type="email" class="form-control" id="email" value="aziza@"{{emailAria}}>
      {{emailHelp}}
    </div>
    <div id="loginGuruh"{{loginGroup}}>
      <label for="login"{{loginLabel}}>Login</label>
      <input type="text" class="form-control" id="login" value="aziza_k">
      {{loginIcon}}
    </div>
  </form>
</div>`;

const SIZING = `<div class="container">
  <h2>Kurs qidirish</h2>
  <input type="search" id="qidiruv" placeholder="Kurs nomi" aria-label="Kurs nomi"{{search}}>
  <h3>Profil</h3>
  {{userOpen}}
    <input type="text" class="form-control" id="login" placeholder="foydalanuvchi" aria-label="Foydalanuvchi nomi">
  {{userClose}}
  <h3>Promokod</h3>
  {{promoOpen}}
    <input type="text" class="form-control" id="promo" aria-label="Promokod">
  {{promoClose}}
</div>`;

export const m05: ModuleDef = {
  title: 'Formalar',
  lessons: [
    {
      slug: 'forms',
      title: 'Forma turlari',
      exercise: {
        title: 'Gorizontal sozlamalar formasi',
        description: 'Yorliq chapda, maydon o‘ngda.',
        instructions: md(
          '- Forma: `form-horizontal`.',
          '- Har bir guruh `<div>` — `form-group`.',
          '- Yorliqlar: `control-label col-sm-2`; maydon o‘ramlari: `col-sm-10`; maydonlar: `form-control`.',
          '- Tugma o‘rami: `col-sm-offset-2 col-sm-10`.',
        ),
        expectedBehavior:
          'Keng ekranda yorliqlar chap ustunda o‘ngga tekislangan, maydonlar keng o‘ng ustunda, tugma maydonlar ostida.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(HORIZONTAL), { title: 'Sozlamalar' }),
        checks: [
          at(
            1280,
            800,
            style(
              'label',
              'Yorliqlar o‘ngga tekislangan',
              'label[for="ism"]',
              'text-align',
              'right',
            ),
          ),
          at(1280, 800, style('input', 'Maydon 10/12 ustunda', '#ism', 'width', '945px')),
          style('control', 'Maydon `.form-control`', '#email', 'height', '34px'),
          at(
            1280,
            800,
            style(
              'offset',
              'Tugma maydonlar bilan bir chiziqda',
              '#forma > div:last-child > div',
              'margin-left',
              '195px',
              { hidden: true },
            ),
          ),
          has(
            'offset-class',
            'Tugma o‘ramida `col-sm-offset-2`',
            '.col-sm-offset-2.col-sm-10 > .btn',
          ),
        ],
      },
    },
    {
      slug: 'inputs',
      title: 'Kiritish maydonlari',
      exercise: {
        title: 'Yozilish formasi',
        description: 'Input turlari, select, textarea va radio.',
        instructions: md(
          '- Email maydoni: `type="email"` va `form-control`.',
          '- `select` va `textarea` — `form-control`; textarea’ga `rows="3"`.',
          '- Radio tugmalarni bitta guruhga birlashtiring (`name="daraja"`) va har birini',
          '  `<label class="radio-inline">…</label>` ichiga oling.',
        ),
        expectedBehavior:
          'Barcha maydonlar to‘liq kenglikda bir xil ko‘rinishda; daraja tugmalari bir qatorda, faqat bittasini tanlash mumkin.',
        difficulty: 'EASY',
        starterFiles: bs3(slots(INPUTS, { radios: RADIOS_START }), { title: 'Yozilish' }),
        checks: [
          has('email', 'Email maydoni to‘g‘ri', 'input#email[type="email"].form-control'),
          style('select', '`select` — `.form-control`', '#shahar', 'height', '34px'),
          attr('rows', 'Textarea 3 qatorli', 'textarea#maqsad.form-control', 'rows', '3'),
          has(
            'radio',
            'Radio tugmalar bir guruhda',
            '.radio-inline > input[type="radio"][name="daraja"]',
            {
              min: 3,
              max: 3,
            },
          ),
        ],
      },
    },
    {
      slug: 'inputs-2',
      title: 'Holatlar va tekshiruv',
      exercise: {
        title: 'Forma xatolari',
        description: 'Readonly, xato va muvaffaqiyat holatlari.',
        instructions: md(
          '- `#raqam` faqat o‘qish uchun bo‘lsin (`readonly`).',
          '- `#emailGuruh` — `form-group has-error`, yorlig‘i — `control-label`.',
          '- Email maydoni ostiga `<span id="emailXato" class="help-block">Email to‘liq yozilmagan.</span>` qo‘shing va maydonga `aria-describedby="emailXato"` bering.',
          '- `#loginGuruh` — `form-group has-success has-feedback`, yorlig‘i — `control-label`; maydondan keyin',
          '  `<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>`.',
        ),
        expectedBehavior:
          'Email qatori qizil yorliq va izoh bilan, login qatori yashil va ichida ✓ ikonka.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(
          slots(STATES, { emailGroup: cls('form-group'), loginGroup: cls('form-group') }),
          {
            title: 'Ro‘yxat',
          },
        ),
        checks: [
          has('readonly', '`#raqam` — readonly', '#raqam[readonly]'),
          style(
            'error',
            'Email yorlig‘i qizil',
            '#emailGuruh .control-label',
            'color',
            'rgb(169, 68, 66)',
          ),
          attr('describe', 'Izoh maydonga bog‘langan', '#email', 'aria-describedby', 'emailXato'),
          style(
            'success',
            'Login maydoni yashil chegarali',
            '#login',
            'border-top-color',
            'rgb(60, 118, 61)',
          ),
          has(
            'feedback',
            'Login ichida ✓ ikonka',
            '#loginGuruh.has-feedback .glyphicon-ok.form-control-feedback',
          ),
        ],
      },
    },
    {
      slug: 'input-sizing',
      title: 'O‘lcham va input group',
      exercise: {
        title: 'Qidiruv va qo‘shimchali maydonlar',
        description: 'Katta maydon, addon va tugmali input group.',
        instructions: md(
          '- `#qidiruv` — katta maydon: `form-control input-lg`.',
          '- `#login` ni `<div class="input-group">` ichiga oling va undan oldin `<span class="input-group-addon">@</span>` qo‘ying.',
          '- `#promo` ni ham `input-group` ichiga oling, undan keyin',
          '  `<span class="input-group-btn"><button class="btn btn-default" type="button">Qo‘llash</button></span>`.',
        ),
        expectedBehavior:
          'Katta qidiruv maydoni, “@” belgili login maydoni va o‘ng chetida tugmali promokod maydoni.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(SIZING), { title: 'Qidiruv' }),
        checks: [
          style('lg', 'Qidiruv maydoni katta', '#qidiruv', 'height', '46px'),
          style(
            'addon',
            '“@” qo‘shimchasi',
            '.input-group-addon',
            'background-color',
            'rgb(238, 238, 238)',
          ),
          has(
            'addon-order',
            '“@” login maydonidan oldin',
            '.input-group > .input-group-addon + #login',
          ),
          has('btn', 'Promokod tugmasi', '.input-group > #promo + .input-group-btn > .btn'),
        ],
      },
      quiz: quiz('5-modul testi: formalar', [
        q(
          'm5-control',
          'Maydonlarga Bootstrap ko‘rinishi va 100% kenglik beradigan klass?',
          ['`.form-control`', '`.form-group`', '`.input`', '`.form-field`'],
          [0],
        ),
        q(
          'm5-horizontal',
          'Gorizontal formada yorliqni maydon bilan tekislaydigan klass?',
          ['`.control-label`', '`.form-label`', '`.label`', '`.help-block`'],
          [0],
        ),
        q(
          'm5-placeholder',
          'Nima uchun `placeholder` yorliq (`label`) o‘rnini bosmaydi?',
          [
            'Yozish boshlanganda yo‘qoladi va har doim ham o‘qilmaydi',
            'Bootstrap uni ko‘rsatmaydi',
            'Faqat Bootstrap 5 da ishlaydi',
            'U forma bilan serverga yuboriladi',
          ],
          [0],
        ),
        q(
          'm5-error',
          'Xato holatini ko‘rsatish uchun nimalar kerak? (bir nechta javob)',
          [
            '`.form-group` ga `.has-error`',
            'Yorliqqa `.control-label`',
            'Xato matni (`.help-block`) va `aria-describedby`',
            'Faqat qizil rang yetarli',
          ],
          [0, 1, 2],
        ),
        q(
          'm5-addon',
          'Maydon oldiga “@” belgisini yopishtirish uchun qaysi tuzilma ishlatiladi?',
          [
            '`.input-group` > `.input-group-addon` + `.form-control`',
            '`.form-group` > `.badge`',
            '`.input-lg`',
            '`.form-inline`',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  forms: bs3(
    slots(HORIZONTAL, {
      form: cls('form-horizontal'),
      group: cls('form-group'),
      label: cls('control-label col-sm-2'),
      col: cls('col-sm-10'),
      input: cls('form-control'),
      offset: cls('col-sm-offset-2 col-sm-10'),
    }),
    { title: 'Sozlamalar' },
  ),
  inputs: bs3(
    slots(INPUTS, {
      email: ` type="email"${cls('form-control')}`,
      select: cls('form-control'),
      textarea: `${cls('form-control')} rows="3"`,
      radios: RADIOS,
    }),
    { title: 'Yozilish' },
  ),
  'inputs-2': bs3(
    slots(STATES, {
      readonly: ' readonly',
      emailGroup: cls('form-group has-error'),
      emailLabel: cls('control-label'),
      emailAria: ' aria-describedby="emailXato"',
      emailHelp: '<span id="emailXato" class="help-block">Email to‘liq yozilmagan.</span>',
      loginGroup: cls('form-group has-success has-feedback'),
      loginLabel: cls('control-label'),
      loginIcon:
        '<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>',
    }),
    { title: 'Ro‘yxat' },
  ),
  'input-sizing': bs3(
    slots(SIZING, {
      search: cls('form-control input-lg'),
      userOpen: '<div class="input-group">\n    <span class="input-group-addon">@</span>',
      userClose: '</div>',
      promoOpen: '<div class="input-group">',
      promoClose:
        '  <span class="input-group-btn"><button class="btn btn-default" type="button">Qo‘llash</button></span>\n  </div>',
    }),
    { title: 'Qidiruv' },
  ),
};
