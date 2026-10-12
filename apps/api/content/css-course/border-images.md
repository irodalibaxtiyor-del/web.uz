## Chegara rasmi: `border-image`

`border-image` chegarani oddiy chiziq o‘rniga **rasm** yoki **gradient** bilan chizadi.

```css
.ramka {
  border: 12px solid transparent;
  border-image: url("ramka.png") 30 round;
}
```

## Qanday ishlaydi?

Brauzer rasmni to‘qqiz qismga bo‘ladi:

```text
┌────┬──────────┬────┐
│ 1  │    2     │ 3  │   1, 3, 7, 9 — burchaklar (o‘zgarmaydi)
├────┼──────────┼────┤   2, 4, 6, 8 — tomonlar (cho‘ziladi yoki takrorlanadi)
│ 4  │    5     │ 6  │   5 — o‘rta qism (standart holda tashlab yuboriladi)
├────┼──────────┼────┤
│ 7  │    8     │ 9  │
└────┴──────────┴────┘
```

| Xususiyat             | Vazifasi                                         |
| --------------------- | ------------------------------------------------ |
| `border-image-source` | Rasm yoki gradient                               |
| `border-image-slice`  | Burchaklar qanchadan kesiladi (birliksiz = piksel) |
| `border-image-width`  | Chegara rasmining qalinligi                       |
| `border-image-repeat` | `stretch` (cho‘zish), `repeat`, `round`, `space` |

## Gradientli chegara

Rasm faylisiz, gradient bilan chiroyli chegara:

```css
.gradient-chegara {
  border: 4px solid;
  border-image: linear-gradient(90deg, #0071dc, #fec400) 1;
}
```

Oxiridagi `1` — `border-image-slice`. Gradient uchun shu qiymat yetarli: butun gradient chegaraga cho‘ziladi.

## Muhim: `border` baribir kerak

`border-image` chegaraning **joyini** yaratmaydi. Avval `border-width` va `border-style` berilishi shart — `border-image` faqat uning ko‘rinishini almashtiradi. Rasm yuklanmasa, oddiy chegara ko‘rinadi.

## Cheklov: yumaloq burchak

`border-image` bilan `border-radius` birga ishlamaydi — burchaklar to‘g‘ri bo‘lib qoladi. Yumaloq gradient chegara uchun boshqa usul ishlatiladi:

```css
.yumaloq-gradient {
  border: 4px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(90deg, #0071dc, #fec400) border-box;
}
```

Ikki qatlamli fon: ichkisi oq (padding qutisigacha), tashqisi gradient (chegara qutisigacha). Chegara shaffof bo‘lgani uchun ostidagi gradient ko‘rinadi.

## Xulosa

- `border-image` chegarani rasm yoki gradient bilan chizadi.
- Avval oddiy `border` (qalinlik va uslub) kerak.
- Gradient chegara: `border-image: linear-gradient(…) 1`.
- Yumaloq burchak uchun ikki qatlamli fon usuli.
