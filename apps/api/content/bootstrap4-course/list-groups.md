## List group

```html
<ul class="list-group">
  <li class="list-group-item active" aria-current="true">HTML asoslari</li>
  <li class="list-group-item">CSS bilan bezash</li>
  <li class="list-group-item disabled" aria-disabled="true">PHP (tez kunda)</li>
</ul>
```

## Bosiladigan bandlar

Havola yoki tugmalardan iborat ro‘yxatda `.list-group-item-action` qo‘shiladi — hover, fokus va bosilgan holatlar paydo bo‘ladi:

```html
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">Profil</a>
  <a href="#" class="list-group-item list-group-item-action">Kurslarim</a>
  <button type="button" class="list-group-item list-group-item-action">Chiqish</button>
</div>
```

## Ramkasiz (flush)

Card ichida yoki chetma-chet ro‘yxat uchun tashqi chegara va burchaklarni olib tashlash:

```html
<ul class="list-group list-group-flush">…</ul>
```

## Gorizontal

Bootstrap 4.3 dan:

```html
<ul class="list-group list-group-horizontal">
  <li class="list-group-item">Kun</li>
  <li class="list-group-item">Hafta</li>
  <li class="list-group-item">Oy</li>
</ul>
```

Ma’lum ekrandan boshlab: `.list-group-horizontal-md`.

## Rangli bandlar

```html
<li class="list-group-item list-group-item-success">To‘lov qabul qilindi</li>
<li class="list-group-item list-group-item-danger">Ulanishda xato</li>
```

`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.

## Badge bilan

Bootstrap 4 da badge o‘zi o‘ngga surilmaydi — flex utilitalari bilan:

```html
<li class="list-group-item d-flex justify-content-between align-items-center">
  Topshiriqlar
  <span class="badge badge-primary badge-pill">3</span>
</li>
```

## Murakkab kontent

```html
<a href="#" class="list-group-item list-group-item-action">
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">Yangi dars: Flexbox</h5>
    <small class="text-muted">3 kun oldin</small>
  </div>
  <p class="mb-1">Elementlarni bir yo‘nalishda joylashtirish.</p>
</a>
```

## Xulosa

- `.list-group` > `.list-group-item`; `.active`, `.disabled`.
- Bosiladigan — `.list-group-item-action`; ramkasiz — `.list-group-flush`; gorizontal — `.list-group-horizontal`.
- Rang — `.list-group-item-*`; badge — `d-flex justify-content-between`.
