## Card

**Card** — Bootstrap 4 ning eng ko‘p ishlatiladigan komponenti. U Bootstrap 3 dagi panel, well va thumbnail’ni almashtiradi: chegarali, yumaloq burchakli moslashuvchan quti.

```html
<div class="card" style="width: 18rem;">
  <img src="html.png" class="card-img-top" alt="HTML kursi">
  <div class="card-body">
    <h5 class="card-title">HTML asoslari</h5>
    <p class="card-text">Sahifa tuzilishi, matn, rasm va formalar.</p>
    <a href="#" class="btn btn-primary">Kursga o‘tish</a>
  </div>
</div>
```

## Qismlar

| Klass           | Vazifasi                                 |
| --------------- | ---------------------------------------- |
| `.card`         | Tashqi quti (flex ustun)                 |
| `.card-header`  | Yuqori qism, och kulrang fon             |
| `.card-body`    | Asosiy qism, `1.25rem` padding           |
| `.card-footer`  | Pastki qism                              |
| `.card-title`   | Sarlavha                                 |
| `.card-subtitle`| Kichik sarlavha (`.text-muted` bilan)    |
| `.card-text`    | Matn                                     |
| `.card-link`    | Card ichidagi havola (yonma-yon joylashadi) |
| `.card-img-top` / `.card-img-bottom` | Yuqori/pastki rasm        |

```html
<div class="card">
  <div class="card-header">Tanlangan</div>
  <div class="card-body">
    <h5 class="card-title">Bootstrap 4</h5>
    <h6 class="card-subtitle mb-2 text-muted">45 dars</h6>
    <p class="card-text">Flexbox, kartalar va utilitalar.</p>
    <a href="#" class="card-link">Dastur</a>
    <a href="#" class="card-link">Sharhlar</a>
  </div>
  <div class="card-footer text-muted">Yangilangan: oktabr</div>
</div>
```

## Rangli card

```html
<div class="card text-white bg-primary mb-3">…</div>
<div class="card border-success mb-3">
  <div class="card-body text-success">…</div>
</div>
```

## Rasm ustida matn

```html
<div class="card bg-dark text-white">
  <img src="banner.jpg" class="card-img" alt="Samarqand">
  <div class="card-img-overlay">
    <h5 class="card-title">Samarqand</h5>
  </div>
</div>
```

## Bir nechta card

**Setka bilan** — eng moslashuvchan usul:

```html
<div class="row">
  <div class="col-sm-6 col-lg-4 mb-3">
    <div class="card h-100">…</div>
  </div>
  …
</div>
```

`h-100` — card ustun balandligini to‘liq egallaydi, qatordagi hamma card bir xil balandlikda bo‘ladi.

**Card guruhlari:** `.card-group` (yopishgan), `.card-deck` (oraliq bilan, teng balandlik), `.card-columns` (Pinterest uslubidagi ustunlar).

## Bootstrap 3 → 4

| Bootstrap 3         | Bootstrap 4      |
| ------------------- | ---------------- |
| `.panel`            | `.card`          |
| `.panel-heading`    | `.card-header`   |
| `.panel-body`       | `.card-body`     |
| `.panel-footer`     | `.card-footer`   |
| `.well`             | `.card.card-body` |
| `.thumbnail`        | `.card` + `.card-img-top` |

## Xulosa

- `.card` > `.card-header`, `.card-body` (`.card-title`, `.card-text`), `.card-footer`; rasm — `.card-img-top`.
- Rang: `bg-*` + `text-white`, yoki `border-*`.
- Bir nechta card: setka + `h-100`, yoki `.card-deck` / `.card-group`.
