## Ranglar qanday beriladi?

HTML elementlarining rangi CSS orqali beriladi. Rangni yozishning bir nechta usuli bor.

## 1. Nom bilan

Brauzer 140 dan ortiq rang nomini biladi: `red`, `green`, `navy`, `tomato`, `gold`, `teal`, `orchid`...

```html
<p style="color: tomato;">Pomidor rangidagi matn</p>
<div style="background-color: gold;">Oltin fon</div>
```

## 2. RGB

Har bir rang qizil (Red), yashil (Green) va ko‘k (Blue) yorug‘likning aralashmasi. Har bir qism 0 dan 255 gacha:

```html
<p style="color: rgb(0, 113, 220);">Ko‘k</p>
<p style="color: rgb(0, 0, 0);">Qora — hamma qism 0</p>
<p style="color: rgb(255, 255, 255); background: black;">Oq — hamma qism 255</p>
```

**Shaffoflik** uchun to‘rtinchi qiymat qo‘shiladi (0 — to‘liq shaffof, 1 — to‘liq ko‘rinadi):

```html
<div style="background-color: rgb(0 113 220 / 0.2);">Och ko‘k, yarim shaffof fon</div>
```

## 3. HEX (o‘n oltilik)

`#RRGGBB` ko‘rinishida: har bir juftlik `00` dan `ff` gacha.

```html
<p style="color: #0071dc;">Ko‘k</p>
<p style="color: #ff0000;">Qizil</p>
<p style="color: #333;">To‘q kulrang (qisqa yozuv: #333 = #333333)</p>
```

Dizaynerlar ko‘pincha HEX bilan ishlaydi — Figma kabi dasturlar ranglarni shu ko‘rinishda beradi.

## 4. HSL

HSL — rang (Hue, 0–360 daraja), to‘yinganlik (Saturation, %) va yorug‘lik (Lightness, %):

```html
<p style="color: hsl(210, 100%, 43%);">Ko‘k</p>
<p style="color: hsl(210, 100%, 80%);">Xuddi shu ko‘k, lekin ochroq</p>
```

HSL qulayligi: bir rangning ochroq yoki to‘qroq variantini olish uchun faqat oxirgi qiymatni o‘zgartirasiz.

## Fon, matn va chegara ranglari

```html
<h2 style="background-color: #f5faff; color: #0e1133; border: 2px solid #0071dc;">Sarlavha</h2>
```

## Kontrast haqida

Matn va fon rangi orasida yetarli farq bo‘lsin. Och kulrang fonda och kulrang matnni ko‘pchilik o‘qiy olmaydi. Bu ayniqsa ko‘rish qobiliyati past foydalanuvchilar uchun muhim.

## Xulosa

- Rang nomi, `rgb()`, `#hex` yoki `hsl()` bilan beriladi.
- `color` — matn, `background-color` — fon, `border` — chegara rangi.
- Matn va fon o‘rtasida yaxshi kontrast bo‘lishiga e’tibor bering.
