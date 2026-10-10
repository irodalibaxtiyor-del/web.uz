## `<title>` — sahifa nomi

`<title>` elementi `<head>` ichida yoziladi va bir nechta joyda ko‘rinadi:

- brauzer tabida;
- sahifa xatcho‘plarga (bookmark) qo‘shilganda;
- qidiruv tizimi natijalarida (ko‘k sarlavha);
- ijtimoiy tarmoqlarda havola ulashilganda (boshqa ma’lumot bo‘lmasa).

```html
<head>
  <meta charset="utf-8">
  <title>HTML kursi — 1-dars: Kirish | WEBDIZAYN.UZ</title>
</head>
```

## Yaxshi sarlavha qoidalari

1. **Har bir sahifada o‘z nomi bo‘lsin.** Hamma sahifada bir xil “Bosh sahifa” deb yozish xato.
2. **Aniq va qisqa.** Taxminan 50–60 belgigacha — qidiruv tizimi uzunroq nomni qisqartiradi.
3. **Muhim so‘z oldinda.** Avval sahifa mavzusi, keyin sayt nomi: `Narxlar | Mening do‘konim`.
4. **Faqat matn.** `<title>` ichida boshqa teglar ishlamaydi.

```html
<!-- Yomon -->
<title>Sahifa</title>

<!-- Yaxshi -->
<title>Toshkentdagi dizayn kurslari — narxlar va jadval | DesignHub</title>
```

## `<title>` va `<h1>` farqi

|                   | `<title>`               | `<h1>`            |
| ----------------- | ----------------------- | ----------------- |
| Joylashuvi        | `<head>`                | `<body>`          |
| Qayerda ko‘rinadi | Tab, qidiruv natijalari | Sahifaning o‘zida |
| Miqdori           | Faqat bitta             | Odatda bitta      |

Ikkalasi o‘xshash bo‘lishi mumkin, lekin bir xil bo‘lishi shart emas.

## Xulosa

- `<title>` `<head>` ichida bo‘ladi va har bir sahifada bo‘lishi kerak.
- U brauzer tabida va qidiruv natijalarida ko‘rinadi.
- Sarlavha aniq, qisqa va sahifaga xos bo‘lsin.
