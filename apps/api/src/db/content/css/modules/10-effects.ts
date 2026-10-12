import { after, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

const PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%2316a34a'/%3E%3Ccircle cx='320' cy='60' r='30' fill='%23fec400'/%3E%3C/svg%3E";

/** Markup shared by the starter files and the reference solutions. */
export const BODY10 = {
  borderImages: `<div class="gradient-chegara">Gradient chegara</div>
<div class="yumaloq">Yumaloq gradient chegara</div>`,
  backgroundSize: `<section class="qahramon"><h1>Toshkent bo‘ylab sayohat</h1></section>
<div class="logo"></div>
<div class="quti">Uzuq chegara ostida fon yo‘q</div>`,
  colorKeywords: `<nav>
  <a class="tab" href="#">Darslar</a>
  <a class="tab" href="#">Mashqlar</a>
</nav>
<p class="ogohlantirish">Diqqat: muddat ertaga tugaydi.</p>
<div class="karta">
  <p>Kartochka matni va <a href="#">undagi havola</a>.</p>
</div>`,
  linear: `<div class="banner">Banner</div>
<div class="bayroq"></div>
<div class="chiziq"></div>`,
  radial: `<div class="nuqtalar">Nuqtali fon</div>
<div class="diagramma" role="img" aria-label="60% ko‘k, 25% sariq, 15% kulrang"></div>`,
  boxShadow: `<div class="karta">Kartochka</div>
<input class="maydon" placeholder="Ism">
<div class="tanlangan">Tanlangan</div>`,
  textEffects: `<h1 class="gradient-matn">Gradientli sarlavha</h1>
<p class="kontur">KONTUR</p>
<p class="vertikal">Vertikal</p>
<h2>Uzun sarlavha ham ikki qatorga chiroyli bo‘linishi kerak</h2>`,
};

export const BG_SIZE_CSS = `.qahramon {
  min-height: 200px;
  color: white;
  background-image:
    linear-gradient(rgba(14, 17, 51, 0.6), rgba(14, 17, 51, 0.6)),
    url("${PHOTO}");
}

.logo {
  width: 200px;
  height: 80px;
  border: 1px solid #dddddd;
  background-image: url("${PHOTO}");
}

.quti {
  margin-top: 16px;
  padding: 16px;
  border: 8px dashed rgba(0, 0, 0, 0.3);
  background-color: #fec400;
}`;

export const COLOR_KEYWORDS_CSS = `.tab {
  display: inline-block;
  padding: 8px 12px;
}

.ogohlantirish {
  color: crimson;
  border: 2px solid #333333;
}

.karta {
  color: #0e1133;
}`;

export const m10: ModuleDef = {
  title: 'Bezak effektlari',
  lessons: [
    {
      slug: 'border-images',
      title: 'Chegara rasmi',
      exercise: {
        title: 'Gradientli chegaralar',
        description: '`border-image` va ikki qatlamli fon usuli.',
        instructions: md(
          '1. `.gradient-chegara`: `border: 4px solid`, `border-image: linear-gradient(90deg, #0071dc, #fec400) 1`.',
          '2. `.yumaloq`: `border: 4px solid transparent`, `border-radius: 12px` va ikki qatlamli fon:',
          '   `linear-gradient(white, white) padding-box, linear-gradient(90deg, #0071dc, #fec400) border-box`.',
        ),
        expectedBehavior: 'Biri to‘g‘ri burchakli, biri yumaloq — ikkala chegara ham gradientli.',
        difficulty: 'HARD',
        starterFiles: site(
          BODY10.borderImages,
          '.gradient-chegara,\n.yumaloq {\n  padding: 16px;\n  margin-bottom: 16px;\n}',
        ),
        checks: [
          style('width', 'Chegara 4px', '.gradient-chegara', 'border-top-width', '4px'),
          style(
            'source',
            'Chegara gradientli',
            '.gradient-chegara',
            'border-image-source',
            'linear-gradient(90deg, #0071dc, #fec400)',
          ),
          style('slice', '`border-image-slice: 1`', '.gradient-chegara', 'border-image-slice', '1'),
          style('radius', 'Yumaloq burchak', '.yumaloq', 'border-top-left-radius', '12px'),
          style(
            'clip',
            'Ikki qatlam: padding-box va border-box',
            '.yumaloq',
            'background-clip',
            'padding-box, border-box',
          ),
        ],
      },
    },
    {
      slug: 'background-size',
      title: 'Fon o‘lchami',
      exercise: {
        title: 'Qoplash, sig‘dirish va kesish',
        description: '`cover`, `contain`, `background-position` va `background-clip`.',
        instructions: md(
          '1. `.qahramon`: `background-size: cover`, `background-position: center`.',
          '2. `.logo`: rasm to‘liq ko‘rinsin — `background-size: contain`, `background-repeat: no-repeat`.',
          '3. `.quti`: fon uzuq chegara ostiga chizilmasin — `background-clip: padding-box`.',
        ),
        expectedBehavior:
          'Banner rasmi qoplaydi, logo to‘liq ko‘rinadi, uzuq chegara orasidan oq fon ko‘rinadi.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY10.backgroundSize, BG_SIZE_CSS),
        checks: [
          // Two background layers, so the computed values are listed once per layer.
          style('cover', 'Banner foni qoplaydi', '.qahramon', 'background-size', 'cover, cover'),
          style('center', 'Banner foni markazda', '.qahramon', 'background-position-x', '50%, 50%'),
          style('contain', 'Logo to‘liq ko‘rinadi', '.logo', 'background-size', 'contain'),
          style('repeat', 'Logo takrorlanmaydi', '.logo', 'background-repeat', 'no-repeat'),
          style('clip', 'Fon chegara ostida yo‘q', '.quti', 'background-clip', 'padding-box'),
        ],
      },
    },
    {
      slug: 'color-keywords',
      title: 'Rang kalit so‘zlari',
      exercise: {
        title: '`transparent`, `currentColor` va `inherit`',
        description: 'Sakramaydigan tablar va bitta joyda boshqariladigan rang.',
        instructions: md(
          '1. `.tab`: `border-bottom: 3px solid transparent`; hover’da faqat `border-bottom-color: #0071dc`.',
          '2. `.ogohlantirish` chegarasi matn rangida bo‘lsin: `#333333` o‘rniga `currentColor`.',
          '3. `.karta a`: `color: inherit`.',
        ),
        expectedBehavior:
          'Tab ostida hover’da ko‘k chiziq (o‘lcham o‘zgarmaydi), qizil chegara, kartochka rangidagi havola.',
        difficulty: 'EASY',
        starterFiles: site(BODY10.colorKeywords, COLOR_KEYWORDS_CSS),
        checks: [
          style(
            'transparent',
            'Tab chizig‘i shaffof',
            '.tab',
            'border-bottom-color',
            'transparent',
          ),
          style('width', 'Tab chizig‘i 3px', '.tab', 'border-bottom-width', '3px'),
          after(
            [{ type: 'hover', selector: '.tab' }],
            style('hover', 'Hover’da ko‘k chiziq', '.tab', 'border-bottom-color', '#0071dc'),
          ),
          style('current', 'Chegara matn rangida', '.ogohlantirish', 'border-top-color', 'crimson'),
          style('inherit', 'Havola kartochka rangida', '.karta a', 'color', '#0e1133'),
        ],
      },
    },
    {
      slug: 'linear-gradients',
      title: 'Chiziqli gradient',
      exercise: {
        title: 'Banner, bayroq va chiziqlar',
        description: 'Yo‘nalish, to‘xtash nuqtalari va takrorlanish.',
        instructions: md(
          '1. `.banner`: `background-image: linear-gradient(90deg, #0071dc, #00b4d8)`.',
          '2. `.bayroq`: uchta keskin yo‘l — `linear-gradient(#0099b5 0 33%, white 33% 67%, #1eb53a 67% 100%)`.',
          '3. `.chiziq`: `repeating-linear-gradient(45deg, #fec400 0 10px, #0e1133 10px 20px)`.',
        ),
        expectedBehavior: 'Silliq ko‘k banner, uch yo‘lli bayroq, qiya sariq-qora chiziqlar.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY10.linear,
          `.banner,
.bayroq,
.chiziq {
  height: 80px;
  margin-bottom: 12px;
}`,
        ),
        checks: [
          style(
            'banner',
            'Banner chapdan o‘ngga gradient',
            '.banner',
            'background-image',
            'linear-gradient(90deg, #0071dc, #00b4d8)',
          ),
          style(
            'flag',
            'Bayroqda uchta keskin yo‘l',
            '.bayroq',
            'background-image',
            'linear-gradient(#0099b5 0 33%, white 33% 67%, #1eb53a 67% 100%)',
          ),
          style(
            'stripes',
            'Takrorlanuvchi chiziqlar',
            '.chiziq',
            'background-image',
            'repeating-linear-gradient(45deg, #fec400 0 10px, #0e1133 10px 20px)',
          ),
        ],
      },
    },
    {
      slug: 'radial-gradients',
      title: 'Radial va konussimon gradient',
      exercise: {
        title: 'Nuqtali fon va diagramma',
        description: '`radial-gradient` naqsh va `conic-gradient` diagramma.',
        instructions: md(
          '1. `.nuqtalar`: `background-image: radial-gradient(#cbd5e1 1px, transparent 1px)`, `background-size: 16px 16px`.',
          '2. `.diagramma` (160×160): `border-radius: 50%`, `background: conic-gradient(#0071dc 0 60%, #fec400 60% 85%, #e5e7eb 85% 100%)`.',
        ),
        expectedBehavior: 'Nuqtali fon va uch qismli doiraviy diagramma.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          BODY10.radial,
          `.nuqtalar {
  height: 120px;
  margin-bottom: 16px;
}

.diagramma {
  width: 160px;
  height: 160px;
}`,
        ),
        checks: [
          style(
            'dots',
            'Nuqtali naqsh',
            '.nuqtalar',
            'background-image',
            'radial-gradient(#cbd5e1 1px, transparent 1px)',
          ),
          style('size', 'Naqsh har 16px da', '.nuqtalar', 'background-size', '16px 16px'),
          style(
            'conic',
            'Diagramma konussimon gradient',
            '.diagramma',
            'background-image',
            'conic-gradient(#0071dc 0 60%, #fec400 60% 85%, #e5e7eb 85% 100%)',
          ),
          style('round', 'Diagramma doira', '.diagramma', 'border-top-left-radius', '50%'),
        ],
      },
    },
    {
      slug: 'box-shadow',
      title: 'Blok soyasi',
      exercise: {
        title: 'Soyalar to‘plami',
        description: 'Oddiy, hover, ichki soya va halqa.',
        instructions: md(
          '1. `.karta`: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)`; hover’da `0 12px 28px rgba(0, 0, 0, 0.15)`.',
          '2. `.maydon`: ichki soya `inset 0 2px 4px rgba(0, 0, 0, 0.08)`.',
          '3. `.tanlangan`: halqa `0 0 0 3px #fec400`.',
        ),
        expectedBehavior:
          'Kartochka hover’da ko‘tariladi, maydon botgan, tanlangan element sariq halqada.',
        difficulty: 'EASY',
        starterFiles: site(BODY10.boxShadow, TODO),
        checks: [
          style(
            'card',
            'Kartochka soyasi',
            '.karta',
            'box-shadow',
            '0 4px 12px rgba(0, 0, 0, 0.1)',
          ),
          after(
            [{ type: 'hover', selector: '.karta' }],
            style(
              'hover',
              'Hover’da kattaroq soya',
              '.karta',
              'box-shadow',
              '0 12px 28px rgba(0, 0, 0, 0.15)',
            ),
          ),
          style(
            'inset',
            'Maydonda ichki soya',
            '.maydon',
            'box-shadow',
            'inset 0 2px 4px rgba(0, 0, 0, 0.08)',
          ),
          style('ring', 'Sariq halqa', '.tanlangan', 'box-shadow', '0 0 0 3px #fec400'),
        ],
      },
    },
    {
      slug: 'text-effects',
      title: 'Matn effektlari',
      exercise: {
        title: 'Gradient, kontur va vertikal matn',
        description: '`background-clip: text`, `-webkit-text-stroke`, `writing-mode`, `text-wrap`.',
        instructions: md(
          '1. `.gradient-matn`: fon `linear-gradient(90deg, #0071dc, #fec400)`, `background-clip: text`, `color: transparent`.',
          '2. `.kontur`: `color: transparent`, `-webkit-text-stroke: 2px #0071dc`.',
          '3. `.vertikal`: `writing-mode: vertical-rl`.',
          '4. `h2`: `text-wrap: balance`.',
        ),
        expectedBehavior: 'Gradientli sarlavha, faqat chizig‘i ko‘rinadigan yozuv, vertikal matn.',
        difficulty: 'MEDIUM',
        starterFiles: site(BODY10.textEffects, TODO),
        checks: [
          style('clip', 'Fon harflar ichida', '.gradient-matn', 'background-clip', 'text'),
          style(
            'transparent',
            'Gradient matn rangi shaffof',
            '.gradient-matn',
            'color',
            'transparent',
            {
              hint: 'Matn rangi gradientni yopib qo‘ymasligi kerak.',
            },
          ),
          style('stroke', 'Kontur 2px', '.kontur', '-webkit-text-stroke-width', '2px'),
          style('vertical', 'Vertikal yozuv', '.vertikal', 'writing-mode', 'vertical-rl'),
          style('balance', 'Sarlavha muvozanatli', 'h2', 'text-wrap-style', 'balance'),
        ],
      },
      quiz: quiz('10-modul testi: Bezak effektlari', [
        q(
          'q1',
          'Fon rasmi elementni to‘liq qoplashi, ortiqchasi kesilishi uchun?',
          [
            '`background-size: cover`',
            '`background-size: contain`',
            '`background-repeat: repeat`',
            '`background-clip: text`',
          ],
          [0],
        ),
        q(
          'q2',
          'Bir nechta fon qatlamidan qaysi biri eng ustda chiziladi?',
          ['Birinchi yozilgani', 'Oxirgi yozilgani', 'Eng kattasi', 'Gradient'],
          [0],
        ),
        q(
          'q3',
          '`currentColor` nimaga teng?',
          ['Elementning `color` qiymatiga', 'Fon rangiga', 'Ota fon rangiga', 'Qora rangga'],
          [0],
        ),
        q(
          'q4',
          'Doiraviy diagramma chizishga qaysi gradient mos?',
          [
            '`conic-gradient`',
            '`linear-gradient`',
            '`repeating-linear-gradient`',
            '`radial-gradient`',
          ],
          [0],
        ),
        q(
          'q5',
          '`box-shadow: 0 0 0 3px #fec400` haqida qaysilari to‘g‘ri?',
          ['Joy egallamaydi', '`border-radius` ga moslashadi', 'Ichki soya', 'Xira soya'],
          [0, 1],
        ),
      ]),
    },
  ],
};
