## HTML yozish uchun nima kerak?

HTML yozish uchun maxsus dastur shart emas: istalgan matn muharriri yetadi. Lekin dasturchilar uchun qulay muharrirlar ishni ancha tezlashtiradi.

## Mashhur muharrirlar

| Muharrir                    | Afzalligi                                         |
| --------------------------- | ------------------------------------------------- |
| **Visual Studio Code**      | Bepul, kengaytmalar ko‘p, Emmet o‘rnatilgan       |
| **Sublime Text**            | Juda tez ishlaydi                                 |
| **Notepad++** (Windows)     | Yengil va oddiy                                   |
| **WEBDIZAYN.UZ Playground** | O‘rnatish shart emas, brauzerning o‘zida ishlaydi |

Bu kursda siz asosan saytimizdagi o‘rnatilgan muharrirdan foydalanasiz: chap tomonda fayllar, o‘rtada kod, o‘ngda natija.

## Kompyuteringizda birinchi fayl

1. Muharrirni oching va yangi fayl yarating.
2. Quyidagi kodni yozing:

```html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <title>Salom</title>
  </head>
  <body>
    <h1>Salom, dunyo!</h1>
  </body>
</html>
```

3. Faylni `index.html` nomi bilan saqlang. Kengaytma `.html` bo‘lishi muhim.
4. Faylni ikki marta bosing — u brauzerda ochiladi.

## Nega `index.html`?

Veb-serverlar papka manzili so‘ralganda odatda `index.html` faylini avtomatik qaytaradi. Shu sababli bosh sahifa ko‘pincha aynan shunday nomlanadi.

## Kodirovka haqida

Faylni **UTF-8** kodirovkasida saqlang. Aks holda o‘zbekcha harflar (o‘, g‘, sh) noto‘g‘ri ko‘rinishi mumkin. Zamonaviy muharrirlar odatda UTF-8’ni o‘zi tanlaydi, `<meta charset="utf-8">` esa brauzerga buni aytib qo‘yadi.

## Foydali odatlar

- Ichma-ich teglarni **chekinish** (indent) bilan yozing — kod o‘qilishi osonlashadi.
- Fayl va papka nomlarida bo‘sh joy va o‘zbekcha harflardan qoching: `mening-sahifam.html` yaxshi, `Mening sahifam.html` yomon.
- O‘zgarishdan keyin brauzerda sahifani yangilang (F5).

## Xulosa

- HTML har qanday matn muharririda yoziladi, lekin VS Code kabi muharrirlar qulayroq.
- Fayl `.html` kengaytmasi va UTF-8 kodirovkasi bilan saqlanadi.
- Bosh sahifa odatda `index.html` deb nomlanadi.
