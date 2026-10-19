## Setka namunalari

Bootstrap 5 dagi barcha imkoniyatlarni birlashtiramiz.

## 1. Kurslar katalogi

```html
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-4">
  <div class="col">
    <div class="card h-100">
      <img src="html.png" class="card-img-top" alt="HTML kursi">
      <div class="card-body">
        <h5 class="card-title">HTML</h5>
        <p class="card-text">Sahifa tuzilishi.</p>
        <a href="#" class="btn btn-primary stretched-link">Batafsil</a>
      </div>
    </div>
  </div>
  <!-- … -->
</div>
```

## 2. Hero: matn + rasm

```html
<div class="row align-items-center g-5 py-5">
  <div class="col-lg-6 order-lg-2">
    <img src="hero.png" class="img-fluid rounded-3" alt="Talabalar">
  </div>
  <div class="col-lg-6">
    <h1 class="display-5 fw-bold">Kod yozishni o‘rganing</h1>
    <p class="lead">Amaliy mashqlar va tekshiruv bilan.</p>
    <div class="d-grid gap-2 d-md-flex">
      <button class="btn btn-primary btn-lg px-4">Boshlash</button>
    </div>
  </div>
</div>
```

Telefonda matn rasmdan **oldin** (HTML tartibi), noutbukda rasm o‘ngda.

## 3. Markazdagi kirish formasi

```html
<div class="row justify-content-center">
  <div class="col-sm-10 col-md-8 col-lg-5">
    <form class="card card-body">…</form>
  </div>
</div>
```

## 4. Dashboard statistikasi

```html
<div class="row g-3">
  <div class="col-6 col-lg-3"><div class="card card-body text-center">12<br>Kurs</div></div>
  <div class="col-6 col-lg-3"><div class="card card-body text-center">340<br>Talaba</div></div>
  <div class="col-6 col-lg-3"><div class="card card-body text-center">58<br>Topshiriq</div></div>
  <div class="col-6 col-lg-3"><div class="card card-body text-center">4.8<br>Reyting</div></div>
</div>
```

## 5. Footer

```html
<footer class="row row-cols-1 row-cols-md-3 g-4 py-5 border-top">
  <div class="col"><h5>WEBDIZAYN</h5><p class="text-body-secondary">© 2026</p></div>
  <div class="col"><h5>Kurslar</h5><ul class="nav flex-column">…</ul></div>
  <div class="col"><h5>Aloqa</h5><ul class="nav flex-column">…</ul></div>
</footer>
```

## Bootstrap 3 → 4 → 5 eslatma

| Vazifa                 | Bootstrap 3           | Bootstrap 4          | Bootstrap 5            |
| ---------------------- | --------------------- | -------------------- | ---------------------- |
| Telefonda yarim        | `col-xs-6`            | `col-6`              | `col-6`                |
| Surish                 | `col-md-offset-3`     | `offset-md-3`        | `offset-md-3`          |
| Tartib                 | `col-md-push-3`       | `order-md-2`         | `order-md-2`           |
| Oraliqsiz              | —                     | `no-gutters`         | `g-0`                  |
| O‘ngga surish          | `pull-right`          | `ml-auto`            | `ms-auto`              |
| Yashirish              | `hidden-xs`           | `d-none d-sm-block`  | `d-none d-sm-block`    |
| Eng katta sinf         | `lg` (1200)           | `xl` (1200)          | `xxl` (1400)           |

## Xulosa

- Katalog: `row-cols-*` + `g-4` + `.card.h-100`.
- Hero: `align-items-center`, `order-lg-*`; forma: `justify-content-center`.
- Uchala versiya orasidagi farqlarni bilish — eski loyihalarni yangilash uchun asosiy ko‘nikma.
