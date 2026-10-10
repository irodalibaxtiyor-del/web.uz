## `<head>` — sahifa haqida ma’lumot

`<head>` elementi `<html>` ichida, `<body>` dan oldin turadi. Undagi ma’lumotlar ekranda ko‘rinmaydi, lekin brauzer, qidiruv tizimlari va ijtimoiy tarmoqlar uchun juda muhim.

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dizayn kurslari | WEBDIZAYN.UZ</title>
  <meta name="description" content="Veb-dizaynni o‘zbek tilida noldan o‘rganing.">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="favicon.svg">
  <script src="js/app.js" defer></script>
</head>
```

## `<head>` ichidagi elementlar

| Element    | Vazifasi                                                      |
| ---------- | ------------------------------------------------------------- |
| `<title>`  | Sahifa nomi (majburiy)                                        |
| `<meta>`   | Turli metama’lumotlar                                         |
| `<link>`   | Tashqi resurslar: CSS, favicon                                |
| `<style>`  | Sahifa ichidagi CSS                                           |
| `<script>` | JavaScript                                                    |
| `<base>`   | Barcha nisbiy havolalar uchun asosiy manzil (kam ishlatiladi) |

## Muhim `<meta>` teglari

### Kodirovka

```html
<meta charset="utf-8">
```

`<head>` dagi birinchi elementlardan biri bo‘lsin.

### Viewport — mobil qurilmalar uchun

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Busiz telefon sahifani kichraytirilgan kompyuter ko‘rinishida ko‘rsatadi. Har bir zamonaviy sahifada bo‘lishi shart.

### Tavsif

```html
<meta name="description" content="Sahifaning 1–2 gaplik qisqa mazmuni">
```

Qidiruv tizimlari ko‘pincha shu matnni natijalarda sarlavha ostida ko‘rsatadi.

### Muallif

```html
<meta name="author" content="Dilnoza Rahimova">
```

## Ijtimoiy tarmoqlar uchun

Havola Telegram yoki Facebook’da ulashilganda chiqadigan kartochka uchun Open Graph teglari ishlatiladi:

```html
<meta property="og:title" content="HTML kursi">
<meta property="og:description" content="60 ta amaliy dars">
<meta property="og:image" content="https://example.uz/preview.png">
```

## Xulosa

- `<head>` — ko‘rinmaydigan, lekin muhim metama’lumotlar joyi.
- `charset`, `viewport`, `<title>`, `description` — har bir sahifada bo‘lishi kerak.
- CSS, favicon va skriptlar ham `<head>` orqali ulanadi.
