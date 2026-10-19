## Filtrlar

Bootstrap’da alohida “filtr” komponenti yo‘q, lekin jQuery (u baribir ulangan) bilan jadval, ro‘yxat yoki kartalarni qidiruv maydoni orqali filtrlash bir necha qator kod.

```html
<input class="form-control" id="qidiruv" type="text" placeholder="Qidirish…" aria-label="Jadvalda qidirish">

<table class="table table-bordered">
  <thead>
    <tr><th>Ism</th><th>Shahar</th></tr>
  </thead>
  <tbody id="jadval">
    <tr><td>Aziza</td><td>Toshkent</td></tr>
    <tr><td>Bekzod</td><td>Buxoro</td></tr>
    <tr><td>Madina</td><td>Samarqand</td></tr>
  </tbody>
</table>
```

```js
$(function () {
  $('#qidiruv').on('input', function () {
    var soz = $(this).val().toLowerCase();
    $('#jadval tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(soz) > -1);
    });
  });
});
```

## Kod nima qiladi?

1. `$('#qidiruv').on('input', ...)` — maydonga har safar nimadir yozilganda (yoki o‘chirilganda, joylanganda) bajariladi.
2. `$(this).val().toLowerCase()` — yozilgan matn, kichik harflarda.
3. `$('#jadval tr')` — jadval tanasidagi barcha qatorlar (sarlavha emas — shuning uchun `tbody` ga `id` berilgan).
4. `.filter(function () { ... })` — har bir qator uchun funksiya.
5. `$(this).text()` — qatordagi butun matn; `indexOf(soz) > -1` — qidirilgan so‘z bormi.
6. `$(this).toggle(true/false)` — bor bo‘lsa ko‘rsatadi, bo‘lmasa yashiradi.

> W3Schools va eski misollarda `keyup` hodisasi uchraydi. `input` yaxshiroq: u sichqoncha bilan joylash va o‘chirishda ham ishlaydi.

## Ro‘yxatni filtrlash

```js
$('#qidiruv').on('input', function () {
  var soz = $(this).val().toLowerCase();
  $('#royxat li').filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(soz) > -1);
  });
});
```

Xuddi shu kod istalgan elementlar to‘plamida ishlaydi: kartalar (`.col-sm-4`), menyu bandlari, `div` lar.

## Tugmalar bilan filtrlash

Kategoriya tugmalari bilan:

```js
$('.filtr-tugma').on('click', function () {
  var tur = $(this).data('tur');           // data-tur="frontend"
  $('.kurs').hide();
  $('.kurs[data-tur="' + tur + '"]').show();
});
```

## Foydalanish imkoniyati

Natija soni o‘zgarganini ekran o‘quvchiga aytish uchun `aria-live` hududiga yozing:

```html
<p id="natija" aria-live="polite"></p>
```

```js
$('#natija').text($('#jadval tr:visible').length + ' ta natija');
```

## Xulosa

- Qidiruv maydonining `input` hodisasi + `.filter()` + `.toggle()`.
- Matn `toLowerCase()` bilan solishtiriladi — registrga qaramaydi.
- Natija sonini `aria-live` bilan e’lon qiling.
