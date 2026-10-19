## Scrollspy

Scrollspy sahifa (yoki blok) aylanganda navigatsiyadagi mos havolani **faol** qiladi.

```html
<body data-spy="scroll" data-target="#mundarija" data-offset="70" style="position: relative;">

  <nav id="mundarija" class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
    <ul class="navbar-nav">
      <li class="nav-item"><a class="nav-link" href="#kirish">Kirish</a></li>
      <li class="nav-item"><a class="nav-link" href="#dastur">Dastur</a></li>
      <li class="nav-item"><a class="nav-link" href="#narx">Narx</a></li>
    </ul>
  </nav>

  <section id="kirish">…</section>
  <section id="dastur">…</section>
  <section id="narx">…</section>
</body>
```

Bootstrap 4 da `.active` klassi **havolaga** (`.nav-link`) qo‘shiladi, `<li>` ga emas.

## Talablar

1. Aylanadigan element (`body` yoki blok) — `data-spy="scroll"` va `position: relative`.
2. `data-target` — navigatsiyani o‘rab turgan element (`.nav` yoki `.navbar-nav` ning otasi).
3. Havolalar — `.nav-link` (yoki `.list-group-item`), `href` — bo‘lim `id` si.
4. Blok bo‘lsa — balandligi cheklangan va `overflow-y: scroll`.

## List group bilan

Yon panel mundarija sifatida `list-group` ham ishlaydi:

```html
<div class="row">
  <div class="col-4">
    <div id="yon" class="list-group">
      <a class="list-group-item list-group-item-action" href="#b1">1-bo‘lim</a>
      <a class="list-group-item list-group-item-action" href="#b2">2-bo‘lim</a>
    </div>
  </div>
  <div class="col-8">
    <div data-spy="scroll" data-target="#yon" data-offset="0" style="height: 300px; overflow-y: scroll; position: relative;">
      <h4 id="b1">1-bo‘lim</h4>
      <p>…</p>
      <h4 id="b2">2-bo‘lim</h4>
      <p>…</p>
    </div>
  </div>
</div>
```

## Ichma-ich navigatsiya

`nav` ichida `nav` bo‘lsa, ichki band faol bo‘lganda ota band ham faol bo‘ladi — uzun hujjatlar mundarijasi uchun qulay.

## Kontent o‘zgarsa

Sahifaga yangi bo‘limlar qo‘shilsa yoki o‘chirilsa:

```js
$('[data-spy="scroll"]').each(function () {
  $(this).scrollspy('refresh');
});
```

## JavaScript orqali yoqish

```js
$('body').scrollspy({ target: '#mundarija', offset: 70 });
```

## Xulosa

- `data-spy="scroll"` + `data-target` + `position: relative`.
- Havolalar `.nav-link` yoki `.list-group-item`; faol havolaga `.active`.
- Blok ichida — balandlik va `overflow-y: scroll`; o‘zgarishdan keyin `refresh`.
