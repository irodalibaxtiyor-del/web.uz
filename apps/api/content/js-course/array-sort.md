## Saralash

## `sort` — standart holat

```js
const mevalar = ['olma', 'anor', 'uzum', 'behi'];
mevalar.sort(); // ['anor', 'behi', 'olma', 'uzum']
```

`sort` massivning **o‘zini** o‘zgartiradi va uni qaytaradi.

## Sonlar bilan tuzoq

Standart `sort` elementlarni **matn** sifatida solishtiradi:

```js
const sonlar = [5, 12, 3, 40];
sonlar.sort(); // [12, 3, 40, 5] — '1' < '3' < '4' < '5'
```

Sonlarni to‘g‘ri saralash uchun **solishtirish funksiyasi** beriladi:

```js
sonlar.sort(function (a, b) {
  return a - b;
}); // [3, 5, 12, 40] — o‘sish tartibida

sonlar.sort(function (a, b) {
  return b - a;
}); // [40, 12, 5, 3] — kamayish tartibida
```

### Qanday ishlaydi?

`sort` ikki elementni funksiyaga beradi:

- manfiy son qaytsa — `a` oldin;
- musbat — `b` oldin;
- `0` — tartib o‘zgarmaydi.

`a - b` aynan shunday son beradi. Matn ko‘rinishidagi sonlar (`'12'`) bilan ham ishlaydi, chunki `-` ularni songa aylantiradi.

## `reverse`

```js
['a', 'b', 'c'].reverse() // ['c', 'b', 'a']
```

Kamayish tartibida harflar: `mevalar.sort().reverse()`.

## Obyektlarni saralash

```js
const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
  { ism: 'Jasur', ball: 67 },
];

talabalar.sort(function (a, b) {
  return b.ball - a.ball;
}); // Madina, Ali, Jasur
```

Ism bo‘yicha (o‘zbek alifbosini hisobga olib):

```js
talabalar.sort(function (a, b) {
  return a.ism.localeCompare(b.ism);
});
```

## Asl massivni saqlab qolish: `toSorted`

```js
const sonlar = [5, 12, 3];
const saralangan = sonlar.toSorted(function (a, b) {
  return a - b;
});
// saralangan: [3, 5, 12], sonlar: [5, 12, 3] — o‘zgarmadi
```

Xuddi shunday `toReversed()`. Eski brauzerlarda bo‘lmasa: `sonlar.slice().sort(...)`.

## Matndan sonlar ro‘yxati

```js
const kiritma = '5 12 3 40';
const qismlar = kiritma.split(' '); // ['5', '12', '3', '40']
qismlar.sort(function (a, b) {
  return a - b;
});
qismlar.join(', '); // '3, 5, 12, 40'
```

## Eng katta va eng kichik

```js
const sonlar = [5, 12, 3, 40];
Math.max(...sonlar) // 40
Math.min(...sonlar) // 3
```

`...` massivni alohida argumentlarga yoyadi. Faqat eng kattasi kerak bo‘lsa, saralashdan tezroq.
