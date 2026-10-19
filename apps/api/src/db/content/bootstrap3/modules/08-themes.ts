import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  bs3,
  click,
  cls,
  has,
  md,
  pic,
  q,
  quiz,
  RGB,
  slots,
  style,
  wait,
  type ModuleDef,
} from '../../bootstrap/shared';

const TEMPLATE = `<nav class="navbar navbar-inverse">
  <div class="container">
    <a class="navbar-brand" href="#">Kitob do‘koni</a>
  </div>
</nav>
<div class="container">
  <div class="jumbotron" id="banner">
    <h1>Yangi kitoblar</h1>
    <p>Har hafta 50 dan ortiq yangi nashr.</p>
    <a href="#" class="btn btn-primary btn-lg" id="katalog">Katalogni ko‘rish</a>
  </div>
</div>`;

const TEMPLATE_CSS = `.navbar-inverse {
  background-color: #0e1133;
  border-color: #0e1133;
}

.jumbotron {
  background-color: #0071dc;
  color: #fff;
}

.btn-primary {
  background-color: #fec400;
  border-color: #e0ad00;
  color: #0e1133;
}`;

const PERSONAL = `<header id="bosh"{{header}}>
  <div class="container">
    <img src="${pic('AK', 200, 200, '#5cb85c')}" alt="Aziza Karimova" width="200" height="200"{{img}}>
    <h1>Aziza Karimova</h1>
    <p{{lead}}>Frontend dasturchi</p>
  </div>
</header>
<section id="konikmalar"{{section}}>
  <h2>Ko‘nikmalarim</h2>
  <div{{row}}>
    <div id="k1"{{col}}><h3>HTML va CSS</h3><p>Semantik va moslashuvchan sahifalar.</p></div>
    <div id="k2"{{col}}><h3>Bootstrap</h3><p>Tez prototip va tayyor komponentlar.</p></div>
    <div id="k3"{{col}}><h3>JavaScript</h3><p>Interaktiv interfeyslar.</p></div>
  </div>
</section>
<footer id="pastki"{{footer}}>
  <p>Bog‘lanish: aziza@misol.uz</p>
</footer>`;

const PERSONAL_CSS = `.bosh {
  background-color: #0071dc;
  color: #fff;
  padding: 60px 0;
}

.pastki {
  background-color: #0e1133;
  color: #fff;
  padding: 30px 0;
}`;

const plan = (
  id: string,
  name: string,
  price: string,
  slot: string,
) => `<div class="col-sm-4" id="${id}">
      <div{{${slot}}}>
        <div{{heading}}><h3>${name}</h3></div>
        <div{{body}}><p>${name === 'Boshlang‘ich' ? '5 sahifa' : name === 'Biznes' ? '15 sahifa + blog' : 'Cheksiz sahifa'}</p></div>
        <div{{foot}}><h3>${price}</h3><button type="button" class="btn btn-default">Tanlash</button></div>
      </div>
    </div>`;

const COMPANY = `<nav id="menyu"{{nav}}>
  <div class="container">
    <a class="navbar-brand" href="#">Raqam IT</a>
  </div>
</nav>
<div id="banner"{{jumbo}}>
  <h1>Raqam IT</h1>
  <p>Biznesingiz uchun zamonaviy veb-saytlar</p>
</div>
<section class="container" id="narxlar">
  <h2>Narxlar</h2>
  <div class="row">
    ${plan('n1', 'Boshlang‘ich', '2 mln so‘m', 'panel')}
    ${plan('n2', 'Biznes', '5 mln so‘m', 'featured')}
    ${plan('n3', 'Korporativ', '12 mln so‘m', 'panel')}
  </div>
</section>
<section class="container" id="aloqa">
  <h2>Aloqa</h2>
  <form>
    <div class="form-group">
      <label for="ism">Ism</label>
      <input type="text" id="ism"{{input}}>
    </div>
    <div class="form-group">
      <label for="xabar">Xabar</label>
      <textarea id="xabar" rows="4"{{input}}></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Yuborish</button>
  </form>
</section>`;

