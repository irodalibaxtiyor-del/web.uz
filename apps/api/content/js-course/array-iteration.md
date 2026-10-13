## Massiv ustida aylanish

Massivning har bir elementi bilan ish bajaradigan metodlar. Ularning hammasiga **funksiya** beriladi — u har bir element uchun chaqiriladi.

## `forEach` — har biri uchun

```js
const ismlar = ['Ali', 'Madina', 'Jasur'];

ismlar.forEach(function (ism, indeks) {
  console.log(indeks + 1 + '. ' + ism);
});
// 1. Ali
// 2. Madina
// 3. Jasur
```

Funksiya `(element, indeks, massiv)` oladi. `forEach` hech narsa qaytarmaydi.

## `map` — har birini o‘zgartirish

Har bir elementdan **yangi** element yasab, yangi massiv qaytaradi:

```js
const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
];

const ismlar = talabalar.map(function (t) {
  return t.ism;
}); // ['Ali', 'Madina']

const qatorlar = talabalar.map(function (t) {
  return `<li>${t.ism} — ${t.ball}</li>`;
});
document.getElementById('royxat').innerHTML = qatorlar.join('');
```

## `filter` — saralab olish

Shartga mos **barcha** elementlarni yangi massivda qaytaradi:

```js
const otganlar = talabalar.filter(function (t) {
  return t.ball >= 60;
});
```

## `reduce` — bitta qiymatga yig‘ish

```js
const jami = talabalar.reduce(function (yigindi, t) {
  return yigindi + t.ball;
}, 0);
const ortacha = jami / talabalar.length;
```

`reduce(funksiya, boshlangich)`: `yigindi` avval `0`, keyin har qadamda funksiya qaytargan qiymat.

## Zanjir

Metodlar massiv qaytargani uchun ularni ketma-ket ulash mumkin:

```js
const otganIsmlar = talabalar
  .filter(function (t) {
    return t.ball >= 60;
  })
  .map(function (t) {
    return t.ism;
  })
  .join(', ');
```

Arrow funksiya bilan juda qisqa bo‘ladi:

```js
talabalar.filter((t) => t.ball >= 60).map((t) => t.ism).join(', ');
```

## `every`, `some`

```js
talabalar.every(function (t) {
  return t.ball > 0;
}); // hammasi musbatmi?
```

## Massiv yaratish

```js
Array.from('salom')                 // ['s', 'a', 'l', 'o', 'm']
Array.from({ length: 3 }, function (_, i) {
  return i * 10;
})                                  // [0, 10, 20]
```

## Qaysi biri?

| Maqsad                                  | Metod      | Natija            |
| --------------------------------------- | ---------- | ----------------- |
| Har biri bilan amal (ko‘rsatish, log)   | `forEach`  | yo‘q              |
| Har birini o‘zgartirish                 | `map`      | yangi massiv      |
| Ba’zilarini tanlash                     | `filter`   | yangi massiv      |
| Bitta qiymat (yig‘indi, maksimum)       | `reduce`   | istalgan qiymat   |

`map`, `filter`, `reduce` asl massivni o‘zgartirmaydi.

## Ro‘yxatni sahifada chizish

```js
function chiz() {
  document.getElementById('royxat').innerHTML = talabalar
    .map(function (t) {
      return `<li>${t.ism}: ${t.ball}</li>`;
    })
    .join('');
}
```

> Bu yerda ismlar **o‘zimizning** ma’lumotimiz. Foydalanuvchi kiritgan matnni `innerHTML` ga qo‘yish xavfli — buni DOM modulida xavfsiz usul bilan (elementlar yaratib) qilamiz.
