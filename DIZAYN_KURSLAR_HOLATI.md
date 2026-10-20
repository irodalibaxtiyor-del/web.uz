# Dizayn yo‘nalishi kurslari — holat va qoidalar

To‘rt yangi kurs: **Moslashuvchan dizayn**, **UI asoslari**, **Figma’dan kodga**, **Portfolio**.
Foydalanuvchi so‘rovi (2026-10-20): landing’dagi kursi yo‘q yo‘nalishlar uchun W3Schools’dan
kerakli mavzularni olib, o‘zbekchalashtirib, mashqlari bajariladigan darajada kurs qilish.

## Huquqiy qaror (avvalgi kurslardagidek)

W3Schools kontenti mualliflik huquqi bilan himoyalangan (tarjima ham hosila asar). Shuning uchun
faqat **mavzular tartibi** olinadi; matn, misol, mashq va test savollari **original o‘zbekcha**.
Figma bo‘yicha W3Schools’da darslik yo‘q — “Figma’dan kodga” kursi to‘liq original.

## Fayllar

| Kurs                 | Manifest                             | Darslar                              | Slug                   | Tartib |
| -------------------- | ------------------------------------ | ------------------------------------ | ---------------------- | ------ |
| Moslashuvchan dizayn | `apps/api/src/db/content/rwd/`       | `apps/api/content/rwd-course/`       | `moslashuvchan-dizayn` | 33     |
| UI asoslari          | `apps/api/src/db/content/ui/`        | `apps/api/content/ui-course/`        | `ui-asoslari`          | 35     |
| Figma’dan kodga      | `apps/api/src/db/content/figma/`     | `apps/api/content/figma-course/`     | `figmadan-kodga`       | 37     |
| Portfolio            | `apps/api/src/db/content/portfolio/` | `apps/api/content/portfolio-course/` | `portfolio`            | 45     |

Umumiy yordamchilar: `apps/api/src/db/content/design/shared.ts` (`site`, `app`, `pic`, `svgData`,
`slots`/`cls`, `RESET`, `md`, `q`, `quiz`, `style`, `has`, `text`, `attr`, `at`, `after`).
Har modul fayli darslarni (`mNN`) va namunaviy yechimlarni (`sNN`) birga eksport qiladi.

Katalog tartibi: HTML (20) → CSS (30) → Moslashuvchan dizayn (33) → UI asoslari (35) →
Figma’dan kodga (37) → JavaScript (40) → Portfolio (45, JS kerak) → PHP (50) → Bootstrap (60–80).

## Buyruqlar

```bash
pnpm --filter @webdizayn/api content:verify moslashuvchan-dizayn   # haqiqiy Chrome
pnpm --filter @webdizayn/api exec vitest run test/content-courses.test.ts
DATABASE_URL=pglite://./.data/pg node dist/db/seed-course.js moslashuvchan-dizayn   # demo (API to‘xtatilgan holda)
```

## Rejalar

### Moslashuvchan dizayn (W3Schools: CSS RWD + How To’dagi moslashuvchan mavzular)

1. Asoslar: moslashuvchan dizayn nima; viewport va qurilma pikseli; avval mobil; nisbiy birliklar; suyuq o‘lchamlar (`min/max/clamp`).
2. Media so‘rovlar: sintaksis va diapazon; tanaffus nuqtalari; media xususiyatlari; ko‘rsatish/yashirish; konteyner so‘rovlari.
3. Maketlar: moslashuvchan ustunlar; Flexbox bilan o‘rash; Grid `auto-fit`/`minmax`; maketni `grid-template-areas` bilan almashtirish; “muqaddas grail” maketi.
4. Kontent: moslashuvchan rasmlar; `srcset`/`sizes`; `<picture>`; video va iframe; moslashuvchan tipografiya.
5. Komponentlar: mobil navigatsiya; jadvallar; formalar; kartalar; mobilda to‘liq ekran dialog.
6. Amaliy loyiha: lending (bosh ekran; xizmatlar va narxlar); sinov va tuzatish.

### UI asoslari (W3Schools: Colors, Icons, Fonts + How To komponentlari)

