## Scrollspy

**Scrollspy** sahifa aylantirilganda menyudagi tegishli bandni avtomatik **faol** (`.active`) qiladi. Uzun bir sahifali saytlarda, hujjatlarda, mundarijada foydalanuvchi qaysi bo‘limda ekanini ko‘radi.

```html
<body data-spy="scroll" data-target="#mundarija" data-offset="50">

  <nav class="navbar navbar-inverse navbar-fixed-top" id="mundarija">
    <div class="container-fluid">
      <ul class="nav navbar-nav">
        <li><a href="#kirish">Kirish</a></li>
        <li><a href="#dastur">Dastur</a></li>
        <li><a href="#narx">Narx</a></li>
      </ul>
    </div>
  </nav>

  <section id="kirish">...</section>
  <section id="dastur">...</section>
  <section id="narx">...</section>

</body>
```

## Qanday ishlaydi?

1. Aylanadigan element (ko‘pincha `<body>`) ga `data-spy="scroll"` beriladi.
2. `data-target` — menyuni o‘rab turgan element (`.nav` ning otasi) selektori.
3. Menyudagi har bir havolaning `href` i bo‘lim `id` siga mos keladi: `href="#dastur"` → `<section id="dastur">`.
4. Sahifa aylanganda plagin qaysi bo‘lim ekranda ekanini hisoblaydi va havolaning `<li>` siga `.active` qo‘yadi.

## Shartlar

- Aylanadigan element `position: relative` bo‘lishi kerak (`<body>` uchun ham):

```css
body { position: relative; }
```

- `data-offset` — yuqoridan necha piksel hisobga olinadi (masalan, mahkamlangan navbar balandligi). Standart — 10.
- Menyuda **`.nav`** klassli ro‘yxat bo‘lishi kerak — scrollspy faqat `.nav` ichidagi havolalarni kuzatadi.

## Ichki element bilan

Faqat bir blok ichida aylantirish:

```html
<div data-spy="scroll" data-target="#ichkiMenyu" style="height: 300px; overflow-y: scroll; position: relative;">
  ...
</div>
```

## Vertikal menyu bilan

Yon panelda `nav-pills nav-stacked` bilan ham ishlaydi:

```html
<nav id="yonMenyu">
  <ul class="nav nav-pills nav-stacked">
    <li><a href="#b1">1-bo‘lim</a></li>
    <li><a href="#b2">2-bo‘lim</a></li>
  </ul>
</nav>
```

## Hodisa

Faol band almashganda `activate.bs.scrollspy` hodisasi chiqadi:

```js
$('#mundarija').on('activate.bs.scrollspy', function () {
  console.log('Yangi bo‘lim');
});
```

```tekshir
Scrollspy qaysi elementga ulanadi?
+ aylantiriladigan elementga (`body` yoki `overflow` li blok) `data-spy="scroll"` va `data-target`
- faqat navbar’ga
- har bir bo‘limga alohida
> Aylantirilganda menyudagi mos band avtomatik `active` bo‘ladi.
```

```jonli
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<div class="container" style="padding-top: 15px">
  <ul class="nav nav-pills" id="nm"><li><a href="#s1">1-bo‘lim</a></li><li><a href="#s2">2-bo‘lim</a></li></ul>
  <div data-spy="scroll" data-target="#nm" data-offset="10" style="height: 140px; overflow: auto; position: relative; border: 1px solid #ddd; padding: 10px">
    <h4 id="s1">1-bo‘lim</h4><p style="height: 150px">Ichini aylantiring…</p>
    <h4 id="s2">2-bo‘lim</h4><p style="height: 150px">Menyuda shu band belgilanadi.</p>
  </div>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
```

## Xulosa

- `body` (yoki blok): `data-spy="scroll"`, `data-target="#menyu"`, `position: relative`.
- Menyu: `.nav` > `li` > `a[href="#bo‘lim-id"]`.
- `data-offset` — mahkamlangan navbar balandligi.
