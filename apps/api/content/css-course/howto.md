## CSS’ni sahifaga ulashning uch usuli

| Usul             | Qayerda yoziladi                 | Qachon qulay                         |
| ---------------- | -------------------------------- | ------------------------------------ |
| Tashqi fayl      | Alohida `.css` fayl              | Deyarli har doim                     |
| Ichki uslub      | `<head>` dagi `<style>` bloki    | Bitta sahifaga xos uslub             |
| Inline uslub     | Elementning `style` atributi     | Juda kam, istisno holatlarda         |

## 1. Tashqi CSS fayl

Uslublar alohida faylga yoziladi va `<head>` ichida `<link>` bilan ulanadi:

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

`style.css`:

```css
body {
  background-color: #f5faff;
}

h1 {
  color: #0071dc;
}
```

Afzalliklari:

- bitta fayl butun saytga xizmat qiladi;
- brauzer faylni **keshlaydi** — keyingi sahifalar tezroq ochiladi;
- HTML toza qoladi.

> **E’tibor bering:** CSS faylida `<style>` tegi yozilmaydi — faqat qoidalar.

## 2. Ichki uslub: `<style>`

```html
<head>
  <style>
    h1 {
      color: crimson;
    }
  </style>
</head>
```

Faqat shu sahifaga ta’sir qiladi. Kichik misollar va bitta sahifali loyihalar uchun qulay.

## 3. Inline uslub: `style` atributi

```html
<h1 style="color: crimson; text-align: center;">Aksiya!</h1>
```

Faqat shu bitta elementga ta’sir qiladi. Kamchiliklari:

- uslub HTML ichiga aralashadi;
- qayta ishlatib bo‘lmaydi;
- ustunligi juda yuqori, keyinroq CSS faylidan o‘zgartirish qiyin.

## Bir nechta usul birga bo‘lsa

Agar bitta xususiyat bir necha joyda berilsa, odatda **elementga eng yaqini** ustun keladi:

1. inline `style` — eng kuchli;
2. `<style>` bloki va tashqi fayl — qaysi biri **keyinroq** yozilgan bo‘lsa, o‘sha;
3. brauzerning standart uslubi — eng kuchsiz.

```html
<head>
  <link rel="stylesheet" href="style.css"> <!-- h1 { color: blue; } -->
  <style>
    h1 { color: green; } /* keyinroq yozilgan — shu ustun */
  </style>
</head>
```

## Bir nechta CSS fayl

Katta saytlarda uslublar bir nechta faylga bo‘linadi:

```html
<link rel="stylesheet" href="css/asosiy.css">
<link rel="stylesheet" href="css/formalar.css">
```

## Xulosa

- Asosiy usul — tashqi fayl va `<link rel="stylesheet">`.
- `<style>` bitta sahifa uchun, `style` atributi faqat istisno holatlar uchun.
- Bir xil kuchdagi qoidalardan keyinroq yozilgani ustun keladi.
