## Bootstrap 5 tipografiyasi

Asosiy shrift — foydalanuvchi tizimining shrifti (`system-ui`, Segoe UI, Roboto…), o‘lcham **16px** (`1rem`), qatorlar orasi `1.5`.

Sarlavhalar **moslashuvchan** (RFS — responsive font sizes): kichik ekranda biroz kichikroq, 1200px dan to‘liq o‘lchamda.

| Teg  | ≥ 1200px      |
| ---- | ------------- |
| `h1` | 2.5rem (40px) |
| `h2` | 2rem (32px)   |
| `h3` | 1.75rem (28px) |
| `h4` | 1.5rem (24px) |
| `h5` | 1.25rem (20px) |
| `h6` | 1rem (16px)   |

Sarlavha ko‘rinishini boshqa tegga berish: `<p class="h2">`.

## Display sarlavhalar

Bootstrap 5 da oltita: `.display-1` (5rem) … `.display-6` (2.5rem):

```html
<h1 class="display-5 fw-bold">Veb-dizayn maktabi</h1>
```

## Matn klasslari

| Klass                                        | Natija                    |
| -------------------------------------------- | ------------------------- |
| `.lead`                                      | Kirish paragrafi          |
| `.text-start`, `.text-center`, `.text-end`   | Tekislash (`left/right` emas!) |
| `.fw-bold`, `.fw-semibold`, `.fw-normal`, `.fw-light` | Qalinlik         |
| `.fst-italic`, `.fst-normal`                 | Kursiv                    |
| `.fs-1` … `.fs-6`                            | Shrift o‘lchami (h1…h6 o‘lchamida) |
| `.text-uppercase`, `.text-lowercase`, `.text-capitalize` | Registr       |
| `.text-decoration-none`, `.text-decoration-underline` | Chiziq           |
| `.text-truncate`, `.text-nowrap`, `.text-break` | Uzun matn              |
| `.lh-1`, `.lh-sm`, `.lh-base`, `.lh-lg`      | Qatorlar orasi            |

Bootstrap 4 dan farq: `font-weight-bold` → `fw-bold`, `font-italic` → `fst-italic`, `text-left` → `text-start`.

## Ikkilamchi matn va iqtibos

```html
<h2>Kurslar <small class="text-body-secondary">kuzgi mavsum</small></h2>

<figure>
  <blockquote class="blockquote">
    <p>Ilm olish — beshikdan qabrgacha.</p>
  </blockquote>
  <figcaption class="blockquote-footer">Xalq maqoli</figcaption>
</figure>
```

Bootstrap 5.3 da `.text-muted` o‘rniga `.text-body-secondary` tavsiya etiladi (qorong‘i rejimda ham to‘g‘ri rang beradi). Iqtibos imzosi `<figure>` ichida `figcaption.blockquote-footer`.

## Boshqa elementlar

```html
<p>Bu so‘z <mark>belgilangan</mark>, bu esa <small>kichik</small>.</p>
<p><abbr title="Cascading Style Sheets" class="initialism">CSS</abbr></p>
<p><kbd>Ctrl</kbd> + <kbd>S</kbd> — saqlash</p>
```

## Ro‘yxatlar

```html
<ul class="list-unstyled">…</ul>
<ul class="list-inline">
  <li class="list-inline-item">HTML</li>
  <li class="list-inline-item">CSS</li>
</ul>
```

## Xulosa

- 16px asosiy, sarlavhalar moslashuvchan; `.display-1` … `.display-6`.
- Yangi nomlar: `fw-*`, `fst-*`, `fs-*`, `text-start/end`, `text-body-secondary`.
- Iqtibos: `figure` > `blockquote.blockquote` + `figcaption.blockquote-footer`.
