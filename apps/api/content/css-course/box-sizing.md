## `box-sizing` — batafsil

3-modulda quti modelini o‘rgandik. Endi `box-sizing` ni chuqurroq ko‘ramiz — u deyarli har bir loyihaning birinchi qatorlaridan biri.

## Ikki model

```css
.quti {
  width: 300px;
  padding: 20px;
  border: 5px solid;
}
```

| `box-sizing`            | `width` nimani o‘lchaydi        | Ekrandagi kenglik |
| ----------------------- | ------------------------------- | ----------------- |
| `content-box` (standart) | Faqat kontentni                | 300 + 40 + 10 = **350px** |
| `border-box`            | Kontent + padding + chegara     | **300px**         |

## Nega `border-box` qulayroq?

Ikki ustunli maketni tasavvur qiling:

```css
.ustun {
  width: 50%;
  padding: 16px;
}
```

`content-box` da har bir ustun `50% + 32px` — ikkalasi bir qatorga sig‘maydi. `border-box` da aynan 50%.

Formalarda ham:

```css
input {
  width: 100%;
  padding: 10px;
}
```

`content-box` da maydon otasidan 20px (+ chegara) kengroq bo‘lib, chiqib ketadi.

## Butun sahifa uchun

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Psevdoelementlar `*` ga kirmaydi, shuning uchun ular alohida yoziladi.

### Meros orqali variant

```css
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
```

Bu variantda biror komponentni `content-box` ga o‘tkazsangiz, uning ichidagi barcha elementlar ham shu modelni oladi. Tashqi kutubxonalar bilan ishlaganda qulay.

## `margin` hisobga kirmaydi

`border-box` ham margin’ni o‘z ichiga olmaydi — margin doim tashqarida.

## Qachon `content-box`?

Kamdan-kam: masalan, kontent maydoni aniq o‘lchamda bo‘lishi kerak bo‘lsa (rasm atrofidagi ramka). Bunday joyda faqat shu elementga `content-box` qaytariladi.

```tekshir
`box-sizing: border-box` bo‘lsa, `width: 200px` nimani o‘lchaydi?
- faqat kontentni
+ kontent, padding va chegarani birga
- margin bilan birga hammasini
> `border-box` da padding va chegara kenglik ichida hisoblanadi; margin kirmaydi.
```

```jonli
<style>
  div { width: 200px; padding: 20px; border: 5px solid navy; margin: 6px 0; background: #cde; }
</style>
<div style="box-sizing: content-box">content-box: 250px</div>
<div style="box-sizing: border-box">border-box: 200px</div>
```

## Xulosa

- `content-box`: kenglik + padding + chegara.
- `border-box`: kenglik ichida hammasi — hisoblash oson.
- Loyiha boshida `*, *::before, *::after { box-sizing: border-box; }`.
