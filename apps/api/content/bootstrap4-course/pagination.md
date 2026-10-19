## Sahifalash

Bootstrap 4 da sahifalash bandlariga alohida klasslar beriladi — `.page-item` va `.page-link`:

```html
<nav aria-label="Kurslar sahifalari">
  <ul class="pagination">
    <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Oldingi</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active" aria-current="page">
      <a class="page-link" href="#">2 <span class="sr-only">(joriy)</span></a>
    </li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Keyingi</a></li>
  </ul>
</nav>
```

| Klass          | Qayerga         | Vazifasi                         |
| -------------- | --------------- | -------------------------------- |
| `.pagination`  | `<ul>`          | Flex qator                       |
| `.page-item`   | `<li>`          | Band; holatlar shu yerga beriladi |
| `.page-link`   | `<a>` / `<span>` | Ko‘rinadigan tugmacha            |
| `.active`      | `.page-item`    | Joriy sahifa                     |
| `.disabled`    | `.page-item`    | Bosib bo‘lmaydi                  |

Bootstrap 3 bilan farq: endi `<li>` va `<a>` ga klass yozish **shart**.

## Belgilar bilan

```html
<li class="page-item">
  <a class="page-link" href="#" aria-label="Oldingi">
    <span aria-hidden="true">&laquo;</span>
  </a>
</li>
```

## O‘lcham va tekislash

```html
<ul class="pagination pagination-lg">…</ul>
<ul class="pagination pagination-sm">…</ul>
```

`.pagination` flex konteyner bo‘lgani uchun uni flex utilitalari bilan tekislaysiz:

```html
<ul class="pagination justify-content-center">…</ul>  <!-- markazda -->
<ul class="pagination justify-content-end">…</ul>     <!-- o‘ngda -->
```

## Breadcrumb

```html
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">Bosh sahifa</a></li>
    <li class="breadcrumb-item"><a href="#">Kurslar</a></li>
    <li class="breadcrumb-item active" aria-current="page">Bootstrap 4</li>
  </ol>
</nav>
```

Bootstrap 4 da har bir bandga `.breadcrumb-item` kerak; ajratuvchi `/` ni Bootstrap qo‘shadi.

## Pager yo‘q

Bootstrap 3 dagi `.pager` olib tashlangan. “Oldingi / Keyingi” uchun ikkita bandli `.pagination` yoki `d-flex justify-content-between` ichidagi ikki tugma ishlatiladi.

## Xulosa

- `ul.pagination` > `li.page-item` > `a.page-link`; holatlar `.page-item` ga.
- O‘lcham: `.pagination-lg|sm`; tekislash: `justify-content-center|end`.
- Breadcrumb: `ol.breadcrumb` > `li.breadcrumb-item`, oxirgisi `.active` + `aria-current="page"`.
