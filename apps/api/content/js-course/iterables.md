## Iteratsiya qilinadigan obyektlar

**Iterable** — `for...of` bilan aylanib bo‘ladigan har qanday narsa. JavaScript’da tayyor iterable’lar:

| Tur                   | Har aylanishda nima keladi            |
| --------------------- | ------------------------------------- |
| `Array`               | Element                               |
| `String`              | Belgi                                 |
| `Set`                 | Qiymat                                |
| `Map`                 | `[kalit, qiymat]` juftligi            |
| `NodeList` (DOM)      | HTML element                          |
| `arguments`           | Funksiya argumenti                    |

Oddiy obyekt `{}` — iterable **emas**.

## Iterable nimaga imkon beradi

Bitta umumiy “aylanish qoidasi” bo‘lgani uchun ko‘p narsa **bir xil** ishlaydi:

```js
// for...of
for (const harf of 'salom') { /* ... */ }

// spread operatori
[...'salom']          // ['s', 'a', 'l', 'o', 'm']
Math.max(...[3, 9, 2]) // 9

// Array.from
Array.from('salom')   // ['s', 'a', 'l', 'o', 'm']

// destrukturlash
const [birinchi, ikkinchi] = 'salom'; // 's', 'a'
```

## `entries`, `keys`, `values`

Massivning bu metodlari ham iterable qaytaradi:

```js
const mevalar = ['olma', 'non', 'suv'];

for (const juft of mevalar.entries()) {
  console.log(juft); // [0, 'olma'], [1, 'non'], [2, 'suv']
}

for (const [i, meva] of mevalar.entries()) {
  console.log(`${i + 1}. ${meva}`);
}
```

`[i, meva]` — juftlikni ikki o‘zgaruvchiga ajratish. Usiz: `juft[0]`, `juft[1]`.

## Iterator qanday ishlaydi

Har bir iterable `Symbol.iterator` metodiga ega. U **iterator** qaytaradi — `next()` metodi bor obyekt:

```js
const it = ['a', 'b'][Symbol.iterator]();
it.next() // { value: 'a', done: false }
it.next() // { value: 'b', done: false }
it.next() // { value: undefined, done: true }
```

`for...of` aynan shuni qiladi: `done` `true` bo‘lguncha `next()` ni chaqiradi. Odatda bu mexanizmni qo‘lda yozmaysiz, lekin u qanday ishlashini bilish foydali.

## Generator funksiyalar

`function*` va `yield` bilan o‘z iterable’ingizni yozish mumkin:

```js
function* oraliq(boshi, oxiri) {
  for (let i = boshi; i <= oxiri; i++) {
    yield i;
  }
}

[...oraliq(1, 5)] // [1, 2, 3, 4, 5]
```

## Amaliy misol: bosh harflar

```js
function boshHarflar(matn) {
  let natija = '';
  for (const soz of matn.split(',')) {
    const toza = soz.trim();
    if (toza) natija += toza[0].toUpperCase();
  }
  return natija;
}

boshHarflar('olma, non, suv') // 'ONS'
```
