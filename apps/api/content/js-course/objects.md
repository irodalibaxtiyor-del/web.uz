## Obyektlar

Hayotda narsalarning **xususiyatlari** bo‘ladi: kursning nomi, narxi, darslar soni. JavaScript’da bunday ma’lumot **obyekt**da saqlanadi:

```js
const kurs = {
  nom: 'JavaScript asoslari',
  narx: 450000,
  darslar: 97,
  ochiq: true,
};
```

Obyekt — `kalit: qiymat` juftliklaridan iborat to‘plam. Kalitlar **xususiyat** (property) deb ataladi.

## Xususiyatni o‘qish

```js
kurs.nom      // 'JavaScript asoslari'
kurs.narx     // 450000
kurs.muallif  // undefined — bunday xususiyat yo‘q
```

## Xususiyatni o‘zgartirish va qo‘shish

```js
kurs.narx = 360000;        // o‘zgartirish
kurs.muallif = 'Jamoa';    // yangi xususiyat qo‘shish
```

`kurs` `const` bo‘lsa ham bu mumkin: biz o‘zgaruvchini boshqa obyektga bog‘lamayapmiz, faqat obyektning **ichini** o‘zgartiryapmiz.

## Nega obyekt?

Alohida o‘zgaruvchilar:

```js
const kursNomi = 'JavaScript asoslari';
const kursNarxi = 450000;
const kursDarslari = 97;
```

Obyekt bilan ular **bitta nom** ostida jamlanadi: funksiyaga uzatish, saqlash, ko‘rsatish osonlashadi.

## Qiymat turlari

Xususiyat qiymati istalgan tur bo‘lishi mumkin — matn, son, boolean, boshqa obyekt, massiv, funksiya:

```js
const talaba = {
  ism: 'Ali',
  yosh: 20,
  manzil: {
    shahar: 'Xiva',
    tuman: 'Ichan qal’a',
  },
};

talaba.manzil.shahar; // 'Xiva'
```

## Obyektni yaratish

Eng oddiy usul — **obyekt literali** `{ ... }`:

```js
const bosh = {};       // bo‘sh obyekt
bosh.rang = 'ko‘k';    // keyin to‘ldirish
```

Input qiymatlaridan:

```js
const talaba = {
  ism: document.getElementById('ism').value,
  yosh: Number(document.getElementById('yosh').value),
  shahar: document.getElementById('shahar').value,
};
```

## Obyektni ko‘rsatish

Obyektni to‘g‘ridan-to‘g‘ri sahifaga yozsangiz, foydali narsa chiqmaydi:

```js
document.getElementById('karta').textContent = talaba; // [object Object]
```

Xususiyatlarni alohida oling:

```js
document.getElementById('karta').textContent =
  talaba.ism + ', ' + talaba.yosh + ' yosh, ' + talaba.shahar;
// Ali, 20 yosh, Xiva
```

Konsolda esa obyekt to‘liq, ochiladigan ko‘rinishda chiqadi: `console.log(talaba)`.

## Hammasi obyekt?

JavaScript’da deyarli hamma narsa obyekt bilan bog‘liq: massivlar, sanalar, funksiyalar, hatto `document` ham obyekt. `document.getElementById(...)` — `document` obyektining **metodi**. Metodlar — keyingi darslarda.
