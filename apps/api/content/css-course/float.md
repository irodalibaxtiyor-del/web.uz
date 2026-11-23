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

```tekshir
Bugun sahifa maketini (ustunlarni) qurish uchun nima tavsiya etiladi?
- `float`
+ Flexbox yoki Grid
- `position: absolute`
> `float` matnni rasm atrofidan oqizish uchun qoldi; maket uchun Flexbox va Grid.
```

```jonli
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27120%27%20height=%2790%27%20viewBox=%270%200%20120%2090%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%238e44ad%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ff7f50%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27120%27%20height=%2790%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%2786%27%20cy=%2727%27%20r=%2714%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%2090%20L0%2063%20L42%2041%20L72%2068%20L96%2054%20L120%2072%20L120%2090%20Z%27%20fill=%27%232c1b3a%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" width="120" height="90" style="float: left; margin: 0 12px 6px 0">
<p>Rasm chapga suzmoqda, matn esa uning atrofidan oqib o‘tadi. Bu `float` ning asl vazifasi: gazeta va jurnallardagi kabi rasm atrofida matn. Matn yetarlicha uzun bo‘lsa, rasm ostidan to‘liq kenglikda davom etadi.</p>
```

## Xulosa

- `float` matnni element atrofidan oqizadi.
- Suzayotgan elementga kenglik va ichki tomondan margin bering.
- Maket uchun float emas, Flexbox va Grid ishlating.
