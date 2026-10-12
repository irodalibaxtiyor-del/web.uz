## `font` qisqa yozuvi

`font` bir nechta shrift xususiyatini bitta qatorda yozish imkonini beradi:

```css
p {
  font: italic 700 1rem/1.6 Georgia, serif;
}
```

Bu quyidagiga teng:

```css
p {
  font-style: italic;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.6;
  font-family: Georgia, serif;
}
```

## Tartib qoidalari

```text
font: [style] [variant] [weight] size[/line-height] family;
```

- `font-size` va `font-family` **majburiy**. Ulardan biri bo‘lmasa, butun qator e’tiborsiz qoldiriladi.
- `font-family` doim **oxirida**.
- `line-height` o‘lchamdan keyin `/` bilan yoziladi.
- Uslub, variant va qalinlik o‘lchamdan **oldin**, istalgan tartibda.

```css
/* To‘g‘ri */
h1 { font: 700 2rem Georgia, serif; }

/* Noto‘g‘ri: family yo‘q — qoida ishlamaydi */
h1 { font: 700 2rem; }

/* Noto‘g‘ri: o‘lcham family’dan keyin */
h1 { font: Georgia 2rem; }
```

## Yashirin tuzoq: qayta tiklash

Qisqa yozuv **yozilmagan** qismlarni standart qiymatga qaytaradi:

```css
h2 {
  font-weight: 700;
  font: 1.5rem Arial, sans-serif; /* font-weight endi normal! */
}
```

Shuning uchun `font` ni avval, alohida xususiyatlarni keyin yozing.

## Formalar uchun foydali qator

```css
button,
input,
select,
textarea {
  font: inherit;
}
```

Bu forma elementlarini sahifaning qolgan qismidagi shrift, o‘lcham va qator balandligi bilan tenglashtiradi.

## Xulosa

- `font: style weight size/line-height family`.
- `font-size` va `font-family` majburiy, family doim oxirida.
- Qisqa yozuv yozilmagan qismlarni standartga qaytaradi.
- `font: inherit` forma elementlari uchun foydali.
