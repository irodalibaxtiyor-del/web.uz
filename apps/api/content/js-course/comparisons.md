## Taqqoslash operatorlari

| Operator | Ma’nosi                         | `x = 5` bo‘lsa      |
| -------- | ------------------------------- | ------------------- |
| `===`    | Qiymat **va tur** teng          | `x === 5` → `true`, `x === '5'` → `false` |
| `!==`    | Qiymat yoki tur teng emas       | `x !== '5'` → `true` |
| `==`     | Qiymat teng (tur aylantiriladi) | `x == '5'` → `true` |
| `!=`     | Qiymat teng emas                | `x != 8` → `true`   |
| `>` `<`  | Katta / kichik                  | `x > 3` → `true`    |
| `>=` `<=`| Katta yoki teng / kichik yoki teng | `x <= 5` → `true` |

## Doim `===`

`==` qiymatlarni solishtirishdan oldin turini **aylantiradi** va kutilmagan natijalar beradi:

```js
0 == ''          // true
0 == '0'         // true
'' == '0'        // false — mantiqsiz!
null == undefined // true
```

`===` bunday qilmaydi:

```js
0 === ''   // false
0 === '0'  // false
```

Qoida: **doim `===` va `!==`**. Input qiymatini son bilan solishtirishdan oldin `Number()` ga aylantiring.

## Satrlarni solishtirish

Satrlar harflar kodi bo‘yicha solishtiriladi:

```js
'b' > 'a'     // true
'B' < 'a'     // true — katta harflar oldin
'10' < '9'    // true — birinchi belgi '1' < '9'
10 < 9        // false — sonlar
```

Parolni solishtirish katta-kichik harfga sezgir: `'Web2026' === 'web2026'` → `false`.

## Mantiqiy operatorlar

| Operator | Nomi | Qachon `true`                     |
| -------- | ---- | --------------------------------- |
| `&&`     | VA   | Ikkala tomon ham `true`           |
| `||`     | YOKI | Kamida bittasi `true`             |
| `!`      | EMAS | Qiymat `false` bo‘lsa             |

```js
const yosh = 20;
const parolTogri = true;

yosh >= 18 && parolTogri   // true — ikkalasi ham
yosh < 7 || yosh >= 65     // false — hech biri
!parolTogri                // false
```

### Qisqa hisoblash

`&&` chap tomon `false` bo‘lsa, o‘ng tomonni **hisoblamaydi**. `||` chap tomon `true` bo‘lsa — xuddi shunday.

```js
foydalanuvchi && foydalanuvchi.ism // foydalanuvchi yo‘q bo‘lsa xato bermaydi
```

## Shartli (ternar) operator

Ikki qiymatdan birini tanlash uchun qisqa yozuv:

```js
shart ? agarRost : agarYolgon
```

```js
const turi = yosh < 7 || yosh >= 65 ? 'imtiyozli' : 'oddiy';
const xabar = ball >= 60 ? 'O‘tdi' : 'O‘tmadi';
```

Oddiy tanlov uchun qulay. Murakkab mantiq uchun `if` ishlating — ichma-ich ternarlarni o‘qish qiyin.

## `??` va `||` farqi

```js
0 || 10    // 10 — 0 falsy
0 ?? 10    // 0  — faqat null/undefined almashtiriladi
'' || 'Mehmon'  // 'Mehmon'
```

Standart qiymat berishda `0` yoki `''` haqiqiy qiymat bo‘lishi mumkin bo‘lsa, `??` to‘g‘riroq.
