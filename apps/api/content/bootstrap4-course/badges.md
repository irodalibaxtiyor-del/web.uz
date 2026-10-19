## Badge

Bootstrap 4 da **badge** — son va qisqa yorliqlar uchun yagona komponent (Bootstrap 3 dagi `.badge` va `.label` birlashtirildi).

```html
<h3>Bootstrap kursi <span class="badge badge-success">Yangi</span></h3>
<p>Chegirma: <span class="badge badge-danger">-20%</span></p>
```

Ranglar: `badge-primary`, `badge-secondary`, `badge-success`, `badge-danger`, `badge-warning`, `badge-info`, `badge-light`, `badge-dark`.

Badge ota elementning shrift o‘lchamiga moslashadi (`font-size: 75%`), shuning uchun sarlavha ichida ham mutanosib ko‘rinadi.

## Pill badge

Ko‘proq yumaloq shakl — `.badge-pill`:

```html
<span class="badge badge-pill badge-primary">12</span>
<span class="badge badge-pill badge-warning">Tez kunda</span>
```

## Tugma ichida badge

```html
<button type="button" class="btn btn-primary">
  Xabarlar <span class="badge badge-light">4</span>
  <span class="sr-only">o‘qilmagan</span>
</button>
```

Bootstrap 4 da ranglar avtomatik teskari bo‘lmaydi — rangli tugmada `badge-light` tanlash qulay.

## Havola ko‘rinishidagi badge

```html
<a href="#" class="badge badge-info">#bootstrap</a>
```

Havola bo‘lsa, hover va fokus holatlari avtomatik qo‘shiladi.

## Ro‘yxatda badge

```html
<ul class="list-group">
  <li class="list-group-item d-flex justify-content-between align-items-center">
    Kiruvchi xabarlar
    <span class="badge badge-primary badge-pill">14</span>
  </li>
</ul>
```

`d-flex justify-content-between` — matn chapda, badge o‘ngda (Bootstrap 3 dagi `float: right` o‘rniga flex).

## Bootstrap 3 → 4

| Bootstrap 3                       | Bootstrap 4                    |
| --------------------------------- | ------------------------------ |
| `<span class="badge">4</span>`    | `<span class="badge badge-secondary">4</span>` |
| `<span class="label label-success">` | `<span class="badge badge-success">` |
| bo‘sh badge yashirinadi           | bo‘sh badge ham yashirinadi (`:empty`) |

## Xulosa

- `.badge` + `.badge-success | -danger | …`; yumaloq — `.badge-pill`.
- Tugmada — `.badge-light`; ro‘yxatda — `d-flex justify-content-between`.
- `.label` endi yo‘q.
