## Sonlar

JavaScript’da barcha sonlar — butun ham, kasr ham — bitta `number` turida saqlanadi:

```js
const yil = 2026;
const narx = 12.5;
const katta = 15e6;   // 15000000
const kichik = 25e-3; // 0.025
```

## Kasr sonlarning aniqligi

Kompyuter sonlarni ikkilik sanoq tizimida saqlaydi. Ba’zi o‘nlik kasrlar ikkilikda **aniq** ifodalanmaydi:

```js
0.1 + 0.2          // 0.30000000000000004
0.1 + 0.2 === 0.3  // false!
```

Bu JavaScript’ning xatosi emas — deyarli barcha tillarda shunday. Yechimlar:

```js
(0.1 * 10 + 0.2 * 10) / 10   // 0.3 — butun sonlarga aylantirib hisoblash
(0.1 + 0.2).toFixed(2)       // '0.30' — ko‘rsatishda yaxlitlash
```

> Pul bilan ishlaganda summani eng kichik birlikda (tiyin, sent) **butun son** sifatida saqlash xavfsizroq.

## Butun sonlar chegarasi

`number` 15 xonagacha butun sonni aniq saqlaydi:

```js
999999999999999   // 999999999999999
9999999999999999  // 10000000000000000 — aniqlik yo‘qoldi
Number.MAX_SAFE_INTEGER // 9007199254740991
```

Undan katta butun sonlar uchun `BigInt`: `12345678901234567890n`.

## Son va satr

```js
10 + 20       // 30
'10' + 20     // '1020' — ulash
'10' - 2      // 8     — ayirish matnni songa aylantiradi
'10' * '2'    // 20
'olma' * 2    // NaN
```

## `NaN` — “son emas”

Noto‘g‘ri arifmetik amal natijasi:

```js
Number('abc')   // NaN
0 / 0           // NaN
typeof NaN      // 'number' — g‘alati, lekin shunday
NaN === NaN     // false — NaN o‘ziga ham teng emas!
```

Tekshirish uchun `isNaN` yoki aniqroq `Number.isNaN`:

```js
isNaN(Number('abc'))         // true
Number.isNaN(Number('12'))   // false
```

`NaN` bilan har qanday amal yana `NaN` beradi — xato butun hisobga tarqaladi.

## `Infinity`

```js
1 / 0       // Infinity
-1 / 0      // -Infinity
2 ** 1024   // Infinity
```

## Butun sonmi?

```js
Number.isInteger(5)    // true
Number.isInteger(5.5)  // false
```

## Input’dan son olish

```js
const kiritma = document.getElementById('a').value; // matn
const son = Number(kiritma);
isNaN(son) // foydalanuvchi son yozmagan bo‘lsa — true
```

`Number('')` → `0` ekanini unutmang: bo‘sh maydon xato emas, nol bo‘lib qoladi.
