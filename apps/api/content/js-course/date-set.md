## Sanani o‘zgartirish

**set** metodlari `Date` obyektining **o‘zini** o‘zgartiradi:

| Metod                 | O‘zgartiradi            |
| --------------------- | ----------------------- |
| `setFullYear(y)`      | Yil (ixtiyoriy: oy, kun) |
| `setMonth(m)`         | Oy, 0–11                |
| `setDate(d)`          | Oyning kuni             |
| `setHours(h)`         | Soat                    |
| `setMinutes(m)`       | Daqiqa                  |
| `setTime(ms)`         | Butun sanani            |

```js
const d = new Date(2026, 0, 15);
d.setFullYear(2027);  // 15-yanvar 2027
d.setMonth(11);       // 15-dekabr 2027
d.setDate(31);        // 31-dekabr 2027
```

## Kun qo‘shish

`setDate` oshib ketgan qiymatni keyingi oyga **o‘zi** o‘tkazadi:

```js
const muddat = new Date(2026, 9, 1);       // 1-oktabr
muddat.setDate(muddat.getDate() + 14);     // 15-oktabr
muddat.setDate(muddat.getDate() + 30);     // 14-noyabr

const yangiYil = new Date(2026, 11, 25);
yangiYil.setDate(yangiYil.getDate() + 10); // 2027-yil 4-yanvar
```

Oylar uzunligi va kabisa yili bilan o‘zingiz shug‘ullanmaysiz.

## Asl sanani saqlash

`set` metodlari obyektni o‘zgartirgani uchun avval **nusxa** oling:

```js
function kunQosh(sana, n) {
  const natija = new Date(sana);  // nusxa
  natija.setDate(natija.getDate() + n);
  return natija;
}

const topshirildi = new Date(2026, 9, 1);
const muddat = kunQosh(topshirildi, 14);
// topshirildi hamon 1-oktabr
```

## Oy qo‘shish va oxirgi kun

```js
const d = new Date(2026, 0, 31); // 31-yanvar
d.setMonth(d.getMonth() + 1);    // 3-mart! (fevralda 31 kun yo‘q)
```

Oy qo‘shganda oy oxiridagi sanalar bilan ehtiyot bo‘ling. Oyning oxirgi kuni:

```js
new Date(2026, 2, 0).getDate() // 28 — fevralda 28 kun
```

## Sanalarni solishtirish

`<` va `>` sanalarni to‘g‘ridan-to‘g‘ri solishtiradi (ichida millisoniyalar):

```js
const BUGUN = new Date(2026, 9, 13);
const muddat = new Date(2026, 9, 15);

muddat < BUGUN  // false — muddat hali o‘tmagan
```

Tenglikni esa `===` bilan **tekshirib bo‘lmaydi** — bu ikki xil obyekt:

```js
new Date(2026, 0, 1) === new Date(2026, 0, 1)                     // false
new Date(2026, 0, 1).getTime() === new Date(2026, 0, 1).getTime() // true
```

## Formatlash (eslatma)

```js
function formatla(d) {
  const kun = String(d.getDate()).padStart(2, '0');
  const oy = String(d.getMonth() + 1).padStart(2, '0');
  return `${kun}.${oy}.${d.getFullYear()}`;
}

formatla(kunQosh(new Date(2026, 11, 25), 10)) // '04.01.2027'
```
