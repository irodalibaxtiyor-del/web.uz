## Massiv metodlari

## Qo‘shish va olib tashlash

| Metod             | Qayerdan       | Nima qiladi              | Qaytaradi              |
| ----------------- | -------------- | ------------------------ | ---------------------- |
| `push(x)`         | Oxiridan       | Qo‘shadi                 | Yangi uzunlik          |
| `pop()`           | Oxiridan       | Olib tashlaydi           | Olingan element        |
| `unshift(x)`      | Boshidan       | Qo‘shadi                 | Yangi uzunlik          |
| `shift()`         | Boshidan       | Olib tashlaydi           | Olingan element        |

```js
const navbat = ['Ali', 'Vali'];
navbat.push('Jasur');      // ['Ali', 'Vali', 'Jasur']
navbat.unshift('Madina');  // ['Madina', 'Ali', 'Vali', 'Jasur']
const birinchi = navbat.shift(); // 'Madina', navbat: ['Ali', 'Vali', 'Jasur']
const oxirgi = navbat.pop();     // 'Jasur',  navbat: ['Ali', 'Vali']
```

Navbat (birinchi kelgan — birinchi chiqadi): `push` + `shift`. Stek (oxirgi kelgan — birinchi chiqadi): `push` + `pop`.

## O‘rtadan o‘zgartirish: `splice`

`splice(boshlanish, nechta, ...yangilar)` — massivni **o‘zini** o‘zgartiradi:

```js
const ranglar = ['qizil', 'yashil', 'ko‘k', 'sariq'];
ranglar.splice(1, 2);              // ['yashil', 'ko‘k'] olib tashlandi
// ranglar: ['qizil', 'sariq']
ranglar.splice(1, 0, 'oq', 'qora'); // hech narsa olinmadi, ikkitasi qo‘shildi
// ranglar: ['qizil', 'oq', 'qora', 'sariq']
```

## Nusxa olish: `slice`

`slice` asl massivni **o‘zgartirmaydi**:

```js
const sonlar = [10, 20, 30, 40, 50];
sonlar.slice(1, 3)  // [20, 30]
sonlar.slice(-2)    // [40, 50]
sonlar.slice()      // to‘liq nusxa
```

## Birlashtirish

```js
const a = ['HTML', 'CSS'];
const b = ['JavaScript'];
a.concat(b)    // ['HTML', 'CSS', 'JavaScript']
[...a, ...b]   // xuddi shu — spread operatori
```

`...` (spread) — massiv elementlarini “yoyib” yozadi. Zamonaviy kodda ko‘p ishlatiladi.

## Ichma-ich massivni tekislash

```js
[[1, 2], [3, [4, 5]]].flat()  // [1, 2, 3, [4, 5]]
[[1, 2], [3, [4, 5]]].flat(2) // [1, 2, 3, 4, 5]
```

## O‘zgartiradi yoki yo‘q?

Bu muhim farq:

| Asl massivni **o‘zgartiradi**              | Yangi massiv **qaytaradi**            |
| ------------------------------------------ | ------------------------------------- |
| `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse` | `slice`, `concat`, `flat`, `map`, `filter`, `toSorted` |

Ma’lumot bir necha joyda ishlatilsa, o‘zgartirmaydigan metodlar xavfsizroq.

## Bo‘sh massivdan olish

```js
[].shift() // undefined — xato emas
```

Navbat bo‘sh bo‘lishi mumkin bo‘lsa, natijani tekshiring (shartlar — keyingi modullarda) yoki `?? 'Navbat bo‘sh'` bilan standart qiymat bering:

```js
const keyingi = navbat.shift() ?? 'Navbat bo‘sh';
```
