## Kodirovka nima?

Kompyuter faqat raqamlarni biladi. **Kodirovka (charset)** — har bir belgiga qaysi raqam mos kelishini belgilovchi jadval. Brauzer qaysi kodirovka ishlatilganini bilmasa, matn “krakozyabra”ga aylanadi: `OÊ»zbekiston` kabi.

## Qisqa tarix

| Kodirovka    | Belgilar soni      | Izoh                                              |
| ------------ | ------------------ | ------------------------------------------------- |
| ASCII        | 128                | Faqat lotin harflari, raqamlar va asosiy belgilar |
| Windows-1251 | 256                | Kirill harflari uchun eski standart               |
| ISO-8859-1   | 256                | G‘arbiy Yevropa tillari                           |
| **UTF-8**    | 1 milliondan ortiq | Dunyodagi deyarli barcha yozuvlar va emoji        |

Bugun vebdagi sahifalarning 98 foizdan ortig‘i **UTF-8** ishlatadi.

## Kodirovkani e’lon qilish

```html
<head>
  <meta charset="utf-8">
  ...
</head>
```

Qoidalar:

1. Har bir sahifada bo‘lsin.
2. `<head>` ning **boshida** — birinchi 1024 bayt ichida bo‘lishi kerak.
3. Fayl o‘zi ham UTF-8 da saqlangan bo‘lsin (muharrirning pastki qismida ko‘rsatiladi).

## UTF-8 ning afzalligi

UTF-8 bitta sahifada bir nechta yozuvni aralashtirish imkonini beradi:

```html
<p lang="uz">O‘zbekiston — Ўзбекистон</p>
<p lang="ru">Узбекистан</p>
<p lang="ar">أوزبكستان</p>
<p>Emoji ham: 🇺🇿</p>
```

## O‘zbek lotin yozuvidagi belgilar

“O‘” va “G‘” harflaridagi belgi uchun to‘g‘ri Unicode belgisi — **‘** (U+2018, chap bittalik tirnoq) yoki **ʻ** (U+02BB). Oddiy apostrof `'` ham ko‘p ishlatiladi, lekin u HTML atributlarida tirnoq bilan chalkashishi mumkin.

## Xulosa

- Kodirovka belgilar va raqamlar orasidagi moslik jadvali.
- Har doim UTF-8 ishlating va `<meta charset="utf-8">` ni `<head>` boshiga qo‘ying.
- UTF-8 barcha tillar va emoji’ni bitta sahifada qo‘llab-quvvatlaydi.
