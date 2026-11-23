import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** "Figma'dan kodga" course glossary. Each term points to the lesson that introduces it. */
export const FIGMA_GLOSSARY: GlossaryDef[] = [
  t(
    'Figma',
    'Brauzerda ishlaydigan interfeys dizayni dasturi; dizayner maket chizadi, dasturchi undan qiymatlarni oladi.',
    'figma-interfeysi',
  ),
  t(
    'Freym',
    'Figma’dagi konteyner (frame): sahifa, blok yoki komponent; kodda odatda `div`/`section`.',
    'figma-interfeysi',
  ),
  t(
    'Qatlam',
    'Maketdagi har bir element (layer); qatlamlar daraxti HTML tuzilmasiga o‘xshaydi.',
    'figma-interfeysi',
  ),
  t(
    'Inspect',
    'Element qiymatlarini (o‘lcham, rang, shrift, oraliq) ko‘rsatadigan panel; Dev Mode — kengaytirilgan varianti.',
    'inspect',
  ),
  t(
    'Dev Mode',
    'Figma’ning dasturchilar uchun rejimi: o‘lchovlar, CSS parchalari va eksport.',
    'inspect',
  ),
  t(
    'px → rem',
    'Maketdagi pikselni rem’ga o‘girish: px ÷ 16 (ildiz shrift 16px bo‘lsa).',
    'px-rem',
    '24px → 1.5rem',
  ),
  t(
    'Auto Layout',
    'Figma’dagi Flexbox: yo‘nalish, oraliq (gap), padding va tekislash.',
    'auto-layout',
  ),
  t(
    'Item spacing',
    'Auto Layout ichidagi elementlar orasidagi masofa; CSS’da `gap`.',
    'auto-layout',
  ),
  t(
    'Space between',
    'Elementlarni chetlarga yoyib, orasidagi joyni teng bo‘lish; CSS’da `justify-content: space-between`.',
    'al-tekislash',
  ),
  t(
    'Hug contents',
    'Element o‘lchami kontentga qarab (CSS’da `width: auto` / `fit-content`).',
    'hug-fill-fixed',
  ),
  t(
    'Fill container',
    'Element qolgan joyni egallaydi; gorizontal flex’da `flex: 1` (va `min-width: 0`).',
    'hug-fill-fixed',
  ),
  t('Fixed', 'Qat’iy o‘lcham; CSS’da `width` va kerak bo‘lsa `flex-shrink: 0`.', 'hug-fill-fixed'),
  t(
    'min-width: 0',
    'Flex elementning siqilishiga ruxsat beradi — uzun matn konteynerni yorib chiqmaydi.',
    'min-max',
  ),
  t(
    'Wrap',
    'Auto Layout’da sig‘magan elementlarni keyingi qatorga o‘tkazish; CSS’da `flex-wrap: wrap`.',
    'al-wrap',
  ),
  t(
    'Absolute position',
    'Auto Layout’dan chiqarilgan element; CSS’da ota `relative`, element `absolute`.',
    'absolyut',
  ),
  t(
    'Constraints',
    'Freym o‘lchami o‘zgarganda element qanday bog‘lanib qolishi (chap, o‘ng, markaz, cho‘zilish).',
    'constraints',
  ),
  t(
    'Layout grid',
    'Maketdagi ustunlar to‘ri; CSS’da `grid-template-columns: repeat(12, 1fr)` va `column-gap`.',
    'layout-grid',
  ),
  t('Gutter', 'To‘r ustunlari orasidagi masofa.', 'layout-grid'),
  t(
    'Breakpoint freymlar',
    'Bir sahifaning mobil, planshet va desktop uchun alohida chizilgan freymlari.',
    'breakpoint-freymlar',
  ),
  t(
    'Color style',
    'Figma’da saqlangan, nom berilgan rang; kodda CSS o‘zgaruvchisi (token) bo‘ladi.',
    'rang-stillari',
    ':root { --color-primary: #0071dc; }',
  ),
  t(
    'Token',
    'Dizayn qiymatining nomi (rang, oraliq, shrift) — maket va kod o‘rtasidagi umumiy til.',
    'rang-stillari',
  ),
  t('Fill', 'Qatlamning to‘ldirilishi: solid rang, gradient yoki rasm.', 'fill-gradient'),
  t(
    'Layer opacity',
    'Butun qatlam shaffofligi; CSS’da `opacity` (ichidagi matn ham shaffof bo‘ladi).',
    'fill-gradient',
  ),
  t(
    'Blend mode',
    'Qatlam ranglarining ostidagi bilan aralashish usuli; CSS’da `mix-blend-mode`.',
    'fill-gradient',
  ),
  t('Corner radius', 'Burchak yumaloqligi; CSS’da `border-radius`.', 'radius-stroke'),
  t(
    'Stroke',
    'Qatlam chegarasi; Inside/Center/Outside joylashuvi CSS’da `border`, `box-shadow` yoki `outline` bilan.',
    'radius-stroke',
  ),
  t('Drop shadow', 'Tashqi soya; CSS’da `box-shadow` (x, y, xiralik, yoyilish, rang).', 'soyalar'),
  t(
    'Background blur',
    'Element orqasini xiralashtirish; CSS’da `backdrop-filter: blur()`.',
    'soyalar',
  ),
  t(
    'Text style',
    'Figma’da saqlangan shrift sozlamasi (oila, o‘lcham, qalinlik, qator balandligi).',
    'text-styles',
  ),
  t(
    'Komponent',
    'Qayta ishlatiladigan Figma elementi; kodda qayta ishlatiladigan klass yoki komponent.',
    'komponent-klass',
  ),
  t(
    'Instance',
    'Komponentning sahifadagi nusxasi; asosiy komponent o‘zgarsa, u ham o‘zgaradi.',
    'komponent-klass',
  ),
  t(
    'Detach',
    'Instance’ni komponentdan uzish — keyingi yangilanishlar unga ta’sir qilmaydi.',
    'komponent-klass',
  ),
  t(
    'Variant',
    'Komponentning turli ko‘rinishlari (o‘lcham, tur, holat); kodda asos klass + modifikatorlar.',
    'variantlar',
    '<button class="tugma tugma--katta">',
  ),
  t(
    'Modifikator',
    'Asos klassga qo‘shiladigan variant klassi — Figma variantining kodlagi ko‘rinishi.',
    'variantlar',
    '.tugma--katta, .tugma--ikkinchi',
  ),
  t(
    'Holat variantlari',
    'Hover, Pressed, Focus, Disabled — interaktiv element holatlari.',
    'interaktiv',
  ),
  t(
    'Prototip',
    'Freymlarni bosish bilan bog‘lab, ilovaning ishlashini ko‘rsatadigan maket.',
    'interaktiv',
  ),
  t(
    'Eksport',
    'Qatlamni fayl (SVG, PNG, JPG, WebP) sifatida saqlash; 1x va 2x o‘lchamlar.',
    'eksport',
  ),
  t(
    'viewBox',
    'SVG koordinatalar tizimi; to‘g‘ri bo‘lsa ikonka har qanday o‘lchamda moslashadi.',
    'eksport',
  ),
  t(
    'min-height',
    'Eng kichik balandlik — `height` dan farqli kontent o‘sganda kesilmaydi.',
    'loyiha-header',
  ),
];
