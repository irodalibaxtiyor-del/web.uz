## Setka bo‘yicha amaliy namunalar

Bu darsda o‘rganilganlarni birlashtiramiz: ko‘p sinfli ustunlar, offset, ichma-ich setka va ko‘rinish klasslari.

## 1. Kurslar katalogi

```html
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-3">
    <div class="thumbnail">
      <img src="html.png" alt="HTML kursi">
      <div class="caption">
        <h3>HTML</h3>
        <p><a href="#" class="btn btn-primary" role="button">Batafsil</a></p>
      </div>
    </div>
  </div>
  <!-- yana 3 ta xuddi shunday ustun -->
</div>
```

Telefonda 1, planshetda 2, noutbukda 4 ta kartochka.

## 2. Blog sahifasi

```html
<div class="row">
  <div class="col-md-8">
    <article>Maqola</article>
  </div>
  <div class="col-md-4">
    <aside class="well">Mashhur maqolalar</aside>
  </div>
</div>
```

## 3. Markazdagi forma

```html
<div class="row">
  <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
    <form>…</form>
  </div>
</div>
```

## Ko‘rinish klasslari (responsive utilities)

| Klass              | Qayerda **yashiriladi** |
| ------------------ | ----------------------- |
| `.hidden-xs`       | < 768px                 |
| `.hidden-sm`       | 768–991px               |
| `.hidden-md`       | 992–1199px              |
| `.hidden-lg`       | ≥ 1200px                |

`.visible-*-block`, `.visible-*-inline`, `.visible-*-inline-block` — aksincha, faqat shu sinfda **ko‘rsatadi**:

```html
<p class="visible-xs-block">Telefon versiyasi</p>
<p class="hidden-xs">Planshet va kompyuter versiyasi</p>
```

Chop etish uchun: `.visible-print-block`, `.hidden-print`.

> Kontentni yashirish uni yo‘q qilmaydi: HTML yuklanadi, faqat `display: none`. Bir xil ma’lumotni ikki marta (telefon va kompyuter uchun) yozishdan ko‘ra, bitta blokni setka bilan moslashtirgan ma’qul.

## Ustunlarni qayta boshlash (clearfix)

Turli balandlikdagi bloklar `float` tufayli noto‘g‘ri tizilishi mumkin. Qatorni ma’lum sinfda qayta boshlash:

```html
<div class="row">
  <div class="col-xs-6 col-sm-4">…</div>
  <div class="col-xs-6 col-sm-4">…</div>
  <div class="clearfix visible-xs-block"></div>
  <div class="col-xs-6 col-sm-4">…</div>
</div>
```

## Tez-tez uchraydigan xatolar

1. `.row` ni `.container` ga solmaslik — gorizontal aylanish paydo bo‘ladi (−15px margin).
2. Kontentni to‘g‘ridan-to‘g‘ri `.row` ga yozish — padding yo‘qoladi.
3. Ustun ichiga `.row` siz yangi ustunlar qo‘yish.
4. Qatorda 12 dan ko‘p ustun — keyingi qatorga tushadi.

## Xulosa

- Kartochkalar: `col-xs-12 col-sm-6 col-md-3`.
- Markazlash: offset bilan (2 + 8 + 2, 3 + 6 + 3).
- `.hidden-*`, `.visible-*-block` — ekranga qarab ko‘rinish.
- Turli balandlikdagi bloklar uchun `.clearfix.visible-*-block`.
