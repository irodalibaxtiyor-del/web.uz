## Fon rasmi: `background-image`

```css
.banner {
  background-image: url("rasmlar/tog.jpg");
}
```

`url()` ichida rasm manzili yoziladi — CSS fayliga nisbatan yo‘l yoki to‘liq manzil.

> **Muhim:** Fon rasmi bezak uchun. Ma’noga ega rasm (mahsulot surati, diagramma) `<img alt="...">` bilan qo‘yilishi kerak — fon rasmini ekran o‘qiydigan dasturlar ko‘rmaydi.

## Takrorlanish: `background-repeat`

Standart holda kichik rasm butun maydonni to‘ldirguncha **takrorlanadi**.

| Qiymat      | Natija                               |
| ----------- | ------------------------------------ |
| `repeat`    | Ikki yo‘nalishda takrorlash (standart) |
| `repeat-x`  | Faqat gorizontal                     |
| `repeat-y`  | Faqat vertikal                       |
| `no-repeat` | Bir marta                            |

```css
.naqsh {
  background-image: url("nuqta.png");
  background-repeat: repeat-x;
}
```

## Joylashuv: `background-position`

Rasm qayerda turishini belgilaydi:

```css
.kartochka {
  background-image: url("belgi.svg");
  background-repeat: no-repeat;
  background-position: right top; /* o‘ng yuqori burchak */
}
```

Qiymatlar: `left`, `center`, `right`, `top`, `bottom` yoki aniq masofa (`20px 10px`, `50% 50%`).

## O‘lcham: `background-size`

| Qiymat    | Natija                                                   |
| --------- | -------------------------------------------------------- |
| `auto`    | Asl o‘lcham (standart)                                   |
| `cover`   | Maydonni to‘liq qoplaydi, rasmning bir qismi kesilishi mumkin |
| `contain` | Rasm to‘liq ko‘rinadi, bo‘sh joy qolishi mumkin          |
| `200px`   | Aniq kenglik                                             |

```css
.hero {
  background-image: url("shahar.jpg");
  background-size: cover;
  background-position: center;
  min-height: 300px;
}
```

## Rasm o‘rniga gradient

`background-image` ga rasm o‘rniga **gradient** ham berish mumkin — fayl kerak emas:

```css
.hero {
  background-image: linear-gradient(#0071dc, #0e1133);
}
```

Gradientlar alohida darsda batafsil o‘rganiladi.

## Rasm yuklanmasa

Rasm topilmasa yoki sekin yuklansa, matn o‘qilishi uchun har doim mos `background-color` ham bering:

```css
.hero {
  background-color: #0e1133;
  background-image: url("shahar.jpg");
  color: white;
}
```

> **Platformada:** Ishga tushirish oynasi tashqi rasmlarni yuklamaydi. Mashqlarda gradient yoki `data:` manzilli rasmlardan foydalaning.

```tekshir
Fon rasmi butun maydonni qoplashi (kerak bo‘lsa kesilishi) uchun qaysi qiymat?
+ `background-size: cover`
- `background-size: contain`
- `background-repeat: cover`
> `cover` maydonni to‘liq qoplaydi, `contain` esa rasmni to‘liq ko‘rsatadi (bo‘sh joy qolishi mumkin).
```

```jonli
<style>
  .h { height: 140px; color: white; padding: 12px; background-color: #234;
      background-image: url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27600%27%20height=%27300%27%20viewBox=%270%200%20600%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%23c0392b%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f1c40f%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27600%27%20height=%27300%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27432%27%20cy=%2790%27%20r=%2748%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20300%20L0%20210%20L210%20135%20L360%20225%20L480%20180%20L600%20240%20L600%20300%20Z%27%20fill=%27%233b1a14%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E); background-size: cover; background-position: center; }
</style>
<div class="h">Fon rasmi + zaxira rang</div>
```

## Xulosa

- `background-image: url(...)` — fon rasmi, ma’noli rasmlar uchun esa `<img>`.
- `background-repeat`, `background-position`, `background-size` — takrorlanish, joy va o‘lcham.
- `cover` maydonni to‘liq qoplaydi; har doim zaxira `background-color` bering.
