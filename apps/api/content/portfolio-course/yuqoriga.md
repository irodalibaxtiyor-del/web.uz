## Sahifa boshiga qaytish

Uzun bir sahifali portfolioda pastdan yuqoriga qaytish uchun tugma qulay. U o‘ng pastki burchakda doim turadi.

## HTML: havola

```html
<a class="yuqoriga" href="#bosh" aria-label="Sahifa boshiga qaytish">
  <svg aria-hidden="true">…</svg>
</a>
```

Bu “amal” emas, sahifaning boshqa joyiga o‘tish — shuning uchun `<a href="#bosh">`. JavaScript’siz ishlaydi, fokus ham to‘g‘ri joyga o‘tadi.

## CSS

```css
.yuqoriga {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 20;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: white;
  background-color: var(--urg);
}

html {
  scroll-behavior: smooth;
}
```

`position: fixed` — element ekranga nisbatan joylashadi va aylantirganda ham joyida qoladi.

## iPhone va xavfsiz hudud

iPhone’ning pastki qismidagi “uy chizig‘i” tugmani to‘sib qo‘ymasligi uchun:

```css
.yuqoriga {
  bottom: max(24px, env(safe-area-inset-bottom));
}
```

Viewport tegida `viewport-fit=cover` bo‘lsa ishlaydi.

## Faqat kerak bo‘lganda ko‘rsatish

Sahifa boshida bu tugma befoyda. Pastga aylantirilgandagina ko‘rsatish mumkin:

```js
const tugma = document.querySelector('.yuqoriga');
window.addEventListener(
  'scroll',
  () => {
    tugma.hidden = window.scrollY < 600;
  },
  { passive: true },
);
```

`passive: true` — brauzerga bu tinglovchi aylantirishni to‘xtatmasligini aytadi, sahifa silliqroq aylanadi.

## Kontentni to‘smasin

Qotirilgan tugma telefonda matn yoki boshqa tugmalarni yopib qo‘yishi mumkin. Sahifa pastiga (footer’ga) tugma o‘lchamicha bo‘sh joy qoldiring va kichik ekranda tekshiring.

Mashqda “yuqoriga” tugmasini qotirilgan, nomlangan va silliq ishlaydigan qilasiz.
