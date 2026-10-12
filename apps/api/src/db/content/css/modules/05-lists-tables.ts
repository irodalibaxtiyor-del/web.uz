import { after, at, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

/** Markup shared by the starter files and the reference solutions. */
export const BODY05 = {
  links: `<p>Batafsil: <a href="#qollanma">qo‘llanma</a>.</p>
<a class="tugma" href="#royxat">Ro‘yxatdan o‘tish</a>`,
  lists: `<nav>
  <ul>
    <li><a href="#">Bosh sahifa</a></li>
    <li><a href="#">Kurslar</a></li>
  </ul>
</nav>
<ul class="afzalliklar">
  <li>Har darsda mashq</li>
  <li>Avtomatik tekshiruv</li>
</ul>
<ol class="bosqichlar">
  <li>Ro‘yxatdan o‘ting</li>
  <li>Kursni tanlang</li>
</ol>`,
  table: `<table>
  <thead>
    <tr><th>Kurs</th><th>Darslar</th><th>Narx</th></tr>
  </thead>
  <tbody>
    <tr><td>HTML</td><td class="raqam">60</td><td class="raqam">200 000</td></tr>
    <tr><td>CSS</td><td class="raqam">101</td><td class="raqam">240 000</td></tr>
  </tbody>
</table>`,
  tableStyling: `<div class="jadval-quti">
  <table>
    <caption>Kurslar narxi</caption>
    <thead>
      <tr><th>Kurs</th><th>Narx</th></tr>
    </thead>
    <tbody>
      <tr><td>HTML</td><td>200 000</td></tr>
      <tr><td>CSS</td><td>240 000</td></tr>
      <tr><td>JavaScript</td><td>320 000</td></tr>
    </tbody>
  </table>
</div>`,
};

export const TABLE_BASE = `table {
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  border-bottom: 1px solid #dddddd;
}`;

export const m05: ModuleDef = {
  title: 'Havola, ro‘yxat va jadval',
  lessons: [
    {
      slug: 'links',
      title: 'Havolalar',
      exercise: {
        title: 'Havola holatlari va havola-tugma',
        description: 'Rang, hover, fokus va tugma ko‘rinishidagi havola.',
        instructions: md(
          '1. Barcha havolalar rangi `#0071dc`.',
          '2. `a:hover` da rang `#0e1133`.',
          '3. `a:focus-visible` da `outline: 3px solid #0071dc`.',
          '4. `.tugma`: `display: inline-block`, fon `#0071dc`, matn oq, tagchiziqsiz, `padding: 10px 20px`. (Bu qoidani umumiy `a` qoidalaridan **keyin** yozing.)',
        ),
        expectedBehavior:
          'Ko‘k havola hover’da to‘q rangga o‘tadi, Tab bilan kontur chiqadi, ro‘yxatdan o‘tish tugma ko‘rinishida.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY05.links, TODO),
        checks: [
          style('color', 'Havola ko‘k', 'p a', 'color', '#0071dc'),
          after(
            [{ type: 'hover', selector: 'p a' }],
            style('hover', 'Hover’da to‘q rang', 'p a', 'color', '#0e1133'),
          ),
          after(
            [{ type: 'press', selector: 'body', key: 'Tab' }],
            style('focus', 'Fokusda ko‘k kontur', 'p a', 'outline-color', '#0071dc'),
          ),
          style('btn-bg', 'Tugma fonli', '.tugma', 'background-color', '#0071dc'),
          style('btn-deco', 'Tugma tagchiziqsiz', '.tugma', 'text-decoration-line', 'none'),
        ],
      },
    },
    {
      slug: 'lists',
      title: 'Ro‘yxatlar',
      exercise: {
        title: 'Menyu va belgilar',
        description: 'Belgi turi, `::marker` va belgisiz menyu.',
        instructions: md(
          '1. `nav ul`: belgisiz (`list-style: none`), `padding-left: 0`.',
          '2. `.afzalliklar`: belgilar kvadrat (`square`), rangi `#0071dc` (`li::marker`).',
          '3. `.bosqichlar`: Rim raqamlari (`upper-roman`).',
        ),
        expectedBehavior:
          'Menyu chekinishsiz va belgisiz, afzalliklar ko‘k kvadrat bilan, bosqichlar I, II bilan.',
        difficulty: 'EASY',
        starterFiles: site(BODY05.lists, TODO),
        checks: [
          style('nav', 'Menyu belgisiz', 'nav ul', 'list-style-type', 'none'),
          style('nav-pad', 'Menyu chekinishsiz', 'nav ul', 'padding-left', '0px'),
          style('square', 'Afzalliklar kvadrat', '.afzalliklar', 'list-style-type', 'square'),
          style('marker', 'Belgilar ko‘k', '.afzalliklar li', 'color', '#0071dc', {
            pseudo: '::marker',
            hint: '`.afzalliklar li::marker { color: #0071dc; }`',
          }),
          style(
            'roman',
            'Bosqichlar Rim raqamida',
            '.bosqichlar',
            'list-style-type',
            'upper-roman',
          ),
        ],
      },
    },
    {
      slug: 'tables',
      title: 'Jadvallar',
      exercise: {
        title: 'Narxlar jadvali',
        description: 'Chegaralar, kenglik, padding va tekislash.',
        instructions: md(
          '- `table`: `border-collapse: collapse`, kengligi `100%`;',
          '- `th` va `td`: `padding: 8px 12px`, chapga tekislangan;',
          '- `th`: pastki chegarasi `2px solid #0e1133`;',
          '- `td.raqam`: o‘ngga tekislangan.',
        ),
        expectedBehavior: 'To‘liq kenglikdagi, bitta chiziqli, raqamlari o‘ngda turgan jadval.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY05.table, 'body {\n  margin: 0;\n}'),
        checks: [
          style('collapse', 'Chegaralar birlashgan', 'table', 'border-collapse', 'collapse'),
          at(800, 600, style('width', 'Jadval to‘liq kenglikda', 'table', 'width', '800px')),
          style('th-align', 'Sarlavhalar chapda', 'th', 'text-align', 'left'),
          style('th-border', 'Sarlavha ostida 2px chiziq', 'th', 'border-bottom-width', '2px'),
          style('num', 'Raqamlar o‘ngda', 'td.raqam', 'text-align', 'right'),
        ],
      },
    },
    {
      slug: 'table-styling',
      title: 'Jadvalni bezash',
      exercise: {
        title: 'Zebra, hover va o‘ram',
        description: 'Juft qatorlar foni, hover qator va kichik ekran uchun o‘ram.',
        instructions: md(
          '1. `tbody` ning juft qatorlari foni `#f5faff`.',
          '2. Sichqoncha ostidagi `tbody` qatori foni `#e6f1fc`.',
          '3. `caption` jadval ostida (`caption-side: bottom`).',
          '4. `.jadval-quti` gorizontal aylantirilsin: `overflow-x: auto`.',
        ),
        expectedBehavior:
          'Qatorlar navbatma-navbat, hover qator ajralib turadi, jadval nomi pastda.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY05.tableStyling, TABLE_BASE),
        checks: [
          style(
            'zebra',
            'Juft qator fonli',
            'tbody tr:nth-child(2)',
            'background-color',
            '#f5faff',
            { hint: '`tbody tr:nth-child(even)`' },
          ),
          style(
            'odd',
            'Toq qator fonsiz',
            'tbody tr:nth-child(1)',
            'background-color',
            'rgba(0, 0, 0, 0)',
            { hidden: true },
          ),
          after(
            [{ type: 'hover', selector: 'tbody tr:nth-child(3)' }],
            style(
              'hover',
              'Hover qator ajraladi',
              'tbody tr:nth-child(3)',
              'background-color',
              '#e6f1fc',
            ),
          ),
          style('caption', 'Jadval nomi pastda', 'caption', 'caption-side', 'bottom'),
          style('scroll', 'O‘ram aylantiriladi', '.jadval-quti', 'overflow-x', 'auto'),
        ],
      },
      quiz: quiz('5-modul testi: Havola, ro‘yxat va jadval', [
        q(
          'q1',
          'Havola holatlarining to‘g‘ri tartibi qaysi?',
          [
            '`:link`, `:visited`, `:hover`, `:active`',
            '`:hover`, `:link`, `:active`, `:visited`',
            '`:active`, `:hover`, `:visited`, `:link`',
            'Tartib muhim emas',
          ],
          [0],
        ),
        q(
          'q2',
          '`:visited` da qaysi xususiyatlarni o‘zgartirish mumkin?',
          ['Faqat ranglar', 'O‘lcham', 'Fon rasmi', 'Hammasi'],
          [0],
        ),
        q(
          'q3',
          'Menyu ro‘yxatidan belgilar va chekinishni olib tashlash uchun nima kerak?',
          ['`list-style: none`', '`padding-left: 0`', '`display: none`', '`text-decoration: none`'],
          [0, 1],
        ),
        q(
          'q4',
          'Qo‘shni kataklarning ikki qavat chegarasini bitta qiladigan xususiyat?',
          ['`border-collapse: collapse`', '`border-spacing: 0`', '`border: none`', '`outline`'],
          [0],
        ),
        q(
          'q5',
          'Keng jadval telefonda sahifani cho‘zib yubormasligi uchun?',
          [
            'Jadvalni `overflow-x: auto` o‘ramga solish',
            '`font-size` ni kichraytirish',
            'Jadvalga `width: 100%` berish',
            '`white-space: nowrap`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
