## CSS Grid bilan tanishuv

CSS Grid — **ikki o‘lchamli** maket tizimi: u qatorlar va ustunlarni bir vaqtda boshqaradi. Flexbox bitta yo‘nalish (qator yoki ustun) uchun qulay bo‘lsa, Grid butun sahifa yoki kartochkalar to‘ri uchun.

| Flexbox                                   | Grid                                         |
| ----------------------------------------- | -------------------------------------------- |
| Bir o‘lchamli (qator **yoki** ustun)       | Ikki o‘lchamli (qator **va** ustun)          |
| Kontentdan boshlanadi: elementlar joy talab qiladi | Maketdan boshlanadi: avval to‘r, keyin elementlar |
| Menyular, tugmalar guruhi, kichik qismlar  | Sahifa maketi, galereyalar, kartochkalar to‘ri |

Ular raqib emas — ko‘pincha birga ishlatiladi: sahifa maketi Grid’da, uning ichidagi menyu Flexbox’da.

## Birinchi to‘r

```html
<div class="tor">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
</div>
```

```css
.tor {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
```

Natija — uch ustunli to‘r, elementlar chapdan o‘ngga, keyin keyingi qatorga avtomatik joylashadi.

## `fr` birligi

`fr` (fraction — ulush) — qolgan bo‘sh joyning bir ulushi:

```css
grid-template-columns: 2fr 1fr;        /* 2/3 va 1/3 */
grid-template-columns: 250px 1fr;      /* qat’iy yon panel + qolgan joy */
grid-template-columns: 1fr 1fr 1fr 1fr; /* to‘rt teng ustun */
```

`fr` foizdan qulayroq: `gap` ni o‘zi hisobga oladi, foizlarda esa yig‘indi 100% dan oshib ketishi mumkin.

## Atamalar

| Atama           | Ma’nosi                                          |
| --------------- | ------------------------------------------------ |
| Grid konteyner  | `display: grid` berilgan element                 |
| Grid element    | Konteynerning bevosita bolasi                    |
| Chiziq (line)   | Ustun va qatorlarni ajratuvchi chiziqlar (1 dan raqamlanadi) |
| Yo‘l (track)    | Ikki chiziq orasidagi ustun yoki qator            |
| Katak (cell)    | Bitta ustun va bitta qator kesishmasi            |
| Hudud (area)    | Bir nechta katakdan iborat to‘rtburchak          |

```text
   1     2     3     4   ← ustun chiziqlari
 1 ┌─────┬─────┬─────┐
   │     │     │     │
 2 ├─────┼─────┼─────┤
   │     │     │     │
 3 └─────┴─────┴─────┘
```

Uch ustunli to‘rda **to‘rtta** ustun chizig‘i bor.

## DevTools

Brauzer DevTools’ida grid konteyner yonida “grid” belgisi chiqadi. Uni bossangiz, chiziqlar va raqamlar sahifa ustida ko‘rinadi — o‘rganishda juda foydali.

## Xulosa

- Grid — ikki o‘lchamli maket: qatorlar va ustunlar.
- `display: grid` + `grid-template-columns` + `gap`.
- `fr` — qolgan joyning ulushi.
