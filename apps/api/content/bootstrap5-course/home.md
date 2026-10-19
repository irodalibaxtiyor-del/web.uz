## Bootstrap 5

**Bootstrap 5** — dunyodagi eng mashhur CSS freymvorkining eng yangi asosiy versiyasi. Unda moslashuvchan setka, yuzlab utilita klasslar, tayyor komponentlar (navbar, card, modal, offcanvas, toast…) va JavaScript plaginlari bor. Bu kurs **5.3.8** versiyasi bilan ishlaydi — yangi loyihalar uchun aynan shu versiya tavsiya etiladi.

## Bootstrap 4 dan asosiy farqlar

| Mavzu            | Bootstrap 4                    | Bootstrap 5                                        |
| ---------------- | ------------------------------ | -------------------------------------------------- |
| JavaScript       | jQuery kerak                   | **jQuery’siz**, sof JavaScript                     |
| Data atributlari | `data-toggle`, `data-target`   | **`data-bs-toggle`, `data-bs-target`**             |
| Ekran sinflari   | xs, sm, md, lg, xl             | + **`xxl`** (≥ 1400px)                              |
| Chap/o‘ng        | `ml-*`, `mr-*`, `float-left`   | **`ms-*`, `me-*`, `float-start`** (start/end — RTL tillar uchun) |
| Gutter           | faqat `no-gutters`             | **`g-*`, `gx-*`, `gy-*`** — oraliqni boshqarish     |
| Formalar         | `custom-*` klasslar            | `.form-select`, `.form-switch`, **floating labels** |
| Yangi komponentlar | —                            | **offcanvas**, accordion, `.btn-close`             |
| Olib tashlangan  | jumbotron, media, card-deck    | utilitalar bilan almashtiriladi                    |
| Mavzu (tema)     | —                              | **qorong‘i rejim** (`data-bs-theme="dark"`), CSS o‘zgaruvchilar |
| Ekran o‘quvchi   | `.sr-only`                     | `.visually-hidden`                                 |

## jQuery’siz — nima o‘zgardi?

Bootstrap 5 plaginlari oddiy JavaScript’da yozilgan. Sahifaga faqat bitta skript ulanadi (Popper uning ichida):

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

Kod bilan boshqarish ham sof JavaScript:

```js
const modal = new bootstrap.Modal(document.getElementById('oyna'));
modal.show();
```

## Mobile-first va utilitalar

Bootstrap 5 uslublari avval telefon uchun yozilgan, keyin katta ekranlar uchun kengaytiriladi. Juda ko‘p narsa o‘z CSS’ingizsiz, faqat klasslar bilan qilinadi:

```html
<div class="d-flex justify-content-between align-items-center p-3 mb-3 bg-body-tertiary rounded-3">
  <span class="fw-semibold">Bootstrap 5</span>
  <button class="btn btn-primary btn-sm">Boshlash</button>
</div>
```

## Bu kursda nima qilamiz?

1. Ulash, konteynerlar va setka asoslari.
2. Tipografiya, ranglar, jadvallar, rasmlar va banner.
3. Alert, tugmalar, badge, progress bar, spinner.
4. Pagination, list group, card, dropdown, collapse, nav va navbar.
5. JavaScript komponentlari: karusel, modal, tooltip, popover, toast, scrollspy, offcanvas.
6. Utilitalar, qorong‘i rejim, Flex va ikonkalar.
7. Formalar: select, checkbox/radio, range, input group, floating labels, tekshiruv.
8. Setka tizimi: oltita ekran sinfi va amaliy maketlar.

Har darsdan keyin amaliy mashq: IDE’da yozasiz, **Ishga tushirish** bilan ko‘rasiz va **Tekshirish** bilan serverda tekshirasiz.

> Platformada Bootstrap fayllari serverning o‘zida saqlanadi. Siz odatdagi CDN havolasini yozasiz — platforma uni o‘zidagi xuddi shu faylga almashtiradi. Boshqa tashqi havolalar xavfsizlik uchun bloklangan.

## Xulosa

- Bootstrap 5 — jQuery’siz, `data-bs-*` atributli, `xxl` sinfli.
- `ms/me`, `start/end` — chap/o‘ng o‘rniga.
- Yangi: offcanvas, floating labels, `g-*` gutter, qorong‘i rejim.
