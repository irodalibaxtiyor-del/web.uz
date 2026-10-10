## CSS nima?

**CSS** (Cascading Style Sheets — “pog‘onali uslublar jadvali”) sahifaning **ko‘rinishini** belgilaydi: ranglar, shriftlar, o‘lchamlar, bo‘shliqlar va elementlarning joylashuvi.

HTML’ni uyning skeleti desak, CSS — uning bo‘yog‘i, mebeli va bezagi. Bir xil HTML’ga turli CSS yozib, butunlay boshqacha ko‘rinishdagi sahifalar olish mumkin.

## Nima uchun alohida til?

Dastlabki saytlarda bezak HTML ichida yozilardi: har bir sarlavhaga rang, har bir jadvalga chegara alohida berilardi. Sayt kattalashgani sari bunday kodni o‘zgartirish juda qiyinlashdi.

CSS bu muammoni hal qiladi:

- **bitta qoida — ko‘p element.** Masalan, “barcha sarlavhalar ko‘k bo‘lsin” deb bir marta yozasiz;
- **bitta fayl — butun sayt.** Yuzlab sahifa bitta `style.css` faylidan foydalanadi. Rangni o‘zgartirish uchun faqat shu faylni tahrirlaysiz;
- **mazmun va ko‘rinish ajratiladi.** HTML nimani ko‘rsatishni, CSS esa qanday ko‘rsatishni hal qiladi.

## Birinchi misol

```html
<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8">
    <title>CSS bilan tanishuv</title>
    <style>
      body {
        background-color: #f5faff;
        font-family: sans-serif;
      }
      h1 {
        color: #0071dc;
        text-align: center;
      }
      p {
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <h1>Salom, CSS!</h1>
    <p>Bu paragraf 18 piksellik shriftda yozilgan.</p>
  </body>
</html>
```

Natijada sahifa foni och ko‘k, sarlavha ko‘k rangda va markazda, paragraf esa kattaroq shriftda ko‘rinadi.

## “Kaskad” nimani anglatadi?

Bitta elementga bir nechta qoida tegishli bo‘lishi mumkin: brauzerning standart uslubi, sizning faylingiz, elementning o‘z `style` atributi. Brauzer ularni ma’lum tartibda “pog‘onama-pog‘ona” birlashtiradi — shuning uchun til **kaskadli** deb ataladi. Qaysi qoida ustun kelishini keyingi darslarda batafsil o‘rganamiz.

> **Eslatma:** CSS dasturlash tili emas. U shartlar va sikllar bilan ishlamaydi — faqat “qaysi elementga qanday ko‘rinish” degan qoidalardan iborat.

## Xulosa

- CSS sahifaning ko‘rinishini belgilaydi, HTML esa mazmunini.
- Bitta CSS qoidasi ko‘p elementga, bitta CSS fayli butun saytga ta’sir qiladi.
- “Kaskad” — bir nechta qoidaning ma’lum tartibda birlashishi.
