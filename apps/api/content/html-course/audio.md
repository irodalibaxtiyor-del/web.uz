## `<audio>` elementi

`<audio>` sahifaga ovoz yoki musiqa joylashtiradi:

```html
<audio controls>
  <source src="qoshiq.mp3" type="audio/mpeg">
  <source src="qoshiq.ogg" type="audio/ogg">
  Brauzeringiz audio elementini qo‘llab-quvvatlamaydi.
</audio>
```

`<video>` bilan juda o‘xshash: `controls` pleerni ko‘rsatadi, `<source>` orqali bir nechta format beriladi, brauzer birinchi tushunganini tanlaydi.

> **Muhim:** `controls` bo‘lmasa, audio pleer sahifada umuman ko‘rinmaydi.

## Atributlar

| Atribut    | Vazifasi                                         |
| ---------- | ------------------------------------------------ |
| `controls` | Pleerni ko‘rsatish                               |
| `autoplay` | Avtomatik boshlash (brauzerlar ko‘pincha bloklaydi) |
| `muted`    | Ovozsiz boshlash                                 |
| `loop`     | Takrorlash                                       |
| `preload`  | `none`, `metadata` yoki `auto`                   |

## Podkast sahifasi namunasi

```html
<article>
  <h2>3-qism: Veb-dizayn tarixi</h2>
  <p>Davomiyligi: 24 daqiqa</p>
  <audio controls preload="metadata">
    <source src="podkast-3.mp3" type="audio/mpeg">
  </audio>
  <p><a href="podkast-3.mp3" download>Yuklab olish</a></p>
</article>
```

`preload="metadata"` faqat davomiylik kabi ma’lumotni oladi, butun faylni oldindan yuklamaydi — trafik tejaladi.

## JavaScript bilan

```js
const audio = document.querySelector('audio');
audio.play();          // boshlash
audio.pause();         // to‘xtatish
audio.currentTime = 0; // boshiga qaytarish
audio.volume = 0.5;    // ovoz balandligi: 0 dan 1 gacha
```

## Qulaylik

- Nutqli audio (podkast, intervyu) uchun **matnli variant** (transkript) bering.
- Ovozni hech qachon avtomatik boshlamang.

> **Platformada:** Ishga tushirish oynasi tashqi audio fayllarni yuklamaydi. Pleerni ishlatib ko‘rish uchun misolni kompyuteringizda sinab ko‘ring.

## Xulosa

- `<audio controls>` + `<source type="audio/mpeg">`.
- `controls` bo‘lmasa, pleer ko‘rinmaydi.
- Nutqli audio uchun transkript qo‘shing.
