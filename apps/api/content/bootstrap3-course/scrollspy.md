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

## Xulosa

- `body` (yoki blok): `data-spy="scroll"`, `data-target="#menyu"`, `position: relative`.
- Menyu: `.nav` > `li` > `a[href="#bo‘lim-id"]`.
- `data-offset` — mahkamlangan navbar balandligi.
