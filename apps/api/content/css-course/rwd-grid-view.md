## To‘r ko‘rinishi (grid view)

Ko‘p saytlar sahifani ustunlarga bo‘lingan **to‘r** asosida quradi. Bu elementlarning o‘lchami va joylashuvini izchil qiladi.

## 12 ustunli to‘r

12 soni qulay: uni 2, 3, 4 va 6 ga bo‘lish mumkin. Shuning uchun dizayn tizimlarining ko‘pchiligi 12 ustunli to‘r ishlatadi.

```text
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│        8        │   4   │   asosiy + yon panel
├─────┬─────┬─────┼───────┤
│  4  │  4  │  4  │       │   uchta kartochka
└─────┴─────┴─────┴───────┘
```

## CSS Grid bilan

```css
.tor {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.ustun-8 { grid-column: span 8; }
.ustun-4 { grid-column: span 4; }
.ustun-6 { grid-column: span 6; }
.ustun-12 { grid-column: span 12; }
```

## Mobil birinchi to‘r

Telefonda hamma ustun butun kenglikda, katta ekranda — belgilangan qism:

```css
.tor > * {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .md-6 { grid-column: span 6; }
  .md-4 { grid-column: span 4; }
  .md-8 { grid-column: span 8; }
}
```

```html
<div class="tor">
  <main class="md-8">…</main>
  <aside class="md-4">…</aside>
</div>
```

Telefonda `main` va `aside` ustma-ust, 768px dan keng ekranda yonma-yon (8 + 4).

## Eski usul: `float` va foizlar

Grid’dan oldin to‘rlar `float` bilan qurilardi:

```css
.ustun-6 {
  float: left;
  width: 50%;
}
```

Bu usul `clearfix`, aniq foizlar (`8.33%`) va ustunlar orasidagi bo‘shliq uchun murakkab hisoblar talab qilardi. Grid’da `gap` va `span` bu muammolarni hal qiladi.

## Har doim 12 ustun kerakmi?

Yo‘q. Ko‘p hollarda oddiyroq yechim yetarli:

```css
.maket {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .maket {
    grid-template-columns: 2fr 1fr;
  }
}
```

To‘r — vosita, maqsad emas. Murakkab saytlarda izchillik uchun foydali, kichik sahifada esa ortiqcha bo‘lishi mumkin.

## Xulosa

- 12 ustunli to‘r: `repeat(12, 1fr)` + `grid-column: span N`.
- Mobil birinchi: standart holda `span 12`, katta ekranda kamroq.
- Oddiy maket uchun ikki-uch ustunli grid yetarli.
