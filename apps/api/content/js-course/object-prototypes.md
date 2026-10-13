## Prototiplar

JavaScript’dagi har bir obyektning yashirin bog‘lanishi bor — **prototip**. Obyektda xususiyat topilmasa, brauzer uni **prototipdan** qidiradi, u yerda ham bo‘lmasa — prototipning prototipidan va hokazo. Bu **prototiplar zanjiri**.

```js
const arr = [1, 2, 3];
arr.map  // arr da yo‘q → Array.prototype.map topildi
arr.toString // Array.prototype da ham bor
arr.hasOwnProperty // Object.prototype dan
```

## Konstruktor prototipiga metod qo‘shish

```js
function Mahsulot(nom, narx) {
  this.nom = nom;
  this.narx = narx;
}

Mahsulot.prototype.qqsBilan = function () {
  return Math.round(this.narx * 1.12);
};

Mahsulot.prototype.malumot = function () {
  return `${this.nom}: ${this.qqsBilan()} so‘m (QQS bilan)`;
};

const non = new Mahsulot('Non', 4000);
non.malumot(); // 'Non: 4480 so‘m (QQS bilan)'
```

## Nega konstruktor ichida emas?

```js
function Mahsulot(nom, narx) {
  this.malumot = function () { /* ... */ }; // har bir obyekt uchun yangi funksiya!
}
```

1000 ta mahsulot — 1000 ta bir xil funksiya. Prototipdagi metod esa **bitta**, hammasi uni ulashadi:

```js
const sut = new Mahsulot('Sut', 12000);
non.malumot === sut.malumot // true — bitta funksiya
```

## O‘ziniki yoki merosmi?

```js
non.hasOwnProperty('nom')      // true — obyektning o‘zida
non.hasOwnProperty('malumot')  // false — prototipda
Object.hasOwn(non, 'nom')      // true — zamonaviy yozuv
'malumot' in non               // true — zanjirda bor
```

## Prototipni ko‘rish

```js
Object.getPrototypeOf(non) === Mahsulot.prototype // true
Object.getPrototypeOf(Mahsulot.prototype) === Object.prototype // true
```

Konsolda `console.log(non)` qilib `[[Prototype]]` ni ochsangiz, zanjirni ko‘rasiz.

## Klasslar ham prototiplar

```js
class Talaba {
  salom() {}
}

typeof Talaba                         // 'function'
Talaba.prototype.salom                // klass metodi aslida prototipda
Object.getPrototypeOf(new Talaba()) === Talaba.prototype // true
```

`extends` ham prototiplar zanjirini quradi.

## `Object.create`

Berilgan prototipli yangi obyekt:

```js
const asos = {
  salom() {
    return `Salom, ${this.ism}`;
  },
};
const ali = Object.create(asos);
ali.ism = 'Ali';
ali.salom(); // 'Salom, Ali'
```

## Tayyor prototiplarni o‘zgartirmang

```js
Array.prototype.oxirgi = function () { /* ... */ }; // yomon g‘oya
```

Bu boshqa kutubxonalar bilan to‘qnashadi va tilning kelajakdagi metodlari bilan ziddiyatga kirishi mumkin. O‘z funksiyalaringizni alohida yozing.
