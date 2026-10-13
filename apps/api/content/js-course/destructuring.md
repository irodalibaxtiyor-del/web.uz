## Destrukturlash

**Destrukturlash** — massiv yoki obyektdan qiymatlarni **bir qatorda** alohida o‘zgaruvchilarga olish.

## Obyektdan

```js
const foydalanuvchi = { ism: 'Madina', familiya: 'Karimova', yosh: 21 };

// Eski usul
const ism = foydalanuvchi.ism;
const familiya = foydalanuvchi.familiya;

// Destrukturlash
const { ism, familiya } = foydalanuvchi;
```

O‘zgaruvchi nomi xususiyat nomi bilan bir xil bo‘ladi.

### Boshqa nom berish

```js
const { ism: nom } = foydalanuvchi; // nom = 'Madina'
```

### Standart qiymat

```js
const { telefon = 'ko‘rsatilmagan' } = foydalanuvchi; // xususiyat yo‘q — standart
```

### Ichma-ich obyekt

```js
const f = { ism: 'Madina', manzil: { shahar: 'Samarqand' } };
const { manzil: { shahar } } = f; // shahar = 'Samarqand'
```

## Massivdan

Massivda **tartib** bo‘yicha olinadi:

```js
const tillar = ['uz', 'ru', 'en'];
const [asosiy, ikkinchi] = tillar; // 'uz', 'ru'
const [, , uchinchi] = tillar;     // 'en' — o‘tkazib yuborish
```

### Qolganlari (rest)

```js
const [asosiy, ...qolgan] = tillar; // asosiy = 'uz', qolgan = ['ru', 'en']
const { ism, ...boshqalar } = foydalanuvchi; // boshqalar = { familiya, yosh }
```

`...` — “qolgan hammasi”. U doim **oxirida** turadi.

## Qiymatlarni almashtirish

```js
let a = 1;
let b = 2;
[a, b] = [b, a]; // a = 2, b = 1
```

Vaqtinchalik o‘zgaruvchi kerak emas.

## Funksiya parametrlarida

```js
function karta({ ism, familiya, shahar = 'Toshkent' }) {
  return `${ism} ${familiya}, ${shahar}`;
}

karta({ ism: 'Ali', familiya: 'Valiyev' }); // 'Ali Valiyev, Toshkent'
```

Ko‘p parametrli funksiyalarda obyekt + destrukturlash tartibni eslab qolish muammosini yo‘qotadi.

## Funksiya natijasi

```js
function minMax(sonlar) {
  return [Math.min(...sonlar), Math.max(...sonlar)];
}

const [kichik, katta] = minMax([4, 9, 1]); // 1, 9 — nom emas, tartib muhim
```

## Sikllarda

```js
for (const [nom, narx] of Object.entries({ non: 4000, sut: 12000 })) {
  console.log(nom, narx);
}

for (const [i, x] of ['a', 'b'].entries()) { /* ... */ }
```

## Matndan

```js
const [lat, lng] = '41.31, 69.24'.split(',').map(Number); // 41.31, 69.24
```

## Xato holat

```js
const { ism } = undefined; // TypeError: Cannot destructure ...
```

Manba bo‘sh bo‘lishi mumkin bo‘lsa: `const { ism } = obyekt ?? {};`
