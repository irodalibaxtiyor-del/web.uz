## Fill turlari

Figma’da qatlamning **Fill** bo‘limida bir yoki bir nechta to‘ldirish bo‘ladi: rang (Solid), gradient (Linear, Radial, Angular), rasm (Image).

## Solid

```css
background-color: #0071dc;
```

Matn qatlamida Fill — matn rangi (`color`).

## Linear gradient

Figma gradientni chiziq bilan ko‘rsatadi; Dev Mode esa uni CSS’da beradi:

```css
.banner {
  background-image: linear-gradient(90deg, #0071dc, #005bb5);
}
```

- `90deg` — chapdan o‘ngga, `180deg` — tepadan pastga (CSS standarti);
- rang to‘xtash nuqtalari: `linear-gradient(90deg, #0071dc 0%, #005bb5 100%)`.

Figma’dagi burchak CSS’dagidan farq qilishi mumkin (Figma gradient chizig‘i freymning nisbatiga bog‘liq). Dev Mode bergan qiymat odatda to‘g‘ri; qo‘lda hisoblasangiz, natijani maket bilan solishtiring.

## Bir nechta fill

Figma’da fill’lar qatlamlanadi: pastda rasm, ustida yarim shaffof qorong‘i rang. CSS’da `background-image` vergul bilan, **birinchisi eng ustda**:

```css
.hero {
  background-image: linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)), url('hero.jpg');
}
```

Figma’da tartib teskari ko‘rinadi (ro‘yxatda yuqoridagi — ustda) — e’tibor bering.

## Ikki xil shaffoflik

| Figma                                     | Nima xiralashadi                   | CSS                    |
| ----------------------------------------- | ---------------------------------- | ---------------------- |
| **Layer opacity** 60% (qatlamning o‘zida) | Butun element: fon, matn, bolalari | `opacity: 0.6`         |
| **Fill opacity** 60% (rang yonida)        | Faqat shu fill                     | `rgb(0 113 220 / 0.6)` |

Ko‘p uchraydigan xato: Fill opacity’ni `opacity` bilan yozish. Natijada matn ham xiralashadi va o‘qilmay qoladi.

## Blend mode

Figma’dagi _Multiply_, _Screen_ kabi aralashtirish rejimlari CSS’da `mix-blend-mode` (element) va `background-blend-mode` (fon qatlamlari). Ular ko‘zga chiroyli, lekin rang kontrastini taxmin qilishni qiyinlashtiradi — matn ostida ehtiyotkorlik bilan.

Mashqda gradient banner va ikki xil shaffoflikni yozasiz.
