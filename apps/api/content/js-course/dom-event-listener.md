## `addEventListener`

```js
el.addEventListener(hodisa, funksiya, sozlamalar);
```

`onclick` xususiyatidan farqli, `addEventListener` bitta hodisaga **bir nechta** ishlovchi ulash imkonini beradi:

```js
tugma.onclick = a;
tugma.onclick = b; // a o‘chib ketdi!

tugma.addEventListener('click', a);
tugma.addEventListener('click', b); // ikkalasi ham ishlaydi, ulangan tartibda
```

## Ishlovchini olib tashlash

```js
function bosildi() { /* ... */ }

tugma.addEventListener('click', bosildi);
tugma.removeEventListener('click', bosildi);
```

Olib tashlash uchun **aynan o‘sha** funksiya kerak. Nomsiz funksiyani olib tashlab bo‘lmaydi:

```js
tugma.addEventListener('click', () => {});
tugma.removeEventListener('click', () => {}); // ishlamaydi — boshqa funksiya
```

## Sozlamalar

```js
tugma.addEventListener('click', fn, { once: true });    // bir marta ishlab, o‘zi o‘chadi
el.addEventListener('scroll', fn, { passive: true });   // preventDefault chaqirmaydi — tezroq skroll
el.addEventListener('click', fn, { capture: true });    // capture bosqichida
```

`once` — “faqat birinchi bosish hisoblanadi” kabi holatlar uchun.

## Hodisalar delegatsiyasi

Ko‘p elementga alohida ishlovchi ulash o‘rniga, **bitta** ishlovchini ularning umumiy otasiga ulang va `event.target` orqali qaysi biri bosilganini aniqlang:

```js
royxat.addEventListener('click', function (event) {
  const tugma = event.target.closest('.bajarildi');
  if (!tugma) return; // boshqa joy bosildi
  tugma.closest('li').classList.toggle('tugagan');
});
```

Afzalliklari:

- **keyin qo‘shilgan** elementlar ham avtomatik ishlaydi — ularga alohida ishlovchi ulash shart emas;
- 1000 ta element uchun 1000 emas, **bitta** ishlovchi — xotira tejaladi;
- kod bir joyda.

`closest` muhim: tugma ichida ikonka (`<svg>`) yoki `<span>` bo‘lsa, `event.target` o‘sha ichki element bo‘ladi, `closest('.bajarildi')` esa tugmaning o‘zini topadi.

## Klaviatura hodisalari

```js
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') oynaniYop();
});
```

## Sahifa hodisalari

```js
document.addEventListener('DOMContentLoaded', boshla); // HTML tayyor
window.addEventListener('load', fn);    // rasmlar ham yuklandi
window.addEventListener('resize', fn);  // oyna o‘lchami o‘zgardi
```

## `this` va arrow

```js
tugma.addEventListener('click', function () {
  this; // tugma
});
tugma.addEventListener('click', () => {
  this; // tashqi doira — tugma emas! event.currentTarget ishlating
});
```
