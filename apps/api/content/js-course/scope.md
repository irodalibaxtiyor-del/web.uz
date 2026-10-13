## Ko‘rinish doirasi (scope)

**Scope** — o‘zgaruvchi kodning qaysi qismida **ko‘rinishi**. JavaScript’da uch daraja bor.

## 1. Global doira

Hech qanday funksiya yoki blokdan tashqarida e’lon qilingan o‘zgaruvchi hamma joyda ko‘rinadi:

```js
let jami = 0; // global

function qosh(narx) {
  jami = jami + narx; // global o‘zgaruvchi o‘zgaradi
}
```

## 2. Funksiya doirasi

Funksiya ichida e’lon qilingan o‘zgaruvchi faqat shu funksiyada:

```js
function hisobla() {
  const qqs = 0.12;
}
console.log(qqs); // ReferenceError
```

## 3. Blok doirasi

`let` va `const` — o‘zi turgan `{ }` blok ichida:

```js
if (jami > 100000) {
  const chegirma = 0.1;
}
console.log(chegirma); // ReferenceError
```

To‘g‘ri usul — o‘zgaruvchini **kerakli darajada** e’lon qilish:

```js
let chegirma = 0;
if (jami > 100000) {
  chegirma = 0.1;
}
const tolov = jami * (1 - chegirma);
```

## Soyalash (shadowing)

Ichki doirada **xuddi shu nom** bilan e’lon qilish tashqi o‘zgaruvchini “yopib qo‘yadi”:

```js
let jami = 0;

function qosh(narx) {
  let jami = jami + narx; // ReferenceError! Bu yangi, hali qiymatsiz jami
}
```

Funksiya ichidagi `let jami` — **boshqa** o‘zgaruvchi. U e’lon qilinguncha ishlatib bo‘lmaydi; ishlaganda ham global `jami` o‘zgarmasdi. Global qiymatni o‘zgartirmoqchi bo‘lsangiz, `let` yozmang: `jami = jami + narx;`.

## Ichki funksiya tashqini ko‘radi

```js
function tashqi() {
  const xabar = 'salom';
  function ichki() {
    console.log(xabar); // ko‘radi
  }
  ichki();
}
```

Ichkaridan tashqariga — ko‘rinadi, tashqaridan ichkariga — yo‘q. Bu **leksik doira** deyiladi: doira kod qayerda **yozilgani** bilan belgilanadi.

## E’lonsiz tayinlash

```js
function xato() {
  natija = 5; // let/const yo‘q — qat’iy bo‘lmagan rejimda global o‘zgaruvchi yaratiladi!
}
```

Bu tasodifiy global o‘zgaruvchilar manbai. Qat’iy rejim (`'use strict'`) buni xatoga aylantiradi — alohida darsda.

## Global o‘zgaruvchilarni kamaytiring

Har bir global nom boshqa skript bilan to‘qnashishi mumkin. Qoidalar:

- o‘zgaruvchini imkon qadar **tor** doirada e’lon qiling;
- umumiy holatni bitta obyektga jamlang: `const ilova = { jami: 0, savat: [] };`
- funksiyalarga kerakli qiymatlarni **parametr** sifatida bering.
