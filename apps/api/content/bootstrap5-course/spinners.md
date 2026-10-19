## Spinner

```html
<div class="spinner-border" role="status">
  <span class="visually-hidden">Yuklanmoqda…</span>
</div>
<div class="spinner-grow" role="status">
  <span class="visually-hidden">Yuklanmoqda…</span>
</div>
```

| Klass             | Ko‘rinishi                     |
| ----------------- | ------------------------------ |
| `.spinner-border` | Aylanayotgan halqa              |
| `.spinner-grow`   | Kattalashib-kichrayadigan doira |

Bootstrap 4 dan farqi faqat yashirin matn klassida: `.sr-only` → **`.visually-hidden`**.

## Rang va o‘lcham

```html
<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yuklanmoqda…</span></div>
<div class="spinner-grow text-success spinner-grow-sm" role="status"><span class="visually-hidden">Yuklanmoqda…</span></div>
<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status"><span class="visually-hidden">Yuklanmoqda…</span></div>
```

Bootstrap 5.3 da o‘lchamni CSS o‘zgaruvchi bilan ham berish mumkin:

```html
<div class="spinner-border" style="--bs-spinner-width: 3rem; --bs-spinner-height: 3rem;" role="status">…</div>
```

## Joylashtirish

```html
<!-- Markazda -->
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status"><span class="visually-hidden">Yuklanmoqda…</span></div>
</div>

<!-- Matn bilan, o‘ngda -->
<div class="d-flex align-items-center">
  <strong role="status">Yuklanmoqda…</strong>
  <div class="spinner-border ms-auto" aria-hidden="true"></div>
</div>
```

Ikkinchi misolda matn ko‘rinib turibdi, shuning uchun spinner `aria-hidden="true"`.

## Tugma ichida

```html
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span role="status">Saqlanmoqda…</span>
</button>
```

## JavaScript bilan

Odatda spinner ma’lumot yuklanayotganda ko‘rsatiladi va keyin yashiriladi:

```js
const spinner = document.getElementById('yuklash');
spinner.classList.remove('d-none');          // ko‘rsatish
fetch('/api/kurslar')
  .then((r) => r.json())
  .then(chizish)
  .finally(() => spinner.classList.add('d-none')); // yashirish
```

## Harakatni kamaytirish

Foydalanuvchi tizimda animatsiyani kamaytirishni yoqqan bo‘lsa (`prefers-reduced-motion`), Bootstrap spinner animatsiyasini sekinlashtiradi.

## Xulosa

- `.spinner-border` / `.spinner-grow` + `role="status"` + `.visually-hidden` matn.
- Rang — `text-*`, kichik — `-sm`, o‘lcham — `--bs-spinner-*`.
- Ko‘rinadigan matn bo‘lsa, spinnerga `aria-hidden="true"`.
