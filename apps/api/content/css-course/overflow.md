## Toshib chiqish: `overflow`

Elementning o‘lchami cheklangan bo‘lsa, kontent unga sig‘masligi mumkin. `overflow` sig‘magan kontent bilan nima qilishni belgilaydi.

| Qiymat    | Natija                                                   |
| --------- | -------------------------------------------------------- |
| `visible` | Kontent chegaradan chiqib ko‘rinadi (standart)          |
| `hidden`  | Ortiqcha qism kesib tashlanadi                           |
| `scroll`  | Doim aylantirish paneli ko‘rsatiladi                     |
| `auto`    | Kerak bo‘lgandagina aylantirish paneli chiqadi           |
| `clip`    | `hidden` ga o‘xshash, lekin dastur bilan ham aylantirib bo‘lmaydi |

```css
.chat {
  height: 300px;
  overflow: auto;
}
```

Ko‘p hollarda `auto` eng yaxshi tanlov: kontent sig‘sa panel ko‘rinmaydi.

## Yo‘nalish bo‘yicha

```css
.kod {
  overflow-x: auto;   /* gorizontal */
  overflow-y: hidden; /* vertikal */
}
```

Uzun kod qatorlari yoki keng jadvallar uchun `overflow-x: auto` qulay.

## `hidden` bilan ehtiyot bo‘ling

`overflow: hidden` ba’zan “chiqib ketgan narsani yashirish” uchun yoziladi. Lekin u muhim kontentni ham — masalan, ochiladigan menyu yoki fokus konturini — kesib tashlashi mumkin. Avval nima uchun toshib chiqayotganini aniqlang.

Foydali holat — rasmni yumaloq kartochka burchagi bo‘ylab kesish:

```css
.karta {
  border-radius: 12px;
  overflow: hidden;
}
```

## Matnni uch nuqta bilan kesish

Bir qatorga sig‘magan matn oxiriga “…” qo‘yish uchun uchta xususiyat birga kerak:

```css
.nom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

Ko‘p qatorli kesish uchun `line-clamp` ishlatiladi:

```css
.tavsif {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
```

## Xulosa

- `overflow: auto` — kerak bo‘lsagina aylantirish.
- `overflow-x` / `overflow-y` yo‘nalishni alohida boshqaradi.
- “…” uchun: `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis`.
