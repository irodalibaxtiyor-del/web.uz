## Spinner — yuklanish belgisi

**Spinner** biror narsa yuklanayotganini yoki jarayon davom etayotganini ko‘rsatadi. U faqat CSS bilan chiziladi (rasm yoki JavaScript kerak emas) va Bootstrap 4.2 da qo‘shilgan.

```html
<div class="spinner-border" role="status">
  <span class="sr-only">Yuklanmoqda…</span>
</div>
```

- `role="status"` — ekran o‘quvchiga bu holat ko‘rsatkichi ekanini aytadi;
- `.sr-only` matn — “Yuklanmoqda…” deb o‘qiladi, ekranda ko‘rinmaydi.

## Ikki turi

```html
<div class="spinner-border" role="status"><span class="sr-only">Yuklanmoqda…</span></div>
<div class="spinner-grow" role="status"><span class="sr-only">Yuklanmoqda…</span></div>
```

| Klass             | Ko‘rinishi                                      |
| ----------------- | ----------------------------------------------- |
| `.spinner-border` | Aylanayotgan halqa (bir tomoni ochiq)           |
| `.spinner-grow`   | Kattalashib-kichrayib “nafas oladigan” doira    |

## Rang

Spinner `currentColor` dan foydalanadi — rangi `text-*` bilan beriladi:

```html
<div class="spinner-border text-primary" role="status">…</div>
<div class="spinner-border text-success" role="status">…</div>
<div class="spinner-grow text-danger" role="status">…</div>
```

## O‘lcham

```html
<div class="spinner-border spinner-border-sm" role="status">…</div>
<div class="spinner-grow spinner-grow-sm" role="status">…</div>
<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">…</div>
```

## Tugma ichida

```html
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Saqlanmoqda…
</button>
```

Bu yerda tugmaning o‘z matni bor, shuning uchun spinner `aria-hidden="true"` bilan yashiriladi.

## Joylashtirish

Utilitalar bilan:

```html
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status"><span class="sr-only">Yuklanmoqda…</span></div>
</div>

<div class="d-flex align-items-center">
  <strong>Yuklanmoqda…</strong>
  <div class="spinner-border ml-auto" role="status" aria-hidden="true"></div>
</div>
```

```tekshir
Spinner ekran o‘quvchiga qanday tushuntiriladi?
+ `role="status"` va ichida `<span class="sr-only">Yuklanmoqda…</span>`
- `alt` atributi bilan
- spinner ekran o‘quvchiga ko‘rinmasligi kerak
> `sr-only` matni ko‘rinmaydi, lekin ekran o‘quvchi uni o‘qiydi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div class="spinner-border text-primary" role="status"><span class="sr-only">Yuklanmoqda…</span></div>
  <div class="spinner-grow text-success ml-2" role="status"><span class="sr-only">Yuklanmoqda…</span></div>
</div>
```

## Xulosa

- `.spinner-border` yoki `.spinner-grow` + `role="status"` + `.sr-only` matn.
- Rang — `.text-*`, kichik o‘lcham — `.spinner-border-sm` / `.spinner-grow-sm`.
- Tugma ichida spinner `aria-hidden="true"`, tugma `disabled`.
