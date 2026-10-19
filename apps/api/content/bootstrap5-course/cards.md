## Card

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

Qismlar Bootstrap 4 dagidek: `.card-header`, `.card-body`, `.card-footer`, `.card-title`, `.card-subtitle`, `.card-text`, `.card-link`, `.card-img-top`, `.card-img-overlay`.

## Rangli card

```html
<div class="card text-bg-primary mb-3">…</div>     <!-- ko‘k fon, oq matn -->
<div class="card border-success mb-3">…</div>      <!-- yashil chegara -->
```

`text-bg-*` — fon va mos matnni birga beradi.

## Butun kartani bosiladigan qilish

```html
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Bootstrap 5</h5>
    <a href="#" class="stretched-link">Kursga o‘tish</a>
  </div>
</div>
```

`.stretched-link` — havolaning bosish maydoni ota (pozitsiyali) elementni to‘liq qoplaydi. `.card` allaqachon `position: relative`.

## Setkada kartalar

Bootstrap 5 da `.card-deck` **olib tashlangan**. Uning o‘rniga setka va gutter:

```html
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col">
    <div class="card h-100">
      <img src="html.png" class="card-img-top" alt="HTML">
      <div class="card-body">
        <h5 class="card-title">HTML</h5>
        <p class="card-text">Qisqa tavsif.</p>
      </div>
      <div class="card-footer"><small class="text-body-secondary">Yangilangan: oktabr</small></div>
    </div>
  </div>
  <!-- … -->
</div>
```

- `row-cols-md-3` — `md` dan uchtadan;
- `g-4` — kartalar orasida 1.5rem;
- `h-100` — bir qatordagi kartalar bir xil balandlikda.

`.card-group` hali ham bor — kartalar bir-biriga yopishgan holda.

## Gorizontal card

```html
<div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="avatar.png" class="img-fluid rounded-start" alt="Aziza">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Aziza Karimova</h5>
        <p class="card-text">Frontend dasturchi</p>
      </div>
    </div>
  </div>
</div>
```

## Placeholder (yuklanayotgan karta)

5 da yangi: ma’lumot kelguncha kulrang “skelet”:

```html
<div class="card" aria-hidden="true">
  <div class="card-body">
    <h5 class="card-title placeholder-glow"><span class="placeholder col-6"></span></h5>
    <p class="card-text placeholder-glow">
      <span class="placeholder col-7"></span>
      <span class="placeholder col-4"></span>
    </p>
  </div>
</div>
```

## Xulosa

- `.card` > header/body/footer; rasm — `.card-img-top`; rang — `text-bg-*`.
- `.card-deck` yo‘q — `row row-cols-* g-*` + `.card.h-100`.
- `.stretched-link`, gorizontal karta (`row g-0`), `.placeholder`.
