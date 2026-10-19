## Media object

Bootstrap 4 da media object Flexbox bilan yoziladi va juda soddalashgan — faqat ikkita klass:

```html
<div class="media">
  <img src="avatar.png" class="mr-3 rounded-circle" alt="Aziza" width="64" height="64">
  <div class="media-body">
    <h5 class="mt-0">Aziza Karimova</h5>
    Setka darsi juda tushunarli bo‘ldi, rahmat!
  </div>
</div>
```

- `.media` — flex konteyner;
- `.media-body` — qolgan kenglikni egallaydi (`flex: 1`);
- rasm va matn orasidagi masofa — spacing utilitasi (`mr-3`).

Bootstrap 3 dagi `.media-left`, `.media-object`, `.media-heading` endi kerak emas.

## Rasmni tekislash

Flex utilitalari bilan:

```html
<div class="media">
  <img src="a.png" class="align-self-center mr-3" alt="…">  <!-- vertikal markaz -->
  <div class="media-body">…</div>
</div>
<div class="media">
  <img src="a.png" class="align-self-end mr-3" alt="…">     <!-- pastda -->
  <div class="media-body">…</div>
</div>
```

## Rasm o‘ngda

Rasmni `media-body` dan keyin yozing va masofani chapdan bering:

```html
<div class="media">
  <div class="media-body">…</div>
  <img src="a.png" class="ml-3" alt="…">
</div>
```

## Ichma-ich (javoblar)

```html
<div class="media">
  <img src="a.png" class="mr-3" alt="Aziza" width="64">
  <div class="media-body">
    <h5 class="mt-0">Aziza</h5>
    Grid’da offset qanday ishlaydi?

    <div class="media mt-3">
      <img src="b.png" class="mr-3" alt="O‘qituvchi" width="48">
      <div class="media-body">
        <h5 class="mt-0">O‘qituvchi</h5>
        Offset ustunni o‘ngga suradi.
      </div>
    </div>
  </div>
</div>
```

## Ro‘yxat ko‘rinishida

```html
<ul class="list-unstyled">
  <li class="media mb-4">…</li>
  <li class="media mb-4">…</li>
</ul>
```

## Bootstrap 5 da

> Bootstrap 5 da `.media` komponenti olib tashlangan — xuddi shu natija `d-flex` va `flex-grow-1` (yoki `flex-shrink-0`) utilitalari bilan olinadi. Bootstrap 4 dagi `.media` aslida shu utilitalarning qisqa yozuvi.

## Xulosa

- `.media` (flex) > rasm + `.media-body`.
- Masofa — `mr-3`/`ml-3`, tekislash — `align-self-*`.
- Javoblar — ichma-ich `.media`; ro‘yxat — `ul.list-unstyled > li.media`.
