## Emoji — bu ham belgi

Emoji’lar rasm emas, **Unicode belgilari**. Shuning uchun ular matn kabi yoziladi, nusxa olinadi va CSS bilan kattalashtiriladi.

```html
<p>Bugun kayfiyatim zo‘r 😀</p>
```

## UTF-8 sharti

Emoji to‘g‘ri ko‘rinishi uchun sahifa UTF-8 kodirovkasida bo‘lishi kerak:

```html
<meta charset="utf-8">
```

## Kod bilan yozish

Har bir emoji’ning o‘z Unicode raqami bor. Uni o‘nlik yoki o‘n oltilik entity bilan yozish mumkin:

| Emoji | O‘nlik      | O‘n oltilik |
| ----- | ----------- | ----------- |
| 😀    | `&#128512;` | `&#x1F600;` |
| 📚    | `&#128218;` | `&#x1F4DA;` |
| ✅    | `&#9989;`   | `&#x2705;`  |
| 🚀    | `&#128640;` | `&#x1F680;` |

```html
<p>&#x1F4DA; Kutubxona &#x1F680; Tez yetkazib berish</p>
```

## Emoji o‘lchami

Emoji matn bo‘lgani uchun `font-size` bilan kattalashtiriladi:

```html
<p style="font-size: 48px;">🍉</p>
```

## Qulaylik haqida

Ekran o‘qiydigan dasturlar emoji’ni so‘z bilan o‘qiydi (masalan, “kulib turgan yuz”). Shuning uchun:

- muhim ma’lumotni faqat emoji bilan bermang: “✅” o‘rniga “✅ Bajarildi”;
- matnni emoji bilan to‘ldirib yubormang — tinglash zerikarli bo‘ladi.

Bezak uchun ishlatilgan emoji’ni yashirish mumkin:

```html
<span aria-hidden="true">🎉</span> Tabriklaymiz!
```

## Xulosa

- Emoji — Unicode belgisi, UTF-8 sahifada to‘g‘ridan-to‘g‘ri yoziladi.
- `&#x1F600;` kabi kod bilan ham yozish mumkin.
- O‘lcham `font-size` bilan; muhim ma’lumotni matn bilan ham ifodalang.
