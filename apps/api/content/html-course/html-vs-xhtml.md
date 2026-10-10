## XHTML nima?

**XHTML** — HTML’ning XML qoidalari asosida qayta yozilgan, qat’iyroq varianti. U 2000-yillar boshida mashhur bo‘lgan. Bugun deyarli barcha saytlar HTML5 ishlatadi, lekin XHTML qoidalarini bilish eski loyihalarni tushunish va toza kod yozish odati uchun foydali.

## Asosiy farqlar

| Qoida             | HTML5                           | XHTML                                   |
| ----------------- | ------------------------------- | --------------------------------------- |
| Registr           | Farqi yo‘q                      | Faqat kichik harflar                    |
| Elementni yopish  | Ba’zilarini yopmasa ham bo‘ladi | Har doim yopilishi shart                |
| Bo‘sh elementlar  | `<br>`                          | `<br />`                                |
| Atribut qiymati   | Tirnoqsiz ham ishlaydi          | Har doim tirnoqda                       |
| Qiymatsiz atribut | `<input disabled>`              | `<input disabled="disabled" />`         |
| Xatoga munosabat  | Brauzer “tuzatib” ko‘rsatadi    | Xato bo‘lsa sahifa ko‘rinmasligi mumkin |

## Misol

HTML5:

```html
<p>Birinchi qator<br>ikkinchi qator</p>
<input type="checkbox" checked>
<img src="logo.png" alt="Logo">
```

XHTML:

```html
<p>Birinchi qator<br />ikkinchi qator</p>
<input type="checkbox" checked="checked" />
<img src="logo.png" alt="Logo" />
```

## XHTML hujjati

```html
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="uz">
  <head>
    <title>XHTML sahifa</title>
  </head>
  <body>
    <p>Salom</p>
  </body>
</html>
```

## Bugungi tavsiya

HTML5 ishlating, lekin XHTML’dan foydali odatlarni saqlang:

- teglarni kichik harflar bilan yozing;
- elementlarni yoping;
- atribut qiymatlarini tirnoqqa oling.

Bu odatlar “Uslub qo‘llanmasi” darsidagi tavsiyalar bilan bir xil.

## Xulosa

- XHTML — HTML’ning qat’iy, XML’ga asoslangan varianti.
- Asosiy farqlar: majburiy yopish, kichik harflar, tirnoqlar, `<br />` ko‘rinishi.
- Bugun HTML5 standart, lekin XHTML odatlari kodni tozaroq qiladi.
