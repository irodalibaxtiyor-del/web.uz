## Massivda qidirish

## `indexOf` va `includes`

Oddiy qiymatlar (satr, son) uchun:

```js
const ismlar = ['Ali', 'Madina', 'Jasur'];
ismlar.indexOf('Madina')    // 1
ismlar.indexOf('Bobur')     // -1
ismlar.includes('Jasur')    // true
ismlar.lastIndexOf('Ali')   // 0
```

Solishtirish `===` bilan: `'ali'` va `'Ali'` — har xil.

## `find` — shart bo‘yicha birinchi element

Obyektlar massivida qiymatni `indexOf` bilan topib bo‘lmaydi — **shart** kerak. `find` ga funksiya beriladi; u har bir element uchun chaqiriladi va `true` qaytargan birinchi elementni `find` qaytaradi:

```js
const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
  { ism: 'Jasur', ball: 67 },
];

const topildi = talabalar.find(function (t) {
  return t.ism === 'Madina';
});
// { ism: 'Madina', ball: 92 }
```

Hech biri mos kelmasa — `undefined`.

### Qisqa yozuv (arrow funksiya)

Xuddi shu narsani qisqaroq yozish mumkin:

```js
const topildi = talabalar.find((t) => t.ism === 'Madina');
```

`(t) => ...` — **arrow funksiya**. Batafsil alohida darsda; hozircha ikkalasi bir xil ishlashini bilish yetarli.

## Topilmasa

```js
const t = talabalar.find(function (x) {
  return x.ism === 'Bobur';
});

t.ball      // TypeError: Cannot read properties of undefined
t?.ball     // undefined — xato yo‘q
t?.ball ?? 'Topilmadi' // 'Topilmadi'
```

`?.` va `??` birga — “topilsa qiymat, topilmasa standart”.

## `findIndex` va `findLast`

```js
talabalar.findIndex(function (t) {
  return t.ball > 90;
}); // 1 — Madina indeksi

talabalar.findLast(function (t) {
  return t.ball > 80;
}); // { ism: 'Madina', ball: 92 } — oxiridan birinchisi
```

## `some` va `every`

```js
talabalar.some(function (t) {
  return t.ball < 70;
}); // true — kamida bittasi

talabalar.every(function (t) {
  return t.ball >= 60;
}); // true — hammasi
```

## Qaysi biri?

| Kerak                               | Metod             |
| ----------------------------------- | ----------------- |
| Oddiy qiymat bormi?                 | `includes`        |
| Oddiy qiymat qayerda?               | `indexOf`         |
| Shartga mos birinchi element        | `find`            |
| Uning indeksi                       | `findIndex`       |
| Kamida bittasi / hammasi mosmi?     | `some` / `every`  |
| Mos kelganlarning **hammasi**       | `filter` (keyingi darslarda) |

## Katta-kichik harfsiz qidirish

```js
const qidiruv = 'madina';
const t = talabalar.find(function (x) {
  return x.ism.toLowerCase() === qidiruv.toLowerCase();
});
```
