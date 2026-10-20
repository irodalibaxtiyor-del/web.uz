## Sifatni o‘lchash

Chrome DevTools’dagi **Lighthouse** sahifani to‘rt yo‘nalishda baholaydi: tezlik (Performance), accessibility, eng yaxshi amaliyotlar, SEO. Har biri 0–100 ball va aniq muammolar ro‘yxati. Portfolio uchun maqsad — har birida 90 dan yuqori. Bu ish beruvchiga ham ko‘rsatkich: sahifangizni Lighthouse bilan tekshirib ko‘rishlari mumkin.

## Eng ko‘p uchraydigan muammolar

| Muammo                                              | Tuzatish                                 |
| --------------------------------------------------- | ---------------------------------------- |
| Rasmda `alt` yo‘q                                   | Mazmunli `alt` yoki bezak uchun `alt=""` |
| Rasm o‘lchami yo‘q — sahifa “sakraydi” (CLS)        | `width` va `height` atributlari          |
| Pastdagi rasmlar darhol yuklanadi                   | `loading="lazy"`                         |
| Katta, siqilmagan rasmlar                           | WebP/AVIF, to‘g‘ri o‘lcham, `srcset`     |
| Tugmada nom yo‘q                                    | `aria-label` yoki matn                   |
| Sarlavha darajasi o‘tkazib yuborilgan (`h1` → `h3`) | Ketma-ket darajalar                      |
| Past kontrastli matn                                | Kamida 4.5:1                             |
| `<html>` da `lang` yo‘q                             | `lang="uz"`                              |

## Sarlavhalar tartibi

Ekran o‘quvchi foydalanuvchilari sahifani ko‘pincha sarlavhalar bo‘yicha aylanadi. `h1` dan keyin to‘g‘ridan-to‘g‘ri `h3` kelsa, ular biror bo‘lim tushib qolgan deb o‘ylaydi. Sarlavha darajasi **mazmun ierarxiyasi** — kattaligi CSS bilan boshqariladi.

## Tezlik

- Rasmlar — eng katta yuk. Har bir rasm kerakli o‘lchamda (1200px kenglikdagi joyga 4000px rasm qo‘ymang).
- Shriftlar: faqat kerakli qalinliklar, `font-display: swap`.
- JavaScript kam bo‘lsin: oddiy portfolio uchun hech qanday freymvork kerak emas.
- Sekin internetni DevTools → Network → “Slow 4G” bilan sinang.

## Klaviatura testi

Sichqonchani bir chetga qo‘ying va saytni faqat Tab, Enter va Esc bilan aylanib chiqing:

- har bir havola va tugmada fokus ko‘rinadimi?
- mobil menyu, filtr, lightbox ishlaydimi?
- fokus mantiqiy tartibda yuradimi?

Avtomatik tekshiruvlar muammolarning bir qismini topadi xolos; bu qo‘lda tekshiruv ham shart.

Mashqda Lighthouse topadigan odatiy xatolarni tuzatasiz.