const BAND = `<div id="slayder"{{carousel}}>
  <div{{inner}} role="listbox">
    <div{{item1}}><img src="${pic('Toshkent konserti', 1280, 400, '#1b1b1b')}" alt="Toshkentdagi konsert"></div>
    <div{{item}}><img src="${pic('Samarqand konserti', 1280, 400, '#333')}" alt="Samarqanddagi konsert"></div>
  </div>
  <a href="#slayder" role="button"{{prev}}><span class="sr-only">Oldingi</span></a>
  <a href="#slayder" role="button"{{next}}><span class="sr-only">Keyingi</span></a>
</div>
<div class="container">
  <h2>Konsertlar</h2>
  <ul id="jadval"{{list}}>
    <li{{li}}>15-noyabr, Toshkent{{badge}}</li>
    <li{{li}}>22-noyabr, Samarqand</li>
    <li{{li}}>29-noyabr, Buxoro</li>
  </ul>
  <button type="button" class="btn btn-primary" id="olish"{{trigger}}>Chipta olish</button>
  <h2>Guruh a’zolari</h2>
  <div class="row text-center">
    <div class="col-sm-4"><img src="${pic('S', 150, 150, '#d9534f')}" alt="Vokalchi Sardor" width="150" height="150"{{circle}}><p>Sardor — vokal</p></div>
    <div class="col-sm-4"><img src="${pic('M', 150, 150, '#5bc0de')}" alt="Gitarachi Madina" width="150" height="150"{{circle}}><p>Madina — gitara</p></div>
    <div class="col-sm-4"><img src="${pic('B', 150, 150, '#5cb85c')}" alt="Barabanchi Bekzod" width="150" height="150"{{circle}}><p>Bekzod — baraban</p></div>
  </div>
</div>

<div id="chipta" tabindex="-1" role="dialog" aria-labelledby="chiptaSarlavha"{{modal}}>
  <div{{dialog}} role="document">
    <div{{content}}>
      <div class="modal-header"><h4 class="modal-title" id="chiptaSarlavha">Chipta olish</h4></div>
      <div class="modal-body">
        <label for="soni">Chiptalar soni</label>
        <input type="number" class="form-control" id="soni" min="1" max="10" value="1">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default"{{dismiss}}>Bekor qilish</button>
        <button type="button" class="btn btn-success">To‘lash</button>
      </div>
    </div>
  </div>
</div>`;

