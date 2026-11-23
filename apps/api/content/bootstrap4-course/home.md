## Bootstrap 4

**Bootstrap** — moslashuvchan (responsive), mobile-first saytlar yaratish uchun eng mashhur bepul CSS freymvorklaridan biri. Unda tayyor setka, tipografiya, tugmalar, formalar, kartalar, navbar, modal, karusel va boshqa ko‘plab komponentlar bor.

**Bootstrap 4** 2018-yilda chiqdi va freymvorkni deyarli qaytadan yozdi. Bu kurs uning oxirgi versiyasi — **4.6.2** bilan ishlaydi.

## Bootstrap 3 dan nimasi farq qiladi?

| Mavzu          | Bootstrap 3                       | Bootstrap 4                                  |
| -------------- | --------------------------------- | -------------------------------------------- |
| Setka          | `float` asosida                   | **Flexbox** asosida — teng balandlik, avtomatik ustunlar |
| Ekran sinflari | xs, sm, md, lg                    | xs, sm, md, lg, **xl** (≥ 1200px)            |
| Birliklar      | `px`                              | `rem` va `em`                                |
| Shrift         | 14px                              | **16px** (brauzer standarti)                 |
| Kartochka      | panel, well, thumbnail            | bitta komponent — **card**                   |
| Ikonkalar      | Glyphicons ichida                 | Ichida ikonka yo‘q (Bootstrap Icons alohida) |
| Utilitalar     | Juda kam                          | Spacing (`m-3`, `p-2`), display, flex, border, shadow… |
| JavaScript     | jQuery                            | jQuery + **Popper** (tooltip, dropdown uchun) |

Eng muhim o‘zgarish — **Flexbox** va **utilita klasslar**. Bootstrap 4 da ko‘p narsani o‘zingizning CSS’ingizsiz, faqat klasslar bilan qilish mumkin:

```html
<div class="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded">
  <span>Bootstrap 4</span>
  <button class="btn btn-primary btn-sm">Boshlash</button>
</div>
```

Bu bitta qator: flex konteyner, elementlar chetlarga tarqatilgan, vertikal markazda, ichki bo‘shliq, pastki margin, och fon, yumaloq burchaklar.

## Brauzerlar

Bootstrap 4 barcha zamonaviy brauzerlarda ishlaydi. Internet Explorer 10 va undan eskisi qo‘llab-quvvatlanmaydi (IE 11 qisman).

## Bu kursda nima qilamiz?

1. Bootstrap 4 ni ulash, konteynerlar va setka asoslari.
2. Tipografiya, ranglar, jadvallar, rasmlar.
3. Alert, tugma, badge, progress bar va spinner.
4. Pagination, list group, **card**, dropdown, collapse, nav va navbar.
5. Formalar, input group va custom forma elementlari.
6. JavaScript komponentlar: karusel, modal, tooltip, popover, toast, scrollspy.
7. Utilitalar, Flexbox va ikonkalar.
8. Setka tizimi: barcha beshta ekran sinfi.

Har darsdan keyin amaliy mashq bor — IDE’da yozasiz, **Ishga tushirish** bilan ko‘rasiz va **Tekshirish** bilan serverda tekshirasiz.

> Platformada Bootstrap fayllari serverning o‘zida saqlanadi. Siz odatdagi CDN havolasini yozasiz — platforma uni o‘zidagi xuddi shu faylga almashtiradi. Boshqa tashqi havolalar xavfsizlik uchun bloklangan.

```tekshir
Bootstrap 4 Bootstrap 3 dan qaysi asosiy jihati bilan farq qiladi?
+ setka va komponentlar Flexbox asosida qurilgan
- jQuery umuman ishlatilmaydi
- `panel` va `well` qo‘shildi
> Bootstrap 4 Flexbox’ga o‘tdi va `panel`/`well`/`thumbnail` o‘rniga `card` keldi; jQuery hali kerak (Bootstrap 5 da olib tashlandi).
```

```jonli
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<div class="container py-3">
  <h1 class="display-4">Bootstrap 4</h1>
  <p class="lead">Flexbox asosidagi freymvork.</p>
  <button class="btn btn-primary">Boshlash</button>
</div>
```

## Xulosa

- Bootstrap 4 — Flexbox asosidagi, utilitalarga boy freymvork.
- Asosiy yangiliklar: `xl` ekran sinfi, `rem` birliklari, `card`, spacing va flex utilitalari.
- JavaScript komponentlari uchun jQuery va Popper kerak.
