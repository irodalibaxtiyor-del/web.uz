## Karusel

```html
<div id="slayder" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#slayder" data-slide-to="0" class="active"></li>
    <li data-target="#slayder" data-slide-to="1"></li>
    <li data-target="#slayder" data-slide-to="2"></li>
  </ol>
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
  <a class="carousel-control-prev" href="#slayder" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Oldingi</span>
  </a>
  <a class="carousel-control-next" href="#slayder" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Keyingi</span>
  </a>
</div>
```

## Bootstrap 3 dan farqlar

| Bootstrap 3                            | Bootstrap 4                                      |
| -------------------------------------- | ------------------------------------------------ |
| `.item`                                | `.carousel-item`                                 |
| `.left.carousel-control` + Glyphicon   | `.carousel-control-prev` + `.carousel-control-prev-icon` |
| `.right.carousel-control`              | `.carousel-control-next` + `.carousel-control-next-icon` |
| rasm o‘zi moslashadi                   | rasmga `d-block w-100` beriladi                   |

Strelka ikonkalari SVG ko‘rinishida CSS ichida — Glyphicons kerak emas.

## Faqat bitta slayd `.active`

Bootstrap 4 da ham qoida o‘sha: **aynan bitta** `.carousel-item` `.active` bo‘lishi kerak, aks holda karusel ko‘rinmaydi.

## Izoh (caption)

`.carousel-caption` slayd pastida matn chiqaradi. Telefonda u rasmni yopib qo‘ymasligi uchun ko‘pincha `d-none d-md-block` bilan faqat `md` dan katta ekranda ko‘rsatiladi.

## Xira almashish

Slaydlar siljish o‘rniga xiralashib almashishi uchun `.carousel-fade`:

```html
<div id="slayder" class="carousel slide carousel-fade" data-ride="carousel">…</div>
```

## Sozlamalar

| Atribut           | Ma’nosi                                          |
| ----------------- | ------------------------------------------------ |
| `data-interval`   | Slaydlar orasidagi vaqt, ms (`false` — avtomatik emas) |
| `data-pause`      | `"hover"` — sichqoncha ustida to‘xtaydi          |
| `data-wrap`       | `false` — oxiridan boshiga qaytmaydi             |
| `data-keyboard`   | ← → tugmalariga javob beradi (standart `true`)   |
| `data-touch`      | Telefonda surish bilan almashadi (standart `true`) |

Bitta slaydga alohida vaqt: `<div class="carousel-item" data-interval="10000">`.

## JavaScript orqali

```js
$('#slayder').carousel({ interval: 3000 });
$('#slayder').carousel('next');
$('#slayder').on('slid.bs.carousel', function (e) {
  console.log('Yangi slayd:', e.to);
});
```

## Xulosa

- `.carousel.slide` > `.carousel-inner` > `.carousel-item` (bittasi `.active`), rasm `d-block w-100`.
- Boshqaruv: `.carousel-control-prev/next` + `-icon`; indikatorlar `.carousel-indicators`.
- `.carousel-fade` — xiralashib almashish.
