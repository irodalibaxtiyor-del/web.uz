## Animatsiyalar: `@keyframes`

`transition` holat o‘zgarganda (hover, klass) ishlaydi. `animation` esa **o‘zi** ishga tushadi, takrorlanadi va ko‘p bosqichli bo‘lishi mumkin.

## 1-qadam: kadrlarni e’lon qilish

```css
@keyframes aylanish {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

`from` — 0%, `to` — 100%. Oraliq bosqichlar foizda yoziladi:

```css
@keyframes sakrash {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

## 2-qadam: elementga ulash

```css
.yuklanmoqda {
  animation: aylanish 1s linear infinite;
}
```

## Xususiyatlar

| Xususiyat                   | Vazifasi                       | Misol                    |
| --------------------------- | ------------------------------ | ------------------------ |
| `animation-name`            | `@keyframes` nomi              | `aylanish`               |
| `animation-duration`        | Bir sikl davomiyligi           | `1s`                     |
| `animation-timing-function` | Tezlik egri chizig‘i           | `linear`, `ease-in-out`  |
| `animation-delay`           | Kechikish                      | `0.5s`                   |
| `animation-iteration-count` | Necha marta                    | `3`, `infinite`          |
| `animation-direction`       | Yo‘nalish                      | `alternate` — oldinga-orqaga |
| `animation-fill-mode`       | Animatsiyadan oldin/keyin holat | `forwards` — oxirgi kadrda qoladi |
| `animation-play-state`      | To‘xtatish                     | `paused`                 |

## Paydo bo‘lish animatsiyasi

```css
@keyframes paydo {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

.xabar {
  animation: paydo 0.4s ease-out;
}
```

Faqat `from` yozilsa, `to` sifatida elementning odatiy uslubi olinadi.

## Kadrma-kadr: `steps()`

```css
.yurish {
  animation: kadrlar 0.8s steps(8) infinite;
}
```

`steps(8)` silliq o‘tish o‘rniga 8 ta keskin sakrash qiladi — sprayt animatsiyalari uchun (8-modul).

## Hover’da to‘xtatish

```css
.lenta:hover {
  animation-play-state: paused;
}
```

## Foydalanish qulayligi

- Cheksiz harakatlanuvchi narsalar diqqatni chalg‘itadi. 5 soniyadan uzoq davom etadigan harakat uchun to‘xtatish imkoniyati bo‘lishi kerak.
- Soniyasiga 3 martadan ko‘p miltillash xavfli — ba’zi odamlarda tutqanoq qo‘zg‘atishi mumkin.
- Harakatni kamaytirishni xohlaganlar uchun:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

## Xulosa

- `@keyframes nom { from {…} to {…} }` — kadrlar.
- `animation: nom davomiylik egri takror;` — ulash.
- `infinite`, `alternate`, `forwards`, `steps()` — foydali qiymatlar.
- `prefers-reduced-motion` ni hurmat qiling.
