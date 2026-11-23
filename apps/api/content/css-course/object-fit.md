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

```tekshir
Rasm o‘lchamli ramkani cho‘zilmasdan to‘ldirishi (ortiqcha qismi kesilishi) uchun nima yoziladi?
+ `object-fit: cover`
- `object-fit: fill`
- `object-fit: contain`
> `fill` cho‘zadi, `contain` to‘liq ko‘rsatadi, `cover` nisbatni saqlab to‘ldiradi.
```

```jonli
<style>
  img { width: 120px; height: 120px; border: 1px solid #ccc; margin: 4px; }
</style>
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27150%27%20viewBox=%270%200%20300%20150%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%238e44ad%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ff7f50%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27150%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2745%27%20r=%2724%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20150%20L0%20105%20L105%2068%20L180%20113%20L240%2090%20L300%20120%20L300%20150%20Z%27%20fill=%27%232c1b3a%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" style="object-fit: fill">
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27150%27%20viewBox=%270%200%20300%20150%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%23c0392b%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f1c40f%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27150%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2745%27%20r=%2724%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20150%20L0%20105%20L105%2068%20L180%20113%20L240%2090%20L300%20120%20L300%20150%20Z%27%20fill=%27%233b1a14%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" style="object-fit: contain">
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27150%27%20viewBox=%270%200%20300%20150%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%2316a085%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23a8e6ff%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27150%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2745%27%20r=%2724%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20150%20L0%20105%20L105%2068%20L180%20113%20L240%2090%20L300%20120%20L300%20150%20Z%27%20fill=%27%230b3b33%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="" style="object-fit: cover">
```

## Xulosa

- `object-fit: cover` — cho‘zmasdan to‘ldirish, `contain` — to‘liq ko‘rsatish.
- `object-position` — qaysi qism ko‘rinib qolishi.
- `aspect-ratio` bilan birga — bir xil nisbatli rasmlar.
