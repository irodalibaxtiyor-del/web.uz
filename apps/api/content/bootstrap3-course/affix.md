## Affix

**Affix** plagini element sahifa aylantirilganda ma’lum joydan keyin **mahkamlanib** qolishini ta’minlaydi. Masalan, navbar sarlavha ostida turadi, foydalanuvchi pastga aylantirganda esa ekran tepasiga yopishib qoladi.

```html
<nav class="navbar navbar-inverse" data-spy="affix" data-offset-top="197">
  ...
</nav>
```

- `data-spy="affix"` — plaginni yoqadi;
- `data-offset-top="197"` — sahifa 197px pastga aylanganda element mahkamlanadi.

## Uchta holat

Plagin elementga holatga qarab klass beradi:

| Klass           | Qachon                                  |
| --------------- | --------------------------------------- |
| `.affix-top`    | Hali offset’gacha aylanmagan (oddiy joyida) |
| `.affix`        | Offset’dan o‘tildi — mahkamlangan       |
| `.affix-bottom` | `data-offset-bottom` ga yetildi         |

Bootstrap faqat klassni almashtiradi. Mahkamlash uslubini **o‘zingiz** yozasiz:

```css
.affix {
  top: 0;
  width: 100%;
  z-index: 1000;
}
.affix + .container {
  padding-top: 70px; /* navbar o‘rni bo‘sh qolmasin, kontent sakramasin */
}
```

`.affix` klassining o‘zida Bootstrap `position: fixed` beradi.

## Yon panel

Affix ko‘pincha scrollspy bilan birga ishlatiladi — yon panel mundarija mahkamlanib turadi va joriy bo‘limni ko‘rsatadi:

```html
<body data-spy="scroll" data-target="#yon">
  <div class="container">
    <div class="row">
      <nav class="col-sm-3" id="yon">
        <ul class="nav nav-pills nav-stacked" data-spy="affix" data-offset-top="205">
          <li class="active"><a href="#b1">1-bo‘lim</a></li>
          <li><a href="#b2">2-bo‘lim</a></li>
        </ul>
      </nav>
      <div class="col-sm-9">...</div>
    </div>
  </div>
</body>
```

## JavaScript orqali

```js
$('#menyu').affix({
  offset: { top: 100, bottom: 200 }
});
```

## Zamonaviy alternativa

> Bootstrap 4 da affix olib tashlangan. Hozir xuddi shu natija bitta CSS qatori bilan olinadi: `position: sticky; top: 0;`. Bootstrap 4/5 da buning uchun `.sticky-top` klassi bor. Affix’ni faqat eski Bootstrap 3 loyihalarida uchratasiz.

## Xulosa

- `data-spy="affix"` + `data-offset-top="N"`.
- Holatlar: `.affix-top`, `.affix`, `.affix-bottom`; mahkamlangan uslubni o‘zingiz yozasiz (`top: 0`).
- Zamonaviy usul: `position: sticky`.
