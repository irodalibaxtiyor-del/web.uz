## Media so‘rov qanday yoziladi

Media so‘rov — shart to‘g‘ri bo‘lsa, ichidagi qoidalarni qo‘llaydigan blok:

```css
@media (min-width: 768px) {
  .maket {
    grid-template-columns: 2fr 1fr;
  }
}
```

Shart qavs ichida yoziladi. Qavs ichidagi narsa **media xususiyati** deyiladi: `width`, `height`, `orientation`, `hover` va boshqalar.

## Klassik va diapazon yozuvi

Avval `min-` va `max-` prefikslari ishlatilardi. Zamonaviy brauzerlar matematikadagi kabi solishtirishni ham tushunadi:

| Klassik | Diapazon yozuvi | Ma’nosi |
| --- | --- | --- |
| `(min-width: 768px)` | `(width >= 768px)` | 768px va undan keng |
| `(max-width: 767px)` | `(width < 768px)` | 768px dan tor |
| `(min-width: 768px) and (max-width: 1023px)` | `(768px <= width < 1024px)` | Oraliq |

Diapazon yozuvining katta afzalligi — `<` va `<=` ni aniq tanlash mumkin. Klassik yozuvda chegaralar ustma-ust tushmasligi uchun 767/768 kabi juftlarni o‘ylab topish kerak edi.

## Shartlarni birlashtirish

```css
@media (width >= 768px) and (orientation: landscape) { … } /* ikkalasi ham */
@media (width < 400px), print { … }                         /* vergul — “yoki” */
@media not print { … }                                     /* “emas” */
```

## Media turi

Shartdan oldin **media turi** yozilishi mumkin: `screen` (ekran), `print` (chop etish) yoki `all` (hammasi, standart).

```css
@media screen and (min-width: 1024px) { … }
@media print {
  nav, .reklama { display: none; }
}
```

Tur yozilmasa, `all` deb olinadi. Ekran uchun yozilgan oddiy sahifalarda `screen` ni ko‘pincha tashlab ketishadi.

## Kaskad va tartib

Media so‘rov selektorning kuchini (specificity) oshirmaydi. Shuning uchun so‘rov ichidagi qoida asosiy qoidani yengishi uchun u CSS faylda **keyin** kelishi kerak:

```css
.yon { background: white; }

@media (width >= 768px) {
  .yon { background: #fff3cd; } /* keyin yozilgani uchun ustun */
}
```

Agar so‘rovni fayl boshiga qo‘ysangiz va asosiy qoida pastda bo‘lsa, so‘rov “ishlamayotgandek” ko‘rinadi.

## So‘rovni HTML’da ham berish mumkin

```html
<link rel="stylesheet" href="print.css" media="print">
```

Bunday fayl faqat shart bajarilganda qo‘llanadi (brauzer uni baribir yuklab qo‘yadi).

Mashqda diapazon yozuvi, oraliq so‘rov va `screen and` bilan ishlaysiz.

```tekshir
Zamonaviy diapazon yozuvida “600px dan 900px gacha” qanday yoziladi?
+ `@media (600px <= width <= 900px)`
- `@media (width: 600-900px)`
- `@media between(600px, 900px)`
> Klassik yozuv: `(min-width: 600px) and (max-width: 900px)`.
```

```jonli
<style>
  .s { padding: 10px; background: #eef4fb; }
  @media (600px <= width <= 900px) { .s { background: #f5a623; } }
</style>
<p class="s">600–900px oralig‘ida to‘q sariq bo‘ladi</p>
```