export const m08: ModuleDef = {
  title: 'Amaliy loyihalar',
  lessons: [
    {
      slug: 'templates',
      title: 'Shablon va o‘z uslubingiz',
      exercise: {
        title: 'Do‘kon uslubini moslash',
        description: 'Bootstrap ranglarini o‘z CSS faylingizda almashtirish.',
        instructions: md(
          '`style.css` da (u Bootstrap’dan keyin ulangan):',
          '',
          '- `.navbar-inverse` foni va chegarasi: `#0e1133`;',
          '- `.jumbotron` foni `#0071dc`, matni oq;',
          '- `.btn-primary` foni `#fec400`, chegarasi `#e0ad00`, matni `#0e1133`.',
        ),
        expectedBehavior: 'To‘q ko‘k navbar, ko‘k jumbotron oq matn bilan va sariq tugma.',
        difficulty: 'EASY',
        starterFiles: bs3(TEMPLATE, {
          title: 'Do‘kon',
          css: '/* Bootstrap ranglarini shu yerda almashtiring */',
        }),
        checks: [
          style('navbar', 'Navbar to‘q ko‘k', '.navbar-inverse', 'background-color', '#0e1133'),
          style('jumbo', 'Jumbotron ko‘k', '#banner', 'background-color', '#0071dc'),
          style('jumbo-text', 'Jumbotron matni oq', '#banner', 'color', '#ffffff'),
          style('btn', 'Tugma sariq', '#katalog', 'background-color', '#fec400'),
          style('btn-text', 'Tugma matni to‘q', '#katalog', 'color', '#0e1133', { hidden: true }),
        ],
      },
    },
    {
      slug: 'theme-personal',
      title: 'Loyiha: shaxsiy sahifa',
      exercise: {
        title: 'Rezyume sahifasi',
        description: 'Rangli bosh qism, ko‘nikmalar va footer.',
        instructions: md(
          '- `#bosh` — `bosh text-center`; rasm — `img-circle`; kasb paragrafi — `lead`.',
          '- `#konikmalar` — `container text-center`; ichki `<div>` — `row`; uchta ustun — `col-sm-4`.',
          '- `#pastki` — `pastki container-fluid text-center`.',
          '- `style.css` da `.bosh` (fon `#0071dc`, oq matn, `padding: 60px 0`) va `.pastki`',
          '  (fon `#0e1133`, oq matn, `padding: 30px 0`) uslublarini yozing.',
        ),
        expectedBehavior:
          'Ko‘k bosh qismda dumaloq rasm va ism, uch ustunli ko‘nikmalar, to‘q footer.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(PERSONAL), {
          title: 'Aziza Karimova',
          css: '/* .bosh va .pastki uslublari */',
        }),
        checks: [
          style('header', 'Bosh qism ko‘k, markazlashgan', '#bosh', 'background-color', '#0071dc'),
          style('circle', 'Rasm doira', '#bosh img', 'border-top-left-radius', '50%'),
          at(800, 600, style('cols', 'Ko‘nikmalar uch ustunda', '#k2', 'width', '250px')),
          style('footer', 'Footer to‘q', '#pastki', 'background-color', '#0e1133'),
          style('center', 'Bosh qism matni markazda', '#bosh', 'text-align', 'center', {
            hidden: true,
          }),
        ],
      },
    },
    {
      slug: 'theme-company',
      title: 'Loyiha: kompaniya sayti',
      exercise: {
        title: 'IT-kompaniya sayti',
        description: 'Mahkamlangan navbar, jumbotron, narxlar va forma.',
        instructions: md(
          '- `#menyu` — `navbar navbar-default navbar-fixed-top`; `style.css` da `body { padding-top: 50px; }`.',
          '- `#banner` — `jumbotron text-center`.',
          '- Narxlar: oddiy tariflar — `panel panel-default`, o‘rtadagi “Biznes” — `panel panel-primary`;',
          '  ichki bloklar — `panel-heading`, `panel-body`, `panel-footer`.',
          '- Aloqa formasidagi maydonlar — `form-control`.',
        ),
        expectedBehavior:
          'Tepada qotib turgan navbar, katta banner, uchta tarif (o‘rtadagisi ko‘k) va aloqa formasi.',
        difficulty: 'MEDIUM',
        starterFiles: bs3(slots(COMPANY), {
          title: 'Raqam IT',
          css: '/* body uchun padding-top */',
        }),
        checks: [
          style('fixed', 'Navbar tepaga mahkamlangan', '#menyu', 'position', 'fixed'),
          style('padding', 'Kontent navbar ostida qolmaydi', 'body', 'padding-top', '50px'),
          style(
            'featured',
            '“Biznes” tarifi ko‘k',
            '#n2 .panel-heading',
            'background-color',
            RGB.bs3.primary,
          ),
          has('panels', 'Uchta tarif paneli', '#narxlar .col-sm-4 > .panel > .panel-footer', {
            min: 3,
            max: 3,
          }),
          style(
            'form',
            'Forma maydonlari Bootstrap uslubida',
            '#xabar',
            'border-top-left-radius',
            '4px',
          ),
        ],
      },
    },
    {
      slug: 'theme-band',
      title: 'Loyiha: musiqa guruhi sayti',
      exercise: {
        title: 'Guruh sayti',
        description: 'Karusel, konsertlar ro‘yxati, modal va a’zolar.',
        instructions: md(
          '- `#slayder` — `carousel slide` + `data-ride="carousel"`; o‘ram — `carousel-inner`; slaydlar — `item` (birinchisi `item active`);',
          '  havolalar — `left carousel-control` (`data-slide="prev"`) va `right carousel-control` (`data-slide="next"`).',
          '- `#jadval` — `list-group`, bandlar — `list-group-item`; birinchi bandga ` <span class="badge">Sotildi</span>`.',
          '- `#chipta` — `modal fade` (`modal-dialog`, `modal-content`); `#olish` uni ochsin, “Bekor qilish” yopsin.',
          '- A’zolar rasmlari — `img-circle`.',
        ),
        expectedBehavior:
          'Aylanuvchi konsert suratlari, konsertlar ro‘yxati, chipta oynasi va dumaloq a’zo rasmlari.',
        difficulty: 'HARD',
        starterFiles: bs3(slots(BAND), { title: 'Guruh' }),
        checks: [
          after(
            [click('#slayder .right'), wait(1000)],
            has('carousel', 'Karusel keyingi slaydga o‘tadi', '#slayder .item:nth-child(2).active'),
          ),
          style(
            'list',
            'Konsertlar ro‘yxati',
            '#jadval > li:first-child',
            'border-top-width',
            '1px',
          ),
          has('badge', '“Sotildi” belgisi', '#jadval > li:first-child > .badge'),
          after(
            [click('#olish'), wait(600)],
            has('modal', '“Chipta olish” oynani ochadi', '#chipta.in .modal-dialog'),
          ),
          style(
            'members',
            'A’zolar rasmlari dumaloq',
            '.row.text-center img',
            'border-top-left-radius',
            '50%',
          ),
        ],
      },
      quiz: quiz('8-modul testi: amaliy loyihalar', [
        q(
          'm8-order',
          'O‘z `style.css` faylingiz qayerda ulanishi kerak?',
          [
            'Bootstrap CSS’dan keyin',
            'Bootstrap CSS’dan oldin',
            '`</body>` dan oldin',
            'Farqi yo‘q',
          ],
          [0],
        ),
        q(
          'm8-specific',
          'Bootstrap uslubini o‘zgartirgan qoidangiz ishlamayapti. Eng ehtimolli sabab?',
          [
            'Bootstrap’dagi selektor spesifikligi yuqoriroq',
            'CSS fayllar faqat bitta bo‘lishi mumkin',
            'Bootstrap ranglarini o‘zgartirib bo‘lmaydi',
            '`!important` har doim shart',
          ],
          [0],
        ),
        q(
          'm8-fixed',
          '`.navbar-fixed-top` ishlatilganda kontent navbar ostida qolmasligi uchun nima qilinadi?',
          [
            '`body` ga navbar balandligicha `padding-top` beriladi',
            'Navbar’ga `margin-bottom` beriladi',
            '`.container` olib tashlanadi',
            'Hech narsa qilish shart emas',
          ],
          [0],
        ),
        q(
          'm8-featured',
          'Narxlar orasidan tavsiya etilgan tarifni ajratishning Bootstrap usuli?',
          [
            'Uni boshqa rangdagi panel bilan (`.panel-primary`) ko‘rsatish',
            'Uni karuselga qo‘yish',
            'Faqat rasm bilan',
            '`.hidden-xs` berish',
          ],
          [0],
        ),
        q(
          'm8-ids',
          'Bitta sahifada karusel va modal ishlashi uchun nimalar mos bo‘lishi kerak? (bir nechta javob)',
          [
            'Karusel `id` si va boshqaruv havolalaridagi `href`',
            'Modal `id` si va tugmadagi `data-target`',
            'jQuery `bootstrap.min.js` dan oldin ulanishi',
            'Karusel va modal bir xil `id` ga ega bo‘lishi',
          ],
          [0, 1, 2],
        ),
      ]),
    },
  ],
};

