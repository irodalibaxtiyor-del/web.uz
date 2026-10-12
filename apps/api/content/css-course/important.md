## `!important`

`!important` qiymatni oddiy qoidalarning barchasidan — hatto ID va inline uslubdan ham — kuchliroq qiladi:

```css
.yashirin {
  display: none !important;
}
```

Endi `.yashirin` klassi berilgan element boshqa qaysi qoida bo‘lishidan qat’i nazar ko‘rinmaydi.

## Nega ehtiyot bo‘lish kerak?

`!important` maxsuslik qoidalarini buzadi. Uni yengish uchun yana `!important` va kuchliroq selektor kerak bo‘ladi:

```css
.tugma {
  color: white !important;
}

/* Keyinroq kimdir buni o‘zgartirmoqchi: */
.karta .tugma {
  color: #0e1133; /* ishlamaydi */
}

.karta .tugma {
  color: #0e1133 !important; /* faqat shunday */
}
```

Natijada CSS “kim kuchliroq” urushiga aylanadi va uni tushunish qiyinlashadi.

## Muammoni to‘g‘ri hal qilish

Qoida ishlamasa, `!important` yozishdan oldin sababini toping:

| Sabab                                | Yechim                                       |
| ------------------------------------ | -------------------------------------------- |
| Boshqa selektor kuchliroq            | Selektoringizni moslang yoki uni soddalashtiring |
| Qoida keyinroq yozilgan              | Tartibni o‘zgartiring                        |
| ID orqali uslub berilgan             | ID’ni klassga almashtiring                   |
| Xususiyat nomida xato               | Xatoni tuzating                              |

## Qachon `!important` o‘rinli?

- **Yordamchi klasslar**, ular doim ishlashi kerak: `.yashirin`, `.sr-only`.
- **Tashqi kodni** (o‘zgartirib bo‘lmaydigan kutubxona uslubini) yengish — oxirgi chora sifatida.
- **Foydalanuvchi sozlamalari**: masalan, `prefers-reduced-motion` da animatsiyalarni o‘chirish.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Kaskad qatlamlari: `@layer`

Zamonaviy CSS’da kod qismlarining ustuvorligini `!important` siz boshqarish uchun `@layer` bor:

```css
@layer asos, komponentlar;

@layer asos {
  a { color: blue; }
}

@layer komponentlar {
  .tugma { color: white; }
}
```

Keyin e’lon qilingan qatlam ustun turadi — selektor maxsusligidan qat’i nazar. Katta loyihalarda bu `!important` ga bo‘lgan ehtiyojni ancha kamaytiradi.

## Xulosa

- `!important` hamma oddiy qoidalardan kuchli.
- Uni muammoni yashirish uchun emas, yordamchi klasslar uchun ishlating.
- Avval sababni toping: maxsuslik, tartib yoki xato.
