import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** "Moslashuvchan dizayn" course glossary. Each term points to the lesson that introduces it. */
export const RWD_GLOSSARY: GlossaryDef[] = [
  t(
    'Moslashuvchan dizayn',
    'Bitta sahifaning har xil ekran o‘lchamiga moslashishi: suyuq maket, moslashuvchan media va media so‘rovlar.',
    'nima',
  ),
  t(
    'Suyuq maket',
    'Kengliklar piksel emas, foiz, `fr` yoki `min()` bilan beriladigan maket — ekran bilan birga cho‘ziladi.',
    'nima',
  ),
  t(
    'Viewport',
    'Brauzerning ko‘rinadigan maydoni. Mobil qurilmada to‘g‘ri o‘lcham uchun meta teg kerak.',
    'viewport',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
  ),
  t(
    'CSS piksel',
    'Brauzer o‘lchov birligi; zich ekranlarda bitta CSS piksel bir nechta qurilma pikselidan iborat.',
    'viewport',
  ),
  t(
    'Bosish maydoni',
    'Barmoq bilan aniq bosish uchun element kamida taxminan 44×44 CSS piksel bo‘lishi kerak.',
    'viewport',
  ),
  t(
    'Avval mobil',
    'Asosiy uslub telefon uchun yoziladi, kattaroq ekranlar `min-width` media so‘rovlari bilan qo‘shiladi (mobile first).',
    'avval-mobil',
  ),
  t(
    'rem',
    'Ildiz shrift o‘lchamiga nisbiy birlik; foydalanuvchi shrift sozlamasini hurmat qiladi.',
    'birliklar',
  ),
  t('vw', 'Ko‘rish oynasi kengligining 1% i.', 'birliklar'),
  t(
    'dvh',
    'Mobil brauzer panellarini hisobga oladigan dinamik ekran balandligi birligi.',
    'birliklar',
    'min-height: 100dvh;',
  ),
  t(
    'Tanaffus nuqtasi',
    'Maket o‘zgaradigan kenglik (breakpoint); uni qurilma emas, kontent belgilaydi.',
    'tanaffus-nuqtalari',
  ),
  t(
    'Media so‘rov',
    'Shart bajarilganda qo‘llanadigan CSS bloki: kenglik, yo‘nalish, rang sxemasi, chop etish.',
    'sorov-sintaksisi',
    '@media (min-width: 40em) { … }',
  ),
  t(
    'Diapazon sintaksisi',
    'Media so‘rovni taqqoslash belgilari bilan yozish: `(600px <= width <= 900px)`.',
    'sorov-sintaksisi',
  ),
  t(
    'hover media xususiyati',
    '`(hover: hover)` — qurilmada sichqoncha kabi kursor bor yoki yo‘qligini tekshiradi.',
    'media-xususiyatlari',
  ),
  t(
    'prefers-reduced-motion',
    'Foydalanuvchi tizimda harakatni kamaytirishni so‘raganini bildiruvchi media shart.',
    'media-xususiyatlari',
  ),
  t(
    'prefers-color-scheme',
    'Foydalanuvchining yorug‘ yoki qorong‘i mavzu tanlovini bildiruvchi media shart.',
    'media-xususiyatlari',
  ),
  t(
    'clamp()',
    'Qiymatni pastki va yuqori chegara orasida ushlaydi: `clamp(min, ideal, max)`.',
    'suyuq-olchamlar',
    'font-size: clamp(1rem, 0.9rem + 1vw, 1.5rem);',
  ),
  t(
    'min()',
    'Bir nechta qiymatdan eng kichigini oladi — `width: min(100%, 600px)`.',
    'suyuq-olchamlar',
  ),
  t(
    'box-sizing',
    '`border-box` qiymatida padding va chegara kenglik ichida hisoblanadi.',
    'ustunlar',
  ),
  t('flex-wrap', 'Sig‘magan flex elementlarni keyingi qatorga o‘tkazadi.', 'flex-orash'),
  t(
    'flex-basis',
    'Flex elementning boshlang‘ich o‘lchami; `flex: 1 1 200px` dagi uchinchi qiymat.',
    'flex-orash',
  ),
  t(
    'auto-fit',
    '`repeat(auto-fit, minmax(…))` — sig‘ganicha ustun, bo‘sh ustunlarni yig‘ib, elementlarni cho‘zadi.',
    'grid-auto-fit',
  ),
  t(
    'auto-fill',
    '`repeat(auto-fill, minmax(…))` — sig‘ganicha ustun, bo‘sh ustunlarni saqlaydi.',
    'grid-auto-fit',
  ),
  t('minmax()', 'Grid yo‘lining eng kichik va eng katta o‘lchami.', 'grid-auto-fit'),
  t(
    'grid-template-areas',
    'Maketni nomlangan hududlar bilan “chizish”; media so‘rovda faqat xarita almashtiriladi.',
    'maket-hududlari',
  ),
  t(
    'Muqaddas grail',
    'Header, footer va o‘rtada uch ustun (menyu, kontent, yon panel) — klassik maket.',
    'muqaddas-grail',
  ),
  t(
    'Sticky footer',
    'Kontent kam bo‘lsa ham footer ekran pastida turadigan maket.',
    'muqaddas-grail',
  ),
  t(
    'Konteyner so‘rovi',
    '`@container` — ekran emas, ota konteyner kengligiga qarab uslub berish.',
    'konteyner-sorovlari',
    '.ota { container-type: inline-size; }',
  ),
  t(
    'container-type',
    'Elementni konteyner so‘rovlari uchun o‘lchanadigan qiladi (`inline-size`).',
    'konteyner-sorovlari',
  ),
  t(
    'Suyuq shrift',
    'Shrift o‘lchamining ekran bilan silliq o‘zgarishi (`clamp()` va `vw` bilan).',
    'tipografiya',
  ),
  t(
    'Qator uzunligi',
    'Bir qatordagi belgilar soni; o‘qish uchun 45–75 belgi qulay (`max-width: 65ch`).',
    'tipografiya',
  ),
  t(
    'aspect-ratio',
    'Elementning eni va bo‘yi nisbati; rasm va videolar uchun joyni oldindan ajratadi.',
    'rasmlar',
  ),
  t(
    'object-fit',
    'Rasm o‘z ramkasini qanday to‘ldirishi: `cover` — kesib to‘ldiradi, `contain` — to‘liq ko‘rsatadi.',
    'rasmlar',
  ),
  t(
    'CLS',
    'Cumulative Layout Shift — sahifa yuklanayotganda elementlarning sakrashi; rasmlarga `width`/`height` berish uni kamaytiradi.',
    'rasmlar',
  ),
  t(
    'srcset',
    'Rasmning bir nechta o‘lchamdagi fayllari ro‘yxati; brauzer mosini tanlaydi.',
    'srcset',
    '<img srcset="r-400.jpg 400w, r-800.jpg 800w" sizes="100vw" src="r-800.jpg" alt="">',
  ),
  t(
    'sizes',
    'Rasm sahifada qancha kenglik egallashini brauzerga aytadigan atribut (`srcset` bilan).',
    'srcset',
  ),
  t(
    'loading="lazy"',
    'Rasm ekranga yaqinlashgandagina yuklanadi; birinchi ekrandagi rasmlarga yozilmaydi.',
    'srcset',
  ),
  t(
    'Art direction',
    'Ekranga qarab rasmning boshqacha kesimini ko‘rsatish — `<picture>` va `<source media>` bilan.',
    'picture',
  ),
  t(
    '<picture>',
    'Bir nechta `<source>` dan mosini tanlab, oxirida `<img>` bilan zaxira beradigan element.',
    'picture',
  ),
  t(
    'aria-expanded',
    'Tugma boshqaradigan menyu ochiq yoki yopiqligini ekran o‘quvchiga bildiradi.',
    'navigatsiya',
  ),
  t(
    'Gamburger menyu',
    'Kichik ekranda navigatsiyani bitta tugma ortiga yashiradigan menyu.',
    'navigatsiya',
  ),
  t(
    'Visually hidden',
    'Matnni ko‘zdan yashirib, ekran o‘quvchiga qoldiradigan CSS usuli.',
    'yashirish',
  ),
  t(
    'inputmode',
    'Telefonda qaysi klaviatura chiqishini belgilaydigan atribut (`numeric`, `email` …).',
    'formalar',
  ),
  t(
    'autocomplete',
    'Brauzerga maydonni avtomatik to‘ldirish uchun ma’lumot turini aytadi (`email`, `tel`, `name`).',
    'formalar',
  ),
  t(
    '<dialog>',
    'Modal oyna uchun HTML elementi; `showModal()` bilan ochiladi, Esc bilan yopiladi.',
    'dialog',
  ),
  t(
    'Hero',
    'Sahifa yuqorisidagi asosiy blok: sarlavha, qisqa tavsif va asosiy harakat tugmasi.',
    'lending-bosh',
  ),
  t(
    'Gorizontal aylantirish',
    'Kontent ekrandan keng bo‘lganda chiqadigan nuqson; aybdor element topilib tuzatiladi.',
    'sinov',
  ),
];
