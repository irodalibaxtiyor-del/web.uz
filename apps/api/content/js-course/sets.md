## `Set` — noyob qiymatlar to‘plami

`Set` har bir qiymatni **faqat bir marta** saqlaydi:

```js
const teglar = new Set(['html', 'css', 'html', 'js', 'css']);
teglar.size // 3 — 'html', 'css', 'js'
```

## Asosiy metodlar

```js
const s = new Set();
s.add('html');       // qo‘shish
s.add('css');
s.add('html');       // allaqachon bor — hech narsa o‘zgarmaydi
s.has('css');        // true — bormi?
s.delete('css');     // o‘chirish
s.size;              // 1
s.clear();           // hammasini o‘chirish
```

`has` massivdagi `includes` dan ancha tez — katta to‘plamlarda farq sezilarli.

## Massivdan dublikatlarni olib tashlash

Eng ko‘p ishlatiladigan holat:

```js
const sonlar = [3, 1, 3, 2, 1];
const noyob = [...new Set(sonlar)]; // [3, 1, 2]
```

`Set` qiymatlarni **birinchi qo‘shilgan tartibda** saqlaydi. `[...set]` yoki `Array.from(set)` uni massivga qaytaradi.

## Aylanish

```js
for (const teg of teglar) {
  console.log(teg);
}
teglar.forEach(function (teg) { /* ... */ });
```

## To‘plamlar ustida amallar

```js
const a = new Set(['html', 'css', 'js']);
const b = new Set(['css', 'react', 'js']);

// Kesishma — ikkalasida ham bor
const umumiy = [...a].filter(function (x) {
  return b.has(x);
}); // ['css', 'js']

// Birlashma
const hammasi = new Set([...a, ...b]); // html, css, js, react

// Ayirma — a da bor, b da yo‘q
const faqatA = [...a].filter(function (x) {
  return !b.has(x);
}); // ['html']
```

Yangi brauzerlarda tayyor metodlar ham bor: `a.intersection(b)`, `a.union(b)`, `a.difference(b)`.

## Qiymatlar qanday solishtiriladi

`Set` `===` ga o‘xshash solishtiradi:

```js
new Set([1, '1']).size       // 2 — son va satr har xil
new Set([{}, {}]).size       // 2 — har xil obyektlar
new Set([NaN, NaN]).size     // 1 — bu yerda NaN o‘ziga teng hisoblanadi
```

## Matndan noyob teglar

```js
const kiritma = 'html, css, html, js';
const teglar = new Set();
for (const qism of kiritma.split(',')) {
  const teg = qism.trim().toLowerCase();
  if (teg) teglar.add(teg);
}
[...teglar].join(', ') // 'html, css, js'
```

## Qachon `Set`?

- Dublikatlarni olib tashlash;
- “bu qiymat ko‘rilganmi?” degan savolni tez tekshirish (masalan, tanlangan elementlar);
- ikki ro‘yxatning umumiy yoki farqli qismlari.

Tartib va indeks muhim bo‘lsa — massiv.
