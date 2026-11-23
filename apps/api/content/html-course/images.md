## Rasm qo‘shish

Rasm `<img>` tegi bilan qo‘shiladi. U bo‘sh element — yopuvchi tegi yo‘q:

```html
<img src="images/xiva.jpg" alt="Xivadagi Ichan qal’a devorlari" width="640" height="420">
```

| Atribut           | Vazifasi                              |
| ----------------- | ------------------------------------- |
| `src`             | Rasm fayli manzili (majburiy)         |
| `alt`             | Muqobil matn (majburiy deb hisoblang) |
| `width`, `height` | O‘lcham piksellarda                   |

## Yaxshi `alt` qanday yoziladi?

`alt` — rasmni ko‘ra olmaydigan odamga uni tasvirlab berish:

- ✅ `alt="Samarqanddagi Registon maydoni kechqurun"`
- ❌ `alt="rasm"` yoki `alt="IMG_2034.jpg"`

Agar rasm faqat bezak bo‘lsa (masalan, chiziq yoki naqsh), bo‘sh `alt=""` qo‘ying — shunda ekran o‘qiydigan dastur uni o‘tkazib yuboradi.

## O‘lchamni ko‘rsatish

`width` va `height` berilsa, brauzer rasm yuklanmasidanoq unga joy ajratadi va sahifa “sakramaydi”. Rasmni moslashuvchan qilish uchun CSS ishlatiladi:

```html
<img src="manzara.jpg" alt="Chorvoq suv ombori" width="1200" height="800"
     style="max-width: 100%; height: auto;">
```

## Rasm formatlari

| Format        | Qachon ishlatiladi                           |
| ------------- | -------------------------------------------- |
| JPEG (`.jpg`) | Fotosuratlar                                 |
| PNG (`.png`)  | Shaffof fonli rasm, skrinshot                |
| SVG (`.svg`)  | Logotip, ikonka — har qanday o‘lchamda tiniq |
| WebP / AVIF   | Zamonaviy, hajmi kichik                      |
| GIF           | Oddiy animatsiyalar                          |

## Rasm boshqa papkada bo‘lsa

```html
<img src="images/logo.png" alt="Logo">
<!-- images papkasidan -->
<img src="../logo.png" alt="Logo">
<!-- bitta yuqori papkadan -->
<img src="https://example.uz/logo.png" alt="Logo">
<!-- boshqa saytdan -->
```

> **Eslatma:** Platformamizning xavfsiz muharriri tashqi saytlardan rasm yuklamaydi. Mashqlarda rasm manzili sifatida loyiha ichidagi yo‘lni yozing — rasm ko‘rinmasa ham `alt` matni chiqadi va tekshiruv ishlaydi.

## Rasmga izoh: `<figure>` va `<figcaption>`

```html
<figure>
  <img src="buxoro.jpg" alt="Buxorodagi Minorai Kalon" width="400" height="600">
  <figcaption>Minorai Kalon, XII asr</figcaption>
</figure>
```

```tekshir
`alt` atributi nima uchun kerak?
+ rasm ko‘rinmasa yoki ekran o‘quvchi ishlatilsa, rasm mazmunini aytadi
- rasmni kattalashtiradi
- rasmga havola qo‘yadi
> `alt` qulaylik uchun majburiy: ko‘zi ojiz foydalanuvchilar va yuklanmagan rasmlar uchun matnli muqobil.
```

```jonli
<figure>
  <img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27180%27%20viewBox=%270%200%20300%20180%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%232e8b57%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ffe08a%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27180%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2754%27%20r=%2729%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20180%20L0%20126%20L105%2081%20L180%20135%20L240%20108%20L300%20144%20L300%20180%20Z%27%20fill=%27%231b3a2b%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="Tasodifiy manzara" width="300" height="180">
  <figcaption>Rasm ostidagi izoh</figcaption>
</figure>
<img src="yoq.png" alt="Bu rasm topilmadi — alt matni ko‘rinadi">
```

## Xulosa

- Rasm: `<img src alt width height>`.
- `alt` — rasmning mazmunli tavsifi; bezak rasm uchun `alt=""`.
- Format rasm turiga qarab tanlanadi; izoh uchun `<figure>` va `<figcaption>`.
