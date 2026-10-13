## Ma’lumot turlari

JavaScript’dagi har bir qiymatning **turi** bor. Tur qiymat ustida qanday amallar mumkinligini belgilaydi.

| Tur         | Misol                     | `typeof` natijasi |
| ----------- | ------------------------- | ----------------- |
| `string`    | `'Salom'`, `"2026"`        | `'string'`        |
| `number`    | `42`, `3.14`, `-7`, `NaN`  | `'number'`        |
| `bigint`    | `12345678901234567890n`   | `'bigint'`        |
| `boolean`   | `true`, `false`           | `'boolean'`       |
| `undefined` | `undefined`               | `'undefined'`     |
| `null`      | `null`                    | `'object'` (!)    |
| `symbol`    | `Symbol('id')`            | `'symbol'`        |
| `object`    | `{ ism: 'Ali' }`, `[1, 2]` | `'object'`        |

Birinchi yettitasi — **oddiy (primitiv)** turlar, `object` — **murakkab** tur.

## `typeof` operatori

```js
typeof 'Toshkent'  // 'string'
typeof 2026        // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof { a: 1 }    // 'object'
typeof [1, 2, 3]   // 'object' — massiv ham obyekt
typeof null        // 'object' — tilning eski xatosi, shunday qoldirilgan
```

## Satr (`string`)

Qo‘shtirnoq ichidagi matn. `'2026'` — son emas, matn:

```js
'2026' + 1 // '20261'
```

## Son (`number`)

JavaScript’da butun va kasr sonlar uchun bitta tur bor:

```js
const yil = 2026;
const narx = 12.5;
const katta = 2e6;       // 2000000
Number('abc')            // NaN — “son emas”, lekin turi number
```

Juda katta butun sonlar uchun `bigint` bor (oxirida `n`).

## Mantiqiy (`boolean`)

Faqat ikki qiymat: `true` (rost) va `false` (yolg‘on). Taqqoslash natijasi doim boolean:

```js
const kattami = 18 > 16; // true
```

## `undefined` va `null`

- `undefined` — qiymat **berilmagan**: e’lon qilingan, lekin hech narsa yozilmagan o‘zgaruvchi.
- `null` — “bu yerda qiymat **yo‘q**” deb **ataylab** yozilgan qiymat.

```js
let manzil;            // undefined — hali berilmagan
let tanlanganKurs = null; // ataylab bo‘sh
```

## Dinamik turlar

Bitta o‘zgaruvchi turli vaqtda turli turdagi qiymat saqlashi mumkin:

```js
let x = 5;      // number
x = 'besh';     // string
```

Bu qulay, lekin xatoga sabab bo‘lishi mumkin. Shuning uchun o‘zgaruvchiga doim bir xil turdagi qiymat bering.

## Input qiymatining turi

Eng muhim amaliy fakt: `<input>` ning `value` si **doim `string`**, foydalanuvchi raqam yozsa ham:

```js
const kiritma = document.getElementById('son').value; // '42'
typeof kiritma           // 'string'
typeof Number(kiritma)   // 'number'
```
