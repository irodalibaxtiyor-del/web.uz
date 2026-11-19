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
<img src="https://picsum.photos/120/90" alt="" width="120" height="90" style="float: left; margin: 0 12px 6px 0">
<p>Rasm chapga suzmoqda, matn esa uning atrofidan oqib o‘tadi. Bu `float` ning asl vazifasi: gazeta va jurnallardagi kabi rasm atrofida matn. Matn yetarlicha uzun bo‘lsa, rasm ostidan to‘liq kenglikda davom etadi.</p>
```

## Xulosa

- `float` matnni element atrofidan oqizadi.
- Suzayotgan elementga kenglik va ichki tomondan margin bering.
- Maket uchun float emas, Flexbox va Grid ishlating.
