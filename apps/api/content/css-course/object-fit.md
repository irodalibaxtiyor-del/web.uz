## `object-fit` va `object-position`

Rasmga aniq `width` va `height` berilsa, lekin nisbati boshqacha bo‘lsa, standart holda rasm **cho‘ziladi**. `object-fit` rasmning berilgan qutiga qanday sig‘ishini belgilaydi.

| Qiymat       | Natija                                                    |
| ------------ | --------------------------------------------------------- |
| `fill`       | Qutini to‘ldiradi, rasm cho‘ziladi (standart)            |
| `cover`      | Qutini to‘ldiradi, nisbat saqlanadi, ortiqchasi kesiladi |
| `contain`    | Rasm to‘liq ko‘rinadi, bo‘sh joy qolishi mumkin           |
| `none`       | Asl o‘lchamda, qutidan tashqari qismi kesiladi            |
| `scale-down` | `none` va `contain` dan kichigi                           |

```css
.karta img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
```

Har xil o‘lchamdagi rasmlar kartochkalarda bir xil balandlikda, cho‘zilmasdan turadi.

## `contain` qachon?

Logotiplar, mahsulot rasmlari — ularning hech bir qismi kesilmasligi kerak:

```css
.logo {
  width: 160px;
  height: 80px;
  object-fit: contain;
}
```

## `object-position`

`cover` rasmning qaysi qismini qoldirishini `object-position` belgilaydi. Standart — markaz:

```css
.portret {
  object-fit: cover;
  object-position: top; /* yuz kesilib ketmasin */
}

.manzara {
  object-position: 30% 70%;
}
```

## `aspect-ratio` bilan

Balandlikni piksel bilan emas, **nisbat** bilan berish mumkin:

```css
.galereya img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

Rasm har qanday kenglikda 16:9 bo‘lib qoladi.

## Video ham

`object-fit` `<video>` uchun ham ishlaydi:

```css
.fon-video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}
```

## Fon rasmi bilan farqi

`background-size: cover` (10-modul) — **fon** rasmi uchun. `object-fit: cover` — HTML’dagi `<img>` va `<video>` uchun. Ma’noli rasm (`alt` kerak) uchun `<img>` + `object-fit` to‘g‘ri tanlov.

## Xulosa

- `object-fit: cover` — cho‘zmasdan to‘ldirish, `contain` — to‘liq ko‘rsatish.
- `object-position` — qaysi qism ko‘rinib qolishi.
- `aspect-ratio` bilan birga — bir xil nisbatli rasmlar.
