## Moslashuvchan rasmlar

## Asos: rasm konteynerdan chiqmasin

```css
img {
  max-width: 100%;
  height: auto;
}
```

Rasm hech qachon otasidan keng bo‘lmaydi va nisbati saqlanadi. HTML’da `width` va `height` atributlarini yozib qo‘ying — brauzer rasm yuklanmasdan oldin joy ajratadi va sahifa “sakramaydi”:

```html
<img src="manzara.jpg" width="1200" height="800" alt="Chorvoq suv ombori">
```

## Fon rasmi

```css
.qahramon {
  background-image: url("manzara.jpg");
  background-size: cover;
  background-position: center;
}
```

Fon rasmini media so‘rov bilan almashtirish mumkin:

```css
.qahramon {
  background-image: url("manzara-kichik.jpg");
}

@media (min-width: 1024px) {
  .qahramon {
    background-image: url("manzara-katta.jpg");
  }
}
```

Telefon katta faylni yuklamaydi.

## `srcset` — bir rasmning bir nechta o‘lchami

```html
<img
  src="manzara-800.jpg"
  srcset="manzara-400.jpg 400w, manzara-800.jpg 800w, manzara-1600.jpg 1600w"
  sizes="(min-width: 1024px) 50vw, 100vw"
  alt="Chorvoq suv ombori">
```

- `srcset` — mavjud fayllar va ularning haqiqiy kengligi (`w`);
- `sizes` — rasm sahifada qancha joy egallashi;
- brauzer ekran o‘lchami va piksel zichligiga qarab **eng mosini** o‘zi tanlaydi.

## `<picture>` — boshqacha kesilgan rasm

Telefonda keng manzara o‘rniga yaqinroq kesilgan rasm ko‘rsatish (art direction):

```html
<picture>
  <source media="(min-width: 768px)" srcset="jamoa-keng.jpg">
  <img src="jamoa-tor.jpg" alt="Jamoa a’zolari">
</picture>
```

Yangi formatlarni taklif qilish:

```html
<picture>
  <source type="image/avif" srcset="rasm.avif">
  <source type="image/webp" srcset="rasm.webp">
  <img src="rasm.jpg" alt="…">
</picture>
```

Brauzer tushunadigan birinchi formatni oladi.

## Kech yuklash

```html
<img src="galereya-5.jpg" loading="lazy" alt="…">
```

`loading="lazy"` — rasm ekranga yaqinlashgandagina yuklanadi. Sahifa tepasidagi asosiy rasmga buni **bermang** — u darhol kerak.

## `aspect-ratio` va `object-fit`

```css
.karta img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

Turli o‘lchamdagi rasmlar har qanday kenglikda bir xil nisbatda.

## Xulosa

- `max-width: 100%; height: auto;` va HTML’da `width`/`height`.
- `srcset` + `sizes` — brauzer mos o‘lchamni tanlaydi.
- `<picture>` — boshqacha kesim yoki yangi format.
- `loading="lazy"` — pastdagi rasmlar uchun.
