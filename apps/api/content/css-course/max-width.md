## `max-width` va markazlash

Blok element standart holda butun kenglikni egallaydi. Katta monitorda bu juda uzun qatorlarga olib keladi: 200 belgilik qatorni o‘qish qiyin. Qulay qator uzunligi — taxminan **60–80 belgi**.

## `width` muammosi

```css
.maqola {
  width: 700px;
}
```

Katta ekranda yaxshi. Lekin telefon ekrani 375px bo‘lsa, maqola ekrandan chiqib ketadi va sahifa yon tomonga aylantiriladigan bo‘ladi.

## Yechim: `max-width`

```css
.maqola {
  max-width: 700px;
  margin: 0 auto;
}
```

- Katta ekranda kenglik **700px** dan oshmaydi;
- kichik ekranda element ekran kengligiga moslashadi;
- `margin: 0 auto` uni markazga qo‘yadi.

`max-width` `width` dan ustun turadi: ikkalasi yozilsa ham kenglik `max-width` dan oshmaydi.

## Konteyner naqshi

Deyarli har bir saytda shunday klass bor:

```css
.konteyner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}
```

`padding` kichik ekranda matnni ekran chetiga yopishib qolishdan saqlaydi.

## Belgilar bo‘yicha kenglik: `ch`

Matn uchun `ch` birligi qulay — u “0” belgisining kengligiga teng:

```css
.maqola p {
  max-width: 65ch;
}
```

Shrift o‘lchami o‘zgarsa ham, qatorda taxminan 65 belgi qoladi.

## `min-width`

`min-width` aksincha ishlaydi: element shu kenglikdan **torayolmaydi**. Masalan, tugmalar juda siqilib qolmasligi uchun:

```css
.tugma {
  min-width: 120px;
}
```

## Rasmlar

Rasmlar ham konteynerdan chiqib ketmasligi kerak:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Bu qator deyarli har bir loyihada bor: rasm hech qachon otasidan kengayib ketmaydi, nisbati saqlanadi.

## Xulosa

- Kenglik uchun `width` o‘rniga `max-width` ishlating.
- `max-width` + `margin: 0 auto` — markazdagi konteyner.
- Matn uchun `max-width: 65ch` qulay.
- `img { max-width: 100%; height: auto; }`.
