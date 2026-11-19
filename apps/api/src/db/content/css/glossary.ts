import type { GlossaryDef } from '../helpers';

/** CSS course glossary. Each term points to the lesson that introduces it. */
export const CSS_GLOSSARY: GlossaryDef[] = [
  // Basics
  {
    term: 'CSS',
    definition:
      'Cascading Style Sheets — veb-sahifaning ko‘rinishini (rang, shrift, joylashuv, animatsiya) belgilaydigan til. Mazmun HTML’da, ko‘rinish CSS’da.',
    lesson: 'introduction',
  },
  {
    term: 'Kaskad',
    definition:
      'Bitta elementga tegishli bir nechta qoidaning ma’lum tartibda birlashishi: muhimlik (`!important`), maxsuslik va yozilish tartibi.',
    lesson: 'introduction',
  },
  {
    term: 'Qoida',
    definition: 'Selektor va jingalak qavs ichidagi e’lonlar to‘plami.',
    example: 'p { color: navy; }',
    lesson: 'syntax',
  },
  {
    term: 'E’lon',
    definition: '`xususiyat: qiymat;` juftligi. Har bir e’lon nuqtali vergul bilan tugaydi.',
    example: 'color: navy;',
    lesson: 'syntax',
  },
  {
    term: 'Selektor',
    definition:
      'Qoida qaysi elementlarga tegishli ekanini ko‘rsatadigan ifoda: teg, klass, id va boshqalar.',
    lesson: 'selectors',
  },
  {
    term: 'Klass selektori',
    definition:
      'Nuqta bilan boshlanadi va `class` atributida shu nom bor barcha elementlarni tanlaydi. Bezak uchun asosiy vosita.',
    example: '.karta { padding: 16px; }',
    lesson: 'selectors',
  },
  {
    term: 'ID selektori',
    definition:
      '`#` bilan boshlanadi va `id` si mos bitta elementni tanlaydi. Maxsusligi juda yuqori, shuning uchun bezakda kam ishlatiladi.',
    example: '#bosh { margin: 0; }',
    lesson: 'selectors',
  },
  {
    term: 'Tashqi uslublar fayli',
    definition:
      'Alohida `.css` fayl; `<head>` ichida `<link rel="stylesheet">` bilan ulanadi va butun saytga xizmat qiladi.',
    example: '<link rel="stylesheet" href="style.css">',
    lesson: 'howto',
  },
  {
    term: 'CSS izohi',
    definition: '`/* … */` orasidagi matn; brauzer uni o‘qimaydi. `//` CSS’da izoh emas.',
    example: '/* Sarlavhalar */',
    lesson: 'comments',
  },
  {
    term: 'DevTools',
    definition:
      'Brauzerning dasturchi vositalari (F12). “Styles” bo‘limida qaysi qoida ishlagani va qaysi biri ustidan chizilgani ko‘rinadi.',
    lesson: 'errors',
  },

  // Colors and backgrounds
  {
    term: 'RGB',
    definition: 'Rangni qizil, yashil va ko‘k ulushlari (0–255) bilan yozish usuli.',
    example: 'color: rgb(0 113 220);',
    lesson: 'rgb',
  },
  {
    term: 'Alfa kanal',
    definition: 'Rangning shaffoflik ulushi: 0 — butunlay shaffof, 1 — to‘liq ko‘rinadi.',
    example: 'background: rgb(0 0 0 / 0.5);',
    lesson: 'rgb',
  },
  {
    term: 'HEX',
    definition:
      'Rangni `#RRGGBB` ko‘rinishida o‘n oltilik sanoqda yozish. Har juftlik bir xil bo‘lsa, qisqa `#RGB` yozuvi bor.',
    example: 'color: #0071dc;',
    lesson: 'hex',
  },
  {
    term: 'HSL',
    definition:
      'Rangni tus (0–360), to‘yinganlik va yorqinlik bilan yozish. Bitta rangning och va to‘q variantlarini olish qulay.',
    example: 'color: hsl(210 100% 43%);',
    lesson: 'hsl',
  },
  {
    term: 'currentColor',
    definition:
      'Elementning joriy `color` qiymatini anglatuvchi kalit so‘z — chegara, soya va ikonkaga matn rangini uzatadi.',
    example: 'border: 2px solid currentColor;',
    lesson: 'color-keywords',
  },
  {
    term: 'inherit',
    definition: 'Xususiyat qiymatini ota elementdan olishga majburlaydigan kalit so‘z.',
    example: 'button { font: inherit; }',
    lesson: 'color-keywords',
  },
  {
    term: 'Kontrast',
    definition:
      'Matn va fon ranglari orasidagi farq. Yetarli kontrast (WCAG bo‘yicha oddiy matnda kamida 4,5:1) matnni hamma o‘qiy olishi uchun kerak.',
    lesson: 'colors',
  },
  {
    term: 'background-size',
    definition:
      'Fon rasmining o‘lchami. `cover` — maydonni to‘liq qoplaydi (kesilishi mumkin), `contain` — rasmni to‘liq ko‘rsatadi.',
    example: 'background-size: cover;',
    lesson: 'background-size',
  },
  {
    term: 'background-attachment',
    definition:
      'Fon sahifa bilan siljishini belgilaydi: `scroll`, `fixed` (ekranga mahkam) yoki `local`.',
    lesson: 'background-attachment',
  },
  {
    term: 'Gradient',
    definition:
      'Ranglarning silliq o‘tishi; rasm turi sifatida `background-image` ga yoziladi (`linear-gradient`, `radial-gradient`, `conic-gradient`).',
    example: 'background: linear-gradient(to right, #0071dc, #f5a623);',
    lesson: 'linear-gradients',
  },
  {
    term: 'conic-gradient',
    definition:
      'Ranglarni markaz atrofida aylana bo‘ylab taqsimlaydigan gradient — doiraviy diagrammalar uchun.',
    example: 'background: conic-gradient(teal 0 60%, gold 0);',
    lesson: 'radial-gradients',
  },

  // Box model
  {
    term: 'Quti modeli',
    definition: 'Har bir element to‘rt qatlamli quti: kontent → padding → border → margin.',
    lesson: 'box-model',
  },
  {
    term: 'padding',
    definition:
      'Kontent va chegara orasidagi ichki bo‘shliq. Element fonini oladi, manfiy bo‘lmaydi.',
    example: 'padding: 8px 16px;',
    lesson: 'padding',
  },
  {
    term: 'margin',
    definition:
      'Chegaradan tashqaridagi shaffof bo‘shliq. Qisqa yozuv soat mili bo‘yicha: yuqori, o‘ng, past, chap.',
    example: 'margin: 0 auto;',
    lesson: 'margins',
  },
  {
    term: 'Margin qo‘shilishi',
    definition:
      'Ustma-ust turgan bloklarning vertikal marginlari qo‘shilib, kattarog‘i qolishi (margin collapse). Flex va grid ichida bo‘lmaydi.',
    lesson: 'margin-collapse',
  },
  {
    term: 'border',
    definition:
      'Element chegarasi: qalinlik, uslub va rang. Uslub (`solid`, `dashed` …) berilmasa ko‘rinmaydi.',
    example: 'border: 2px solid #0071dc;',
    lesson: 'borders',
  },
  {
    term: 'border-radius',
    definition: 'Burchaklarni yumaloqlaydi; kvadratga `50%` berilsa doira bo‘ladi.',
    example: 'border-radius: 12px;',
    lesson: 'rounded-borders',
  },
  {
    term: 'box-sizing',
    definition:
      '`width` nimani o‘lchashini belgilaydi. `border-box` da padding va chegara kenglik ichida hisoblanadi.',
    example: '*, *::before, *::after { box-sizing: border-box; }',
    lesson: 'box-sizing',
  },
  {
    term: 'outline',
    definition:
      'Chegaradan tashqarida chiziladigan va joy egallamaydigan kontur; fokusni ko‘rsatish uchun ishlatiladi.',
    example: 'outline: 3px solid #f5a623;',
    lesson: 'outline',
  },
  {
    term: 'max-width',
    definition: 'Elementning eng katta kengligi; kichik ekranda torayishga ruxsat beradi.',
    example: 'max-width: 65ch;',
    lesson: 'max-width',
  },
  {
    term: 'box-shadow',
    definition: 'Elementga soya: x, y, xiralik, yoyilish va rang; `inset` — ichki soya.',
    example: 'box-shadow: 0 4px 12px rgb(0 0 0 / .15);',
    lesson: 'box-shadow',
  },

  // Text and fonts
  {
    term: 'line-height',
    definition: 'Qatorlar balandligi. Birliksiz qiymat (`1.5`–`1.7`) eng qulay.',
    example: 'line-height: 1.6;',
    lesson: 'text',
  },
  {
    term: 'text-decoration',
    definition: 'Matn chizig‘i (tagchiziq, ustchiziq, o‘chirish chizig‘i) va uning uslubi.',
    example: 'text-decoration: none;',
    lesson: 'text-decoration',
  },
  {
    term: 'text-transform',
    definition:
      'Harflar ko‘rinishini o‘zgartiradi (`uppercase`, `capitalize`); HTML’dagi asl matn o‘zgarmaydi.',
    lesson: 'text-transform',
  },
  {
    term: 'text-shadow',
    definition: 'Matn soyasi: x, y, xiralik, rang. Bir nechta soya vergul bilan yoziladi.',
    example: 'text-shadow: 0 1px 2px rgb(0 0 0 / .4);',
    lesson: 'text-shadow',
  },
  {
    term: 'font-family',
    definition:
      'Shriftlar ro‘yxati; birinchi mavjudi ishlatiladi. Oxirida umumiy oila bo‘lishi shart.',
    example: 'font-family: Inter, system-ui, sans-serif;',
    lesson: 'fonts',
  },
  {
    term: 'Umumiy shrift oilasi',
    definition:
      '`serif`, `sans-serif`, `monospace` kabi zaxira oila — aniq shrift topilmasa brauzer shu oiladan oladi.',
    lesson: 'fonts',
  },
  {
    term: '@font-face',
    definition: 'Veb-shriftga nom beradi va uning faylini ulaydi (WOFF2).',
    example: '@font-face { font-family: "Mening"; src: url(m.woff2) format("woff2"); }',
    lesson: 'web-fonts',
  },
  {
    term: 'font-display',
    definition:
      'Veb-shrift yuklanguncha matn qanday ko‘rsatilishi. `swap` — zaxira shriftda darhol ko‘rsatadi.',
    lesson: 'web-fonts',
  },
  {
    term: 'font-weight',
    definition: 'Shrift qalinligi: 100–900, `400` — oddiy, `700` — qalin.',
    lesson: 'font-style',
  },
  {
    term: 'rem',
    definition:
      'Ildiz (`html`) shrift o‘lchamiga nisbatan birlik. Foydalanuvchi sozlamasini hurmat qiladi.',
    example: 'font-size: 1.25rem;',
    lesson: 'font-style',
  },
  {
    term: 'em',
    definition:
      'Elementning o‘z (yoki ota) shrift o‘lchamiga nisbatan birlik; ichma-ich elementlarda to‘planadi.',
    lesson: 'font-style',
  },

  // Lists, tables, display, layout basics
  {
    term: '::marker',
    definition:
      'Ro‘yxat bandining belgisi (nuqta yoki raqam); rangi va shriftini o‘zgartirish mumkin.',
    example: 'li::marker { color: crimson; }',
    lesson: 'lists',
  },
  {
    term: 'border-collapse',
    definition: 'Jadval kataklari chegaralarini birlashtiradi (`collapse`) yoki alohida qoldiradi.',
    example: 'table { border-collapse: collapse; }',
    lesson: 'tables',
  },
  {
    term: 'display',
    definition:
      'Element qanday joylashishini belgilaydi: `block`, `inline`, `inline-block`, `flex`, `grid`, `none`.',
    lesson: 'display',
  },
  {
    term: 'Blok element',
    definition:
      'Yangi qatordan boshlanadi va mavjud kenglikni to‘liq egallaydi (`div`, `p`, `h1`).',
    lesson: 'display',
  },
  {
    term: 'Qator elementi',
    definition:
      'Matn qatori ichida turadi, faqat kerakli kenglikni oladi; `width` va `height` ishlamaydi (`span`, `a`).',
    lesson: 'display',
  },
  {
    term: 'inline-block',
    definition: 'Qatorda turadi, lekin `width`, `height` va padding blokdek ishlaydi.',
    lesson: 'inline-block',
  },
  {
    term: 'position',
    definition: 'Joylashish usuli: `static`, `relative`, `absolute`, `fixed`, `sticky`.',
    lesson: 'position',
  },
  {
    term: 'sticky',
    definition:
      'Aylantirilganda belgilangan nuqtaga (masalan, `top: 0`) yetgach yopishib qoladigan joylashuv.',
    example: 'header { position: sticky; top: 0; }',
    lesson: 'position',
  },
  {
    term: 'z-index',
    definition: 'Joylashtirilgan elementlarning qatlam tartibi: katta qiymat ustda.',
    lesson: 'z-index',
  },
  {
    term: 'Qatlam konteksti',
    definition:
      'Ichidagi elementlar `z-index` i faqat o‘zaro solishtiriladigan guruh (stacking context). Bola otasining kontekstidan chiqa olmaydi.',
    lesson: 'z-index',
  },
  {
    term: 'overflow',
    definition: 'Sig‘magan kontent bilan nima qilish: `visible`, `hidden`, `scroll`, `auto`.',
    lesson: 'overflow',
  },
  {
    term: 'text-overflow',
    definition: 'Kesilgan bir qatorli matn oxiriga “…” qo‘yish (`ellipsis`).',
    example: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
    lesson: 'overflow',
  },
  {
    term: 'float',
    definition: 'Elementni chap yoki o‘ngga suzdirib, matnni uning atrofidan oqizadi.',
    lesson: 'float',
  },
  {
    term: 'flow-root',
    definition: 'Suzayotgan bolalarni o‘raydigan `display` qiymati — eski clearfix o‘rniga.',
    example: '.ota { display: flow-root; }',
    lesson: 'clear',
  },

  // Selectors
  {
    term: 'Kombinator',
    definition:
      'Selektorlar orasidagi munosabat belgisi: bo‘sh joy (avlod), `>` (bevosita bola), `+` va `~` (qo‘shnilar).',
    example: 'nav > ul',
    lesson: 'combinators',
  },
  {
    term: 'Psevdoklass',
    definition:
      'Elementning holati yoki o‘rni bo‘yicha tanlash: `:hover`, `:focus-visible`, `:nth-child()`.',
    example: 'a:hover { color: crimson; }',
    lesson: 'pseudo-classes',
  },
  {
    term: ':focus-visible',
    definition:
      'Element klaviatura bilan fokus olganda ishlaydigan psevdoklass — fokus konturi uchun.',
    lesson: 'pseudo-classes',
  },
  {
    term: ':has()',
    definition: 'Ichida ma’lum element bor ota elementni tanlaydigan psevdoklass.',
    example: '.karta:has(img) { padding: 0; }',
    lesson: 'pseudo-classes',
  },
  {
    term: 'Psevdoelement',
    definition:
      'Elementning bir qismini yoki qo‘shimcha bezakni tanlash: `::before`, `::after`, `::first-letter`.',
    example: '.yangi::before { content: "★ "; }',
    lesson: 'pseudo-elements',
  },
  {
    term: 'Atribut selektori',
    definition:
      'Atribut bor yoki qiymati mos elementlarni tanlaydi: `[atr]`, `[atr="q"]`, `^=`, `$=`, `*=`.',
    example: 'a[href$=".pdf"]',
    lesson: 'attribute-selectors',
  },
  {
    term: 'Maxsuslik',
    definition:
      'Selektorning kuchi (ID, klass, teg sonlari). To‘qnashuvda maxsusligi yuqori qoida yutadi (specificity).',
    lesson: 'specificity',
  },
  {
    term: 'Meros',
    definition: 'Ba’zi xususiyatlarning (rang, shrift) ota elementdan bolalarga o‘tishi.',
    lesson: 'specificity',
  },
  {
    term: '!important',
    definition:
      'E’lonni oddiy qoidalarning hammasidan kuchli qiladi. Faqat ongli istisno sifatida.',
    lesson: 'important',
  },

  // Components
  {
    term: 'Hover',
    definition:
      'Sichqoncha element ustida turgan holat (`:hover`). Sensorli ekranlarda yo‘q, shuning uchun fokus uslubi ham kerak.',
    lesson: 'links',
  },
  {
    term: 'aria-current',
    definition:
      'Joriy sahifa yoki bandni ekran o‘quvchiga bildiradigan atribut; CSS’da uslub uchun ham qulay.',
    example: 'a[aria-current="page"] { font-weight: 700; }',
    lesson: 'navbar-vertical',
  },
  {
    term: ':focus-within',
    definition:
      'Ichidagi biror element fokusda bo‘lganda ota elementga ishlaydigan psevdoklass — ochiluvchi menyu uchun.',
    lesson: 'dropdowns',
  },
  {
    term: 'pointer-events',
    definition:
      'Element sichqoncha hodisalarini qabul qilishini boshqaradi; `none` — bosish orqasidagi elementga o‘tadi.',
    lesson: 'tooltips',
  },
  {
    term: 'object-fit',
    definition: 'Rasm yoki video o‘z ramkasini qanday to‘ldirishi: `cover`, `contain`, `fill`.',
    example: 'img { object-fit: cover; }',
    lesson: 'object-fit',
  },
  {
    term: 'Sprayt',
    definition:
      'Bir nechta kichik rasm bitta faylda; kerakli qism `background-position` bilan ko‘rsatiladi.',
    lesson: 'image-sprites',
  },
  {
    term: 'filter',
    definition: 'Elementga grafik effekt: `grayscale()`, `blur()`, `brightness()`.',
    example: 'img { filter: grayscale(1); }',
    lesson: 'image-styling',
  },
  {
    term: 'accent-color',
    definition: 'Checkbox, radio va progress kabi forma elementlarining asosiy rangi.',
    example: 'input { accent-color: seagreen; }',
    lesson: 'forms',
  },
  {
    term: 'CSS hisoblagichi',
    definition: '`counter-reset`, `counter-increment` va `counter()` bilan avtomatik raqamlash.',
    lesson: 'counters',
  },

  // Units, functions, effects
  {
    term: 'vw va vh',
    definition: 'Ko‘rish oynasi kengligi va balandligining 1% i.',
    lesson: 'units',
  },
  {
    term: 'calc()',
    definition: 'Har xil birliklarni aralashtirib hisoblash; `+` va `-` atrofida bo‘sh joy shart.',
    example: 'width: calc(100% - 2rem);',
    lesson: 'math-functions',
  },
  {
    term: 'clamp()',
    definition: 'Qiymatni pastki va yuqori chegara orasida ushlaydi: `clamp(min, ideal, max)`.',
    example: 'font-size: clamp(1rem, 4vw, 2rem);',
    lesson: 'math-functions',
  },
  {
    term: 'opacity',
    definition:
      'Butun elementning shaffofligi (0–1). Element ko‘rinmasa ham joy egallaydi va bosiladi.',
    lesson: 'opacity',
  },
  {
    term: 'clip-path',
    definition: 'Elementni shakl (`circle`, `polygon`, `inset`) bo‘yicha kesadi.',
    example: 'clip-path: circle(50%);',
    lesson: 'masking',
  },
  {
    term: 'transform',
    definition:
      'Elementni siljitish, aylantirish, kattalashtirish yoki qiyshaytirish; maketdagi joyi o‘zgarmaydi.',
    example: 'transform: translateY(-4px) scale(1.05);',
    lesson: 'transforms-2d',
  },
  {
    term: 'transform-origin',
    definition: 'Aylanish va kattalashish nuqtasi; standart holda element markazi.',
    lesson: 'transforms-2d',
  },
  {
    term: 'perspective',
    definition: '3D transformatsiyalar chuqurligi — kuzatuvchidan masofa. Ota elementga beriladi.',
    lesson: 'transforms-3d',
  },
  {
    term: 'transition',
    definition:
      'Xususiyat qiymati o‘zgarganda silliq o‘tish; elementning boshlang‘ich holatiga yoziladi.',
    example: 'transition: transform .2s ease;',
    lesson: 'transitions',
  },
  {
    term: '@keyframes',
    definition: 'Animatsiya kadrlarini (`from`/`to` yoki foizlar) e’lon qiladi.',
    example: '@keyframes aylan { to { transform: rotate(360deg); } }',
    lesson: 'animations',
  },
  {
    term: 'prefers-reduced-motion',
    definition:
      'Foydalanuvchi tizimda harakatni kamaytirishni so‘raganini bildiruvchi media shart.',
    example: '@media (prefers-reduced-motion: reduce) { * { animation: none; } }',
    lesson: 'animations',
  },
  {
    term: 'CSS o‘zgaruvchisi',
    definition:
      '`--nom: qiymat` bilan e’lon qilinadigan va `var(--nom)` bilan ishlatiladigan maxsus xususiyat.',
    example: ':root { --asosiy: #0071dc; }',
    lesson: 'variables',
  },
  {
    term: '@property',
    definition:
      'CSS o‘zgaruvchisiga tur, boshlang‘ich qiymat va meros qoidasini beradi — uni animatsiya qilish mumkin bo‘ladi.',
    lesson: 'at-property',
  },
  {
    term: '@supports',
    definition:
      'Brauzer xususiyatni qo‘llab-quvvatlasa qoidalarni qo‘llaydi — progressiv yaxshilash uchun.',
    example: '@supports (display: grid) { … }',
    lesson: 'supports',
  },
  {
    term: 'cursor',
    definition: 'Sichqoncha ko‘rsatkichi shakli: `pointer`, `not-allowed`, `help` va boshqalar.',
    lesson: 'user-interface',
  },

  // Flexbox and Grid
  {
    term: 'Flexbox',
    definition: 'Elementlarni bir o‘q (qator yoki ustun) bo‘ylab joylashtiradigan maket tizimi.',
    example: '.konteyner { display: flex; gap: 16px; }',
    lesson: 'flexbox',
  },
  {
    term: 'Asosiy o‘q',
    definition:
      'Flex elementlar tiziladigan yo‘nalish (main axis); `justify-content` shu o‘q bo‘ylab tekislaydi.',
    lesson: 'flexbox',
  },
  {
    term: 'Kesuvchi o‘q',
    definition:
      'Asosiy o‘qqa perpendikulyar yo‘nalish (cross axis); `align-items` shu o‘q bo‘ylab tekislaydi.',
    lesson: 'flexbox',
  },
  {
    term: 'gap',
    definition: 'Flex yoki grid elementlari orasidagi masofa.',
    example: 'gap: 1rem;',
    lesson: 'flex-container',
  },
  {
    term: 'flex-wrap',
    definition: 'Sig‘magan flex elementlarni keyingi qatorga o‘tkazish (`wrap`).',
    lesson: 'flex-container',
  },
  {
    term: 'flex',
    definition:
      '`flex-grow`, `flex-shrink` va `flex-basis` ning qisqa yozuvi; `flex: 1` — teng ulush.',
    example: 'flex: 1 1 240px;',
    lesson: 'flex-items',
  },
  {
    term: 'Grid',
    definition: 'Qatorlar va ustunlardan iborat ikki o‘lchamli maket tizimi.',
    example: '.tor { display: grid; grid-template-columns: 1fr 2fr; }',
    lesson: 'grid-intro',
  },
  {
    term: 'fr',
    definition: 'Grid’dagi bo‘sh joyning ulushi.',
    lesson: 'grid-intro',
  },
  {
    term: 'minmax()',
    definition: 'Grid yo‘lining eng kichik va eng katta o‘lchami.',
    example: 'repeat(auto-fill, minmax(200px, 1fr))',
    lesson: 'grid-container',
  },
  {
    term: 'auto-fill',
    definition:
      '`repeat()` ichida: sig‘adigan miqdorda ustun yaratish — media so‘rovsiz moslashuvchan to‘r.',
    lesson: 'grid-container',
  },
  {
    term: 'grid-template-areas',
    definition: 'Maketni hudud nomlari bilan “chizish”; elementga `grid-area: nom` beriladi.',
    example: 'grid-template-areas: "header header" "sidebar main";',
    lesson: 'grid-layout',
  },

  // Responsive
  {
    term: 'Moslashuvchan dizayn',
    definition:
      'Bitta sahifaning har xil ekran o‘lchamiga moslashishi: suyuq maket, moslashuvchan media va media so‘rovlar.',
    lesson: 'rwd-intro',
  },
  {
    term: 'Mobil birinchi',
    definition:
      'Avval kichik ekran uchun oddiy uslub yozib, katta ekranlar uchun `min-width` media so‘rovlari bilan qo‘shish.',
    lesson: 'rwd-intro',
  },
  {
    term: 'Viewport',
    definition:
      'Ko‘rish oynasi. Mobil qurilmada to‘g‘ri o‘lcham uchun `<meta name="viewport" content="width=device-width, initial-scale=1">`.',
    lesson: 'rwd-viewport',
  },
  {
    term: 'Media so‘rov',
    definition:
      'Shart bajarilganda (ekran kengligi, rang sxemasi, chop etish) qo‘llanadigan qoidalar bloki.',
    example: '@media (min-width: 768px) { … }',
    lesson: 'media-queries',
  },
  {
    term: 'Tanaffus nuqtasi',
    definition:
      'Maket o‘zgaradigan ekran kengligi (breakpoint). Uni qurilma emas, kontent belgilaydi.',
    lesson: 'media-queries',
  },
  {
    term: 'srcset',
    definition: 'Rasmning bir nechta o‘lchamdagi fayllari; brauzer ekranga mosini o‘zi tanlaydi.',
    lesson: 'rwd-images',
  },
  {
    term: 'aspect-ratio',
    definition: 'Elementning eni va bo‘yi nisbati.',
    example: 'aspect-ratio: 16 / 9;',
    lesson: 'rwd-videos',
  },
  {
    term: 'Utility klass',
    definition:
      'Bitta xususiyatni beradigan kichik klass (masalan, `.mt-4`) — utility freymvorklarning asosi.',
    lesson: 'rwd-frameworks',
  },
];
