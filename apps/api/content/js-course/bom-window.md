## Brauzer obyekti: `window`

**BOM** (Browser Object Model) — brauzerning o‘zi bilan ishlash uchun obyektlar: oyna, manzil, tarix, ekran. Ularning hammasi `window` obyektida.

`window` — global obyekt: `document`, `console`, `setTimeout`, `alert` — aslida `window.document`, `window.console`...

```js
window.document === document // true
```

## Oyna o‘lchami

```js
window.innerWidth   // ko‘rinadigan qism kengligi (px)
window.innerHeight  // balandligi
window.outerWidth   // brauzer oynasi to‘liq kengligi
```

```js
document.getElementById('olcham').textContent = `${innerWidth}×${innerHeight}`;
```

`window.` ni yozmasa ham bo‘ladi.

## Media so‘rovlar JavaScript’da

CSS’dagi media so‘rovni JavaScript’da tekshirish:

```js
const mobil = window.matchMedia('(max-width: 599px)');
mobil.matches // true / false

mobil.addEventListener('change', (e) => {
  console.log(e.matches ? 'mobil' : 'kompyuter');
});
```

Bu `innerWidth` ni solishtirishdan ishonchliroq: chegaralar CSS bilan bir xil bo‘ladi.

## O‘lcham o‘zgarishi

```js
window.addEventListener('resize', () => {
  olcham.textContent = `${innerWidth}×${innerHeight}`;
});
```

`resize` juda tez-tez sodir bo‘ladi (har pikselda). Og‘ir hisoblarni unda bajarmang yoki kechiktiring.

## `screen`

```js
screen.width, screen.height       // butun ekran
screen.availWidth                 // panelsiz qism
window.devicePixelRatio           // 2 — “retina” ekranlarda
```

## Global o‘zgaruvchilar va `window`

Oddiy skriptda `var` va funksiya e’lonlari `window` xususiyatiga aylanadi:

```js
var kurs = 'JS';
window.kurs // 'JS'

let modul = 1;
window.modul // undefined — let/const window’ga qo‘shilmaydi
```

Bu `var` ning yana bir kamchiligi: global nomlar `window` dagi mavjud nomlarni (`name`, `status`, `top`) bosib ketishi mumkin.

## Dialog oynalari

```js
alert('Xabar');
const ha = confirm('O‘chirilsinmi?'); // true / false
const ism = prompt('Ismingiz?');      // matn yoki null
```

Ular sahifani to‘xtatib qo‘yadi va dizaynini o‘zgartirib bo‘lmaydi — zamonaviy saytlarda `<dialog>` elementi bilan o‘z oynalarini yasashadi. Mashq preview’ida bu funksiyalar konsolga yo‘naltiriladi.

## Yangi oyna

```js
const oyna = window.open('https://webdizayn.uz', '_blank', 'noopener');
```

Brauzerlar foydalanuvchi bosishisiz ochilgan oynalarni bloklaydi.

## Skroll

```js
window.scrollTo({ top: 0, behavior: 'smooth' }); // tepaga
window.scrollY // qancha pastga tushilgan
el.scrollIntoView({ behavior: 'smooth' });
```
