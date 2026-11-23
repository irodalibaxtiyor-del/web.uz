## Niqoblash va kesish

Ba’zan elementning faqat **bir qismi** ko‘rinishi kerak: doira, uchburchak, silliq so‘nayotgan chet. Buning uchun ikki vosita bor: `clip-path` va `mask`.

## `clip-path` — shakl bo‘yicha kesish

```css
.doira {
  clip-path: circle(50%);
}

.ellips {
  clip-path: ellipse(50% 35%);
}

.uchburchak {
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```

Shakldan tashqaridagi hamma narsa — fon, chegara, soya — ko‘rinmaydi.

| Funksiya     | Shakl                                    |
| ------------ | ---------------------------------------- |
| `circle()`   | Doira: `circle(50% at center)`           |
| `ellipse()`  | Ellips                                   |
| `inset()`    | Ichkariga surilgan to‘rtburchak, yumaloq burchak bilan: `inset(10px round 12px)` |
| `polygon()`  | Istalgan ko‘pburchak — nuqtalar ro‘yxati |

### Qiya banner

```css
.qahramon {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}
```

Bannerning pastki cheti qiya bo‘ladi.

## `mask` — shaffoflik bo‘yicha

`mask` rasm yoki gradientning **shaffofligidan** foydalanadi: niqob qora (shaffof emas) bo‘lgan joyda element ko‘rinadi, shaffof joyda — yo‘q.

```css
.sonuvchi {
  mask-image: linear-gradient(to bottom, black 60%, transparent);
}
```

Elementning pastki qismi silliq so‘nadi. Uzun matnning “davomi bor” effekti uchun qulay.

```css
.ikonka {
  width: 24px;
  height: 24px;
  background-color: currentColor;
  mask: url("ikonka.svg") center / contain no-repeat;
}
```

SVG ikonka shaklida kesilgan rangli quti — rang `color` bilan boshqariladi.

## Farqi

| `clip-path`                       | `mask`                              |
| --------------------------------- | ----------------------------------- |
| Geometrik shakl, keskin chet      | Rasm/gradient, silliq chet mumkin   |
| Yozish oson                       | Ko‘proq imkoniyat                   |
| Animatsiya qilsa bo‘ladi (bir xil nuqtalar soni bilan) | Gradient niqobi bilan effektlar |

## Muhim

Kesilgan qism ko‘rinmaydi, lekin element **joyi o‘zgarmaydi** va sichqoncha hodisalari faqat ko‘rinadigan qismda ishlaydi.

```tekshir
Elementni olti burchak shaklida kesish uchun qaysi xususiyat?
+ `clip-path: polygon(...)`
- `border-radius: polygon`
- `mask-shape: hexagon`
> `clip-path` aniq shakllar (`circle`, `polygon`, `inset`) bo‘yicha kesadi.
```

```jonli
<style>
  img { width: 140px; height: 140px; object-fit: cover; margin: 4px; }
</style>
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27300%27%20viewBox=%270%200%20300%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%2316a085%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23a8e6ff%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27300%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2790%27%20r=%2748%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20300%20L0%20210%20L105%20135%20L180%20225%20L240%20180%20L300%20240%20L300%20300%20Z%27%20fill=%27%230b3b33%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" style="clip-path: circle(45%)">
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27301%27%20height=%27301%27%20viewBox=%270%200%20301%20301%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230071dc%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f5a623%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27301%27%20height=%27301%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27217%27%20cy=%2790%27%20r=%2748%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20301%20L0%20211%20L105%20135%20L181%20226%20L241%20181%20L301%20241%20L301%20301%20Z%27%20fill=%27%23123456%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" style="clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)">
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27302%27%20height=%27302%27%20viewBox=%270%200%20302%20302%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%232e8b57%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ffe08a%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27302%27%20height=%27302%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27217%27%20cy=%2791%27%20r=%2748%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20302%20L0%20211%20L106%20136%20L181%20227%20L242%20181%20L302%20242%20L302%20302%20Z%27%20fill=%27%231b3a2b%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" style="mask-image: linear-gradient(black, transparent)">
```

## Xulosa

- `clip-path: circle()`, `polygon()`, `inset()` — shakl bo‘yicha kesish.
- `mask-image` — gradient yoki rasm shaffofligi bo‘yicha niqob.
- Silliq so‘nish uchun `mask`, aniq shakl uchun `clip-path`.
