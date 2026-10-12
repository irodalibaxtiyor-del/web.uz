## Vertikal menyu

Navigatsiya menyusi — bu havolalar ro‘yxati. Shuning uchun uning HTML’i odatda shunday:

```html
<nav class="yon-menyu" aria-label="Bo‘limlar">
  <ul>
    <li><a href="#" aria-current="page">Bosh sahifa</a></li>
    <li><a href="#">Kurslar</a></li>
    <li><a href="#">Aloqa</a></li>
  </ul>
</nav>
```

## 1-qadam: ro‘yxatni tozalash

```css
.yon-menyu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 220px;
}
```

## 2-qadam: havolani blokka aylantirish

```css
.yon-menyu a {
  display: block;
  padding: 10px 16px;
  color: #0e1133;
  text-decoration: none;
}
```

`display: block` muhim: endi faqat matn emas, **butun qator** bosiladi. Bu, ayniqsa, telefonda qulay.

## 3-qadam: hover va joriy sahifa

```css
.yon-menyu a:hover {
  background-color: #f5faff;
}

.yon-menyu a[aria-current="page"] {
  background-color: #0071dc;
  color: white;
}
```

Joriy sahifani `.faol` klassi o‘rniga `aria-current="page"` atributi bilan belgilash yaxshiroq: ekran o‘quvchi “joriy sahifa” deb e’lon qiladi, CSS esa shu atributga qarab uslub beradi.

## Ajratuvchi chiziqlar

```css
.yon-menyu li + li {
  border-top: 1px solid #e5e7eb;
}
```

## Yopishqoq yon menyu

Uzun sahifada menyu ko‘rinib turishi uchun:

```css
.yon-menyu {
  position: sticky;
  top: 16px;
}
```

## Xulosa

- Menyu — `nav` ichidagi `ul` ro‘yxat.
- `list-style: none`, `margin: 0`, `padding: 0` bilan tozalanadi.
- Havolalar `display: block` — butun qator bosiladi.
- Joriy sahifa uchun `aria-current="page"`.