export const s08: Record<string, ProjectFile[]> = {
  templates: bs3(TEMPLATE, { title: 'Do‘kon', css: TEMPLATE_CSS }),
  'theme-personal': bs3(
    slots(PERSONAL, {
      header: cls('bosh text-center'),
      img: cls('img-circle'),
      lead: cls('lead'),
      section: cls('container text-center'),
      row: cls('row'),
      col: cls('col-sm-4'),
      footer: cls('pastki container-fluid text-center'),
    }),
    { title: 'Aziza Karimova', css: PERSONAL_CSS },
  ),
  'theme-company': bs3(
    slots(COMPANY, {
      nav: cls('navbar navbar-default navbar-fixed-top'),
      jumbo: cls('jumbotron text-center'),
      panel: cls('panel panel-default text-center'),
      featured: cls('panel panel-primary text-center'),
      heading: cls('panel-heading'),
      body: cls('panel-body'),
      foot: cls('panel-footer'),
      input: cls('form-control'),
    }),
    { title: 'Raqam IT', css: 'body {\n  padding-top: 50px;\n}' },
  ),
  'theme-band': bs3(
    slots(BAND, {
      carousel: `${cls('carousel slide')} data-ride="carousel"`,
      inner: cls('carousel-inner'),
      item1: cls('item active'),
      item: cls('item'),
      prev: `${cls('left carousel-control')} data-slide="prev"`,
      next: `${cls('right carousel-control')} data-slide="next"`,
      list: cls('list-group'),
      li: cls('list-group-item'),
      badge: ' <span class="badge">Sotildi</span>',
      trigger: ' data-toggle="modal" data-target="#chipta"',
      circle: cls('img-circle'),
      modal: cls('modal fade'),
      dialog: cls('modal-dialog'),
      content: cls('modal-content'),
      dismiss: ' data-dismiss="modal"',
    }),
    { title: 'Guruh' },
  ),
};
