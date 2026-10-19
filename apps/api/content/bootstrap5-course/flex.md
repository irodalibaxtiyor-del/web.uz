## Flex utilitalari

```html
<div class="d-flex p-2 gap-2 bg-body-tertiary">
  <div class="p-2 border">1</div>
  <div class="p-2 border">2</div>
  <div class="p-2 border">3</div>
</div>
```

Bootstrap 5 da elementlar orasidagi masofa uchun **`gap-*`** — har bir elementga margin yozish shart emas.

## Yo‘nalish va o‘ramlash

| Klass                       | Natija                              |
| --------------------------- | ----------------------------------- |
| `.flex-row` / `.flex-row-reverse` | Qator / teskari qator         |
| `.flex-column` / `.flex-column-reverse` | Ustun / teskari ustun   |
| `.flex-wrap` / `.flex-nowrap` | Sig‘masa keyingi qatorga / yo‘q   |
| `.flex-md-row`              | `md` dan qator                      |

## Tekislash

```html
<div class="d-flex justify-content-between align-items-center">…</div>
<div class="d-flex justify-content-center align-items-center" style="height: 200px;">Markazda</div>
```

- `justify-content-start | end | center | between | around | evenly`;
- `align-items-start | end | center | baseline | stretch`;
- `align-self-*` — bitta element uchun;
- `align-content-*` — bir nechta qator bo‘lganda.

`justify-content-evenly` — Bootstrap 5 da qo‘shilgan: elementlar va chetlar orasida teng masofa.

## O‘lcham

```html
<div class="d-flex">
  <input class="form-control flex-grow-1 me-2" aria-label="Qidiruv">
  <button class="btn btn-primary flex-shrink-0">Qidirish</button>
</div>
```

`.flex-fill`, `.flex-grow-0|1`, `.flex-shrink-0|1`.

## Auto margin

```html
<div class="d-flex">
  <div class="p-2">Logo</div>
  <div class="p-2">Kurslar</div>
  <div class="p-2 ms-auto">Kirish</div>
</div>
```

`ms-auto` — elementni o‘ng chetga suradi (Bootstrap 4 dagi `ml-auto`).

## Media object o‘rnida

Bootstrap 5 da `.media` yo‘q — xuddi shu tuzilma flex utilitalari bilan:

```html
<div class="d-flex">
  <div class="flex-shrink-0">
    <img src="avatar.png" alt="Aziza" width="64" class="rounded-circle">
  </div>
  <div class="flex-grow-1 ms-3">
    <h5 class="mt-0">Aziza Karimova</h5>
    Setka darsi juda tushunarli bo‘ldi!
  </div>
</div>
```

## Tartib

`.order-0` … `.order-5`, `.order-first`, `.order-last` (ekranga qarab: `.order-md-1`). Ko‘rinishdagi tartib HTML tartibini o‘zgartirmaydi — klaviatura va ekran o‘quvchi HTML tartibida yuradi.

## Xulosa

- `d-flex` + `gap-*`; yo‘nalish — `flex-row|column` (+ ekran sinfi).
- `justify-content-*` (yangi: `evenly`), `align-items-*`, `align-self-*`.
- `flex-grow-1`, `flex-shrink-0`, `ms-auto`; media object — `d-flex` + `flex-shrink-0` + `flex-grow-1`.
