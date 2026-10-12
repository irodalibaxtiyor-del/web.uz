## CSS o‘zgaruvchilari

Bir xil rang yoki o‘lcham CSS’da o‘nlab joyda takrorlanadi. Uni o‘zgartirish kerak bo‘lsa, hamma joyni topib chiqish kerak. CSS o‘zgaruvchilari (custom properties) bu muammoni hal qiladi.

## E’lon qilish va ishlatish

```css
:root {
  --rang-asosiy: #0071dc;
  --rang-matn: #0e1133;
  --radius: 8px;
}

.tugma {
  background-color: var(--rang-asosiy);
  border-radius: var(--radius);
}

a {
  color: var(--rang-asosiy);
}
```

- Nom `--` bilan boshlanadi va katta-kichik harfni farqlaydi.
- `:root` — sahifaning ildizi (`html`); u yerda e’lon qilingan o‘zgaruvchi hamma joyda ishlaydi.
- Qiymat `var(--nom)` bilan olinadi.

## Zaxira qiymat

```css
color: var(--rang-urgu, crimson);
```

`--rang-urgu` e’lon qilinmagan bo‘lsa, `crimson` ishlatiladi.

## Meros va qayta e’lon qilish

O‘zgaruvchilar oddiy xususiyatlar kabi meros bo‘ladi va istalgan elementda qayta e’lon qilinishi mumkin:

```css
.tugma {
  background-color: var(--tugma-fon, var(--rang-asosiy));
}

.xavfli {
  --tugma-fon: crimson;
}
```

`.xavfli` ichidagi tugmalar qizil bo‘ladi — tugma kodiga tegmasdan.

## Qorong‘i rejim

O‘zgaruvchilarning eng mashhur ishlatilishi:

```css
:root {
  --fon: white;
  --matn: #0e1133;
}

@media (prefers-color-scheme: dark) {
  :root {
    --fon: #0b1020;
    --matn: #e5e7eb;
  }
}

body {
  background-color: var(--fon);
  color: var(--matn);
}
```

Butun mavzu bir joyda almashtiriladi.

## Hisob-kitob bilan

```css
:root {
  --qadam: 8px;
}

.karta {
  padding: calc(var(--qadam) * 2);  /* 16px */
  margin-bottom: calc(var(--qadam) * 3);  /* 24px */
}
```

## JavaScript bilan

```js
document.documentElement.style.setProperty('--rang-asosiy', '#16a34a');
```

JavaScript bitta o‘zgaruvchini o‘zgartirsa, uni ishlatgan barcha elementlar yangilanadi.

## Xatolarga e’tibor

O‘zgaruvchida noto‘g‘ri qiymat bo‘lsa (masalan, rang kerak joyda `20px`), brauzer xato bermaydi — xususiyat standart qiymatiga qaytadi. Bunday xatolarni DevTools’da qidiring.

## Xulosa

- `--nom: qiymat` e’lon qiladi, `var(--nom, zaxira)` ishlatadi.
- `:root` dagi o‘zgaruvchilar global, ichki elementlarda qayta e’lon qilish mumkin.
- Mavzular (qorong‘i rejim) va dizayn tizimlari uchun asosiy vosita.
