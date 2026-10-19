## Rasmlar

## Shakllar

```html
<img src="manzara.jpg" class="rounded" alt="Chorvoq">
<img src="avatar.jpg" class="rounded-circle" alt="Aziza Karimova" width="120" height="120">
<img src="surat.jpg" class="img-thumbnail" alt="Registon">
```

Bootstrap 5 da burchak o‘lchamlari ko‘paygan: `.rounded-0` … `.rounded-5`, `.rounded-circle`, `.rounded-pill`, va faqat bir tomon: `.rounded-top`, `.rounded-end`, `.rounded-bottom`, `.rounded-start`.

## Moslashuvchan

```html
<img src="banner.jpg" class="img-fluid" alt="Kurs banneri">
```

`max-width: 100%; height: auto;`.

## Joylashuv

**Float** (Bootstrap 5 da `left/right` o‘rniga `start/end`):

```html
<img src="a.jpg" class="float-start me-3 rounded" alt="…">
<img src="b.jpg" class="float-end ms-3 rounded" alt="…">
```

**Markazga olish:**

```html
<img src="logo.png" class="mx-auto d-block" alt="Logo">

<div class="text-center">
  <img src="logo.png" class="rounded" alt="Logo">
</div>
```

## Nisbatni saqlash: `.ratio`

Video yoki iframe’ni ma’lum nisbatda saqlash (Bootstrap 4 dagi `embed-responsive` o‘rniga):

```html
<div class="ratio ratio-16x9">
  <iframe src="…" title="Kirish videosi" allowfullscreen></iframe>
</div>
```

`ratio-1x1`, `ratio-4x3`, `ratio-16x9`, `ratio-21x9`.

## Rasmni kesib to‘ldirish: `object-fit`

Bootstrap 5.3 dan:

```html
<img src="banner.jpg" class="object-fit-cover w-100" style="height: 200px;" alt="…">
```

`object-fit-cover` — rasm blokni to‘ldiradi, proporsiya saqlanadi, ortiqchasi kesiladi. `-contain`, `-fill`, `-scale`, `-none` ham bor.

## `<figure>`

```html
<figure class="figure">
  <img src="registon.jpg" class="figure-img img-fluid rounded" alt="Registon maydoni">
  <figcaption class="figure-caption text-end">Samarqand, Registon</figcaption>
</figure>
```

## Yaxshi amaliyot

- Har bir ma’noli rasmga `alt`; bezak rasmiga `alt=""`.
- `width`/`height` atributlari — sahifa “sakrashining” oldini oladi.
- Katta rasmlar uchun `loading="lazy"` — ekranga yaqinlashganda yuklanadi.

> Platforma preview’ida tashqi rasmlar bloklangan — mashqlarda `data:` URL ichidagi SVG ishlatilgan.

## Xulosa

- `.rounded-*`, `.rounded-circle`, `.img-thumbnail`, `.img-fluid`.
- `float-start/end` + `me-*/ms-*`; markaz — `mx-auto d-block`.
- `.ratio-16x9`, `object-fit-cover`, `.figure`.
