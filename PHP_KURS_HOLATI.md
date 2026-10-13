# PHP kursi — ish holati

Oxirgi yangilanish: 2026-10-13. **Holat: yakunlandi** — 15 modul, 63 dars, 63 test, 221 ta natija savoli PHP 8.3 da tekshirilgan. Demo bazaga yuklangan.

## Topshiriq va qarorlar

Foydalanuvchi so‘rovi: w3schools.com/php darsligini o‘zbek tilida, talabalar uchun mos topshiriqlar bilan joylash; katalogda JavaScript’dan keyin (5-o‘rin).

- HTML/CSS/JS kurslaridagi huquqiy qaror saqlanadi: faqat **mavzular tartibi**, matnlar, misollar va savollar **original o‘zbekcha**.
- **Amaliyot rejimi — “nazariya + testlar”** (foydalanuvchi tanlovi). PHP serverda ishlaydi, platformadagi RUN/CHECK esa faqat brauzer kodini bajaradi. Muqobillar (brauzerda php-wasm yoki serverda izolyatsiyalangan PHP) rad etildi.
  - Har darsning oxirida **test** (asosan “bu kod nimani chiqaradi?”), keyingi dars test o‘tilganda ochiladi.
  - Har darsning oxirida **mustaqil mashq**: talaba kompyuterida (`php -S localhost:8000`) bajaradi, kutilgan natija darsda yozilgan.
- “Kod nimani chiqaradi?” savollari `natija()` helper’i bilan yoziladi va **haqiqiy PHP 8.3** da tekshiriladi (pastga qarang). API PHP’ni hech qachon bajarmaydi.

## Fayllar

| Fayl                                          | Vazifasi                                            |
| --------------------------------------------- | --------------------------------------------------- |
| `apps/api/content/php-course/<slug>.md`       | Dars matnlari                                       |
| `apps/api/src/db/content/php/manifest.ts`     | Kurs ma’lumoti (`practice: 'quiz'`, `position: 50`) |
| `apps/api/src/db/content/php/modules/NN-*.ts` | Har modul: darslar va testlar                       |
| `apps/api/src/db/content/php/shared.ts`       | `natija()`, `kod()`, `dars()`, `PHP_OUTPUTS`        |
| `apps/api/src/db/content/php/outputs.ts`      | Natija savollarini JSON qilib chiqaradi             |

## Javoblarni tekshirish

```bash
cd apps/api
node -r @swc-node/register src/db/content/php/outputs.ts > /tmp/php-outputs.json
# php-wasm (loyihaga qo‘shilmagan, alohida papkada): npm i @php-wasm/node@3.1.58
node verify.mjs /tmp/php-outputs.json   # har snippet PHP 8.3 da bajariladi, chiqish aynan solishtiriladi
```

`verify.mjs` scratchpad’da; zarur bo‘lsa qayta yaratiladi: har snippet uchun yangi `PHP` (`loadNodeRuntime('8.3', { emscriptenOptions: { processId: 1 } })`), `php.run({ code })`, `r.text === expected`.

## Tuzilma (15 modul)

Barcha modullar tayyor: dars, mustaqil mashq va test; natijalar PHP 8.3 da tekshirilgan.

| #   | Modul                          | Darslar (slug)                                                                                            |
| --- | ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 1   | PHP bilan tanishuv             | php-intro, php-install, php-syntax, php-comments                                                          |
| 2   | O‘zgaruvchilar va turlar       | php-variables, php-echo-print, php-data-types, php-casting, php-constants                                 |
| 3   | Satrlar                        | php-strings, php-string-functions, php-string-format                                                      |
| 4   | Sonlar va operatorlar          | php-numbers-math, php-operators, php-comparison                                                           |
| 5   | Shartlar va sikllar            | php-if-else, php-switch-match, php-while, php-for, php-foreach                                            |
| 6   | Funksiyalar                    | php-functions, php-function-args, php-scope, php-closures                                                 |
| 7   | Massivlar                      | php-arrays, php-associative, php-array-changes, php-array-sort, php-multidimensional, php-array-functions |
| 8   | Formalar va superglobal’lar    | php-superglobals, php-forms, php-form-validation, php-form-security                                       |
| 9   | Qo‘shimcha imkoniyatlar        | php-date, php-include, php-regex, php-filters                                                             |
| 10  | Fayllar                        | php-files-read, php-files-write, php-file-upload                                                          |
| 11  | Cookie, sessiya, JSON, xatolar | php-cookies, php-sessions, php-json, php-exceptions                                                       |
| 12  | OOP asoslari                   | php-oop, php-classes, php-constructor, php-access, php-inheritance                                        |
| 13  | OOP chuqurroq                  | php-abstract-interfaces, php-traits, php-static, php-namespaces, php-enums                                |
| 14  | Ma’lumotlar bazasi (PDO)       | php-database, php-pdo-connect, php-pdo-insert, php-pdo-select, php-pdo-update-delete                      |
| 15  | Amaliy loyihalar               | php-project-guestbook, php-project-auth, php-project-crud                                                 |

## Yozish qoidalari

- Har dars: tushuntirish, misollar, **Mustaqil mashq** (topshiriq + kutilgan natija). Har dars `dars(...)` testi bilan tugaydi (4 savol, oxirgi darsda 5–6 — modul bo‘yicha).
- Natija savollarida variantlar **bir qatorli** (yangi qatorsiz) bo‘lsin — chiqish `echo` bilan bo‘sh joy yoki vergul orqali yoziladi.
- Snippetlar `<?php` bilan boshlanadi va `declare`, fayl, tarmoq, sessiya kabi tashqi holatga bog‘liq bo‘lmasin (tekshiruvda faqat CLI rejimi). Baza savollari `sqlite::memory:` bilan (php-wasm’da `pdo_sqlite` bor).
- `var_dump` oxiriga yangi qator qo‘shadi — natija savollarida `echo`/`var_export(..., true)`/`gettype()` ishlatilsin.
- Kurs PHP 8.3 ga mo‘ljallangan (`match`, `enum`, `readonly`, `fn`, nomlangan argumentlar).

## Yakuniy tekshiruv (2026-10-13)

- `vphp.sh`: **221/221** natija PHP 8.3 bilan mos; har darsning mustaqil mashq natijasi ham alohida bajarib ko‘rildi (13–14-modullar).
- `content-courses.test.ts` 27/27 (har darsda test, mashq yo‘q, to‘g‘ri javob birinchi turgan ulushi < 0.5).
- Demo baza: `node dist/db/seed-course.js php` → 15 modul, 63 dars, 63 test; katalog tartibi HTML asoslari → HTML → CSS → JavaScript → PHP.
- Cheklovlar: 15-moduldagi loyihalar (mehmonlar kitobi, auth, CRUD) platformada bajarilmaydi — talaba kompyuterida `php -S` bilan; ularning kodi testlarda qism-qism (validatsiya, hash, IDOR) tekshirilgan.
