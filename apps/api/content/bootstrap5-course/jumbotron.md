## Jumbotron Bootstrap 5 da yo‘q

Bootstrap 5 da `.jumbotron` komponenti **olib tashlangan**. Sababi oddiy: uni utilitalar bilan bir qatorda yig‘ish mumkin va bunda ko‘rinishni erkinroq boshqarasiz.

```html
<div class="p-5 mb-4 bg-body-tertiary rounded-3">
  <div class="container-fluid py-5">
    <h1 class="display-5 fw-bold">Veb-dizayn maktabi</h1>
    <p class="col-md-8 fs-4">Uch oyda Bootstrap 5 bilan birinchi saytingizni yarating.</p>
    <button class="btn btn-primary btn-lg" type="button">Kursga yozilish</button>
  </div>
</div>
```

| Utilita            | Vazifasi                                      |
| ------------------ | --------------------------------------------- |
| `p-5`              | Katta ichki bo‘shliq (3rem)                   |
| `mb-4`             | Pastda masofa                                 |
| `bg-body-tertiary` | Och kulrang fon (qorong‘i rejimda o‘zi to‘qlashadi) |
| `rounded-3`        | Yumaloq burchaklar                            |
| `display-5 fw-bold`| Katta qalin sarlavha                          |
| `col-md-8 fs-4`    | Tavsif keng ekranda torroq, kattaroq shriftda |

## To‘liq kenglikdagi banner

```html
<section class="py-5 text-center bg-primary text-white">
  <div class="container">
    <h1 class="display-4 fw-bold">Kuzgi chegirma</h1>
    <p class="lead">Barcha kurslar -20%</p>
    <a href="#" class="btn btn-light btn-lg">Kurslarni ko‘rish</a>
  </div>
</section>
```

Bu yerda yumaloq burchak yo‘q va fon butun ekran bo‘ylab.

## Ikki ustunli “hero”

```html
<div class="container py-5">
  <div class="row align-items-center g-5">
    <div class="col-lg-6">
      <h1 class="display-5 fw-bold lh-1 mb-3">Kod yozishni o‘rganing</h1>
      <p class="lead">Amaliy mashqlar, tekshiruv va o‘qituvchi yordami.</p>
      <div class="d-grid gap-2 d-md-flex">
        <button class="btn btn-primary btn-lg px-4">Boshlash</button>
        <button class="btn btn-outline-secondary btn-lg px-4">Batafsil</button>
      </div>
    </div>
    <div class="col-lg-6">
      <img src="hero.png" class="img-fluid rounded-3" alt="Talabalar dars qilmoqda">
    </div>
  </div>
</div>
```

`d-grid gap-2 d-md-flex` — telefonda tugmalar to‘liq kenglikda ustma-ust, `md` dan yonma-yon.

## Bootstrap 4 dan ko‘chirish

| Bootstrap 4                    | Bootstrap 5                                       |
| ------------------------------ | ------------------------------------------------- |
| `.jumbotron`                   | `.p-5 .mb-4 .bg-body-tertiary .rounded-3`         |
| `.jumbotron.jumbotron-fluid`   | `.py-5` + ichida `.container`, burchaklarsiz      |
| `.display-4` + `.lead`         | o‘zgarmagan (yoki `.fs-4`)                        |

## Xulosa

- `.jumbotron` yo‘q — banner utilitalardan yig‘iladi.
- Asosiy to‘plam: `p-5 mb-4 bg-body-tertiary rounded-3`.
- Hero bo‘limi: setka + `display-*`, `lead`, `d-grid gap-2 d-md-flex`.
