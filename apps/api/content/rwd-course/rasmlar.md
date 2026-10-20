## Rasm konteynerdan chiqmasin

Rasmning tabiiy o‘lchami 1200px bo‘lsa, telefonda u ekrandan chiqib ketadi. Asosiy qoida:

```css
img {
  display: block;
  max-width: 100%;
  height: auto;
}
```

- `max-width: 100%` — rasm hech qachon konteyneridan kengaymaydi, lekin kichik rasm cho‘zilib xiralashmaydi;
- `height: auto` — balandlik nisbatga qarab hisoblanadi;
- `display: block` — rasm ostidagi qator bo‘shlig‘ini yo‘qotadi.

## `width` va `height` atributlari

```html
<img src="muqova.jpg" width="800" height="300" alt="Kurs muqovasi">
```

Atributlar rasmni shu o‘lchamda **qotirib qo‘ymaydi** (CSS baribir ustun). Ular brauzerga rasm hali yuklanmasdan nisbatni aytadi — brauzer oldindan joy ajratadi va sahifa “sakramaydi”. Bu Google’ning CLS (*layout shift*) ko‘rsatkichiga ta’sir qiladi.

## `aspect-ratio`

Rasmning asl nisbati qanday bo‘lishidan qat’i nazar, ko‘rinishini aniq nisbatga keltirish mumkin:

```css
.muqova {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
```

640px kenglikda balandlik 360px bo‘ladi. `aspect-ratio` faqat rasmga emas, `div` va `iframe` ga ham ishlaydi.

## `object-fit`

Rasmni boshqa nisbatdagi “ramka” ga solganda u cho‘ziladi. `object-fit` buni hal qiladi:

| Qiymat | Natija |
| --- | --- |
| `fill` (standart) | Cho‘ziladi, nisbat buziladi |
| `cover` | Ramkani to‘liq to‘ldiradi, ortiqcha qism qirqiladi |
| `contain` | To‘liq ko‘rinadi, chetlarda bo‘sh joy qolishi mumkin |

`object-position: top` bilan qaysi qismi ko‘rinib turishini tanlash mumkin (masalan, portretda yuz qirqilmasin).

## Avatar

```css
.avatar {
  width: 64px;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50%;
}
```

To‘g‘ri to‘rtburchak rasm ham chiroyli doira bo‘ladi.

## Fon rasmlari

CSS fonidagi rasm uchun `background-size: cover` va `background-position: center` — xuddi `object-fit: cover` kabi. Lekin kontent bo‘lgan rasm (mahsulot, maqola rasmi) `<img>` bilan bo‘lishi kerak: unga `alt` yozish mumkin, u qidiruvda ko‘rinadi va kechiktirib yuklanadi.

Mashqda kurs kartasi muqovasi va muallif avatarini moslashuvchan qilasiz.
