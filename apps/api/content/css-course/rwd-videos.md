## Moslashuvchan videolar

## `<video>` elementi

O‘z serveringizdagi video rasm kabi moslashtiriladi:

```css
video {
  max-width: 100%;
  height: auto;
}
```

Yoki to‘liq kenglikda, aniq nisbatda:

```css
video {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

## O‘rnatilgan videolar (`iframe`)

YouTube kabi xizmatlardan olingan video `<iframe>` orqali qo‘yiladi. Iframe’ning o‘zida nisbat yo‘q: unga `width="560" height="315"` atributlari yoziladi va u telefonda ekrandan chiqib ketadi.

Zamonaviy yechim — `aspect-ratio`:

```css
.video iframe {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 0;
}
```

Iframe har qanday kenglikda 16:9 nisbatini saqlaydi.

## Eski usul: padding hiylasi

`aspect-ratio` paydo bo‘lishidan oldin foizli padding ishlatilgan (foizli padding ota **kengligidan** hisoblanishini eslang):

```css
.video {
  position: relative;
  padding-top: 56.25%; /* 9 / 16 = 0.5625 */
}

.video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

Bu kodni eski loyihalarda uchratasiz. Yangi kodda `aspect-ratio` yetarli.

## Keng konteynerda chegaralash

Juda katta monitorda video ekran kengligida bo‘lsa, uni ko‘rish uchun boshni burish kerak bo‘ladi:

```css
.video {
  max-width: 960px;
  margin-inline: auto;
}
```

## Foydalanish qulayligi

- Avtomatik ijro (`autoplay`) faqat **ovozsiz** (`muted`) bo‘lsa brauzerlarda ishlaydi va baribir foydalanuvchini chalg‘itishi mumkin.
- Boshqaruv tugmalari (`controls`) bo‘lsin.
- Nutqli videolarga subtitr (`<track kind="captions">`) qo‘shing.
- `iframe` ga `title` bering: `<iframe title="CSS Grid bo‘yicha videodars" …>` — ekran o‘quvchi uni o‘qiydi.

> WEBDIZAYN.UZ sandbox’ida tashqi video va iframe’lar bloklangan. Mashqda video o‘rnini bo‘sh `iframe` egallaydi — muhimi CSS.

## Xulosa

- `<video>`: `max-width: 100%` yoki `width: 100%` + `aspect-ratio`.
- `iframe`: `width: 100%; height: auto; aspect-ratio: 16 / 9;`.
- `max-width` + `margin-inline: auto` — keng ekranda chegaralash.
- `controls`, subtitr va `title` — qulaylik uchun.
