## Sahifalash (pagination)

Ro‘yxat uzun bo‘lsa, u sahifalarga bo‘linadi va pastda sahifa raqamlari ko‘rsatiladi.

## HTML

```html
<nav class="sahifalash" aria-label="Sahifalar">
  <ul>
    <li><a href="?p=1" aria-label="Oldingi sahifa">‹</a></li>
    <li><a href="?p=1">1</a></li>
    <li><a href="?p=2" aria-current="page">2</a></li>
    <li><a href="?p=3">3</a></li>
    <li><a href="?p=3" aria-label="Keyingi sahifa">›</a></li>
  </ul>
</nav>
```

- `nav` + `aria-label` — ekran o‘quvchi uni “Sahifalar navigatsiyasi” deb e’lon qiladi.
- `aria-current="page"` — joriy sahifa.
- Strelkalarda `aria-label` — “‹” belgisi o‘zi hech narsa demaydi.

## CSS

```css
.sahifalash ul {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sahifalash a {
  display: grid;
  place-items: center;
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #0e1133;
  text-decoration: none;
}

.sahifalash a:hover {
  background-color: #f5faff;
}

.sahifalash a[aria-current="page"] {
  background-color: #0071dc;
  border-color: #0071dc;
  color: white;
}
```

- `display: grid; place-items: center` — raqam katakning o‘rtasida.
- `min-width` — bir xonali va ikki xonali raqamlar bir xil ko‘rinadi.
- `gap` — kataklar orasidagi masofa.

## Markazlash

```css
.sahifalash ul {
  justify-content: center;
}
```

## Mavjud bo‘lmagan sahifa

Birinchi sahifada “Oldingi” havolasi ishlamasligi kerak. Uni havola emas, oddiy `span` qiling va xira ko‘rsating:

```html
<li><span class="yoq" aria-hidden="true">‹</span></li>
```

```css
.sahifalash .yoq {
  opacity: 0.4;
}
```

## Ko‘p sahifalar

100 ta sahifani hammasini ko‘rsatmang: `1 … 4 5 6 … 100`. “…” uchun ham `span` ishlating.

## Xulosa

- `nav` ichida ro‘yxat, joriy sahifa `aria-current="page"`.
- Flex qator + `gap`, kataklar `min-width` va markazdagi raqam.
- Ishlamaydigan strelka — havola emas.
