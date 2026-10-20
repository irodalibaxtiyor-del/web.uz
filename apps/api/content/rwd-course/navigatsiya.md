## Menyu telefonga sig‘maydi

Kompyuterda 5–6 ta havola bir qatorga bemalol sig‘adi. Telefonda esa ular yo ikki qatorga tushib, sarlavhani egallaydi, yo kichrayib bosish qiyinlashadi. Odatiy yechim — **burger tugmasi**: menyu yopiq turadi, tugma bosilganda ochiladi.

## HTML

```html
<button type="button" class="burger" aria-expanded="false" aria-controls="menyu">
  <span class="sr-only">Menyu</span>
  <svg aria-hidden="true">…</svg>
</button>
<nav>
  <ul id="menyu" class="menyu">…</ul>
</nav>
```

- `<button>` — havola (`<a href="#">`) emas, chunki u sahifa ochmaydi, amal bajaradi. Tugma klaviaturadan Enter va Space bilan ishlaydi.
- `aria-controls` — tugma qaysi elementni boshqarishini aytadi.
- `aria-expanded` — menyu hozir ochiqmi; ekran o‘quvchi “Menyu, yopiq tugma” deb e’lon qiladi.
- Ikonkada yozuv yo‘q, shuning uchun yashirin matn yoki `aria-label` kerak.

## CSS: avval mobil

```css
.menyu { display: none; }
.menyu.ochiq { display: block; }

@media (min-width: 768px) {
  .burger { display: none; }
  .menyu { display: flex; gap: 24px; }
}
```

Kompyuterda `.ochiq` klassi bo‘lsa ham bo‘lmasa ham menyu ko‘rinadi.

## JavaScript

```js
const burger = document.querySelector('.burger');
const menyu = document.querySelector('#menyu');

burger.addEventListener('click', () => {
  const ochiq = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!ochiq));
  menyu.classList.toggle('ochiq', !ochiq);
});
```

Atribut qiymati satr (`"true"`), shuning uchun mantiqiy qiymat `String()` bilan satrga aylantiriladi.

## Qo‘shimcha qulayliklar

Yaxshi mobil menyuda yana:

- **Esc** tugmasi menyuni yopadi va fokusni burgerga qaytaradi;
- menyudan tashqariga bosish uni yopadi;
- havola bosilgach (bitta sahifali saytda) menyu yopiladi;
- ochilganda menyu ekranning qolgan qismini egallasa, sahifa orqada aylanmasligi kerak.

## JavaScript’siz variant

Oddiy holatlarda `<details>` elementi ham ishlaydi:

```html
<details class="mobil-menyu">
  <summary>Menyu</summary>
  <ul>…</ul>
</details>
```

U klaviatura va ekran o‘quvchi bilan o‘zi ishlaydi, lekin ko‘rinishini sozlash cheklangan.

Mashqda burger tugmasini `aria-expanded` bilan to‘liq ishlaydigan qilasiz.
