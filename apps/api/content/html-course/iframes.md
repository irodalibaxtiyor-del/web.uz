## `<iframe>` nima?

`<iframe>` (inline frame) sahifa ichiga **boshqa veb-sahifani** joylashtiradi. Xarita, video pleer yoki boshqa saytdagi vidjetlar ko‘pincha shunday qo‘shiladi.

```html
<iframe src="xarita.html" title="Ofis joylashgan xarita" width="600" height="400"></iframe>
```

## Asosiy atributlar

| Atribut           | Vazifasi                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| `src`             | Joylashtiriladigan sahifa manzili                                                |
| `title`           | Iframe mazmuni tavsifi — ekran o‘qiydigan dasturlar uchun majburiy deb hisoblang |
| `width`, `height` | O‘lcham                                                                          |
| `loading="lazy"`  | Ekranga yaqinlashganda yuklash                                                   |

## Chegarani olib tashlash

Brauzer iframe atrofida chegara chizadi. CSS bilan olib tashlash mumkin:

```html
<iframe src="vidjet.html" title="Ob-havo vidjeti" style="border: none;"></iframe>
```

## Havolani iframe’da ochish

Iframe’ga `name` berib, havolaning `target` atributida shu nomni ko‘rsatish mumkin:

```html
<iframe src="bosh.html" name="ichki-oyna" title="Ichki oyna"></iframe>

<p><a href="yangilik.html" target="ichki-oyna">Yangilikni ichki oynada ochish</a></p>
```

## Xavfsizlik

Iframe ichidagi sahifa — boshqa birovning kodi. Shuning uchun:

- faqat ishonchli manbalarni joylashtiring;
- `sandbox` atributi bilan iframe imkoniyatlarini cheklang:

```html
<iframe src="https://example.uz/vidjet" title="Vidjet" sandbox></iframe>
```

Bo‘sh `sandbox` skriptlar, formalar va ochiladigan oynalarni taqiqlaydi. Kerakli imkoniyatlarni alohida ruxsat berish mumkin: `sandbox="allow-scripts"`.

Aytgancha, platformamizdagi “Ishga tushirish” oynasi ham aynan `sandbox` li iframe’da ishlaydi — siz yozgan kod asosiy saytga zarar yetkaza olmaydi.

> **Eslatma:** Ko‘p saytlar (masalan, banklar) o‘zini iframe ichida ko‘rsatishni taqiqlaydi. Bunday sahifa iframe’da bo‘sh yoki xato bo‘lib ko‘rinadi.

## Xulosa

- `<iframe src title>` — sahifa ichiga boshqa sahifani joylashtiradi.
- `title` majburiy deb hisoblang; `loading="lazy"` sahifani tezlashtiradi.
- Begona kontent uchun `sandbox` bilan imkoniyatlarni cheklang.
