## Birinchi kichik loyiha

Shu paytgacha o‘rganganlaringiz bilan to‘liq sahifa yasashingiz mumkin. Bu darsda bitta **shaxsiy sahifa** quramiz va bilimlarni bir joyga jamlaymiz.

## Reja

1. Sahifa tuzilmasi: `<!DOCTYPE>`, `<html lang>`, `<head>`, `<body>`.
2. Sarlavha va qisqa tanishtiruv.
3. Qiziqishlar ro‘yxati.
4. Rasm (`alt` bilan).
5. Aloqa havolasi.
6. Tashqi CSS fayl.

## Fayllar tuzilmasi

```text
loyiha/
├── index.html
└── css/
    └── style.css
```

## `index.html`

```html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <title>Sardor Aliyev — shaxsiy sahifa</title>
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <h1>Sardor Aliyev</h1>
    <p>Men veb-dizaynni o‘rganyapman va oddiy saytlar yasashni yaxshi ko‘raman.</p>

    <img src="images/sardor.jpg" alt="Sardor Aliyevning portreti" width="200" height="200">

    <h2>Qiziqishlarim</h2>
    <ul>
      <li>Veb-dizayn</li>
      <li>Fotografiya</li>
      <li>Shaxmat</li>
    </ul>

    <h2>Aloqa</h2>
    <p><a href="mailto:sardor@example.uz">sardor@example.uz</a> manziliga yozing.</p>
  </body>
</html>
```

## `css/style.css`

```css
body {
  font-family: sans-serif;
  max-width: 640px;
  margin: 40px auto;
  padding: 0 16px;
  color: #1f2937;
}

h1 {
  color: #0071dc;
}

img {
  border-radius: 50%;
}
```

## Tekshirish ro‘yxati

- [ ] Sahifada bitta `<h1>` bor.
- [ ] Rasmda mazmunli `alt` bor.
- [ ] Havola ishlaydi.
- [ ] CSS alohida faylda va `<link>` bilan ulangan.
- [ ] `<title>` sahifa mazmunini aks ettiradi.

Ushbu darsning mashqida xuddi shunday sahifani o‘zingiz haqingizda yasaysiz.

## Xulosa

Haqiqiy sahifa bir nechta oddiy elementlar birikmasidan iborat. Tuzilmani HTML’da to‘g‘ri yozib, ko‘rinishni CSS faylga chiqarsangiz, sahifani kengaytirish va o‘zgartirish oson bo‘ladi.
