## Sintaksis — tilning qoidalari

**Sintaksis** — kod qanday yozilishi kerakligi haqidagi qoidalar. Bitta qoida buzilsa (masalan, qo‘shtirnoq yopilmasa), brauzer **butun skriptni** bajarmaydi va konsolda `SyntaxError` chiqaradi.

## Qiymatlar

JavaScript’da ikki turdagi qiymat bor:

- **literallar** — kodga to‘g‘ridan-to‘g‘ri yozilgan qiymatlar;
- **o‘zgaruvchilar** — qiymat saqlanadigan nomlangan joylar.

```js
10.5          // son
2026          // son
'Toshkent'    // matn (satr) — bittalik qo‘shtirnoqda
"Samarqand"   // matn — qo‘shtirnoqda ham bo‘ladi
```

Matn har doim qo‘shtirnoq ichida bo‘lishi va **o‘sha belgi** bilan yopilishi kerak: `'Ali'` to‘g‘ri, `'Ali"` — xato.

## O‘zgaruvchilar

```js
let shahar;
shahar = 'Buxoro';
let aholi = 280000;
```

`let` — o‘zgaruvchi e’lon qiladi, `=` — unga qiymat beradi.

## Ifodalar

**Ifoda** — qiymatga aylanadigan kod bo‘lagi:

```js
5 * 10                 // 50
2026 - 2006            // 20
'Ali' + ' ' + 'Valiyev' // 'Ali Valiyev'
```

`+` sonlarni qo‘shadi, matnlarni esa **ulaydi** (konkatenatsiya).

## Nomlar (identifikatorlar)

O‘zgaruvchi va funksiya nomlari uchun qoidalar:

- harf, `_` yoki `$` bilan boshlanadi, keyin raqam ham bo‘lishi mumkin: `narx2`, `_ichki`, `$tugma`;
- raqam bilan boshlanmaydi: `2narx` — xato;
- bo‘sh joy va chiziqcha bo‘lmaydi: `tug‘ilgan-yil` — xato;
- kalit so‘zlar (`let`, `if`, `for`...) nom bo‘la olmaydi.

## Katta-kichik harf farqi

JavaScript **katta-kichik harfni farqlaydi**. `ism` va `Ism` — ikki boshqa o‘zgaruvchi:

```js
let ism = 'Ali';
document.getElementById('x').textContent = Ism; // ReferenceError: Ism is not defined
```

`getElementById` ni `getElementByID` deb yozish ham xato.

## camelCase

Bir nechta so‘zdan iborat nomlar JavaScript’da odatda **camelCase** uslubida yoziladi — birinchi so‘z kichik, keyingilari katta harf bilan:

```js
let tugilganYil = 2006;
let toliqIsm = 'Ali Valiyev';
let kursNarxi = 450000;
```

## Xatoni qanday topish kerak

1. Konsolni oching (mashq sahifasida — **Konsol** paneli).
2. Xato matnini o‘qing: `SyntaxError` — yozuv xatosi, `ReferenceError` — bunday nom yo‘q.
3. Qator raqamiga qarang va o‘sha qatorni tekshiring: qo‘shtirnoqlar, qavslar, nomlarning yozilishi.
