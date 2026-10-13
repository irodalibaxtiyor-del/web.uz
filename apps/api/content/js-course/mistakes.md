## Ko‘p uchraydigan xatolar

Bu darsda boshlovchilar (va tajribalilar ham) eng ko‘p qiladigan xatolar jamlangan. Har birini tanib olishni o‘rganing.

## 1. `=` va `===`

```js
if (parol = 'Web2026') { /* ... */ } // tayinlash! Shart doim true
if (parol === 'Web2026') { /* ... */ } // to‘g‘ri
```

`=` qiymat beradi va o‘sha qiymatni qaytaradi — bo‘sh bo‘lmagan satr truthy, shuning uchun shart har doim bajariladi.

## 2. `+` bilan ulanish

```js
const narx = document.getElementById('narx').value; // '1000'
const qqs = document.getElementById('qqs').value;   // '120'
narx + qqs          // '1000120'
Number(narx) + Number(qqs) // 1120
```

## 3. `return` unutilgan

```js
function jami(narx, qqs) {
  narx + qqs; // hisoblandi va tashlab yuborildi
}
jami(1000, 120); // undefined
```

Arrow funksiyada jingalak qavs qo‘yib, `return` ni unutish ham shunday: `(a, b) => { a + b; }`.

## 4. `switch` da `break` yo‘q

```js
switch (n) {
  case 6:
    natija = 'shanba'; // break yo‘q — pastga “tushib ketadi”
  case 7:
    natija = 'yakshanba';
    break;
}
// n = 6 bo‘lsa natija — 'yakshanba'
```

## 5. Kasr sonlar

```js
0.1 + 0.2 === 0.3 // false
```

Pulni butun sonlarda saqlang yoki ko‘rsatishda `toFixed` qiling.

## 6. Obyekt va massivlarni `===` bilan solishtirish

```js
[1, 2] === [1, 2]        // false — ikki xil massiv
{ a: 1 } === { a: 1 }    // false
```

`===` obyektlarda **bir xil obyekt**mi-yo‘qligini tekshiradi, tarkibini emas.

## 7. Massiv oxiridan chiqib ketish

```js
for (let i = 0; i <= arr.length; i++) // oxirgi aylanishda arr[i] — undefined
```

## 8. `this` yo‘qolishi

```js
tugma.onclick = obj.metod; // this — tugma, obj emas
tugma.onclick = () => obj.metod(); // to‘g‘ri
```

## 9. Asinxron natijani darhol kutish

```js
let malumot;
setTimeout(() => { malumot = 5; }, 1000);
console.log(malumot); // undefined — hali bajarilmagan
```

Asinxron kod — alohida modulda.

## 10. `null` / `undefined` dan xususiyat o‘qish

```js
const t = talabalar.find((x) => x.ism === 'Bobur'); // undefined
t.ball // TypeError
t?.ball ?? 'Topilmadi' // xavfsiz
```

## O‘z-o‘zini tekshirish ro‘yxati

Kod noto‘g‘ri ishlasa, avval shularni tekshiring:

1. Konsolda xato bormi?
2. Input qiymati songa aylantirilganmi?
3. Shartlarda `===` mi?
4. Funksiya `return` qilyaptimi?
5. Sikl chegarasi `<` mi?
6. `this` kim?
