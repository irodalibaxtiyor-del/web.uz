## Tariflar bloki

Tariflar — lendingning ikkinchi muhim qismi. Kompyuterda uch tarif yonma-yon solishtiriladi, telefonda ustma-ust turadi.

## To‘r

```css
.tariflar {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: 16px;
}
```

1200px ekranda uch ustun, planshetda ikki (uchinchisi keyingi qatorda), telefonda bitta.

## Tavsiya etilgan tarif

Ko‘pincha bitta tarif ajratib ko‘rsatiladi: rangli chegara, “Mashhur” belgisi. Kompyuterda u o‘rtada turadi — ko‘z avval markazga tushadi. Telefonda esa foydalanuvchi uchta kartani ketma-ket aylantiradi, shuning uchun tavsiya etilganini **birinchi** qo‘yish mantiqiy:

```css
@media (max-width: 599px) {
  .tavsiya { order: -1; }
}
```

`order` faqat vizual tartibni o‘zgartiradi. Bu yerda bu maqbul: kartalar mustaqil, ularning tartibi ma’noga ta’sir qilmaydi.

## Kartaning ichi

```css
.tarif {
  display: flex;
  flex-direction: column;
}

.tarif .tugma {
  margin-top: auto;
}
```

Tariflardagi imkoniyatlar ro‘yxati har xil uzunlikda bo‘ladi. Tugmalar baribir bir qatorda — solishtirish oson.

## Narxni yozish

- Raqamni katta, birligini kichik yozing: **99 000** so‘m / oy.
- Ming xonalarini bo‘sh joy bilan ajrating: `99 000`, `99000` emas. Bo‘sh joy qator oxirida uzilib ketmasligi uchun `&nbsp;` ishlating.
- Raqamlarni `font-variant-numeric: tabular-nums` bilan tekislash mumkin.

## Imkoniyatlar ro‘yxati

Belgi (✓) o‘rniga ikonka ishlatsangiz, uni `aria-hidden="true"` qiling — ro‘yxat matni o‘zi yetarli. “Yo‘q” imkoniyatlarni kulrang va chizilgan qilish o‘rniga umuman yozmaslik ko‘pincha aniqroq.

## Telefonda solishtirish

Uch tarifni telefonda solishtirish qiyin. Yordam beradigan usullar:

- har bir kartada eng muhim 3–4 imkoniyat;
- pastda to‘liq solishtirish jadvali (o‘ramda aylanadigan);
- yoki tariflarni gorizontal aylanadigan qatorga qo‘yish (`overflow-x: auto` va `scroll-snap-type: x mandatory`).

Mashqda tariflar to‘rini yasaysiz va telefonda tavsiya etilgan tarifni birinchi qo‘yasiz.
