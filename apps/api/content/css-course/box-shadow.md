## Blok soyasi: `box-shadow`

`box-shadow` elementga soya beradi va uni sahifadan “ko‘tarilgan” qilib ko‘rsatadi.

```css
.karta {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

Qiymatlar tartibi:

| #   | Qiymat              | Ma’nosi                                   |
| --- | ------------------- | ----------------------------------------- |
| 1   | `0`                 | Gorizontal siljish                        |
| 2   | `4px`               | Vertikal siljish                          |
| 3   | `12px`              | Xiralik                                   |
| 4   | (ixtiyoriy) `2px`   | Yoyilish — soyani kattalashtiradi/kichraytiradi |
| 5   | `rgba(…)`           | Rang                                      |
| —   | `inset`             | Ichki soya (boshida yoki oxirida)         |

## Tabiiy soya

Haqiqiy soyalar yumshoq va shaffof bo‘ladi. Qora `#000` soya qo‘pol ko‘rinadi:

```css
/* Qo‘pol */
box-shadow: 5px 5px 5px black;

/* Tabiiy */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.08);
```

Ikki qatlam: biri yaqin va aniq, ikkinchisi uzoq va yoyilgan — chuqurlik hissi beradi.

## Hover’da ko‘tarilish

```css
.karta {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.karta:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}
```

## Ichki soya

```css
.maydon {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
}
```

Element ichkariga botgandek ko‘rinadi — forma maydonlari uchun.

## Soya bilan chiziq

Xiraliksiz, faqat yoyilishli soya — joy egallamaydigan qo‘shimcha chegara:

```css
.tanlangan {
  box-shadow: 0 0 0 3px #fec400;
}
```

`outline` ga o‘xshaydi, lekin `border-radius` ga moslashadi va bir nechta “halqa” qilish mumkin.

## Soya va unumdorlik

Juda katta xiralikdagi ko‘p soyalarni animatsiya qilish sahifani sekinlashtirishi mumkin. Animatsiyada soyaning o‘zini emas, `opacity` sini o‘zgartirish tezroq (11-modul).

## Xulosa

- Tartib: x, y, xiralik, yoyilish, rang; `inset` — ichki soya.
- Tabiiy soya — yumshoq va shaffof, ko‘pincha ikki qatlamli.
- `0 0 0 3px rang` — joy egallamaydigan halqa.
