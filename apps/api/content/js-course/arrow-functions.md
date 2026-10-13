## Arrow funksiyalar

**Arrow funksiya** — funksiyaning qisqa yozuvi (ES6):

```js
// Funksiya ifodasi
const kvadrat = function (x) {
  return x * x;
};

// Arrow funksiya
const kvadrat = (x) => {
  return x * x;
};

// Yanada qisqa: bitta ifoda — return avtomatik
const kvadrat = (x) => x * x;
```

## Yozish qoidalari

```js
() => 42                    // parametrsiz
(x) => x * 2                // bitta parametr (qavssiz ham bo‘ladi: x => x * 2)
(a, b) => a + b             // bir nechta
(a, b) => {                 // ko‘p qatorli tana — return o‘zingiz yozasiz
  const s = a + b;
  return s / 2;
}
```

### Yashirin `return`

Jingalak qavs **bo‘lmasa** — ifoda natijasi qaytariladi. Jingalak qavs **bo‘lsa** — `return` yozish shart:

```js
const a = (x) => x * 2;      // 2x qaytaradi
const b = (x) => { x * 2; }; // undefined qaytaradi — return yo‘q!
```

### Obyekt qaytarish

Obyektni qavsga oling, aks holda `{` tana deb o‘qiladi:

```js
const talaba = (ism, ball) => ({ ism, ball });
talaba('Ali', 85); // { ism: 'Ali', ball: 85 }
```

`{ ism, ball }` — `{ ism: ism, ball: ball }` ning qisqa yozuvi.

## Massiv metodlari bilan

Arrow funksiyalar eng ko‘p shu yerda ishlatiladi:

```js
const narxlar = [4000, 12000, 1500, 25000];

narxlar.filter((n) => n < 10000);            // [4000, 1500]
narxlar.map((n) => Math.round(n * 1.12));    // [4480, 13440, 1680, 28000]
narxlar.reduce((s, n) => s + n, 0);          // 42500
narxlar.toSorted((a, b) => a - b);
```

Oddiy funksiya bilan solishtiring — farq katta:

```js
narxlar.filter(function (n) {
  return n < 10000;
});
```

## `this` yo‘q

Arrow funksiyaning o‘z `this` i, `arguments` i yo‘q va uni `new` bilan chaqirib bo‘lmaydi. Shuning uchun:

- **callback’lar** uchun ideal (tashqi `this` saqlanadi);
- **obyekt metodlari** va **konstruktorlar** uchun yaramaydi.

## Hoisting

Arrow funksiya — o‘zgaruvchiga yozilgan qiymat. U e’lon qatorigacha mavjud emas:

```js
hisobla(); // ReferenceError
const hisobla = () => 1;
```

## Qachon qaysi?

| Holat                                   | Tavsiya                  |
| --------------------------------------- | ------------------------ |
| Massiv metodlariga callback             | Arrow                    |
| Kichik yordamchi funksiya               | Arrow yoki `function`    |
| Obyekt metodi                           | `metod() {}`             |
| Faylning asosiy, nomlangan funksiyalari | `function nom() {}`      |
| Hodisa ishlovchisida `this` kerak       | `function () {}`         |
