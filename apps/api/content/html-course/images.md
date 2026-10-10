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

## Xulosa

- Rasm: `<img src alt width height>`.
- `alt` — rasmning mazmunli tavsifi; bezak rasm uchun `alt=""`.
- Format rasm turiga qarab tanlanadi; izoh uchun `<figure>` va `<figcaption>`.
