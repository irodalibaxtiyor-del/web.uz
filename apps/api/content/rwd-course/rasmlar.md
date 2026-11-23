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

```tekshir
HTML’da `<img>` ga `width` va `height` yozish nimaga yordam beradi?
+ rasm yuklanmasidan oldin joy ajratilib, sahifa “sakramaydi” (CLS)
- rasmni har doim shu o‘lchamda qotiradi
- rasmni tezroq yuklaydi
> CSS dagi `max-width: 100%; height: auto` bilan birga rasm baribir moslashadi.
```

```jonli
<style>
  img { max-width: 100%; height: auto; display: block; }
  .a { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; }
</style>
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27800%27%20height=%27300%27%3E%3Crect%20width=%27800%27%20height=%27300%27%20fill=%27%230071dc%27/%3E%3Ccircle%20cx=%27560%27%20cy=%27105%27%20r=%2745%27%20fill=%27%23fff%27/%3E%3C/svg%3E" width="800" height="300" alt="Keng rasm">
<img class="a" src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27200%27%20height=%27300%27%3E%3Crect%20width=%27200%27%20height=%27300%27%20fill=%27%23f5a623%27/%3E%3Ccircle%20cx=%27140%27%20cy=%27105%27%20r=%2730%27%20fill=%27%23fff%27/%3E%3C/svg%3E" width="200" height="300" alt="Avatar" style="margin-top: 8px">
```
