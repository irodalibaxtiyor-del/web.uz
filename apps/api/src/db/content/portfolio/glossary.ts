import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** "Portfolio" course glossary. Each term points to the lesson that introduces it. */
export const PORTFOLIO_GLOSSARY: GlossaryDef[] = [
  t(
    'Portfolio',
    'Ishlaringiz namunalari va ular haqidagi hikoyalar jamlangan shaxsiy sayt.',
    'portfolio-nima',
  ),
  t(
    'Langar havola',
    'Sahifa ichidagi bo‘limga o‘tuvchi havola: `href="#ishlar"`.',
    'portfolio-nima',
  ),
  t(
    'Dizayn tokenlari',
    'Rang, shrift va oraliqlar uchun nomlangan CSS o‘zgaruvchilari — shaxsiy uslubning asosi.',
    'portfolio-tokenlar',
  ),
  t(
    'Shrift juftligi',
    'Sarlavha va asosiy matn uchun bir-biriga mos ikki shrift.',
    'portfolio-tokenlar',
  ),
  t(
    'Skip link',
    'Klaviatura foydalanuvchisini menyudan o‘tkazib, asosiy kontentga olib boradigan yashirin havola.',
    'tuzilma',
    '<a class="skip" href="#asosiy">Asosiy kontentga o‘tish</a>',
  ),
  t(
    'scroll-behavior',
    '`smooth` qiymati ichki havolalarda silliq aylantirishni yoqadi.',
    'tuzilma',
  ),
  t(
    'scroll-margin-top',
    'Langarga o‘tilganda bo‘lim yopishqoq header ostida qolmasligi uchun yuqoridan joy.',
    'tuzilma',
  ),
  t(
    'position: sticky',
    'Aylantirilganda belgilangan nuqtada yopishib qoladigan joylashuv.',
    'sticky-nav',
  ),
  t(
    'backdrop-filter',
    'Element orqasidagi kontentni xiralashtiradi — shaffof header uchun.',
    'sticky-nav',
  ),
  t(
    'aria-current',
    'Menyudagi joriy sahifa yoki bo‘limni ekran o‘quvchiga bildiradi.',
    'aktiv-bolim',
  ),
  t(
    'IntersectionObserver',
    'Element ekranga kirganini kuzatadigan brauzer API’si — faol bo‘limni aniqlash uchun.',
    'aktiv-bolim',
  ),
  t(
    'aria-expanded',
    'Menyu tugmasi boshqaradigan blok ochiq yoki yopiqligini bildiradi.',
    'mobil-menyu',
  ),
  t(
    'Hodisa delegatsiyasi',
    'Bitta ishlovchini ota elementga qo‘yib, bosilgan bolani `event.target` dan aniqlash.',
    'mobil-menyu',
  ),
  t('Hero', 'Bosh ekran: ism, kim ekaningiz va asosiy harakat tugmasi.', 'hero'),
  t(
    'CTA',
    'Call to action — foydalanuvchini harakatga undovchi tugma yoki havola (“Ishlarim”, “Bog‘lanish”).',
    'hero',
  ),
  t('alt matni', 'Rasm mazmunini matn bilan aytadi; bezak rasmda bo‘sh (`alt=""`).', 'profil'),
  t(
    '<meter>',
    'Ma’lum oraliqdagi qiymatni (masalan, ko‘nikma darajasi) ko‘rsatuvchi element.',
    'konikmalar',
  ),
  t(
    'Vaqt chizig‘i',
    'Voqealarni xronologik tartibda ko‘rsatish; HTML’da `<ol>`, chiziq va nuqtalar `::before` bilan.',
    'vaqt-chizigi',
  ),
  t(
    'Psevdoelement',
    '`::before`/`::after` — HTML’ga qo‘shimcha teg qo‘shmasdan bezak chizish.',
    'vaqt-chizigi',
  ),
  t(
    'Loyiha kartasi',
    'Ish muqovasi, nomi va qisqa tavsifidan iborat bosiladigan karta.',
    'loyiha-kartalari',
  ),
  t(
    ':focus-within',
    'Ichidagi element fokusda bo‘lganda ota elementga ishlaydigan psevdoklass.',
    'loyiha-kartalari',
  ),
  t(
    'hidden atributi',
    'Elementni ko‘zdan ham, ekran o‘quvchidan ham yashiradi (`display: none` kabi).',
    'filtr',
  ),
  t(
    'aria-pressed',
    'Almashtiriladigan tugma bosilgan holatda ekanini bildiradi (masalan, filtr tugmasi).',
    'filtr',
  ),
  t('Lightbox', 'Rasmni sahifa ustida kattalashtirib ko‘rsatadigan oyna.', 'lightbox'),
  t(
    '<dialog>',
    'Modal oyna elementi; `showModal()` fonni bloklaydi va Esc bilan yopiladi.',
    'lightbox',
  ),
  t(
    'Case study',
    'Bitta loyiha haqidagi batafsil hikoya: muammo, rol, jarayon va natija.',
    'loyiha-sahifasi',
  ),
  t(
    'Tavsif ro‘yxati',
    '`<dl>`, `<dt>`, `<dd>` — “nomi: qiymati” juftliklari uchun HTML tuzilmasi.',
    'loyiha-sahifasi',
  ),
  t('Ijtimoiy isbot', 'Mijozlar fikrlari — ishingizga ishonchni oshiradi.', 'fikrlar'),
  t(
    '<blockquote>',
    'Uzun iqtibos elementi; muallif `<figure>` ichidagi `<figcaption>` da yoziladi.',
    'fikrlar',
  ),
  t(
    'Scroll snap',
    'Aylantirish elementlarga “yopishib” to‘xtashi: `scroll-snap-type` va `scroll-snap-align`.',
    'karusel',
  ),
  t(
    'rel="noopener"',
    'Yangi tabda ochilgan sahifaning sizning sahifangizga ta’sir qilishini to‘sadi.',
    'ijtimoiy',
  ),
  t(
    'Honeypot',
    'Odam ko‘rmaydigan, bot to‘ldiradigan yashirin maydon — spamdan himoya.',
    'aloqa-forma',
  ),
  t(
    'Mavzu rejimi',
    'Yorug‘ va qorong‘i ko‘rinish o‘rtasida tanlov; tokenlar `data-*` atributiga qarab almashadi.',
    'mavzu-rejimi',
  ),
  t(
    'localStorage',
    'Brauzerda saqlanadigan kalit–qiymat ombori — tanlangan mavzuni eslab qolish uchun.',
    'mavzu-rejimi',
  ),
  t(
    'Xavfsiz hudud',
    'Telefon ekranining kesik va pastki chiziq egallagan joyi; `env(safe-area-inset-*)` bilan hisobga olinadi.',
    'yuqoriga',
  ),
  t(
    'Open Graph',
    'Sahifa ijtimoiy tarmoqda ulashilganda ko‘rinadigan sarlavha, tavsif va rasm teglari (`og:*`).',
    'seo-meta',
  ),
  t('Meta tavsif', '`<meta name="description">` — qidiruv natijasidagi qisqa matn.', 'seo-meta'),
  t('Favicon', 'Brauzer tabidagi kichik sayt belgisi.', 'seo-meta'),
  t(
    'Lighthouse',
    'Sahifa tezligi, qulayligi va SEO’sini o‘lchaydigan brauzer vositasi.',
    'tezlik-a11y',
  ),
  t(
    'Klaviatura testi',
    'Sahifani faqat Tab, Enter va Esc bilan boshqarib ko‘rish — fokus tartibi va ko‘rinishini tekshirish.',
    'tezlik-a11y',
  ),
];
