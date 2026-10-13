## Massivlar

**Massiv** — bir nechta qiymatni **tartib bilan** saqlaydigan ro‘yxat:

```js
const xaridlar = ['non', 'sut', 'tuxum'];
```

Uch alohida o‘zgaruvchi (`xarid1`, `xarid2`, `xarid3`) o‘rniga bitta nom. Ro‘yxat 3 ta emas, 300 ta bo‘lsa ham — baribir bitta massiv.

## Elementga murojaat

Indekslar **0 dan** boshlanadi:

```js
xaridlar[0]                    // 'non'
xaridlar[2]                    // 'tuxum'
xaridlar[3]                    // undefined
xaridlar[xaridlar.length - 1]  // 'tuxum' — oxirgisi
xaridlar.at(-1)                // 'tuxum' — qisqaroq
```

## O‘zgartirish va qo‘shish

```js
xaridlar[0] = 'lavash';  // almashtirish
xaridlar.push('choy');   // oxiriga qo‘shish
xaridlar.length          // 4
```

`const` massivni boshqa massivga bog‘lashni taqiqlaydi, lekin ichini o‘zgartirishga ruxsat beradi. Shuning uchun massivlar deyarli doim `const` bilan e’lon qilinadi.

## Massivni matnga aylantirish

```js
xaridlar.join(', ')  // 'lavash, sut, tuxum, choy'
xaridlar.join(' → ') // 'lavash → sut → tuxum → choy'
xaridlar.toString()  // 'lavash,sut,tuxum,choy'
String(xaridlar)     // xuddi shu
```

Sahifada chiroyli ko‘rsatish uchun `join` qulay.

## Har xil turdagi elementlar

```js
const aralash = ['Ali', 20, true, { shahar: 'Xiva' }, [1, 2]];
```

Mumkin, lekin amalda massiv **bir xil** turdagi narsalarni saqlaydi: ismlar, narxlar, talabalar (obyektlar).

## Obyektlar massivi

Eng ko‘p uchraydigan tuzilma:

```js
const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
];

talabalar[1].ism  // 'Madina'
talabalar.length  // 2
```

## Massivmi?

`typeof` massivni `'object'` deydi. Aniq tekshirish:

```js
Array.isArray(xaridlar)     // true
Array.isArray('non, sut')   // false
```

## Bo‘sh massiv va yaratish usullari

```js
const bosh = [];
const yana = new Array(); // xuddi shu, lekin kamroq ishlatiladi
```

> `new Array(5)` — 5 ta **bo‘sh** joyli massiv, `[5]` esa bitta `5` elementli massiv. Chalkashlik bo‘lmasligi uchun `[]` ishlating.

## Input’dan qo‘shish

```js
const xaridlar = ['non', 'sut', 'tuxum'];

function korsat() {
  document.getElementById('ruyxat').textContent = xaridlar.join(', ');
  document.getElementById('soni').textContent = xaridlar.length;
}

document.getElementById('qosh').onclick = function () {
  xaridlar.push(document.getElementById('narsa').value);
  korsat();
};

korsat();
```
