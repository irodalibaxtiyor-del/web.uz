## Konstruktor funksiyalar

Klasslar paydo bo‘lishidan oldin (va hozir ham ko‘p kutubxonalarda) bir xil obyektlar **konstruktor funksiya** bilan yaratilgan:

```js
function Mahsulot(nom, narx) {
  this.nom = nom;
  this.narx = narx;
}

const non = new Mahsulot('Non', 4000);
const sut = new Mahsulot('Sut', 12000);
```

Kelishuv: konstruktor nomi **katta harf** bilan boshlanadi.

## `new` nima qiladi

1. Yangi bo‘sh obyekt yaratadi.
2. Funksiyani chaqiradi, ichida `this` — shu yangi obyekt.
3. Obyektning prototipini `Mahsulot.prototype` ga bog‘laydi (keyingi dars).
4. Obyektni qaytaradi (`return` yozish shart emas).

`new` siz chaqirsangiz, `this` noto‘g‘ri bo‘ladi:

```js
const xato = Mahsulot('Non', 4000); // undefined; qat’iy rejimda — TypeError
```

## Konstruktor va klass

Klass aynan shu narsaning zamonaviy sintaksisi:

```js
class Mahsulot {
  constructor(nom, narx) {
    this.nom = nom;
    this.narx = narx;
  }
}
```

Natija deyarli bir xil. Yangi kodda klass yozing, lekin eski kodni o‘qish uchun konstruktor funksiyani bilish kerak.

## Kim yaratganini bilish

```js
non instanceof Mahsulot     // true
non.constructor === Mahsulot // true
non.constructor.name         // 'Mahsulot'
```

## Fabrika funksiya

`new` va `this` siz, oddiy obyekt qaytaradigan funksiya:

```js
function mahsulotYarat(nom, narx) {
  return { nom, narx };
}

const choy = mahsulotYarat('Choy', 9000);
choy instanceof Mahsulot // false — oddiy obyekt
```

Fabrikalar sodda va `this` bilan muammo yo‘q. Lekin `instanceof` bilan turini tekshirib bo‘lmaydi va metodlar har bir obyektga alohida nusxalanadi.

## Tayyor konstruktorlar

JavaScript’ning o‘zida ham konstruktorlar ko‘p:

```js
new Date()
new Map()
new Set()
new Error('xabar')
```

Oddiy turlar uchun konstruktor **ishlatmang**:

```js
new String('a')  // obyekt — 'a' emas
new Number(5)    // obyekt
new Boolean(false) // truthy obyekt!
```

Literallar yozing: `'a'`, `5`, `false`, `[]`, `{}`.

## Xususiyatlarni tekshirish

Konstruktor kiritilgan qiymatni tekshirishi mumkin:

```js
function Mahsulot(nom, narx) {
  if (!nom) throw new Error('Nom kerak');
  if (narx < 0) throw new Error('Narx manfiy bo‘lmaydi');
  this.nom = nom;
  this.narx = narx;
}
```

Shunda noto‘g‘ri obyekt umuman yaratilmaydi.
