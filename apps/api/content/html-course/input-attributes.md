## `<input>` atributlari

Maydonning boshlang‘ich qiymati, cheklovlari va xatti-harakati atributlar bilan sozlanadi.

## Qiymat va ko‘rsatma

```html
<input type="text" name="shahar" value="Toshkent">
<input type="text" name="ism" placeholder="Masalan: Aziza">
```

- `value` — boshlang‘ich qiymat (yuboriladi);
- `placeholder` — bo‘sh maydondagi kulrang ko‘rsatma (yuborilmaydi). U `<label>` o‘rnini bosmaydi!

## Majburiy maydon

```html
<input type="email" name="email" required>
```

Bo‘sh bo‘lsa, brauzer formani yubormaydi va ogohlantiradi.

## Faqat o‘qish va faolsiz

```html
<input type="text" name="kod" value="WD-2026" readonly>
<input type="text" name="eski" value="..." disabled>
```

|                       | `readonly` | `disabled` |
| --------------------- | ---------- | ---------- |
| O‘zgartirib bo‘ladimi | Yo‘q       | Yo‘q       |
| Fokus olishi          | Ha         | Yo‘q       |
| Yuboriladimi          | **Ha**     | **Yo‘q**   |

## Uzunlik va diapazon

```html
<input type="text" name="login" minlength="3" maxlength="20">
<input type="number" name="miqdor" min="1" max="10" step="1">
<input type="date" name="sana" min="2026-01-01" max="2026-12-31">
```

## Naqsh: `pattern`

Qiymat muntazam ifodaga (regular expression) mos kelishi kerak:

```html
<label for="tel">Telefon (9 ta raqam)</label>
<input id="tel" name="tel" pattern="[0-9]{9}" title="Masalan: 901234567">
```

`title` atributidagi matn xato bo‘lganda ko‘rsatma sifatida chiqadi.

## Boshqa foydali atributlar

| Atribut        | Vazifasi                                               |
| -------------- | ------------------------------------------------------ |
| `autofocus`    | Sahifa ochilganda maydon fokusda bo‘ladi               |
| `size`         | Maydonning belgilardagi kengligi                       |
| `multiple`     | Bir nechta fayl yoki email                             |
| `autocomplete` | Avtomatik to‘ldirish (`on`, `off`, `email`, `name`...) |
| `list`         | `<datalist>` bilan bog‘lash                            |

```html
<input type="email" name="mehmonlar" multiple placeholder="a@x.uz, b@x.uz">
```

## Xulosa

- `value` — qiymat, `placeholder` — ko‘rsatma (yorliq o‘rnini bosmaydi).
- `required`, `minlength`, `maxlength`, `min`, `max`, `pattern` — brauzer tekshiruvi.
- `readonly` maydon yuboriladi, `disabled` esa yuborilmaydi.
