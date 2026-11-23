import type { GlossaryDef } from '../helpers';

const t = (term: string, definition: string, lesson: string, example?: string): GlossaryDef =>
  example ? { term, definition, lesson, example } : { term, definition, lesson };

/** "UI asoslari" course glossary. Each term points to the lesson that introduces it. */
export const UI_GLOSSARY: GlossaryDef[] = [
  t(
    'Vizual ierarxiya',
    'Elementlarning muhimlik tartibi o‘lcham, rang, qalinlik va joylashuv orqali ko‘rsatilishi.',
    'vizual-ierarxiya',
  ),
  t(
    'Asosiy harakat',
    'Ekrandagi eng muhim amal (masalan, “Saqlash”); har ekranda bitta bo‘lishi tavsiya etiladi.',
    'vizual-ierarxiya',
  ),
  t(
    'Matn ierarxiyasi',
    'Sarlavha, asosiy matn va ikkilamchi matnning o‘lcham, qalinlik va rang bilan ajratilishi.',
    'matn-ierarxiyasi',
  ),
  t(
    'Bo‘sh joy',
    'Elementlar orasidagi va atrofidagi bo‘shliq (white space) — guruhlaydi va o‘qishni osonlashtiradi.',
    'oq-joy',
  ),
  t(
    'Oraliq shkalasi',
    'Oldindan kelishilgan oraliq qiymatlari (4, 8, 16, 24, 32 …) — tasodifiy raqamlar o‘rniga.',
    'oraliq-tizimi',
  ),
  t(
    '8px qoidasi',
    'O‘lcham va oraliqlarni 8 ga karrali qiymatlardan tanlash odati.',
    'oraliq-tizimi',
  ),
  t(
    'Yaqinlik qoidasi',
    'Bir-biriga yaqin turgan elementlar bitta guruh deb qabul qilinadi (Gestalt).',
    'yaqinlik',
  ),
  t(
    'Gestalt qoidalari',
    'Ko‘z shakllarni qanday guruhlashini tushuntiruvchi qoidalar: yaqinlik, o‘xshashlik, davomiylik.',
    'yaqinlik',
  ),
  t(
    'Tekislash',
    'Elementlarni ko‘rinmas chiziqlar bo‘ylab joylashtirish; tartib va ishonch hissini beradi.',
    'tekislash',
  ),
  t(
    'tabular-nums',
    '`font-variant-numeric: tabular-nums` — raqamlar bir xil enda, jadvalda ustma-ust tushadi.',
    'tekislash',
  ),
  t(
    'Modulli shkala',
    'Har bir o‘lcham oldingisini bir xil koeffitsiyentga (masalan, 1.25) ko‘paytirib olinadigan qator.',
    'shkala',
  ),
  t(
    'Shrift oilasi',
    'Bir xil dizayndagi shriftlar to‘plami (qalin, kursiv …); umumiy oilalar — `serif`, `sans-serif`, `monospace`.',
    'shrift-oilalari',
  ),
  t(
    'Font stack',
    'Zaxira shriftlar ro‘yxati: birinchisi bo‘lmasa keyingisi ishlatiladi.',
    'shrift-oilalari',
    'font-family: Inter, system-ui, sans-serif;',
  ),
  t('@font-face', 'O‘z shrift faylingizni ulash qoidasi.', 'font-face'),
  t(
    'font-display',
    'Veb-shrift yuklanguncha matn qanday ko‘rinishini belgilaydi; `swap` — darhol zaxira shriftda.',
    'font-face',
  ),
  t('line-height', 'Qatorlar balandligi; asosiy matn uchun 1.5–1.7 qulay.', 'qator-oraligi'),
  t(
    'letter-spacing',
    'Harflar orasidagi masofa; bosh harfli kichik yorliqlarda biroz oshiriladi.',
    'qator-oraligi',
  ),
  t(
    'HEX',
    'Rangni `#RRGGBB` ko‘rinishida yozish; sakkiz belgili variantda oxirgi juftlik — shaffoflik.',
    'rang-modellari',
  ),
  t(
    'HSL',
    'Rangni tus, to‘yinganlik va yorqinlik bilan yozish — soyalar yasash uchun qulay.',
    'rang-modellari',
  ),
  t(
    'color-mix()',
    'Ikki rangni berilgan nisbatda aralashtiradigan CSS funksiyasi.',
    'hsl-soyalar',
    'color-mix(in srgb, #0071dc 40%, white)',
  ),
  t('Rang shkalasi', 'Bitta rangning och va to‘q soyalari qatori (50 … 900).', 'hsl-soyalar'),
  t(
    '60-30-10 qoidasi',
    'Palitra nisbati: 60% neytral, 30% ikkilamchi, 10% urg‘u rangi.',
    'palitra',
  ),
  t('Urg‘u rangi', 'Tugmalar va muhim belgilar uchun ajratilgan yorqin rang (accent).', 'palitra'),
  t(
    'Komplementar ranglar',
    'Rang g‘ildiragida qarama-qarshi turgan, kuchli kontrast beruvchi ranglar.',
    'uygunlik',
  ),
  t('Analog ranglar', 'Rang g‘ildiragida yonma-yon turgan, uyg‘un ranglar.', 'uygunlik'),
  t(
    'Kontrast nisbati',
    'Matn va fon yorqinligi farqi; WCAG AA bo‘yicha oddiy matn uchun kamida 4,5:1.',
    'kontrast',
  ),
  t(
    'WCAG',
    'Veb-kontent qulayligi bo‘yicha xalqaro tavsiyalar (Web Content Accessibility Guidelines).',
    'kontrast',
  ),
  t(
    'Rang tokeni',
    'Rangga vazifa bo‘yicha berilgan nom (`--color-text-muted`) — qiymat bitta joyda o‘zgaradi.',
    'rang-tokenlari',
  ),
  t(
    'Semantik token',
    'Vazifani bildiruvchi token (masalan, `--color-danger`), xom qiymat tokeniga (`--red-600`) ishora qiladi.',
    'rang-tokenlari',
  ),
  t(
    'currentColor',
    'Elementning joriy matn rangi — SVG ikonkaga rangni uzatish uchun qulay.',
    'svg-ikonkalar',
  ),
  t(
    'SVG ikonka',
    'Vektor ikonka: har qanday o‘lchamda tiniq, rangini CSS bilan boshqarish mumkin.',
    'svg-ikonkalar',
  ),
  t(
    'Ikonka shrifti',
    'Ikonkalar harf sifatida berilgan shrift (masalan, Bootstrap Icons).',
    'bootstrap-icons',
  ),
  t(
    'aria-hidden',
    '`aria-hidden="true"` — bezak elementini ekran o‘quvchidan yashiradi.',
    'ikonka-a11y',
  ),
  t(
    'aria-label',
    'Ko‘rinadigan matni yo‘q element (masalan, ikonkali tugma) uchun ekran o‘quvchiga nom beradi.',
    'ikonka-a11y',
  ),
  t(
    'Modifikator',
    'Asos klassga qo‘shiladigan variant klassi: `.btn--katta`, `.btn--ikkinchi`.',
    'tugmalar',
  ),
  t(
    'BEM',
    'Klass nomlash usuli: blok, element (`__`) va modifikator (`--`).',
    'tugmalar',
    '.karta__sarlavha, .tugma--katta',
  ),
  t(
    ':focus-visible',
    'Klaviatura bilan fokus olinganda ishlaydigan psevdoklass — fokus halqasi uchun.',
    'tugma-holatlari',
  ),
  t(
    'O‘chirilgan holat',
    'Hozir bosib bo‘lmaydigan element holati (`disabled`); sababini ham ko‘rsatish yaxshi.',
    'tugma-holatlari',
  ),
  t(
    ':user-invalid',
    'Foydalanuvchi maydon bilan ishlab bo‘lgandan keyingina xato holatini beradigan psevdoklass.',
    'forma-maydonlari',
  ),
  t(
    'Karta',
    'Bitta mavzudagi ma’lumotni guruhlaydigan quti: sirt, chegara yoki soya, ichki oraliq.',
    'ui-kartalar',
  ),
  t(
    'Skelet yuklanish',
    'Kontent yuklanayotganda uning shaklini kulrang bloklar bilan ko‘rsatish.',
    'holatlar',
  ),
  t(
    'Bo‘sh holat',
    'Ro‘yxatda hali ma’lumot bo‘lmaganda ko‘rsatiladigan tushuntirish va keyingi qadam.',
    'holatlar',
  ),
  t('Toast', 'Ekran burchagida qisqa vaqt ko‘rinadigan bildirishnoma.', 'bildirishnoma'),
  t(
    'aria-live',
    'Sahifadagi o‘zgarishni ekran o‘quvchiga e’lon qiladigan hudud; `role="status"` ham shunday.',
    'bildirishnoma',
  ),
  t(
    'Tablar',
    'Bir joyda bir nechta panelni almashtirib ko‘rsatish: `tablist`, `tab`, `tabpanel` rollari.',
    'tablar',
  ),
  t('aria-selected', 'Tablar ichida tanlangan yorliqni bildiruvchi atribut.', 'tablar'),
  t(
    'Dizayn tizimi',
    'Tokenlar, komponentlar va qoidalar to‘plami — interfeysni izchil qiladi.',
    'dizayn-tizimi',
  ),
];
