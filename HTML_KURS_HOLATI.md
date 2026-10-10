# HTML kursi — holat

Oxirgi yangilanish: 2026-10-10. **Holat: yakunlandi** (60/60 dars, 49 mashq, 12 test).

## Huquqiy qaror

Foydalanuvchi W3Schools HTML materiallarini o‘zbekchaga o‘girishni so‘ragan. W3Schools matnlari, misollari va mashqlari mualliflik huquqi bilan himoyalangan (Refsnes Data), tarjima esa hosila asar hisoblanadi. Shuning uchun:

- W3Schools’dan faqat **mavzular ketma-ketligi** olindi;
- barcha darslar, misollar, mashqlar va test savollari o‘zbek tilida **noldan** yozildi;
- “Examples / Editor / Quiz / Exercises / References” bo‘limlari alohida dars qilinmadi. Ularning o‘rnini platformadagi Playground, mashqlar va testlar egallaydi.

## Fayllar

| Fayl                                       | Vazifasi                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `apps/api/content/html-course/*.md`        | 60 ta dars matni (prettier bilan formatlanmaydi, `.prettierignore` da)              |
| `apps/api/src/db/html-course/manifest.ts`  | Kurs, 12 modul, darslar tartibi, mashqlar (CHECK qoidalari bilan) va modul testlari |
| `apps/api/src/db/html-course/helpers.ts`   | Mashq va test yozish uchun yordamchilar (`page`, `has`, `text`, `attr`, `style`…)   |
| `apps/api/src/db/html-course/solutions.ts` | Namunaviy yechimlar (faqat tekshirish uchun, bazaga yozilmaydi)                     |
| `apps/api/src/db/html-course/seed.ts`      | Manifest validatsiyasi va bitta tranzaksiyada seed                                  |
| `apps/api/src/db/html-course/verify.ts`    | Haqiqiy Chrome’da: yechim PASSED, boshlang‘ich kod PASSED emas                      |
| `apps/api/src/db/seed-html-course.ts`      | CLI                                                                                 |
| `apps/api/test/html-course.test.ts`        | 12 ta API testi                                                                     |

## Buyruqlar

```bash
# Kursni yuklash (avval db:seed; o'qituvchi: SEED_TEACHER_EMAIL, default teacher@webdizayn.local)
pnpm --filter @webdizayn/api db:seed:html
# Qayta yaratish — kursdagi barcha talaba progressi o'chadi!
pnpm --filter @webdizayn/api db:seed:html -- --replace
# CHECK qoidalarini haqiqiy Chrome bilan tekshirish (ixtiyoriy: slug'lar)
pnpm --filter @webdizayn/api content:verify
```

## Tuzilma

| #   | Modul                   | Darslar                                                                                     | Test                  |
| --- | ----------------------- | ------------------------------------------------------------------------------------------- | --------------------- |
| 1   | HTML bilan tanishuv     | introduction, editors\*, basic, elements, attributes                                        | attributes            |
| 2   | Matn bilan ishlash      | headings, paragraphs, styles, formatting, quotations, comments                              | comments              |
| 3   | Ranglar va CSS          | colors, css                                                                                 | css                   |
| 4   | Havolalar va rasmlar    | links, images, project, favicon, page-title                                                 | page-title            |
| 5   | Jadvallar va ro‘yxatlar | tables, lists                                                                               | lists                 |
| 6   | Sahifa tuzilmasi        | block-inline, div, classes, id, buttons, iframes, javascript, file-paths, head              | head                  |
| 7   | Maket va semantika      | layout, responsive, computercode, semantics, style-guide                                    | style-guide           |
| 8   | Belgilar va kodlash     | entities, symbols, emojis, charsets\*, url-encode\*, html-vs-xhtml\*                        | html-vs-xhtml         |
| 9   | Formalar                | forms, form-attributes, form-elements, input-types, input-attributes, input-form-attributes | input-form-attributes |
| 10  | Grafika                 | canvas, svg                                                                                 | svg                   |
| 11  | Media                   | media\*, video, audio, plugins\*, youtube                                                   | youtube               |
| 12  | Web API                 | web-apis\*, geolocation\*, drag-drop, popover, web-storage\*, web-workers\*, sse\*          | sse                   |

\* — mashqsiz nazariy dars, “Darsni tugatdim” bilan tugaydi.

## Ochiq savollar (foydalanuvchiga)

- Kurs nomi “HTML: to‘liq kurs” — o‘zgartirish mumkin (`manifest.ts`, `HTML_COURSE`).
- Eski demo kurs “HTML asoslari” saqlab qolindi. Uni arxivlash kerakmi?
- **Public repo:** CHECK qoidalari (shu jumladan yashirinlari) va namunaviy yechimlar repoda ochiq turadi. Boshlang‘ich darajadagi mashqlar uchun bu qabul qilindi; agar kerak bo‘lsa, `solutions.ts` ni va qoidalarni private repo yoki secret storage’ga ko‘chirish mumkin.
- W3Schools’ning aynan matnidan foydalanish kerak bo‘lsa — yagona yo‘l Refsnes Data’dan yozma ruxsat olish.
