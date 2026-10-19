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

## Xulosa

- `data-bs-spy="scroll"` + `data-bs-target` + (blok bo‘lsa) balandlik va `overflow-y-scroll`.
- Faol havolaga `.active` qo‘shiladi; `data-bs-smooth-scroll`, `tabindex="0"`.
- IntersectionObserver asosida — `position: relative` shart emas.
