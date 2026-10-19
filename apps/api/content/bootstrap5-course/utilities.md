## Utilitalar

Bootstrap 5 utilitalari Bootstrap 4 dagiga o‘xshaydi, lekin ko‘paygan va ba’zilarining nomi o‘zgargan.

## Bo‘shliqlar

`{m|p}{t|b|s|e|x|y}-{0…5|auto}` — Bootstrap 5 da chap/o‘ng o‘rniga **start/end**:

| Bootstrap 4 | Bootstrap 5 | Ma’nosi                          |
| ----------- | ----------- | -------------------------------- |
| `ml-3`      | `ms-3`      | margin-start (chap, LTR tillarda) |
| `mr-3`      | `me-3`      | margin-end (o‘ng)                |
| `pl-2`      | `ps-2`      | padding-start                    |
| `pr-2`      | `pe-2`      | padding-end                      |

“Start/end” — o‘ngdan chapga yoziladigan tillar (arab, ibroniy) uchun ham to‘g‘ri ishlashi uchun.

## Gap

Flex va grid konteynerlarda elementlar orasidagi masofa:

```html
<div class="d-flex gap-3">…</div>
<div class="d-grid gap-2">…</div>
<div class="d-flex column-gap-3 row-gap-1 flex-wrap">…</div>
```

## Chegara va burchak

```html
<div class="border border-2 border-primary rounded-3 p-3">…</div>
<div class="border-top border-danger-subtle">…</div>
<div class="border border-primary border-opacity-50">…</div>
```

Burchak: `.rounded-0` … `.rounded-5`, `.rounded-circle`, `.rounded-pill`, `.rounded-top` va h.k.

## Display, joylashuv, o‘lcham

```html
<div class="d-none d-md-block">Planshetdan boshlab ko‘rinadi</div>

<div class="position-relative">
  <span class="position-absolute top-0 end-0 translate-middle-y">…</span>
</div>

<div class="w-50 h-100 mw-100 vh-100">…</div>
<div class="sticky-top">…</div>  <div class="sticky-md-top">…</div>
```

Pozitsiya: `top-0|50|100`, `bottom-*`, `start-*`, `end-*`, `translate-middle` (markazlash).

## Matn va shaffoflik

`.text-start/center/end`, `.fw-*`, `.fs-*`, `.lh-*`, `.text-truncate`, `.opacity-25|50|75|100`.

## Soya va boshqalar

```html
<div class="shadow-sm p-3">…</div>  <div class="shadow p-3">…</div>  <div class="shadow-lg p-3">…</div>
<div class="overflow-auto">…</div>  <div class="overflow-y-scroll">…</div>
<div class="z-3 position-relative">…</div>
<div class="user-select-none">…</div>  <div class="pe-none">…</div>
<a href="#" class="link-underline-opacity-0 link-underline-opacity-75-hover">Hover’da tagchiziq</a>
```

- `.z-0` … `.z-3` — `z-index`;
- `.pe-none` — sichqoncha hodisalari o‘chadi (`pointer-events: none`);
- `.visually-hidden` / `.visually-hidden-focusable` — faqat ekran o‘quvchi uchun (ikkinchisi fokus olganda ko‘rinadi — “Asosiy kontentga o‘tish” havolasi uchun).

## Bootstrap 4 dan olib tashlanganlar

| Bootstrap 4            | Bootstrap 5               |
| ---------------------- | ------------------------- |
| `.float-left/right`    | `.float-start/end`        |
| `.text-left/right`     | `.text-start/end`         |
| `.font-weight-*`       | `.fw-*`                   |
| `.sr-only`             | `.visually-hidden`        |
| `.embed-responsive-*`  | `.ratio-*`                |
| `.no-gutters`          | `.g-0`                    |
| `.rounded-lg`/`-sm`    | `.rounded-3`/`-1`         |

## Xulosa

- Spacing: `ms/me/ps/pe` (start/end); `gap-*` flex va grid uchun.
- Chegara — `border-*`, `border-opacity-*`, `rounded-0…5`.
- Pozitsiya — `top/start/end/bottom-*`, `translate-middle`; `z-*`, `pe-none`, `visually-hidden-focusable`.
