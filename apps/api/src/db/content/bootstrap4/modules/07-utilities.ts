import type { ProjectFile } from '@webdizayn/shared';
import {
  after,
  at,
  attr,
  bs4,
  cls,
  fill,
  has,
  ICONS_CDN,
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

const UTILS = `<div class="container">
  <div id="karta"{{card}}>
    <h3>Kurs haqida</h3>
    <p>Bootstrap 4 utilitalari bilan bezalgan blok.</p>
  </div>
  <div id="markaz" style="width: 300px;"{{center}}>Markazdagi blok</div>
  <div id="keng"{{half}}>Yarim kenglikdagi blok</div>
  <p id="mobil"{{mobile}}>Bu matn faqat telefonda ko‘rinadi.</p>
</div>`;

const FLEX = `<div class="container">
  <div id="sarlavha"{{head}}>
    <h3 class="m-0">Kurslar</h3>
    <button type="button" class="btn btn-primary">Yangi kurs</button>
  </div>
  <nav id="menyu"{{menu}}>
    <a class="p-2" href="#">Bosh sahifa</a>
    <a class="p-2" href="#">Kurslar</a>
    <a class="p-2{{login}}" href="#" id="kirish">Kirish</a>
  </nav>
</div>`;

const ICONS = `<div class="container">
  <h2>Vazifalar</h2>
  <p>{{okIcon}}Hisobot tayyor</p>
  <button type="button" class="btn btn-primary" id="yuklash">{{download}}Yuklab olish</button>
  <button type="button" class="btn btn-outline-secondary" id="sozlama"{{label}}>{{gear}}</button>
</div>`;

const MEDIA = `<div class="container">
  <h2>Sharhlar</h2>
  <div id="sharh"{{media}}>
    <img src="${pic('AK', 64, 64, '#28a745')}" alt="Aziza" width="64" height="64"{{img}}>
    <div{{body}}>
      <h5 class="mt-0">Aziza Karimova</h5>
      <p>Setka darsi juda tushunarli bo‘ldi!</p>
      {{reply}}
    </div>
  </div>
</div>`;

const REPLY = `<div class="media mt-3" id="javob">
        <img src="${pic('O', 48, 48, '#007bff')}" alt="O‘qituvchi" width="48" height="48" class="mr-3">
        <div class="media-body">
          <h5 class="mt-0">O‘qituvchi</h5>
          Rahmat! Keyingi darsda offset’ni ko‘ramiz.
        </div>
      </div>`;

const FILTER = `<div class="container">
  <h2>Kurslar</h2>
  <input class="form-control mb-3" id="qidiruv" type="text" placeholder="Qidirish…" aria-label="Kurslar ichida qidirish">
  <ul class="list-group" id="royxat">
    <li class="list-group-item">HTML asoslari</li>
    <li class="list-group-item">CSS bilan bezash</li>
    <li class="list-group-item">Bootstrap 4</li>
    <li class="list-group-item">JavaScript</li>
  </ul>
</div>`;

const FILTER_JS = `$(function () {
  $('#qidiruv').on('input', function () {
    var soz = $(this).val().toLowerCase();
    $('#royxat li').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(soz) > -1);
    });
  });
});`;

export const m07: ModuleDef = {
  title: 'Utilitalar, Flex va ikonkalar',
  lessons: [
    {
      slug: 'utilities',
      title: 'Utilitalar',
      exercise: {
        title: 'Faqat utilitalar bilan bezash',
        description: 'Spacing, chegara, soya, sizing va display.',
        instructions: md(
          'O‘zingizning CSS’ingizsiz, faqat Bootstrap utilitalari bilan:',
          '',
          '- `#karta` — `border rounded shadow p-4 mb-3`;',
          '- `#markaz` — gorizontal markazda (`mx-auto`);',
          '- `#keng` — ota kengligining yarmi (`w-50`) va och fon (`bg-light`);',
          '- `#mobil` — `md` va undan katta ekranda yashirin (`d-md-none`).',
        ),
        expectedBehavior:
          'Soyali ramkali karta, o‘rtadagi blok, yarim kenglikdagi och blok; telefon matni faqat telefonda.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(UTILS), { title: 'Utilitalar' }),
        checks: [
          style('pad', '`p-4` — 24px', '#karta', 'padding-top', '24px'),
          style(
            'shadow',
            'Soya bor',
            '#karta',
            'box-shadow',
            'rgba(0, 0, 0, 0.15) 0px 8px 16px 0px',
          ),
          at(1280, 800, style('center', 'Blok markazda', '#markaz', 'margin-left', '405px')),
          at(1280, 800, style('half', 'Yarim kenglik', '#keng', 'width', '555px')),
          at(
            1000,
            800,
            style('hide', 'Kompyuterda telefon matni yashirin', '#mobil', 'display', 'none'),
          ),
        ],
      },
    },
    {
      slug: 'flex',
      title: 'Flex utilitalari',
      exercise: {
        title: 'Sarlavha qatori va moslashuvchan menyu',
        description: '`d-flex`, `justify-content-*`, `flex-column` va `ml-auto`.',
        instructions: md(
          '- `#sarlavha` — `d-flex justify-content-between align-items-center mb-3`.',
          '- `#menyu` — telefonda ustun, `md` dan qator: `d-flex flex-column flex-md-row`.',
          '- `#kirish` keng ekranda o‘ng chetga surilsin: `ml-md-auto`.',
        ),
        expectedBehavior:
          'Sarlavha chapda, tugma o‘ngda; menyu telefonda ustma-ust, kompyuterda bir qatorda va “Kirish” o‘ng chetda.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(FLEX), { title: 'Flex' }),
        checks: [
          style(
            'between',
            'Sarlavha va tugma chetlarda',
            '#sarlavha',
            'justify-content',
            'space-between',
          ),
          style('center', 'Vertikal markazda', '#sarlavha', 'align-items', 'center'),
          at(375, 700, style('column', 'Telefonda ustun', '#menyu', 'flex-direction', 'column')),
          at(1000, 800, style('row', 'Kompyuterda qator', '#menyu', 'flex-direction', 'row')),
          has('auto', '“Kirish” o‘ngga surilgan', '#kirish.ml-md-auto'),
        ],
      },
    },
    {
      slug: 'icons',
      title: 'Ikonkalar',
      exercise: {
        title: 'Bootstrap Icons',
        description: 'Ikonka kutubxonasini ulash va accessibility.',
        instructions: md(
          `- \`<head>\` ga Bootstrap Icons’ni ulang: \`${ICONS_CDN}\`.`,
          '- “Hisobot tayyor” oldiga yashil belgi: `<i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i> `.',
          '- “Yuklab olish” tugmasiga `bi-download` ikonkasi (matndan oldin).',
          '- `#sozlama` — faqat `bi-gear` ikonkasi; tugmaga `aria-label="Sozlamalar"`.',
          '- Barcha ikonkalarda `aria-hidden="true"`.',
        ),
        expectedBehavior:
          'Yashil ✓ belgisi, yuklab olish ikonkali tugma va tishli g‘ildirak ikonkali tugma.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(ICONS), { title: 'Ikonkalar' }),
        checks: [
          style(
            'font',
            'Ikonka shrifti ulangan',
            '.bi-download',
            'font-family',
            'bootstrap-icons',
            {
              pseudo: '::before',
            },
          ),
          style('green', 'Yashil belgi', '.bi-check-circle-fill', 'color', RGB.bs4.success),
          attr('label', 'Sozlamalar tugmasi nomli', '#sozlama', 'aria-label', 'Sozlamalar'),
          has('gear', 'Tishli g‘ildirak ikonkasi', '#sozlama > i.bi.bi-gear'),
          has('hidden', 'Ikonkalar yashirin', 'i.bi[aria-hidden="true"]', { min: 3 }),
        ],
      },
    },
    {
      slug: 'media-objects',
      title: 'Media object',
      exercise: {
        title: 'Sharh va javob',
        description: 'Flex asosidagi `.media`.',
        instructions: md(
          '- `#sharh` — `media`; rasm — `mr-3 rounded-circle`; matn o‘rami — `media-body`.',
          '- `media-body` ichiga, paragrafdan keyin, o‘qituvchi javobini qo‘shing: `<div class="media mt-3" id="javob">` (rasm `mr-3` bilan va `media-body`).',
        ),
        expectedBehavior: 'Chapda dumaloq avatar, yonida sharh, ostida o‘qituvchi javobi.',
        difficulty: 'EASY',
        starterFiles: bs4(slots(MEDIA), { title: 'Sharhlar' }),
        checks: [
          style('flex', '`.media` — flex', '#sharh', 'display', 'flex'),
          style('body', 'Matn qolgan joyni egallaydi', '#sharh > div', 'flex-grow', '1'),
          style('gap', 'Rasm va matn orasida masofa', '#sharh > img', 'margin-right', '16px'),
          has('reply', 'Ichma-ich javob', '#sharh .media-body > #javob.media > .media-body'),
        ],
      },
    },
    {
      slug: 'filters',
      title: 'Filtrlar',
      exercise: {
        title: 'Kurslar ro‘yxatida qidiruv',
        description: 'jQuery slim bilan filtr.',
        instructions: md(
          '`script.js` da: `#qidiruv` ga matn kiritilganda (`input` hodisasi) `#royxat` dagi bandlardan',
          'faqat shu matnni o‘z ichiga olganlari qolsin. Katta-kichik harf farq qilmasin.',
        ),
        expectedBehavior: '“css” yozilsa faqat “CSS bilan bezash” qoladi.',
        difficulty: 'MEDIUM',
        starterFiles: bs4(FILTER, { title: 'Filtr', js: '// Filtr kodini shu yerga yozing' }),
        checks: [
          after(
            [fill('#qidiruv', 'css'), wait(200)],
            style(
              'hide',
              'Mos kelmagan band yashirinadi',
              '#royxat li:nth-child(1)',
              'display',
              'none',
            ),
          ),
          after(
            [fill('#qidiruv', 'css'), wait(200)],
            style('show', 'Mos band qoladi', '#royxat li:nth-child(2)', 'display', 'block'),
          ),
          after(
            [fill('#qidiruv', 'BOOT'), wait(200)],
            style('case', 'Registrga qaramaydi', '#royxat li:nth-child(3)', 'display', 'block', {
              hidden: true,
            }),
          ),
          after(
            [fill('#qidiruv', 'BOOT'), wait(200)],
            style(
              'case2',
              'Boshqa so‘z bilan ham ishlaydi',
              '#royxat li:nth-child(4)',
              'display',
              'none',
              { hidden: true },
            ),
          ),
        ],
      },
      quiz: quiz('7-modul testi: utilitalar, Flex va ikonkalar', [
        q(
          'm7-spacing',
          '`px-3` klassi nima qiladi?',
          [
            'Chap va o‘ngga 1rem padding',
            'Yuqori va pastga 3px padding',
            'Hamma tomonga 3rem margin',
            '`x` o‘qi bo‘ylab aylantiradi',
          ],
          [0],
        ),
        q(
          'm7-dnone',
          'Faqat telefonda (768px dan tor) ko‘rinadigan blok uchun qaysi klass?',
          ['`d-md-none`', '`d-none d-md-block`', '`d-sm-none`', '`visible-xs`'],
          [0],
        ),
        q(
          'm7-between',
          'Flex konteynerdagi ikki elementni chap va o‘ng chetga surish uchun?',
          [
            '`justify-content-between`',
            '`align-items-between`',
            '`flex-column`',
            '`justify-content-center`',
          ],
          [0],
        ),
        q(
          'm7-icons',
          'Bootstrap 4 da ikonkalar haqida qaysi gaplar to‘g‘ri? (bir nechta javob)',
          [
            'Bootstrap 4 tarkibida ikonkalar yo‘q',
            'Bootstrap Icons alohida CSS bilan ulanadi',
            'Faqat ikonkali tugmaga `aria-label` beriladi',
            'Glyphicons Bootstrap 4 ichida bor',
          ],
          [0, 1, 2],
        ),
        q(
          'm7-media',
          'Bootstrap 4 da `.media-body` qanday ishlaydi?',
          [
            'Flex element sifatida qolgan joyni egallaydi',
            'Jadval katagi (`table-cell`) sifatida',
            '`float: left` bilan',
            'Absolute joylashadi',
          ],
          [0],
        ),
      ]),
    },
  ],
};

export const s07: Record<string, ProjectFile[]> = {
  utilities: bs4(
    slots(UTILS, {
      card: cls('border rounded shadow p-4 mb-3'),
      center: cls('mx-auto'),
      half: cls('w-50 bg-light'),
      mobile: cls('d-md-none'),
    }),
    { title: 'Utilitalar' },
  ),
  flex: bs4(
    slots(FLEX, {
      head: cls('d-flex justify-content-between align-items-center mb-3'),
      menu: cls('d-flex flex-column flex-md-row'),
      login: ' ml-md-auto',
    }),
    { title: 'Flex' },
  ),
  icons: bs4(
    slots(ICONS, {
      okIcon: '<i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i> ',
      download: '<i class="bi bi-download" aria-hidden="true"></i> ',
      gear: '<i class="bi bi-gear" aria-hidden="true"></i>',
      label: ' aria-label="Sozlamalar"',
    }),
    { title: 'Ikonkalar', head: `<link rel="stylesheet" href="${ICONS_CDN}">` },
  ),
  'media-objects': bs4(
    slots(MEDIA, {
      media: cls('media'),
      img: cls('mr-3 rounded-circle'),
      body: cls('media-body'),
      reply: REPLY,
    }),
    { title: 'Sharhlar' },
  ),
  filters: bs4(FILTER, { title: 'Filtr', js: FILTER_JS }),
};
