## CSS qoidasining tuzilishi

Har bir CSS qoidasi ikki qismdan iborat: **selektor** va **e’lonlar bloki**.

```css
h1 {
  color: navy;
  font-size: 32px;
}
```

| Qism         | Misolda           | Vazifasi                                 |
| ------------ | ----------------- | ---------------------------------------- |
| Selektor     | `h1`              | Qaysi elementlarga qo‘llanishi           |
| E’lon        | `color: navy;`    | Bitta xususiyat va uning qiymati         |
| Xususiyat    | `color`           | Nimani o‘zgartirish                      |
| Qiymat       | `navy`            | Qanday qilib o‘zgartirish                |

## Yozish qoidalari

- E’lonlar bloki `{` va `}` qavslar ichida yoziladi.
- Xususiyat va qiymat orasiga **ikki nuqta** `:` qo‘yiladi.
- Har bir e’lon **nuqtali vergul** `;` bilan tugaydi.
- Bo‘sh joy va yangi qatorlar ahamiyatsiz — ular faqat o‘qishni osonlashtiradi.

Quyidagi ikki yozuv bir xil ishlaydi:

```css
p { color: #333; line-height: 1.6; }

p {
  color: #333;
  line-height: 1.6;
}
```

Amalda ikkinchi uslub (har e’lon alohida qatorda) qulayroq: kod tartibli, xatoni topish oson.

## Oxirgi nuqtali vergul

Blokdagi oxirgi e’londan keyin `;` majburiy emas, lekin uni har doim yozing. Aks holda keyinroq yangi qator qo‘shganingizda xato qilish oson:

```css
/* Xato: birinchi qatordan keyin ; yo‘q */
p {
  color: #333
  font-size: 18px;
}
```

Bu holda brauzer `color` va `font-size` ni bitta noto‘g‘ri e’lon deb hisoblab, ikkalasini ham e’tiborsiz qoldiradi.

## Bir nechta selektor

Bir xil uslubni bir nechta elementga berish uchun selektorlarni vergul bilan ajrating:

```css
h1,
h2,
h3 {
  font-family: Georgia, serif;
  color: #0e1133;
}
```

## Registr

Xususiyat nomlari va ko‘pchilik qiymatlar registrga sezgir emas (`COLOR: RED` ham ishlaydi), lekin umumiy qabul qilingan uslub — **kichik harflar**. Klass va id nomlari esa registrga sezgir: `.Karta` va `.karta` — turli klasslar.

## Xulosa

- Qoida = selektor + `{ xususiyat: qiymat; }`.
- Har bir e’lonni `;` bilan tugating, oxirgisini ham.
- Bir nechta selektor vergul bilan yoziladi.
