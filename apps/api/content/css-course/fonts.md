## Shriftlar: `font-family`

`font-family` matn qaysi shriftda ko‘rsatilishini belgilaydi. Odatda bir nechta shrift **zaxira ro‘yxati** sifatida yoziladi:

```css
body {
  font-family: "Segoe UI", Roboto, Arial, sans-serif;
}
```

Brauzer chapdan o‘ngga qaraydi va kompyuterda **bor** bo‘lgan birinchi shriftni ishlatadi. Bo‘sh joyli nomlar qo‘shtirnoqqa olinadi.

## Umumiy oilalar

Ro‘yxat oxirida doim umumiy oila (generic family) yoziladi — hech qaysi shrift topilmasa, brauzer shu turdagi biror shriftni tanlaydi.

| Oila         | Ko‘rinishi                             | Misollar                 |
| ------------ | -------------------------------------- | ------------------------ |
| `serif`      | Harflar uchida kichik “oyoqchalar” bor | Georgia, Times New Roman |
| `sans-serif` | Oyoqchasiz, toza                       | Arial, Verdana, Roboto   |
| `monospace`  | Har bir harf bir xil kenglikda         | Consolas, Courier New    |
| `cursive`    | Qo‘lyozmaga o‘xshash                   | Comic Sans MS            |
| `system-ui`  | Operatsion tizimning interfeys shrifti | Segoe UI, San Francisco  |

```css
code,
pre {
  font-family: Consolas, "Courier New", monospace;
}
```

## Qaysi shriftni tanlash kerak?

- Ekranda o‘qiladigan uzun matn uchun ko‘pincha **sans-serif** tanlanadi.
- Kod uchun doim **monospace** — ustunlar tekis turadi.
- Sahifada 2 tadan ortiq shrift ishlatmang: biri sarlavhalar, biri matn uchun yetarli.

## Xavfsiz shriftlar

Ba’zi shriftlar deyarli hamma kompyuterda bor: Arial, Verdana, Tahoma, Georgia, Times New Roman, Courier New. Lekin “deyarli” — “doim” degani emas. Shuning uchun ro‘yxat oxiridagi umumiy oila majburiy.

## Meros

`font-family` meros bo‘ladi: uni `body` ga bersangiz, butun sahifa shu shriftni oladi. Faqat farq qiladigan elementlar uchun alohida yozasiz:

```css
body {
  font-family: Arial, sans-serif;
}

h1,
h2 {
  font-family: Georgia, serif;
}
```

> **Eslatma:** `button`, `input` va `textarea` shriftni meros olmaydi. Ularga `font-family: inherit` bering.

## Xulosa

- `font-family` — zaxira ro‘yxati, birinchi mavjud shrift ishlatiladi.
- Ro‘yxat doim umumiy oila (`sans-serif`, `serif`, `monospace`) bilan tugaydi.
- Shriftni `body` ga bering, forma elementlariga `inherit`.
