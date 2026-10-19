## Rasm shakllari

Bootstrap 4 da rasm shakli **border radius utilitalari** bilan beriladi:

| Klass             | Natija                          |
| ----------------- | ------------------------------- |
| `.rounded`        | Yengil yumaloq burchaklar       |
| `.rounded-circle` | Doira (kvadrat rasmda)          |
| `.rounded-pill`   | Kapsula shakli                  |
| `.rounded-0`      | Burchaklarsiz                   |
| `.img-thumbnail`  | Oq ramka, chegara va 4px padding |

```html
<img src="manzara.jpg" class="rounded" alt="Chorvoq">
<img src="avatar.jpg" class="rounded-circle" alt="Aziza Karimova" width="120" height="120">
<img src="surat.jpg" class="img-thumbnail" alt="Registon">
```

Bootstrap 3 dagi `.img-rounded` → `.rounded`, `.img-circle` → `.rounded-circle`.

## Moslashuvchan rasm

```html
<img src="banner.jpg" class="img-fluid" alt="Kurs banneri">
```

`.img-fluid` = `max-width: 100%; height: auto;` — rasm konteynerdan chiqmaydi va proporsiyasi saqlanadi (Bootstrap 3 dagi `.img-responsive`).

## Joylashuv

**Chap yoki o‘ngga surish (float):**

```html
<img src="a.jpg" class="float-left mr-3" alt="…">
<img src="b.jpg" class="float-right ml-3" alt="…">
```

**Markazga olish** — rasm `block` bo‘lishi kerak:

```html
<img src="logo.png" class="mx-auto d-block" alt="Logo">
```

- `d-block` — `display: block`;
- `mx-auto` — chap va o‘ng margin `auto`.

Yoki ota elementga `.text-center`:

```html
<div class="text-center">
  <img src="logo.png" class="rounded" alt="Logo">
</div>
```

## `<figure>`

Rasm va uning izohi:

```html
<figure class="figure">
  <img src="registon.jpg" class="figure-img img-fluid rounded" alt="Registon maydoni">
  <figcaption class="figure-caption text-right">Samarqand, Registon</figcaption>
</figure>
```

## Yaxshi amaliyot

- Har bir ma’noli rasmga aniq `alt`; bezak rasmlariga `alt=""`.
- `width` va `height` atributlari — sahifa yuklanayotganda kontent sakramaydi.
- Fayl hajmini ekranga moslang (telefon uchun 4000px li rasm kerak emas).

> Platforma preview’ida tashqi rasmlar bloklangan — mashqlarda `data:` URL ichidagi SVG ishlatilgan.

## Xulosa

- Shakl: `.rounded`, `.rounded-circle`, `.img-thumbnail`.
- Moslashuvchan: `.img-fluid`.
- Joylashuv: `.float-left/right`, markaz — `.mx-auto.d-block`.
- Izohli rasm: `.figure`, `.figure-img`, `.figure-caption`.
