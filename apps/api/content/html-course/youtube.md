## Nega videoni o‘zingiz joylamaysiz?

Videolar katta hajmli bo‘ladi: ularni saqlash va ko‘plab foydalanuvchilarga uzatish qimmat. Shuning uchun ko‘pincha video YouTube kabi xizmatga yuklanadi, sahifaga esa **`<iframe>`** orqali joylashtiriladi.

## Joylashtirish kodi

1. YouTube’da videoni oching va **Ulashish → Joylashtirish** ni tanlang.
2. Berilgan kodni sahifaga qo‘ying. U taxminan shunday ko‘rinadi:

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="HTML darsi: birinchi sahifa"
  allow="encrypted-media; picture-in-picture"
  allowfullscreen>
</iframe>
```

- `VIDEO_ID` — video manzilidagi `v=` dan keyingi qism. Masalan, `youtube.com/watch?v=abc123` uchun `embed/abc123`;
- `title` — video nomi, ekran o‘qiydigan dasturlar uchun;
- `allowfullscreen` — to‘liq ekran tugmasiga ruxsat.

> **E’tibor bering:** manzilda `watch?v=` emas, `embed/` bo‘lishi kerak. Oddiy `watch` manzili iframe ichida ochilmaydi.

## Parametrlar

Manzil oxiriga `?` dan keyin parametrlar qo‘shiladi, ular `&` bilan ajratiladi:

| Parametr     | Vazifasi                                         |
| ------------ | ------------------------------------------------ |
| `autoplay=1` | Avtomatik boshlash (faqat `mute=1` bilan ishlaydi) |
| `mute=1`     | Ovozsiz                                          |
| `loop=1`     | Takrorlash (`playlist=VIDEO_ID` ham kerak)       |
| `controls=0` | Boshqaruv tugmalarini yashirish                  |
| `start=30`   | 30-soniyadan boshlash                            |

```html
<iframe src="https://www.youtube.com/embed/abc123?start=30&mute=1"
        title="Dars videosi" width="560" height="315"></iframe>
```

## Moslashuvchan video

Iframe’ni ekran kengligiga moslashtirish uchun CSS’dagi `aspect-ratio` qulay:

```html
<iframe src="https://www.youtube.com/embed/abc123" title="Dars videosi"
        style="width: 100%; height: auto; aspect-ratio: 16 / 9; border: 0;"></iframe>
```

> **Platformada:** Ishga tushirish oynasi tashqi saytlarga ulanmaydi, shuning uchun YouTube video u yerda ko‘rinmaydi. Misolni kompyuteringizda `index.html` sifatida sinab ko‘ring.

## Xulosa

- YouTube video `<iframe src="https://www.youtube.com/embed/ID">` orqali joylashtiriladi.
- `title` va `allowfullscreen` ni unutmang.
- `autoplay=1` faqat `mute=1` bilan ishlaydi.
