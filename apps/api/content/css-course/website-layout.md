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

```tekshir
Kontent kam bo‘lganda ham footer ekran pastida turishi uchun qaysi usul?
+ `body { min-height: 100vh; display: flex; flex-direction: column; }` va `main { flex: 1; }`
- `footer { position: absolute; }`
- `footer { margin-top: 500px; }`
> `main` bo‘sh joyni egallab, footerni pastga itaradi.
```

```jonli
<style>
  .sahifa { min-height: 220px; display: flex; flex-direction: column; border: 1px solid #ccc; }
  .sahifa > * { padding: 8px; }
  header, footer { background: #123; color: white; }
  main { flex: 1; }
</style>
<div class="sahifa"><header>header</header><main>Kontent kam</main><footer>footer — pastda</footer></div>
```

## Xulosa

- `header`, `nav`, `main`, `aside`, `footer` — semantik qismlar.
- Ustunlar uchun Grid: `grid-template-columns: 1fr 280px`.
- Kichik ekranda bitta ustun, footer uchun `min-height: 100vh` + flex.
