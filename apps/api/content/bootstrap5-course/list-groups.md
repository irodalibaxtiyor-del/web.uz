## List group

```html
<ul class="list-group">
  <li class="list-group-item active" aria-current="true">HTML asoslari</li>
  <li class="list-group-item">CSS bilan bezash</li>
  <li class="list-group-item disabled" aria-disabled="true">PHP (tez kunda)</li>
</ul>
```

## Bosiladigan bandlar

```html
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active" aria-current="true">Profil</a>
  <a href="#" class="list-group-item list-group-item-action">Kurslarim</a>
  <button type="button" class="list-group-item list-group-item-action">Chiqish</button>
</div>
```

## Variantlar

| Klass                         | Natija                                |
| ----------------------------- | ------------------------------------- |
| `.list-group-flush`           | Tashqi chegara va burchaklarsiz       |
| `.list-group-numbered`        | Raqamlangan (`<ol>` bilan) — 5 da yangi |
| `.list-group-horizontal`      | Gorizontal (`-md`, `-lg`… ekranga qarab) |
| `.list-group-item-{rang}`     | Rangli band                           |

```html
<ol class="list-group list-group-numbered">
  <li class="list-group-item">Setka</li>
  <li class="list-group-item">Komponentlar</li>
  <li class="list-group-item">Utilitalar</li>
</ol>
```

## Badge va murakkab kontent

```html
<li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
    <div class="fw-bold">Topshiriqlar</div>
    Bu hafta muddati tugaydi
  </div>
  <span class="badge text-bg-primary rounded-pill">3</span>
</li>
```

## Checkbox’li ro‘yxat

```html
<ul class="list-group">
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" id="v1">
    <label class="form-check-label stretched-link" for="v1">Darsni ko‘rish</label>
  </li>
  <li class="list-group-item">
    <input class="form-check-input me-1" type="checkbox" value="" id="v2">
    <label class="form-check-label stretched-link" for="v2">Mashqni bajarish</label>
  </li>
</ul>
```

`.stretched-link` — yorliqning bosiladigan maydoni butun bandni egallaydi.

## Dinamik ro‘yxat (tab)

List group yorliqlar kabi ham ishlay oladi:

```html
<div class="list-group" role="tablist">
  <a class="list-group-item list-group-item-action active" data-bs-toggle="list" href="#profil" role="tab">Profil</a>
  <a class="list-group-item list-group-item-action" data-bs-toggle="list" href="#sozlama" role="tab">Sozlamalar</a>
</div>
<div class="tab-content">
  <div class="tab-pane fade show active" id="profil" role="tabpanel">…</div>
  <div class="tab-pane fade" id="sozlama" role="tabpanel">…</div>
</div>
```

## Xulosa

- `.list-group` > `.list-group-item` (`.active`, `.disabled`), bosiladigan — `-action`.
- `-flush`, `-numbered`, `-horizontal`, `-item-{rang}`.
- Badge — `d-flex justify-content-between`; dinamik — `data-bs-toggle="list"`.
