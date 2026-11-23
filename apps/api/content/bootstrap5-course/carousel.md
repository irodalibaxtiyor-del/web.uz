## Karusel

```html
<div id="slayder" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#slayder" data-bs-slide-to="0" class="active" aria-current="true" aria-label="1-slayd"></button>
    <button type="button" data-bs-target="#slayder" data-bs-slide-to="1" aria-label="2-slayd"></button>
    <button type="button" data-bs-target="#slayder" data-bs-slide-to="2" aria-label="3-slayd"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="toshkent.jpg" class="d-block w-100" alt="Toshkent">
      <div class="carousel-caption d-none d-md-block">
        <h5>Toshkent</h5>
        <p>Poytaxt</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="samarqand.jpg" class="d-block w-100" alt="Samarqand">
    </div>
    <div class="carousel-item">
      <img src="buxoro.jpg" class="d-block w-100" alt="Buxoro">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#slayder" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Oldingi</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#slayder" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Keyingi</span>
  </button>
</div>
```

## Bootstrap 4 dan farqlar

| Bootstrap 4                                | Bootstrap 5                                       |
| ------------------------------------------ | ------------------------------------------------- |
| `data-ride="carousel"`                     | `data-bs-ride="carousel"`                         |
| `<a class="carousel-control-prev" href="#id" data-slide="prev">` | `<button class="carousel-control-prev" data-bs-target="#id" data-bs-slide="prev">` |
| indikatorlar `<ol><li>`                    | indikatorlar `<div><button aria-label>`           |
| `.sr-only`                                 | `.visually-hidden`                                |

Boshqaruv elementlari endi **tugma** — chunki ular sahifaga o‘tmaydi, amal bajaradi.

## `data-bs-ride` qiymatlari

| Qiymat       | Ma’nosi                                                    |
| ------------ | ---------------------------------------------------------- |
| `"carousel"` | Sahifa ochilishi bilan avtomatik aylanadi                  |
| `"true"`     | Foydalanuvchi birinchi marta slaydni almashtirgandan keyin aylanadi |
| (yo‘q)       | Faqat qo‘lda                                                |

Vaqt: `data-bs-interval="3000"` (karuselda yoki alohida slaydda).

## Variantlar

- `.carousel-fade` — xiralashib almashadi;
- `data-bs-theme="dark"` — qorong‘i strelka va indikatorlar (och rasmlar uchun);
- `data-bs-touch="false"` — telefonda surishni o‘chirish.

## Foydalanish imkoniyati

Avtomatik aylanadigan karusel o‘qishni qiyinlashtiradi. Bootstrap sichqoncha ustida aylanishni to‘xtatadi (`pause: 'hover'`). Muhim ma’lumotni faqat karuselga qo‘ymang, indikator tugmalariga `aria-label` bering.

## JavaScript orqali

```js
const el = document.getElementById('slayder');
const carousel = bootstrap.Carousel.getOrCreateInstance(el, { interval: 4000 });
carousel.next();
el.addEventListener('slid.bs.carousel', (e) => console.log('Slayd:', e.to));
```

```tekshir
Bootstrap 5 da karusel avtomatik aylanishi uchun qaysi atribut?
+ `data-bs-ride="carousel"`
- `data-ride="carousel"`
- `data-auto="true"`
> `data-bs-ride="true"` esa birinchi bosilgandan keyin aylantiradi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <div id="kr" class="carousel slide carousel-fade">
    <div class="carousel-inner">
      <div class="carousel-item active"><div class="d-flex align-items-center justify-content-center text-bg-primary" style="height: 120px">1-slayd</div></div>
      <div class="carousel-item"><div class="d-flex align-items-center justify-content-center text-bg-warning" style="height: 120px">2-slayd</div></div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#kr" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Oldingi</span></button>
    <button class="carousel-control-next" type="button" data-bs-target="#kr" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Keyingi</span></button>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

## Xulosa

- `.carousel.slide[data-bs-ride="carousel"]` > `.carousel-inner` > `.carousel-item` (bittasi `.active`).
- Boshqaruv — `button.carousel-control-prev/next[data-bs-target][data-bs-slide]`.
- Indikatorlar — `.carousel-indicators > button[data-bs-slide-to][aria-label]`.
