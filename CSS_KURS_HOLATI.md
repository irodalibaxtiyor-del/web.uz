# CSS kursi — ish holati va qolgan vazifalar

Oxirgi yangilanish: 2026-10-10. Ish foydalanuvchi so‘rovi bilan to‘xtatildi. **Holat: 3/15 modul tayyor (23/~101 dars).**

## Topshiriq va huquqiy qaror

Foydalanuvchi so‘rovi: w3schools.com/css darsligini o‘zbek tilida WEBDIZAYN.UZ’ga joylash.

HTML kursidagi qaror saqlanadi: W3Schools matnlari mualliflik huquqi bilan himoyalangan, tarjima — hosila asar. Shuning uchun faqat **mavzular tartibi** olinadi; darslar, misollar, mashqlar va testlar o‘zbek tilida **noldan** yoziladi. References/Examples/Quiz bo‘limlari alohida dars qilinmaydi.

## Fayllar

| Fayl                                            | Vazifasi                                            |
| ----------------------------------------------- | --------------------------------------------------- |
| `apps/api/content/css-course/<slug>.md`         | Dars matnlari (prettier formatlamaydi)              |
| `apps/api/src/db/content/css/manifest.ts`       | Kurs ma’lumoti va modullar ro‘yxati                 |
| `apps/api/src/db/content/css/modules/NN-*.ts`   | Har modul: darslar, mashqlar, CHECK qoidalari, test |
| `apps/api/src/db/content/css/solutions/NN-*.ts` | Namunaviy yechimlar (faqat tekshirish uchun)        |
| `apps/api/src/db/content/css/shared.ts`         | `md`, `TODO` va helper’lar re-eksporti              |
| `apps/api/src/db/content/registry.ts`           | HTML va CSS kurslari ro‘yxati                       |

Yangi modul qo‘shilganda `manifest.ts` (`CSS_MODULES`) va `solutions.ts` (`CSS_SOLUTIONS`) ga import qo‘shiladi.

## Buyruqlar

```bash
pnpm --filter @webdizayn/api content:verify css                 # butun kurs (~15 daqiqa)
pnpm --filter @webdizayn/api content:verify css borders padding  # tanlangan darslar
pnpm --filter @webdizayn/api db:seed:css                        # demo bazaga yuklash (serverlar to‘xtatilgan bo‘lsin)
```

## Tuzilma (15 modul)

✅ — dars, mashq va yechim tayyor, Chrome’da tekshirilgan; ⬜ — yozilmagan.

| #   | Modul                         | Darslar (slug)                                                                                                                                   |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | CSS bilan tanishuv            | ✅ introduction, ✅ syntax, ✅ selectors, ✅ howto, ✅ comments, ✅ errors                                                                       |
| 2   | Ranglar va fon                | ✅ colors, ✅ rgb, ✅ hex, ✅ hsl, ✅ backgrounds, ✅ background-image, ✅ background-attachment, ✅ background-shorthand                        |
| 3   | Chegara va bo‘shliqlar        | ✅ borders, ✅ border-sides, ✅ rounded-borders, ✅ margins, ✅ margin-collapse, ✅ padding, ✅ height-width, ✅ box-model, ✅ outline           |
| 4   | Matn va shriftlar             | ⬜ text, ⬜ text-decoration, ⬜ text-transform, ⬜ text-shadow, ⬜ fonts, ⬜ font-style, ⬜ web-fonts, ⬜ font-shorthand, ⬜ icons               |
| 5   | Havola, ro‘yxat va jadval     | ⬜ links, ⬜ lists, ⬜ tables, ⬜ table-styling                                                                                                  |
| 6   | Joylashuv                     | ⬜ display, ⬜ max-width, ⬜ position, ⬜ z-index, ⬜ overflow, ⬜ float, ⬜ clear, ⬜ inline-block, ⬜ align                                    |
| 7   | Selektorlar va kaskad         | ⬜ combinators, ⬜ pseudo-classes, ⬜ pseudo-elements, ⬜ attribute-selectors, ⬜ specificity, ⬜ important                                      |
| 8   | Amaliy komponentlar           | ⬜ opacity, ⬜ navbar-vertical, ⬜ navbar-horizontal, ⬜ dropdowns, ⬜ image-gallery, ⬜ image-sprites, ⬜ forms, ⬜ counters, ⬜ website-layout |
| 9   | Birliklar va funksiyalar      | ⬜ units, ⬜ math-functions, ⬜ variables, ⬜ at-property                                                                                        |
| 10  | Bezak effektlari              | ⬜ border-images, ⬜ background-size, ⬜ color-keywords, ⬜ linear-gradients, ⬜ radial-gradients, ⬜ box-shadow, ⬜ text-effects                |
| 11  | Transformatsiya va animatsiya | ⬜ transforms-2d, ⬜ transforms-3d, ⬜ transitions, ⬜ animations                                                                                |
| 12  | Rasmlar va interfeys          | ⬜ tooltips, ⬜ image-styling, ⬜ object-fit, ⬜ masking, ⬜ buttons, ⬜ pagination, ⬜ multi-columns, ⬜ user-interface, ⬜ box-sizing          |
| 13  | Flexbox                       | ⬜ flexbox, ⬜ flex-container, ⬜ flex-items, ⬜ flex-responsive                                                                                 |
| 14  | Grid                          | ⬜ grid-intro, ⬜ grid-container, ⬜ grid-items, ⬜ grid-layout, ⬜ supports                                                                     |
| 15  | Moslashuvchan dizayn          | ⬜ rwd-intro, ⬜ rwd-viewport, ⬜ rwd-grid-view, ⬜ media-queries, ⬜ mq-examples, ⬜ rwd-images, ⬜ rwd-videos, ⬜ rwd-frameworks               |

Har modulning oxirgi darsida 4–5 savollik test (`quiz`) bo‘ladi.

## Mashq yozish qoidalari (tajribadan)

- Odatiy shakl: `site(body, css)` — `index.html` + `style.css`. Boshlang‘ich kod CHECK’dan **o‘tmasligi** kerak.
- `style` tekshiruvi hisoblangan qiymatni solishtiradi: `margin`/`border` kabi qisqa yozuvlar o‘rniga `margin-top`, `border-top-width`, `border-top-left-radius` kabi bitta xususiyat tekshiriladi.
- `margin: auto` natijasi pikselda: aniq `at(width, height, ...)` viewport bilan tekshiriladi.
- Psevdoelementlar: `style(..., { pseudo: '::before' })` (helperga hali qo‘shilmagan — kerak bo‘lsa `CheckRuleInput` ni qo‘lda yozing). CSS o‘zgaruvchilari: `property: '--rang'`.
- Fokus: `after([{ type: 'press', selector: 'body', key: 'Tab' }], ...)` — `:focus-visible` ishlaydi.
- Tashqi resurslar (rasm, shrift) bloklanadi; gradient yoki `data:` URL ishlating. Tashqi resursli mashqda `noConsoleErrors` ishlatmang.
- Bir mashqda **5 tadan ko‘p qoida bo‘lmasin**: har qoida yangi brauzer kontekstida ishlaydi, umumiy budjet 20 s.

## Ochiq savollar

- Kurs nomi: “CSS: to‘liq kurs”.
- Namunaviy yechimlar va CHECK qoidalari public repoda ochiq (HTML kursidagidek).
