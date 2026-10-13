## Tasodifiy sonlar

`Math.random()` 0 dan 1 gacha (1 kirmaydi) tasodifiy kasr son qaytaradi:

```js
Math.random() // 0.7302..., 0.0419..., 0.9999...
```

## Tasodifiy butun son

Formula bosqichma-bosqich:

```js
Math.random() * 6               // 0 ... 5.999
Math.floor(Math.random() * 6)   // 0, 1, 2, 3, 4, 5
Math.floor(Math.random() * 6) + 1 // 1 ... 6 — zar
```

## Universal funksiya

`min` dan `max` gacha (ikkalasi ham kiradi):

```js
function tasodifiy(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

tasodifiy(1, 6)     // zar
tasodifiy(1, 100)   // 1 dan 100 gacha
tasodifiy(5, 5)     // doim 5
```

Nega `max - min + 1`? Oraliqda nechta butun son bor: 1 dan 6 gacha — 6 ta (`6 - 1 + 1`). `+ min` — oraliqni kerakli joydan boshlash.

### Tez-tez uchraydigan xato

```js
Math.round(Math.random() * 6) // 0 dan 6 gacha — 7 ta qiymat, chetlari ikki baravar kam chiqadi
```

`round` emas, `floor` ishlating.

## Tasodifiy element tanlash

```js
const ranglar = ['qizil', 'yashil', 'ko‘k'];
const rang = ranglar[Math.floor(Math.random() * ranglar.length)];
```

Massivlar — keyingi modulda.

## Tasodifiy rang

```js
function tasodifiyRang() {
  return `rgb(${tasodifiy(0, 255)}, ${tasodifiy(0, 255)}, ${tasodifiy(0, 255)})`;
}

document.body.style.backgroundColor = tasodifiyRang();
```

## Tasodifiylikni sinash

Tasodifiy natijani oldindan bilib bo‘lmaydi — qanday tekshiramiz?

- **Chegaraviy holat:** `tasodifiy(5, 5)` doim `5` bo‘lishi shart.
- **Oraliq:** ko‘p marta chaqirib, natija `min` dan kichik va `max` dan katta emasligini tekshirish.

Shuning uchun tasodifiy qismni alohida funksiyaga ajratish foydali.

## Xavfsizlik

`Math.random()` o‘yinlar va bezak uchun yetarli, lekin **parol, token, kod** yaratish uchun emas — uni bashorat qilish mumkin. Buning uchun brauzerda `crypto.getRandomValues()` ishlatiladi:

```js
const massiv = new Uint32Array(1);
crypto.getRandomValues(massiv);
```
