## Wrap — qatorga sig‘masa

Figma Auto Layout’ning **Wrap** rejimida gorizontal elementlar qatorga sig‘maganda keyingi qatorga o‘tadi — teglar, filtrlar, chiplar uchun. CSS’da bu `flex-wrap: wrap`.

## Ikki xil oraliq

Wrap yoqilganda Figma ikkita oraliqni ko‘rsatadi:

- elementlar orasidagi (gorizontal) gap;
- qatorlar orasidagi (vertikal) gap.

CSS’da `gap` ikki qiymat qabul qiladi:

```css
.teglar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 8px; /* row-gap column-gap */
}
```

Tartibga e’tibor bering: **avval qatorlar** (row-gap), **keyin ustunlar** (column-gap). Figma’da esa ko‘pincha teskari ko‘rsatiladi — chalkashtirmaslik uchun alohida yozish ham mumkin:

```css
.teglar {
  row-gap: 12px;
  column-gap: 8px;
}
```

## Wrap va Grid

Agar o‘ralgan elementlar **bir xil kenglikda** bo‘lishi kerak bo‘lsa (masalan, kartalar to‘ri), Figma’da ham Grid ishlatilgan bo‘lishi mumkin (yangi Figma’da Auto Layout Grid rejimi bor). CSS’da bunga `display: grid` va `repeat(auto-fill, minmax(...))` mos keladi. Teglar kabi har xil kenglikdagi elementlar uchun esa `flex-wrap`.

## Tekislash

Wrap rejimida qatorlarning o‘zini tekislash uchun `align-content` ishlatiladi (masalan, hamma qatorlarni markazga). Ko‘p hollarda kerak bo‘lmaydi.

## Maketni sinash

Maket bir xil uzunlikdagi teglar bilan chizilgan bo‘lishi mumkin. Haqiqiy ma’lumotda “Moslashuvchan dizayn” kabi uzun teg bo‘ladi. `white-space: nowrap` bilan teg ichidagi matn sinmasin, lekin teg qatorga sig‘masa — keyingi qatorga o‘tsin. Juda uzun bitta teg konteynerdan kengroq bo‘lsa, `max-width: 100%` va `text-overflow: ellipsis` qo‘shish mumkin.

Mashqda teglar ro‘yxatini o‘raladigan qilasiz va ikki xil oraliqni berasiz.
