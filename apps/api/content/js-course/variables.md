## O‘zgaruvchilar

**O‘zgaruvchi** — qiymat saqlanadigan nomlangan “quti”. Uni bir marta e’lon qilasiz, keyin nomi orqali qiymatni o‘qiysiz yoki almashtirasiz.

```js
let kurs = 'JavaScript';
let modullar = 18;
document.getElementById('kurs').textContent = kurs + ' kursi: ' + modullar + ' modul';
// JavaScript kursi: 18 modul
```

## E’lon qilishning uch usuli

| Kalit so‘z | Qachon ishlatiladi                                                  |
| ---------- | ------------------------------------------------------------------- |
| `let`      | Qiymati **o‘zgaradigan** o‘zgaruvchi                                |
| `const`    | Qiymati **qayta tayinlanmaydigan** o‘zgaruvchi                      |
| `var`      | Eski usul (2015 yilgacha). Yangi kodda ishlatilmaydi                |

Qoida: odatiy holatda `const`, qiymat o‘zgarishi kerak bo‘lsa — `let`. `var` faqat eski kodni o‘qish uchun kerak; uning kamchiliklarini keyingi darslarda ko‘ramiz.

## E’lon qilish va qiymat berish

```js
let shahar;          // e’lon qilindi, qiymati: undefined
shahar = 'Namangan'; // qiymat berildi
let viloyat = 'Namangan', aholi = 3000000; // bir qatorda bir nechta
```

Qiymat berilmagan o‘zgaruvchining qiymati — `undefined`.

## Qiymatni almashtirish

```js
let ball = 70;
ball = 85;        // eski qiymat o‘chadi
ball = ball + 5;  // 90
```

Matematikada `x = x + 5` ma’nosiz, lekin dasturlashda `=` — “tenglik” emas, **tayinlash**: o‘ng tomon hisoblanadi va chap tomondagi o‘zgaruvchiga yoziladi.

## Matnni ulash

```js
let ism = 'Madina';
let xabar = 'Salom, ' + ism + '!'; // 'Salom, Madina!'
```

Raqam bilan matn qo‘shilsa, natija **matn** bo‘ladi:

```js
'Kurs: ' + 18 // 'Kurs: 18'
'5' + 2       // '52' — qo‘shish emas, ulash!
```

## Kiritilgan qiymatni o‘qish

Foydalanuvchi `<input>` ga yozgan matn `value` xususiyatida:

```html
<input id="ism">
<button type="button" id="saqlash">Saqlash</button>
<p id="salom"></p>
```

```js
document.getElementById('saqlash').onclick = function () {
  let ism = document.getElementById('ism').value;
  document.getElementById('salom').textContent = 'Salom, ' + ism + '!';
};
```

`value` ni **tugma bosilganda** o‘qish muhim. Sahifa ochilganda o‘qisangiz, maydon hali bo‘sh bo‘ladi.

## Yaxshi nom tanlash

```js
let x = 450000;          // nima ekanini tushunib bo‘lmaydi
let kursNarxi = 450000;  // aniq
```

Nom qiymatning **ma’nosini** aytsin. Bitta harfli nomlar faqat juda qisqa sikllarda (`i`, `j`) qabul qilingan.

## Dollar va pastki chiziq

`$` va `_` — oddiy harf kabi ishlatiladi. Ba’zi kutubxonalar (`$` — jQuery, `_` — Lodash) ularni nom sifatida tanlagan:

```js
let $tugma = document.getElementById('saqlash');
let _ichkiHisob = 0;
```
