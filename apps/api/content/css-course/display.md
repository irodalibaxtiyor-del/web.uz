## `display` xususiyati

`display` element sahifada **qanday joylashishini** belgilaydi. Bu maketdagi eng muhim xususiyatlardan biri.

## Blok va qator elementlar

Har bir HTML elementning standart `display` qiymati bor:

| Turi     | Xususiyati                                                        | Misollar                          |
| -------- | ----------------------------------------------------------------- | --------------------------------- |
| `block`  | Yangi qatordan boshlanadi, butun kenglikni egallaydi              | `div`, `p`, `h1`, `section`, `ul` |
| `inline` | Matn oqimida qoladi, kengligi kontentcha, `width`/`height` ishlamaydi | `a`, `span`, `strong`, `em`   |

```css
nav a {
  display: block; /* havolalar ustma-ust, har biri butun kenglikda */
}

li {
  display: inline; /* ro‘yxat elementlari bir qatorda */
}
```

`display` faqat elementning **ko‘rinishini** o‘zgartiradi. `<span>` ga `display: block` bersangiz ham, u HTML ma’nosida qator elementligicha qoladi.

## Asosiy qiymatlar

| Qiymat         | Natija                                                   |
| -------------- | -------------------------------------------------------- |
| `block`        | Blok element                                             |
| `inline`       | Qator element                                            |
| `inline-block` | Qatorda turadi, lekin `width`, `height`, padding ishlaydi |
| `flex`         | Flexbox konteyner (13-modul)                             |
| `grid`         | Grid konteyner (14-modul)                                |
| `none`         | Element umuman ko‘rsatilmaydi                            |

## Yashirish: `display: none` va `visibility: hidden`

```css
.yopiq {
  display: none;
}

.korinmas {
  visibility: hidden;
}
```

| Usul                 | Joy egallaydimi? | Ekran o‘quvchi o‘qiydimi? |
| -------------------- | ---------------- | ------------------------- |
| `display: none`      | Yo‘q             | Yo‘q                      |
| `visibility: hidden` | **Ha** (bo‘sh joy qoladi) | Yo‘q             |

Menyuni ochib-yopish, modal oynalar kabi narsalarda odatda `display: none` ishlatiladi.

> **Faqat ekran o‘quvchi uchun matn:** ko‘zga ko‘rinmasin-u, ekran o‘quvchi o‘qisin desangiz, `display: none` ishlamaydi. Buning uchun maxsus “sr-only” klassi yoziladi (keyingi modullarda).

## Xulosa

- Blok elementlar yangi qatordan boshlanadi, qator elementlar matn ichida qoladi.
- `display` faqat ko‘rinishni o‘zgartiradi, HTML ma’nosini emas.
- `display: none` elementni joyi bilan olib tashlaydi, `visibility: hidden` joyini qoldiradi.
