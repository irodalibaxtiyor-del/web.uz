## Setka tizimi qanday ishlaydi?

Birinchi modulda setka asoslarini ko‘rdik. Endi uning ichki ishlashini va qo‘shimcha imkoniyatlarini o‘rganamiz.

Bootstrap 3 setkasi **float** asosida ishlaydi:

- har bir `.col-*-*` — `float: left`, `position: relative`, chap va o‘ngda 15px padding;
- kengligi foizda: `col-*-1` = 8.333%, `col-*-6` = 50%, `col-*-12` = 100%;
- `.row` — chap va o‘ngda −15px margin (konteyner padding’ini qoplaydi) va `clearfix` (float’lardan keyin qator balandligi to‘g‘ri bo‘lishi uchun).

## To‘rt ekran sinfi

| Sinf | Klass prefiksi | Ekran          | `.container` kengligi | Ustun kengligi (≈) |
| ---- | -------------- | -------------- | --------------------- | ------------------ |
| xs   | `.col-xs-`     | < 768px        | avtomatik (100%)      | avtomatik          |
| sm   | `.col-sm-`     | ≥ 768px        | 750px                 | ~62px              |
| md   | `.col-md-`     | ≥ 992px        | 970px                 | ~81px              |
| lg   | `.col-lg-`     | ≥ 1200px       | 1170px                | ~97px              |

**Mobile-first qoida:** klass o‘z ekranida **va undan kattalarida** ishlaydi. `col-sm-6` planshet, noutbuk va katta monitorda yarim kenglik beradi. Kattaroq sinf yozilsa, u ustun turadi:

```html
<div class="col-sm-6 col-lg-3">...</div>
<!-- 768–1199px: 50%, 1200px va undan katta: 25%, telefonda: 100% -->
```

## Offset — ustunni surish

`.col-md-offset-N` ustunni N ustun o‘ngga suradi (chapdan margin beradi):

```html
<div class="row">
  <div class="col-md-4">.col-md-4</div>
  <div class="col-md-4 col-md-offset-4">.col-md-4 .col-md-offset-4</div>
</div>
<div class="row">
  <div class="col-md-6 col-md-offset-3">Markazdagi ustun</div>
</div>
```

`col-md-6 col-md-offset-3` — ustunni markazga olishning klassik usuli (3 + 6 + 3 = 12).

## Ichma-ich setka (nesting)

Ustun ichida yangi `.row` ochish mumkin. Ichki qator ham 12 ustunga bo‘linadi — ota ustun kengligidan:

```html
<div class="row">
  <div class="col-sm-9">
    Asosiy qism
    <div class="row">
      <div class="col-xs-8 col-sm-6">Ichki 1</div>
      <div class="col-xs-4 col-sm-6">Ichki 2</div>
    </div>
  </div>
  <div class="col-sm-3">Yon panel</div>
</div>
```

## Push va pull — tartibni almashtirish

HTML’da birinchi turgan ustunni ekranda o‘ngga, ikkinchisini chapga o‘tkazish:

```html
<div class="row">
  <div class="col-md-9 col-md-push-3">Asosiy kontent (HTML’da birinchi)</div>
  <div class="col-md-3 col-md-pull-9">Yon panel (ekranda chapda)</div>
</div>
```

Bu muhim kontentni HTML’da (va ekran o‘quvchida) birinchi qoldirib, ko‘rinishni o‘zgartirishga imkon beradi. Lekin klaviatura tartibi HTML tartibida qolishini unutmang.

## Xulosa

- Ustunlar `float: left` + 15px padding; `.row` −15px margin va clearfix.
- Klass o‘z sinfida va kattaroq ekranlarda ishlaydi; bir nechta sinf birga yoziladi.
- `.col-*-offset-N` — surish, `.col-*-push-N` / `.col-*-pull-N` — tartibni almashtirish.
- Ustun ichida yangi `.row` — ichma-ich setka.
