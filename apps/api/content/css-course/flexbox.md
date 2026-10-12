## Flexbox bilan tanishuv

Flexbox — elementlarni **bir yo‘nalishda** (qator yoki ustun) joylashtirish uchun yaratilgan maket tizimi. U elementlar orasida joyni taqsimlash, ularni tekislash va o‘lchamini moslashtirishni osonlashtiradi.

Flexbox’dan oldin bunday ishlar `float`, `inline-block` va turli “hiylalar” bilan qilinardi. Bugun menyular, kartochka qatorlari, tugmalar guruhi, markazlash — deyarli hammasi Flexbox bilan.

## Konteyner va elementlar

```html
<div class="konteyner">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

```css
.konteyner {
  display: flex;
}
```

Shu bitta qator bilan:

- `.konteyner` — **flex konteyner** bo‘ladi;
- uning **bevosita** bolalari — **flex elementlar** bo‘ladi va bir qatorga tiziladi.

Nevaralarga (bolalarning bolalariga) flex ta’sir qilmaydi.

## Ikki o‘q

Flexbox’ni tushunishning kaliti — ikki o‘q:

```text
           asosiy o‘q (main axis) →
         ┌─────┬─────┬─────┐
kesuvchi │  1  │  2  │  3  │
o‘q  ↓   └─────┴─────┴─────┘
(cross axis)
```

| O‘q              | `flex-direction: row` da | Boshqaruvchi xususiyat |
| ---------------- | ------------------------ | ---------------------- |
| Asosiy (main)    | Gorizontal →             | `justify-content`      |
| Kesuvchi (cross) | Vertikal ↓               | `align-items`          |

`flex-direction: column` bo‘lsa, o‘qlar **almashadi**: asosiy o‘q vertikal bo‘ladi.

## Birinchi natijalar

```css
.konteyner {
  display: flex;
  justify-content: space-between; /* asosiy o‘q bo‘ylab */
  align-items: center;            /* kesuvchi o‘q bo‘ylab */
  gap: 16px;                      /* elementlar orasida */
}
```

## Standart xatti-harakat

`display: flex` dan keyin:

- elementlar qatorga tiziladi (`flex-direction: row`);
- konteyner balandligi bo‘yicha cho‘ziladi (`align-items: stretch`) — shuning uchun qo‘shni kartochkalar bir xil balandlikda bo‘ladi;
- kenglik kontentga qarab, kerak bo‘lsa siqiladi (`flex-shrink: 1`);
- qatorga sig‘masa ham keyingi qatorga o‘tmaydi (`flex-wrap: nowrap`).

## `inline-flex`

`display: inline-flex` — konteynerning o‘zi matn qatorida turadi (masalan, ikonkali tugma), ichi esa flex.

## Xulosa

- `display: flex` — bevosita bolalar bir qatorga tiziladi.
- Asosiy o‘q — `justify-content`, kesuvchi o‘q — `align-items`.
- `gap` — elementlar orasidagi masofa.
