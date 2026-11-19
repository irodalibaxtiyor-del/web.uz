## Nomlangan hududlar bilan maket

`grid-template-areas` sahifa maketini **rasmdek** chizish imkonini beradi.

```css
.sahifa {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sarlavha sarlavha"
    "yon      asosiy"
    "pasti    pasti";
  min-height: 100vh;
  gap: 16px;
}

.sahifa > header { grid-area: sarlavha; }
.sahifa > aside  { grid-area: yon; }
.sahifa > main   { grid-area: asosiy; }
.sahifa > footer { grid-area: pasti; }
```

Har bir qo‘shtirnoq — bitta qator, har bir so‘z — bitta ustun. Bir xil nom qo‘shni kataklarni bitta hududga birlashtiradi.

## Qoidalar

- Hudud doim **to‘rtburchak** bo‘lishi kerak. “L” shaklidagi hudud — xato, butun qoida ishlamaydi.
- Har bir qatorda ustunlar soni bir xil.
- Bo‘sh katak — nuqta: `". asosiy"`.

## Moslashuvchan maket

Hududlar nomi bilan maketni media so‘rovda butunlay qayta chizish juda oson:

```css
.sahifa {
  grid-template-columns: 1fr;
  grid-template-areas:
    "sarlavha"
    "asosiy"
    "yon"
    "pasti";
}

@media (min-width: 768px) {
  .sahifa {
    grid-template-columns: 240px 1fr;
    grid-template-areas:
      "sarlavha sarlavha"
      "yon      asosiy"
      "pasti    pasti";
  }
}
```

Telefonda bitta ustun (yon panel asosiy kontent ostida), katta ekranda — ikki ustun. HTML o‘zgarmaydi.

## 12 ustunli to‘r

Ko‘p dizayn tizimlari 12 ustunli to‘r ishlatadi — 12 ni 2, 3, 4, 6 ga bo‘lish mumkin:

```css
.tor {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.asosiy { grid-column: span 8; }
.yon    { grid-column: span 4; }
```

## `subgrid`

Ichki grid otaning chiziqlaridan foydalanishi mumkin:

```css
.karta {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}
```

Yonma-yon kartochkalarning sarlavhasi, matni va tugmasi — matn uzunligi har xil bo‘lsa ham — bir chiziqda turadi.

```tekshir
Elementni `grid-template-areas` dagi “sidebar” hududiga joylash uchun nima yoziladi?
+ `grid-area: sidebar`
- `grid-template: sidebar`
- `area: "sidebar"`
> Hudud nomi qo‘shtirnoqsiz `grid-area` da beriladi.
```

```jonli
<style>
  .s { display: grid; gap: 6px; grid-template-columns: 120px 1fr;
       grid-template-areas: "header header" "sidebar main" "footer footer"; }
  .s > * { padding: 10px; background: #eef4fb; }
  header { grid-area: header; } aside { grid-area: sidebar; } main { grid-area: main; } footer { grid-area: footer; }
</style>
<div class="s"><header>header</header><aside>sidebar</aside><main>main</main><footer>footer</footer></div>
```

## Xulosa

- `grid-template-areas` — maketni nomlar bilan chizish.
- Elementga `grid-area: nom`.
- Media so‘rovda faqat hududlar xaritasini o‘zgartirish kifoya.
