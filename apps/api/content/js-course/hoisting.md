## Hoisting (ko‘tarilish)

Brauzer kodni bajarishdan oldin uni o‘qib chiqadi va **e’lonlarni** “ro‘yxatga oladi”. Shuning uchun ba’zi narsalarni e’lon qilinishidan **oldin** ishlatish mumkin. Bu hodisa **hoisting** deyiladi — go‘yo e’lonlar doiraning tepasiga ko‘tarilgandek.

## Funksiya e’loni — to‘liq ko‘tariladi

```js
salomlash('Ali'); // ishlaydi: 'Salom, Ali!'

function salomlash(ism) {
  return 'Salom, ' + ism + '!';
}
```

`function nom() {}` ko‘rinishidagi e’lon butunlay ko‘tariladi — faylning istalgan joyida chaqirish mumkin.

## Funksiya ifodasi — ko‘tarilmaydi

```js
salomlash('Ali'); // ReferenceError: Cannot access 'salomlash' before initialization

const salomlash = function (ism) {
  return 'Salom, ' + ism + '!';
};
```

Bu `const` o‘zgaruvchi — funksiya unga faqat shu qatorga yetganda yoziladi. Arrow funksiyalar ham shunday.

## `var` — e’lon ko‘tariladi, qiymat emas

```js
console.log(eski); // undefined — xato yo‘q!
var eski = 5;
console.log(eski); // 5
```

Brauzer buni amalda shunday ko‘radi:

```js
var eski;          // e’lon tepaga ko‘tarildi
console.log(eski); // undefined
eski = 5;          // qiymat o‘z joyida
```

Xato chiqmasligi — **muammo**: noto‘g‘ri tartib jimgina `undefined` beradi.

## `let` va `const` — vaqtinchalik o‘lik zona

`let` va `const` ham “ro‘yxatga olinadi”, lekin e’lon qatorigacha ularga murojaat qilish **xato**:

```js
console.log(kurs); // ReferenceError
let kurs = 'JavaScript';
```

Doira boshidan e’lon qatorigacha bo‘lgan joy **temporal dead zone** (TDZ) deyiladi. Bu yaxshi: xato darhol ko‘rinadi.

## Jadval

| E’lon                         | E’londan oldin ishlatilsa |
| ----------------------------- | ------------------------- |
| `function f() {}`             | ishlaydi                  |
| `var x = 1`                   | `undefined`               |
| `let x = 1`, `const x = 1`    | `ReferenceError`          |
| `const f = function () {}`    | `ReferenceError`          |
| `class A {}`                  | `ReferenceError`          |

## Amaliy qoida

Hoisting’ga **tayanmang**:

1. O‘zgaruvchilarni ishlatishdan **oldin**, doira boshida e’lon qiling.
2. `var` o‘rniga `let`/`const`.
3. Funksiya e’lonlari (`function nom`) faylning istalgan joyida bo‘lishi mumkin, lekin ularni ishlatadigan kod bilan mantiqiy tartibda joylashtiring.

Ko‘p loyihalarda tartib shunday: avval konstantalar va holat, keyin funksiyalar, oxirida hodisalarni ulash va boshlang‘ich chaqiruv.
