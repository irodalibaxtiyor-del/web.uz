## Bir sahifali sayt

Portfolio ko‘pincha bitta uzun sahifa: menyu havolalari bo‘limlarga olib boradi. Bunday saytda uchta kichik detal sifatni ancha oshiradi.

## 1. O‘tish havolasi (skip link)

Klaviatura foydalanuvchisi har bir sahifada avval menyudagi barcha havolalardan Tab bilan o‘tishi kerak. **O‘tish havolasi** bunga yechim: sahifadagi birinchi fokuslanadigan element bo‘lib, to‘g‘ridan-to‘g‘ri asosiy kontentga olib boradi.

```html
<a class="otish" href="#asosiy">Asosiy kontentga o‘tish</a>
…
<main id="asosiy">…</main>
```

```css
.otish {
  position: absolute;
  left: 16px;
  top: 8px;
  transform: translateY(-150%); /* ekrandan tashqarida */
}

.otish:focus {
  transform: none; /* Tab bosilganda ko‘rinadi */
}
```

Sichqoncha foydalanuvchisi uni hech qachon ko‘rmaydi, klaviatura foydalanuvchisi esa birinchi Tab’da ko‘radi.

## 2. Silliq aylantirish

```css
html {
  scroll-behavior: smooth;
}
```

Menyudagi havola bosilganda sahifa bo‘limga “sakramaydi”, silliq aylanadi — foydalanuvchi qayerga ketganini tushunadi. Harakatdan bezovta bo‘ladiganlar uchun:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

## 3. Yopishqoq header ostida qolmaslik

Keyingi modulda header ekran tepasiga yopishadi. Unda bo‘limga o‘tganda sarlavha header ostida qolib ketadi. Yechim:

```css
section {
  scroll-margin-top: 80px; /* header balandligi + biroz joy */
}
```

Brauzer bo‘limni ekran tepasidan 80px pastda to‘xtatadi.

## Manzil satri

`#ishlar` ga o‘tganda brauzer manzili `…/#ishlar` bo‘ladi. Bu havolani do‘stga yuborsangiz, u to‘g‘ridan-to‘g‘ri shu bo‘limni ochadi — bir sahifali saytning qulay tomoni.

## Bo‘limlar tartibi

Odatiy tartib: bosh ekran → ishlar → men haqimda → aloqa. Ishlarni “men haqimda” dan oldin qo‘yish ko‘pincha yaxshiroq: tashrif buyuruvchi aynan shu uchun kelgan.

Mashqda o‘tish havolasi, silliq aylantirish va `scroll-margin-top` ni qo‘shasiz.
