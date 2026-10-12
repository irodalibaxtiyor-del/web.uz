## Ochiladigan menyu (dropdown)

Dropdown — bosilganda yoki ustiga kelinganda chiqadigan qo‘shimcha menyu.

## Asosiy tuzilma

```html
<div class="dropdown">
  <button class="dropdown-tugma" aria-expanded="false">Kurslar ▾</button>
  <ul class="dropdown-menyu">
    <li><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
  </ul>
</div>
```

```css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menyu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  min-width: 180px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

- Ota `relative` — menyu unga nisbatan joylashadi.
- `top: 100%` — menyu tugmaning aynan ostidan boshlanadi.
- `z-index` — menyu boshqa kontent ustida turadi.

## Ko‘rsatish: hover va fokus

```css
.dropdown:hover .dropdown-menyu,
.dropdown:focus-within .dropdown-menyu {
  display: block;
}
```

`:focus-within` — ichidagi biror element fokusda bo‘lsa ishlaydi. Shunda klaviatura foydalanuvchisi ham Tab bilan menyuga kira oladi.

> **Faqat hover yetarli emas.** Telefonlarda “ustiga kelish” yo‘q, klaviaturada ham yo‘q. To‘liq qulay dropdown odatda **bosish** bilan ochiladi: JavaScript `aria-expanded` ni `true` qiladi, CSS esa shunga qarab menyuni ko‘rsatadi:

```css
.dropdown-tugma[aria-expanded="true"] + .dropdown-menyu {
  display: block;
}
```

## JavaScript’siz variant: `<details>`

```html
<details class="dropdown">
  <summary>Kurslar</summary>
  <ul class="dropdown-menyu">…</ul>
</details>
```

`<details>` bosilganda ochiladi va yopiladi, klaviatura bilan ishlaydi. CSS bilan uni dropdown ko‘rinishiga keltirish mumkin.

## Menyu havolalari

```css
.dropdown-menyu a {
  display: block;
  padding: 8px 16px;
  color: #0e1133;
  text-decoration: none;
}

.dropdown-menyu a:hover,
.dropdown-menyu a:focus-visible {
  background-color: #f5faff;
}
```

## Ekran chetida

Menyu o‘ng chetdagi tugmada bo‘lsa, ekrandan chiqib ketishi mumkin. Unda `left: 0` o‘rniga `right: 0` bering.

## Xulosa

- Ota `relative`, menyu `absolute; top: 100%`.
- `:hover` bilan birga `:focus-within` ham yozing.
- Eng qulay dropdown bosish bilan ochiladi (`aria-expanded`).
