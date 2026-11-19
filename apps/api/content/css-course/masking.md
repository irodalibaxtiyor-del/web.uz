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
<img src="https://picsum.photos/300" alt="" style="clip-path: circle(45%)">
<img src="https://picsum.photos/301" alt="" style="clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)">
<img src="https://picsum.photos/302" alt="" style="mask-image: linear-gradient(black, transparent)">
```

## Xulosa

- `clip-path: circle()`, `polygon()`, `inset()` — shakl bo‘yicha kesish.
- `mask-image` — gradient yoki rasm shaffofligi bo‘yicha niqob.
- Silliq so‘nish uchun `mask`, aniq shakl uchun `clip-path`.
