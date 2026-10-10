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

## Xulosa

- `background-image: url(...)` — fon rasmi, ma’noli rasmlar uchun esa `<img>`.
- `background-repeat`, `background-position`, `background-size` — takrorlanish, joy va o‘lcham.
- `cover` maydonni to‘liq qoplaydi; har doim zaxira `background-color` bering.
