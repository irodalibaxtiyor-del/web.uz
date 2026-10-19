# Bootstrap kurslari (B3, B4, B5) — ish holati

Oxirgi yangilanish: 2026-10-17. **Holat: uchala kurs yakunlandi — 24 modul, 138 dars, 135 mashq, 24 test; demo bazaga yuklangan.**

## Topshiriq va huquqiy qaror

Foydalanuvchi so‘rovi: w3schools.com’dagi Bootstrap 3, 4 va 5 darsliklarini o‘zbek tilida WEBDIZAYN.UZ’ga joylash.

Avvalgi kurslardagi qaror saqlanadi: W3Schools matnlari mualliflik huquqi bilan himoyalangan, tarjima — hosila asar. Shuning uchun faqat **mavzular tartibi** olinadi; darslar, misollar, mashqlar va testlar o‘zbek tilida **noldan** yoziladi. Reference / Editor / Quiz / Certificate / Interview / Syllabus sahifalari alohida dars qilinmaydi.

Bootstrap’ning o‘zi (MIT litsenziya) platformada saqlanadi (`packages/libs`) — talaba odatdagi CDN havolani yozadi, RUN va CHECK uni platformadagi nusxaga almashtiradi.

## Fayllar

| Fayl                                                 | Vazifasi                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/api/content/bootstrapN-course/<slug>.md`       | Dars matnlari                                                      |
| `apps/api/src/db/content/bootstrap/shared.ts`        | `bs3()`/`bs4()`/`bs5()`, CDN URL’lari, `slots()`, `pic()`, `RGB`   |
| `apps/api/src/db/content/bootstrapN/manifest.ts`     | Kurs ma’lumoti, modullar va yechimlar ro‘yxati                     |
| `apps/api/src/db/content/bootstrapN/modules/NN-*.ts` | Har modul: darslar, mashqlar, CHECK, test **va** yechimlar (`sNN`) |

## Buyruqlar

```bash
pnpm --filter @webdizayn/api content:verify bootstrap3            # butun kurs
pnpm --filter @webdizayn/api content:verify bootstrap3 navbar     # tanlangan darslar
pnpm --filter @webdizayn/api db:seed:course bootstrap3            # demo bazaga (API to‘xtatilgan bo‘lsin)
```

## Bootstrap 3 (slug `bootstrap3`, position 60) — ✅ yakunlandi: 8 modul, 44 dars, 43 mashq, 8 test

✅ — dars, mashq va yechim tayyor, Chrome’da tekshirilgan. 📖 — nazariy dars.

| #   | Modul                      | Darslar                                                                                                 |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Bootstrap 3 bilan tanishuv | 📖 home, ✅ get-started, ✅ grid-basic                                                                  |
| 2   | Matn, jadval va xabarlar   | ✅ typography, ✅ tables, ✅ images, ✅ jumbotron, ✅ wells, ✅ alerts                                  |
| 3   | Tugmalar va belgilar       | ✅ buttons, ✅ button-groups, ✅ glyphicons, ✅ badges-labels, ✅ progress-bars                         |
| 4   | Navigatsiya komponentlari  | ✅ pagination, ✅ pager, ✅ list-groups, ✅ panels, ✅ dropdowns, ✅ collapse, ✅ tabs-pills, ✅ navbar |
| 5   | Formalar                   | ✅ forms, ✅ inputs, ✅ inputs-2, ✅ input-sizing                                                       |
| 6   | JavaScript komponentlari   | ✅ media-objects, ✅ carousel, ✅ modal, ✅ tooltip, ✅ popover, ✅ scrollspy, ✅ affix, ✅ filters     |
| 7   | Setka tizimi               | ✅ grid-system, ✅ grid-stacked, ✅ grid-small, ✅ grid-medium, ✅ grid-large, ✅ grid-examples         |
| 8   | Amaliy loyihalar           | ✅ templates, ✅ theme-personal, ✅ theme-company, ✅ theme-band                                        |

W3Schools’dagi tema nomlari va dizaynlari (“Simply Me”, “Company”, “Band”) ko‘chirilmadi — o‘rniga original loyihalar: shaxsiy sahifa, IT-kompaniya sayti, musiqa guruhi sayti.

`content:verify bootstrap3` — **43/43** (~3 daqiqa).

## Bootstrap 4 (slug `bootstrap4`, position 70) — ✅ yakunlandi: 8 modul, 45 dars, 44 mashq, 8 test

| #   | Modul                          | Darslar                                                                                                                         |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Bootstrap 4 bilan tanishuv     | 📖 home, ✅ get-started, ✅ containers, ✅ grid-basic                                                                           |
| 2   | Matn, ranglar va jadvallar     | ✅ typography, ✅ colors, ✅ tables, ✅ images, ✅ jumbotron                                                                    |
| 3   | Xabarlar, tugmalar va belgilar | ✅ alerts, ✅ buttons, ✅ button-groups, ✅ badges, ✅ progress-bars, ✅ spinners                                               |
| 4   | Navigatsiya va kartalar        | ✅ pagination, ✅ list-groups, ✅ cards, ✅ dropdowns, ✅ collapse, ✅ navs, ✅ navbar                                          |
| 5   | Formalar                       | ✅ forms, ✅ inputs, ✅ input-groups, ✅ custom-forms                                                                           |
| 6   | JavaScript komponentlari       | ✅ carousel, ✅ modal, ✅ tooltip, ✅ popover, ✅ toast, ✅ scrollspy                                                           |
| 7   | Utilitalar, Flex va ikonkalar  | ✅ utilities, ✅ flex, ✅ icons, ✅ media-objects, ✅ filters                                                                   |
| 8   | Setka tizimi                   | ✅ grid-system, ✅ grid-stacked, ✅ grid-xsmall, ✅ grid-small, ✅ grid-medium, ✅ grid-large, ✅ grid-xlarge, ✅ grid-examples |

Ikonkalar darsi Font Awesome o‘rniga Bootstrap Icons bilan (platformada saqlanadi). `content:verify bootstrap4` — **44/44** (~3.5 daqiqa).

## Bootstrap 5 (slug `bootstrap5`, position 80) — ✅ yakunlandi: 8 modul, 49 dars, 48 mashq, 8 test

| #   | Modul                              | Darslar                                                                                                                                      |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Bootstrap 5 bilan tanishuv         | 📖 home, ✅ get-started, ✅ containers, ✅ grid-basic                                                                                        |
| 2   | Matn, ranglar va jadvallar         | ✅ typography, ✅ colors, ✅ tables, ✅ images, ✅ jumbotron (utilitalardan banner)                                                          |
| 3   | Xabarlar, tugmalar va belgilar     | ✅ alerts, ✅ buttons, ✅ button-groups, ✅ badges, ✅ progress-bars, ✅ spinners                                                            |
| 4   | Navigatsiya va kartalar            | ✅ pagination, ✅ list-groups, ✅ cards, ✅ dropdowns, ✅ collapse (accordion), ✅ navs, ✅ navbar                                           |
| 5   | JavaScript komponentlari           | ✅ carousel, ✅ modal, ✅ tooltip, ✅ popover, ✅ toast, ✅ scrollspy, ✅ offcanvas                                                          |
| 6   | Utilitalar, qorong‘i rejim va Flex | ✅ utilities, ✅ dark-mode, ✅ flex, ✅ icons                                                                                                |
| 7   | Formalar                           | ✅ forms, ✅ select, ✅ checks-radios, ✅ range, ✅ input-groups, ✅ floating-labels, ✅ validation                                          |
| 8   | Setka tizimi                       | ✅ grid-system, ✅ grid-stacked, ✅ grid-xsmall, ✅ grid-small, ✅ grid-medium, ✅ grid-large, ✅ grid-xlarge, ✅ grid-xxl, ✅ grid-examples |

`content:verify bootstrap5` — **48/48** (~4.5 daqiqa).

Har modulning oxirgi darsida 5 savollik test bo‘ladi.

## Mashq yozish qoidalari

- Shablon: `slots(TPL)` — boshlang‘ich kod (hamma `{{slot}}` bo‘sh), `slots(TPL, {...})` — yechim. `cls('a b')` → ` class="a b"`.
- Boshlang‘ich kodda Bootstrap allaqachon ulangan (`bs3()`), faqat `get-started` da talaba o‘zi ulaydi (`bare: true`).
- Klass borligini `has()`, Bootstrap ta’sirini `style()` bilan tekshiring (hisoblangan qiymat, `rgb(...)`). Ranglar: `RGB.bs3.*`.
- Kengliklar aniq viewport bilan: `at(1280, 800, …)` — B3 `.container` 1170px, kontent 1140px.
- JS plaginlar (`collapse`, `dropdown`, `tab`, `alert`): `after([click(sel), wait(300–700)], …)` — animatsiya tugashini kuting.
- B3 da “zebra” foni `tr` ga, rangli qator foni `td` ga beriladi.
- Tashqi rasm yo‘q — `pic(label, w, h, color)` (`data:` SVG).
- Bir mashqda 5 tadan ko‘p qoida bo‘lmasin.
- **Slot bilan klass beriladigan elementda shablonda `class` bo‘lmasin** — aks holda ikkinchi `class` atributi e’tiborsiz qoladi. Kerak bo‘lsa slotni qiymat ichiga qo‘ying: `class="p-2{{x}}"`.
- Foizli kenglik yaxlitlanadi (`66.6667%` → 639.984px): bunday holatda `max-width` yoki `flex-basis` ni tekshiring.
- B4 tab plagini `aria-selected` ni faqat `role="tab"` li havolada yangilaydi; `.badge-pill` padding’i `em` da.
- Aniq hisoblangan qiymatlarni (kenglik, transform) topish uchun yechimni Playwright’da ochib `getComputedStyle` o‘qiydigan vaqtinchalik probe skripti ishlatildi (repoga kiritilmadi).
- B5 da `g-*` gutter qator kengligini o‘zgartiradi (`g-3`: `col-lg-3` = 283px, standart gutter’da 285px).
- B5 tooltip/popover joylashuvi — `[data-popper-placement="bottom"]`; range uchun `fill` ishlamaydi — `press` (ArrowRight/End); floating label: `matrix(0.85, 0, 0, 0.85, 2.04, -6.8)`.
- Og‘ir yuklamada ba’zan soxta TIMEOUT/BUDGET chiqadi — alohida qayta tekshiring.
