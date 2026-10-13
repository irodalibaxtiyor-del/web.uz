## Mantiqiy qiymatlar (boolean)

`boolean` turida faqat ikki qiymat bor: `true` (rost) va `false` (yolg‘on). Dasturdagi har bir **qaror** shularga asoslanadi: “foydalanuvchi kirganmi?”, “ball yetarlimi?”, “maydon bo‘shmi?”.

```js
const kirgan = true;
const toliq = false;
```

## Taqqoslash natijasi — boolean

```js
10 > 9         // true
'a' === 'b'    // false
const otdi = ball >= 60; // true yoki false
```

## `Boolean()` — har qanday qiymatni boolean’ga aylantirish

```js
Boolean(1)        // true
Boolean('salom')  // true
Boolean(0)        // false
Boolean('')       // false
```

## Falsy qiymatlar

JavaScript’da faqat **8 ta** qiymat `false` ga aylanadi — ular **falsy** deyiladi:

| Qiymat        | Izoh                         |
| ------------- | ---------------------------- |
| `false`       |                              |
| `0`, `-0`     | nol                          |
| `0n`          | BigInt nol                   |
| `''`          | bo‘sh satr                   |
| `null`        |                              |
| `undefined`   |                              |
| `NaN`         |                              |

Qolgan **hamma** narsa — **truthy**: `'0'`, `'false'`, `' '` (bo‘sh joy), `[]`, `{}`, `-1`.

```js
Boolean('0')     // true — bo‘sh bo‘lmagan satr!
Boolean(' ')     // true
Boolean([])      // true — bo‘sh massiv ham
Boolean(Number('0')) // false — 0 son
```

## Nega bu muhim?

Shartlarda (`if`) qiymat avtomatik boolean’ga aylanadi:

```js
const ism = document.getElementById('ism').value;
if (ism) {
  // ism bo‘sh emas
}
```

Lekin ehtiyot bo‘ling: input’ga `0` yozilsa, `value` — `'0'` (truthy), `Number(value)` esa `0` (falsy).

## `!` va `!!`

```js
!true       // false
!''         // true — bo‘sh satr “yo‘q” degani
!!'salom'   // true — ikki marta inkor = Boolean('salom')
```

## Boolean obyekti

```js
const a = false;
const b = new Boolean(false); // obyekt!
Boolean(b) // true — obyekt doim truthy
```

`new Boolean` ishlatmang: kutilmagan natija beradi va sekinroq.

## Sahifada boolean

`textContent` ga yozilganda `true`/`false` matn bo‘lib chiqadi. Foydalanuvchiga odatda tushunarli matn ko‘rsatiladi — buni shartlar bilan qilamiz:

```js
document.getElementById('holat').textContent = otdi ? 'O‘tdi' : 'O‘tmadi';
```
