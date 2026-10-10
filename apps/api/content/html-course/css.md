## CSS nima?

**CSS** (Cascading Style Sheets) — sahifa ko‘rinishini tasvirlovchi til: ranglar, shriftlar, oraliqlar, joylashuv, animatsiyalar. HTML “nima”ni, CSS esa “qanday ko‘rinishi”ni aytadi.

## CSS’ni ulashning uch usuli

### 1. Inline — `style` atributi

```html
<h1 style="color: teal;">Sarlavha</h1>
```

Faqat bitta element uchun. Tez, lekin takrorlanadi.

### 2. Ichki — `<style>` tegi

`<head>` ichida yoziladi va butun sahifaga ta’sir qiladi:

```html
<head>
  <style>
    body {
      font-family: sans-serif;
      background-color: #f5faff;
    }
    h1 {
      color: #0071dc;
    }
    p {
      line-height: 1.6;
    }
  </style>
</head>
```

### 3. Tashqi — alohida `.css` fayl

Eng to‘g‘ri usul: uslublar alohida faylda, HTML esa uni `<link>` orqali ulaydi:

```html
<head>
  <link rel="stylesheet" href="css/style.css">
</head>
```

`css/style.css`:

```css
body {
  font-family: sans-serif;
  margin: 0;
}

h1 {
  color: #0071dc;
}
```

Bitta CSS fayl yuzlab sahifaga ulanishi mumkin — dizaynni bir joyda o‘zgartirasiz.

## CSS qoidasining tuzilishi

```css
h1 {
  color: navy;
  font-size: 32px;
}
```

- `h1` — **selektor**: qaysi elementlarga ta’sir qilishi;
- `color` — **xususiyat**, `navy` — **qiymat**;
- har bir juftlik `;` bilan tugaydi.

## Ko‘p ishlatiladigan xususiyatlar

| Xususiyat                   | Vazifasi                                 |
| --------------------------- | ---------------------------------------- |
| `color`, `background-color` | Matn va fon rangi                        |
| `font-family`, `font-size`  | Shrift va o‘lcham                        |
| `border`                    | Chegara: `border: 1px solid #ccc;`       |
| `padding`                   | Ichki oraliq (chegara va mazmun orasida) |
| `margin`                    | Tashqi oraliq (element atrofida)         |

## Kaskad — qaysi uslub ustun?

Bir element uchun bir nechta qoida bo‘lsa, odatda **eng yaqini** ustun bo‘ladi: inline uslub ichki va tashqi uslubdan kuchliroq. Shu ma’noda CSS “kaskad” deb ataladi.

## Xulosa

- CSS ko‘rinish uchun javob beradi.
- Inline (`style`), ichki (`<style>`) va tashqi (`<link rel="stylesheet">`) usullar bor; eng yaxshisi — tashqi fayl.
- Qoida: `selektor { xususiyat: qiymat; }`.
