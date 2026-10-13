## Hodisa obyekti va tarqalish

## Hodisa obyekti

Har bir hodisa ishlovchisi birinchi argument sifatida **hodisa obyekti**ni oladi:

```js
tugma.addEventListener('click', function (event) {
  event.type          // 'click'
  event.target        // aynan bosilgan element
  event.currentTarget // ishlovchi ulangan element
  event.timeStamp     // vaqt
});
```

Klaviatura va sichqoncha hodisalarida qo‘shimcha ma’lumot bor:

```js
event.key           // 'Enter', 'a', 'Escape'
event.ctrlKey       // Ctrl bosilganmi
event.clientX, event.clientY // sichqoncha koordinatalari
```

## Hodisa tarqalishi (bubbling)

Ichki element bosilganda, hodisa avval **o‘sha elementda**, keyin uning **otasida**, keyin otasining otasida… `document` gacha sodir bo‘ladi:

```html
<li>
  <span>HTML</span>
  <button class="ochir">O‘chirish</button>
</li>
```

```js
li.addEventListener('click', () => console.log('li'));
tugma.addEventListener('click', () => console.log('tugma'));
// Tugma bosilsa: 'tugma', keyin 'li'
```

Bu “ko‘piklanish” (bubbling) deyiladi.

## `target` va `currentTarget`

```js
li.addEventListener('click', function (event) {
  event.target        // <span> yoki <button> — aslida bosilgan
  event.currentTarget // <li> — ishlovchi shu yerda
  this                // <li> (oddiy funksiyada)
});
```

## `stopPropagation` — tarqalishni to‘xtatish

```js
tugma.addEventListener('click', function (event) {
  event.stopPropagation(); // li dagi ishlovchi ishlamaydi
  oxirgi.textContent = 'O‘chirish: ' + nom;
});
```

Ehtiyotkorlik bilan: tarqalishni to‘xtatish sahifaning boshqa joylaridagi kodni (masalan, analitika yoki ochiq menyuni yopuvchi kodni) ham “ko‘r” qiladi. Ko‘pincha `event.target` ni tekshirish yaxshiroq yechim.

## `preventDefault` — standart xatti-harakatni bekor qilish

Ba’zi hodisalarning brauzer tomonidan bajariladigan **standart** amali bor:

| Hodisa            | Standart amal                 |
| ----------------- | ----------------------------- |
| havolani bosish   | Boshqa sahifaga o‘tish        |
| formani yuborish  | Sahifani qayta yuklash        |
| checkbox bosish   | Belgini almashtirish          |
| `contextmenu`     | Sichqoncha o‘ng tugma menyusi |

```js
havola.addEventListener('click', function (event) {
  event.preventDefault();
  xabar.textContent = 'Havola bloklandi';
});
```

`preventDefault` tarqalishni **to‘xtatmaydi**, `stopPropagation` esa standart amalni bekor **qilmaydi** — ular mustaqil.

## Tarqalish bosqichlari

Hodisa aslida uch bosqichdan o‘tadi: **capture** (yuqoridan pastga), **target**, **bubble** (pastdan yuqoriga). Odatda faqat bubble ishlatiladi. Capture kerak bo‘lsa: `addEventListener('click', fn, { capture: true })`.

## Hodisani qo‘lda chaqirish

```js
tugma.click(); // xuddi foydalanuvchi bosgandek
el.dispatchEvent(new CustomEvent('saqlandi', { detail: { id: 7 } }));
```
