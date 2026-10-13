## Operatorlar

**Operator** — qiymatlar ustida amal bajaradigan belgi. `2 + 3` da `+` — operator, `2` va `3` — operandlar.

## Asosiy guruhlar

| Guruh          | Operatorlar                         | Misol            | Natija    |
| -------------- | ----------------------------------- | ---------------- | --------- |
| Arifmetik      | `+ - * / % **`                      | `10 % 3`         | `1`       |
| Tayinlash      | `= += -= *= /=`                     | `x += 5`         | `x` 5 ga oshadi |
| Taqqoslash     | `== === != !== > < >= <=`           | `7 > 5`          | `true`    |
| Mantiqiy       | `&& || !`                           | `true && false`  | `false`   |
| Satr           | `+ +=`                              | `'Web' + 'dizayn'` | `'Webdizayn'` |
| Tur            | `typeof`                            | `typeof 5`       | `'number'` |

Har bir guruhni alohida darslarda chuqurroq ko‘ramiz. Bu darsda — eng ko‘p chalkashlik beradigan joy: **`+`**.

## `+` ikki xil ishlaydi

```js
5 + 2        // 7 — ikkalasi son: qo‘shish
'5' + '2'    // '52' — ikkalasi matn: ulash
'5' + 2      // '52' — bittasi matn bo‘lsa ham: ulash
5 + 2 + '1'  // '71' — chapdan o‘ngga: avval 7, keyin '7' + '1'
'1' + 5 + 2  // '152'
```

Qolgan arifmetik operatorlar matnni songa aylantiradi:

```js
'10' - 2   // 8
'10' * '2' // 20
'10' / 2   // 5
```

## Input qiymati — doim matn

```js
const a = document.getElementById('a').value; // '7' — matn!
const b = document.getElementById('b').value; // '5'
a + b // '75'
```

Son sifatida qo‘shish uchun avval **songa aylantiring**:

```js
const a = Number(document.getElementById('a').value); // 7
const b = Number(document.getElementById('b').value); // 5
a + b // 12
```

`Number('abc')` → `NaN` (“son emas”). Bo‘sh maydon esa `Number('')` → `0`.

## Taqqoslash natijasi — `true` yoki `false`

```js
7 > 5    // true
7 < 5    // false
7 >= 7   // true
```

Natijani sahifaga yozsangiz, matn sifatida `true`/`false` chiqadi:

```js
document.getElementById('katta').textContent = 7 > 5; // true
```

## `==` va `===`

```js
5 == '5'   // true  — turlarni aylantirib solishtiradi
5 === '5'  // false — tur ham teng bo‘lishi kerak
```

Doim **`===`** va **`!==`** ishlating — kutilmagan aylantirishlar xatoga olib keladi. Batafsil — “Taqqoslash” darsida.

## Mantiqiy operatorlar (qisqacha)

```js
const yosh = 20;
yosh >= 18 && yosh < 60 // true — ikkalasi ham to‘g‘ri
yosh < 7 || yosh > 65   // false — hech biri to‘g‘ri emas
!(yosh > 18)            // false — inkor
```
