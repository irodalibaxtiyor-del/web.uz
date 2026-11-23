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

```tekshir
Fon rasmi sahifa aylantirilganda ekranga mahkamlangandek turishi uchun qaysi qiymat?
- `scroll`
+ `fixed`
- `local`
> `fixed` fonni ko‘rish oynasiga mahkamlaydi (parallaks); mobil brauzerlarda ishlamasligi mumkin.
```

```jonli
<style>
  .box { height: 150px; overflow: auto; border: 1px solid #ccc;
        background: url(data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27200%27%20viewBox=%270%200%20300%20200%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%238e44ad%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ff7f50%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27200%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2760%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20200%20L0%20140%20L105%2090%20L180%20150%20L240%20120%20L300%20160%20L300%20200%20Z%27%20fill=%27%232c1b3a%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E) center / cover local; }
  .box p { height: 400px; margin: 0; padding: 10px; color: white; }
</style>
<div class="box"><p>Ichini aylantiring: local rejimida fon kontent bilan siljiydi.</p></div>
```

## Xulosa

- `scroll` — standart, fon element bilan siljiydi.
- `fixed` — fon ekranga mahkamlanadi (parallaks), mobil qurilmalarda ishlamasligi mumkin.
- `local` — aylantiriladigan blok ichida fon kontent bilan siljiydi.
