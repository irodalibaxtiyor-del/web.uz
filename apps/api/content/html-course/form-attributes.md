## `<form>` atributlari

Forma qayerga, qanday usulda va qanday yuborilishini atributlar belgilaydi.

## `action` — qayerga

```html
<form action="/izlash">
```

Forma ma’lumoti yuboriladigan manzil. Bo‘lmasa, joriy sahifaga yuboriladi.

## `method` — qanday usulda

| Usul             | Qanday ishlaydi                       | Qachon                                                        |
| ---------------- | ------------------------------------- | ------------------------------------------------------------- |
| `get` (standart) | Ma’lumot URL’ga qo‘shiladi: `?q=html` | Qidiruv, filtr — xatcho‘pga saqlasa bo‘ladigan so‘rovlar      |
| `post`           | Ma’lumot so‘rov tanasida yuboriladi   | Ro‘yxatdan o‘tish, to‘lov, parol — maxfiy yoki katta ma’lumot |

```html
<form action="/izlash" method="get">
  <input type="search" name="q">
  <button>Qidirish</button>
</form>
<!-- Natija: /izlash?q=html -->
```

> Parolni hech qachon `get` bilan yubormang: u brauzer tarixida va server loglarida qolib ketadi.

## `target` — natija qayerda ochiladi

```html
<form action="/hisobot" target="_blank">
```

`_self` (standart) yoki `_blank` (yangi tab).

## `autocomplete`

Brauzer avval kiritilgan qiymatlarni taklif qilishi:

```html
<form autocomplete="on">
  <input type="email" name="email" autocomplete="email">
  <input type="text" name="kod" autocomplete="off">
</form>
```

## `novalidate`

Brauzerning o‘rnatilgan tekshiruvini (masalan, `required`) o‘chiradi. Odatda o‘z JavaScript tekshiruvingiz bo‘lganda ishlatiladi:

```html
<form novalidate>
```

## `enctype` — fayl yuborish uchun

Formada fayl yuklash maydoni bo‘lsa, `post` va maxsus kodlash kerak:

```html
<form action="/yuklash" method="post" enctype="multipart/form-data">
  <input type="file" name="rezyume">
  <button>Yuklash</button>
</form>
```

## `name`

Formaga nom berish (JavaScript’da murojaat uchun):

```html
<form name="royxat">
```

## Xulosa

- `action` — qayerga, `method` — `get` yoki `post`.
- Maxfiy ma’lumot uchun `post`, qidiruv uchun `get`.
- Fayl yuborishda `enctype="multipart/form-data"` kerak.
