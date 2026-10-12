## Suzish: `float`

`float` dastlab gazetadagidek **matnni rasm atrofidan oqizish** uchun yaratilgan:

```css
.maqola img {
  float: left;
  margin: 0 16px 8px 0;
}
```

Rasm chapga “suzib” ketadi, uning yonidagi matn esa rasmni o‘rab oladi.

| Qiymat  | Natija                        |
| ------- | ----------------------------- |
| `left`  | Chapga suzadi                 |
| `right` | O‘ngga suzadi                 |
| `none`  | Suzmaydi (standart)           |

## Margin muhim

Suzayotgan element matnga yopishib qolmasligi uchun uning **ichki tomoniga** margin beriladi: chapga suzsa — o‘ng margin, o‘ngga suzsa — chap margin.

```css
.iqtibos {
  float: right;
  width: 40%;
  margin-left: 16px;
}
```

Suzayotgan elementga kenglik bering, aks holda u kontentiga qarab kengayib, butun qatorni egallashi mumkin.

## Float va maket

Bir paytlar butun sahifa maketi (ustunlar, menyular) `float` bilan qurilardi. Bu ko‘p muammoga sabab bo‘lardi: ota element balandligini yo‘qotardi, ustunlar balandligi har xil bo‘lardi. Bugun maket uchun **Flexbox va Grid** ishlatiladi.

`float` ning hozirgi asosiy vazifasi — matnni rasm yoki iqtibos atrofidan oqizish.

## Ota balandligi muammosi

Suzayotgan element oqimdan qisman chiqadi. Agar ota elementda faqat suzayotgan bola bo‘lsa, ota **nol balandlikka** tushadi:

```html
<div class="quti">
  <img class="chap" src="…" alt="…">
</div>
```

Bu muammoning yechimi keyingi darsda.

## Xulosa

- `float` matnni element atrofidan oqizadi.
- Suzayotgan elementga kenglik va ichki tomondan margin bering.
- Maket uchun float emas, Flexbox va Grid ishlating.
