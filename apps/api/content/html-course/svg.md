## SVG nima?

**SVG** (Scalable Vector Graphics) — vektor grafika formati. SVG rasm piksellardan emas, **shakllarning tavsifidan** iborat: “bu yerda radiusi 40 bo‘lgan doira”. Shuning uchun u har qanday o‘lchamda tiniq ko‘rinadi — logotip va ikonkalar uchun ideal.

SVG to‘g‘ridan-to‘g‘ri HTML ichiga yozilishi mumkin:

```html
<svg width="200" height="120" viewBox="0 0 200 120">
  <circle cx="60" cy="60" r="40" fill="#0071dc" />
  <rect x="120" y="20" width="60" height="80" fill="#fec400" />
</svg>
```

## Asosiy shakllar

| Element     | Vazifasi     | Asosiy atributlar                 |
| ----------- | ------------ | --------------------------------- |
| `<rect>`    | To‘rtburchak | `x`, `y`, `width`, `height`, `rx` |
| `<circle>`  | Doira        | `cx`, `cy`, `r`                   |
| `<ellipse>` | Ellips       | `cx`, `cy`, `rx`, `ry`            |
| `<line>`    | Chiziq       | `x1`, `y1`, `x2`, `y2`            |
| `<polygon>` | Ko‘pburchak  | `points`                          |
| `<path>`    | Erkin shakl  | `d`                               |
| `<text>`    | Matn         | `x`, `y`                          |

## Rang va chegara

```html
<svg width="220" height="100">
  <rect
    x="10"
    y="10"
    width="200"
    height="80"
    rx="12"
    fill="#f5faff"
    stroke="#0071dc"
    stroke-width="3"
  />
  <text x="110" y="58" text-anchor="middle" font-size="22" fill="#0e1133">WEBDIZAYN</text>
</svg>
```

- `fill` — ichki rang;
- `stroke` — chegara rangi, `stroke-width` — uning qalinligi.

## Yulduz (ko‘pburchak)

```html
<svg width="120" height="120" viewBox="0 0 100 100">
  <polygon
    points="50,5 61,38 95,38 67,59 78,92 50,72 22,92 33,59 5,38 39,38"
    fill="gold"
    stroke="orange"
    stroke-width="2"
  />
</svg>
```

## `viewBox` — koordinatalar tizimi

`viewBox="0 0 100 100"` ichki koordinatalar 0–100 oralig‘ida ekanini bildiradi. SVG’ning haqiqiy o‘lchami (`width`/`height`) qanday bo‘lmasin, shakllar proporsional cho‘ziladi.

## SVG yoki Canvas?

|                 | SVG                                                     | Canvas                          |
| --------------- | ------------------------------------------------------- | ------------------------------- |
| Tur             | Vektor (shakllar)                                       | Rastr (piksellar)               |
| Kattalashtirish | Tiniq qoladi                                            | Xiralashadi                     |
| Elementlar      | Har bir shakl — DOM elementi, CSS va hodisalar ishlaydi | Bitta rasm                      |
| Yaxshi joyi     | Logotip, ikonka, diagramma                              | O‘yin, ko‘p obyektli animatsiya |

## Qulaylik

```html
<svg role="img" aria-labelledby="sarlavha" width="40" height="40">
  <title id="sarlavha">Qidiruv belgisi</title>
  ...
</svg>
```

## Xulosa

- SVG — HTML ichida yoziladigan vektor grafika, har qanday o‘lchamda tiniq.
- `rect`, `circle`, `line`, `polygon`, `path`, `text` — asosiy shakllar; `fill` va `stroke` — ranglar.
- Logotip va ikonkalar uchun SVG, murakkab animatsiya va o‘yinlar uchun Canvas qulay.
