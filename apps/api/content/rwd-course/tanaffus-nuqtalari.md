## Tanaffus nuqtasi nima?

**Tanaffus nuqtasi** (breakpoint) — maket o‘zgaradigan ekran kengligi. Masalan, 768px dan boshlab ikki ustun paydo bo‘lsa, 768px — tanaffus nuqtasi.

## Qurilmaga emas, kontentga qarab

Ko‘pchilik mashhur qurilmalar kengligini yodlab oladi: 375, 768, 1024… Lekin qurilmalar har yili o‘zgaradi, sahifangiz kontenti esa o‘zingizniki. To‘g‘ri usul:

1. Sahifani eng tor ekranda tayyorlang.
2. Brauzer oynasini sekin kengaytiring.
3. Qatorlar haddan tashqari uzun bo‘lib, kartalar cho‘zilib, bo‘sh joy ko‘payib ketgan joyda to‘xtang — mana shu tanaffus nuqtasi.

Natijada nuqtalar 37em yoki 52em kabi “g‘alati” qiymatlar bo‘lishi mumkin — bu normal.

## Odatiy boshlang‘ich qiymatlar

Agar mo‘ljal kerak bo‘lsa:

| Nuqta | Odatda |
| --- | --- |
| 40em (640px) | katta telefon, kichik planshet |
| 48em (768px) | planshet |
| 64em (1024px) | noutbuk |
| 80em (1280px) | katta ekran |

Kichik komponentlar uchun alohida, mahalliy nuqtalar ham bo‘lishi mumkin — masalan, faqat narxlar jadvali 52em da o‘zgaradi.

## Nega `em` da?

Media so‘rovdagi `em` har doim **brauzerning standart shriftiga** (odatda 16px) nisbatan hisoblanadi, sahifadagi `html { font-size }` ga emas.

Foydalanuvchi brauzer sozlamalarida shriftni 20px qilsa:

- `(min-width: 768px)` — hamon 768 piksel;
- `(min-width: 48em)` — 960 piksel, ya’ni maket kattalashgan matnga mos ravishda kechroq kengayadi.

Shu sabab ko‘p tajribali dasturchilar tanaffus nuqtalarini `em` da yozadi. `rem` ham media so‘rovda xuddi shunday ishlaydi.

## Nuqtalarni bir joyda saqlash

CSS o‘zgaruvchisini media so‘rov shartida ishlatib bo‘lmaydi (`@media (min-width: var(--md))` ishlamaydi). Shuning uchun nuqtalarni loyiha boshida kelishib olib, izohda yozib qo‘yish yoki CSS preprotsessor ishlatish odatiy.

```css
/* Tanaffus nuqtalari: 40em, 64em */
```

## Juda ko‘p nuqta — yomon belgi

Agar har 50 pikselda yangi so‘rov kerak bo‘lsa, maket yetarlicha suyuq emas. Avval `%`, `fr`, `minmax()`, `clamp()` bilan hal qilishga urinib ko‘ring.

Mashqda menyuning piksellardagi tanaffus nuqtasini `em` ga o‘tkazasiz va ikkinchi nuqta qo‘shasiz.
