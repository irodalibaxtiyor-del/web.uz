## Turlarni aylantirish

JavaScript turlarni ikki yo‘l bilan aylantiradi: siz **aniq** aytganda va o‘zi **jimgina**.

## Aniq aylantirish

### Songa

```js
Number('42')        // 42
Number('  42  ')    // 42 — chetdagi bo‘sh joylar e’tiborsiz
Number('')          // 0   — diqqat!
Number('12 500')    // NaN — o‘rtadagi bo‘sh joy
Number(true)        // 1
Number(null)        // 0
Number(undefined)   // NaN
+'42'               // 42 — unar plyus, qisqa yozuv
parseInt('12px')    // 12
parseFloat('3.5kg') // 3.5
```

### Satrga

```js
String(42)        // '42'
(42).toString()   // '42'
String(null)      // 'null'
String([1, 2])    // '1,2'
String({ a: 1 })  // '[object Object]'
`${42}`           // '42'
```

### Boolean’ga

```js
Boolean('')     // false
Boolean('0')    // true
!!'salom'       // true
```

## Jimgina (avtomatik) aylantirish

Operatorlar qiymatlarni o‘zi aylantiradi:

```js
'5' + 2     // '52'  — + satr bilan: satrga
'5' - 2     // 3     — boshqa arifmetika: songa
'5' * '2'   // 10
true + 1    // 2
[] + []     // ''
[] + {}     // '[object Object]'
'10' > 9    // true  — taqqoslashda songa
```

Bunday natijalar xatolarning asosiy manbai. Qoida: **o‘zingiz aniq aylantiring** — `Number(...)`, `String(...)` — va `===` ishlating.

## Aylantirish jadvali

| Qiymat        | `Number`   | `String`        | `Boolean` |
| ------------- | ---------- | --------------- | --------- |
| `''`          | `0`        | `''`            | `false`   |
| `'0'`         | `0`        | `'0'`           | `true`    |
| `'abc'`       | `NaN`      | `'abc'`         | `true`    |
| `null`        | `0`        | `'null'`        | `false`   |
| `undefined`   | `NaN`      | `'undefined'`   | `false`   |
| `[]`          | `0`        | `''`            | `true`    |
| `[5]`         | `5`        | `'5'`           | `true`    |

## Amaliy holat: narx matnini tozalash

Foydalanuvchi `12 500 so‘m` yozdi:

```js
const kiritma = '12 500 so‘m';
const toza = parseInt(kiritma.replaceAll(' ', '')); // 12500
const qqsBilan = Math.round(toza * 1.12);           // 14000
```

1. `replaceAll(' ', '')` — raqamlar orasidagi bo‘sh joylarni olib tashlaydi: `'12500so‘m'`;
2. `parseInt` — boshidagi raqamlarni oladi: `12500`;
3. `Math.round` — kasr aniqligi muammosini yo‘qotadi.

## Sanalar

```js
Number(new Date(2026, 0, 1)) // millisoniyalar
String(new Date(2026, 0, 1)) // 'Thu Jan 01 2026 00:00:00 GMT+0500 (...)'
```

## Aylantirish natijasini tekshirish

```js
const n = Number(kiritma);
if (Number.isNaN(n)) {
  // son emas — foydalanuvchiga xabar
}
```
