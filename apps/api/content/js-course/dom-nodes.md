## Elementlarni yaratish va o‘chirish

## Yaratish

```js
const li = document.createElement('li');
li.textContent = 'Non olish';
li.className = 'vazifa';
```

Yaratilgan element hali sahifada **yo‘q** — u faqat xotirada.

## Sahifaga qo‘shish

```js
royxat.append(li);        // oxiriga
royxat.prepend(li);       // boshiga
mavjud.before(li);        // mavjud elementdan oldin
mavjud.after(li);         // keyin
royxat.append(li1, li2, 'matn'); // bir nechtasini birdan
```

Eski usullar ham uchraydi: `appendChild(li)`, `insertBefore(yangi, mavjud)`.

## O‘chirish va almashtirish

```js
li.remove();                 // o‘zini o‘chiradi
eski.replaceWith(yangi);     // almashtiradi
royxat.replaceChildren();    // barcha bolalarni o‘chiradi
```

## Xavfsiz ro‘yxat yasash

Foydalanuvchi matni bilan element yasashda `innerHTML` o‘rniga `createElement` + `textContent`:

```js
function vazifaQosh(matn) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = matn; // XSS’dan xavfsiz

  const tugma = document.createElement('button');
  tugma.type = 'button';
  tugma.textContent = 'O‘chirish';
  tugma.addEventListener('click', () => {
    li.remove();
    soniniYangila();
  });

  li.append(span, ' ', tugma);
  royxat.append(li);
}
```

Foydalanuvchi `<b>qalin</b>` yozsa, sahifada aynan shu belgilar ko‘rinadi — `<b>` elementi yaratilmaydi.

## Nusxa olish

```js
const nusxa = karta.cloneNode(true); // true — ichidagilari bilan
nusxa.id = '';                        // id takrorlanmasin!
royxat.append(nusxa);
```

`cloneNode` hodisa ishlovchilarini nusxalamaydi.

## `<template>` bilan

Murakkab bo‘lak HTML’da tayyorlanadi, JavaScript faqat nusxalab to‘ldiradi:

```html
<template id="karta-shablon">
  <article class="karta">
    <h3></h3>
    <p class="narx"></p>
  </article>
</template>
```

```js
const shablon = document.getElementById('karta-shablon');
const karta = shablon.content.cloneNode(true);
karta.querySelector('h3').textContent = kurs.nom;
karta.querySelector('.narx').textContent = kurs.narx + ' so‘m';
royxat.append(karta);
```

## Ko‘p elementni birdan: `DocumentFragment`

```js
const bolak = document.createDocumentFragment();
for (const kurs of kurslar) {
  const li = document.createElement('li');
  li.textContent = kurs;
  bolak.append(li);
}
royxat.append(bolak); // sahifa bir marta yangilanadi
```

Har bir `append` da sahifa qayta hisoblanishi mumkin; fragment bilan bitta yakuniy qo‘shish.

## Bo‘sh joylar

`li.append(span, ' ', tugma)` dagi `' '` — matn tuguni: span va tugma orasida bo‘sh joy. CSS’da `gap` bilan hal qilish ham mumkin.
