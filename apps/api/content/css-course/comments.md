## CSS izohlari

Izoh — brauzer e’tiborsiz qoldiradigan matn. U kodni tushuntirish yoki qoidani vaqtincha o‘chirish uchun yoziladi.

CSS’da izoh `/*` bilan boshlanadi va `*/` bilan tugaydi:

```css
/* Asosiy rang — sayt logotipidan olingan */
h1 {
  color: #0071dc;
}
```

## Qator oxirida izoh

```css
p {
  line-height: 1.6; /* o‘qish oson bo‘lishi uchun */
}
```

## Ko‘p qatorli izoh

```css
/*
  Tugmalar uslubi
  -----------------
  Asosiy tugma ko‘k, ikkinchi darajali tugma esa
  oq fonli va ko‘k chegarali.
*/
.tugma {
  padding: 10px 20px;
}
```

## Qoidani vaqtincha o‘chirish

Xatoni qidirayotganda qoidani o‘chirmasdan, izoh ichiga olish qulay:

```css
.karta {
  background-color: white;
  /* box-shadow: 0 4px 12px rgb(0 0 0 / 0.1); */
}
```

## Izohlar bilan bo‘limlarga ajratish

Katta CSS fayllarni izohlar yordamida tartibga solish odatiy amaliyot:

```css
/* ===== Umumiy ===== */
body { margin: 0; }

/* ===== Sarlavha (header) ===== */
.header { padding: 16px; }

/* ===== Pastki qism (footer) ===== */
.footer { font-size: 14px; }
```

## Ehtiyot bo‘ling

- CSS’da `//` bilan boshlanadigan bir qatorli izoh **yo‘q**. U qoidani buzadi:

```css
/* Xato! */
p {
  // color: red;
  font-size: 18px;
}
```

- Izohlar ichma-ich yozilmaydi: birinchi `*/` izohni tugatadi.
- HTML izohi `<!-- -->` CSS ichida ishlamaydi.

## Xulosa

- CSS izohi: `/* ... */`, bir yoki ko‘p qatorli.
- `//` CSS’da izoh emas.
- Izohlar bilan qoidani vaqtincha o‘chirish va faylni bo‘limlarga ajratish qulay.