1. Rang: modellar (RGB/HEX/HSL); HSL bilan soyalar; rang g‘ildiragi va uyg‘unlik; 60-30-10 palitra; kontrast; rang tokenlari.
2. Tipografiya: shrift oilalari va stack; tipografik shkala; qator balandligi va uzunligi; ierarxiya; `@font-face`.
3. Oraliq va kompozitsiya: 8px tizimi; yaqinlik; tekislash; oq joy; vizual ierarxiya.
4. Ikonka va rasm: inline SVG; Bootstrap Icons; ikonkalar va accessibility; rasm bezagi.
5. Komponentlar: tugmalar; tugma holatlari; forma maydonlari; kartalar; bildirishnoma va badge; tablar.
6. Holatlar va tizim: bo‘sh/yuklanish/xato; qorong‘i mavzu; mini dizayn tizimi; yakuniy profil sahifasi.

### Figma’dan kodga (original)

1. Maketni o‘qish: Figma interfeysi; Inspect/Dev Mode; px va rem; rang stillari → CSS o‘zgaruvchilar.
2. Auto Layout → Flexbox: asoslar; Hug/Fill/Fixed; tekislash; wrap; absolyut joylashuv.
3. Constraints va moslashuv: constraints; min/max; Layout Grid → CSS Grid; breakpoint freymlar.
4. Matn va effektlar: text styles; soyalar; radius va stroke; to‘ldirish (gradient, shaffoflik).
5. Komponentlar: komponent → klass; variantlar → modifikatorlar; interaktiv holatlar; eksport (SVG, 2x).
6. Amaliy loyiha: maketdan sahifa (header; hero va kartalar; footer va moslashuv).

### Portfolio (W3Schools How To: portfolio gallery, filter, tabs, lightbox, contact form, skill bar, timeline, dark mode, scroll to top)

1. Rejalashtirish: nima kiritiladi; sahifa tuzilmasi; dizayn tokenlari.
2. Bosh ekran va navigatsiya: hero; yopishqoq navigatsiya; mobil menyu; bo‘limlarga silliq o‘tish.
3. Men haqimda: profil kartasi; ko‘nikmalar paneli; vaqt chizig‘i; ijtimoiy havolalar.
4. Loyihalar: kartalar to‘ri; filtr; tablar; lightbox; loyiha sahifasi.
5. Aloqa va qo‘shimchalar: aloqa formasi; fikrlar; yuqoriga qaytish; yorug‘/qorong‘i rejim.
6. Nashr: SEO va meta; tezlik va accessibility; nashr qilish va yakuniy loyiha.

## Mashq yozish qoidalari

CSS_KURS_HOLATI.md dagi qoidalar amal qiladi (5 tadan ko‘p qoida yo‘q, `site()`/`app()`, tashqi
resurs yo‘q, transition’da `wait`, element yo‘qligi `{ min: 0, max: 0 }`). Qo‘shimcha:

- Engine `hover`/`pointer`/`prefers-*` media xususiyatlarini emulyatsiya qilmaydi — ular faqat darsda.
- `<picture>` va `srcset` natijasi `img` ning hisoblangan o‘lchami bilan tekshiriladi (manbalar har xil o‘lchamli `data:` SVG).
- Viewport birliklari (`vw`, `dvh`) hisoblangan qiymatda pikselga aylanadi — aniq `at(w, h, …)` bilan.
- Chrome layout’i 1/64 pikselga yaxlitlaydi: 1/3 kabi kasrlar 299.984px beradi. Tekshiriladigan kengliklar aniq bo‘linadigan bo‘lsin (75/25, `1fr 1fr`, mos viewport).
- `data:` SVG manzilida bo‘sh joylar `%20` bo‘lishi shart (`svgData()` shunday qiladi): `srcset` URL’ni birinchi bo‘sh joyda kesadi.
- `srcset` tanlovi brauzer ixtiyorida (keshdagi kattaroq nomzodni olishi mumkin) — tekshiruv atributlar bo‘yicha.
- `<dialog>` va burger kabi interaktiv mashqlar `after([{ type: 'click', selector }], …)` bilan.
- Engine parallel yuklama ostida (vitest bilan bir vaqtda) BUDGET berishi mumkin — `content:verify` ni yolg‘iz ishga tushiring.

## Holat

- **Moslashuvchan dizayn — tayyor:** 6 modul, 28 dars, 28 mashq (CHECK bilan), 6 test. `content:verify` 28/28.
- UI asoslari — keyingi.
- Figma’dan kodga — rejada.
- Portfolio — rejada.
- Demo bazaga hali yuklanmagan (to‘rttasi tayyor bo‘lgach).
