## `Math` obyekti

`Math` — matematik konstantalar va funksiyalar to‘plami. Undan obyekt yaratilmaydi, to‘g‘ridan-to‘g‘ri ishlatiladi: `Math.round(...)`.

## Konstantalar

```js
Math.PI   // 3.141592653589793
Math.E    // 2.718281828459045
Math.SQRT2 // 1.4142135623730951
```

## Yaxlitlash

| Funksiya        | `4.4` | `4.5` | `4.7` | `-4.7` |
| --------------- | ----- | ----- | ----- | ------ |
| `Math.round`    | 4     | 5     | 5     | -5     |
| `Math.ceil`     | 5     | 5     | 5     | -4     |
| `Math.floor`    | 4     | 4     | 4     | -5     |
| `Math.trunc`    | 4     | 4     | 4     | -4     |

- `round` — eng yaqin butun songa;
- `ceil` — **yuqoriga** (“shift”);
- `floor` — **pastga** (“pol”);
- `trunc` — kasr qismini shunchaki olib tashlaydi.

### Qachon qaysi?

```js
// 100 kishi, avtobusga 45 kishi sig‘adi. Nechta avtobus kerak?
Math.ceil(100 / 45)  // 3 — 2.22 avtobus bo‘lmaydi, yuqoriga yaxlitlanadi

// 125 daqiqada nechta to‘liq soat bor?
Math.floor(125 / 60) // 2
```

### Kasr xonagacha yaxlitlash

```js
Math.round(28.2743 * 100) / 100 // 28.27 — son
(28.2743).toFixed(2)            // '28.27' — matn
```

## Daraja va ildiz

```js
Math.pow(2, 10) // 1024 (2 ** 10 bilan bir xil)
Math.sqrt(144)  // 12
Math.cbrt(27)   // 3
```

## Modul, ishora

```js
Math.abs(-7)   // 7
Math.sign(-7)  // -1
Math.sign(3)   // 1
```

## Eng katta va eng kichik

```js
Math.max(4, 12, 7)  // 12
Math.min(4, 12, 7)  // 4
Math.max()          // -Infinity
```

## Doira

```js
function doiraMaydoni(r) {
  return Math.PI * r ** 2;
}

doiraMaydoni(3).toFixed(2)  // '28.27'
doiraMaydoni(10).toFixed(2) // '314.16'
```

## Trigonometriya

```js
Math.sin(Math.PI / 2) // 1
Math.cos(0)           // 1
```

Burchaklar **radianda**: `gradus * Math.PI / 180`. Animatsiyalar va chizmalarda kerak bo‘ladi.

## Qiymatni chegarada ushlash

```js
function chegarala(x, min, max) {
  return Math.min(Math.max(x, min), max);
}

chegarala(150, 0, 100) // 100
chegarala(-5, 0, 100)  // 0
```

Masalan, progress foizi 0 dan kichik yoki 100 dan katta bo‘lmasligi uchun.
