## Popover nima?

**Popover** — sahifa ustida paydo bo‘ladigan kichik oyna: yordam matni, menyu yoki bildirishnoma. Ilgari buning uchun JavaScript yozish kerak edi. Endi HTML’ning o‘zida `popover` atributi bor.

## Eng oddiy popover

```html
<button popovertarget="yordam">Yordam</button>

<div id="yordam" popover>
  <p>Parol kamida 8 belgidan iborat bo‘lishi kerak.</p>
</div>
```

- `popover` — element odatiy holda **yashirin** bo‘ladi va sahifaning eng ustki qatlamida ochiladi;
- `popovertarget="yordam"` — tugma shu `id` li popover’ni ochadi va yopadi.

JavaScript kerak emas! Bundan tashqari, brauzer o‘zi:

- tashqariga bosilganda yopadi;
- `Esc` bosilganda yopadi;
- bir vaqtda faqat bitta `auto` popover ochiq bo‘lishini ta’minlaydi.

## Tugma harakati

`popovertargetaction` atributi tugmaning nima qilishini belgilaydi:

| Qiymat   | Harakat                     |
| -------- | --------------------------- |
| `toggle` | Ochish/yopish (standart)    |
| `show`   | Faqat ochish                |
| `hide`   | Faqat yopish                |

```html
<div id="xabar" popover>
  <p>Saqlandi!</p>
  <button popovertarget="xabar" popovertargetaction="hide">Yopish</button>
</div>
```

## `auto` va `manual`

| Turi              | Xususiyati                                                 |
| ----------------- | ---------------------------------------------------------- |
| `popover` (`auto`) | Tashqariga bosilsa yoki `Esc` da yopiladi                 |
| `popover="manual"` | Faqat tugma yoki JavaScript bilan yopiladi; bir nechtasi birga ochilishi mumkin |

## JavaScript bilan

```js
const p = document.getElementById('yordam');
p.showPopover();   // ochish
p.hidePopover();   // yopish
p.togglePopover(); // almashtirish
```

## Bezash

Ochiq popover `:popover-open` psevdoklassi bilan, uning ortidagi fon `::backdrop` bilan bezaladi:

```html
<style>
  [popover] { padding: 16px; border: 1px solid #0071dc; border-radius: 8px; }
  [popover]:popover-open { box-shadow: 0 8px 24px rgb(0 0 0 / 0.2); }
</style>
```

## Xulosa

- `popover` atributi + `popovertarget` li tugma = JavaScript’siz ochiladigan oyna.
- `auto` tashqariga bosilganda va `Esc` da yopiladi, `manual` — faqat qo‘lda.
- `showPopover()` / `hidePopover()` / `togglePopover()` — JS orqali boshqarish.
