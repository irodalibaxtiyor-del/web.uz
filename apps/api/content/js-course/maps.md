## `Map` — kalit-qiymat juftliklari

`Map` obyektga o‘xshaydi, lekin kalit **istalgan turdagi** qiymat bo‘lishi mumkin va qo‘shilish tartibi aniq saqlanadi:

```js
const narxlar = new Map();
narxlar.set('non', 4000);
narxlar.set('sut', 12000);

narxlar.get('non')   // 4000
narxlar.has('choy')  // false
narxlar.size         // 2
narxlar.delete('sut');
```

Massivdan yaratish:

```js
const narxlar = new Map([
  ['non', 4000],
  ['sut', 12000],
]);
```

## Aylanish

```js
for (const [nom, narx] of narxlar) {
  console.log(nom, narx);
}

narxlar.keys()    // iterator: 'non', 'sut'
narxlar.values()  // 4000, 12000
narxlar.entries() // ['non', 4000], ['sut', 12000]
```

## Chastota hisoblash

`Map` ning eng klassik qo‘llanishi — nechta marta uchraganini sanash:

```js
const sozlar = 'olma non olma suv olma non'.split(' ');
const sanoq = new Map();

for (const soz of sozlar) {
  sanoq.set(soz, (sanoq.get(soz) ?? 0) + 1);
}
// olma → 3, non → 2, suv → 1
```

`sanoq.get(soz) ?? 0` — so‘z birinchi marta uchraganda `undefined` o‘rniga `0`.

### Eng ko‘p uchragan

```js
let engKop = '';
let eng = 0;
for (const [soz, soni] of sanoq) {
  if (soni > eng) {
    engKop = soz;
    eng = soni;
  }
}
// 'olma', 3
```

## `Map` yoki oddiy obyekt?

| Xususiyat                        | Obyekt `{}`                   | `Map`                       |
| -------------------------------- | ----------------------------- | --------------------------- |
| Kalit turi                       | Faqat satr (yoki Symbol)      | **Istalgan** (obyekt ham)   |
| Elementlar soni                  | `Object.keys(o).length`       | `map.size`                  |
| `for...of` bilan aylanish        | Yo‘q                          | Ha                          |
| Tartib                           | Deyarli kafolatlangan         | Qo‘shilish tartibi          |
| JSON ga aylantirish              | `JSON.stringify` darhol       | Avval obyektga aylantirish  |

Qoida: **o‘zgarmas tuzilma** (foydalanuvchi, sozlamalar) — obyekt. **Dinamik lug‘at** (sanoq, kesh, ID → obyekt) — `Map`.

## Obyekt kalit sifatida

```js
const tugma = document.getElementById('saqlash');
const bosishlar = new Map();
bosishlar.set(tugma, 0); // kalit — HTML elementning o‘zi
```

Oddiy obyektda bu ishlamaydi: kalit `'[object HTMLButtonElement]'` matniga aylanib qoladi.

## Obyekt ↔ Map

```js
const obyekt = { non: 4000, sut: 12000 };
const map = new Map(Object.entries(obyekt));
const yana = Object.fromEntries(map); // { non: 4000, sut: 12000 }
```
