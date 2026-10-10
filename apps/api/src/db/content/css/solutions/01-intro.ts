import type { ProjectFile } from '@webdizayn/shared';
import { site } from '../shared';

export const s01: Record<string, ProjectFile[]> = {
  introduction: site(
    '<h1>Salom, CSS!</h1>\n<p>Bu mening birinchi uslublarim.</p>',
    `body {
  background-color: #f5faff;
}

h1 {
  color: #0071dc;
  text-align: center;
}`,
  ),

  syntax: site(
    '<h1>Sintaksis</h1>\n<p>Har bir e’lon nuqtali vergul bilan tugaydi.</p>',
    'h1 {\n  color: crimson;\n  font-size: 40px;\n}\n\np {\n  color: #333333;\n}',
  ),

  selectors: site(
    `<h1 id="asosiy">Sayohat kundaligi</h1>
<h2>Samarqand</h2>
<p>Registon maydoni kechqurun juda chiroyli.</p>
<p class="eslatma">Eslatma: muzeylar dushanba kuni yopiq.</p>
<h3>Qayerda ovqatlanish mumkin</h3>
<p>Siyob bozori yonidagi choyxonalar.</p>`,
    `p {
  color: #333333;
}

.eslatma {
  background-color: #fff8db;
}

#asosiy {
  font-size: 36px;
}

h2,
h3 {
  color: #0071dc;
}`,
  ),

  howto: site(
    '<h1>Uch xil usul</h1>\n<p class="izoh">Tashqi fayl — eng qulay usul.</p>',
    'h1 {\n  color: #0071dc;\n}',
    { title: 'Ulash usullari', head: '<style>\n  .izoh { font-style: italic; }\n</style>' },
  ),

  comments: site(
    '<h1>Yangiliklar</h1>\n<div class="banner">Kuzgi chegirmalar boshlandi!</div>',
    'h1 {\n  /* asosiy rang */\n  color: #0071dc;\n}\n\n/* .banner {\n  display: none;\n} */',
  ),

  errors: site(
    '<div class="karta">\n  <p>Kurs: CSS asoslari</p>\n  <a class="tugma" href="#">Yozilish</a>\n</div>',
    `.karta {
  width: 300px;
  padding: 16px;
  background-color: #f5faff;
}

.tugma {
  background-color: #0071dc;
  color: white;
}`,
  ),
};
