## `<video>` elementi

`<video>` sahifaga video joylashtiradi:

```html
<video width="480" height="270" controls>
  <source src="sayohat.mp4" type="video/mp4">
  <source src="sayohat.webm" type="video/webm">
  Brauzeringiz video elementini qo‘llab-quvvatlamaydi.
</video>
```

- `controls` — ijro, pauza, ovoz va to‘liq ekran tugmalarini ko‘rsatadi;
- `width` va `height` — o‘lcham. Ularni yozish sahifa yuklanayotganda “sakrash”ning oldini oladi;
- `<source>` — bir nechta format. Brauzer birinchi tushunganini tanlaydi;
- teglar orasidagi matn faqat brauzer videoni umuman o‘ynay olmasa ko‘rinadi.

## Foydali atributlar

| Atribut       | Vazifasi                                                   |
| ------------- | ---------------------------------------------------------- |
| `controls`    | Boshqaruv tugmalari                                        |
| `autoplay`    | Avtomatik boshlash (ko‘pincha faqat `muted` bilan ishlaydi) |
| `muted`       | Ovozsiz boshlash                                           |
| `loop`        | Tugagach qaytadan boshlash                                 |
| `poster`      | Video boshlanguncha ko‘rsatiladigan rasm                   |
| `preload`     | `none`, `metadata` yoki `auto` — oldindan nimani yuklash   |
| `playsinline` | Telefonda to‘liq ekranga o‘tmasdan o‘ynash                 |

```html
<video src="fon.mp4" autoplay muted loop playsinline poster="fon.jpg"></video>
```

> **Eslatma:** Brauzerlar ovozli videoni avtomatik boshlashga ruxsat bermaydi. `autoplay` ishlashi uchun `muted` ham qo‘shing.

## Subtitrlar: `<track>`

```html
<video controls width="480">
  <source src="dars.mp4" type="video/mp4">
  <track src="dars-uz.vtt" kind="subtitles" srclang="uz" label="O‘zbekcha" default>
</video>
```

Subtitr fayli `.vtt` (WebVTT) formatida bo‘ladi.

## JavaScript bilan boshqarish

```html
<video id="klip" src="klip.mp4" width="320"></video>
<button onclick="document.getElementById('klip').play()">Ijro</button>
<button onclick="document.getElementById('klip').pause()">Pauza</button>
```

`play()`, `pause()`, `currentTime`, `volume` va `muted` — eng ko‘p ishlatiladigan imkoniyatlar.

> **Platformada:** Ishga tushirish oynasi tashqi fayllarni yuklamaydi, shuning uchun video o‘ynamaydi. Elementlarni yozib, natijani tekshirishingiz mumkin. Videoni ko‘rish uchun misolni kompyuteringizda `index.html` sifatida, video fayl bilan bitta papkada sinab ko‘ring.

## Xulosa

- `<video controls>` + bir nechta `<source>` — eng ishonchli usul.
- `autoplay` faqat `muted` bilan ishlaydi; `poster` — muqova rasm.
- `<track>` bilan subtitr qo‘shing.
