## Qorong‘i rejim (dark mode)

Bootstrap 5.3 da **rang rejimlari** qo‘shildi. Butun sahifani yoki bitta blokni qorong‘i qilish uchun bitta atribut yetarli:

```html
<html lang="uz" data-bs-theme="dark">
```

Ichkaridagi barcha komponentlar — fon, matn, card, jadval, forma, dropdown, modal — avtomatik qorong‘i ranglarga o‘tadi.

## Faqat bitta blok

`data-bs-theme` istalgan elementga beriladi va uning ichidagi hamma narsaga ta’sir qiladi:

```html
<div class="p-3 bg-body text-body" data-bs-theme="dark">
  <p>Bu blok qorong‘i.</p>
  <div class="dropdown" data-bs-theme="light">
    <!-- bu dropdown esa och -->
  </div>
</div>
```

## Qanday ishlaydi?

Bootstrap ranglarini CSS o‘zgaruvchilar (`--bs-body-bg`, `--bs-body-color`, `--bs-border-color`…) orqali beradi. `[data-bs-theme="dark"]` selektori shu o‘zgaruvchilarni qorong‘i qiymatlarga almashtiradi:

| O‘zgaruvchi           | Och (light)  | Qorong‘i (dark) |
| --------------------- | ------------ | --------------- |
| `--bs-body-bg`        | `#fff`       | `#212529`       |
| `--bs-body-color`     | `#212529`    | `#dee2e6`       |
| `--bs-tertiary-bg`    | `#f8f9fa`    | `#2b3035`       |

Shuning uchun **moslashadigan** klasslardan foydalaning:

| Moslashadi (yaxshi)     | Moslashmaydi (ehtiyot bo‘ling) |
| ----------------------- | ------------------------------ |
| `bg-body`, `text-body`  | `bg-white`, `text-dark`        |
| `bg-body-tertiary`      | `bg-light`                     |
| `text-body-secondary`   | `text-muted` (eskirgan)        |
| `border` (rang avtomatik) | `border-dark`                |

`bg-light` har doim och kulrang — qorong‘i rejimda u “oq dog‘” bo‘lib qoladi.

## Tizim sozlamasiga qarab

Foydalanuvchi tizimida qorong‘i rejim yoqilgan bo‘lsa (`prefers-color-scheme: dark`), sahifani avtomatik moslash:

```js
const qorongi = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-bs-theme', qorongi ? 'dark' : 'light');
```

## Almashtirgich tugma

```html
<button class="btn btn-outline-secondary" id="rejim" type="button" aria-pressed="false">
  Qorong‘i rejim
</button>
```

```js
const tugma = document.getElementById('rejim');
tugma.addEventListener('click', () => {
  const html = document.documentElement;
  const yangi = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-bs-theme', yangi);
  tugma.setAttribute('aria-pressed', String(yangi === 'dark'));
  tugma.textContent = yangi === 'dark' ? 'Och rejim' : 'Qorong‘i rejim';
});
```

Tanlovni keyingi safar eslab qolish uchun `localStorage` ga yozish mumkin (platforma preview’ida `localStorage` ishlamaydi — o‘z kompyuteringizda sinab ko‘ring).

## O‘z rang rejimingiz

```css
[data-bs-theme="moviy"] {
  --bs-body-bg: #0e1133;
  --bs-body-color: #e6ecff;
}
```

## Xulosa

- `data-bs-theme="dark"` — `<html>` da butun sahifa, elementda faqat shu blok.
- Moslashadigan klasslar: `bg-body`, `bg-body-tertiary`, `text-body`, `text-body-secondary`.
- `prefers-color-scheme` va JS bilan almashtirish.
