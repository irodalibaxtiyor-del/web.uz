## Ikki xil xatti-harakat

Har bir HTML elementi standart bo‘yicha ikki turdan biriga kiradi: **blok** yoki **satr ichidagi (inline)**.

## Blok elementlar

- har doim **yangi qatordan** boshlanadi;
- mavjud **butun kenglikni** egallaydi;
- tepasi va pastida odatda bo‘sh joy bo‘ladi.

Misollar: `<div>`, `<p>`, `<h1>`…`<h6>`, `<ul>`, `<ol>`, `<li>`, `<table>`, `<form>`, `<header>`, `<section>`, `<footer>`.

```html
<p>Birinchi paragraf</p>
<p>Ikkinchi paragraf — har doim yangi qatordan</p>
```

## Satr ichidagi (inline) elementlar

- yangi qatordan **boshlanmaydi**;
- faqat **mazmuni kerak qilgan kenglikni** egallaydi;
- matn oqimi ichida turadi.

Misollar: `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<code>`, `<label>`, `<button>`.

```html
<p>Bu gapda <strong>qalin</strong> so‘z va <a href="#">havola</a> bor.</p>
```

## `<div>` va `<span>`

Ikkalasi ham hech qanday ma’no bildirmaydi — ular “bo‘sh konteyner”:

|          | `<div>`                   | `<span>`                 |
| -------- | ------------------------- | ------------------------ |
| Turi     | Blok                      | Inline                   |
| Vazifasi | Katta qismlarni guruhlash | Matn bo‘lagini belgilash |

```html
<div style="background-color: #f5faff; padding: 12px;">
  <h3>Ob-havo</h3>
  <p>Bugun Toshkentda <span style="color: crimson;">+34°C</span>.</p>
</div>
```

## Turini CSS bilan o‘zgartirish

```css
li {
  display: inline;
} /* ro‘yxat elementlari bir qatorga */
span {
  display: block;
} /* span blokdek tutadi */
```

Lekin e’tibor bering: `display` faqat ko‘rinishni o‘zgartiradi. Inline element ichiga blok elementni (masalan, `<span>` ichiga `<div>`) joylashtirmang — bu noto‘g‘ri HTML.

## Xulosa

- Blok elementlar yangi qatordan boshlanadi va to‘liq kenglikni egallaydi.
- Inline elementlar matn ichida turadi va faqat kerakli kenglikni oladi.
- `<div>` — blok konteyner, `<span>` — inline konteyner.
