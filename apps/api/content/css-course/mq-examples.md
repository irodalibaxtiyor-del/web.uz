## Media so‘rov misollari

Amalda eng ko‘p uchraydigan holatlar.

## 1. Menyu: telefonda ustma-ust, kompyuterda qatorda

```css
.menyu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (min-width: 768px) {
  .menyu {
    flex-direction: row;
    gap: 16px;
  }
}
```

## 2. Ustunlar soni

```css
.kartalar {
  display: grid;
  gap: 16px;
}

@media (min-width: 600px) {
  .kartalar {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .kartalar {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

1 → 2 → 4 ustun.

## 3. Yashirish va ko‘rsatish

```css
.faqat-katta {
  display: none;
}

@media (min-width: 1024px) {
  .faqat-katta {
    display: block;
  }
}
```

> Ehtiyot bo‘ling: telefondan kirgan foydalanuvchi ham kerakli ma’lumotni olishi kerak. Muhim kontentni kichik ekranda yashirmang — uni boshqacha joylashtiring.

## 4. Shrift o‘lchami

```css
html {
  font-size: 100%;
}

@media (min-width: 1280px) {
  html {
    font-size: 112.5%; /* 18px — katta ekranda o‘qish qulayroq */
  }
}
```

Hamma `rem` qiymatlar avtomatik kattalashadi.

## 5. Faqat sichqoncha uchun hover

```css
@media (hover: hover) {
  .karta:hover {
    transform: translateY(-4px);
  }
}
```

## 6. Qorong‘i rejim

```css
:root {
  --fon: #ffffff;
  --matn: #0e1133;
}

@media (prefers-color-scheme: dark) {
  :root {
    --fon: #0b1020;
    --matn: #e5e7eb;
  }
}
```

## 7. Chop etish

```css
@media print {
  nav,
  .reklama,
  footer {
    display: none;
  }

  body {
    color: black;
    background: white;
  }

  a::after {
    content: " (" attr(href) ")";
  }
}
```

Chop etilgan sahifada menyular kerak emas, havolalarning manzili esa ko‘rinib turadi.

## Xulosa

- Menyu yo‘nalishi, ustunlar soni, shrift o‘lchami — eng ko‘p uchraydigan o‘zgarishlar.
- Kontentni yashirish o‘rniga qayta joylashtiring.
- `hover`, `prefers-color-scheme`, `print` — ekran kengligidan tashqari shartlar.
