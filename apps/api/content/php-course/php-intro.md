## PHP nima?

**PHP** — serverda ishlaydigan dasturlash tili. U veb-sahifalarni **serverda yaratadi**: ma’lumotlar bazasidan yangiliklarni oladi, formani qabul qiladi, foydalanuvchini tizimga kiritadi — va brauzerga tayyor HTML yuboradi.

Internetdagi saytlarning katta qismi PHP’da ishlaydi: WordPress, Wikipedia, Laravel’dagi minglab loyihalar.

## JavaScript’dan farqi

Siz JavaScript kursida brauzerda ishlaydigan kodni o‘rgandingiz. PHP boshqa joyda ishlaydi:

| | JavaScript (brauzerda) | PHP (serverda) |
| --- | --- | --- |
| Qayerda bajariladi | Foydalanuvchi kompyuterida | Sayt serverida |
| Kodni kim ko‘radi | Har kim (“Sahifa kodi”) | Hech kim — faqat natija keladi |
| Nima qila oladi | Sahifani jonlantirish, tugmalar, animatsiya | Bazaga yozish, fayl saqlash, parolni tekshirish |
| Maxfiy ma’lumot | Saqlab bo‘lmaydi | Saqlash mumkin (parollar, kalitlar) |

Ikkalasi birga ishlaydi: PHP sahifani tayyorlaydi, JavaScript uni brauzerda jonlantiradi.

## So‘rov qanday ishlaydi

1. Brauzer `https://sayt.uz/yangiliklar.php` ni so‘raydi.
2. Server PHP faylni **bajaradi**: bazadan yangiliklarni o‘qiydi va HTML yasaydi.
3. Brauzerga faqat **natija** — oddiy HTML boradi. PHP kodining o‘zi hech qachon foydalanuvchiga ko‘rinmaydi.

```php
<!DOCTYPE html>
<html lang="uz">
<body>
  <h1>Salom!</h1>
  <p>Bugun: <?php echo date('d.m.Y'); ?></p>
</body>
</html>
```

Brauzer olgan HTML:

```html
<p>Bugun: 13.10.2026</p>
```

`<?php ... ?>` ichidagi kod serverda bajarilib, o‘rniga natija qo‘yildi.

## PHP nimalar qila oladi

- dinamik sahifa yaratish (har foydalanuvchiga o‘z ma’lumoti);
- formalarni qabul qilish va tekshirish;
- fayllarni o‘qish, yozish, yuklash;
- cookie va sessiyalar bilan foydalanuvchini “eslab qolish”;
- ma’lumotlar bazasi bilan ishlash (MySQL, PostgreSQL, SQLite);
- JSON API yaratish — mobil ilovalar va JavaScript uchun.

## Versiyalar

Bu kurs **PHP 8** ga mo‘ljallangan. PHP 8 da `match`, `enum`, nomlangan argumentlar, qat’iy tiplar kabi zamonaviy imkoniyatlar bor. Internetda PHP 5 davridagi eski misollar ko‘p uchraydi — ulardagi `mysql_*` funksiyalari olib tashlangan, ularni ishlatmang.

## Bu kursda qanday o‘qiysiz

PHP serverda ishlaydi, shuning uchun bu kursda kod platformaning o‘zida bajarilmaydi. Har dars:

1. **Tushuntirish va misollar** — diqqat bilan o‘qing, misollarni o‘zingiz yozib ko‘ring.
2. **Mustaqil mashq** — kompyuteringizda bajarasiz (keyingi darsda PHP’ni o‘rnatamiz). Kutilgan natija darsda yozilgan — o‘zingizni tekshiring.
3. **Test** — ko‘pincha “bu kod nimani chiqaradi?” savollari. Keyingi dars test o‘tilgandan keyin ochiladi.

> Kodni “boshda bajarish” — dasturchining eng muhim ko‘nikmasi. Testdagi kodni avval o‘zingiz hisoblang, keyin kompyuterda tekshiring.

## Mustaqil mashq

Hozircha kod yozmaymiz. O‘zingiz uchun javob yozing:

1. Siz biladigan uchta saytda PHP qayerda ishlashi mumkin (masalan: kirish, qidiruv, buyurtma)?
2. Nega parolni tekshirish JavaScript’da emas, serverda bo‘lishi kerak?

**Kutilgan fikr:** brauzerdagi kodni foydalanuvchi ko‘radi va o‘zgartira oladi, server kodi esa unga ko‘rinmaydi va undan himoyalangan.
