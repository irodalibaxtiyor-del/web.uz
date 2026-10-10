## Favicon nima?

**Favicon** — brauzer tabida sahifa nomi yonida chiqadigan kichkina belgi. U saytni ko‘plab ochiq tablar orasidan tez topishga yordam beradi va brendning bir qismi hisoblanadi.

## Favicon qo‘shish

1. Kvadrat shakldagi kichik rasm tayyorlang (masalan, 32×32 yoki 48×48 piksel).
2. Uni saytning ildiz papkasiga yoki `images` papkasiga joylang.
3. `<head>` ichiga `<link rel="icon">` qo‘shing:

```html
<head>
  <meta charset="utf-8">
  <title>Mening saytim</title>
  <link rel="icon" href="favicon.ico">
</head>
```

## Formatlar

| Format | Misol                                                       |
| ------ | ----------------------------------------------------------- |
| ICO    | `<link rel="icon" href="favicon.ico">`                      |
| PNG    | `<link rel="icon" type="image/png" href="favicon-32.png">`  |
| SVG    | `<link rel="icon" type="image/svg+xml" href="favicon.svg">` |

SVG favicon har qanday o‘lchamda tiniq ko‘rinadi va zamonaviy brauzerlarning ko‘pchiligi uni qo‘llab-quvvatlaydi.

## Telefonlar uchun belgi

iPhone va iPad’da sayt bosh ekranga qo‘shilganda alohida, kattaroq belgi ishlatiladi:

```html
<link rel="apple-touch-icon" href="apple-touch-icon.png">
```

Odatda 180×180 pikselli PNG tayyorlanadi.

## Maslahatlar

- Favicon oddiy bo‘lsin: kichik o‘lchamda mayda detallar ko‘rinmaydi. Ko‘pincha logotipning bosh harfi yoki belgisi ishlatiladi.
- Favicon brauzer keshida saqlanadi. Uni almashtirganingizdan keyin ham eskisi ko‘rinsa, sahifani Ctrl + F5 bilan yangilang.

## Xulosa

- Favicon `<head>` ichida `<link rel="icon" href="...">` bilan ulanadi.
- ICO, PNG yoki SVG formatida bo‘lishi mumkin.
- Mobil qurilmalar uchun `apple-touch-icon` qo‘shish mumkin.
