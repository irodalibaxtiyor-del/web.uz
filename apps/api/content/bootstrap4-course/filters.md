## Filtrlar

Bootstrap 4 ulanganda jQuery (slim) ham bor — undan foydalanib jadval, ro‘yxat yoki kartalarni qidiruv maydoni orqali filtrlash mumkin.

```html
<input class="form-control mb-3" id="qidiruv" type="text" placeholder="Qidirish…" aria-label="Kurslar ichida qidirish">

<ul class="list-group" id="royxat">
  <li class="list-group-item">HTML asoslari</li>
  <li class="list-group-item">CSS bilan bezash</li>
  <li class="list-group-item">Bootstrap 4</li>
  <li class="list-group-item">JavaScript</li>
</ul>
```

```js
$(function () {
  $('#qidiruv').on('input', function () {
    var soz = $(this).val().toLowerCase();
    $('#royxat li').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(soz) > -1);
    });
  });
});
```

## jQuery slim yetadimi?

“Slim” versiyada AJAX va animatsiya (`fadeIn`, `slideUp`) modullari yo‘q. Lekin `.on()`, `.val()`, `.text()`, `.filter()`, `.toggle(true/false)`, `.addClass()` kabi asosiy funksiyalar bor — filtr uchun yetarli.

`.toggle()` ga **boolean** berilsa, element ko‘rsatiladi (`true`) yoki yashiriladi (`false`).

## jQuery’siz (oddiy JavaScript)

Bootstrap 5 da jQuery yo‘q, shuning uchun xuddi shu narsani sof JavaScript’da bilish foydali:

```js
document.getElementById('qidiruv').addEventListener('input', function () {
  var soz = this.value.toLowerCase();
  document.querySelectorAll('#royxat li').forEach(function (li) {
    li.style.display = li.textContent.toLowerCase().includes(soz) ? '' : 'none';
  });
});
```

## Kartalarni filtrlash

Kartalar setkada bo‘lsa, **ustunni** (`.col-*`) yashiring, kartaning o‘zini emas — aks holda bo‘sh joy qoladi:

```js
$('.kurs-ustun').filter(function () {
  $(this).toggle($(this).text().toLowerCase().indexOf(soz) > -1);
});
```

## Kategoriya bo‘yicha

```html
<div class="btn-group mb-3" role="group" aria-label="Kategoriya">
  <button class="btn btn-outline-primary" data-tur="hammasi">Hammasi</button>
  <button class="btn btn-outline-primary" data-tur="frontend">Frontend</button>
  <button class="btn btn-outline-primary" data-tur="backend">Backend</button>
</div>
```

```js
$('[data-tur]').on('click', function () {
  var tur = $(this).data('tur');
  $('.kurs').each(function () {
    $(this).toggle(tur === 'hammasi' || $(this).data('tur') === tur);
  });
});
```

## Natija sonini e’lon qilish

```html
<p id="natija" class="text-muted" aria-live="polite"></p>
```

```js
$('#natija').text($('#royxat li:visible').length + ' ta kurs topildi');
```

```tekshir
`jquery.slim` versiyasida qaysi imkoniyat yo‘q?
+ AJAX va animatsiya (effektlar) metodlari
- `$(...)` selektorlari
- hodisalar (`on`)
> Bootstrap 4 plaginlari uchun slim versiya yetarli; filtr ham ishlaydi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <input class="form-control" id="fq" placeholder="Qidirish…" aria-label="Qidirish">
  <ul class="list-group mt-2" id="fr"><li class="list-group-item">HTML asoslari</li><li class="list-group-item">CSS Grid</li><li class="list-group-item">Bootstrap 4</li></ul>
  <p class="mt-2 text-muted" id="fn" aria-live="polite"></p>
</div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
  document.getElementById('fq').addEventListener('input', (e) => {
    const soz = e.target.value.toLowerCase();
    let n = 0;
    document.querySelectorAll('#fr li').forEach((li) => {
      const mos = li.textContent.toLowerCase().includes(soz);
      li.classList.toggle('d-none', !mos);
      if (mos) n++;
    });
    document.getElementById('fn').textContent = n + ' ta natija';
  });
</script>
```

## Xulosa

- `input` hodisasi + `.filter()` + `.toggle(bool)` — jQuery slim bilan ishlaydi.
- Sof JS: `querySelectorAll` + `style.display`.
- Setkada ustunni yashiring; natija sonini `aria-live` bilan bildiring.
