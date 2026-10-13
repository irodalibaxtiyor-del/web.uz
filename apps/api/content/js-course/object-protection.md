## Obyektlarni himoyalash

`const` obyektni boshqa obyektga bog‘lashni taqiqlaydi, lekin **ichini** o‘zgartirishga ruxsat beradi. Ichini ham himoyalash uchun uchta daraja bor.

## Uch daraja

| Metod                       | Qo‘shish | O‘chirish | O‘zgartirish |
| --------------------------- | -------- | --------- | ------------ |
| `Object.preventExtensions`  | ✗        | ✓         | ✓            |
| `Object.seal`               | ✗        | ✗         | ✓            |
| `Object.freeze`             | ✗        | ✗         | ✗            |

## `Object.freeze` — to‘liq muzlatish

```js
'use strict';

const SOZLAMALAR = Object.freeze({
  til: 'uz',
  mavzu: 'yorug‘',
});

SOZLAMALAR.til = 'en'; // TypeError: Cannot assign to read only property 'til'
```

Qat’iy rejimsiz bu qator **jimgina** e’tiborsiz qolardi — xato ko‘rinmaydi. Shuning uchun himoya bilan doim qat’iy rejim ishlating.

Tekshirish:

```js
Object.isFrozen(SOZLAMALAR) // true
```

## `Object.seal` — tuzilmani qulflash

Mavjud xususiyatlarni o‘zgartirish mumkin, yangisini qo‘shib yoki o‘chirib bo‘lmaydi:

```js
'use strict';

const profil = Object.seal({ ism: 'Ali', yosh: 20 });
profil.ism = 'Madina';     // ruxsat
profil.telefon = '+998…';  // TypeError: Cannot add property telefon
delete profil.yosh;        // TypeError
```

Tuzilmasi aniq bo‘lishi kerak bo‘lgan obyektlar uchun: harf xatosi bilan yangi xususiyat (`profil.ims = ...`) yaratib qo‘yishning oldi olinadi.

## Muzlatish sayoz

`freeze` faqat **birinchi darajani** muzlatadi:

```js
const kurs = Object.freeze({ nom: 'JS', teglar: ['web'] });
kurs.teglar.push('frontend'); // ishlaydi! Massiv muzlatilmagan
```

Chuqur muzlatish uchun ichki obyektlarni ham alohida muzlatish kerak.

## Bitta xususiyatni himoyalash

```js
const hisob = { egasi: 'Dilnoza' };

Object.defineProperty(hisob, 'id', {
  value: 1042,
  writable: false,   // o‘zgartirib bo‘lmaydi
  enumerable: true,  // Object.keys da ko‘rinadi
  configurable: false, // o‘chirib yoki qayta sozlab bo‘lmaydi
});
```

Sozlamalarni ko‘rish:

```js
Object.getOwnPropertyDescriptor(hisob, 'id');
```

## Qachon kerak?

- **Konstantalar** (sozlamalar, ranglar, xato kodlari) — `freeze`;
- tuzilmasi o‘zgarmasligi kerak bo‘lgan holat — `seal`;
- kutubxona foydalanuvchisi ichki ma’lumotni buzmasligi uchun — `freeze` yoki klassdagi `#` maydonlar.

> Bu xavfsizlik vositasi emas — brauzerdagi kodni foydalanuvchi baribir o‘zgartira oladi. Bu **xatolardan** himoya: dasturning o‘zi o‘zgarmasligi kerak bo‘lgan narsani tasodifan o‘zgartirmasligi uchun.
