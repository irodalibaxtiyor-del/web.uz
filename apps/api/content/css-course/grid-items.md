## Grid elementlarni joylashtirish

Standart holda elementlar kataklarga birma-bir joylashadi. Lekin har bir elementga **aniq joy** va **o‘lcham** berish mumkin.

## Chiziqlar bo‘yicha

```css
.sarlavha {
  grid-column: 1 / 4; /* 1-chiziqdan 4-chiziqqacha — 3 ustun */
}

.yon {
  grid-row: 2 / 4;    /* 2 qator balandligida */
}
```

`grid-column` — `grid-column-start / grid-column-end` ning qisqa yozuvi.

### Manfiy chiziq

`-1` — **oxirgi** chiziq. Ustunlar soni qancha bo‘lishidan qat’i nazar:

```css
.toliq {
  grid-column: 1 / -1; /* butun kenglik */
}
```

## `span` — nechta yo‘l

```css
.katta {
  grid-column: span 2; /* 2 ustun egallaydi */
  grid-row: span 2;    /* 2 qator egallaydi */
}
```

Boshlanish joyini brauzer o‘zi tanlaydi. Galereyada ba’zi rasmlarni kattaroq ko‘rsatish uchun qulay.

## Ustma-ust qo‘yish

Ikki element bir xil katakka joylashtirilsa, ular ustma-ust tushadi — keyingisi ustda (yoki `z-index` bilan):

```css
.rasm,
.yozuv {
  grid-area: 1 / 1;
}

.yozuv {
  align-self: end;
}
```

Rasm ustidagi yozuv — `position: absolute` siz.

## Bitta elementni tekislash

| Xususiyat      | O‘q        |
| -------------- | ---------- |
| `justify-self` | Gorizontal |
| `align-self`   | Vertikal   |
| `place-self`   | Ikkalasi   |

```css
.belgi {
  justify-self: end;
  align-self: start;
}
```

## Zich joylashtirish

Turli o‘lchamli elementlar orasida bo‘sh kataklar qolsa:

```css
.galereya {
  grid-auto-flow: dense;
}
```

Brauzer keyingi kichik elementlar bilan bo‘sh joylarni to‘ldiradi. Esda tuting: ko‘rinishdagi tartib HTML tartibidan farq qilishi mumkin.

## `order`

Flexbox’dagidek, `order` grid’da ham ishlaydi — va xuddi shunday faqat vizual.

```tekshir
Element to‘rning butun kengligini egallashi uchun nima yoziladi?
+ `grid-column: 1 / -1`
- `grid-column: all`
- `width: 100vw`
> `-1` — oxirgi chiziq; 1-chiziqdan oxirgisigacha.
```

```jonli
<style>
  .g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .g div { background: #eef4fb; padding: 10px; }
  .keng { grid-column: 1 / -1; background: #ffe08a !important; }
  .ikki { grid-column: span 2; background: #b7ebc6 !important; }
</style>
<div class="g"><div class="keng">1 / -1</div><div class="ikki">span 2</div><div>1</div><div>2</div><div>3</div><div>4</div></div>
```

## Xulosa

- `grid-column: 1 / 3`, `grid-row: 2 / 4` — chiziqlar bo‘yicha.
- `1 / -1` — butun kenglik, `span 2` — ikki yo‘l.
- `grid-area: 1 / 1` — ustma-ust qo‘yish.
- `justify-self`, `align-self` — bitta elementni tekislash.
