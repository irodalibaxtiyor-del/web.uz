## Scrollspy

Scrollspy aylantirilganda menyudagi mos havolani faol (`.active`) qiladi. Bootstrap 5.2 dan u **IntersectionObserver** bilan ishlaydi — qaysi bo‘lim ekranda ko‘rinib turganini brauzer o‘zi aniqlaydi.

```html
<nav id="mundarija" class="navbar bg-body-tertiary px-3 mb-3">
  <ul class="nav nav-pills">
    <li class="nav-item"><a class="nav-link" href="#kirish">Kirish</a></li>
    <li class="nav-item"><a class="nav-link" href="#dastur">Dastur</a></li>
    <li class="nav-item"><a class="nav-link" href="#narx">Narx</a></li>
  </ul>
</nav>

<div data-bs-spy="scroll" data-bs-target="#mundarija" data-bs-smooth-scroll="true"
     class="overflow-y-scroll" style="height: 300px;" tabindex="0">
  <h4 id="kirish">Kirish</h4>
  <p>…</p>
  <h4 id="dastur">Dastur</h4>
  <p>…</p>
  <h4 id="narx">Narx</h4>
  <p>…</p>
</div>
```

| Atribut                  | Vazifasi                                         |
| ------------------------ | ------------------------------------------------ |
| `data-bs-spy="scroll"`   | Kuzatiladigan (aylanadigan) element              |
| `data-bs-target`         | Navigatsiya elementi                             |
| `data-bs-smooth-scroll`  | Havola bosilganda silliq aylantirish             |
| `tabindex="0"`           | Klaviatura bilan aylantirish uchun fokuslanadi   |

Bootstrap 4 dan farq: `position: relative` endi shart emas, `data-offset` o‘rniga `data-bs-root-margin` (IntersectionObserver chegarasi).

## Butun sahifa bilan

```html
<body data-bs-spy="scroll" data-bs-target="#mundarija">
```

## Ichma-ich va list group

`nav` ichidagi `nav` (mundarija daraxti) va `.list-group` bilan ham ishlaydi:

```html
<div id="yon" class="list-group">
  <a class="list-group-item list-group-item-action" href="#b1">1-bo‘lim</a>
  <a class="list-group-item list-group-item-action" href="#b2">2-bo‘lim</a>
</div>
```

## Hodisa va yangilash

```js
const el = document.querySelector('[data-bs-spy="scroll"]');
el.addEventListener('activate.bs.scrollspy', (e) => {
  console.log('Faol:', e.relatedTarget.getAttribute('href'));
});

// kontent o‘zgargandan keyin
bootstrap.ScrollSpy.getInstance(el).refresh();
```

## Esda tuting

- Har bir havolaning `href` i mavjud `id` ga ishora qilishi shart, aks holda plagin uni e’tiborsiz qoldiradi.
- Bo‘limlar ko‘rinadigan bo‘lishi kerak (`display: none` bo‘lmasin).

```tekshir
Bootstrap 5 da scrollspy qanday ulanadi?
+ aylantiriladigan elementga `data-bs-spy="scroll"` va `data-bs-target="#menu"`
- `data-spy="scroll"`
- menyuga `data-scroll="spy"`
> Aylantiriladigan element `tabindex="0"` bilan klaviaturadan ham aylantiriladi.
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
<div class="container py-3">
  <nav id="sn" class="nav nav-pills mb-2"><a class="nav-link" href="#b1">1-bo‘lim</a><a class="nav-link" href="#b2">2-bo‘lim</a></nav>
  <div data-bs-spy="scroll" data-bs-target="#sn" data-bs-smooth-scroll="true" tabindex="0" style="height: 140px; overflow: auto; position: relative" class="border p-2">
    <h5 id="b1">1-bo‘lim</h5><p style="height: 150px">Ichini aylantiring…</p>
    <h5 id="b2">2-bo‘lim</h5><p style="height: 150px">Menyuda shu band belgilanadi.</p>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

## Xulosa

- `data-bs-spy="scroll"` + `data-bs-target` + (blok bo‘lsa) balandlik va `overflow-y-scroll`.
- Faol havolaga `.active` qo‘shiladi; `data-bs-smooth-scroll`, `tabindex="0"`.
- IntersectionObserver asosida — `position: relative` shart emas.
