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

## Xulosa

- `ul.pagination` > `li.page-item` (`.active`, `.disabled`) > `a.page-link`.
- O‘chirilgan bandda `href` bermang; joriy sahifaga `aria-current="page"`.
- Breadcrumb fonsiz; ajratuvchi — `--bs-breadcrumb-divider`.
