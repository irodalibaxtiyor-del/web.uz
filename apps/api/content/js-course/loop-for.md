## `for` sikli

**Sikl** bir xil kodni ko‘p marta bajaradi. 1 dan 100 gacha sonlarni qo‘shish uchun 100 qator yozmaysiz:

```js
let yigindi = 0;
for (let i = 1; i <= 100; i++) {
  yigindi += i;
}
// yigindi: 5050
```

## Tuzilishi

```js
for (boshlash; shart; qadam) {
  // tana
}
```

1. **boshlash** — bir marta, sikl boshida: `let i = 1`;
2. **shart** — har aylanishdan **oldin** tekshiriladi: `i <= 100`. `false` bo‘lsa sikl tugaydi;
3. **tana** bajariladi;
4. **qadam** — har aylanishdan **keyin**: `i++`;
5. yana 2-bandga.

## Ko‘paytirish jadvali

```js
const n = 7;
let html = '';
for (let i = 1; i <= 10; i++) {
  html += `<li>${n} × ${i} = ${n * i}</li>`;
}
document.getElementById('jadval').innerHTML = html;
```

## Massiv bo‘ylab

```js
const kurslar = ['HTML', 'CSS', 'JavaScript'];
for (let i = 0; i < kurslar.length; i++) {
  console.log(i + 1, kurslar[i]);
}
```

`i < length` — `<=` emas! Oxirgi indeks `length - 1`. `<=` yozsangiz, oxirida `undefined` chiqadi.

## Turli qadamlar

```js
for (let i = 10; i >= 1; i--) { /* 10, 9, ..., 1 — orqaga */ }
for (let i = 0; i <= 100; i += 5) { /* 0, 5, 10, ..., 100 */ }
for (let i = 1; i <= 1024; i *= 2) { /* 1, 2, 4, ..., 1024 */ }
```

## `let i` — har aylanish o‘ziniki

`for` dagi `let i` sikl tashqarisida ko‘rinmaydi:

```js
for (let i = 0; i < 3; i++) {}
console.log(i); // ReferenceError
```

## Ichma-ich sikllar

```js
for (let qator = 1; qator <= 3; qator++) {
  let satr = '';
  for (let ustun = 1; ustun <= 3; ustun++) {
    satr += qator * ustun + ' ';
  }
  console.log(satr);
}
// 1 2 3
// 2 4 6
// 3 6 9
```

Ichki sikl tashqi siklning **har bir** aylanishida to‘liq bajariladi: 3 × 3 = 9 marta.

## Cheksiz sikl

```js
for (let i = 1; i > 0; i++) {
  // shart hech qachon false bo‘lmaydi — sahifa “qotib qoladi”
}
```

Mashq sahifasidagi preview cheksiz siklni bir necha soniyadan keyin to‘xtatadi va **TIMEOUT** ko‘rsatadi. Haqiqiy saytda esa tab javob bermay qoladi. Shartdagi o‘zgaruvchi qadamda **chegaraga yaqinlashishini** tekshiring.

## Qachon `for`?

- Necha marta takrorlanishi **oldindan ma’lum** bo‘lsa (`n` marta, massiv uzunligi);
- indeks kerak bo‘lsa.

Massiv elementlari uchun indeks kerak bo‘lmasa, `for...of` qisqaroq — keyingi darslarda.
