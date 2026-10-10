## Plaginlar nima edi?

**Plagin** — brauzer imkoniyatini kengaytiradigan qo‘shimcha dastur. 2000-yillarda video, o‘yin va animatsiyalar asosan plaginlar orqali ishlardi: Adobe Flash, Java appletlar, Microsoft Silverlight.

Muammolari:

- har bir foydalanuvchi plaginni alohida o‘rnatishi kerak edi;
- telefonlarda deyarli ishlamasdi;
- ko‘plab xavfsizlik teshiklari bor edi.

Natijada brauzerlar plaginlarni qo‘llab-quvvatlashni to‘xtatdi. Flash 2020-yil oxirida butunlay yopildi. Bugun ularning o‘rnini `<video>`, `<audio>`, `<canvas>`, SVG va JavaScript egalladi.

## `<object>` elementi

`<object>` tashqi resursni sahifaga joylashtiradi. Bugun u asosan **PDF** yoki boshqa HTML sahifani ko‘rsatish uchun ishlatiladi:

```html
<object data="narxlar.pdf" type="application/pdf" width="600" height="400">
  <p>PDF ko‘rsatilmadi. <a href="narxlar.pdf">Faylni yuklab oling</a>.</p>
</object>
```

Teglar orasidagi kontent — **zaxira**: resurs ochilmasa, shu ko‘rinadi.

## `<embed>` elementi

`<embed>` ham tashqi resursni joylashtiradi, lekin yopuvchi tegi yo‘q va zaxira kontent bera olmaydi:

```html
<embed src="sxema.svg" type="image/svg+xml" width="300" height="200">
```

## Bugun nimani tanlash kerak?

| Vazifa                   | Tavsiya                   |
| ------------------------ | ------------------------- |
| Rasm                     | `<img>`                   |
| Video / audio            | `<video>` / `<audio>`     |
| Boshqa sahifa yoki vidjet | `<iframe>`                |
| PDF                      | havola yoki `<object>`    |
| Grafika                  | SVG yoki `<canvas>`       |

> **Maslahat:** Yangi loyihada `<embed>` deyarli kerak bo‘lmaydi. Uni eski kodlarda uchratganingizda nima ekanini bilsangiz yetarli.

## Xulosa

- Plaginlar (Flash, Java) tarixda qoldi — xavfsiz emas va telefonlarda ishlamas edi.
- `<object>` zaxira kontent bilan resurs joylashtiradi, `<embed>` — zaxirasiz.
- Zamonaviy sahifada media uchun HTML5 elementlaridan foydalaning.
