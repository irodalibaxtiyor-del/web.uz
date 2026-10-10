import { md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

export const m02: ModuleDef = {
  title: 'Ranglar va fon',
  lessons: [
    {
      slug: 'colors',
      title: 'Ranglar',
      exercise: {
        title: 'Rang nomlari',
        description: 'Matn, fon va chegara ranglari.',
        instructions: md(
          '- `.xabar` matni `navy`, foni `whitesmoke`;',
          '- `.xato` chegarasi: `2px solid crimson`;',
          '- `.tugma` matni `#0071dc`, chegarasi esa matn rangida: `2px solid currentcolor`.',
        ),
        expectedBehavior:
          'Xabar bloki kulrang fonda, xato bloki qizil chegarada, tugma chegarasi ko‘k.',
        difficulty: 'EASY',
        starterFiles: site(
          `<p class="xabar">Buyurtmangiz qabul qilindi.</p>
<p class="xato">To‘lov amalga oshmadi.</p>
<a class="tugma" href="#">Qayta urinish</a>`,
          TODO,
        ),
        checks: [
          style('text', '`.xabar` matni navy', '.xabar', 'color', 'navy'),
          style('bg', '`.xabar` foni whitesmoke', '.xabar', 'background-color', 'whitesmoke'),
          style('border', '`.xato` chegarasi crimson', '.xato', 'border-top-color', 'crimson'),
          style('border-style', '`.xato` chegarasi solid', '.xato', 'border-top-style', 'solid'),
          style('current', 'Tugma chegarasi matn rangida', '.tugma', 'border-top-color', '#0071dc'),
        ],
      },
    },
    {
      slug: 'rgb',
      title: 'RGB ranglar',
      exercise: {
        title: 'RGB va shaffoflik',
        description: 'Ranglarni `rgb()` bilan yozish.',
        instructions: md(
          '- `.sarlavha` matni: `rgb(0, 113, 220)`;',
          '- `.kulrang` matni: `rgb(128, 128, 128)`;',
          '- `.qoplama` foni: yarim shaffof qora — `rgb(0 0 0 / 0.5)`.',
        ),
        expectedBehavior: 'Ko‘k sarlavha, kulrang izoh va yarim shaffof qora qatlam.',
        difficulty: 'EASY',
        starterFiles: site(
          `<h1 class="sarlavha">RGB</h1>
<p class="kulrang">Qizil, yashil va ko‘k yorug‘lik aralashmasi.</p>
<div class="qoplama">Shaffof qatlam</div>`,
          TODO,
        ),
        checks: [
          style('blue', 'Sarlavha `rgb(0, 113, 220)`', '.sarlavha', 'color', 'rgb(0, 113, 220)'),
          style('gray', 'Izoh kulrang', '.kulrang', 'color', 'rgb(128, 128, 128)'),
          style(
            'alpha',
            'Qatlam yarim shaffof qora',
            '.qoplama',
            'background-color',
            'rgb(0 0 0 / 0.5)',
            { hint: 'Alfa qiymati `/` dan keyin yoziladi.' },
          ),
        ],
      },
    },
    {
      slug: 'hex',
      title: 'HEX ranglar',
      exercise: {
        title: 'HEX palitra',
        description: 'Olti, uch va sakkiz belgili HEX ranglar.',
        instructions: md(
          '- `h1` matni: `#0e1133`;',
          '- `.urgu` foni: qisqa yozuvda `#fc0`;',
          '- `.soya` foni: yarim shaffof qora `#00000080`.',
        ),
        expectedBehavior: 'To‘q ko‘k sarlavha, sariq urg‘u va shaffof qora blok.',
        difficulty: 'EASY',
        starterFiles: site(
          `<h1>HEX ranglar</h1>
<p><span class="urgu">Muhim:</span> HEX — RGB’ning qisqa yozuvi.</p>
<div class="soya">Shaffof blok</div>`,
          TODO,
        ),
        checks: [
          style('h1', 'Sarlavha `#0e1133`', 'h1', 'color', '#0e1133'),
          style('short', 'Urg‘u foni `#fc0`', '.urgu', 'background-color', '#ffcc00'),
          style('alpha', 'Blok foni `#00000080`', '.soya', 'background-color', '#00000080'),
        ],
      },
    },
    {
      slug: 'hsl',
      title: 'HSL ranglar',
      exercise: {
        title: 'Bitta tusdan palitra',
        description: 'HSL bilan bir rangning och va to‘q variantlari.',
        instructions: md(
          'Tus `210` (ko‘k), to‘yinganlik `100%`:',
          '',
          '- `.asosiy` foni: yorqinlik `43%`;',
          '- `.och` foni: yorqinlik `95%`;',
          '- `.toq` matni: yorqinlik `20%`.',
        ),
        expectedBehavior: 'Bir xil ko‘kning uch varianti: asosiy, juda och va juda to‘q.',
        difficulty: 'EASY',
        starterFiles: site(
          `<div class="och">
  <h2 class="toq">HSL palitra</h2>
  <a class="asosiy" href="#">Asosiy tugma</a>
</div>`,
          TODO,
        ),
        checks: [
          style('main', 'Asosiy rang 43%', '.asosiy', 'background-color', 'hsl(210, 100%, 43%)'),
          style('light', 'Och fon 95%', '.och', 'background-color', 'hsl(210, 100%, 95%)'),
          style('dark', 'To‘q matn 20%', '.toq', 'color', 'hsl(210, 100%, 20%)'),
        ],
      },
    },
    {
      slug: 'backgrounds',
      title: 'Fon rangi',
      exercise: {
        title: 'Faqat fon shaffof bo‘lsin',
        description: '`opacity` va alfa kanalli rang farqi.',
        instructions: md(
          '1. `body` foni: `#f5faff`.',
          '2. `h2` foni `#0071dc`, matni oq.',
          '3. `.qoplama` da hozir `opacity` matnni ham xiralashtiryapti. `opacity` ni olib tashlang va fonni `rgb(0 113 220 / 0.2)` qiling.',
        ),
        expectedBehavior: 'Qoplama foni och ko‘k, matni esa aniq ko‘rinadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<h2>Fon rangi</h2>
<div class="qoplama">
  <p>Bu matn xira bo‘lmasligi kerak.</p>
</div>`,
          '.qoplama {\n  padding: 16px;\n  background-color: rgb(0 113 220);\n  opacity: 0.2;\n}',
        ),
        checks: [
          style('body', 'Sahifa foni `#f5faff`', 'body', 'background-color', '#f5faff'),
          style('h2-bg', 'Sarlavha foni ko‘k', 'h2', 'background-color', '#0071dc'),
          style('h2-color', 'Sarlavha matni oq', 'h2', 'color', 'white'),
          style('opacity', 'Qoplama butunlay xiralashmagan', '.qoplama', 'opacity', '1', {
            hint: '`opacity` ichidagi matnni ham xiralashtiradi.',
          }),
          style(
            'alpha',
            'Qoplama foni shaffof ko‘k',
            '.qoplama',
            'background-color',
            'rgb(0 113 220 / 0.2)',
          ),
        ],
      },
    },
    {
      slug: 'background-image',
      title: 'Fon rasmi',
      exercise: {
        title: 'Hero bloki',
        description: 'Gradient fon, o‘lcham, takrorlanish va joylashuv.',
        instructions: md(
          '1. `.hero` ga fon sifatida gradient bering: `linear-gradient(#0071dc, #0e1133)`, o‘lchami `cover`.',
          '2. `.belgi` dagi fon rasmi takrorlanmasin (`no-repeat`) va o‘ng yuqori burchakda tursin (`right top`).',
        ),
        expectedBehavior: 'Ko‘kdan to‘q ko‘kka o‘tuvchi hero va burchakda bitta belgi.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<section class="hero">
  <h1>Toshkent bo‘ylab sayohat</h1>
</section>
<div class="belgi">Yangi yo‘nalish</div>`,
          `.hero {
  min-height: 200px;
  color: white;
  background-color: #0e1133;
}

.belgi {
  padding: 16px 48px 16px 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23fec400'/%3E%3C/svg%3E");
}`,
        ),
        checks: [
          style(
            'gradient',
            'Hero fonida gradient',
            '.hero',
            'background-image',
            'linear-gradient(#0071dc, #0e1133)',
          ),
          style('cover', 'Fon o‘lchami `cover`', '.hero', 'background-size', 'cover'),
          style('repeat', 'Belgi takrorlanmaydi', '.belgi', 'background-repeat', 'no-repeat'),
          style('position', 'Belgi o‘ng yuqorida', '.belgi', 'background-position', 'right top'),
        ],
      },
    },
    {
      slug: 'background-attachment',
      title: 'Fon harakati (attachment)',
      exercise: {
        title: 'Parallaks va ichki aylantirish',
        description: '`fixed` va `local` qiymatlari.',
        instructions: md(
          '1. `.parallaks` foni ekranga mahkamlansin: `background-attachment: fixed`.',
          '2. `.royxat` ichida aylantirish bo‘lsin (`overflow: auto`) va foni kontent bilan siljisin (`local`).',
        ),
        expectedBehavior:
          'Parallaks blokda fon joyida turadi, ro‘yxat foni esa ichki aylantirish bilan siljiydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<section class="parallaks"><h2>Parallaks</h2></section>
<ul class="royxat">
  <li>Andijon</li><li>Buxoro</li><li>Farg‘ona</li><li>Jizzax</li>
  <li>Namangan</li><li>Navoiy</li><li>Qarshi</li><li>Samarqand</li>
</ul>`,
          `.parallaks {
  min-height: 300px;
  background-image: linear-gradient(135deg, #0071dc, #0e1133);
  color: white;
}

.royxat {
  height: 120px;
  background-image: linear-gradient(white, #dbeafe);
}`,
        ),
        checks: [
          style(
            'fixed',
            'Parallaks foni mahkamlangan',
            '.parallaks',
            'background-attachment',
            'fixed',
          ),
          style('overflow', 'Ro‘yxatda ichki aylantirish', '.royxat', 'overflow-y', 'auto'),
          style('local', 'Ro‘yxat foni `local`', '.royxat', 'background-attachment', 'local'),
        ],
      },
    },
    {
      slug: 'background-shorthand',
      title: 'Fon: qisqa yozuv',
      exercise: {
        title: 'Qisqa yozuv tuzog‘i',
        description: '`background` qisqa yozuvini to‘g‘ri ishlatish va qatlamlar.',
        instructions: md(
          '1. `.hero` da qisqa yozuv gradientni o‘chirib yubormoqda. Bitta `background` bilan ikkalasini bering: rang `#0e1133`, rasm `linear-gradient(#0071dc, #0e1133)`, `no-repeat`.',
          '2. `.banner` ga ikki qatlamli fon bering: ustda `linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5))`, ostida `linear-gradient(90deg, #0071dc, #fec400)`.',
        ),
        expectedBehavior:
          'Hero’da gradient ko‘rinadi, banner rangli fon ustida qoraytirilgan qatlam bilan.',
        difficulty: 'HARD',
        starterFiles: site(
          '<section class="hero"><h1>Qisqa yozuv</h1></section>\n<section class="banner"><h2>Qatlamlar</h2></section>',
          `.hero {
  min-height: 160px;
  color: white;
  background-image: linear-gradient(#0071dc, #0e1133);
  background: #0e1133;
}

.banner {
  min-height: 120px;
  color: white;
}`,
        ),
        checks: [
          style('color', 'Hero rangi `#0e1133`', '.hero', 'background-color', '#0e1133'),
          style(
            'image',
            'Hero gradienti saqlangan',
            '.hero',
            'background-image',
            'linear-gradient(#0071dc, #0e1133)',
            { hint: 'Qisqa yozuv yozilmagan qiymatlarni standartga qaytaradi.' },
          ),
          style('repeat', 'Hero foni takrorlanmaydi', '.hero', 'background-repeat', 'no-repeat'),
          style(
            'layers',
            'Bannerda ikki qatlam',
            '.banner',
            'background-image',
            'linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)), linear-gradient(90deg, #0071dc, #fec400)',
            { hint: 'Qatlamlar vergul bilan ajratiladi, birinchisi eng ustda.' },
          ),
        ],
      },
      quiz: quiz('2-modul testi: Ranglar va fon', [
        q('q1', '`rgb(0, 0, 0)` qaysi rang?', ['Qora', 'Oq', 'Qizil', 'Shaffof'], [0]),
        q(
          'q2',
          '`#333` qaysi qiymatning qisqa yozuvi?',
          ['#333333', '#303030', '#000333', '#333000'],
          [0],
        ),
        q(
          'q3',
          'HSL’da rangni ochroq qilish uchun nimani o‘zgartirish kerak?',
          ['Yorqinlik (L)', 'Tus (H)', 'Faqat to‘yinganlik (S)', 'Hech narsani'],
          [0],
        ),
        q(
          'q4',
          'Faqat fonni shaffof qilishning to‘g‘ri yo‘llari qaysilar?',
          [
            'background-color: rgb(0 0 0 / 0.5)',
            'background-color: #00000080',
            'opacity: 0.5',
            'background-color: hsl(0 0% 0% / 0.5)',
          ],
          [0, 1, 3],
        ),
        q(
          'q5',
          'Fon rasmi maydonni to‘liq qoplashi uchun qaysi qiymat?',
          [
            'background-size: cover',
            'background-size: contain',
            'background-repeat: repeat',
            'background-position: center',
          ],
          [0],
        ),
      ]),
    },
  ],
};
