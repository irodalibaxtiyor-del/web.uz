## DOM bo‘ylab harakatlanish

Ba’zan element `id` siz, **boshqa elementga nisbatan** topiladi: “shu tugmaning kartasi”, “shu savolning javobi”.

## Elementlar bo‘yicha harakat

| Xususiyat                  | Nima                              |
| -------------------------- | --------------------------------- |
| `parentElement`            | Ota element                       |
| `children`                 | Bola elementlar (`HTMLCollection`) |
| `firstElementChild`        | Birinchi bola                     |
| `lastElementChild`         | Oxirgi bola                       |
| `nextElementSibling`       | Keyingi aka-uka                   |
| `previousElementSibling`   | Oldingi aka-uka                   |
| `closest(selektor)`        | Selektorga mos eng yaqin ota (o‘zi ham) |

```html
<div class="blok">
  <button class="savol">Kurs qancha davom etadi?</button>
  <p class="javob" hidden>Uch oy.</p>
</div>
```

```js
savolTugma.nextElementSibling;         // <p class="javob">
savolTugma.parentElement;              // <div class="blok">
savolTugma.closest('.blok');           // <div class="blok">
```

## Akkordeon

```js
for (const savol of document.querySelectorAll('.savol')) {
  savol.addEventListener('click', function () {
    const javob = this.nextElementSibling;
    javob.hidden = !javob.hidden;
    this.setAttribute('aria-expanded', String(!javob.hidden));
  });
}
```

`aria-expanded` — ekran o‘quvchilariga “ochiq/yopiq” holatini bildiradi.

## `closest` — eng foydalisi

Kartaning ichidagi tugmadan kartaning o‘zini topish:

```js
tugma.addEventListener('click', function () {
  this.closest('.karta').remove();
});
```

`parentElement.parentElement` ga nisbatan ancha ishonchli: HTML tuzilishi biroz o‘zgarsa ham ishlayveradi.

## Tugunlar va elementlar

DOM’da elementlardan tashqari **matn** va **izoh** tugunlari ham bor. Shuning uchun ikki xil xususiyatlar to‘plami mavjud:

| Barcha tugunlar     | Faqat elementlar           |
| ------------------- | -------------------------- |
| `childNodes`        | `children`                 |
| `firstChild`        | `firstElementChild`        |
| `nextSibling`       | `nextElementSibling`       |
| `parentNode`        | `parentElement`            |

```html
<ul>
  <li>HTML</li>
</ul>
```

```js
ul.firstChild;        // #text — teglar orasidagi yangi qator va bo‘sh joylar!
ul.firstElementChild; // <li>
```

Odatda **Element** variantlari kerak.

## Sanash

```js
royxat.children.length      // bola elementlar soni
royxat.childElementCount    // xuddi shu
```

## Butun daraxtni aylanish

```js
function hammasi(el, daraja = 0) {
  console.log(' '.repeat(daraja * 2) + el.tagName);
  for (const bola of el.children) hammasi(bola, daraja + 1);
}
hammasi(document.body);
```

Funksiya o‘zini chaqiradi — bu **rekursiya**. Daraxt tuzilmalari uchun tabiiy usul.
