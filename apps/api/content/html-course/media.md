## Multimedia nima?

Multimedia — sahifadagi **ovoz, video, animatsiya va rasm** kabi matndan boshqa kontent. Ilgari video ko‘rsatish uchun brauzerga qo‘shimcha dastur (plagin) o‘rnatish kerak edi. HTML5’dan boshlab brauzerlar video va audioni o‘zi ijro etadi: buning uchun `<video>` va `<audio>` teglari bor.

## Fayl formatlari

Media fayl turi odatda kengaytmasidan bilinadi.

**Video formatlari:**

| Format | Kengaytma | Izoh                                                  |
| ------ | --------- | ----------------------------------------------------- |
| MP4    | `.mp4`    | Eng keng tarqalgan, barcha zamonaviy brauzerlar o‘ynaydi |
| WebM   | `.webm`   | Ochiq format, fayl hajmi kichikroq                    |
| Ogg    | `.ogg`    | Ochiq format, bugun kam ishlatiladi                   |

**Audio formatlari:**

| Format | Kengaytma | Izoh                                     |
| ------ | --------- | ---------------------------------------- |
| MP3    | `.mp3`    | Eng keng tarqalgan musiqa formati         |
| AAC    | `.m4a`    | Sifati MP3’dan yaxshiroq, hajmi kichikroq |
| Ogg    | `.ogg`    | Ochiq format                              |
| WAV    | `.wav`    | Siqilmagan, hajmi juda katta              |

> **Maslahat:** Video uchun MP4, audio uchun MP3 tanlasangiz, deyarli barcha qurilmalarda ishlaydi.

## MIME turi

Brauzerga fayl turini aniq aytish uchun **MIME turi** ishlatiladi. U `type` atributida yoziladi:

| Fayl   | MIME turi    |
| ------ | ------------ |
| `.mp4` | `video/mp4`  |
| `.webm`| `video/webm` |
| `.mp3` | `audio/mpeg` |
| `.ogg` | `audio/ogg`  |
| `.wav` | `audio/wav`  |

Keyingi darslarda ular qanday ishlatilishini ko‘ramiz.

## Media va qulaylik

- Video uchun **subtitr** (`<track>`) qo‘shing — eshitish imkoniyati cheklangan foydalanuvchilar uchun.
- Ovozni avtomatik ijro etmang: bu foydalanuvchini bezovta qiladi va ko‘p brauzerlar uni bloklaydi.
- Katta media fayllar sahifani sekinlashtiradi — hajmini siqib, mos o‘lchamda tayyorlang.

## Xulosa

- HTML5’da `<video>` va `<audio>` plaginsiz ishlaydi.
- Eng ishonchli formatlar: video uchun MP4, audio uchun MP3.
- `type` atributida MIME turi ko‘rsatiladi.
