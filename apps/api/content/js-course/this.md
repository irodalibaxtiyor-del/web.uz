## `this` kalit so‘zi

`this` — funksiya **qanday chaqirilganiga** qarab qiymat oladigan maxsus so‘z. U funksiya qayerda yozilganiga emas, **qanday chaqirilganiga** bog‘liq (arrow funksiyalar bundan mustasno).

## Holatlar

| Qanday chaqirildi                    | `this`                              |
| ------------------------------------ | ----------------------------------- |
| `obyekt.metod()`                     | `obyekt`                            |
| Oddiy `funksiya()`                   | `undefined` (qat’iy) yoki `window`  |
| Hodisa ishlovchisi (`el.onclick`)    | Hodisa sodir bo‘lgan **element**    |
| `new Klass()`                        | Yangi yaratilgan obyekt             |
| `f.call(x)`, `f.bind(x)`             | `x`                                 |
| Arrow funksiya                       | **Tashqi** doiraning `this` i       |

## Metodda

```js
const hamyon = {
  balans: 0,
  qosh() {
    this.balans += 1000; // this — hamyon
  },
};
hamyon.qosh();
```

## Hodisa ishlovchisida

```js
function tanla() {
  document.getElementById('tanlangan').textContent = this.textContent;
}

for (const tugma of document.querySelectorAll('.rang')) {
  tugma.onclick = tanla; // this — bosilgan tugma
}
```

Bitta funksiya bir nechta tugmaga xizmat qiladi: `this` qaysi biri bosilganini aytadi.

## Klassik xato: kontekst yo‘qolishi

```js
document.getElementById('qosh').onclick = hamyon.qosh;
```

Endi `qosh` **tugmaning** hodisa ishlovchisi sifatida chaqiriladi: `this` — tugma, `hamyon` emas. `this.balans` — `undefined`, `undefined + 1000` — `NaN`.

Ikki yechim:

```js
// 1. bind — this ni doimiy bog‘lab qo‘yadi
document.getElementById('qosh').onclick = hamyon.qosh.bind(hamyon);

// 2. O‘rab chaqirish — metod obyekt orqali chaqiriladi
document.getElementById('qosh').onclick = function () {
  hamyon.qosh();
};
```

## Arrow funksiyada

Arrow funksiyaning **o‘z** `this` i yo‘q — u tashqaridagini oladi:

```js
const taymer = {
  soniya: 0,
  boshla() {
    setInterval(() => {
      this.soniya++; // this — taymer (boshla metodidan olingan)
    }, 1000);
  },
};
```

Oddiy `function () {}` yozilganda bu yerda `this` `taymer` bo‘lmasdi.

Lekin metodni arrow qilib yozmang:

```js
const obj = {
  x: 1,
  xato: () => this.x, // this — tashqi doira, obj emas
};
```

## Qisqa qoida

- Obyekt metodlari — oddiy metod sintaksisi `metod() {}`.
- Metodni boshqa joyga **havola** sifatida bersangiz (`onclick`, `setTimeout`) — `bind` yoki o‘rab chaqiring.
- Ichki callback’larda tashqi `this` kerak bo‘lsa — arrow funksiya.
