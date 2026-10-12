## Kaskad va maxsuslik

Bitta elementga bir nechta qoida bir-biriga zid qiymat bersa, qaysi biri yutadi? Brauzer buni **kaskad** qoidalari bilan hal qiladi:

1. **Muhimlik** — `!important` (keyingi dars) va qoidaning manbai.
2. **Maxsuslik** (specificity) — selektor qanchalik “aniq”.
3. **Tartib** — maxsuslik teng bo‘lsa, **keyin** yozilgani yutadi.

## Maxsuslikni hisoblash

Maxsuslik uchta son bilan ifodalanadi: **(ID, klass, teg)**.

| Selektor qismi                                   | Qaysi ustunga |
| ------------------------------------------------ | ------------- |
| `#id`                                            | ID            |
| `.klass`, `[atribut]`, `:hover` kabi psevdoklass | Klass         |
| `p`, `div`, `::before` kabi psevdoelement        | Teg           |
| `*`, kombinatorlar (`>`, `+`, bo‘sh joy)         | Hisoblanmaydi |

Misollar:

| Selektor               | Maxsuslik |
| ---------------------- | --------- |
| `p`                    | (0, 0, 1) |
| `.matn`                | (0, 1, 0) |
| `p.matn`               | (0, 1, 1) |
| `nav .menyu a:hover`   | (0, 2, 2) |
| `#asosiy`              | (1, 0, 0) |
| `#asosiy .matn p`      | (1, 1, 1) |

Solishtirish chapdan o‘ngga: avval ID soni, teng bo‘lsa klasslar, keyin teglar. Bitta ID **istalgan** sondagi klassdan kuchli: (1, 0, 0) > (0, 15, 0).

```css
.tugma {
  background-color: #0071dc;
}

button {
  background-color: gray; /* yutqazadi: (0,0,1) < (0,1,0) */
}
```

## Inline uslub

HTML’dagi `style="…"` atributi har qanday selektordan kuchliroq. Shuning uchun uni uslub berish uchun ishlatmang — keyin CSS’dan o‘zgartirish qiyin.

## Maxsus psevdoklasslar

- `:is()` va `:not()` o‘z ichidagi **eng kuchli** selektorning maxsusligini oladi: `:is(#a, .b)` = (1, 0, 0).
- `:where()` maxsusligi doim **nol**. Kutubxonalar standart uslublarni `:where()` bilan yozadi, toki ularni oson qayta yozish mumkin bo‘lsin.

## Meros

Maxsuslik faqat elementga **to‘g‘ridan-to‘g‘ri** yozilgan qoidalar orasida ishlaydi. Otadan meros bo‘lib kelgan qiymat har doim elementning o‘ziga yozilgan istalgan qoidadan kuchsiz:

```css
#asosiy {
  color: red;
}

p {
  color: black; /* #asosiy ichidagi p qora bo‘ladi */
}
```

## Amaliy maslahatlar

- Uslub uchun asosan **klasslardan** foydalaning, ID’lardan emas.
- Selektorlarni qisqa saqlang: maxsuslik past bo‘lsa, keyin qayta yozish oson.
- Qoida ishlamasa, brauzerning DevTools vositasida qaysi qoida uni “bosib ketgani”ni ko‘ring (chizib tashlangan qatorlar).

## Xulosa

- Kaskad: muhimlik → maxsuslik → tartib.
- Maxsuslik (ID, klass, teg) chapdan o‘ngga solishtiriladi.
- Meros bo‘lgan qiymat to‘g‘ridan-to‘g‘ri qoidadan kuchsiz.
