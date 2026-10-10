## `style` atributi

Elementning rangi, shrifti, o‘lchami kabi ko‘rinishini `style` atributi orqali berish mumkin:

```html
<p style="color: navy;">To‘q ko‘k matn</p>
```

Yozilish shakli: `style="xususiyat: qiymat;"`. Bir nechta xususiyat nuqta-vergul bilan ajratiladi:

```html
<h1 style="color: white; background-color: teal; text-align: center;">Xush kelibsiz</h1>
```

## Asosiy xususiyatlar

| Xususiyat          | Nima qiladi          | Misol                             |
| ------------------ | -------------------- | --------------------------------- |
| `background-color` | Fon rangi            | `background-color: lightyellow;`  |
| `color`            | Matn rangi           | `color: crimson;`                 |
| `font-family`      | Shrift               | `font-family: Arial, sans-serif;` |
| `font-size`        | Shrift o‘lchami      | `font-size: 20px;`                |
| `text-align`       | Gorizontal tekislash | `text-align: center;`             |

## Misol: kichik e’lon kartochkasi

```html
<div style="background-color: #f1f8ff; padding: 16px; font-family: sans-serif;">
  <h2 style="color: #0071dc; font-size: 22px;">Yangi kurs!</h2>
  <p style="text-align: justify;">Ertadan boshlab HTML bo‘yicha amaliy darslar boshlanadi.</p>
</div>
```

## Qachon `style` ishlatiladi?

`style` atributi bitta elementni tez sozlash uchun qulay. Lekin katta loyihada har bir elementga alohida uslub yozish noqulay va takrorlanuvchi bo‘ladi. Shu sababli uslublar odatda alohida CSS faylga yoziladi — bu haqda “HTML va CSS” darsida batafsil gaplashamiz.

## Xulosa

- `style="xususiyat: qiymat;"` — elementga to‘g‘ridan-to‘g‘ri uslub beradi.
- `color`, `background-color`, `font-family`, `font-size`, `text-align` — eng kerakli xususiyatlar.
- Katta loyihalarda uslublarni alohida CSS faylga chiqaring.
