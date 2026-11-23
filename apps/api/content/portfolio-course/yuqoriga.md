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

```tekshir
“Yuqoriga” tugmasi iPhone’dagi pastki chiziq ostida qolmasligi uchun nima ishlatiladi?
+ `env(safe-area-inset-bottom)`
- `bottom: -20px`
- `z-index: 9999` yetarli
> `viewport-fit=cover` bilan xavfsiz hudud o‘lchamlarini hisobga oladi.
```

```jonli
<style>
  .w { height: 180px; overflow: auto; position: relative; border: 1px solid #ccc; scroll-behavior: smooth; }
  .yu { position: sticky; float: right; top: calc(100% - 56px); margin: 0 8px; width: 44px; height: 44px; border-radius: 50%; background: #6c3483; color: #fff; display: grid; place-items: center; text-decoration: none; }
</style>
<div class="w"><p id="boshi" style="margin: 0; padding: 8px">Boshi</p><div style="height: 500px; padding: 8px">Pastga aylantiring…</div><a class="yu" href="#boshi" aria-label="Sahifa boshiga">↑</a></div>
```
