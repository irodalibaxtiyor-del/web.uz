## `let` kalit so‘zi

`let` 2015 yilda (ES6) qo‘shilgan va `var` ning muammolarini hal qilgan. Uning uchta muhim xususiyati bor.

## 1. Qayta e’lon qilib bo‘lmaydi

```js
let soni = 1;
let soni = 2; // SyntaxError: Identifier 'soni' has already been declared
```

`var` bunga ruxsat berardi va katta fayllarda bir xil nom bilan tasodifan eski qiymatni bosib ketish oson edi:

```js
var soni = 1;
var soni = 2; // xato yo‘q — eski qiymat jimgina yo‘qoldi
```

Qayta **tayinlash** esa mumkin:

```js
let soni = 1;
soni = 2; // to‘g‘ri
```

## 2. Blok doirasi (block scope)

`let` bilan e’lon qilingan o‘zgaruvchi faqat o‘zi turgan `{ }` blok ichida ko‘rinadi:

```js
let xabar = 'tashqi';
{
  let xabar = 'ichki';
  console.log(xabar); // ichki
}
console.log(xabar); // tashqi
```

Blok ichidagi `xabar` — **alohida** o‘zgaruvchi. U tashqaridagini o‘zgartirmaydi.

`var` blokni tan olmaydi:

```js
var xabar = 'tashqi';
{
  var xabar = 'ichki';
}
console.log(xabar); // ichki — tashqi qiymat buzildi
```

## 3. E’londan oldin ishlatib bo‘lmaydi

```js
console.log(narx); // ReferenceError: Cannot access 'narx' before initialization
let narx = 5000;
```

`var` bu holatda `undefined` qaytarardi — xato jimgina yashirinib qolardi. `let` esa darhol xabar beradi. (Bu haqda “Hoisting” darsida batafsil.)

## Holatni saqlash: hisoblagich

`let` bilan sahifa ishlab turgan vaqt davomida o‘zgaradigan qiymatni saqlash mumkin:

```js
let son = 0;

document.getElementById('plus').onclick = function () {
  son = son + 1;
  document.getElementById('son').textContent = son;
};
```

`son` funksiyadan **tashqarida** e’lon qilingan — shuning uchun bosishlar orasida qiymat saqlanadi. Agar `let son = 0;` funksiya ichida bo‘lsa, har bosishda u qaytadan 0 dan boshlanardi va doim `1` ko‘rinardi.

## Qisqa xulosa

|                          | `var`        | `let`             |
| ------------------------ | ------------ | ----------------- |
| Qayta e’lon qilish       | mumkin       | **xato**          |
| Qayta tayinlash          | mumkin       | mumkin            |
| Doira                    | funksiya     | **blok** `{ }`    |
| E’londan oldin o‘qish    | `undefined`  | **ReferenceError** |
