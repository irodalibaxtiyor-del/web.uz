## HTML nima?

**HTML** (HyperText Markup Language — gipermatn belgilash tili) har qanday veb-sahifaning skeletidir. Brauzerda ko‘rgan sarlavha, matn, rasm, havola va tugmalarning barchasi HTML yordamida tasvirlanadi.

HTML dasturlash tili emas. U **belgilash** tili: siz matnning qaysi qismi sarlavha, qaysi qismi paragraf, qayeri havola ekanini **teglar** bilan belgilab berasiz, brauzer esa shunga qarab sahifani chizadi.

## Veb-sahifa uchta qatlamdan iborat

| Qatlam     | Vazifasi          | Misol                                   |
| ---------- | ----------------- | --------------------------------------- |
| HTML       | Tuzilma va mazmun | sarlavha, ro‘yxat, forma                |
| CSS        | Ko‘rinish         | rang, shrift, joylashuv                 |
| JavaScript | Xatti-harakat     | tugma bosilganda nimadir sodir bo‘lishi |

Bu kursda asosiy e’tibor HTML’ga qaratiladi. CSS va JavaScript esa kerakli joylarda qisqa tanishtiriladi.

## Eng kichik HTML hujjat

```html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <title>Mening sahifam</title>
  </head>
  <body>
    <h1>Assalomu alaykum!</h1>
    <p>Bu mening birinchi veb-sahifam.</p>
  </body>
</html>
```

Har bir qatorni qisqacha ko‘rib chiqamiz:

- `<!DOCTYPE html>` — brauzerga bu zamonaviy HTML hujjat ekanini bildiradi.
- `<html lang="uz">` — butun hujjatni o‘rab turadi; `lang` atributi sahifa tilini ko‘rsatadi.
- `<head>` — sahifa haqidagi ma’lumotlar (ekranda ko‘rinmaydi): kodirovka, sarlavha va boshqalar.
- `<title>` — brauzer tabida chiqadigan nom.
- `<body>` — foydalanuvchi ko‘radigan barcha narsa shu yerda.
- `<h1>` — asosiy sarlavha, `<p>` — paragraf.

## Brauzer HTML’ni qanday o‘qiydi?

Brauzer faylni yuqoridan pastga o‘qiydi, teglarni tahlil qiladi va ulardan **DOM** (Document Object Model) deb ataluvchi daraxt quradi. Ekranda teglarning o‘zi emas, ularning natijasi ko‘rinadi.

## HTML qisqacha tarixi

- 1991 — Tim Berners-Li birinchi HTML’ni taklif qildi.
- 1999 — HTML 4.01 keng tarqaldi.
- 2014 — HTML5 standarti chiqdi.
- Bugun HTML “jonli standart” sifatida WHATWG tomonidan doimiy yangilanib boriladi.

> **Eslatma:** Bu kursdagi har bir dars amaliy mashq bilan tugaydi. Mashqni server haqiqiy brauzerda tekshiradi va siz o‘tganingizdan keyin keyingi dars ochiladi.

## Xulosa

- HTML — sahifaning tuzilmasini tasvirlaydigan belgilash tili.
- Hujjat `<!DOCTYPE html>` bilan boshlanadi, mazmun esa `<body>` ichida bo‘ladi.
- HTML tuzilma, CSS ko‘rinish, JavaScript esa xatti-harakat uchun javob beradi.
