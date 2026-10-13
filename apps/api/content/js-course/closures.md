## Yopilmalar (closures)

**Yopilma** — funksiya o‘zi yaratilgan joydagi o‘zgaruvchilarni **eslab qolishi**, hatto o‘sha joydagi kod tugagandan keyin ham.

```js
function hisoblagichYasa() {
  let son = 0;
  return function () {
    son++;
    return son;
  };
}

const sana = hisoblagichYasa();
sana(); // 1
sana(); // 2
sana(); // 3
```

`hisoblagichYasa` tugadi, lekin u qaytargan ichki funksiya `son` ni hamon “ko‘radi” va o‘zgartiradi.

## Nega bu muhim?

### 1. Yopiq holat

`son` ga tashqaridan murojaat qilib bo‘lmaydi — uni faqat qaytarilgan funksiya orqali o‘zgartirish mumkin:

```js
son; // ReferenceError
```

Global o‘zgaruvchisiz, hech kim tasodifan buzolmaydigan holat.

### 2. Mustaqil nusxalar

Har chaqiruv **yangi** `son` yaratadi:

```js
const a = hisoblagichYasa();
const b = hisoblagichYasa();
a(); a();  // 2
b();       // 1 — a ga bog‘liq emas
```

## Parametrli fabrika

```js
function hisoblagichYasa(qadam) {
  let qiymat = 0;
  return {
    oshir() {
      qiymat += qadam;
      return qiymat;
    },
    qiymat() {
      return qiymat;
    },
  };
}

const birlik = hisoblagichYasa(1);
const beshlik = hisoblagichYasa(5);
beshlik.oshir(); // 5
beshlik.oshir(); // 10
birlik.oshir();  // 1
```

## Funksiya yasaydigan funksiya

```js
function kopaytiruvchi(n) {
  return (x) => x * n;
}

const ikkiBaravar = kopaytiruvchi(2);
const uchBaravar = kopaytiruvchi(3);
ikkiBaravar(21); // 42
uchBaravar(5);   // 15
```

`n` har bir funksiya uchun alohida eslab qolingan.

## Hodisalarda yopilma

Siz allaqachon yopilmalardan foydalangansiz:

```js
for (const tugma of document.querySelectorAll('.kurs')) {
  const nom = tugma.textContent;
  tugma.onclick = function () {
    console.log(nom); // har bir tugma o‘z nom ini eslaydi
  };
}
```

## `var` bilan eski muammo

```js
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log(i); // 4, 4, 4 — hammasi bitta i ni ko‘radi
  }, 100);
}
```

`var` sikl uchun **bitta** o‘zgaruvchi yaratadi. `let` esa har aylanishda yangisini yaratadi — `1, 2, 3` chiqadi. Bu `let` ning eng amaliy afzalliklaridan biri.

## Xotira

Yopilma eslab qolgan o‘zgaruvchilar funksiya mavjud ekan xotirada qoladi. Odatda muammo emas, lekin katta ma’lumotlarni (masalan, ulkan massivni) keraksiz ushlab turmang.
