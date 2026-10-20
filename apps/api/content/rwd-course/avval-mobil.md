## Avval mobil (mobile first)

Ikki xil yo‘l bor:

- **Avval kompyuter** — sahifa katta ekran uchun yoziladi, keyin `max-width` so‘rovlari bilan telefon uchun “qirqiladi”.
- **Avval mobil** — standart uslub eng kichik ekran uchun yoziladi, keyin `min-width` so‘rovlari bilan kattaroq ekranlar uchun **qo‘shiladi**.

Zamonaviy amaliyotda ikkinchisi afzal.

## Nega avval mobil?

1. **Oddiydan murakkabga.** Telefonda maket odatda bitta ustun — eng sodda holat. Murakkablikni keyin qo‘shish osonroq.
2. **Kamroq kod.** Bekor qilinadigan qoidalar kamayadi: katta ekran uslubini telefonda “o‘chirish” kerak bo‘lmaydi.
3. **Muhim narsaga e’tibor.** Kichik ekranda faqat eng kerakli kontent sig‘adi — bu dizaynni tozalaydi.
4. **Tezlik.** Telefon kam ishlatiladigan og‘ir uslublarni yuklamaydi.

## Taqqoslash

Avval kompyuter:

```css
.kartalar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 999px) {
  .kartalar { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 599px) {
  .kartalar { grid-template-columns: 1fr; }
}
```

Avval mobil:

```css
.kartalar {
  display: grid;
  gap: 16px; /* standart holda bitta ustun */
}

@media (min-width: 600px) {
  .kartalar { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1000px) {
  .kartalar { grid-template-columns: repeat(3, 1fr); }
}
```

Grid’da `grid-template-columns` berilmasa, bitta ustun bo‘ladi — shuning uchun mobil holat uchun hech narsa yozish shart emas.

## Chegaralar qanday ishlaydi

`min-width: 600px` — “kamida 600px”. 599px da so‘rov ishlamaydi, 600px da ishlaydi. Shu sabab `max-width` bilan birga ishlatilganda chegaralar ustma-ust tushmasligi uchun 599/600 kabi juftlar tanlanadi.

## Ish tartibi

1. Brauzer oynasini 360px qilib, sahifani tayyorlang.
2. Oynani asta-sekin kengaytiring.
3. Maket bo‘shab, keng va noqulay bo‘la boshlagan joyda `min-width` so‘rovi qo‘shing.

Mashqda “faqat kompyuter uchun” yozilgan kartalar to‘rini avval mobil yondashuvida qayta yozasiz.
