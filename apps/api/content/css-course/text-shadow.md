## Matn soyasi: `text-shadow`

`text-shadow` matn harflariga soya beradi.

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

Qiymatlar tartibi:

| #   | Qiymat            | Ma’nosi                                 |
| --- | ----------------- | --------------------------------------- |
| 1   | `2px`             | Gorizontal siljish (o‘ngga musbat)      |
| 2   | `2px`             | Vertikal siljish (pastga musbat)        |
| 3   | `4px`             | Xiralik radiusi (ixtiyoriy)             |
| 4   | `rgba(0,0,0,0.3)` | Rang (ixtiyoriy, standart — matn rangi) |

## Turli effektlar

**Yengil soya** — fotosurat ustidagi oq matnni o‘qiladigan qiladi:

```css
.banner h1 {
  color: white;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}
```

**Nur (glow)** — siljishsiz, faqat xiralik:

```css
.neon {
  color: #fff;
  text-shadow: 0 0 8px #00e5ff;
}
```

**Keskin soya** — xiraliksiz:

```css
.retro {
  text-shadow: 3px 3px 0 #fec400;
}
```

## Bir nechta soya

Soyalarni vergul bilan ajratib, ketma-ket qo‘yish mumkin. Birinchisi eng ustda chiziladi:

```css
.kontur {
  color: white;
  text-shadow:
    -1px -1px 0 #0e1133,
    1px -1px 0 #0e1133,
    -1px 1px 0 #0e1133,
    1px 1px 0 #0e1133;
}
```

## Ehtiyot bo‘ling

- Soya matnni o‘qishni **osonlashtirishi** kerak, qiyinlashtirmasin. Oddiy paragraflarga soya bermang.
- `text-shadow` joy egallamaydi: qo‘shni elementlar surilmaydi.
- Soyani o‘chirish: `text-shadow: none`.

## Xulosa

- Tartib: x, y, xiralik, rang.
- Siljishsiz katta xiralik — nur effekti; xiraliksiz — keskin soya.
- Bir nechta soya vergul bilan yoziladi.
