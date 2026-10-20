## Dizayner va dasturchi o‘rtasida

Ko‘p jamoalarda dizayner sahifani **Figma**’da chizadi, dasturchi esa uni HTML va CSS’ga aylantiradi. Bu jarayon _handoff_ deyiladi. Yaxshi frontend dasturchi maketni “rasm” sifatida emas, **tuzilma** sifatida o‘qiydi: qaysi bloklar, qanday oraliqlar, qaysi uslublar.

Figma brauzerda va kompyuter ilovasida ishlaydi, bepul rejasi o‘rganish uchun yetarli. Bu kursda Figma’ni qanday o‘qishni o‘rganasiz, mashqlarda esa maketdagi qiymatlar spetsifikatsiya sifatida beriladi.

## Asosiy tushunchalar

| Figma                | Ma’nosi                                  | CSS / HTML’da                        |
| -------------------- | ---------------------------------------- | ------------------------------------ |
| **Frame** (freym)    | Konteyner, ekran yoki blok               | `div`, `section`, `main`             |
| **Layer** (qatlam)   | Har qanday element                       | HTML element                         |
| **Group**            | Shunchaki guruhlash, o‘z xususiyati yo‘q | Ko‘pincha alohida element kerak emas |
| **Text**             | Matn qatlami                             | `h1`, `p`, `span`                    |
| **Rectangle**        | To‘rtburchak shakl                       | Ko‘pincha fon yoki chegara           |
| **Component**        | Qayta ishlatiladigan element             | CSS klass, komponent                 |
| **Style / Variable** | Nomlangan rang, shrift, effekt           | CSS o‘zgaruvchi, token               |

## Interfeys

- **Chap panel — Layers**: qatlamlar daraxti. Bu deyarli HTML tuzilmasi: freym ichida freym, ichida matn.
- **Markaz — Canvas**: maketning o‘zi.
- **O‘ng panel — Design**: tanlangan qatlamning o‘lchami, joylashuvi, rangi, shrifti.
- **Dev Mode / Inspect**: dasturchi uchun rejim — qiymatlar CSS ko‘rinishida.

## Freym — sahifa

Ekran dizayni odatda freymda: `Mobile/Home` 375 × 812, `Desktop/Home` 1440 × 1024. Freym o‘lchami — dizayner qaysi ekranni nazarda tutganini bildiradi. Lekin sahifa faqat shu o‘lchamda ishlashi kerak degani emas: 375 da chizilgan maket 320 da ham, 430 da ham to‘g‘ri ko‘rinishi kerak.

## Qatlam nomlari

Yaxshi dizayner qatlamlarga ma’noli nom beradi: `Header`, `Card/Lesson`, `Button/Primary`. Bu nomlar ko‘pincha CSS klasslariga aylanadi. Agar qatlamlar `Frame 427`, `Rectangle 12` deb nomlangan bo‘lsa, dizaynerdan nomlashni so‘rang — keyin ikkalangiz bir tilda gaplashasiz.

## Matn qatlamlari

Matn qatlamida shrift, o‘lcham, qator balandligi, qalinlik va rang ko‘rsatiladi. “Bold 28/36” — 28px shrift, 36px qator balandligi. Bu yozuv tipografiyada keng tarqalgan.

Mashqda oddiy mobil freymni spetsifikatsiya bo‘yicha sahifaga ko‘chirasiz.
