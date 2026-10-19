## Rasm shakllari

Bootstrap 3 da rasmga uchta tayyor shakl berish mumkin:

| Klass            | Ko‘rinishi                                         |
| ---------------- | -------------------------------------------------- |
| `.img-rounded`   | Burchaklari biroz yumaloqlangan (6px)              |
| `.img-circle`    | Doira (`border-radius: 50%`) — kvadrat rasmda aylana |
| `.img-thumbnail` | Oq ramka, ingichka chegara va 4px ichki bo‘shliq    |

```html
<img src="rasm.jpg" class="img-rounded" alt="Samarqand, Registon">
<img src="avatar.jpg" class="img-circle" alt="Aziza Karimova" width="120" height="120">
<img src="manzara.jpg" class="img-thumbnail" alt="Chorvoq suv ombori">
```

> `.img-circle` faqat **kvadrat** rasmda aniq doira beradi. To‘g‘ri to‘rtburchak rasm ellipsga aylanadi.

## Moslashuvchan rasm

Katta rasm tor ekranda konteynerdan chiqib ketmasligi uchun `.img-responsive`:

```html
<img src="banner.jpg" class="img-responsive" alt="Kurs banneri">
```

Bu klass beradi:

```css
display: block;
max-width: 100%;
height: auto;
```

Ya’ni rasm o‘z o‘lchamidan katta bo‘lmaydi, lekin konteyner torroq bo‘lsa kichrayadi va proporsiyasi saqlanadi.

`display: block` bo‘lgani uchun rasmni markazga olish uchun `.center-block` qo‘shiladi:

```html
<img src="logo.png" class="img-responsive center-block" alt="Logo">
```

## Thumbnail galereya

Setka va `.thumbnail` klassi bilan rasmlar galereyasi:

```html
<div class="row">
  <div class="col-sm-4">
    <a href="#" class="thumbnail">
      <img src="1.jpg" alt="Buxoro">
      <p class="text-center">Buxoro</p>
    </a>
  </div>
  <div class="col-sm-4">
    <a href="#" class="thumbnail">
      <img src="2.jpg" alt="Xiva">
      <p class="text-center">Xiva</p>
    </a>
  </div>
</div>
```

`.thumbnail` rasmni ramkaga oladi va havola bo‘lsa hover’da chegarasi ko‘k bo‘ladi.

## Yaxshi amaliyot

- **`alt` majburiy.** Rasm nimani ko‘rsatishini qisqa yozing. Bezak rasmi bo‘lsa — `alt=""`.
- `width` va `height` atributlarini yozish sahifa yuklanayotganda kontent “sakrashining” oldini oladi.
- Rasm hajmini ekranga moslang: telefon uchun 4000px li rasm kerak emas.

> Platforma preview’ida tashqi rasmlar bloklangan. Mashqlarda rasm o‘rniga `data:` URL ichidagi SVG ishlatilgan — o‘z kompyuteringizda oddiy fayl yoki havola ishlating.

## Xulosa

- Shakllar: `.img-rounded`, `.img-circle`, `.img-thumbnail`.
- `.img-responsive` — `max-width: 100%; height: auto;`, markazga olish uchun `.center-block`.
- Galereya: setka + `.thumbnail`.
