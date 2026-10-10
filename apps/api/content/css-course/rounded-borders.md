## Yumaloq burchaklar: `border-radius`

`border-radius` elementning burchaklarini yumaloqlaydi:

```css
.karta {
  border: 1px solid #ddd;
  border-radius: 12px;
}
```

U chegara bo‘lmasa ham ishlaydi — fon burchaklari ham yumaloqlanadi:

```css
.tugma {
  background-color: #0071dc;
  color: white;
  border-radius: 8px;
}
```

## Har bir burchak alohida

To‘rt qiymat — chap yuqoridan boshlab soat mili bo‘yicha:

```css
.yorliq {
  border-radius: 12px 12px 0 0; /* faqat yuqori burchaklar yumaloq */
}
```

| Qiymatlar soni | Ma’nosi                                                   |
| -------------- | --------------------------------------------------------- |
| 1              | To‘rt burchak bir xil                                     |
| 2              | Chap-yuqori va o‘ng-past / o‘ng-yuqori va chap-past       |
| 4              | Chap-yuqori, o‘ng-yuqori, o‘ng-past, chap-past             |

Har bir burchakning o‘z xususiyati ham bor: `border-top-left-radius`, `border-bottom-right-radius` va hokazo.

## Doira va “tabletka”

```css
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%; /* kvadrat → doira */
}

.belgi {
  padding: 4px 12px;
  border-radius: 999px; /* uzun tomonlari to‘liq yumaloq */
}
```

- `50%` — kvadrat elementni **doiraga** aylantiradi (to‘rtburchak bo‘lsa — ellipsga).
- Juda katta qiymat (`999px`) — “tabletka” shaklidagi yorliq va tugmalar uchun.

## Ellips burchaklar

`/` bilan gorizontal va vertikal radiuslar alohida beriladi:

```css
.tomchi {
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}
```

## Rasm bilan

```css
.profil-rasm {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover; /* rasm cho‘zilmasin */
}
```

## Xulosa

- `border-radius` burchaklarni yumaloqlaydi, chegarasiz ham ishlaydi.
- `50%` — doira, katta qiymat (`999px`) — tabletka shakli.
- To‘rt qiymat chap-yuqori burchakdan soat mili bo‘yicha.
