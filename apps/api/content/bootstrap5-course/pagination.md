## Sahifalash

Tuzilma Bootstrap 4 dagidek: `ul.pagination` > `li.page-item` > `a.page-link`.

```html
<nav aria-label="Kurslar sahifalari">
  <ul class="pagination justify-content-center">
    <li class="page-item disabled">
      <a class="page-link">Oldingi</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Keyingi</a></li>
  </ul>
</nav>
```

- `.active` va `.disabled` — `.page-item` da;
- o‘chirilgan bandda `href` yo‘q — havola umuman bosilmaydi va klaviatura bilan tanlanmaydi;
- `aria-current="page"` — ekran o‘quvchiga joriy sahifani aytadi.

Bootstrap 5 da `.active` sahifa yoniga “(joriy)” yashirin matnini yozish shart emas — `aria-current` yetarli.

## Belgilar

```html
<li class="page-item">
  <a class="page-link" href="#" aria-label="Oldingi"><span aria-hidden="true">&laquo;</span></a>
</li>
```

## O‘lcham va tekislash

```html
<ul class="pagination pagination-lg">…</ul>
<ul class="pagination pagination-sm">…</ul>
<ul class="pagination justify-content-end">…</ul>
```

## O‘z rangingiz

5.3 da sahifalash ham CSS o‘zgaruvchilar bilan:

```css
.pagination {
  --bs-pagination-active-bg: #198754;
  --bs-pagination-active-border-color: #198754;
}
```

## Breadcrumb

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Bosh sahifa</a></li>
    <li class="breadcrumb-item"><a href="#">Kurslar</a></li>
    <li class="breadcrumb-item active" aria-current="page">Bootstrap 5</li>
  </ol>
</nav>
```

Bootstrap 5 da breadcrumb’ning **foni yo‘q** (Bootstrap 4 da kulrang edi) — kerak bo‘lsa `bg-body-tertiary p-2 rounded` qo‘shasiz.

Ajratuvchini o‘zgartirish:

```html
<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">…</nav>
```

```tekshir
Joriy sahifa bandi ekran o‘quvchiga qanday bildiriladi?
+ `aria-current="page"`
- faqat `active` klassi
- `title="joriy"`
> `active` ko‘rinish beradi, `aria-current` esa ma’noni.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <nav aria-label="Sahifalar"><ul class="pagination">
    <li class="page-item disabled"><span class="page-link">&laquo;</span></li>
    <li class="page-item active" aria-current="page"><span class="page-link">1</span></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
  </ul></nav>
  <nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Bosh</a></li><li class="breadcrumb-item active" aria-current="page">Kurslar</li></ol></nav>
</div>
```

## Xulosa

- `ul.pagination` > `li.page-item` (`.active`, `.disabled`) > `a.page-link`.
- O‘chirilgan bandda `href` bermang; joriy sahifaga `aria-current="page"`.
- Breadcrumb fonsiz; ajratuvchi — `--bs-breadcrumb-divider`.
