## Semantika nima?

**Semantik element** — nomining o‘zi mazmunini bildiradigan element. `<div>` va `<span>` hech narsa demaydi; `<nav>`, `<article>`, `<footer>` esa aniq ma’no beradi.

```html
<!-- Semantik emas -->
<div class="menyu">...</div>
<div class="maqola">...</div>

<!-- Semantik -->
<nav>...</nav>
<article>...</article>
```

## Nima uchun muhim?

1. **Qulaylik (accessibility).** Ekran o‘qiydigan dasturlar `<nav>` yoki `<main>` ga to‘g‘ridan-to‘g‘ri o‘tishni taklif qiladi.
2. **Qidiruv tizimlari** sahifadagi asosiy mazmunni aniqroq tushunadi.
3. **O‘qiluvchan kod.** Bir qarashda qaysi qism nima ekani ko‘rinadi.

## Asosiy semantik elementlar

| Element                    | Ma’nosi                                      |
| -------------------------- | -------------------------------------------- |
| `<header>`                 | Kirish qismi yoki navigatsiya guruhi         |
| `<nav>`                    | Navigatsiya havolalari bloki                 |
| `<main>`                   | Sahifaning asosiy mazmuni                    |
| `<article>`                | Mustaqil, alohida ulashsa ham ma’noli mazmun |
| `<section>`                | Sarlavhali mavzuli bo‘lim                    |
| `<aside>`                  | Asosiy mazmunga bilvosita bog‘liq qism       |
| `<footer>`                 | Yakuniy qism                                 |
| `<figure>`, `<figcaption>` | Rasm, diagramma va uning izohi               |
| `<time>`                   | Sana yoki vaqt                               |
| `<mark>`                   | Belgilangan matn                             |
| `<details>`, `<summary>`   | Ochiladigan-yopiladigan blok                 |

## `<article>` yoki `<section>`?

- `<article>` — o‘zi alohida tura oladigan narsa: blog post, yangilik, mahsulot kartochkasi, izoh.
- `<section>` — kattaroq bir butunning mavzuli qismi: “Narxlar”, “Savollar”, “Jamoa”.

```html
<article>
  <h2>Toshkentda yangi park ochildi</h2>
  <p><time datetime="2026-05-12">12-may, 2026</time></p>
  <section>
    <h3>Park haqida</h3>
    <p>...</p>
  </section>
  <section>
    <h3>Qanday borish mumkin</h3>
    <p>...</p>
  </section>
</article>
```

## Ochiladigan blok

```html
<details>
  <summary>Kurs qancha davom etadi?</summary>
  <p>O‘rtacha 6 hafta, haftasiga 3 ta dars.</p>
</details>
```

JavaScript’siz ishlaydi!

## Xulosa

- Semantik teglar mazmunni bildiradi: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.
- Ular qulaylik, qidiruv va kod o‘qiluvchanligini yaxshilaydi.
- Ma’noli teg bo‘lsa, `<div>` o‘rniga o‘shani tanlang.
