## Sayt maketi

Ko‘p saytlar bir xil asosiy tuzilishga ega:

```text
┌──────────────────────────────┐
│           header             │
├──────────────────────────────┤
│             nav              │
├────────────────────┬─────────┤
│                    │         │
│       main         │  aside  │
│                    │         │
├────────────────────┴─────────┤
│           footer             │
└──────────────────────────────┘
```

## Semantik HTML

```html
<header class="sayt-sarlavha">…</header>
<nav class="sayt-menyu">…</nav>
<div class="sahifa">
  <main>…</main>
  <aside>…</aside>
</div>
<footer class="sayt-pasti">…</footer>
```

Har bir qism o‘z teg’ida: `header`, `nav`, `main`, `aside`, `footer`. Bu ekran o‘quvchilarga sahifa bo‘ylab tez harakatlanish imkonini beradi.

## Ustunlar: Grid

```css
.sahifa {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}
```

- `1fr` — asosiy ustun qolgan joyni egallaydi;
- `280px` — yon panel qat’iy kenglikda;
- `gap` — ustunlar orasidagi masofa.

## Kichik ekranda bitta ustun

```css
@media (max-width: 768px) {
  .sahifa {
    grid-template-columns: 1fr;
  }
}
```

Telefonda `aside` asosiy kontent ostiga tushadi. Media so‘rovlar 15-modulda batafsil.

## Footer pastda tursin

Kontent kam bo‘lsa, footer ekranning o‘rtasida “osilib” qoladi. Yechim:

```css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.sahifa {
  flex: 1;
}
```

`body` kamida ekran balandligida, asosiy qism esa bo‘sh joyni egallaydi — footer pastga itariladi.

## Muhim tamoyillar

- **Mobil birinchi:** avval bitta ustunli maketni yozing, keyin katta ekranlar uchun ustunlar qo‘shing.
- **Konteyner:** kontent juda keng ekranlarda cho‘zilib ketmasligi uchun `max-width`.
- **Tartib:** HTML’dagi tartib mantiqiy bo‘lsin (asosiy kontent oldin). CSS ko‘rinishdagi tartibni o‘zgartirishi mumkin, lekin klaviatura va ekran o‘quvchi HTML tartibiga ergashadi.

## Xulosa

- `header`, `nav`, `main`, `aside`, `footer` — semantik qismlar.
- Ustunlar uchun Grid: `grid-template-columns: 1fr 280px`.
- Kichik ekranda bitta ustun, footer uchun `min-height: 100vh` + flex.
