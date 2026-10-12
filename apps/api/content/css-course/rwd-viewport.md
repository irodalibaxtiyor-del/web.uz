## Viewport meta tegi

Telefon brauzerlari dastlab oddiy saytlarni ko‘rsatish uchun “hiyla” ishlatgan: sahifani taxminan **980px** kenglikdagi virtual ekranda chizib, keyin telefon ekraniga **kichraytirgan**. Natijada matn mayda bo‘lib, foydalanuvchi barmoqlari bilan kattalashtirishga majbur bo‘lgan.

Sahifa moslashuvchan ekanini brauzerga aytish uchun `<head>` ga shu qator yoziladi:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

| Qism                    | Ma’nosi                                          |
| ----------------------- | ------------------------------------------------ |
| `width=device-width`    | Virtual ekran kengligi — qurilma kengligiga teng |
| `initial-scale=1`       | Boshlang‘ich masshtab — 100%                     |

Bu tegsiz media so‘rovlar ham telefonda to‘g‘ri ishlamaydi: brauzer o‘zini 980px kenglikda deb hisoblaydi.

> WEBDIZAYN.UZ mashqlaridagi barcha `index.html` fayllarda bu teg allaqachon bor.

## Kattalashtirishni o‘chirmang

Ba’zi saytlarda shunday yozuv uchraydi:

```html
<!-- Bunday qilmang -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

Bu foydalanuvchiga sahifani barmoqlar bilan kattalashtirishni taqiqlaydi. Ko‘zi yaxshi ko‘rmaydigan odamlar uchun bu jiddiy muammo. Kattalashtirishga doim ruxsat bering.

## Kontent ekranga sig‘sin

Viewport tegi bo‘lsa ham, sahifa gorizontal aylantirilib qolishi mumkin — agar biror element ekrandan keng bo‘lsa. Asosiy sabablar va yechimlar:

| Sabab                              | Yechim                                    |
| ---------------------------------- | ----------------------------------------- |
| Qat’iy `width: 800px`              | `max-width: 800px` yoki `width: 100%`     |
| Katta rasm                         | `img { max-width: 100%; height: auto; }`  |
| Uzun havola yoki so‘z              | `overflow-wrap: anywhere`                 |
| Keng jadval yoki kod               | O‘ramga `overflow-x: auto`                |
| `100vw` + aylantirish paneli       | `100%` ishlating                          |

Sahifaning telefon kengligida yon tomonga aylanmasligini doim tekshiring.

## Xulosa

- `<meta name="viewport" content="width=device-width, initial-scale=1">` — har bir sahifada.
- `user-scalable=no` va `maximum-scale=1` yozmang.
- Ekrandan keng elementlar gorizontal aylantirishga sabab bo‘ladi.
