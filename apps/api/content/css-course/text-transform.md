## Harflarni o‘zgartirish: `text-transform`

`text-transform` HTML’dagi matnni o‘zgartirmasdan, uning **ko‘rinishini** bosh yoki kichik harflarga o‘tkazadi.

| Qiymat       | Natija                           |
| ------------ | -------------------------------- |
| `uppercase`  | HAMMASI BOSH HARF                |
| `lowercase`  | hammasi kichik harf              |
| `capitalize` | Har So‘zning Birinchi Harfi Bosh |
| `none`       | O‘zgarishsiz                     |

```css
.yorliq {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
}
```

## Nega HTML’da bosh harf bilan yozmaslik kerak?

Matnni `<span>YANGI</span>` deb yozish o‘rniga `Yangi` deb yozib, ko‘rinishini CSS’da o‘zgartirgan ma’qul:

- dizayn o‘zgarsa, faqat CSS tahrirlanadi;
- ekran o‘quvchi dasturlar ba’zan bosh harfli so‘zni harfma-harf o‘qiydi (“Y-A-N-G-I”);
- qidiruv va nusxa olishda matn odatdagidek qoladi.

## `capitalize` va o‘zbek tili

`capitalize` har bir so‘zning birinchi harfini katta qiladi. O‘zbek tilida sarlavhalarda odatda faqat birinchi so‘z bosh harf bilan yoziladi, shuning uchun `capitalize` ni sarlavhalarga ishlatmang.

## Bo‘sh joylar: `white-space`

Brauzer ketma-ket kelgan bo‘sh joy va qator o‘tishlarini bitta bo‘sh joyga aylantiradi. `white-space` bu xatti-harakatni boshqaradi:

| Qiymat     | Bo‘sh joylar | Qator o‘tishi | Avtomatik ko‘chirish |
| ---------- | ------------ | ------------- | -------------------- |
| `normal`   | Birlashadi   | E’tiborsiz    | Ha                   |
| `nowrap`   | Birlashadi   | E’tiborsiz    | **Yo‘q**             |
| `pre`      | Saqlanadi    | Saqlanadi     | Yo‘q                 |
| `pre-wrap` | Saqlanadi    | Saqlanadi     | Ha                   |

```css
.narx {
  white-space: nowrap; /* "120 000 so‘m" ikki qatorga bo‘linmaydi */
}
```

## Uzun so‘zlar

Juda uzun havola yoki so‘z blokdan chiqib ketsa:

```css
.izoh {
  overflow-wrap: break-word;
}
```

## Xulosa

- `text-transform` faqat ko‘rinishni o‘zgartiradi, HTML matni o‘zgarmaydi.
- Bosh harfli yorliqlarni CSS bilan qiling.
- `white-space: nowrap` matnni bitta qatorda ushlaydi, `overflow-wrap: break-word` uzun so‘zni bo‘ladi.
