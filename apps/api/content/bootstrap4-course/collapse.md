## Collapse

```html
<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#batafsil"
        aria-expanded="false" aria-controls="batafsil">
  Batafsil
</button>

<div class="collapse" id="batafsil">
  <div class="card card-body">
    Kurs davomida 8 ta modul va har darsda amaliy mashq bor.
  </div>
</div>
```

- `.collapse` — yashirin;
- ochilganda **`.show`** qo‘shiladi (Bootstrap 3 da `.in`);
- boshidanoq ochiq: `class="collapse show"`.

Animatsiya paytida vaqtincha `.collapsing` klassi bo‘ladi.

## Bir tugma — bir nechta element

`data-target` CSS selektor bo‘lgani uchun bir nechta elementni bir yo‘la ochish mumkin:

```html
<button class="btn btn-secondary" data-toggle="collapse" data-target=".qoshimcha">Hammasini ochish</button>
<div class="collapse qoshimcha">1-blok</div>
<div class="collapse qoshimcha">2-blok</div>
```

## Akkordeon

Bootstrap 4 da akkordeon **card** lar bilan yasaladi:

```html
<div class="accordion" id="faq">
  <div class="card">
    <div class="card-header" id="sarlavha1">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                data-target="#javob1" aria-expanded="true" aria-controls="javob1">
          Kurs qancha davom etadi?
        </button>
      </h2>
    </div>
    <div id="javob1" class="collapse show" aria-labelledby="sarlavha1" data-parent="#faq">
      <div class="card-body">Uch oy, haftasiga uch dars.</div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" id="sarlavha2">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                data-target="#javob2" aria-expanded="false" aria-controls="javob2">
          Sertifikat beriladimi?
        </button>
      </h2>
    </div>
    <div id="javob2" class="collapse" aria-labelledby="sarlavha2" data-parent="#faq">
      <div class="card-body">Ha, yakuniy loyihadan keyin.</div>
    </div>
  </div>
</div>
```

Muhim farq: `data-parent` endi **yashiriladigan blokning o‘zida** (`.collapse` da) yoziladi, tugmada emas.

`.collapsed` klassi yopiq bo‘limning tugmasida bo‘ladi — uni CSS’da strelka yo‘nalishini o‘zgartirish uchun ishlatish mumkin.

## JavaScript orqali

```js
$('#batafsil').collapse('toggle');
$('#batafsil').on('shown.bs.collapse', function () { /* ochildi */ });
```

## Xulosa

- `.collapse` (yashirin), `.collapse.show` (ochiq).
- Boshqaruvchi: `data-toggle="collapse"` + `data-target` (selektor — bir nechta element ham bo‘ladi).
- Akkordeon: `.accordion` + `.card` lar; `data-parent` `.collapse` blokida.
