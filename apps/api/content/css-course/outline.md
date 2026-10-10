## Kontur: `outline`

`outline` — chegaradan **tashqarida** chiziladigan chiziq. Tashqi ko‘rinishi `border` ga o‘xshaydi, lekin muhim farqlari bor:

| `border`                         | `outline`                                  |
| -------------------------------- | ------------------------------------------ |
| Joy egallaydi, o‘lchamga qo‘shiladi | Joy egallamaydi, boshqa elementlarni surmaydi |
| Har tomonni alohida berish mumkin | Faqat to‘rt tomon birdan                   |
| Quti modelining qismi            | Quti modelidan tashqarida                  |

```css
.tanlangan {
  outline: 3px solid #fec400;
}
```

## Xususiyatlar

| Xususiyat        | Misol          |
| ---------------- | -------------- |
| `outline-style`  | `solid`, `dashed`, `dotted` |
| `outline-width`  | `2px`, `thick` |
| `outline-color`  | `#0071dc`      |
| `outline-offset` | `4px` — elementdan qancha uzoqlikda |
| `outline`        | Qisqa yozuv: `2px solid #0071dc` |

```css
.rasm:hover {
  outline: 2px dashed #0071dc;
  outline-offset: 4px;
}
```

## Fokus ko‘rsatkichi — eng muhim vazifa

Klaviatura bilan ishlaydigan foydalanuvchilar `Tab` tugmasi bilan havolalar va tugmalar orasida yuradi. Qaysi element tanlanganini brauzer aynan **outline** bilan ko‘rsatadi.

```css
/* XATO: klaviatura foydalanuvchilari qayerda ekanini ko‘rmaydi */
button:focus {
  outline: none;
}
```

Standart fokus chizig‘i dizaynga mos kelmasa, uni o‘chirmang — **almashtiring**:

```css
a:focus-visible,
button:focus-visible {
  outline: 3px solid #0071dc;
  outline-offset: 2px;
}
```

`:focus-visible` brauzer klaviatura ishlatilayotganini sezganda ishlaydi — sichqoncha bilan bosganda chiziq chiqmaydi.

## Xato qidirishda yordamchi

Elementlar qayerda joylashganini tez ko‘rish uchun vaqtincha outline qo‘shish qulay — u joy egallamagani uchun maketni buzmaydi:

```css
* {
  outline: 1px solid red;
}
```

## Xulosa

- `outline` chegaradan tashqarida chiziladi va joy egallamaydi.
- `outline-offset` — element bilan kontur orasidagi masofa.
- Fokus konturini o‘chirmang; kerak bo‘lsa `:focus-visible` bilan qayta bezang.
