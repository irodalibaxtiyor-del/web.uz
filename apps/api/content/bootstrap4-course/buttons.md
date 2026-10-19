## Tugmalar

Bootstrap 4 tugmasi `.btn` va rang klassidan iborat:

```html
<button type="button" class="btn btn-primary">Asosiy</button>
<button type="button" class="btn btn-secondary">Ikkinchi darajali</button>
<button type="button" class="btn btn-success">Muvaffaqiyat</button>
<button type="button" class="btn btn-danger">Xavf</button>
<button type="button" class="btn btn-warning">Diqqat</button>
<button type="button" class="btn btn-info">Ma’lumot</button>
<button type="button" class="btn btn-light">Och</button>
<button type="button" class="btn btn-dark">To‘q</button>
<button type="button" class="btn btn-link">Havola</button>
```

Bootstrap 3 dagi `.btn-default` endi yo‘q — uning o‘rniga `.btn-secondary` yoki `.btn-light`.

## Chegarali (outline) tugmalar

Fonsiz, faqat rangli chegara va matn — ikkinchi darajali amallar uchun yaxshi:

```html
<button type="button" class="btn btn-outline-primary">Batafsil</button>
<button type="button" class="btn btn-outline-danger">O‘chirish</button>
```

Hover’da tugma to‘liq rangga bo‘yaladi.

## O‘lchamlar va blok tugma

```html
<button class="btn btn-primary btn-lg">Katta</button>
<button class="btn btn-primary">Oddiy</button>
<button class="btn btn-primary btn-sm">Kichik</button>
<button class="btn btn-success btn-block">To‘liq kenglik</button>
```

Bootstrap 4 da `.btn-xs` yo‘q.

## Holatlar

```html
<button class="btn btn-primary active" aria-pressed="true">Faol</button>
<button class="btn btn-primary" disabled>O‘chirilgan</button>
<a href="#" class="btn btn-secondary disabled" tabindex="-1" role="button" aria-disabled="true">Havola (o‘chirilgan)</a>
```

O‘chirilgan `<a>` ga `tabindex="-1"` beriladi — klaviatura bilan ham tanlab bo‘lmaydi.

## Spinnerli tugma

Ma’lumot yuborilayotganini ko‘rsatish uchun (spinner keyinroq alohida darsda):

```html
<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Yuborilmoqda…
</button>
```

## Almashtiriladigan tugma

`data-toggle="button"` — har bosilganda `.active` qo‘shiladi/olinadi:

```html
<button type="button" class="btn btn-outline-primary" data-toggle="button" aria-pressed="false">
  Sevimlilarga
</button>
```

## Xulosa

- `.btn` + rang: `-primary`, `-secondary`, `-success`, `-danger`, `-warning`, `-info`, `-light`, `-dark`, `-link`.
- Chegarali: `.btn-outline-*`.
- O‘lcham: `.btn-lg`, `.btn-sm`; to‘liq kenglik — `.btn-block`.
- Holatlar: `.active`, `disabled`; `<a>` uchun `.disabled` + `tabindex="-1"`.
