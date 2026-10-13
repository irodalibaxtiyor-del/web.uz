## Sanalar

Sana va vaqt `Date` obyektida saqlanadi:

```js
const hozir = new Date(); // joriy sana va vaqt
```

## Sana yaratish

```js
new Date(2026, 8, 1)            // 2026-yil 1-sentabr, 00:00
new Date(2026, 8, 1, 14, 30)    // 14:30
new Date(2026, 0, 1)            // 1-yanvar
```

> **Diqqat:** oylar **0 dan** sanaladi: `0` — yanvar, `8` — sentabr, `11` — dekabr. Kunlar esa 1 dan.

Argumentlar tartibi: yil, oy, kun, soat, daqiqa, soniya, millisoniya.

## Sana ichida — millisoniyalar

`Date` aslida bitta sonni saqlaydi: 1970-yil 1-yanvardan (UTC) beri o‘tgan **millisoniyalar**:

```js
new Date(2026, 8, 1).getTime() // juda katta son (vaqt zonangizga bog‘liq)
Date.now()                     // hozirgi vaqt millisoniyada
new Date(0)                    // 1970-01-01T00:00:00Z
```

## Ikki sana orasidagi farq

Sanalarni ayirsangiz, millisoniyalardagi farq chiqadi:

```js
const boshlanish = new Date(2026, 8, 1);
const tugash = new Date(2026, 11, 31);

const ms = tugash - boshlanish;
const kun = Math.round(ms / (1000 * 60 * 60 * 24)); // 121
```

`1000 * 60 * 60 * 24` — bir kundagi millisoniyalar. `Math.round` yozgi/qishki vaqtga o‘tish bo‘ladigan mamlakatlarda bir soatlik farqni tekislaydi.

## Oshib ketgan qiymatlar

`Date` ortiqcha qiymatni o‘zi keyingi oyga yoki yilga o‘tkazadi:

```js
new Date(2026, 8, 31)       // 1-oktabr — sentabrda 30 kun
new Date(2026, 8, 1 + 30)   // 1-oktabr
new Date(2026, 12, 1)       // 2027-yil 1-yanvar
new Date(2026, 2, 0)        // 28-fevral — 0-kun = oldingi oyning oxirgi kuni
```

Bu kun qo‘shishni juda osonlashtiradi.

## Matnga aylantirish

```js
const d = new Date(2026, 8, 1);
d.toDateString()   // 'Tue Sep 01 2026'
d.toString()       // 'Tue Sep 01 2026 00:00:00 GMT+0500 (...)'
d.toISOString()    // '2026-08-31T19:00:00.000Z' — UTC! (Toshkentda 5 soat farq)
```

`toDateString` vaqt zonasidan qat’i nazar mahalliy kunni ko‘rsatadi. `toISOString` esa **UTC** da yozadi: Toshkentdagi yarim tun UTC bo‘yicha hali oldingi kun.

## Vaqt zonasi

- `new Date(2026, 8, 1)` — **sizning** vaqt zonangizdagi yarim tun.
- Serverda, boshqa davlatdagi foydalanuvchida yoki testlarda vaqt zonasi boshqacha bo‘lishi mumkin.

Shuning uchun sana bilan ishlaydigan kodni sinashda **qat’iy sanalar** ishlatiladi, `new Date()` (hozir) emas — aks holda natija har kuni o‘zgaradi.

```js
const BUGUN = new Date(2026, 9, 13); // testlar uchun “bugun”
```

## Sana nusxasi

```js
const a = new Date(2026, 8, 1);
const b = new Date(a); // mustaqil nusxa
```

`const b = a;` yozsangiz, ikkalasi **bitta** obyekt bo‘ladi — `b` ni o‘zgartirish `a` ni ham o‘zgartiradi.
