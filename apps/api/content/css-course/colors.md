## Rang qayerda ishlatiladi?

CSS’da rangni deyarli hamma narsaga berish mumkin:

| Xususiyat          | Nimaning rangi             |
| ------------------ | -------------------------- |
| `color`            | Matn                       |
| `background-color` | Fon                        |
| `border-color`     | Chegara                    |
| `outline-color`    | Kontur                     |
| `text-decoration-color` | Tagiga chizilgan chiziq |

```css
.eslatma {
  color: #0e1133;
  background-color: #fff8db;
  border: 2px solid #fec400;
}
```

## Rangni yozish usullari

Bitta rangni bir necha xil yozish mumkin. Quyidagilarning hammasi bir xil qizil:

```css
p { color: red; }
p { color: rgb(255, 0, 0); }
p { color: #ff0000; }
p { color: hsl(0, 100%, 50%); }
```

| Usul    | Misol                  | Qachon qulay                           |
| ------- | ---------------------- | -------------------------------------- |
| Nom     | `tomato`, `navy`       | Tez sinab ko‘rish                      |
| RGB     | `rgb(0, 113, 220)`     | Qizil-yashil-ko‘k ulushini bilganda    |
| HEX     | `#0071dc`              | Dizayn dasturlaridan nusxa olganda     |
| HSL     | `hsl(210, 100%, 43%)`  | Rangni och yoki to‘q qilganda          |

Keyingi darslarda har birini alohida ko‘rib chiqamiz.

## Rang nomlari

Brauzerlar 140 dan ortiq rang nomini biladi: `red`, `blue`, `gold`, `crimson`, `teal`, `slategray` va hokazo.

```css
h1 { color: crimson; }
.fon { background-color: whitesmoke; }
```

Nomlar eslab qolish uchun qulay, lekin tanlov cheklangan. Haqiqiy loyihada brend ranglari odatda HEX yoki RGB’da beriladi.

## Maxsus kalit so‘zlar

- `transparent` — to‘liq shaffof;
- `currentcolor` — elementning joriy matn rangi:

```css
.tugma {
  color: #0071dc;
  border: 2px solid currentcolor; /* chegara ham ko‘k */
}
```

## Kontrast — o‘qilishi muhim

Chiroyli rang yetarli emas — matn fonda **aniq o‘qilishi** kerak. Och kulrang fonda och sariq matn ko‘pchilik uchun ko‘rinmaydi.

- Oddiy matn uchun kontrast nisbati kamida **4.5:1** bo‘lishi tavsiya etiladi.
- Brauzer DevTools’i rangni tanlaganda kontrast nisbatini ko‘rsatadi.
- Faqat rang bilan ma’no bermang (masalan, xatoni faqat qizil bilan): matn yoki ikonka ham qo‘shing.

## Xulosa

- `color` — matn, `background-color` — fon, `border-color` — chegara rangi.
- Rang nomi, RGB, HEX va HSL — bir xil rangni yozishning turli usullari.
- Matn va fon o‘rtasida yetarli kontrast bo‘lsin.
