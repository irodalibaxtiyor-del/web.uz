## `break` va `continue`

## `break` — siklni to‘xtatish

Kerakli narsa topilgach, qolganini tekshirish shart emas:

```js
const sonlar = [4, 9, 14, 21, 3];
let topildi = 'Topilmadi';

for (const son of sonlar) {
  if (son % 7 === 0) {
    topildi = son;
    break; // 14 topildi — 21 va 3 tekshirilmaydi
  }
}
```

## `continue` — bu aylanishni o‘tkazib yuborish

Joriy aylanishning qolgan qismini tashlab, **keyingisiga** o‘tadi:

```js
let yigindi = 0;
for (const son of [4, -2, 9, -7, 5]) {
  if (son < 0) continue; // manfiylarni hisobga olmaymiz
  yigindi += son;
}
// 18
```

## Birga ishlatish

“Manfiylarni o‘tkazib yubor, `0` ga yetganda to‘xta”:

```js
let yigindi = 0;
for (const son of [4, 9, -1, 7, 0, 12]) {
  if (son === 0) break;
  if (son < 0) continue;
  yigindi += son;
}
// 4 + 9 + 7 = 20 — 12 ga yetib bormadi
```

Tartibga e’tibor bering: avval to‘xtash sharti, keyin o‘tkazib yuborish.

## Matndan sonlar

```js
const qismlar = '4 9 -1 7 0 12'.split(' '); // satrlar
for (const q of qismlar) {
  const son = Number(q);
  // ...
}
```

## Ichma-ich sikldan chiqish: yorliq

`break` faqat **eng ichki** siklni to‘xtatadi. Tashqi siklni ham to‘xtatish uchun **yorliq** (label):

```js
tashqi: for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    if (i * j === 6) {
      console.log(i, j); // 2 3
      break tashqi;
    }
  }
}
```

Yorliqlar kam ishlatiladi — ko‘pincha ichki siklni alohida funksiyaga ajratib, `return` qilish tushunarliroq.

## Funksiyada `return`

Funksiya ichidagi sikldan `return` bilan ham chiqiladi — u siklni **va** funksiyani tugatadi:

```js
function birinchiYettilik(sonlar) {
  for (const son of sonlar) {
    if (son % 7 === 0) return son;
  }
  return 'Topilmadi';
}
```

Bu ko‘pincha `break` + o‘zgaruvchidan toza.

## `forEach` da ishlamaydi

```js
[1, 2, 3].forEach(function (x) {
  if (x === 2) break; // SyntaxError
});
```

To‘xtatish kerak bo‘lsa — `for...of`, `some` yoki `find`.
