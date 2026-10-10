## Forma nima uchun kerak?

**Forma** foydalanuvchidan ma’lumot olish uchun: ro‘yxatdan o‘tish, qidiruv, buyurtma, so‘rovnoma. Forma `<form>` elementi ichida quriladi va ma’lumotni serverga yuboradi.

```html
<form action="/royxatdan-otish" method="post">
  <label for="ism">Ismingiz</label>
  <input type="text" id="ism" name="ism">

  <label for="email">Email</label>
  <input type="email" id="email" name="email">

  <button type="submit">Yuborish</button>
</form>
```

## Asosiy qismlar

| Element                  | Vazifasi                        |
| ------------------------ | ------------------------------- |
| `<form>`                 | Barcha maydonlarni o‘rab turadi |
| `<label>`                | Maydon nomi (yorlig‘i)          |
| `<input>`                | Kiritish maydoni                |
| `<button type="submit">` | Formani yuborish tugmasi        |

## `<label>` — har doim kerak

`label` ning `for` atributi `input` ning `id`siga teng bo‘lsa:

- yorliq bosilganda maydon faollashadi (kichik checkbox’larni bosish osonlashadi);
- ekran o‘qiydigan dastur maydon nima uchunligini aytadi.

## `name` atributi

Serverga ma’lumot `name=qiymat` juftliklari ko‘rinishida yuboriladi. `name` bo‘lmagan maydon **yuborilmaydi**:

```text
ism=Aziza&email=aziza%40example.uz
```

## Ko‘p ishlatiladigan `input` turlari

```html
<input type="text" name="shahar">
<input type="password" name="parol">
<input type="email" name="email">

<input type="radio" id="erkak" name="jins" value="erkak">
<label for="erkak">Erkak</label>
<input type="radio" id="ayol" name="jins" value="ayol">
<label for="ayol">Ayol</label>

<input type="checkbox" id="rozilik" name="rozilik">
<label for="rozilik">Shartlarga roziman</label>
```

Bir guruhdagi `radio` tugmalarining `name`i bir xil bo‘ladi — shunda faqat bittasini tanlash mumkin.

## Forma yuborilganda nima bo‘ladi?

Brauzer `action` dagi manzilga ma’lumotni jo‘natadi. Uni server tomonidagi dastur (PHP, Node.js, Python va boshqalar) qabul qilib, qayta ishlaydi. HTML faqat formaning “yuzi”.

> **Eslatma:** Platformamizdagi xavfsiz muharrir formani haqiqatda hech qayerga yubormaydi. Mashqlarda forma tuzilishi tekshiriladi.

## Xulosa

- Forma: `<form>` + `<label>` + `<input>` + yuborish tugmasi.
- `label for` va `input id` bir xil bo‘lsin; har bir maydonga `name` bering.
- `radio` guruhida `name` bir xil bo‘ladi.
