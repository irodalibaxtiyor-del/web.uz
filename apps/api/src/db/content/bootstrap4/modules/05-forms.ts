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

const FORM = `<div class="container">
  <h2>Ro‘yxatdan o‘tish</h2>
  <form id="forma"{{form}}>
    <div{{row}}>
      <div class="form-group{{col}}" id="ismGuruh">
        <label for="ism">Ism</label>
        <input type="text" class="form-control" id="ism">
      </div>
      <div class="form-group{{col}}">
        <label for="login">Login</label>
        <input type="text" class="form-control" id="login"{{required}}>
        {{feedback}}
      </div>
    </div>
    <div class="form-group">
      <input type="checkbox" id="shart"{{checkInput}}>
      <label for="shart"{{checkLabel}}>Shartlarga roziman</label>
    </div>
    <button type="submit" class="btn btn-primary" id="yuborish">Yuborish</button>
  </form>
</div>`;

const FORM_JS = `document.getElementById('forma').addEventListener('submit', function (e) {
  if (!this.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  }
  this.classList.add('was-validated');
});`;

const INPUTS = `<div class="container">
  <h2>Profil</h2>
  <form>
    <div class="form-group">
      <label for="qidiruv">Kurs qidirish</label>
      <input type="search" id="qidiruv"{{lg}}>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" value="aziza@misol.uz"{{plain}}>
    </div>
    <fieldset class="form-group">
      <legend class="col-form-label">O‘qish shakli</legend>
      {{radios}}
    </fieldset>
  </form>
</div>`;

const radio = (id: string, value: string, label: string, inline: boolean) =>
  inline
    ? `<div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="shakl" id="${id}" value="${value}">
        <label class="form-check-label" for="${id}">${label}</label>
      </div>`
    : `<input type="radio" id="${id}" value="${value}"> ${label}`;

const RADIOS = (inline: boolean) =>
  [radio('s1', 'onlayn', 'Onlayn', inline), radio('s2', 'oflayn', 'Oflayn', inline)].join(
    '\n      ',
  );

const GROUPS = `<div class="container">
  <h2>Buyurtma</h2>
  {{loginOpen}}
    <input type="text" class="form-control" id="login" placeholder="foydalanuvchi" aria-label="Foydalanuvchi nomi">
  {{loginClose}}
  {{priceOpen}}
    <input type="number" class="form-control" id="narx" aria-label="Narx">
  {{priceClose}}
  {{promoOpen}}
    <input type="text" class="form-control" id="promo" aria-label="Promokod">
  {{promoClose}}
</div>`;

const CUSTOM = `<div class="container">
  <h2>Sozlamalar</h2>
  <div{{check}}>
    <input type="checkbox" id="shart"{{input}}>
    <label for="shart"{{label}}>Shartlarga roziman</label>
  </div>
  <div{{switch}}>
    <input type="checkbox" id="xabar" checked{{input}}>
    <label for="xabar"{{label}}>Bildirishnomalar</label>
  </div>
  <label for="shahar" class="mt-3">Shahar</label>
  <select id="shahar"{{select}}>
    <option selected>Shaharni tanlang</option>
    <option value="1">Toshkent</option>
    <option value="2">Samarqand</option>
  </select>
  <label for="baho" class="mt-3">Baho: 1–10</label>
  <input type="range" id="baho" min="1" max="10"{{range}}>
</div>`;

