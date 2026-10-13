## `call`, `apply`, `bind`

Funksiyalar ham obyekt va ularning metodlari bor. Bu uchtasi `this` ni **qo‘lda** belgilash imkonini beradi.

```js
function tanishtir(salom, belgi) {
  return `${salom}, men ${this.ism}${belgi}`;
}

const ali = { ism: 'Ali' };
const madina = { ism: 'Madina' };
```

## `call` — darhol chaqirish

Birinchi argument — `this`, qolganlari — funksiya argumentlari:

```js
tanishtir.call(ali, 'Salom', '!'); // 'Salom, men Ali!'
```

## `apply` — argumentlar massivda

```js
tanishtir.apply(madina, ['Assalomu alaykum', '.']); // 'Assalomu alaykum, men Madina.'
```

Eslab qolish: **a**pply — **a**rray. Zamonaviy kodda spread bilan `call` ko‘proq ishlatiladi:

```js
tanishtir.call(madina, ...['Assalomu alaykum', '.']);
```

## `bind` — keyinroq chaqirish uchun bog‘lash

`bind` funksiyani chaqirmaydi — `this` doimiy bog‘langan **yangi funksiya** qaytaradi:

```js
const aliTanishtiradi = tanishtir.bind(ali);
aliTanishtiradi('Salom', '!'); // 'Salom, men Ali!'
```

Eng ko‘p ishlatiladigan joyi — metodni hodisa ishlovchisi qilib berish:

```js
tugma.onclick = hamyon.qosh.bind(hamyon);
```

## Qisman qo‘llash (partial application)

`bind` ga `this` dan keyin argumentlar ham berish mumkin — ular **oldindan to‘ldiriladi**:

```js
function foizQosh(foiz, narx) {
  return Math.round(narx * (1 + foiz));
}

const qqsQosh = foizQosh.bind(null, 0.12); // foiz = 0.12 qotirildi
qqsQosh(1000); // 1120
qqsQosh(2500); // 2800
```

`this` kerak bo‘lmasa — `null` beriladi.

## Metodni “qarzga olish”

```js
const sonlar = [4, 9, 2];
Math.max.apply(null, sonlar); // 9 — eski usul
Math.max(...sonlar);          // 9 — zamonaviy
```

## Arrow funksiyalarda

Arrow funksiyaning `this` i o‘zgarmaydi — `call`, `apply`, `bind` uni o‘zgartira olmaydi:

```js
const f = () => this;
f.call(ali); // ali emas — tashqi this
```

## Xulosa

| Metod   | Chaqiradimi?    | Argumentlar        | Qaytaradi              |
| ------- | --------------- | ------------------ | ---------------------- |
| `call`  | Ha, darhol      | Alohida            | Funksiya natijasi      |
| `apply` | Ha, darhol      | Massivda           | Funksiya natijasi      |
| `bind`  | Yo‘q            | Alohida (qisman)   | Yangi funksiya         |
