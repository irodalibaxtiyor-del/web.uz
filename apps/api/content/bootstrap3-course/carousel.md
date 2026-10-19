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

## Xulosa

- `.carousel.slide` > `.carousel-indicators`, `.carousel-inner` > `.item` (bittasi `.active`), `.carousel-control`.
- `id` indikator va tugmalarda takrorlanadi.
- `data-interval`, `data-pause`, `data-wrap` — sozlamalar.
