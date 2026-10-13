## Elementlarni topish

## Barcha usullar

| Metod                                   | Qaytaradi                    | Jonli? |
| --------------------------------------- | ---------------------------- | ------ |
| `getElementById('id')`                  | Element yoki `null`          | —      |
| `getElementsByTagName('li')`            | `HTMLCollection`             | Ha     |
| `getElementsByClassName('kurs')`        | `HTMLCollection`             | Ha     |
| `querySelector('selektor')`             | Birinchi element yoki `null` | —      |
| `querySelectorAll('selektor')`          | `NodeList`                   | Yo‘q   |

Zamonaviy kodda asosan `querySelector` va `querySelectorAll` — ular CSS selektorlarini tushunadi.

## `querySelectorAll`

```js
const kurslar = document.querySelectorAll('.kurs');
kurslar.length; // nechta

for (const kurs of kurslar) {
  console.log(kurs.textContent);
}

kurslar.forEach((kurs) => { /* ... */ });
```

Murakkab selektorlar:

```js
document.querySelectorAll('.kurs.orta');         // ikkala klass ham bor
document.querySelectorAll('ul#katalog > li');    // to‘g‘ridan-to‘g‘ri bolalar
document.querySelectorAll('li:not(.tugagan)');   // inkor
```

## Massiv metodlari uchun

`NodeList` da `forEach` bor, lekin `map` va `filter` yo‘q. Massivga aylantiring:

```js
const nomlar = [...document.querySelectorAll('.kurs.orta')].map((li) => li.textContent);
// yoki Array.from(...)
```

## Klass bo‘yicha filtr

```js
function topish(daraja) {
  return [...document.querySelectorAll(`.kurs.${daraja}`)]
    .map((li) => li.textContent)
    .join(', ');
}
```

> Selektorga foydalanuvchi matnini qo‘ysangiz, unda `.` yoki `#` kabi belgilar selektorni buzishi mumkin. Ishonchliroq usul — elementlarni olib, `classList.contains(daraja)` bilan tekshirish:

```js
[...document.querySelectorAll('.kurs')].filter((li) => li.classList.contains(daraja));
```

## Jonli va statik to‘plamlar

`getElementsBy...` **jonli** to‘plam qaytaradi — DOM o‘zgarsa, u ham o‘zgaradi. `querySelectorAll` — **suratga** olingan, o‘zgarmaydi:

```js
const jonli = document.getElementsByTagName('li');
const statik = document.querySelectorAll('li');
// yangi <li> qo‘shildi
jonli.length  // ko‘paydi
statik.length // o‘zgarmadi
```

Batafsil — “DOM to‘plamlari” darsida.

## Maxsus to‘plamlar

```js
document.forms        // barcha <form> lar
document.forms.royxat // name="royxat" bo‘lgan forma
document.links        // href’li barcha <a> lar
document.images       // barcha <img> lar
```

## `closest` va `matches`

```js
tugma.closest('.karta');     // eng yaqin .karta ota-bobosi (o‘zi ham hisoblanadi)
el.matches('.kurs.orta');    // element selektorga mosmi?
```

Hodisalar bilan ishlashda juda qulay — keyingi modulda.
