## `for...in` — obyekt kalitlari bo‘ylab

`for...in` obyektning har bir **kaliti** uchun bir marta aylanadi:

```js
const narxlar = { non: 4000, sut: 12000, tuxum: 1500 };

for (const nom in narxlar) {
  console.log(nom, narxlar[nom]);
}
// non 4000
// sut 12000
// tuxum 1500
```

`nom` — kalit (satr). Qiymatni olish uchun **kvadrat qavs**: `narxlar[nom]`. `narxlar.nom` — aynan `'nom'` kalitini qidiradi va `undefined` beradi.

## Yig‘indi

```js
let jami = 0;
for (const nom in narxlar) {
  jami += narxlar[nom];
}
// 17500
```

## Matn yig‘ish

```js
const qismlar = [];
for (const nom in narxlar) {
  qismlar.push(`${nom}: ${narxlar[nom]}`);
}
qismlar.join('; '); // 'non: 4000; sut: 12000; tuxum: 1500'
```

Massivga yig‘ib, oxirida `join` — ajratgich oxirida ortib qolmaydi.

## Massivlar uchun emas

`for...in` massivda ham ishlaydi, lekin **ishlatmang**:

- kalitlar **satr** bo‘lib keladi: `'0'`, `'1'`;
- massivga qo‘shilgan boshqa xususiyatlar ham chiqib qolishi mumkin.

Massivlar uchun `for`, `for...of` yoki `forEach`.

## Zamonaviy muqobil: `Object.entries`

```js
for (const [nom, narx] of Object.entries(narxlar)) {
  console.log(nom, narx);
}
```

`Object.entries` `[kalit, qiymat]` juftliklari massivini beradi, `[nom, narx]` — ularni ikki o‘zgaruvchiga ajratadi (destrukturlash — keyingi modulda). Ko‘p jamoalar `for...in` o‘rniga shu usulni afzal ko‘radi.

```js
Object.keys(narxlar)    // ['non', 'sut', 'tuxum']
Object.values(narxlar)  // [4000, 12000, 1500]
```

## Tartib

Oddiy satr kalitlar **qo‘shilgan tartibida** keladi. Son ko‘rinishidagi kalitlar (`'1'`, `'2'`) esa o‘sish tartibida birinchi chiqadi. Tartib muhim bo‘lsa, massiv ishlating.

## Yangi kalit qo‘shib, qayta aylanish

```js
narxlar.choy = 9000;
// keyingi for...in choy ni ham o‘z ichiga oladi
```

Sikl **ichida** obyektga kalit qo‘shish yoki o‘chirishdan saqlaning — natija oldindan aytib bo‘lmaydigan bo‘ladi.
