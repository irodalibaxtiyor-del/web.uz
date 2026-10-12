## Radial va konussimon gradientlar

## `radial-gradient`

Radial gradient markazdan tashqariga, doira yoki ellips bo‘ylab tarqaladi:

```css
.dog {
  background-image: radial-gradient(#fec400, #0071dc);
}
```

Standart holda shakl — elementga moslashgan **ellips**, markazi — o‘rtada.

## Shakl va o‘lcham

```css
radial-gradient(circle, #fec400, #0071dc)
radial-gradient(circle 80px, #fec400, #0071dc)
radial-gradient(circle closest-side, #fec400, #0071dc)
```

| Kalit so‘z        | Gradient qayergacha yetadi         |
| ----------------- | ---------------------------------- |
| `closest-side`    | Eng yaqin tomongacha               |
| `farthest-corner` | Eng uzoq burchakkacha (standart)   |
| `80px`            | Aniq radius (faqat doira uchun)    |

## Markaz

```css
radial-gradient(circle at top left, #fec400, transparent 60%)
radial-gradient(circle at 30% 40%, white, #0071dc)
```

`at` dan keyin markaz joyi: kalit so‘z yoki foiz.

## Yorug‘lik dog‘lari

Bir nechta radial gradient — zamonaviy “yorug‘ dog‘li” fonlar:

```css
.qahramon {
  background:
    radial-gradient(circle at 20% 30%, rgba(254, 196, 0, 0.4), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(0, 113, 220, 0.4), transparent 40%),
    #0e1133;
}
```

Oxirgi qatlam — oddiy fon rangi.

## Nuqtali naqsh

```css
.nuqtalar {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 16px 16px;
}
```

Har 16px da kichik nuqta — rasm faylisiz.

## `conic-gradient`

Konussimon gradient ranglar **markaz atrofida aylanadi** — soat millari kabi:

```css
.diagramma {
  width: 160px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(
    #0071dc 0 60%,
    #fec400 60% 85%,
    #e5e7eb 85% 100%
  );
}
```

Natija — doiraviy diagramma: 60% ko‘k, 25% sariq, 15% kulrang.

> Diagrammadagi ma’lumotlarni faqat rang bilan bermang: yoniga matn yoki jadval ham qo‘shing.

## Xulosa

- `radial-gradient(shakl o‘lcham at markaz, ranglar)`.
- Bir nechta radial gradient — yorug‘lik dog‘lari, `background-size` bilan — naqsh.
- `conic-gradient` — aylanma ranglar, doiraviy diagrammalar.
