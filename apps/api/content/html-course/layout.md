## Sahifa maketi

Ko‘pchilik saytlar o‘xshash qismlardan iborat: yuqori qism, menyu, asosiy mazmun, yon panel va pastki qism. HTML5’da har biri uchun maxsus teg bor.

```text
┌──────────────── header ────────────────┐
│ logo                nav (menyu)        │
├──────────────────────┬─────────────────┤
│ main                 │ aside           │
│   article / section  │ (yon panel)     │
├──────────────────────┴─────────────────┤
│                 footer                 │
└────────────────────────────────────────┘
```

## Maket teglari

| Teg         | Vazifasi                                            |
| ----------- | --------------------------------------------------- |
| `<header>`  | Sahifa yoki bo‘limning yuqori qismi: logo, sarlavha |
| `<nav>`     | Asosiy navigatsiya havolalari                       |
| `<main>`    | Sahifaning asosiy, yagona mazmuni (sahifada bitta)  |
| `<section>` | Mavzu bo‘yicha guruhlangan bo‘lim                   |
| `<article>` | Mustaqil mazmun: maqola, post, sharh                |
| `<aside>`   | Yon ma’lumot: reklama, bog‘liq havolalar            |
| `<footer>`  | Pastki qism: mualliflik huquqi, aloqa               |

## To‘liq misol

```html
<body>
  <header>
    <h1>Shahar kutubxonasi</h1>
    <nav>
      <a href="index.html">Bosh sahifa</a>
      <a href="kitoblar.html">Kitoblar</a>
      <a href="aloqa.html">Aloqa</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Yangi kitoblar keldi</h2>
      <p>Bu oy fondimiz 300 ta yangi kitob bilan to‘ldirildi.</p>
    </article>
    <aside>
      <h3>Ish vaqti</h3>
      <p>Dushanba–Shanba, 9:00–18:00</p>
    </aside>
  </main>

  <footer>
    <p>© 2026 Shahar kutubxonasi</p>
  </footer>
</body>
```

## Maketni CSS bilan qurish

Teglar faqat tuzilmani beradi. Ustunlarni yonma-yon qo‘yish CSS bilan qilinadi. Zamonaviy usullar:

### Flexbox — bir yo‘nalishdagi joylashuv

```css
main {
  display: flex;
  gap: 24px;
}
article {
  flex: 3;
}
aside {
  flex: 1;
}
```

### Grid — ikki o‘lchovli joylashuv

```css
body {
  display: grid;
  grid-template-areas:
    'header header'
    'main   aside'
    'footer footer';
  grid-template-columns: 3fr 1fr;
}
header {
  grid-area: header;
}
```

Eski usullar (jadval bilan maket, `float`) endi tavsiya etilmaydi.

## Xulosa

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` — sahifa maketining qismlari.
- `<main>` sahifada bitta bo‘ladi.
- Ustunlar va joylashuv Flexbox yoki Grid bilan quriladi.
