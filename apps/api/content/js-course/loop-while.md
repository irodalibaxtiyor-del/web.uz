## `while` sikli

Shart `true` ekan, tana takrorlanadi:

```js
while (shart) {
  // tana
}
```

Necha marta aylanishi **oldindan noma’lum** bo‘lganda ishlatiladi: “maqsadga yetguncha”, “ma’lumot tugaguncha”.

## Jamg‘arma misoli

Yiliga 12% foyda bilan 1 000 000 so‘m necha yilda 2 000 000 bo‘ladi?

```js
let summa = 1000000;
const maqsad = 2000000;
const foiz = 12;
let yillar = 0;

while (summa < maqsad) {
  summa += summa * foiz / 100;
  yillar++;
}
// yillar: 7
```

## Cheksiz siklga ehtiyot bo‘ling

Agar `foiz` `0` bo‘lsa, `summa` hech qachon o‘smaydi va sikl **cheksiz** aylanadi. Siklni boshlashdan oldin bunday holatni tekshiring:

```js
if (foiz <= 0) {
  natija = 'Hech qachon';
} else {
  // while sikli
}
```

Har bir `while` uchun o‘zingizga savol bering: “shart qachon `false` bo‘ladi va har aylanishda unga yaqinlashyapmanmi?”

## `do...while`

Tana **kamida bir marta** bajariladi, shart oxirida tekshiriladi:

```js
let son = 2026;
let raqamlarYigindisi = 0;

do {
  raqamlarYigindisi += son % 10;      // oxirgi raqam
  son = Math.floor(son / 10);         // oxirgi raqamni olib tashlash
} while (son > 0);
// 2 + 0 + 2 + 6 = 10
```

`son = 0` bo‘lsa ham tana bir marta ishlaydi — `do...while` shu farq uchun.

## `for` va `while` — bir xil narsa

```js
for (let i = 0; i < 5; i++) { /* ... */ }

let i = 0;
while (i < 5) {
  /* ... */
  i++;
}
```

Hisoblagich bo‘lsa — `for` aniqroq. Shart bo‘yicha (“yetguncha”) — `while`.

## Raqamlarni ajratish

`% 10` va `Math.floor(/ 10)` — sonni raqamlarga ajratishning klassik usuli:

| `son` | `son % 10` | `Math.floor(son / 10)` |
| ----- | ---------- | ---------------------- |
| 2026  | 6          | 202                    |
| 202   | 2          | 20                     |
| 20    | 0          | 2                      |
| 2     | 2          | 0 — to‘xtash           |

Muqobil: `String(2026)` ni `for...of` bilan aylanib, har bir belgini `Number` ga aylantirish.
