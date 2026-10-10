import { has, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

export const m01: ModuleDef = {
  title: 'CSS bilan tanishuv',
  lessons: [
    {
      slug: 'introduction',
      title: 'CSS nima?',
      exercise: {
        title: 'Birinchi uslublar',
        description: 'Sahifa foni, sarlavha rangi va tekislash.',
        instructions: md(
          '`style.css` faylida:',
          '',
          '- `body` foni: `#f5faff`;',
          '- `h1` rangi: `#0071dc`;',
          '- `h1` markazda bo‘lsin (`text-align: center`).',
        ),
        expectedBehavior: 'Och ko‘k fonli sahifa, markazda ko‘k sarlavha.',
        difficulty: 'EASY',
        starterFiles: site('<h1>Salom, CSS!</h1>\n<p>Bu mening birinchi uslublarim.</p>', TODO),
        checks: [
          style('bg', 'Sahifa foni `#f5faff`', 'body', 'background-color', '#f5faff'),
          style('color', 'Sarlavha rangi `#0071dc`', 'h1', 'color', '#0071dc'),
          style('center', 'Sarlavha markazda', 'h1', 'text-align', 'center'),
        ],
      },
    },
    {
      slug: 'syntax',
      title: 'CSS sintaksisi',
      exercise: {
        title: 'Sintaksis xatolarini tuzating',
        description: 'Brauzer tushunmayotgan e’lonlarni to‘g‘rilash.',
        instructions: md(
          '`style.css` da uchta e’lon ishlamayapti. Ularni tuzating:',
          '',
          '- `h1` rangi `crimson`, shrift o‘lchami `40px` bo‘lsin;',
          '- `p` rangi `#333333` bo‘lsin.',
          '',
          'Maslahat: har bir e’lon `xususiyat: qiymat;` ko‘rinishida bo‘lishi kerak.',
        ),
        expectedBehavior: 'Sarlavha to‘q qizil va katta, paragraf to‘q kulrang.',
        difficulty: 'EASY',
        starterFiles: site(
          '<h1>Sintaksis</h1>\n<p>Har bir e’lon nuqtali vergul bilan tugaydi.</p>',
          'h1 {\n  color: crimson\n  font-size: 40px;\n}\n\np {\n  color #333333;\n}',
        ),
        checks: [
          style('h1-color', 'Sarlavha rangi crimson', 'h1', 'color', 'crimson'),
          style('h1-size', 'Sarlavha 40px', 'h1', 'font-size', '40px', {
            hint: 'Oldingi e’lon oxirida `;` bormi?',
          }),
          style('p-color', 'Paragraf rangi `#333333`', 'p', 'color', '#333333', {
            hint: 'Xususiyat va qiymat orasida `:` bo‘lishi kerak.',
          }),
        ],
      },
    },
    {
      slug: 'selectors',
      title: 'Selektorlar',
      exercise: {
        title: 'To‘rt xil selektor',
        description: 'Element, klass, id va guruh selektorlari.',
        instructions: md(
          '- barcha `p` lar rangi: `#333333`;',
          '- `.eslatma` klassi foni: `#fff8db`;',
          '- `#asosiy` sarlavha shrifti: `36px`;',
          '- `h2` va `h3` — **bitta qoida** bilan — rangi `#0071dc`.',
        ),
        expectedBehavior: 'Har bir element o‘z selektori orqali bezalgan.',
        difficulty: 'EASY',
        starterFiles: site(
          `<h1 id="asosiy">Sayohat kundaligi</h1>
<h2>Samarqand</h2>
<p>Registon maydoni kechqurun juda chiroyli.</p>
<p class="eslatma">Eslatma: muzeylar dushanba kuni yopiq.</p>
<h3>Qayerda ovqatlanish mumkin</h3>
<p>Siyob bozori yonidagi choyxonalar.</p>`,
          TODO,
        ),
        checks: [
          style('p', 'Paragraflar rangi `#333333`', 'p', 'color', '#333333'),
          style('class', '`.eslatma` foni `#fff8db`', '.eslatma', 'background-color', '#fff8db'),
          style('id', '`#asosiy` shrifti 36px', '#asosiy', 'font-size', '36px'),
          style('h2', '`h2` rangi ko‘k', 'h2', 'color', '#0071dc'),
          style('h3', '`h3` rangi ko‘k', 'h3', 'color', '#0071dc'),
        ],
      },
    },
    {
      slug: 'howto',
      title: 'CSS’ni ulash usullari',
      exercise: {
        title: 'Inline uslubdan tashqi faylga',
        description: 'Uslubni `style` atributidan CSS faylga ko‘chirish.',
        instructions: md(
          '1. `index.html` da `style.css` ni `<link rel="stylesheet">` bilan ulang.',
          '2. Sarlavhadagi `style` atributini olib tashlang, uning rangini (`#0071dc`) `style.css` ga yozing.',
          '3. `<head>` ga `<style>` bloki qo‘shing va unda `.izoh` ni kursiv qiling (`font-style: italic`).',
        ),
        expectedBehavior: 'Ko‘rinish o‘zgarmaydi, lekin uslublar tashqi fayl va `<style>` blokida.',
        difficulty: 'EASY',
        starterFiles: [
          {
            path: 'index.html',
            content: `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ulash usullari</title>
</head>
<body>
  <h1 style="color: #0071dc;">Uch xil usul</h1>
  <p class="izoh">Tashqi fayl — eng qulay usul.</p>
</body>
</html>
`,
          },
          { path: 'style.css', content: `${TODO}\n` },
        ],
        checks: [
          has('link', '`style.css` ulangan', 'link[rel="stylesheet"][href="style.css"]'),
          style('h1', 'Sarlavha ko‘k', 'h1', 'color', '#0071dc'),
          has('no-inline', 'Sarlavhada `style` atributi yo‘q', 'h1[style]', {
            min: 0,
            max: 0,
          }),
          has('style-block', '`<head>` da `<style>` bloki bor', 'head style'),
          style('italic', '`.izoh` kursiv', '.izoh', 'font-style', 'italic'),
        ],
      },
    },
    {
      slug: 'comments',
      title: 'Izohlar',
      exercise: {
        title: 'To‘g‘ri izoh',
        description: 'Izohni to‘g‘ri yozish va qoidani vaqtincha o‘chirish.',
        instructions: md(
          '1. `style.css` dagi `//` bilan yozilgan izoh sarlavha rangini buzyapti. Uni `/* ... */` ko‘rinishiga keltiring.',
          '2. `.banner` ni yashirayotgan qoidani **o‘chirmasdan** izoh ichiga oling — banner ko‘rinsin.',
        ),
        expectedBehavior: 'Sarlavha ko‘k, banner sahifada ko‘rinadi.',
        difficulty: 'EASY',
        starterFiles: site(
          '<h1>Yangiliklar</h1>\n<div class="banner">Kuzgi chegirmalar boshlandi!</div>',
          'h1 {\n  // asosiy rang\n  color: #0071dc;\n}\n\n.banner {\n  display: none;\n}',
        ),
        checks: [
          style('h1', 'Sarlavha ko‘k', 'h1', 'color', '#0071dc', {
            hint: 'CSS’da `//` izoh emas.',
          }),
          style('banner', 'Banner ko‘rinadi', '.banner', 'display', 'block'),
        ],
      },
    },
    {
      slug: 'errors',
      title: 'Xatolar va ularni topish',
      exercise: {
        title: 'Xato qidiruvchi',
        description: 'Ishlamayotgan to‘rtta e’lonni toping va tuzating.',
        instructions: md(
          '`style.css` da xatolar bor. Natijada quyidagilar bo‘lishi kerak:',
          '',
          '- `.karta` kengligi `300px`;',
          '- `.karta` ichki bo‘shlig‘i `16px`;',
          '- `.karta` foni `#f5faff`;',
          '- `.tugma` matni oq (`white`).',
        ),
        expectedBehavior: '300px kenglikdagi och ko‘k kartochka va oq yozuvli tugma.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          '<div class="karta">\n  <p>Kurs: CSS asoslari</p>\n  <a class="tugma" href="#">Yozilish</a>\n</div>',
          `.karta {
width: 300;
padding: 16px
backgroud-color: #f5faff;

.tugma {
background-color: #0071dc;
color: white;
}`,
        ),
        checks: [
          style('width', 'Kartochka kengligi 300px', '.karta', 'width', '300px', {
            hint: 'Sonlardan keyin birlik kerak.',
          }),
          style('padding', 'Ichki bo‘shliq 16px', '.karta', 'padding-top', '16px'),
          style('bg', 'Kartochka foni och ko‘k', '.karta', 'background-color', '#f5faff', {
            hint: 'Xususiyat nomini harfma-harf tekshiring.',
          }),
          style('button', 'Tugma matni oq', '.tugma', 'color', 'white', {
            hint: 'Har bir `{` uchun `}` bormi?',
          }),
        ],
      },
      quiz: quiz('1-modul testi: CSS bilan tanishuv', [
        q(
          'q1',
          'CSS nima uchun ishlatiladi?',
          [
            'Sahifa ko‘rinishini belgilash uchun',
            'Ma’lumotlar bazasi uchun',
            'Server dasturlash uchun',
            'Rasm chizish uchun',
          ],
          [0],
        ),
        q(
          'q2',
          '`class="karta"` bo‘lgan elementni qaysi selektor tanlaydi?',
          ['.karta', '#karta', 'karta', '*karta'],
          [0],
        ),
        q(
          'q3',
          'Qaysi yozuvlar to‘g‘ri CSS izohi?',
          ['/* izoh */', '// izoh', '<!-- izoh -->', '/* ko‘p\nqatorli */'],
          [0, 3],
        ),
        q(
          'q4',
          'Tashqi CSS fayl qaysi teg bilan ulanadi?',
          ['<link rel="stylesheet" href="...">', '<style src="...">', '<css>', '<script>'],
          [0],
        ),
        q(
          'q5',
          'Brauzer tushunmagan CSS e’lonini nima qiladi?',
          [
            'E’tiborsiz qoldiradi',
            'Sahifani to‘xtatadi',
            'Xato oynasini chiqaradi',
            'Butun faylni o‘chiradi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
