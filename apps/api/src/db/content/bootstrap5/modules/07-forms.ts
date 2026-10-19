import type { CheckAction, ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs5,
  click,
  cls,
  fill,
  has,
  md,
  q,
  quiz,
  RGB,
  slots,
  style,
  text,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const press = (selector: string, key: string): CheckAction => ({ type: 'press', selector, key });

const FORM = `<div class="container">
  <h2>Profil</h2>
  <form id="forma"{{form}}>
    <div id="ismUstun"{{col}}>
      <label for="ism"{{label}}>Ism</label>
      <input type="text" class="form-control" id="ism">
    </div>
    <div{{col}}>
      <label for="email"{{label}}>Email</label>
      <input type="email" class="form-control" id="email" aria-describedby="emailYordam">
      {{help}}
    </div>
    <div{{full}}>
      <button type="submit" class="btn btn-primary">Saqlash</button>
    </div>
  </form>
</div>`;

const SELECT = `<div class="container">
  <h2>Kursga yozilish</h2>
  <label for="shahar" class="form-label">Shahar</label>
  <select id="shahar"{{s1}}>
    <option selected disabled value="">Shaharni tanlang…</option>
    <option value="toshkent">Toshkent</option>
    <option value="samarqand">Samarqand</option>
  </select>
  <label for="kurs" class="form-label mt-3">Kurs</label>
  <select id="kurs"{{s2}}>
    <option>Bootstrap 5</option>
    <option>JavaScript</option>
  </select>
  <label for="qiziqish" class="form-label mt-3">Qiziqishlar</label>
  <select id="qiziqish"{{s3}}>
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
  </select>
</div>`;

const CHECKS = `<div class="container">
  <h2>Sozlamalar</h2>
  <div{{check}}>
    <input type="checkbox" id="shart"{{input}}>
    <label for="shart"{{label}}>Shartlarga roziman</label>
  </div>
  <div{{switch}}>
    <input type="checkbox" id="xabar" checked{{switchInput}}>
    <label for="xabar"{{label}}>Bildirishnomalar</label>
  </div>
  <fieldset class="mt-3">
    <legend class="col-form-label pt-0">O‘qish shakli</legend>
    <div{{inline}}>
      <input type="radio" name="shakl" id="s1" value="onlayn"{{input}}>
      <label for="s1"{{label}}>Onlayn</label>
    </div>
    <div{{inline}}>
      <input type="radio" name="shakl" id="s2" value="oflayn"{{input}}>
      <label for="s2"{{label}}>Oflayn</label>
    </div>
  </fieldset>
</div>`;

const RANGE = `<div class="container">
  <h2>Kursni baholang</h2>
  <label for="baho" class="form-label">Baho: <output id="natija" for="baho">8</output></label>
  <input type="range" id="baho"{{range}}>
</div>`;

const RANGE_JS = `const baho = document.getElementById('baho');
const natija = document.getElementById('natija');
baho.addEventListener('input', () => {
  natija.textContent = baho.value;
});`;

const GROUPS = `<div class="container">
  <h2>Buyurtma</h2>
  <div class="input-group mb-3">
    {{at}}<input type="text" class="form-control" id="login" placeholder="foydalanuvchi" aria-label="Foydalanuvchi nomi">
  </div>
  <div class="input-group mb-3">
    <input type="number" class="form-control" id="narx" aria-label="Narx">{{som}}
  </div>
  <div class="input-group mb-3">
    <input type="text" class="form-control" id="promo" aria-label="Promokod">{{btn}}
  </div>
</div>`;

const FLOATING = `<div class="container">
  <h2>Kirish</h2>
  <form>
    {{emailOpen}}
      <input type="email" class="form-control" id="email"{{ph1}}>
      <label for="email">Email manzil</label>
    {{close}}
    {{parolOpen}}
      <input type="password" class="form-control" id="parol"{{ph2}}>
      <label for="parol">Parol</label>
    {{close}}
    <button class="btn btn-primary mt-3" type="submit">Kirish</button>
  </form>
</div>`;

const VALIDATION = `<div class="container">
  <h2>Ro‘yxatdan o‘tish</h2>
  <form id="forma"{{form}}>
    <div class="col-md-6">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email"{{required}}>
      {{emailFeedback}}
    </div>
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="shart"{{required}}>
        <label class="form-check-label" for="shart">Shartlarga roziman</label>
        {{checkFeedback}}
      </div>
    </div>
    <div class="col-12">
      <button class="btn btn-primary" type="submit" id="yuborish">Yuborish</button>
    </div>
  </form>
</div>`;

const VALIDATION_JS = `const forma = document.getElementById('forma');
forma.addEventListener('submit', (e) => {
  if (!forma.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  }
  forma.classList.add('was-validated');
});`;

export const m07: ModuleDef = {
  title: 'Formalar',
  lessons: [
    {
      slug: 'forms',
      title: 'Formalar',
      exercise: {
        title: 'Profil formasi',
        description: '`.form-label`, `.form-text` va `row g-3` setkasi.',
        instructions: md(
          '- Forma — `row g-3`; ism va email o‘ramlari — `col-md-6`; tugma o‘rami — `col-12`.',
          '- Yorliqlar — `form-label`.',
          '- Email maydonidan keyin `<div id="emailYordam" class="form-text">Email’ingizni hech kimga bermaymiz.</div>`.',
        ),
        expectedBehavior:
          'Planshetdan boshlab ikki ustunli forma, yorliqlar maydon ustida, email ostida kulrang izoh.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(FORM), { title: 'Profil' }),
        checks: [
          has('row', 'Forma setka qatori', 'form#forma.row.g-3'),
          at(1000, 800, style('col', 'Ikki ustun', '#ismUstun', 'width', '476px')),
          style('label', '`form-label` pastida masofa', 'label[for="ism"]', 'margin-bottom', '8px'),
          style('help', 'Yordamchi matn kichik', '#emailYordam', 'font-size', '14px'),
        ],
      },
    },
    {
      slug: 'select',
      title: 'Select menyu',
      exercise: {
        title: 'Tanlash maydonlari',
        description: '`.form-select`, o‘lcham va `multiple`.',
        instructions: md(
          '- `#shahar` — `form-select` va `required`.',
          '- `#kurs` — katta: `form-select form-select-lg`.',
          '- `#qiziqish` — bir nechta tanlov: `form-select` va `multiple`.',
        ),
        expectedBehavior:
          'Strelkali bir xil ko‘rinishdagi ro‘yxatlar, ikkinchisi katta, uchinchisida bir nechta variant tanlanadi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(SELECT), { title: 'Select' }),
        checks: [
          style('select', '`form-select`', '#shahar', 'appearance', 'none'),
          style('arrow', 'Strelka uchun joy', '#shahar', 'padding-right', '36px'),
          has('required', 'Shahar majburiy', '#shahar[required]'),
          style('lg', 'Katta ro‘yxat', '#kurs', 'font-size', '20px'),
          has('multiple', 'Bir nechta tanlov', 'select#qiziqish.form-select[multiple]'),
        ],
      },
    },
    {
      slug: 'checks-radios',
      title: 'Checkbox va radio',
      exercise: {
        title: 'Sozlamalar',
        description: '`.form-check`, `.form-switch` va qatorli radio.',
        instructions: md(
          '- Birinchi blok — `form-check`; ikkinchisi — `form-check form-switch` (inputga `role="switch"`).',
          '- Barcha `input` — `form-check-input`, `label` — `form-check-label`.',
          '- Radio o‘ramlari — `form-check form-check-inline`.',
        ),
        expectedBehavior: 'Chiroyli checkbox, yoqilgan kalit va bir qatordagi ikki radio.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(CHECKS), { title: 'Sozlamalar' }),
        checks: [
          style('check', 'Checkbox Bootstrap ko‘rinishida', '#shart', 'appearance', 'none'),
          style('switch', 'Kalit (switch)', '#xabar', 'width', '32px'),
          attr('role', 'Kalitda `role="switch"`', '#xabar', 'role', 'switch'),
          style(
            'inline',
            'Radio bir qatorda',
            'fieldset > div:first-of-type',
            'display',
            'inline-block',
          ),
          after(
            [click('label[for="shart"]'), wait(100)],
            has('click', 'Yorliq bosilganda belgilanadi', '#shart:checked'),
          ),
        ],
      },
    },
    {
      slug: 'range',
      title: 'Range',
      exercise: {
        title: 'Baholash slayderi',
        description: '`.form-range`, chegaralar va qiymatni ko‘rsatish.',
        instructions: md(
          '- `#baho` — `form-range`, `min="1"`, `max="10"`, `step="1"`, `value="8"`.',
          '- `script.js`: tutqich surilganda (`input` hodisasi) `#natija` ga joriy qiymatni yozing.',
        ),
        expectedBehavior: 'Slayder 8 da turadi; → bosilganda “Baho: 9” bo‘ladi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(RANGE), { title: 'Baho', js: '// Qiymatni shu yerda ko‘rsating' }),
        checks: [
          style('range', '`form-range`', '#baho', 'appearance', 'none'),
          attr('max', 'Eng katta qiymat 10', '#baho', 'max', '10'),
          after(
            [press('#baho', 'ArrowRight'), wait(100)],
            text('output', 'Qiymat ko‘rsatiladi', '#natija', '9', { equals: true }),
          ),
          after(
            [press('#baho', 'End'), wait(100)],
            text('end', 'Eng katta qiymat', '#natija', '10', { equals: true, hidden: true }),
          ),
        ],
      },
    },
    {
      slug: 'input-groups',
      title: 'Input group',
      exercise: {
        title: 'Buyurtma maydonlari',
        description: '`prepend`/`append` siz input group.',
        instructions: md(
          '- `#login` dan **oldin** `<span class="input-group-text">@</span>`.',
          '- `#narx` dan **keyin** `<span class="input-group-text">so‘m</span>`.',
          '- `#promo` dan keyin `<button class="btn btn-outline-secondary" type="button">Qo‘llash</button>`.',
        ),
        expectedBehavior: '“@” bilan login, “so‘m” bilan narx va tugmali promokod maydoni.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(GROUPS), { title: 'Buyurtma' }),
        checks: [
          has('at', '“@” login oldida', '.input-group > .input-group-text + #login'),
          has('som', '“so‘m” narx ortida', '#narx + .input-group-text'),
          has('btn', 'Promokod tugmasi', '#promo + .btn'),
          style(
            'text',
            'Qo‘shimcha kulrang fonda',
            '.input-group-text',
            'background-color',
            RGB.bs5.light,
          ),
        ],
      },
    },
    {
      slug: 'floating-labels',
      title: 'Floating labels',
      exercise: {
        title: 'Suzuvchi yorliqli kirish formasi',
        description: '`.form-floating` tuzilmasi.',
        instructions: md(
          '- Email va parol maydonlarini `<div class="form-floating mb-3">` ichiga oling (`input` birinchi, `label` keyin).',
          '- Ikkala `input` ga `placeholder` bering (masalan, `placeholder="Email"`).',
        ),
        expectedBehavior: 'Yorliq maydon ichida; yozish boshlanganda u yuqoriga suzib chiqadi.',
        difficulty: 'EASY',
        starterFiles: bs5(slots(FLOATING), { title: 'Kirish' }),
        checks: [
          has(
            'structure',
            'Tuzilma: input + label',
            '.form-floating > input.form-control[placeholder] + label',
            { min: 2 },
          ),
          style('height', 'Baland maydon', '#email', 'height', '58px'),
          style('label', 'Yorliq maydon ustida', 'label[for="email"]', 'position', 'absolute'),
          after(
            [fill('#email', 'aziza@misol.uz'), wait(300)],
            style(
              'float',
              'Yozilganda yorliq kichrayadi',
              'label[for="email"]',
              'transform',
              'matrix(0.85, 0, 0, 0.85, 2.04, -6.8)',
            ),
          ),
        ],
      },
    },
    {
      slug: 'validation',
      title: 'Forma tekshiruvi',
      exercise: {
        title: 'Ro‘yxatdan o‘tish tekshiruvi',
        description: '`needs-validation`, `.was-validated` va xabarlar.',
        instructions: md(
          '- Forma — `row g-3 needs-validation` va `novalidate`.',
          '- Email va checkbox — `required`; ularning ostiga `<div class="invalid-feedback">…</div>` xabarlari.',
          '- `script.js`: yuborishda `checkValidity()` noto‘g‘ri bo‘lsa yuborishni to‘xtating va formaga `was-validated` qo‘shing.',
        ),
        expectedBehavior: 'Bo‘sh forma yuborilsa maydonlar qizil bo‘ladi va xabarlar chiqadi.',
        difficulty: 'MEDIUM',
        starterFiles: bs5(slots(VALIDATION), {
          title: 'Ro‘yxat',
          js: '// Tekshiruvni shu yerda yozing',
        }),
        checks: [
          style(
            'hidden',
            'Xabar boshida yashirin',
            '#email ~ .invalid-feedback',
            'display',
            'none',
          ),
          after(
            [click('#yuborish'), wait(300)],
            style(
              'shown',
              'Bo‘sh yuborilganda xabar chiqadi',
              '#email ~ .invalid-feedback',
              'display',
              'block',
            ),
          ),
          after(
            [click('#yuborish'), wait(300)],
            style('red', 'Email maydoni qizil', '#email', 'border-top-color', RGB.bs5.danger),
          ),
          after(
            [click('#yuborish'), wait(300)],
            style(
              'check',
              'Checkbox yorlig‘i qizil',
              'label[for="shart"]',
              'color',
              RGB.bs5.danger,
              { hidden: true },
            ),
          ),
        ],
      },
      quiz: quiz('7-modul testi: formalar', [
        q(
          'm7-group',
          'Bootstrap 5 da `.form-group` o‘rniga nima ishlatiladi?',
          [
            'Spacing utilitasi, masalan `.mb-3`',
            '`.form-group` o‘zgarmagan',
            '`.input-group`',
            '`.form-row`',
          ],
          [0],
        ),
        q(
          'm7-select',
          '`<select>` ga qaysi klass beriladi?',
          ['`.form-select`', '`.form-control`', '`.custom-select`', '`.select`'],
          [0],
        ),
        q(
          'm7-floating',
          'Floating label ishlashi uchun nimalar shart? (bir nechta javob)',
          [
            '`input` `label` dan oldin yoziladi',
            '`input` da `placeholder` bo‘ladi',
            'Ikkalasi `.form-floating` ichida',
            '`label` da `placeholder` bo‘ladi',
          ],
          [0, 1, 2],
        ),
        q(
          'm7-append',
          'Bootstrap 5 input group’ida “so‘m” matnini maydon ortiga qanday qo‘shasiz?',
          [
            '`<span class="input-group-text">so‘m</span>` ni maydondan keyin yozib',
            '`.input-group-append` ichida',
            '`data-bs-append="so‘m"`',
            '`.form-text` bilan',
          ],
          [0],
        ),
        q(
          'm7-server',
          'Brauzerdagi Bootstrap tekshiruvi haqida qaysi gap to‘g‘ri?',
          [
            'Bu faqat qulaylik — ma’lumot serverda ham tekshirilishi shart',
            'U serverdagi tekshiruvni almashtiradi',
            'U faqat Bootstrap 4 da ishlaydi',
            'Uni chetlab o‘tib bo‘lmaydi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s07: Record<string, ProjectFile[]> = {
  forms: bs5(
    slots(FORM, {
      form: cls('row g-3'),
      col: cls('col-md-6'),
      label: cls('form-label'),
      help: '<div id="emailYordam" class="form-text">Email’ingizni hech kimga bermaymiz.</div>',
      full: cls('col-12'),
    }),
    { title: 'Profil' },
  ),
  select: bs5(
    slots(SELECT, {
      s1: `${cls('form-select')} required`,
      s2: cls('form-select form-select-lg'),
      s3: `${cls('form-select')} multiple`,
    }),
    { title: 'Select' },
  ),
  'checks-radios': bs5(
    slots(CHECKS, {
      check: cls('form-check'),
      switch: cls('form-check form-switch'),
      input: cls('form-check-input'),
      switchInput: `${cls('form-check-input')} role="switch"`,
      label: cls('form-check-label'),
      inline: cls('form-check form-check-inline'),
    }),
    { title: 'Sozlamalar' },
  ),
  range: bs5(slots(RANGE, { range: `${cls('form-range')} min="1" max="10" step="1" value="8"` }), {
    title: 'Baho',
    js: RANGE_JS,
  }),
  'input-groups': bs5(
    slots(GROUPS, {
      at: '<span class="input-group-text">@</span>\n    ',
      som: '\n    <span class="input-group-text">so‘m</span>',
      btn: '\n    <button class="btn btn-outline-secondary" type="button">Qo‘llash</button>',
    }),
    { title: 'Buyurtma' },
  ),
  'floating-labels': bs5(
    slots(FLOATING, {
      emailOpen: '<div class="form-floating mb-3">',
      parolOpen: '<div class="form-floating mb-3">',
      close: '</div>',
      ph1: ' placeholder="Email"',
      ph2: ' placeholder="Parol"',
    }),
    { title: 'Kirish' },
  ),
  validation: bs5(
    slots(VALIDATION, {
      form: `${cls('row g-3 needs-validation')} novalidate`,
      required: ' required',
      emailFeedback: '<div class="invalid-feedback">To‘g‘ri email manzil kiriting.</div>',
      checkFeedback: '<div class="invalid-feedback">Davom etish uchun rozilik kerak.</div>',
    }),
    { title: 'Ro‘yxat', js: VALIDATION_JS },
  ),
};
