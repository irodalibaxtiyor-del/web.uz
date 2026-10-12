import { after, attr, md, q, quiz, site, style, TODO, type ModuleDef } from '../shared';

const SVG_HOME =
  '<svg class="ikonka" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z" /></svg>';
const SVG_SEARCH =
  '<svg class="ikonka" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" /></svg>';

export const m04: ModuleDef = {
  title: 'Matn va shriftlar',
  lessons: [
    {
      slug: 'text',
      title: 'Matnni bezash',
      exercise: {
        title: 'O‘qishga qulay maqola',
        description: 'Rang, tekislash, qator balandligi va harf oralig‘i.',
        instructions: md(
          '- `body` matni `#0e1133` rangda;',
          '- `h1` markazda;',
          '- `p` larning qator balandligi `1.6` (birliksiz);',
          '- `.yorliq` harflari orasida `2px`.',
        ),
        expectedBehavior: 'Markazdagi sarlavha, keng qatorli paragraflar, siyrak yozilgan yorliq.',
        difficulty: 'EASY',
        starterFiles: site(
          `<span class="yorliq">Maqola</span>
<h1>Yaxshi matn qanday bo‘ladi?</h1>
<p>Qatorlar orasida yetarli joy bo‘lsa, ko‘z charchamaydi va matn tez o‘qiladi.</p>
<p>Matn rangi fon bilan yaxshi kontrast hosil qilishi kerak.</p>`,
          TODO,
        ),
        checks: [
          style('color', 'Matn rangi #0e1133', 'body', 'color', '#0e1133'),
          style('align', 'Sarlavha markazda', 'h1', 'text-align', 'center'),
          style('lh', 'Paragraf qator balandligi 1.6', 'p', 'line-height', '1.6', {
            hint: '`line-height: 1.6;` — birliksiz yozing.',
          }),
          style('ls', 'Yorliq harflari orasida 2px', '.yorliq', 'letter-spacing', '2px'),
        ],
      },
    },
    {
      slug: 'text-decoration',
      title: 'Matn bezagi',
      exercise: {
        title: 'Havolalar va eski narx',
        description: 'Tagchiziqni olib tashlash, qo‘shish va chizib tashlash.',
        instructions: md(
          '1. Menyu havolalari (`nav a`) tagchiziqsiz bo‘lsin.',
          '2. Maqola ichidagi havolalarda (`.maqola a`) tagchiziq qolsin va harflardan `3px` pastda tursin (`text-underline-offset`).',
          '3. `.eski-narx` chizib tashlangan bo‘lsin (`line-through`).',
        ),
        expectedBehavior: 'Menyu toza, matndagi havola tagchiziqli, eski narx ustidan chizilgan.',
        difficulty: 'EASY',
        starterFiles: site(
          `<nav><a href="#">Kurslar</a> <a href="#">Narxlar</a></nav>
<div class="maqola">
  <p>Batafsil ma’lumot <a href="#">qo‘llanmada</a> berilgan.</p>
  <p>Narx: <span class="eski-narx">300 000</span> 240 000 so‘m</p>
</div>`,
          TODO,
        ),
        checks: [
          style('nav', 'Menyu havolalari tagchiziqsiz', 'nav a', 'text-decoration-line', 'none'),
          style(
            'article',
            'Maqoladagi havola tagchiziqli',
            '.maqola a',
            'text-decoration-line',
            'underline',
          ),
          style('offset', 'Tagchiziq 3px pastda', '.maqola a', 'text-underline-offset', '3px'),
          style(
            'strike',
            'Eski narx chizilgan',
            '.eski-narx',
            'text-decoration-line',
            'line-through',
          ),
        ],
      },
    },
    {
      slug: 'text-transform',
      title: 'Harflar va bo‘sh joylar',
      exercise: {
        title: 'Yorliq, narx va uzun havola',
        description: '`text-transform`, `white-space` va `overflow-wrap`.',
        instructions: md(
          '1. `.yorliq` matni HTML’da “Yangi”. CSS bilan bosh harflarga o‘tkazing.',
          '2. `h2` dagi `capitalize` ni bekor qiling (`none`).',
          '3. `.narx` hech qachon ikki qatorga bo‘linmasin.',
          '4. `.izoh` dagi uzun havola blokdan chiqmasin: `overflow-wrap: break-word`.',
        ),
        expectedBehavior: 'YANGI yorlig‘i, oddiy sarlavha, bir qatordagi narx, bo‘lingan havola.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<span class="yorliq">Yangi</span>
<h2>Veb dizayn asoslari kursi</h2>
<p>Narxi: <span class="narx">240 000 so‘m</span></p>
<p class="izoh">Manba: https://misol.uz/juda/uzun/manzil/bolib/blokdan/chiqib/ketadigan/havola</p>`,
          `h2 {
  text-transform: capitalize;
}

.izoh {
  width: 200px;
}`,
        ),
        checks: [
          style('upper', 'Yorliq bosh harflarda', '.yorliq', 'text-transform', 'uppercase'),
          style('h2', 'Sarlavhada `capitalize` yo‘q', 'h2', 'text-transform', 'none'),
          style('nowrap', 'Narx bir qatorda', '.narx', 'white-space', 'nowrap'),
          style('wrap', 'Uzun havola bo‘linadi', '.izoh', 'overflow-wrap', 'break-word'),
        ],
      },
    },
    {
      slug: 'text-shadow',
      title: 'Matn soyasi',
      exercise: {
        title: 'Banner va neon',
        description: 'Yengil soya, nur effekti va soyani o‘chirish.',
        instructions: md(
          '1. `.banner h1`: `text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6)`.',
          '2. `.neon`: siljishsiz nur — `0 0 8px #00e5ff`.',
          '3. Paragraflarga soya kerak emas: `p` dagi soyani olib tashlang (`none`).',
        ),
        expectedBehavior: 'Banner sarlavhasi aniq o‘qiladi, neon yozuv nurlanadi, matn soyasiz.',
        difficulty: 'EASY',
        starterFiles: site(
          `<div class="banner"><h1>Yozgi intensiv kurs</h1></div>
<p class="neon">Ochiq</p>
<p>Ro‘yxatdan o‘tish 1-iyungacha davom etadi.</p>`,
          `.banner {
  padding: 40px;
  background: linear-gradient(135deg, #0071dc, #00b4d8);
  color: white;
}

.neon {
  padding: 12px;
  background-color: #0e1133;
  color: white;
}

p {
  text-shadow: 1px 1px 2px gray;
}`,
        ),
        checks: [
          style(
            'banner',
            'Banner sarlavhasida soya',
            '.banner h1',
            'text-shadow',
            'rgba(0, 0, 0, 0.6) 0px 2px 6px',
          ),
          style('neon', 'Neon nur', '.neon', 'text-shadow', '#00e5ff 0px 0px 8px', {
            hint: 'Tartib: x, y, xiralik, rang — `0 0 8px #00e5ff`.',
          }),
          style('none', 'Oddiy paragrafda soya yo‘q', 'p:last-of-type', 'text-shadow', 'none'),
        ],
      },
    },
    {
      slug: 'fonts',
      title: 'Shriftlar',
      exercise: {
        title: 'Shrift juftligi',
        description: 'Matn, sarlavha va kod uchun zaxira ro‘yxatlari.',
        instructions: md(
          '- `body`: `Arial, sans-serif`;',
          '- `h1` va `h2`: `Georgia, serif`;',
          '- `code`: `Consolas, "Courier New", monospace`;',
          '- `button` sahifa shriftini meros olsin: `font-family: inherit`.',
        ),
        expectedBehavior:
          'Serif sarlavhalar, sans-serif matn, monospace kod va bir xil shriftli tugma.',
        difficulty: 'EASY',
        starterFiles: site(
          `<h1>Shriftlar</h1>
<p>Kod namunasi: <code>color: red;</code></p>
<h2>Tugma</h2>
<button>Saqlash</button>`,
          TODO,
        ),
        checks: [
          style('body', 'Matn Arial, sans-serif', 'body', 'font-family', 'Arial, sans-serif'),
          style('h1', 'Sarlavha Georgia, serif', 'h1', 'font-family', 'Georgia, serif'),
          style('h2', '`h2` ham Georgia, serif', 'h2', 'font-family', 'Georgia, serif'),
          style(
            'code',
            'Kod monospace',
            'code',
            'font-family',
            'Consolas, "Courier New", monospace',
          ),
          style('button', 'Tugma sahifa shriftida', 'button', 'font-family', 'Arial, sans-serif', {
            hint: 'Forma elementlari shriftni o‘zi meros olmaydi.',
          }),
        ],
      },
    },
    {
      slug: 'font-style',
      title: 'Shrift uslubi va o‘lchami',
      exercise: {
        title: 'Kursiv, qalin va rem',
        description: '`font-style`, `font-weight` va `font-size`.',
        instructions: md(
          '- `.izoh` kursivda;',
          '- `.narx` qalinligi `700`;',
          '- `h1` o‘lchami `2rem`;',
          '- `small` o‘lchami `0.875rem`;',
          '- `.kod em` kursivsiz (`normal`).',
        ),
        expectedBehavior: 'Kursiv izoh, qalin narx, 32px sarlavha va 14px kichik matn.',
        difficulty: 'EASY',
        starterFiles: site(
          `<h1>Kurs narxi</h1>
<p class="narx">240 000 so‘m</p>
<p class="izoh">Narxga barcha mashqlar kiradi.</p>
<p class="kod">Teg: <em>&lt;em&gt;</em></p>
<small>Chegirmalar alohida e’lon qilinadi.</small>`,
          TODO,
        ),
        checks: [
          style('italic', 'Izoh kursivda', '.izoh', 'font-style', 'italic'),
          style('bold', 'Narx qalin', '.narx', 'font-weight', '700'),
          style('h1', 'Sarlavha 2rem', 'h1', 'font-size', '32px'),
          style('small', 'Kichik matn 0.875rem', 'small', 'font-size', '14px'),
          style('em', '`.kod em` kursivsiz', '.kod em', 'font-style', 'normal'),
        ],
      },
    },
    {
      slug: 'web-fonts',
      title: 'Veb-shriftlar',
      exercise: {
        title: 'O‘z shriftimizni e’lon qilish',
        description: '`@font-face` bilan shriftga nom berish.',
        instructions: md(
          '1. `@font-face` yozing: nomi `Sarlavha`, manba `local("Georgia")`, `font-display: swap`.',
          '2. `h1` uchun `font-family: Sarlavha, Georgia, serif`.',
          '3. `body` uchun `font-family: system-ui, sans-serif`.',
          '',
          'Sandbox’da tashqi shrift fayllari bloklangan, shuning uchun `url()` emas, `local()` ishlatamiz.',
        ),
        expectedBehavior: 'Sarlavha serif shriftda, qolgan matn tizim shriftida.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<h1>Veb-shriftlar</h1>
<p>Shriftga o‘zimiz nom beramiz.</p>`,
          TODO,
        ),
        checks: [
          style(
            'h1',
            'Sarlavha `Sarlavha` shriftida',
            'h1',
            'font-family',
            'Sarlavha, Georgia, serif',
          ),
          style('body', 'Matn tizim shriftida', 'body', 'font-family', 'system-ui, sans-serif'),
          style('p', 'Paragraf shriftni meros oladi', 'p', 'font-family', 'system-ui, sans-serif'),
        ],
      },
    },
    {
      slug: 'font-shorthand',
      title: '`font` qisqa yozuvi',
      exercise: {
        title: 'Buzilgan qisqa yozuvni tuzatish',
        description: '`font` ning tartib qoidalari va `font: inherit`.',
        instructions: md(
          '1. `.iqtibos` dagi `font` qatori ishlamayapti (tartib noto‘g‘ri). Uni `italic 1.125rem/1.6 Georgia, serif` qiling.',
          '2. `button` va `input` ga `font: inherit` bering.',
        ),
        expectedBehavior: 'Iqtibos kursiv serif shriftda, forma elementlari sahifa shriftida.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<blockquote class="iqtibos">O‘qish — fikrlashni o‘rganish.</blockquote>
<input placeholder="Ismingiz">
<button>Yuborish</button>`,
          `body {
  font: 16px/1.5 Arial, sans-serif;
}

.iqtibos {
  font: Georgia 1.125rem italic;
}`,
        ),
        checks: [
          style('italic', 'Iqtibos kursiv', '.iqtibos', 'font-style', 'italic'),
          style('size', 'Iqtibos 1.125rem', '.iqtibos', 'font-size', '18px'),
          style('family', 'Iqtibos Georgia, serif', '.iqtibos', 'font-family', 'Georgia, serif'),
          style('button', 'Tugma 16px', 'button', 'font-size', '16px'),
          style('input', 'Maydon sahifa shriftida', 'input', 'font-family', 'Arial, sans-serif'),
        ],
      },
    },
    {
      slug: 'icons',
      title: 'Ikonkalar',
      exercise: {
        title: 'SVG ikonkalar',
        description: '`currentColor`, `em` o‘lcham va matnsiz tugmaning nomi.',
        instructions: md(
          '1. `.ikonka`: `width` va `height` `1.25em`, `fill: currentColor`.',
          '2. `.tugma` rangi `#0071dc`, `:hover` da `#0e1133` — ikonka ham birga o‘zgarsin.',
          '3. `index.html` dagi matnsiz `.qidiruv` tugmasiga `aria-label="Qidirish"` qo‘shing.',
        ),
        expectedBehavior:
          'Ikonkalar matn o‘lchamida va rangida, hover’da rang o‘zgaradi, qidiruv tugmasining nomi bor.',
        difficulty: 'MEDIUM',
        starterFiles: site(
          `<a class="tugma" href="#">${SVG_HOME} Bosh sahifa</a>
<button class="qidiruv">${SVG_SEARCH}</button>`,
          `.tugma {
  font-size: 16px;
  text-decoration: none;
}`,
        ),
        checks: [
          style('fill', 'Ikonka matn rangida', '.tugma .ikonka', 'fill', '#0071dc'),
          style('size', 'Ikonka 1.25em', '.tugma .ikonka', 'width', '20px'),
          after(
            [{ type: 'hover', selector: '.tugma' }],
            style('hover', 'Hover’da ikonka ham o‘zgaradi', '.tugma .ikonka', 'fill', '#0e1133'),
          ),
          attr('label', 'Qidiruv tugmasining nomi bor', '.qidiruv', 'aria-label', 'Qidirish', {
            hint: 'Matnsiz tugmani ekran o‘quvchi faqat “tugma” deb o‘qiydi.',
          }),
        ],
      },
      quiz: quiz('4-modul testi: Matn va shriftlar', [
        q(
          'q1',
          '`line-height` uchun qaysi yozuv bola elementlarga eng to‘g‘ri meros bo‘ladi?',
          ['`1.6`', '`1.6em`', '`160%`', '`25px`'],
          [0],
        ),
        q(
          'q2',
          '`font-family` ro‘yxatining oxirida nima bo‘lishi kerak?',
          ['Umumiy oila (`sans-serif` kabi)', 'Eng chiroyli shrift', '`inherit`', 'Hech narsa'],
          [0],
        ),
        q(
          'q3',
          '`font` qisqa yozuvida qaysi qismlar majburiy?',
          ['`font-size`', '`font-family`', '`font-weight`', '`line-height`'],
          [0, 1],
        ),
        q(
          'q4',
          'Foydalanuvchining shrift sozlamasini hurmat qiladigan birlik?',
          ['`rem`', '`px`', '`pt`', '`cm`'],
          [0],
        ),
        q(
          'q5',
          'SVG ikonka matn rangini olishi uchun nima yoziladi?',
          [
            '`fill: currentColor`',
            '`color: inherit`',
            '`fill: auto`',
            '`background: currentColor`',
          ],
          [0],
        ),
      ]),
    },
  ],
};
