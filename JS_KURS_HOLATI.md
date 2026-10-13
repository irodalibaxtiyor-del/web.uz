# JavaScript kursi — ish holati

Oxirgi yangilanish: 2026-10-13. **Holat: jarayonda — 15/18 modul.**

## Topshiriq va huquqiy qaror

Foydalanuvchi so‘rovi: w3schools.com/js darsligini o‘zbek tilida WEBDIZAYN.UZ’ga joylash va talabalar uchun amaliy topshiriqlar tayyorlash.

HTML va CSS kurslaridagi qaror saqlanadi: W3Schools matnlari mualliflik huquqi bilan himoyalangan, tarjima — hosila asar. Shuning uchun faqat **mavzular tartibi** olinadi. Darslar, misollar, mashqlar va testlar o‘zbek tilida **noldan** yoziladi. Reference/Examples/Quiz/jQuery/Graphics bo‘limlari alohida dars qilinmaydi; kurs oxirida 4 ta amaliy loyiha bor.

## Fayllar

| Fayl                                           | Vazifasi                                            |
| ---------------------------------------------- | --------------------------------------------------- |
| `apps/api/content/js-course/<slug>.md`         | Dars matnlari                                       |
| `apps/api/src/db/content/js/manifest.ts`       | Kurs ma’lumoti va modullar ro‘yxati                 |
| `apps/api/src/db/content/js/modules/NN-*.ts`   | Har modul: darslar, mashqlar, CHECK, test           |
| `apps/api/src/db/content/js/solutions/NN-*.ts` | Namunaviy yechimlar (faqat tekshirish uchun)        |
| `apps/api/src/db/content/js/shared.ts`         | `md`, amallar (`fill`, `click`, `wait`), helper’lar |

## Buyruqlar

```bash
pnpm --filter @webdizayn/api content:verify js                  # butun kurs
pnpm --filter @webdizayn/api content:verify js variables let    # tanlangan darslar
pnpm --filter @webdizayn/api db:seed:js                         # demo bazaga yuklash (serverlar to‘xtatilgan bo‘lsin)
```

## Tuzilma (18 modul)

✅ — dars, mashq va yechim tayyor, Chrome’da tekshirilgan. 📖 — nazariy dars (mashqsiz).

| #   | Modul                             | Darslar (slug)                                                                                                           |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | JavaScript bilan tanishuv         | ✅ intro, ✅ where-to, ✅ output, ✅ statements, ✅ syntax, ✅ comments                                                  |
| 2   | O‘zgaruvchilar va operatorlar     | ✅ variables, ✅ let, ✅ const, ✅ operators, ✅ arithmetic, ✅ assignment, ✅ data-types                                |
| 3   | Funksiyalar, obyektlar, hodisalar | ✅ functions, ✅ objects, ✅ object-properties, ✅ object-methods, ✅ events                                             |
| 4   | Satrlar                           | ✅ strings, ✅ string-methods, ✅ string-search, ✅ string-templates                                                     |
| 5   | Sonlar va Math                    | ✅ numbers, ✅ number-methods, ✅ math, ✅ random                                                                        |
| 6   | Massivlar                         | ✅ arrays, ✅ array-methods, ✅ array-search, ✅ array-sort, ✅ array-iteration                                          |
| 7   | Sana va vaqt                      | ✅ dates, ✅ date-formats, ✅ date-get, ✅ date-set                                                                      |
| 8   | Mantiq va shartlar                | ✅ booleans, ✅ comparisons, ✅ if-else, ✅ switch                                                                       |
| 9   | Sikllar                           | ✅ loop-for, ✅ loop-for-in, ✅ loop-for-of, ✅ loop-while, ✅ break-continue, ✅ iterables                              |
| 10  | To‘plamlar va turlar              | ✅ sets, ✅ maps, ✅ typeof, ✅ type-conversion, ✅ destructuring, ✅ regexp                                             |
| 11  | Xatolar va sifatli kod            | ✅ errors, ✅ scope, ✅ hoisting, ✅ strict-mode, ✅ this, ✅ arrow-functions, ✅ debugging, ✅ style-guide, ✅ mistakes |
| 12  | Klasslar, modullar, JSON          | ✅ classes, ✅ class-inheritance, ✅ class-static, modules 📖, ✅ json                                                   |
| 13  | Obyekt va funksiyalar chuqurroq   | ✅ object-constructors, ✅ object-prototypes, ✅ object-accessors, ✅ object-protection, ✅ call-apply-bind, ✅ closures |
| 14  | Asinxron JavaScript               | ✅ timing, ✅ callbacks, ✅ promises, ✅ async-await, ✅ fetch                                                           |
| 15  | HTML DOM                          | ✅ dom-intro, ✅ dom-methods, ✅ dom-elements, ✅ dom-html, ✅ dom-css, ✅ dom-forms, ✅ dom-animations                  |
| 16  | DOM hodisalari va tugunlar        | dom-events, dom-event-listener, dom-navigation, dom-nodes, dom-collections                                               |
| 17  | Brauzer va Web API                | bom-window, bom-location, cookies, web-storage, web-apis                                                                 |
| 18  | Amaliy loyihalar                  | project-todo, project-calculator, project-quiz, project-filter                                                           |

