## Matn effektlari

## Gradientli matn

`background-clip: text` fonni faqat harflar ichida qoldiradi:

```css
.gradient-matn {
  background-image: linear-gradient(90deg, #0071dc, #fec400);
  background-clip: text;
  color: transparent;
}
```

`color: transparent` bo‘lmasa, matnning o‘z rangi gradientni yopib qo‘yadi.

> Gradient juda och bo‘lsa, matn o‘qilmay qoladi. Katta sarlavhalar uchun ishlating, oddiy matn uchun emas.

## Matn konturi

```css
.kontur {
  color: transparent;
  -webkit-text-stroke: 2px #0071dc;
}
```

Faqat harflar chizig‘i ko‘rinadi. `-webkit-` prefiksiga qaramay, barcha zamonaviy brauzerlarda ishlaydi.

## Yozuv yo‘nalishi: `writing-mode`

```css
.vertikal {
  writing-mode: vertical-rl;
}
```

Matn yuqoridan pastga yoziladi. Jadval sarlavhalari yoki dekorativ yozuvlar uchun.

## So‘zlarni bo‘lish

| Xususiyat                | Vazifasi                                         |
| ------------------------ | ------------------------------------------------ |
| `overflow-wrap: anywhere` | Juda uzun so‘zni istalgan joyda bo‘ladi          |
| `word-break: break-all`  | Har qanday so‘zni belgilar orasida bo‘ladi        |
| `hyphens: auto`          | Tilga qarab chiziqcha bilan bo‘g‘inga bo‘ladi     |

```css
.izoh {
  hyphens: auto; /* HTML'da lang="uz" bo‘lishi kerak */
}
```

## Muvozanatli sarlavhalar: `text-wrap`

```css
h1,
h2 {
  text-wrap: balance;
}
```

Ko‘p qatorli sarlavhada brauzer qatorlarni **teng uzunlikda** qiladi — oxirgi qatorda bitta so‘z “osilib” qolmaydi.

```css
p {
  text-wrap: pretty;
}
```

`pretty` paragraf oxirida yolg‘iz so‘z qolishining oldini oladi.

## Matnni kesish

6-moduldagi uch xususiyat esingizdami?

```css
.nom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## Xulosa

- `background-clip: text` + `color: transparent` — gradientli matn.
- `-webkit-text-stroke` — kontur.
- `writing-mode` — vertikal yozuv.
- `text-wrap: balance` — chiroyli sarlavhalar.
