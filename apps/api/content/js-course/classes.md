## Klasslar

**Klass** — bir xil tuzilishdagi obyektlarni yaratish uchun **qolip**. Har bir talaba obyektini qo‘lda yozish o‘rniga, qolipni bir marta tasvirlaysiz:

```js
class Talaba {
  constructor(ism, ball) {
    this.ism = ism;
    this.ball = ball;
  }

  baho() {
    return this.ball >= 60 ? 'o‘tdi' : 'o‘tmadi';
  }

  malumot() {
    return `${this.ism}: ${this.ball} ball (${this.baho()})`;
  }
}
```

## Obyekt (nusxa) yaratish

```js
const ali = new Talaba('Ali', 85);
const bobur = new Talaba('Bobur', 40);

ali.malumot();   // 'Ali: 85 ball (o‘tdi)'
bobur.baho();    // 'o‘tmadi'
```

`new` — yangi bo‘sh obyekt yaratadi, `constructor` ni chaqiradi (`this` — shu yangi obyekt) va obyektni qaytaradi.

## Tuzilishi

- `class Nom` — klass nomi **PascalCase**da (`Talaba`, `BankHisobi`);
- `constructor(...)` — `new` paytida bir marta ishlaydi, boshlang‘ich xususiyatlarni o‘rnatadi;
- metodlar — `nom() { ... }`, ular orasida vergul **yo‘q**;
- metodlar ichida `this` — shu nusxa.

## Nega klass?

Obyekt literali bitta narsa uchun qulay. Bir xil turdagi **ko‘p** narsa bo‘lsa, klass:

- tuzilishni bir joyda tasvirlaydi;
- metodlar barcha nusxalar uchun **umumiy** (har biriga nusxalanmaydi);
- `instanceof` bilan turini tekshirish mumkin.

```js
ali instanceof Talaba // true
```

## Nusxalar ro‘yxati

```js
const talabalar = [];

document.getElementById('yarat').onclick = function () {
  const t = new Talaba(
    document.getElementById('ism').value,
    Number(document.getElementById('ball').value),
  );
  talabalar.push(t);
  document.getElementById('karta').textContent = t.malumot();
  document.getElementById('soni').textContent = talabalar.length;
};
```

## Getter va setter

Xususiyat kabi o‘qiladigan, lekin hisoblanadigan qiymat:

```js
class Talaba {
  constructor(ism, ball) {
    this.ism = ism;
    this.ball = ball;
  }
  get otdimi() {
    return this.ball >= 60;
  }
}

new Talaba('Ali', 85).otdimi; // true — qavssiz
```

## Klass — bu funksiya

```js
typeof Talaba // 'function'
```

Klass — JavaScript’dagi prototiplar ustidagi qulay sintaksis. Prototiplarni keyingi modulda ko‘ramiz.

## Muhim farqlar

- Klass ichidagi kod doim **qat’iy rejimda**.
- Klass **ko‘tarilmaydi**: e’londan oldin `new Talaba()` — `ReferenceError`.
- Klassni `new` siz chaqirib bo‘lmaydi: `Talaba('Ali')` — `TypeError`.
