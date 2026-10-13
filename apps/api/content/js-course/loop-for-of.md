## `for...of` — qiymatlar bo‘ylab

`for...of` **iteratsiya qilinadigan** narsaning (massiv, satr, Set, Map) har bir **qiymati** bo‘ylab aylanadi:

```js
const kurslar = ['HTML', 'CSS', 'JavaScript'];

for (const kurs of kurslar) {
  console.log(kurs);
}
```

Indeks hisoblagich, `length`, `[i]` — hech biri kerak emas. Shuning uchun `for...of` o‘qish uchun eng sodda.

## `in` va `of` farqi

```js
const a = ['x', 'y'];
for (const k in a) console.log(k); // '0', '1' — kalitlar
for (const v of a) console.log(v); // 'x', 'y' — qiymatlar
```

Eslab qolish: **of** — qiymat**lar** (massivlar), **in** — kalit**lar** (obyektlar).

## Satr bo‘ylab

Satr ham iteratsiya qilinadi — har bir belgi bo‘ylab:

```js
let unlilar = 0;
for (const harf of 'Toshkent'.toLowerCase()) {
  if ('aeiou'.includes(harf)) unlilar++;
}
// 2 — o va e
```

### Satrni teskari aylantirish

```js
let teskari = '';
for (const harf of 'Samarqand') {
  teskari = harf + teskari; // har yangi harf boshiga
}
// 'dnaqramaS'
```

## Eng uzun so‘z

```js
let engUzun = '';
for (const soz of 'HTML CSS JavaScript'.split(' ')) {
  if (soz.length > engUzun.length) engUzun = soz;
}
// 'JavaScript'
```

“Hozirgacha eng yaxshisi”ni saqlab borish — juda ko‘p uchraydigan usul (maksimum, minimum, eng uzun).

## Indeks ham kerak bo‘lsa

```js
for (const [i, kurs] of kurslar.entries()) {
  console.log(i + 1 + '. ' + kurs);
}
```

## `forEach` bilan farqi

| `for...of`                               | `forEach`                         |
| ---------------------------------------- | --------------------------------- |
| `break`, `continue` ishlaydi             | to‘xtatib bo‘lmaydi               |
| satr, Set, Map bilan ham                 | faqat massiv (va ba’zi ro‘yxatlar) |
| `await` ichida ishlaydi                  | `await` bilan muammoli            |

## Obyekt bilan — xato

```js
for (const x of { a: 1 }) {} // TypeError: object is not iterable
```

Oddiy obyekt iteratsiya qilinmaydi. `Object.keys`, `Object.values` yoki `Object.entries` ni aylaning.
