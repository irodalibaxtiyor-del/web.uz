## Sanadan qiymat olish

`Date` obyektining **get** metodlari mahalliy vaqt bo‘yicha qismlarni qaytaradi:

| Metod              | Qaytaradi                          | `new Date(2026, 2, 8, 14, 5)` |
| ------------------ | ---------------------------------- | ----------------------------- |
| `getFullYear()`    | Yil                                | `2026`                        |
| `getMonth()`       | Oy, **0–11**                       | `2` (mart)                    |
| `getDate()`        | Oyning kuni, 1–31                  | `8`                           |
| `getDay()`         | Hafta kuni, **0–6**, 0 = yakshanba | `0`                           |
| `getHours()`       | Soat, 0–23                         | `14`                          |
| `getMinutes()`     | Daqiqa                             | `5`                           |
| `getSeconds()`     | Soniya                             | `0`                           |
| `getTime()`        | 1970 dan beri millisoniya          | katta son                     |

`getDate` (kun) va `getDay` (hafta kuni) ni adashtirmang.

## Hafta kuni nomi

```js
const HAFTA = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];

const d = new Date(2026, 2, 8);
HAFTA[d.getDay()] // 'yakshanba'
```

Massiv yakshanbadan boshlanadi, chunki `getDay()` uchun 0 — yakshanba.

## Oy nomi

```js
const OYLAR = ['yanvar', 'fevral', 'mart', /* ... */];
OYLAR[d.getMonth()] // 'mart'
```

## Soatni formatlash

```js
const soat = String(d.getHours()).padStart(2, '0');
const daqiqa = String(d.getMinutes()).padStart(2, '0');
`${soat}:${daqiqa}` // '14:05'
```

## Raqamli soat

```js
function soatniKorsat() {
  const h = new Date();
  document.getElementById('soat').textContent = h.toTimeString().slice(0, 8);
}
setInterval(soatniKorsat, 1000); // har soniyada (timer’lar — asinxron modulda)
```

## UTC metodlari

Har bir metodning UTC varianti bor: `getUTCFullYear()`, `getUTCHours()` va hokazo. Ular vaqt zonasiga qaramaydi — serverlar bilan ishlashda kerak.

## Yoshni hisoblash

Taxminiy usul — millisoniyalar orqali:

```js
const YIL_MS = 365.25 * 24 * 60 * 60 * 1000;
const BUGUN = new Date(2026, 9, 13);

function yosh(tugilgan) {
  return Math.floor((BUGUN - tugilgan) / YIL_MS);
}

yosh(new Date(2006, 4, 20)) // 20
```

`365.25` — kabisa yillarini o‘rtacha hisobga oladi. Tug‘ilgan kunga bir-ikki kun qolganda bu usul adashishi mumkin. Aniq usul (yillar farqi va tug‘ilgan kun o‘tgan-o‘tmaganini tekshirish) shartlar bilan yoziladi — keyingi modulda.

## Input’dan sana

```js
function sanaOqi(qiymat) {
  const q = qiymat.split('-');
  return new Date(Number(q[0]), Number(q[1]) - 1, Number(q[2]));
}

const d = sanaOqi(document.getElementById('sana').value);
```
