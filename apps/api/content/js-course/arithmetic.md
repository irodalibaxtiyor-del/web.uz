## Arifmetik operatorlar

| Operator | Ma’nosi                 | Misol      | Natija |
| -------- | ----------------------- | ---------- | ------ |
| `+`      | Qo‘shish                | `8 + 3`    | `11`   |
| `-`      | Ayirish                 | `8 - 3`    | `5`    |
| `*`      | Ko‘paytirish            | `8 * 3`    | `24`   |
| `/`      | Bo‘lish                 | `8 / 4`    | `2`    |
| `%`      | Qoldiq                  | `8 % 3`    | `2`    |
| `**`     | Daraja                  | `2 ** 10`  | `1024` |
| `++`     | Bittaga oshirish        | `x++`      |        |
| `--`     | Bittaga kamaytirish     | `x--`      |        |

## Qoldiq (`%`)

Bo‘lgandan keyin **qolgan** qism. Juda ko‘p ishlatiladi:

```js
17 % 5   // 2   (17 = 3 × 5 + 2)
10 % 2   // 0   — juft son
11 % 2   // 1   — toq son
125 % 60 // 5   — 125 daqiqadan 2 soat chiqarilgandan keyin qolgan daqiqa
```

### Daqiqani soat va daqiqaga ajratish

```js
const daqiqa = 125;
const qoldiq = daqiqa % 60;           // 5
const soat = (daqiqa - qoldiq) / 60;  // 2
// '2 soat 5 daqiqa'
```

`(daqiqa - qoldiq)` aniq 60 ga bo‘linadi, shuning uchun `soat` butun son chiqadi. (Keyinroq buni `Math.floor` bilan qisqaroq yozamiz.)

## Bo‘lish butun bo‘lmasa

```js
10 / 4 // 2.5
10 / 3 // 3.3333333333333335
1 / 0  // Infinity
```

## Daraja (`**`)

```js
3 ** 2  // 9
2 ** 3  // 8
```

## Inkrement va dekrement

```js
let soni = 5;
soni++; // 6
soni--; // 5
```

`soni++` — `soni = soni + 1` ning qisqa yozuvi.

## Amallar tartibi (ustuvorlik)

Matematikadagidek: avval `**`, keyin `*` `/` `%`, oxirida `+` `-`. Bir xil darajadagilar **chapdan o‘ngga**.

```js
2 + 3 * 4     // 14, 20 emas
(2 + 3) * 4   // 20
10 - 4 - 3    // 3  (10 - 4) - 3
2 ** 3 ** 2   // 512 — daraja o‘ngdan chapga: 2 ** 9
```

Shubha bo‘lsa — **qavs qo‘ying**. Qavs kodni o‘qishni ham osonlashtiradi.

### O‘rtacha qiymat

```js
const x = 4, y = 5, z = 9;
x + y + z / 3     // 12 — xato! Faqat z bo‘lindi
(x + y + z) / 3   // 6 — to‘g‘ri
```

## Input bilan hisoblash

```js
document.getElementById('hisobla').onclick = function () {
  const daqiqa = Number(document.getElementById('daqiqa').value);
  const qoldiq = daqiqa % 60;
  const soat = (daqiqa - qoldiq) / 60;
  document.getElementById('natija').textContent = soat + ' soat ' + qoldiq + ' daqiqa';
};
```

`Number(...)` shart: `%` va `-` matnni o‘zi aylantirsa ham, kod aniq bo‘lishi va `+` ishlatilganda xato bo‘lmasligi uchun kiritmani doim avval songa aylantiring.