Har modulning oxirgi darsida 4–5 savollik test bo‘ladi.

## Mashq yozish qoidalari

- Odatiy shakl: `app(body, js, { css })` — `index.html` (oxirida `<script src="script.js">`) + `script.js` (+ `style.css`).
- Natija **sahifaga** yoziladi (`textContent`): CHECK DOM’ni tekshiradi, `console.log` ni emas. `console.log` faqat RUN konsolida ko‘rinadi.
- Qattiq yozib qo‘yilgan javobni ushlash uchun funksiyalar **turli kiritmalar** bilan tekshiriladi: `after([fill('#a', '7'), click('#hisobla')], text(...))`, ulardan biri yashirin (`hidden: true`).
- Har mashqda `clean()` (konsolda xato yo‘q) — bitta qoida sifatida. Bir mashqda **5 tadan ko‘p qoida bo‘lmasin**.
- Boshlang‘ich kod CHECK’dan o‘tmasligi kerak, lekin xato ham tashlamasin (sahifa ochilsin). Istisno: xatoni tuzatish mashqlari (`where-to`, `syntax`, `comments`, `const`).
- Yechim faqat **shu darsgacha o‘rgatilgan** narsalarni ishlatsin (masalan, 8-modulgacha `if` yo‘q). Tekshiruv talabaning oddiy yechimi o‘qiydigan **barcha** maydonlarni to‘ldirsin — bo‘sh maydon tufayli yiqilmasin.
- Katta-kichik harf muhim bo‘lsa: `text(..., { caseSensitive: true })`. Standart holatda solishtirish registrga qaramaydi.
- CHECK’da ishlaydi: `localStorage`, cookie, `setTimeout` (`wait` ≤ 2000 ms), ES modul `import`. Tarmoq (`fetch`) va `Worker` bloklangan.
- RUN preview (opaque origin)da `localStorage`/cookie xato beradi, fayllararo `import` ishlamaydi, `alert/confirm/prompt` konsolga yo‘naltiriladi (`confirm` → `false`, `prompt` → `null`). Darslarda shunga mos ko‘rsatma beriladi.
- `<select>` tanlash amali yo‘q — tanlov uchun tugma yoki input ishlating.
- Yechim faqat **shu darsgacha o‘rgatilgan** narsalarni ishlatsin (masalan, 8-modulgacha yo‘q). Tekshiruv talabaning oddiy yechimi ishlatadigan **barcha** maydonlarni to‘ldirsin — bo‘sh maydon tufayli yiqilmasin.
- Katta-kichik harf muhim bo‘lsa: (standart holatda solishtirish registrga qaramaydi).
- Sana mashqlari doim **qat’iy sana** bilan (`new Date(2026, 8, 1)`), joriy vaqtga bog‘liq bo‘lmasin.

## Ochiq savollar

- Kurs nomi: “JavaScript: to‘liq kurs”.
- Namunaviy yechimlar va CHECK qoidalari public repoda ochiq (HTML/CSS kurslaridagidek).
