## `type` — maydon turi

`<input>` ning `type` atributi maydon qanday ko‘rinishi va qanday ma’lumot qabul qilishini belgilaydi. To‘g‘ri tur tanlash foydalanuvchiga qulay: telefonda mos klaviatura chiqadi, brauzer qiymatni o‘zi tekshiradi.

## Matnli turlar

| Tur        | Vazifasi                                     |
| ---------- | -------------------------------------------- |
| `text`     | Oddiy matn                                   |
| `password` | Yashirin matn (nuqtalar bilan)               |
| `email`    | Email; `@` borligini tekshiradi              |
| `tel`      | Telefon raqami; telefonda raqamli klaviatura |
| `url`      | Veb-manzil                                   |
| `search`   | Qidiruv maydoni                              |

```html
<input type="email" name="email" placeholder="ism@example.uz">
<input type="tel" name="telefon" placeholder="+998 90 123 45 67">
```

## Raqamlar

```html
<input type="number" name="yosh" min="7" max="99" step="1">
<input type="range" name="ovoz" min="0" max="100" value="50">
```

- `number` — raqam kiritish, strelkalar bilan;
- `range` — surgich (aniq qiymat muhim bo‘lmaganda).

## Sana va vaqt

```html
<input type="date" name="tugilgan">
<input type="time" name="vaqt">
<input type="datetime-local" name="uchrashuv">
<input type="month" name="oy">
<input type="week" name="hafta">
```

Brauzer kalendar yoki soat tanlagichini o‘zi ko‘rsatadi.

## Tanlov turlari

```html
<input type="checkbox" id="obuna" name="obuna" checked>
<label for="obuna">Yangiliklarga obuna bo‘lish</label>

<input type="radio" id="naqd" name="tolov" value="naqd">
<label for="naqd">Naqd</label>
<input type="radio" id="karta" name="tolov" value="karta">
<label for="karta">Karta</label>
```

## Boshqa turlar

| Tur      | Vazifasi                                                     |
| -------- | ------------------------------------------------------------ |
| `color`  | Rang tanlagich                                               |
| `file`   | Fayl tanlash (`accept=".pdf,image/*"` bilan cheklash mumkin) |
| `hidden` | Ko‘rinmas maydon (foydalanuvchi ko‘rmaydi, lekin yuboriladi) |
| `submit` | Yuborish tugmasi                                             |
| `reset`  | Tozalash tugmasi                                             |

```html
<input type="color" name="sevimli-rang" value="#0071dc">
<input type="file" name="rasm" accept="image/*">
```

> **Xavfsizlik:** brauzer tekshiruvi (masalan, `type="email"`) faqat qulaylik uchun. Haqiqiy tekshiruv har doim serverda bo‘lishi kerak — uni chetlab o‘tish oson.

## Xulosa

- `type` maydon turini belgilaydi: `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio`, `color`, `file`...
- To‘g‘ri tur telefonda mos klaviatura va avtomatik tekshiruv beradi.
- Brauzer tekshiruvi serverdagi tekshiruv o‘rnini bosmaydi.
