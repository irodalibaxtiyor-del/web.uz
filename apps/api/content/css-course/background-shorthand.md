## Qisqa yozuv: `background`

Fon xususiyatlarini alohida-alohida yozish uzun bo‘ladi:

```css
.hero {
  background-color: #0e1133;
  background-image: url("tog.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
```

Ularning hammasini bitta `background` xususiyatiga jamlash mumkin:

```css
.hero {
  background: #0e1133 url("tog.jpg") no-repeat center / cover;
}
```

## Tartib

Qiymatlar odatda shu tartibda yoziladi (ba’zilarini tushirib qoldirish mumkin):

1. `background-color`
2. `background-image`
3. `background-repeat`
4. `background-attachment`
5. `background-position` / `background-size`

> **E’tibor bering:** `background-size` faqat `background-position` dan keyin, `/` orqali yoziladi: `center / cover`.

## Faqat rang

Eng ko‘p uchraydigan holat — faqat fon rangi:

```css
.karta {
  background: white;
}
```

## Qisqa yozuvning “tuzog‘i”

Qisqa yozuv **yozilmagan** qiymatlarni standartga qaytaradi. Quyidagi misolda ikkinchi qoida rasmni o‘chirib yuboradi:

```css
.hero {
  background-image: url("tog.jpg");
  background: #0e1133; /* image endi none! */
}
```

To‘g‘ri yo‘l — avval qisqa yozuv, keyin alohida xususiyatlar:

```css
.hero {
  background: #0e1133 url("tog.jpg") no-repeat center;
  background-size: cover;
}
```

## Bir nechta fon

Vergul bilan bir nechta fon qatlami beriladi — birinchisi eng ustda:

```css
.banner {
  background:
    linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)),
    url("shahar.jpg") center / cover;
}
```

Bu yerda rasm ustiga yarim shaffof qora qatlam qo‘yilgan — matn o‘qilishi osonlashadi. Rang faqat **oxirgi** qatlamda yozilishi mumkin.

## Xulosa

- `background` — fon xususiyatlarining qisqa yozuvi.
- `size` faqat `position` dan keyin `/` bilan yoziladi.
- Qisqa yozuv tushirib qoldirilgan qiymatlarni standartga qaytaradi.
