## URL nima?

**URL** (Uniform Resource Locator) — internetdagi resurs manzili:

```text
https://www.example.uz:443/kurslar/html.html?dars=3#mashq
```

| Qism     | Qiymat               | Ma’nosi                 |
| -------- | -------------------- | ----------------------- |
| Sxema    | `https`              | Protokol (xavfsiz HTTP) |
| Domen    | `www.example.uz`     | Sayt manzili            |
| Port     | `443`                | Odatda yozilmaydi       |
| Yo‘l     | `/kurslar/html.html` | Sahifa joylashuvi       |
| So‘rov   | `?dars=3`            | Qo‘shimcha parametrlar  |
| Fragment | `#mashq`             | Sahifa ichidagi bo‘lim  |

## URL kodlash nima uchun kerak?

URL’da faqat cheklangan belgilar ishlatilishi mumkin: lotin harflari, raqamlar va `- _ . ~` kabi bir nechta belgi. Bo‘sh joy, o‘zbekcha harflar va maxsus belgilar **kodlanadi**: `%` va ikki o‘n oltilik raqam bilan.

| Belgi        | Kodlangan              |
| ------------ | ---------------------- |
| bo‘sh joy    | `%20` (formalarda `+`) |
| `&`          | `%26`                  |
| `?`          | `%3F`                  |
| `/`          | `%2F`                  |
| `ʻ` (U+02BB) | `%CA%BB`               |

Masalan, “qidiruv natijalari” so‘zlari URL’da shunday bo‘ladi:

```text
https://example.uz/search?q=qidiruv%20natijalari
```

## Brauzer o‘zi kodlaydi

Formadan yuborilgan ma’lumotni brauzer avtomatik kodlaydi. Shuning uchun ko‘p hollarda qo‘lda kodlash shart emas. Lekin havolani qo‘lda yozganda bo‘sh joy va maxsus belgilardan qoching:

```html
<!-- Yomon -->
<a href="mening sahifam.html">...</a>

<!-- Yaxshi -->
<a href="mening-sahifam.html">...</a>
```

## JavaScript’da kodlash

```js
encodeURIComponent('HTML & CSS'); // "HTML%20%26%20CSS"
decodeURIComponent('HTML%20%26%20CSS'); // "HTML & CSS"
```

## Xulosa

- URL qismlari: sxema, domen, yo‘l, so‘rov (`?`) va fragment (`#`).
- Ruxsat etilmagan belgilar `%XX` ko‘rinishida kodlanadi; bo‘sh joy — `%20`.
- Fayl nomlarida bo‘sh joy va maxsus belgilardan qoching.
