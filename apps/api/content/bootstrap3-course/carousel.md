## Karusel

**Carousel** — slaydlarni navbatma-navbat ko‘rsatadigan aylanuvchi blok (slideshow). U Bootstrap’ning JavaScript plagini bilan ishlaydi.

```html
<div id="slayder" class="carousel slide" data-ride="carousel">
  <!-- Indikatorlar (pastdagi nuqtalar) -->
  <ol class="carousel-indicators">
    <li data-target="#slayder" data-slide-to="0" class="active"></li>
    <li data-target="#slayder" data-slide-to="1"></li>
    <li data-target="#slayder" data-slide-to="2"></li>
  </ol>

  <!-- Slaydlar -->
  <div class="carousel-inner" role="listbox">
    <div class="item active">
      <img src="toshkent.jpg" alt="Toshkent">
      <div class="carousel-caption">
        <h3>Toshkent</h3>
        <p>Poytaxt</p>
      </div>
    </div>
    <div class="item">
      <img src="samarqand.jpg" alt="Samarqand">
    </div>
    <div class="item">
      <img src="buxoro.jpg" alt="Buxoro">
    </div>
  </div>

  <!-- Chap va o‘ng tugmalar -->
  <a class="left carousel-control" href="#slayder" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Oldingi</span>
  </a>
  <a class="right carousel-control" href="#slayder" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Keyingi</span>
  </a>
</div>
```

## Tuzilma

| Qism                    | Vazifasi                                              |
| ----------------------- | ----------------------------------------------------- |
| `.carousel.slide`       | Karuselning o‘zi; `.slide` — siljib almashish animatsiyasi |
| `data-ride="carousel"`  | Sahifa yuklanganda avtomatik aylanishni boshlaydi      |
| `.carousel-indicators`  | Nuqtalar; `data-slide-to` — slayd raqami (0 dan)        |
| `.carousel-inner`       | Slaydlar o‘rami                                       |
| `.item`                 | Bitta slayd; **aynan bittasi** `.active` bo‘lishi shart |
| `.carousel-caption`     | Slayd ustidagi matn                                    |
| `.carousel-control`     | Chap (`.left`, `data-slide="prev"`) va o‘ng (`.right`, `data-slide="next"`) tugmalar |

Karusel `id` si (`#slayder`) indikatorlardagi `data-target` va tugmalardagi `href` bilan bir xil bo‘lishi kerak.

> Hech bir `.item` ga `.active` berilmasa, karusel ko‘rinmaydi — bu eng ko‘p uchraydigan xato.

## Sozlamalar

`data-` atributlari bilan:

| Atribut           | Ma’nosi                                        |
| ----------------- | ---------------------------------------------- |
| `data-interval`   | Slaydlar orasidagi vaqt, ms (standart 5000; `false` — avtomatik aylanmaydi) |
| `data-pause`      | `"hover"` — sichqoncha ustida turganda to‘xtaydi |
| `data-wrap`       | `false` — oxirgi slayddan keyin birinchisiga qaytmaydi |

## Foydalanish imkoniyati

Avtomatik aylanadigan kontent ba’zi foydalanuvchilarni chalg‘itadi va o‘qishga ulgurmay qolishadi. Muhim ma’lumotni faqat karuselga qo‘ymang; `data-interval="false"` bilan aylanishni o‘chirishni ham o‘ylab ko‘ring. Har bir rasmga ma’noli `alt` yozing.

## JavaScript orqali

```js
$('#slayder').carousel('next');   // keyingi slayd
$('#slayder').carousel(2);        // 3-slayd
$('#slayder').carousel('pause');  // to‘xtatish
```

```tekshir
Karuselning birinchi ko‘rinadigan slaydiga qaysi klass beriladi?
+ `item active`
- `slide first`
- `item show`
> Bootstrap 3 da slaydlar `item`, Bootstrap 4–5 da `carousel-item`.
```

```jonli
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<div class="container" style="padding-top: 15px">
  <div id="k" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <div class="item active"><div style="height: 120px; background: #0071dc; color: #fff; padding: 40px">1-slayd</div></div>
      <div class="item"><div style="height: 120px; background: #f5a623; padding: 40px">2-slayd</div></div>
    </div>
    <a class="left carousel-control" href="#k" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Oldingi</span></a>
    <a class="right carousel-control" href="#k" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Keyingi</span></a>
  </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
```

## Xulosa

- `.carousel.slide` > `.carousel-indicators`, `.carousel-inner` > `.item` (bittasi `.active`), `.carousel-control`.
- `id` indikator va tugmalarda takrorlanadi.
- `data-interval`, `data-pause`, `data-wrap` — sozlamalar.