export const m05: ModuleDef = {
  title: 'Formalar',
  lessons: [
    {
      slug: 'forms',
      title: 'Formalar va tekshiruv',
      exercise: {
        title: 'Ro‘yxatdan o‘tish formasi',
        description: '`.form-row`, `.form-check` va Bootstrap tekshiruvi.',
        instructions: md(
          '- Ism va login guruhlarini yonma-yon qiling: o‘ram — `form-row`, ikkala `form-group` ga `col-md-6`.',
          '- Checkbox — `form-check-input`, yorlig‘i — `form-check-label`; ota `form-group` ga `form-check` qo‘shing.',
          '- Login: `required minlength="3"`; ostiga `<div class="invalid-feedback">Login kamida 3 ta belgi.</div>`.',
          '- Formaga `class="needs-validation" novalidate`.',
          '- `script.js`: forma yuborilganda noto‘g‘ri bo‘lsa yuborishni to‘xtating va formaga `was-validated` qo‘shing.',
        ),
        expectedBehavior:
          'Ikki ustunli forma; bo‘sh login bilan “Yuborish” bosilsa, maydon qizil bo‘ladi va xabar chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(slots(FORM), {
          title: 'Ro‘yxat',
          js: '// Forma tekshiruvini shu yerda yozing',
        }),
        checks: [
          at(1280, 800, style('row', 'Ikki ustun', '#ismGuruh', 'width', '560px')),
          has(
            'check',
            'Checkbox `.form-check` tuzilmasi',
            '.form-check > .form-check-input + .form-check-label',
          ),
          style('hidden', 'Xabar boshida yashirin', '.invalid-feedback', 'display', 'none'),
          after(
            [click('#yuborish'), wait(300)],
            style(
              'invalid',
              'Bo‘sh login yuborilganda xabar chiqadi',
              '.invalid-feedback',
              'display',
              'block',
            ),
          ),
          after(
            [click('#yuborish'), wait(300)],
            style('red', 'Login maydoni qizil', '#login', 'border-top-color', RGB.bs4.danger, {
              hidden: true,
            }),
          ),
        ],
      },
    },
    {
      slug: 'inputs',
      title: 'Kiritish maydonlari',
      exercise: {
        title: 'Profil maydonlari',
        description: 'O‘lcham, plaintext va qatordagi radio.',
        instructions: md(
          '- `#qidiruv` — katta: `form-control form-control-lg`.',
          '- `#email` — o‘zgartirib bo‘lmaydigan statik matn: `form-control-plaintext` va `readonly`.',
          '- Ikkala radio — `form-check form-check-inline` ichida (`form-check-input`, `form-check-label`, `name="shakl"`).',
        ),
        expectedBehavior:
          'Katta qidiruv maydoni, ramkasiz email matni va bir qatordagi ikki radio.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(INPUTS, { radios: RADIOS(false) }), { title: 'Profil' }),
        checks: [
          style('lg', 'Katta maydon', '#qidiruv', 'height', '48px'),
          style('plain', 'Email ramkasiz', '#email', 'background-color', 'rgba(0, 0, 0, 0)'),
          attr('readonly', 'Email `readonly`', '#email', 'readonly'),
          style('inline', 'Radio bir qatorda', '.form-check-inline', 'display', 'inline-flex'),
          has('name', 'Radio bir guruhda', 'input[type="radio"][name="shakl"].form-check-input', {
            min: 2,
          }),
        ],
      },
    },
    {
      slug: 'input-groups',
      title: 'Input group',
      exercise: {
        title: 'Buyurtma maydonlari',
        description: '`prepend`, `append` va tugma.',
        instructions: md(
          '- `#login` — `input-group`, oldida `<div class="input-group-prepend"><span class="input-group-text">@</span></div>`.',
          '- `#narx` — `input-group`, ortida `input-group-append` ichida `<span class="input-group-text">so‘m</span>`.',
          '- `#promo` — `input-group`, ortida `input-group-append` ichida `<button class="btn btn-outline-secondary" type="button">Qo‘llash</button>`.',
          '- Har bir guruhga `mb-3`.',
        ),
        expectedBehavior: '“@” bilan login, “so‘m” bilan narx va tugmali promokod maydoni.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(GROUPS), { title: 'Buyurtma' }),
        checks: [
          has(
            'prepend',
            '“@” login oldida',
            '.input-group > .input-group-prepend > .input-group-text',
          ),
          has('prepend-order', '“@” maydondan oldin', '.input-group-prepend + #login', {
            hidden: true,
          }),
          style(
            'text',
            'Qo‘shimcha matn kulrang fonda',
            '.input-group-text',
            'background-color',
            'rgb(233, 236, 239)',
          ),
          has('append', '“so‘m” narx ortida', '#narx + .input-group-append > .input-group-text'),
          has('btn', 'Promokod tugmasi', '#promo + .input-group-append > .btn'),
        ],
      },
    },
    {
      slug: 'custom-forms',
      title: 'Custom forma elementlari',
      exercise: {
        title: 'Sozlamalar sahifasi',
        description: 'Custom checkbox, switch, select va range.',
        instructions: md(
          '- Birinchi `<div>` — `custom-control custom-checkbox`, ikkinchisi — `custom-control custom-switch`.',
          '- Ulardagi `input` — `custom-control-input`, `label` — `custom-control-label`.',
          '- `#shahar` — `custom-select`, `#baho` — `custom-range`.',
        ),
        expectedBehavior: 'Bir xil uslubdagi checkbox, kalit (switch), ro‘yxat va diapazon.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(CUSTOM), { title: 'Sozlamalar' }),
        checks: [
          style('input', 'Haqiqiy input yashirin', '#shart', 'opacity', '0'),
          style('switch', 'Switch chizilgan', '.custom-switch', 'padding-left', '36px', {
            hidden: true,
          }),
          after(
            [click('label[for="shart"]'), wait(100)],
            has('click', 'Yorliq bosilganda belgilanadi', '#shart:checked'),
          ),
          style('select', '`custom-select`', '#shahar', 'appearance', 'none'),
          style('range', '`custom-range`', '#baho', 'appearance', 'none'),
        ],
      },
      quiz: quiz('5-modul testi: formalar', [
        q(
          'm5-help',
          'Bootstrap 3 dagi `.help-block` o‘rniga Bootstrap 4 da nima?',
          ['`.form-text`', '`.help-text`', '`.form-help`', '`.small`'],
          [0],
        ),
        q(
          'm5-check',
          'Bootstrap 4 da checkbox tuzilmasi qanday?',
          [
            '`.form-check` > `.form-check-input` + `.form-check-label`',
            '`.checkbox` > `label` > `input`',
            '`.form-control[type=checkbox]`',
            '`.custom-checkbox` majburiy',
          ],
          [0],
        ),
        q(
          'm5-validated',
          '`.invalid-feedback` xabari qachon ko‘rinadi? (bir nechta javob)',
          [
            'Formaga `.was-validated` qo‘shilganda va maydon noto‘g‘ri bo‘lsa',
            'Maydonga `.is-invalid` berilganda',
            'Sahifa ochilishi bilan',
            'Faqat Bootstrap 5 da',
          ],
          [0, 1],
        ),
        q(
          'm5-prepend',
          'Maydon oldiga “@” belgisini qo‘yish uchun Bootstrap 4 tuzilmasi?',
          [
            '`.input-group` > `.input-group-prepend` > `.input-group-text`',
            '`.input-group` > `.input-group-addon`',
            '`.form-group` > `.badge`',
            '`.input-prepend`',
          ],
          [0],
        ),
        q(
          'm5-custom',
          'Custom checkbox bosilganda belgilanmayapti. Ehtimolli sabab?',
          [
            '`input` ning `id` si va `label` ning `for` i mos emas',
            '`custom-select` yozilmagan',
            'jQuery ulanmagan',
            'Checkbox `required` emas',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s05: Record<string, ProjectFile[]> = {
  forms: bs4(
    slots(FORM, {
      form: `${cls('needs-validation')} novalidate`,
      row: cls('form-row'),
      col: ' col-md-6',
      required: ' required minlength="3"',
      feedback: '<div class="invalid-feedback">Login kamida 3 ta belgi.</div>',
      checkInput: cls('form-check-input'),
      checkLabel: cls('form-check-label'),
    }).replace(
      '<div class="form-group">\n      <input type="checkbox"',
      '<div class="form-group form-check">\n      <input type="checkbox"',
    ),
    { title: 'Ro‘yxat', js: FORM_JS },
  ),
  inputs: bs4(
    slots(INPUTS, {
      lg: cls('form-control form-control-lg'),
      plain: `${cls('form-control-plaintext')} readonly`,
      radios: RADIOS(true),
    }),
    { title: 'Profil' },
  ),
  'input-groups': bs4(
    slots(GROUPS, {
      loginOpen:
        '<div class="input-group mb-3">\n    <div class="input-group-prepend"><span class="input-group-text">@</span></div>',
      loginClose: '</div>',
      priceOpen: '<div class="input-group mb-3">',
      priceClose:
        '  <div class="input-group-append"><span class="input-group-text">so‘m</span></div>\n  </div>',
      promoOpen: '<div class="input-group mb-3">',
      promoClose:
        '  <div class="input-group-append"><button class="btn btn-outline-secondary" type="button">Qo‘llash</button></div>\n  </div>',
    }),
    { title: 'Buyurtma' },
  ),
  'custom-forms': bs4(
    slots(CUSTOM, {
      check: cls('custom-control custom-checkbox'),
      switch: cls('custom-control custom-switch'),
      input: cls('custom-control-input'),
      label: cls('custom-control-label'),
      select: cls('custom-select'),
      range: cls('custom-range'),
    }),
    { title: 'Sozlamalar' },
  ),
};
