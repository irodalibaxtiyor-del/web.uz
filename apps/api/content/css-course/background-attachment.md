## Fon sahifa bilan siljiydimi?

`background-attachment` sahifa aylantirilganda (scroll) fon rasmining harakatini belgilaydi.

| Qiymat   | Natija                                                   |
| -------- | -------------------------------------------------------- |
| `scroll` | Fon element bilan birga siljiydi (standart)              |
| `fixed`  | Fon ekranga “yopishib” qoladi, kontent uning ustidan o‘tadi |
| `local`  | Fon elementning o‘z ichki aylantirishi bilan siljiydi    |

## `fixed` — parallaks effekti

```css
.parallaks {
  min-height: 400px;
  background-image: linear-gradient(135deg, #0071dc, #0e1133);
  background-attachment: fixed;
  background-size: cover;
}
```

Sahifani aylantirganda matn bloklari harakatlanadi, fon esa joyida turadi. Bu “chuqurlik” hissini beradi.

## `local` — aylantiriladigan blok ichida

Ichida aylantirish (`overflow: auto`) bo‘lgan blokda `local` fonni kontent bilan birga siljitadi:

```css
.royxat {
  height: 200px;
  overflow: auto;
  background-image: linear-gradient(white, #f5faff);
  background-attachment: local;
}
```

## Ehtiyot bo‘ling

- Ko‘p mobil brauzerlar `fixed` ni qo‘llab-quvvatlamaydi yoki `scroll` kabi ishlatadi.
- Katta `fixed` fon rasmlari kuchsiz qurilmalarda aylantirishni sekinlashtirishi mumkin.
- Ba’zi foydalanuvchilarda harakat effektlari bosh aylanishiga sabab bo‘ladi. Bunday effektlarni `prefers-reduced-motion` media so‘rovi bilan o‘chirish mumkin (media so‘rovlar keyingi modullarda):

```css
@media (prefers-reduced-motion: reduce) {
  .parallaks {
    background-attachment: scroll;
  }
}
```

## Xulosa

- `scroll` — standart, fon element bilan siljiydi.
- `fixed` — fon ekranga mahkamlanadi (parallaks), mobil qurilmalarda ishlamasligi mumkin.
- `local` — aylantiriladigan blok ichida fon kontent bilan siljiydi.
