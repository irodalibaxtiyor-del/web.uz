## Tayinlash operatorlari

`=` o‘ngdagi qiymatni chapdagi o‘zgaruvchiga yozadi. Qolgan tayinlash operatorlari — **qisqa yozuvlar**: ular o‘zgaruvchining joriy qiymati bilan amal bajarib, natijani yana unga yozadi.

| Operator | Misol      | Teng kuchli    |
| -------- | ---------- | -------------- |
| `=`      | `x = 5`    | `x = 5`        |
| `+=`     | `x += 5`   | `x = x + 5`    |
| `-=`     | `x -= 5`   | `x = x - 5`    |
| `*=`     | `x *= 2`   | `x = x * 2`    |
| `/=`     | `x /= 2`   | `x = x / 2`    |
| `%=`     | `x %= 3`   | `x = x % 3`    |
| `**=`    | `x **= 2`  | `x = x ** 2`   |

## Hamyon misolida

```js
let balans = 100000;

balans += 25000; // kirim: 125000
balans -= 30000; // chiqim: 95000
balans *= 2;     // ikki baravar: 190000
```

## `+=` matnlar bilan

`+=` matnning oxiriga qo‘shadi — tarix yoki jurnal yuritishda qulay:

```js
let tarix = '';
tarix += '+25000; ';
tarix += '-30000; ';
// '+25000; -30000; '
```

## Holat va tugmalar

Tugmalar bosilganda bitta umumiy qiymatni o‘zgartirish — eng ko‘p uchraydigan holat:

```js
let balans = 100000;
let tarix = '';

function korsat() {
  document.getElementById('balans').textContent = balans;
  document.getElementById('tarix').textContent = tarix;
}

document.getElementById('kirim').onclick = function () {
  const summa = Number(document.getElementById('summa').value);
  balans += summa;
  tarix += '+' + summa + '; ';
  korsat();
};

korsat(); // sahifa ochilganda boshlang‘ich holatni ko‘rsatamiz
```

`korsat` — bir necha joyda takrorlanadigan kodni bir joyga yig‘adigan **funksiya**. Funksiyalarni keyingi modulda batafsil o‘rganamiz; hozircha shuni bilish kifoya: `function nom() { ... }` e’lon qiladi, `nom()` chaqiradi.

## Diqqat: `+=` va input

```js
let balans = 100000;
balans += document.getElementById('summa').value; // '10000025000' — matn ulandi!
balans += Number(document.getElementById('summa').value); // 125000
```

`value` matn bo‘lgani uchun `+=` uni **ulab** yuboradi. `Number(...)` ni unutmang.

## `const` bilan ishlamaydi

```js
const balans = 100000;
balans += 5000; // TypeError: Assignment to constant variable.
```

Qiymati o‘zgaradigan o‘zgaruvchi — `let`.
